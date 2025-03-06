const Role = require("../models/Role");

const createRole = async (req, res) => {
    try {
        const newRole = new Role({ name: req.body.name });
        await newRole.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du rôle' });
    }
};

const getRole = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des rôles' });
    }
};

module.exports = { createRole, getRole };