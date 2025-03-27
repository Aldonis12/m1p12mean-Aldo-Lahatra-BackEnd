const express = require('express');
const { addAvis } = require('../controllers/AvisController');
const authGuard = require('../middlewares/authGuard');
const router = express.Router();

router.post('/', authGuard ,addAvis)

module.exports = router;