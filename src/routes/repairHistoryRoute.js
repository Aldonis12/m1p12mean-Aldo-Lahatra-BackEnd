const express = require('express');
const router = express.Router();
const {addHistory, getAllRepairHistory, getRepairHistoryForMecanicien, findHistory, getRepairHistoryForClient} = require('../controllers/RepairHistoryController');
const authGuard = require('../middlewares/authGuard');

router.post('/', authGuard ,addHistory);

router.get('/', authGuard, getAllRepairHistory);

router.get('/:id', authGuard, findHistory);

router.get('/mecanicien/:mecanicienId', getRepairHistoryForMecanicien)

router.get('/client/:clientId', getRepairHistoryForClient)

module.exports = router;