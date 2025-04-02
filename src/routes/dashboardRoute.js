const express = require('express');
const { mecanicienPerformance, totalIncome, incomeService, totalIncomeByMonthThisYear , getCountUser, getMecanicienDispoNow, getCountClientPerMonth, getCountRendezVousPerMonth} = require('../controllers/DashboardController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');
const router = express.Router();

router.get('/mecanicien-perfomance', authGuard, roleGuard(['Manager']) ,  mecanicienPerformance);
router.get('/count-user', getCountUser);
router.get('/mecanicien-dispo', getMecanicienDispoNow);
router.get('/count-client', getCountClientPerMonth);
router.get('/count-rdv', getCountRendezVousPerMonth);
router.get('/total-income', authGuard, roleGuard(['Manager']) ,totalIncome);
router.get('/service-income', authGuard, roleGuard(['Manager']) ,incomeService);
router.get('/total-income-year', authGuard, roleGuard(['Manager']) ,totalIncomeByMonthThisYear);

module.exports = router;