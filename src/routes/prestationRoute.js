const express = require('express');
const router = express.Router();
const { addPrestation, getAllPrestation, findPrestation, updatePrestation, deletePrestation } = require('../controllers/PrestationController');

//créer une prestation
router.post('/', addPrestation);

//Lire tous les articles
router.get('/', getAllPrestation);

//Lire un article
router.get('/:id', findPrestation)


//Mettre à jour un article
router.put('/:id', updatePrestation)

//Supprimer un article
router.delete('/:id', deletePrestation)

module.exports = router;