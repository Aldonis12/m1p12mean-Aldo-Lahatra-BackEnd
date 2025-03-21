const express = require('express');
const router = express.Router();
const {addHistory, getAllRepairHistory, getRepairHistoryForMecanicien} = require('../controllers/RepairHistoryController');
const authGuard = require('../middlewares/authGuard');

router.post('/', authGuard ,addHistory);

router.get('/', authGuard, getAllRepairHistory);

router.get('/mecanicien/:mecanicienId', getRepairHistoryForMecanicien)

router.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const total = await Product.countDocuments();

    const products = await Product.find().skip(startIndex).limit(limit);

    res.json({
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: products
    });
});

module.exports = router;