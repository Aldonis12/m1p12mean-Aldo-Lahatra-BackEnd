const express = require('express');
const router = express.Router();
const { createTypeVehicule, getTypeVehicule, deleteUser } = require('../controllers/TypeVehiculeController');

router.post("/", createTypeVehicule);
router.get("/", getTypeVehicule);
router.delete("/:id", deleteUser);

module.exports = router;
