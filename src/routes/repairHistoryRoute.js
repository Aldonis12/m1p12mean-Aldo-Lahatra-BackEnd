const express = require('express');
const router = express.Router();
const {addHistory, getAllRepairHistory} = require('../controllers/RepairHistoryController');

router.post('/',addHistory);

router.get('/', getAllRepairHistory);

module.exports = router;