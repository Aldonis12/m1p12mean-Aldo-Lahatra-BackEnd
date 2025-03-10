const express = require('express');
const { addRendezVous, cancelRendezVous, getAllRendezVous, addMecanicienRdv} = require('../controllers/RendezVousController');
const router = express.Router();

router.post('/', addRendezVous)
router.post('/:id', cancelRendezVous)
router.get('/',getAllRendezVous)
router.put('/',addMecanicienRdv)

module.exports = router;