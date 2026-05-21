// backend/src/routes/incidentRoutes.js
const express = require('express');
const router = express.Router();
import incidentController from '../controllers/Incidencia.controller.js';

router.get('/incidents', incidentController.getAll);            // SOC visualiza todas [cite: 45]
router.post('/incidents', incidentController.createIncident);   // SOC o Sistema registra [cite: 46, 152]
router.put('/incidents/:id/escalate', incidentController.escalate); // SOC escala [cite: 48, 127]

module.exports = router;