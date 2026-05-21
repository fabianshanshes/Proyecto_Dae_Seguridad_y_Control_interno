const express = require('express');
const router = express.Router();
import Acceso from '../controllers/Acceso.controller.js';

router.post('/requests', Acceso.controller.createRequest);      
router.get('/requests/pending', Acceso.controller.getPending); 
router.put('/requests/:id/review', Acceso.controller.reviewRequest); 
router.put('/requests/:id/check-in', Acceso.controller.checkIn);   
router.put('/requests/:id/check-out', Acceso.controller.checkOut); 
module.exports = router;