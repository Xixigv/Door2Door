// Obtener todos los usuarios
async function getAllUsers() {
  try {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM users;');
    return result.rows;
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    throw error;
  }
}

// Obtener usuario por ID
async function getUserById(userId) {
  try {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM users WHERE id = $1;', [userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error en getUserById:', error);
    throw error;
  }
}

// Crear usuario
async function createUser(name, email) {
  try {
    const pool = await getPool();
    const result = await pool.query(
      'INSERT INTO users (name, email, created_at) VALUES ($1, $2, NOW()) RETURNING *;',
      [name, email]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error en createUser:', error);
    throw error;
  }
}

// Actualizar usuario
async function updateUser(userId, name, email) {
  try {
    const pool = await getPool();
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING *;',
      [name, email, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error en updateUser:', error);
    throw error;
  }
}

// Eliminar usuario
async function deleteUser(userId) {
  try {
    const pool = await getPool();
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error en deleteUser:', error);
    throw error;
  }
}

// Ejecutar query personalizada
async function executeQuery(query, params = []) {
  try {
    const pool = await getPool();
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw error;
  }
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, executeQuery };
