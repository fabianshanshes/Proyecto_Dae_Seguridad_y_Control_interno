const express = require('express');
const router = express.Router();
const IncidenciaController = require('../controllers/Incidencia.controller.js');

router.get('/incidents', IncidenciaController.getAll);

router.post('/incidents', IncidenciaController.createIncident);

router.put('/incidents/:id/escalate', IncidenciaController.escalate);

module.exports = router;