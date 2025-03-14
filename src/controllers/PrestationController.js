
const Prestation = require('../models/Prestation');

const parseDuration = (durationString) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(durationString)) {
      return null; // Invalid format
    }
  
    const [hours, minutes] = durationString.split(':').map(Number);
    const totalMinutes = (hours * 60) + minutes;
    return totalMinutes;
}

const addPrestation = async (req,res) => {
    try{
        const data = req.body;

        const minutes = parseDuration(data.duration);
        
        if (minutes === null) {
          throw new Error('Invalid duration format');
        }

        const prestation = new Prestation({
            name: data.name,
            price: data.price,
            duration: minutes
        });
        
        await prestation.save();
        res.status(201).json(prestation);

    } catch(error){
        res.status(400).json({message: error.message});
    }
}

const getAllPrestation = async(req,res) =>   {

    try{
        let prestations = await Prestation.find();
        if(req.query.search){
            const searchTerm = req.query.search;
           
            // Search term is not a number, so perform string search
            prestations = await Prestation.find({
                name: { $regex: searchTerm, $options: 'i' }, //Case insensitive name search
            }).exec();       
        }

        res.json(prestations);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

const findPrestation = async(req,res) =>   {
    try{
        const prestation = await Prestation.findById(req.params.id);
        res.json(prestation);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

const updatePrestation = async(req,res) => {
    try{
        const data = req.body;

        const minutes = parseDuration(data.duration);
        
        if (minutes === null) {
          throw new Error('Invalid duration format');
        }

        const newData = {
            name: data.name,
            price: data.price,
            duration: minutes
        };

        const prestation = await Prestation.findByIdAndUpdate(req.params.id,newData,{new: true});
        res.json(prestation);
    } catch(error){
        res.status(401).json({message: error.message});
    }
}

const deletePrestation = async(req,res) => {
    try{
        await Prestation.findByIdAndDelete(req.params.id);
        res.json({message: "Prestation supprimé"});
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    addPrestation, getAllPrestation, findPrestation, updatePrestation, deletePrestation
}