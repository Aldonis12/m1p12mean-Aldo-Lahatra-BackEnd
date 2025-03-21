const express = require('express');
const { addRendezVous, cancelRendezVous, getAllRendezVous, addMecanicienRdv, getRendezVousUser, validateRendezVous} = require('../controllers/RendezVousController');
const router = express.Router();

router.post('/', addRendezVous)
router.post('/:id', cancelRendezVous)
router.post('/validate/:id', validateRendezVous)
router.get('/:userId',getRendezVousUser)
router.get('/',getAllRendezVous)
router.put('/',addMecanicienRdv)

module.exports = router;