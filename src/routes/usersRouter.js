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
  const rows = await auroraQuery('SELECT id, email, password, isProvider FROM users WHERE email = $1;', [email]);
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
    'INSERT INTO users (id, email, password, isProvider, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, isProvider;',
    [id, email, password, isProvider]
  );
  return rows[0];
}

/*
  Actualiza campos permitidos en Aurora:
  Solo se pueden editar: email, password, isProvider.
*/
async function updateUserInAurora(id, fields = {}) {
  const allowed = ['email', 'password', 'isProvider'];
  const sets = [];
  const params = [];
  let idx = 1;
  for (const [k, v] of Object.entries(fields)) {
    const key = k === 'isProvider' ? 'isProvider' : k;
    if (!allowed.includes(key)) continue;
    sets.push(`${key} = $${idx}`);
    params.push(v);
    idx++;
  }
  if (sets.length === 0) return null;
  params.push(id);
  const q = `UPDATE users SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING id, email, isProvider;`;
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

    return null;
  } catch (e) {
    throw e;
  }
}

/*
  Obtiene varios usuarios desde DynamoDB usando un arreglo de ids.
  Maneja automáticamente la diferencia entre tipo Number y String.
*/
async function getUsersBatchFromDynamo(ids) {
  try {
    if (!ids || ids.length === 0) return [];

    const keys = ids.map(id => {
      const n = asNumId(id);
      return n
        ? { id: { N: n } }
        : { id: { S: String(id) } };
    });

    const command = new ddb.BatchGetItemCommand({
      RequestItems: {
        [TABLE]: { Keys: keys }
      }
    });

    const response = await dynamoDB.send(command);
    const items = response.Responses?.[TABLE] || [];

    return items.map(item => unmarshall(item));

  } catch (err) {
    console.error("Error en getUsersBatchFromDynamo:", err);
    return [];
  }
}


/*  Ruta para obtener datos básicos de un usuario para el chat.
  Solo devuelve id, name y avatar.
*/
router.get('/basic/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserFromDynamo(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Solo mandamos lo que el chat necesita
    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name || user.fullName || "Usuario " + id,
        avatar: user.avatar || null
      }
    });

  } catch (err) {
    console.error("Error obteniendo usuario:", err);
    res.status(500).json({ success: false, message: "Error interno" });
  }
});

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
  Middleware para autenticar JWT desde Authorization header o cookie.
  - Verifica si viene el token en Authorization header o en cookies
  - Si es válido, deja pasar a la siguiente ruta
*/
function authenticateToken(req, res, next) {
  let token = null;
  
  // Intenta obtener token desde Authorization header
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    token = auth.slice(7);
  }
  
  // Si no está en header, intenta desde cookies
  if (!token && req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  }
  
  if (!token) return res.status(401).json({ success: false, error: 'Falta token' });
  
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
  Valida la sesión actual (verifica token en cookie o Authorization)
  - Devuelve { loggedIn: true/false, user: {...}, role: 'user'/'provider' }
*/
router.get('/checkSession', authenticateToken, async (req, res) => {
  try {
    const user = await getUserPasswordFromAurora(req.user.email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        loggedIn: false, 
        error: 'Usuario no encontrado' 
      });
    }
    
    res.json({ 
      success: true,
      loggedIn: true,
      user: { 
        id: user.id, 
        email: user.email, 
        isProvider: Boolean(user.isprovider) 
      },
      role: Boolean(user.isprovider) ? 'provider' : 'user'
    });
  } catch (err) {
    res.status(500).json({ success: false, loggedIn: false, error: err.message });
  }
});

/*
  Obtener perfil completo del usuario autenticado.
  Busca primero en DynamoDB, y si no está, devuelve datos básicos de Aurora.
*/
router.get('/profile/me', authenticateToken, async (req, res) => {
  try {
    const auroraUser = await getUserPasswordFromAurora(req.user.email);
    if (!auroraUser) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    // Intentar obtener perfil completo de DynamoDB
    let dynamoUser = null;
    try {
      dynamoUser = await getUserFromDynamo(auroraUser.id);
    } catch (e) {
      // Si no existe en DynamoDB, está bien, usamos solo datos de Aurora
    }

    const profileData = {
      id: auroraUser.id,
      email: auroraUser.email,
      isProvider: Boolean(auroraUser.isprovider),
      // Datos de DynamoDB si existen
      name: dynamoUser?.name || 'User',
      phone: dynamoUser?.phone || '',
      location: dynamoUser?.location || '',
      avatar: dynamoUser?.avatar || '',
      memberSince: dynamoUser?.memberSince || new Date().toISOString().split('T')[0],
      totalBookings: dynamoUser?.totalBookings || 0,
      totalSpent: dynamoUser?.totalSpent || 0
    };

    res.json({ 
      success: true, 
      data: profileData 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
  Autenticación (Login):
  - Verifica usuario en Aurora
  - Compara contraseña usando bcrypt
  - Si coincide, genera token JWT y lo envía en cookie httpOnly
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
    if (user.isprovider !== undefined) tokenPayload.isProvider = Boolean(user.isprovider);
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    
    // Enviar token en cookie httpOnly (segura, no accesible por JavaScript)
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // solo HTTPS en producción
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });
    
    // También devolver token en la respuesta por compatibilidad (el cliente puede no usarlo)
    res.json({ 
      success: true, 
      token, 
      user: { id: user.id, email: user.email, isProvider: Boolean(user.isprovider) } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
  Logout: limpia la cookie del token
*/
router.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ success: true, message: 'Sesión cerrada' });
});

/*
  Obtiene el detalle de un usuario.
  Primero intenta buscar en Dynamo (perfil completo).
  Si no lo encuentra, busca en Aurora (solo información básica).
*/
router.get('/detail/:id',/* authenticateToken,*/ async (req, res) => {
  const { id } = req.params;
  try {
    try {
      let user = await getUserFromDynamo(id);
      if (user) return res.json({success: true, data: user });
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

/*
  Búsqueda de proveedores por nombre.
  - Busca primero en Aurora los IDs de usuarios que son proveedores 
*/

router.get("/search", async (req, res) => {
  let client; 

  try {
    const q = (req.query.q || "").toLowerCase();
    if (q.length < 2) {
      return res.json({ success: true, results: [] });
    }

    client = await getConnection(); 

    // 1. Saco solo los IDs de proveedores desde Aurora
    const auroraResult = await client.query(`
      SELECT id
      FROM users
      WHERE isprovider = true
    `);

    const providerIds = auroraResult.rows.map(r => r.id);

    if (providerIds.length === 0) {
      client.release(); 
      return res.json({ success: true, results: [] });
    }

    // 2. Traigo info real desde Dynamo
    const dynamoUsers = await getUsersBatchFromDynamo(providerIds);

    // 3. Filtro por nombre (de Dynamo)
    const filtered = dynamoUsers.filter(u => {
      const name = (u.name || u.fullName || "").toLowerCase();
      return name.includes(q);
    });

    client.release(); 

    return res.json({
      success: true,
      results: filtered.map(u => ({
        id: u.id,
        name: u.name || u.fullName || `Usuario ${u.id}`,
        avatar: u.avatar || null,
        isProvider: true
      }))
    });

  } catch (error) {
    console.error("Error en /users/search:", error);

    if (client) client.release(); 

    return res.status(500).json({
      success: false,
      message: "Error interno en búsqueda"
    });
  }
});

module.exports = router;
