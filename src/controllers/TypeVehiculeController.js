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

const deleteUser = async (req, res) => {
    try {
      const user = await TypeVehicule.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "TypeVehicule non trouvé" });
      }
  
      res.status(200).json({ message: "TypeVehicule supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du TypeVehicule" });
    }
  };

module.exports = { createTypeVehicule, getTypeVehicule, deleteUser };