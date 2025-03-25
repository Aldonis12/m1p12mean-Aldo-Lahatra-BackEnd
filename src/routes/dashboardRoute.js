const express = require('express');
const { mecanicienPerformance, getCountUser, getMecanicienDispoNow, getCountClientPerMonth, getCountRendezVousPerMonth } = require('../controllers/DashboardController');
const router = express.Router();

router.get('/mecanicien-perfomance', mecanicienPerformance);
router.get('/count-user', getCountUser);
router.get('/mecanicien-dispo', getMecanicienDispoNow);
router.get('/count-client', getCountClientPerMonth);
router.get('/count-rdv', getCountRendezVousPerMonth);

module.exports = router;