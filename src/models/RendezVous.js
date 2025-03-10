const mongoose = require('mongoose');

const RendezVousSchema = new mongoose.Schema({
    type: {type: String, required: true},
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prestation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prestation',
        required: true
    },
    mecanicien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date_annulation : {type: Date, required: false},
}, {timestamps: true});

module.exports = mongoose.model('RendezVous', RendezVousSchema);