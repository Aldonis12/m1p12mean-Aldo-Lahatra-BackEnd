const express = require('express');
const router = express.Router();
const { createVehicule, getVehicules, getVehiculesByUser, updateVehicule, deleteVehicule } = require("../controllers/VehiculeController");

router.post("/", createVehicule);
router.get("/", getVehicules);
router.get("/:userId", getVehiculesByUser);
router.put("/:id", updateVehicule);
router.delete("/:id", deleteVehicule);

module.exports = router;
