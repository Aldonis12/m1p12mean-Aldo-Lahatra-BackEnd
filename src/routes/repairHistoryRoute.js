const express = require('express');
const router = express.Router();
const {addHistory, getAllRepairHistory, getRepairHistoryForMecanicien, findHistory} = require('../controllers/RepairHistoryController');
const authGuard = require('../middlewares/authGuard');

router.post('/', authGuard ,addHistory);

router.get('/', authGuard, getAllRepairHistory);

router.get('/:id', authGuard, findHistory);

router.get('/mecanicien/:mecanicienId', getRepairHistoryForMecanicien)

module.exports = router;