// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();


const {
    createUsuario,
    getUsuarios,
    updateUsuario,
    deleteUsuario,
    createCancha,
    getCanchas,
    updateCancha,
    deleteCancha,
    createCliente,
    getClientes,
    updateCliente,
    deleteCliente,
    createPregunta,
    getPreguntas,
    deletePregunta,
    createReserva,
    getReservas,
    updateReserva,
    deleteReserva,
    getDashboard
} = require('../controllers/adminController');

// Rutas para el dashboard
router.get('/dashboard', getDashboard);

// Rutas para los usuarios
router.post('/usuarios', createUsuario);
router.get('/usuarios', getUsuarios);
router.put('/usuarios/:id', updateUsuario);
router.delete('/usuarios/:id', deleteUsuario);

// Rutas para las canchas
router.post('/canchas', createCancha);
router.get('/canchas', getCanchas);
router.put('/canchas/:id', updateCancha);
router.delete('/canchas/:id', deleteCancha);

// Rutas para los clientes
router.post('/clientes', createCliente);
router.get('/clientes', getClientes);
router.put('/clientes/:id', updateCliente);
router.delete('/clientes/:id', deleteCliente);

// Rutas para las preguntas
router.post('/preguntas', createPregunta);
router.get('/preguntas', getPreguntas);
router.delete('/preguntas/:id', deletePregunta);

// Rutas para las reservas
router.post('/reservas', createReserva);
router.get('/reservas', getReservas);
router.put('/reservas/:id', updateReserva);
router.delete('/reservas/:id', deleteReserva);

module.exports = router;
