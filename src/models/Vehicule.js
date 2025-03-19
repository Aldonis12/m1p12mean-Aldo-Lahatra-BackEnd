const mongoose = require('mongoose');
const TypeVehicule = require('./TypeVehicule');
const User = require('./User');

const vehiculeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    typevehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeVehicule' }
});

const Vehicule = mongoose.model('Vehicule', vehiculeSchema);

module.exports = Vehicule;