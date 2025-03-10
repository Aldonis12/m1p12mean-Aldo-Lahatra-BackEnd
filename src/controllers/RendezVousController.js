const Prestation = require("../models/Prestation");
const RendezVous = require("../models/RendezVous");
const User = require("../models/User");

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

const getAllRendezVous = async (req, res) => {
    try {
        const rdvs = await RendezVous.find();

        if (!rdvs || rdvs.length === 0) {
            return res.status(404).json({ message: 'No RDV found' });
        }

        res.status(200).json(rdvs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addRendezVous,
    cancelRendezVous,
    getAllRendezVous,
    addMecanicienRdv
}