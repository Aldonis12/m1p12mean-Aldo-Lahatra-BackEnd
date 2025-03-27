const express = require('express');
const { mecanicienPerformance } = require('../controllers/DashboardController');
const router = express.Router();

router.get('/mecanicien-performance', mecanicienPerformance);

module.exports = router;