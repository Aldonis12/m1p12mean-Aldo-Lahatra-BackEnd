const mongoose = require('mongoose');

const PrestationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: mongoose.Schema.Types.Decimal128, required: true},
    duration: {type: Number, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Prestation', PrestationSchema);