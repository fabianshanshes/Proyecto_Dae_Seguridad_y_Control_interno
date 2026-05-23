const express = require('express');
const cors = require('cors');
require('dotenv').config();

const accesoRoutes = require('./routes/Acceso.route.js');
const incidenciaRoutes = require('./routes/Incidencia.route.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', accesoRoutes);
app.use('/api', incidenciaRoutes);

app.use((err, req, res, next) => {
    console.error("🚨 Error interno:", err.message);
    res.status(err.status || 500).json({
        error: true,
        msg: err.message || 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Control Interno corriendo en http://localhost:${PORT}`);
});