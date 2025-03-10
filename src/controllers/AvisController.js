const Avis = require("../models/Avis");
const User = require("../models/User");

const addAvis = async (req,res) => {
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

        const avis = new Avis({
            commentaire: data.commentaire,
            note: data.note,
            client: client._id,
            mecanicien: mecanicien._id 
        });

        await avis.save();
        res.status(201).json(avis);

    } catch(error){
        res.status(400).json({message: error.message});
    }
}

module.exports = {
    addAvis
}