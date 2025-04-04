const mongoose = require('mongoose');

const RepairHistorySchema = new mongoose.Schema({
    numFacture: {
        type: String,
        required: true
    },
    prestation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prestation',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicule',
        required: true
    },
    mecanicien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {type: mongoose.Schema.Types.Decimal128, required: true, validate: {
        validator: function(v) {
            
            // Convert Decimal128 to number for comparison
            return parseFloat(v.toString()) >= 1000;
        },
        message: props => `Price must be at least 1000 (got ${props.value})`
    }},
}, {timestamps: true});

module.exports = mongoose.model('RepairHistory', RepairHistorySchema);