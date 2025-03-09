const mongoose = require('mongoose');

const AvisSchema = new mongoose.Schema({
    commentaire: {type: String, required: true},
    note: {type: Number, required: true},
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mecanicien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('Avis', AvisSchema);