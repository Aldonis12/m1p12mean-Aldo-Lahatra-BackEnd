const TypeVehicule = require("../models/TypeVehicule");

const createTypeVehicule = async (req, res) => {
    try {
        const newTypeVehicule = new TypeVehicule({ name: req.body.name });
        await newTypeVehicule.save();
        res.status(201).json(newTypeVehicule);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du Type Vehicule : ' + error.message });
    }
};

const getTypeVehicule = async (req, res) => {
    try {
        const TypeVehicules = await TypeVehicule.find();
        res.json(TypeVehicules);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des Type Vehicules' });
    }
};

module.exports = { createTypeVehicule, getTypeVehicule };