const express = require('express');
const router = express.Router();
const {addHistory, getAllRepairHistory, getRepairHistoryForMecanicien} = require('../controllers/RepairHistoryController');

router.post('/',addHistory);

router.get('/', getAllRepairHistory);

router.get('/mecanicien/:mecanicienId', getRepairHistoryForMecanicien)

module.exports = router;