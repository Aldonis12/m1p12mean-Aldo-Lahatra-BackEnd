const express = require('express');
const { getVenteService } = require('../controllers/FactureController');
const router = express.Router();

router.get('/', getVenteService);

module.exports = router;