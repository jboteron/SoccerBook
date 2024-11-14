const pool = require('../config/db'); // conexión a la base de datos
const bcrypt = require('bcryptjs'); // para cifrar contraseñas
const { validationResult } = require('express-validator'); // validación de datos de entrada
const multer = require('multer');

// Configuración de almacenamiento en memoria con multer
const storage = multer.memoryStorage(); // O puedes usar `diskStorage()` si prefieres guardar en disco
const upload = multer({ storage });

// Función para obtener el dashboard del administrador
exports.getDashboard = async (req, res) => {
    res.status(200).json({ message: 'Bienvenido al dashboard del administrador' });
};

// Crear cancha
exports.createCancha = async (req, res) => {
    const { nombre, direccion, cliente_id, disponibilidad } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO canchas (nombre, direccion, cliente_id, disponibilidad) VALUES (?, ?, ?, ?)',
            [nombre, direccion, cliente_id, disponibilidad]
        );
        res.status(201).json({ message: 'Cancha creada', canchaId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la cancha' });
    }
};

// Leer canchas
exports.getCanchas = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM canchas');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener canchas' });
    }
};

// Actualizar cancha
exports.updateCancha = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, cliente_id, disponibilidad } = req.body;
    try {
        await pool.query(
            'UPDATE canchas SET nombre = ?, direccion = ?, cliente_id = ?, disponibilidad = ? WHERE id = ?',
            [nombre, direccion, cliente_id, disponibilidad, id]
        );
        res.status(200).json({ message: 'Cancha actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la cancha' });
    }
};

// Eliminar cancha
exports.deleteCancha = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM canchas WHERE id = ?', [id]);
        res.status(200).json({ message: 'Cancha eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la cancha' });
    }
};

// Crear cliente
exports.createCliente = async (req, res) => {
    const { nombre, direccion, telefono, correo, imagen } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, direccion, telefono, correo, imagen) VALUES (?, ?, ?, ?, ?)',
            [nombre, direccion, telefono, correo, imagen]
        );
        res.status(201).json({ message: 'Cliente creado', clienteId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el cliente' });
    }
};

// Leer clientes
exports.getClientes = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM clientes');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
};

// Actualizar cliente
exports.updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono, correo, imagen } = req.body;
    try {
        await pool.query(
            'UPDATE clientes SET nombre = ?, direccion = ?, telefono = ?, correo = ?, imagen = ? WHERE id = ?',
            [nombre, direccion, telefono, correo, imagen, id]
        );
        res.status(200).json({ message: 'Cliente actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
};

// Eliminar cliente
exports.deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
        res.status(200).json({ message: 'Cliente eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
};

// Crear pregunta
exports.createPregunta = async (req, res) => {
    const { nombre, correo, mensaje } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO preguntas (nombre, correo, mensaje) VALUES (?, ?, ?)',
            [nombre, correo, mensaje]
        );
        res.status(201).json({ message: 'Pregunta creada', preguntaId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la pregunta' });
    }
};

// Leer preguntas
exports.getPreguntas = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM preguntas');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener preguntas' });
    }
};

// Eliminar pregunta
exports.deletePregunta = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM preguntas WHERE id = ?', [id]);
        res.status(200).json({ message: 'Pregunta eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la pregunta' });
    }
};

// Crear reserva
exports.createReserva = async (req, res) => {
    const { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO reservas (cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente) VALUES (?, ?, ?, ?, ?)',
            [cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente]
        );
        res.status(201).json({ message: 'Reserva creada', reservaId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
};

// Leer reservas
exports.getReservas = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM reservas');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
};

// Actualizar reserva
exports.updateReserva = async (req, res) => {
    const { id } = req.params;
    const { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente } = req.body;
    try {
        await pool.query(
            'UPDATE reservas SET cancha_id = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, nombre_cliente = ? WHERE id = ?',
            [cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente, id]
        );
        res.status(200).json({ message: 'Reserva actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
};

// Eliminar reserva
exports.deleteReserva = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM reservas WHERE id = ?', [id]);
        res.status(200).json({ message: 'Reserva eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
};

// Crear usuario
exports.createUsuario = [upload.single('foto'), async (req, res) => {
    const { nombre, correo, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const foto = req.file ? req.file.buffer : null; // Si se sube una foto, se almacena en `foto`
    
    try {
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, correo, password, role, foto) VALUES (?, ?, ?, ?, ?)',
            [nombre, correo, hashedPassword, role, foto]
        );
        res.status(201).json({ message: 'Usuario creado', usuarioId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
}];

// Leer usuarios
exports.getUsuarios = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM usuarios');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Actualizar usuario
exports.updateUsuario = [upload.single('foto'), async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const foto = req.file ? req.file.buffer : null; // Si se sube una nueva foto, se almacena en `foto`
    
    try {
        await pool.query(
            'UPDATE usuarios SET nombre = ?, correo = ?, password = ?, role = ?, foto = ? WHERE id = ?',
            [nombre, correo, hashedPassword, role, foto, id]
        );
        res.status(200).json({ message: 'Usuario actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
}];

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};
