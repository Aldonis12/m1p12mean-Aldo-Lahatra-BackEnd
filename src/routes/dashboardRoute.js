const express = require('express');
const { mecanicienPerformance } = require('../controllers/DashboardController');
const router = express.Router();

router.get('/mecanicien-perfomance', mecanicienPerformance);

module.exports = router;