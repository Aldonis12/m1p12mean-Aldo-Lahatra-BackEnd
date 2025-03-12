const Avis = require("../models/Avis");

const mecanicienPerformance = async (req, res) => {
    try{
        const avis = await Avis.find().populate('mecanicien').exec();
        res.json(avis);
    } catch(error){
        res.status(500).json({message: error.message});
    }   
}

module.exports = {
    mecanicienPerformance
}