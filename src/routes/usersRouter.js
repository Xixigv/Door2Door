const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { getConnection, initPool } = require('../data/auroraClient.js');
const dynamoDB = require('../data/dynamoClient.js');
const ddb = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

require('dotenv').config();

const router = express.Router();

// Clave secreta y tiempo de expiración del token JWT sacados de variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

/*
  Función auxiliar para ejecutar queries en Aurora.
  - Solicita un cliente de la pool de conexiones
  - Ejecuta la consulta
  - Asegura que el cliente se libere al finalizar la operación.
*/
async function auroraQuery(text, params = []) {
  const client = await getConnection();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    try { client.release(); } catch (e) { /* ignorar error al liberar */ }
  }
}

/*
  Obtiene un usuario desde Aurora usando su email,
  incluyendo el hash de contraseña para verificación.
*/
async function getUserPasswordFromAurora(email) {
  const rows = await auroraQuery('SELECT id, email, password, is_provider FROM users WHERE email = $1;', [email]);
  return rows[0] || null;
}

/*
  Crea un usuario mínimo en Aurora.
  Aquí solo se almacena:
  - id compartido
  - email
  - contraseña hash
  - si es proveedor o no
*/
async function createUserInAurora({ id, email, password, isProvider = false }) {
  const rows = await auroraQuery(
    'INSERT INTO users (id, email, password, is_provider, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, is_provider;',
    [id, email, password, isProvider]
  );
  return rows[0];
}

/*
  Actualiza campos permitidos en Aurora:
  Solo se pueden editar: email, password, is_provider.
*/
async function updateUserInAurora(id, fields = {}) {
  const allowed = ['email', 'password', 'is_provider'];
  const sets = [];
  const params = [];
  let idx = 1;
  for (const [k, v] of Object.entries(fields)) {
    const key = k === 'isProvider' ? 'is_provider' : k;
    if (!allowed.includes(key)) continue;
    sets.push(`${key} = $${idx}`);
    params.push(v);
    idx++;
  }
  if (sets.length === 0) return null;
  params.push(id);
  const q = `UPDATE users SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING id, email, is_provider;`;
  const rows = await auroraQuery(q, params);
  return rows[0] || null;
}

/*
  Elimina un usuario de Aurora usando su id.
*/
async function deleteUserInAurora(id) {
  const rows = await auroraQuery('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);
  return rows[0] || null;
}

// Nombre de la tabla Dynamo donde se guardan los perfiles completos
const TABLE = process.env.DYNAMO_USERS_TABLE || 'Users';

// Intenta interpretar el id como número para usar (N) o como string para (S)
function asNumId(id) { const n = Number(id); return Number.isFinite(n) ? String(n) : null; }

/*
  Obtiene un usuario desde DynamoDB usando su id.
  Maneja automáticamente la diferencia entre tipo Number y String.
*/
async function getUserFromDynamo(id) {
  try {
    let key = null;
    const n = asNumId(id);
    if (n) key = { id: { N: n } };
    else key = { id: { S: String(id) } };

    const data = await dynamoDB.send(new ddb.GetItemCommand({ TableName: TABLE, Key: key }));
    if (data && data.Item) return unmarshall(data.Item);

    // Si originalmente se intentó como número, intenta como string
    if (n) {
      const data2 = await dynamoDB.send(new ddb.GetItemCommand({ TableName: TABLE, Key: { id: { S: String(id) } } }));
      if (data2 && data2.Item) return unmarshall(data2.Item);
    }
    return null;
  } catch (e) {
    throw e;
  }
}

/*
  Crea un registro de usuario en DynamoDB.
  Aquí se guarda la información de perfil completa,
  pero NO la contraseña (esa se guarda solamente en Aurora).
*/
async function createUserInDynamo({ id, profile }) {
  const resolvedId = id || Date.now();
  const p = profile || {};
  const item = {
    id: { N: String(resolvedId) },
    name: { S: String(p.name || '') },
    email: { S: String(p.email || '') },
    phone: { S: String(p.phone || '') },
    location: { S: String(p.location || '') },
    avatar: { S: String(p.avatar || '') },
    memberSince: { S: String(p.memberSince || '') },
    totalBookings: { N: String(p.totalBookings || 0) },
    totalSpent: { N: String(p.totalSpent || 0) }
  };
  await dynamoDB.send(new ddb.PutItemCommand({ TableName: TABLE, Item: item, ConditionExpression: 'attribute_not_exists(id)' }));
  return unmarshall(item);
}

/*
  Actualiza un perfil dentro de DynamoDB.
  Solo se actualizan los campos que formen parte del perfil.
*/
async function updateUserInDynamo(id, fields = {}) {
  const names = {}, values = {}, set = [];
  const add = (k, v, isNum = false) => { names['#'+k]=k; values[':'+k]=isNum?{N:String(v)}:{S:String(v)}; set.push(`#${k}=:${k}`); };

  if (fields.name !== undefined) add('name', fields.name);
  if (fields.email !== undefined) add('email', fields.email);
  if (fields.phone !== undefined) add('phone', fields.phone);
  if (fields.location !== undefined) add('location', fields.location);
  if (fields.avatar !== undefined) add('avatar', fields.avatar);
  if (fields.memberSince !== undefined) add('memberSince', fields.memberSince);
  if (fields.totalBookings !== undefined) add('totalBookings', fields.totalBookings, true);
  if (fields.totalSpent !== undefined) add('totalSpent', fields.totalSpent, true);

  if (set.length === 0) return null;

  const n = asNumId(id);
  const key = n ? { id: { N: n } } : { id: { S: String(id) } };

  const r = await dynamoDB.send(new ddb.UpdateItemCommand({
    TableName: TABLE,
    Key: key,
    UpdateExpression: 'SET ' + set.join(','),
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: 'ALL_NEW'
  }));
  return unmarshall(r.Attributes || {});
}

/*
  Elimina un registro de usuario en DynamoDB.
*/
async function deleteUserInDynamo(id) {
  const n = asNumId(id);
  try {
    if (n) {
      await dynamoDB.send(new ddb.DeleteItemCommand({ TableName: TABLE, Key: { id: { N: n } } }));
      return { id: n };
    }
    await dynamoDB.send(new ddb.DeleteItemCommand({ TableName: TABLE, Key: { id: { S: String(id) } } }));
    return { id: String(id) };
  } catch (e) {
    throw e;
  }
}

/*
  Middleware para autenticar JWT. (Luego lo podemos cambiar a su propio módulo)
  - Verifica si viene el token en Authorization
  - Si es válido, deja pasar a la siguiente ruta
*/
function authenticateToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'Falta token' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }
}

