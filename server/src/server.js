const express = require('express');
const cors = require('cors');

require('dotenv').config();

const accesoRoutes = require('./routes/Acceso.route.js');
const incidenciaRoutes = require('./routes/Incidencia.route.js');
const ModeloAcceso = require('./models/Modelo_Acceso.js');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'API de Control Interno activa'
    });
});

app.get('/health', (req, res) => {
    res.json({
        ok: true,
        status: 'up'
    });
});

app.use('/api', accesoRoutes);
app.use('/api', incidenciaRoutes);

app.use((err, req, res, next) => {
    console.error(" Error interno:", err.message);
    res.status(err.status || 500).json({
        error: true,
        msg: err.message || 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Servidor de Control Interno corriendo en http://localhost:${PORT}`);


    const INTERVALO_EXPIRACION_MS = 60 * 1000;
    setInterval(async () => {
        try {
            const expiradas = await ModeloAcceso.expireOverdue();
            if (expiradas > 0) {
                console.log(`Proceso de expiración: ${expiradas} solicitud(es) marcada(s) como 'Expirada sin uso'`);
            }
        } catch (err) {
            console.error(' Error en proceso de expiración:', err.message);
        }
    }, INTERVALO_EXPIRACION_MS);
});