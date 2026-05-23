const db = require('../config/db');

const getAll = async (req, res, next) => {
  try {
    const [incidencias] = await db.query('SELECT * FROM incidencias ORDER BY registrado_en DESC');
    res.json(incidencias);
  } catch (error) {
    next(error);
  }
};

const createIncident = async (req, res, next) => {
  try {
    const { solicitud_id, tipo_incidente, severidad } = req.body;
    
    // Insertamos la alerta de seguridad en la base de datos
    const [result] = await db.query(
      'INSERT INTO incidencias (solicitud_id, tipo_incidente, severidad) VALUES (?, ?, ?)',
      [solicitud_id, tipo_incidente, severidad || 'Media']
    );
    
    // Opcional: Actualizamos el estado de la solicitud a "Con incidencia"
    await db.query('UPDATE solicitudes SET estado = ? WHERE id = ?', ['Finalizada con incidencia', solicitud_id]);

    res.status(201).json({ msg: 'Incidencia registrada en el sistema', id: result.insertId });
  } catch (error) {
    next(error);
  }
};

const escalate = async (req, res, next) => {
  res.json({ msg: 'Endpoint para escalar incidencias pendiente de implementación' });
};

module.exports = {
  getAll,
  createIncident,
  escalate
};