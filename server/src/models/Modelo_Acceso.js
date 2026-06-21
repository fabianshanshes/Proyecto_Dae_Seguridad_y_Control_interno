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

async function getByStatus(estado) {
  const [rows] = await db.query(
    'SELECT * FROM solicitudes WHERE estado = ? ORDER BY creado_en DESC',
    [estado]
  );
  return rows;
}

async function getBySolicitante(solicitante) {
  const [rows] = await db.query(
    'SELECT * FROM solicitudes WHERE solicitante = ? ORDER BY creado_en DESC',
    [solicitante]
  );
  return rows;
}

// Excepción 2 (proceso aparte, NO dentro del check-in):
// Marca como 'Expirada sin uso' toda solicitud 'Aprobada' cuya fecha + hora_fin ya pasó
// y que nunca llegó a usarse (el técnico nunca hizo check-in).
async function expireOverdue() {
  const [result] = await db.query(
    `UPDATE solicitudes
     SET estado = 'Expirada sin uso'
     WHERE estado = 'Aprobada'
       AND TIMESTAMP(fecha, hora_fin) < NOW()`
  );
  return result.affectedRows;
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
  getByStatus,
  getBySolicitante,
  create,
  updateEstado,
  expireOverdue
};