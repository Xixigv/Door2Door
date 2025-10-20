const express = require('express');

const { getConnection, initPool} = require('../data/auroraClient.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.query('SELECT NOW() as timestamp, version();');

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obtener todos los usuarios
// router.get('/', async (req, res) => {
//   try {
//     const users = await getAllUsers();
//     res.json({ success: true, data: users });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // GET - Obtener usuario por ID
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await getUserById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
//     }
//     res.json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // POST - Crear usuario
// router.post('/', async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     if (!name || !email) {
//       return res.status(400).json({ success: false, error: 'Nombre y email requeridos' });
//     }
//     const user = await createUser(name, email);
//     res.status(201).json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // PUT - Actualizar usuario
// router.put('/:id', async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     const user = await updateUser(req.params.id, name, email);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
//     }
//     res.json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // DELETE - Eliminar usuario
// router.delete('/:id', async (req, res) => {
//   try {
//     const user = await deleteUser(req.params.id);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
//     }
//     res.json({ success: true, message: 'Usuario eliminado', data: user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

module.exports = router;