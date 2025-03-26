const express = require('express');
const { addRendezVous, cancelRendezVous, getAllRendezVous, addMecanicienRdv, getRendezVousUser, validateRendezVous, deleteRdv} = require('../controllers/RendezVousController');
const router = express.Router();

router.post('/', addRendezVous)
router.post('/:id', cancelRendezVous)
router.post('/validate/:id', validateRendezVous)
router.get('/:userId',getRendezVousUser)
router.get('/',getAllRendezVous)
router.put('/',addMecanicienRdv)
router.delete('/:id',deleteRdv)

module.exports = router;