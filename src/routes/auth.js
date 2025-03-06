const express = require('express');
const router = express.Router();
const { login } = require("../controllers/AuthentificationController");

router.post("/", login);

module.exports = router;
