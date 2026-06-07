const ModeloAcceso = require('../models/Modelo_Acceso.js');

const getPending = async (req, res, next) => {
  try {
    const solicitudes = await ModeloAcceso.getPending();
    res.json(solicitudes);
  } catch (error) {
    next(error);
  }
};

const createRequest = async (req, res, next) => {
  try {
    const { solicitante, motivo, zona, fecha, hora_inicio, hora_fin } = req.body;
    
    // Simulación de la Excepción 1 del PMN: Validar campos obligatorios
    const estadoInicial = !zona ? "Observada" : "En revision";

    const nuevaSolicitud = await ModeloAcceso.create({
      solicitante,
      motivo,
      zona: zona || "No especificada",
      fecha,
      hora_inicio,
      hora_fin,
      estado: estadoInicial
    });

    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    next(error);
  }
};

const reviewRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, condiciones } = req.body;
    
    const actualizado = await ModeloAcceso.updateEstado(id, estado, condiciones ?? null);
    if (!actualizado) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }
    
    res.json({ msg: 'Estado de la solicitud actualizado correctamente' });
  } catch (error) {
    next(error);
  }
};

const checkIn = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { tieneCedulaFisica } = req.body;
        
        const solicitud = await ModeloAcceso.getById(id);
        if (!solicitud) return res.status(404).json({ msg: 'Solicitud no encontrada' });

        // Regla: Si no trae cédula, bloqueado (Excepción 3)
        if (!tieneCedulaFisica) {
            return res.status(403).json({ status: 'Bloqueado', motivo: 'Sin cédula física' });
        }

        // Regla: Si el estado no es Aprobada, no puede entrar
        if (solicitud.estado !== 'Aprobada') {
            return res.status(400).json({ status: 'Denegado', motivo: 'Acceso no autorizado por el sistema' });
        }

        // Todo OK, se cambia a 'En uso'
        await ModeloAcceso.updateEstado(id, 'En uso', undefined);
        res.json({ msg: 'Ingreso autorizado', solicitud: { ...solicitud, estado: 'En uso' } });
    } catch (error) {
        next(error);
    }
};

const checkOut = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actualizado = await ModeloAcceso.updateEstado(id, 'Finalizada', undefined);
    if (!actualizado) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }

    res.json({ msg: 'Salida registrada y solicitud finalizada' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getPending,
  reviewRequest,
  checkIn,
  checkOut
};
