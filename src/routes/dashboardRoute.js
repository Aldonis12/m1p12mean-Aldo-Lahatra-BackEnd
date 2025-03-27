const express = require('express');
const { mecanicienPerformance, totalIncome, incomeService, totalIncomeByMonthThisYear } = require('../controllers/DashboardController');
const router = express.Router();

router.get('/mecanicien-performance', mecanicienPerformance);
router.get('/total-income', totalIncome);
router.get('/service-income', incomeService);
router.get('/total-income-year', totalIncomeByMonthThisYear);

module.exports = router;