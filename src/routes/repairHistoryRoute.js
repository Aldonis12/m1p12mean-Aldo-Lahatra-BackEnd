const express = require('express');
const router = express.Router();
const {addHistory, getAllRepairHistory, getRepairHistoryForMecanicien} = require('../controllers/RepairHistoryController');
const authGuard = require('../middlewares/authGuard');

router.post('/', authGuard ,addHistory);

router.get('/', authGuard, getAllRepairHistory);

router.get('/mecanicien/:mecanicienId', getRepairHistoryForMecanicien)

module.exports = router;