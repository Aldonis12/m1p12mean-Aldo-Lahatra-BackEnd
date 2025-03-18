const mongoose = require("mongoose");
const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const RepairHistory = require("../models/RepairHistory");

const createUser = async (req, res) => {
  try {
    const { name, surname, mail, pswd, roleId } = req.body;

    if (!name || !surname || !mail || !pswd || !roleId) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: "ID du rôle invalide" });
    }

    const role = await Role.findOne({ _id: roleId });
    if (!role) {
      return res.status(404).json({ message: "Rôle introuvable" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pswd, saltRounds);

    const newUser = new User({
      name,
      surname,
      mail,
      pswd: hashedPassword,
      role: roleId,
    });

    await newUser.save();

    res.status(200).json({ message: "Connexion réussie", newUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find().populate("role");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

const getUserByRole = async (req, res) => {
  try {
    const { roleName } = req.params;
    if (!roleName) {
      return res.status(400).json({ message: "Le nom du rôle est requis" });
    }
    const role = await Role.findOne({ name: roleName });

    if (!role) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }
    const users = await User.find({ role: role._id }).populate("role");

    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, surname, mail, pswd, roleId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    let hashedPassword = user.pswd;
    if (pswd) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(pswd, saltRounds);
    }

    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.mail = mail || user.mail;
    user.pswd = hashedPassword;
    user.role = roleId || user.role;

    await user.save();
    res
      .status(200)
      .json({ message: "Utilisateur mis à jour avec succès", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};

const getLoyalUser = async (req, res) => {
  try {
    const loyalClients = await RepairHistory.aggregate([
      { $group: { _id: "$client", count: { $sum: 1 } } },
      { $match: { count: { $gt: 4 } } },
    ]);

    const clientIds = loyalClients.map((client) => client._id);
    const users = await User.find({ _id: { $in: clientIds } });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des clients fidèles",
      error,
    });
  }
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  getLoyalUser,
  getUserByRole
};
