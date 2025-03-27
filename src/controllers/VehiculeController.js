const mongoose = require("mongoose");
const User = require("../models/User");
const Vehicule = require("../models/Vehicule");
const TypeVehicule = require("../models/TypeVehicule");

const createVehicule = async (req, res) => {
  try {
    const { name, number, userId, typevehiculeId } = req.body;

    if (!name || !number || !userId || !typevehiculeId) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Utilisateur invalide" });
    }

    if (!mongoose.Types.ObjectId.isValid(typevehiculeId)) {
      return res.status(400).json({ message: "Type de véhicule invalide" });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const typeVehicule = await TypeVehicule.findOne({ _id: typevehiculeId });
    if (!typeVehicule) {
      return res.status(404).json({ message: "Type de vehicule introuvable" });
    }

    const newVehicule = new Vehicule({
      name,
      number,
      user: userId,
      typevehicule: typevehiculeId,
    });
    await newVehicule.save();

    res.status(200).json({message: "Vehicule ajouté", newVehicule});
  } catch (error) {
    res.status(500).json({ message: "Erreur d'ajout vehicule", error: error.message });
  }
};

const getVehicules = async (req, res) => {
    try {
        const vehicules = await Vehicule.find().populate('user').populate('typevehicule');
        res.json(vehicules);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des vehicules' });
    }
};

const getVehiculesByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Utilisateur invalide" });
          }

        const vehicules = await Vehicule.find({ user: userId }).populate('typevehicule');
        res.json(vehicules);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des vehicules' });
    }
};

const updateVehicule = async (req, res) => {
    try {
      const { name, number, userId, typevehiculeId } = req.body;

      const vehicule = await Vehicule.findById(req.params.id);
      if (!vehicule) {
        return res.status(404).json({ message: "Vehicule non trouvé" });
      }

      vehicule.name = name || vehicule.name;
      vehicule.number = number || vehicule.number;
      vehicule.user = userId || vehicule.user;
      vehicule.typevehicule = typevehiculeId || vehicule.typevehicule;
  
      await vehicule.save();
      res.status(200).json({ message: "Vehicule mis à jour avec succès", vehicule });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du vehicule" });
    }
  };

const deleteVehicule = async (req, res) => {
    try {
      const vehicule = await Vehicule.findByIdAndDelete(req.params.id);
      if (!vehicule) {
        return res.status(404).json({ message: "Vehicule non trouvé" });
      }

      res.status(200).json({ message: "Vehicule supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du vehicule" });
    }
  };

module.exports = {
    createVehicule,
    getVehicules,
    getVehiculesByUser,
    updateVehicule,
    deleteVehicule,
  };