const express = require('express');
const { mecanicienPerformance, totalIncome, incomeService, totalIncomeByMonthThisYear , getCountUser, getMecanicienDispoNow, getCountClientPerMonth, getCountRendezVousPerMonth} = require('../controllers/DashboardController');
const router = express.Router();

router.get('/mecanicien-perfomance', mecanicienPerformance);
router.get('/count-user', getCountUser);
router.get('/mecanicien-dispo', getMecanicienDispoNow);
router.get('/count-client', getCountClientPerMonth);
router.get('/count-rdv', getCountRendezVousPerMonth);
router.get('/mecanicien-performance', mecanicienPerformance);
router.get('/total-income', totalIncome);
router.get('/service-income', incomeService);
router.get('/total-income-year', totalIncomeByMonthThisYear);

module.exports = router;