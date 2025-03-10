const Prestation = require("../models/Prestation");
const User = require("../models/User");
const RepairHistory = require("../models/RepairHistory");

const getAllRepairHistory = async (req,res) => {
    try{
        const repairHistory = await RepairHistory.find()
        .populate('mecanicien')
        .populate('prestation')
        .populate('client').exec();
        
        res.json(repairHistory);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

const addHistory = async (req,res) => {
    try{
        const data = req.body;

        const client = await User.findById({_id: data.clientId});
        if(!client){
            
            throw new Error('Client not found');
        }

        const mecanicien = await User.findById({_id: data.mecanicienId});
        if(!mecanicien){
            
            throw new Error('Mecanicien not found');
        }
        
        const prestation = await Prestation.findById({_id: data.prestationId});
        if(!prestation){
            
            throw new Error('Prestation not found');
        }

        const history = new RepairHistory({
            prestation: prestation._id,
            mecanicien: mecanicien._id,
            client: client._id
        });
        
        await history.save();
        res.status(201).json(history);

    } catch(error){
        res.status(400).json({message: error.message});
    }
}

module.exports = {
    addHistory, getAllRepairHistory
}