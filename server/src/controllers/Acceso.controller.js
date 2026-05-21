exports.checkIn = async (req, res) => {
    const { id } = req.params;
    const { tieneCedulaFisica, horaActual } = req.body;
    const solicitud = obtenerSolicitudPorId(id);

    if (horaActual > solicitud.horaFin) {
        return res.status(400).json({ 
            status: 'Negado', 
            motivo: 'Autorización vencida'
        });
    }

    if (!tieneCedulaFisica) {
        return res.status(403).json({ 
            status: 'Bloqueado', 
            motivo: 'Identidad no verificada con documento físico' 
        });
    }

    solicitud.estado = 'En uso'; 
    res.json({ msg: 'Ingreso autorizado con éxito', solicitud });
};