/*
  Ruta básica de prueba para ver si Aurora está respondiendo correctamente.
*/
router.get('/', async (req, res) => {
  try {
    const client = await getConnection();
    try {
      const result = await client.query('SELECT NOW() as timestamp, version();');
      res.json({ success: true, data: result.rows });
    } finally {
      try { client.release(); } catch (e) { }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/*
  Autenticación (Login):
  - Verifica usuario en Aurora
  - Compara contraseña usando bcrypt
  - Si coincide, genera token JWT
*/
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ success: false, error: 'email y password requeridos' });
  try {
    const user = await getUserPasswordFromAurora(email);
    if (!user) return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    const match = await bcrypt.compare(password, user.password || '');
    if (!match) return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    const tokenPayload = { id: user.id, email: user.email };
    if (user.is_provider !== undefined) tokenPayload.isProvider = Boolean(user.is_provider);
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ success: true, token, user: { id: user.id, email: user.email, isProvider: Boolean(user.is_provider) } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
  Obtiene el detalle de un usuario.
  Primero intenta buscar en Dynamo (perfil completo).
  Si no lo encuentra, busca en Aurora (solo información básica).
*/
router.get('/detail/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    try {
      const user = await getUserFromDynamo(id);
      if (user) return res.json({ success: true, data: user });
    } catch (e) {}

    const rows = await auroraQuery('SELECT id, name, email FROM users WHERE id = $1;', [id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
  Para uso administrativo:
  Permite ver el hash de la contraseña guardada en Aurora.
  Solo accesible si el token tiene isAdmin = true.
*/
router.get('/aurora/password/:email', authenticateToken, async (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ success: false, error: 'Requiere permisos de administrador' });
  const { email } = req.params;
  try {
    const user = await getUserPasswordFromAurora(email);
    if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    res.json({ success: true, data: { id: user.id, email: user.email, passwordHash: user.password } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
  Crear usuario:
  - Genera un id compartido
  - Crea el usuario en Aurora (credenciales)
  - Crea perfil en DynamoDB (datos adicionales)
*/
router.post('/', async (req, res) => {
  const { name, email, password, phone, location, avatar, memberSince, totalBookings, totalSpent, isProvider } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ success: false, error: 'name, email y password son requeridos' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const created = {};
    const id = Date.now();

    try {
      const auroraUser = await createUserInAurora({ id, email, password: hashed, isProvider: Boolean(isProvider) });
      created.aurora = auroraUser;
    } catch (e) {
      created.auroraError = e.message;
    }

    try {
      const dynamoUser = await createUserInDynamo({ id, profile: { name, email, phone, location, avatar, memberSince, totalBookings, totalSpent } });
      created.dynamo = dynamoUser;
    } catch (e) {
      created.dynamoError = e.message;
    }

    res.status(201).json({ success: true, created, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
  Actualizar usuario:
  - Si se incluye password, se vuelve a hashear
  - Se puede indicar ?source=aurora para actualizar solo la tabla Aurora
  - Si no, intenta actualizar en Dynamo y si falla, en Aurora
*/
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const source = (req.query.source || '').toLowerCase();
  const fields = { ...req.body };
  if (fields.password) {
    fields.password = await bcrypt.hash(fields.password, 10);
  }
  try {
    if (source === 'aurora') {
      const updated = await updateUserInAurora(id, fields);
      if (!updated) return res.status(404).json({ success: false, error: 'No encontrado en Aurora' });
      return res.json({ success: true, data: updated });
    }

    try {
      const updated = await updateUserInDynamo(id, fields);
      if (!updated) return res.status(404).json({ success: false, error: 'No encontrado en Dynamo' });
      return res.json({ success: true, data: updated });
    } catch (e) {}

    const updated = await updateUserInAurora(id, fields);
    if (!updated) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
  Eliminar usuario:
  - Intenta eliminar tanto en Aurora como en Dynamo
  - Si falla en alguno, se reporta pero se intenta continuar.
*/
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const results = {};
  try {
    try {
      const delA = await deleteUserInAurora(id);
      results.aurora = delA || null;
    } catch (e) { results.auroraError = e.message; }

    try {
      const delD = await deleteUserInDynamo(id);
      results.dynamo = delD || null;
    } catch (e) { results.dynamoError = e.message; }

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
