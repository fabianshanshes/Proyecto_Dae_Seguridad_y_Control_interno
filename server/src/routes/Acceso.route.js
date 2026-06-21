const express = require('express');
const router = express.Router();
const AccesoController = require('../controllers/Acceso.controller.js');

router.post('/requests', AccesoController.createRequest);

router.get('/requests/pending', AccesoController.getPending);

router.get('/requests/active', AccesoController.getActive);

router.get('/requests/mine', AccesoController.getMine);

router.put('/requests/:id/review', AccesoController.reviewRequest);

router.put('/requests/:id/check-in', AccesoController.checkIn);

router.put('/requests/:id/check-out', AccesoController.checkOut);

router.post('/requests/expire', AccesoController.runExpiration);

module.exports = router;