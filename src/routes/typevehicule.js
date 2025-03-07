const express = require('express');
const router = express.Router();
const { createTypeVehicule, getTypeVehicule } = require('../controllers/TypeVehiculeController');

router.post("/", createTypeVehicule);
router.get("/", getTypeVehicule);

module.exports = router;
