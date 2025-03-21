const express = require('express');
const router = express.Router();
const { addPrestation, getAllPrestation, findPrestation, updatePrestation, deletePrestation } = require('../controllers/PrestationController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

//créer une prestation
router.post('/', authGuard, roleGuard(['Manager']), addPrestation);

//Lire tous les articles
router.get('/', getAllPrestation);

//Lire un article
router.get('/:id', findPrestation)


//Mettre à jour un article
router.put('/:id', authGuard, roleGuard(['Manager']), updatePrestation)

//Supprimer un article
router.delete('/:id', authGuard, roleGuard(['Manager']), deletePrestation)

module.exports = router;