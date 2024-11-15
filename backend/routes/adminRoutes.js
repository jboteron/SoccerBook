const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware para verificar el rol de administrador
const checkAdminRole = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Acceso denegado' });
    }
};

// Ruta de acceso al dashboard del administrador
router.get('/dashboard', checkAdminRole, adminController.getDashboard);

// ======================== Rutas para Canchas ========================

// Crear una cancha
router.post('/canchas', checkAdminRole, adminController.createCancha);

// Obtener todas las canchas
router.get('/canchas', checkAdminRole, adminController.getCanchas);

// Actualizar una cancha por ID
router.put('/canchas/:id', checkAdminRole, adminController.updateCancha);

// Eliminar una cancha por ID
router.delete('/canchas/:id', checkAdminRole, adminController.deleteCancha);

// ======================== Rutas para Clientes ========================

// Crear cliente con imagen en binario
router.post('/clientes', checkAdminRole, adminController.upload.single('imagen'), adminController.createCliente);

// Obtener imagen de cliente por ID
router.get('/clientes/:id/imagen', checkAdminRole, adminController.getClienteImagen);

// Actualizar cliente con imagen en binario
router.put('/clientes/:id', checkAdminRole, adminController.upload.single('imagen'), adminController.updateCliente);

// Eliminar cliente por ID
router.delete('/clientes/:id', checkAdminRole, adminController.deleteCliente);

// ======================== Rutas para Preguntas ========================

// Crear una pregunta
router.post('/preguntas', adminController.createPregunta);

// Obtener todas las preguntas
router.get('/preguntas', adminController.getPreguntas);

// Eliminar una pregunta por ID
router.delete('/preguntas/:id', checkAdminRole, adminController.deletePregunta);

// ======================== Rutas para Reservas ========================

// Crear una reserva
router.post('/reservas', adminController.createReserva);

// Obtener todas las reservas
router.get('/reservas', adminController.getReservas);

// Actualizar una reserva por ID
router.put('/reservas/:id', checkAdminRole, adminController.updateReserva);

// Eliminar una reserva por ID
router.delete('/reservas/:id', checkAdminRole, adminController.deleteReserva);

// ======================== Rutas para Usuarios ========================

// Crear usuario con imagen en binario
router.post('/usuarios', checkAdminRole, adminController.upload.single('foto'), adminController.createUsuario);

// Actualizar usuario con imagen en binario
router.put('/usuarios/:id', checkAdminRole, adminController.upload.single('foto'), adminController.updateUsuario);

// Eliminar usuario por ID
router.delete('/usuarios/:id', checkAdminRole, adminController.deleteUsuario);

module.exports = router;
