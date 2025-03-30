const Prestation = require("../models/Prestation");
const RendezVous = require("../models/RendezVous");
const mongoose = require("mongoose");
const User = require("../models/User");
const { sendConfirmationEmail } = require("../config/email");

const addRendezVous = async (req, res) => {
    try {
        const data = req.body;

        const client = await User.findById(data.clientId);
        if (!client) {
            throw new Error('Client not found');
        }

        const prestation = await Prestation.findById(data.prestationId);
        if (!prestation) {
            throw new Error('Prestation not found');
        }

        if (!data.date || !data.heure) {
            throw new Error('Date and time are required');
        }

        const fullDateTimeString = `${data.date}T${data.heure}:00.000Z`;
        const dateRdv = new Date(fullDateTimeString);

        if (isNaN(dateRdv.getTime())) {
            throw new Error('Invalid date or time format');
        }

        const rdvData = {
            client: client._id,
            prestation: prestation._id,
            date_rdv: dateRdv,
        };

        const rdv = new RendezVous(rdvData);
        await rdv.save();

        res.status(201).json(rdv);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const addMecanicienRdv = async (req, res) => {
    try{
        const data = req.body;

        const mecanicien = await User.findById(data.mecanicienId);
        if (!mecanicien) {
            throw new Error('Mecanicien not found');
        }

        const rdv = await RendezVous.findById(data.rdvId);
        if (!rdv) {
            throw new Error('RendezVous not found');
        }
        rdv.mecanicien = data.mecanicienId;
        rdv.type = true;
        await rdv.save();

        res.status(200).json(rdv);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const cancelRendezVous = async (req, res) => {
    try {
        const rdv = await RendezVous.findById(req.params.id);
        if (!rdv) {
            throw new Error('RendezVous not found');
        }

        rdv.date_annulation = new Date();
        rdv.type = false;
        await rdv.save();

        res.status(200).json(rdv);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const validateRendezVous = async (req, res) => {
    try {
        const rdv = await RendezVous.findById(req.params.id).populate("prestation").populate("client");
        if (!rdv) {
            throw new Error('RendezVous not found');
        }

        rdv.type = true;
        await rdv.save();

        await sendConfirmationEmail(rdv);

        res.status(200).json(rdv);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllRendezVous = async (req, res) => {
    try {
        const rdvs = await RendezVous.find().populate("prestation").populate("mecanicien").populate("client");

        if (!rdvs || rdvs.length === 0) {
            return res.status(404).json({ message: 'No RDV found' });
        }

        res.status(200).json(rdvs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getRendezVousUser = async (req, res) => {
    try {

        const userId = req.params.userId;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Utilisateur invalide" });
        }

        const rdvs = await RendezVous.find({ client: userId }).populate("prestation").populate("mecanicien");

        res.json(rdvs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteRdv = async (req, res) => {
  try {
    const Rdv = await RendezVous.findByIdAndDelete(req.params.id);
    if (!Rdv) {
      return res.status(404).json({ message: "rendez-vous non trouvé" });
    }

    res.status(200).json({ message: "rendez-vous supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du rendez-vous" });
  }
};

module.exports = {
    addRendezVous,
    cancelRendezVous,
    getAllRendezVous,
    addMecanicienRdv,
    getRendezVousUser,
    validateRendezVous,
    deleteRdv
}