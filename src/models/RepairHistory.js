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
}, {timestamps: true});

module.exports = mongoose.model('RepairHistory', RepairHistorySchema);