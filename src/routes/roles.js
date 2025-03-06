const express = require('express');
const router = express.Router();
const { createRole, getRole } = require('../controllers/RoleController');

router.post("/", createRole);
router.get("/", getRole);

module.exports = router;
