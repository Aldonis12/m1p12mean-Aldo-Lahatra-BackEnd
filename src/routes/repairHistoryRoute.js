const express = require('express');
const router = express.Router();
const {addHistory, getAllRepairHistory, getRepairHistoryForMecanicien, findHistory, getRepairHistoryForClient} = require('../controllers/RepairHistoryController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

router.post('/', authGuard ,addHistory);

router.get('/', authGuard, getAllRepairHistory);

router.get('/:id', authGuard, findHistory);

router.get('/mecanicien/:mecanicienId', authGuard, roleGuard(['Mecanicien']) ,getRepairHistoryForMecanicien)

router.get('/client/:clientId', authGuard, roleGuard(['Client']) ,getRepairHistoryForClient)

module.exports = router;