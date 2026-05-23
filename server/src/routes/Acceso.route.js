const express = require('express');
const router = express.Router();
const AccesoController = require('../controllers/Acceso.controller.js');

router.post('/requests', AccesoController.createRequest);

router.get('/requests/pending', AccesoController.getPending);

router.put('/requests/:id/review', AccesoController.reviewRequest);

router.put('/requests/:id/check-in', AccesoController.checkIn);

router.put('/requests/:id/check-out', AccesoController.checkOut);

module.exports = router;