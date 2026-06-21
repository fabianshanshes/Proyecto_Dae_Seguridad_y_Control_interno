const db = require('../config/db');

async function getAll() {
  const [rows] = await db.query('SELECT * FROM incidencias ORDER BY registrado_en DESC');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM incidencias WHERE id = ?', [id]);
  return rows[0];
}

async function create(incidencia) {
  const { solicitud_id, tipo_incidente, severidad = 'Media', observaciones = null } = incidencia;
  const [result] = await db.query(
    'INSERT INTO incidencias (solicitud_id, tipo_incidente, severidad, observaciones) VALUES (?, ?, ?, ?)',
    [solicitud_id, tipo_incidente, severidad, observaciones]
  );

  return {
    id: result.insertId,
    solicitud_id,
    tipo_incidente,
    severidad,
    observaciones,
    estado: 'Detectada'
  };
}

async function updateEstado(id, estado) {
  const [result] = await db.query(
    'UPDATE incidencias SET estado = ? WHERE id = ?',
    [estado, id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  getAll,
  getById,
  create,
  updateEstado
};