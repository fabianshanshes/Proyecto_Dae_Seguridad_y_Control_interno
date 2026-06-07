const db = require('../config/db');

async function getAll() {
  const [rows] = await db.query('SELECT * FROM solicitudes ORDER BY creado_en DESC');
  return rows;
}

async function getPending() {
  const [rows] = await db.query(
    'SELECT * FROM solicitudes WHERE estado IN (?, ?, ?, ?) ORDER BY creado_en DESC',
    ['En revision', 'Observada', 'Aprobada', 'En uso'] 
  );
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM solicitudes WHERE id = ?', [id]);
  return rows[0];
}

async function create(solicitud) {
  const { solicitante, motivo, zona, fecha, hora_inicio, hora_fin, estado } = solicitud;
  const [result] = await db.query(
    `INSERT INTO solicitudes (solicitante, motivo, zona, fecha, hora_inicio, hora_fin, estado) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [solicitante, motivo, zona, fecha, hora_inicio, hora_fin, estado]
  );
  return { id: result.insertId, ...solicitud };
}

async function updateEstado(id, estado, condiciones = null) {
  let result;

  if (condiciones === undefined) {
    [result] = await db.query(
      'UPDATE solicitudes SET estado = ? WHERE id = ?',
      [estado, id]
    );
  } else {
    [result] = await db.query(
      'UPDATE solicitudes SET estado = ?, condiciones = ? WHERE id = ?',
      [estado, condiciones, id]
    );
  }

  return result.affectedRows > 0;
}

module.exports = {
  getAll,
  getPending,
  getById,
  create,
  updateEstado
};
