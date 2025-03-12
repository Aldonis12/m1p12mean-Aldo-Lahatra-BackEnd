const express = require('express');
const { addAvis } = require('../controllers/AvisController');
const router = express.Router();

router.post('/', addAvis)

module.exports = router;