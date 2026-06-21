const ModeloIncidencia = require('../models/Modelo_Incidencia.js');
const ModeloAcceso = require('../models/Modelo_Acceso.js');

const getAll = async (req, res, next) => {
  try {
    const incidencias = await ModeloIncidencia.getAll();
    res.json(incidencias);
  } catch (error) {
    next(error);
  }
};

const createIncident = async (req, res, next) => {
  try {
    const { solicitud_id, tipo_incidente, severidad, observaciones } = req.body;

    const solicitud = await ModeloAcceso.getById(solicitud_id);
    if (!solicitud) {
      return res.status(404).json({ msg: 'Solicitud no encontrada para registrar la incidencia' });
    }

    const incidencia = await ModeloIncidencia.create({
      solicitud_id,
      tipo_incidente,
      severidad,
      observaciones
    });

    await ModeloAcceso.updateEstado(solicitud_id, 'Finalizada con incidencia', undefined);

    res.status(201).json({
      msg: 'Incidencia registrada en el sistema',
      incidencia
    });
  } catch (error) {
    next(error);
  }
};

const escalate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const incidencia = await ModeloIncidencia.getById(id);
    if (!incidencia) {
      return res.status(404).json({ msg: 'Incidencia no encontrada' });
    }

    const actualizado = await ModeloIncidencia.updateEstado(id, 'Registrada');
    if (!actualizado) {
      return res.status(500).json({ msg: 'No se pudo actualizar la incidencia' });
    }

    res.json({ msg: 'Incidencia escalada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  createIncident,
  escalate
};