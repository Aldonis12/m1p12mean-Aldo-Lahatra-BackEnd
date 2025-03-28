const mongoose = require('mongoose');

const AvisSchema = new mongoose.Schema({
    commentaire: {
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 5; // Minimum 5 characters
            },
            message: props => `${props.path} doit avoir au moins 5 caractères.`
        }
    },
    note: {
        type: Number, 
        required: true,
        min: 1, // Minimum value 1
        max: 5, // Maximum value 5
        validate: {
            validator: Number.isInteger, // Ensure integer value
            message: props => `${props.path} doit être un nombre entier.`
        }

    },
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
    repairHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RepairHistory',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Avis', AvisSchema);