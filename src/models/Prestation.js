const mongoose = require('mongoose');

const PrestationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: mongoose.Schema.Types.Decimal128, required: true, validate: {
        validator: function(v) {
            
            // Convert Decimal128 to number for comparison
            return parseFloat(v.toString()) >= 1000;
        },
        message: props => `Price must be at least 1000 (got ${props.value})`
    }},
    duration: {type: Number, required: true, validate: {
        validator: function(v) {
            return v >= 5;  // Minimum duration of 5
        },
        message: props => `Duration must be at least 5 (got ${props.value})`
    }},
}, {timestamps: true});

module.exports = mongoose.model('Prestation', PrestationSchema);