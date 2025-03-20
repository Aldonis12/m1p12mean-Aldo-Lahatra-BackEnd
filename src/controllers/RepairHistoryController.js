const Prestation = require("../models/Prestation");
const User = require("../models/User");
const RepairHistory = require("../models/RepairHistory");
const Vehicule = require("../models/Vehicule");

const getAllRepairHistory = async (req,res) => {
    try{
        let repairHistory = await RepairHistory.find()
        .populate('mecanicien')
        .populate('prestation')
        .populate('vehicule')
        .populate({ 
            path: 'client',
             
         }).exec();

        if(req.query.search){
            const searchTerm = req.query.search;
            repairHistory = await RepairHistory.aggregate([
                {
                    $lookup: {
                        from: 'users', 
                        localField: 'mecanicien',
                        foreignField: '_id',
                        as: 'mecanicien'
                    }
                },
                {
                    $lookup: {
                        from: 'prestations',
                        localField: 'prestation',
                        foreignField: '_id',
                        as: 'prestation'
                    }
                },
                {
                    $lookup: {
                        from: 'vehicules', 
                        localField: 'vehicule',
                        foreignField: '_id',
                        as: 'vehicule'
                    }
                },
                {
                    $lookup: {
                        from: 'users', // Remplacez par le nom de la collection des clients
                        localField: 'client',
                        foreignField: '_id',
                        as: 'client'
                    }
                },
                {
                    $unwind: {
                        path: '$mecanicien',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$vehicule',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$prestation',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$client',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        $or: [
                            { numFacture: { $regex: searchTerm, $options: 'i' } },
                            { 'mecanicien.name': { $regex: searchTerm, $options: 'i' } },
                            { 'prestation.name': { $regex: searchTerm, $options: 'i' } },
                            { 'client.name': { $regex: searchTerm, $options: 'i' } },
                            { 'vehicule.name': { $regex: searchTerm, $options: 'i' } }
                        ]
                    }
                }
            ]);
            
        }
        
        res.json(repairHistory);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

//Function GetPrice -> 10%
async function PriceLoyalUser(clientId, prestationId) {
    try {
        const repairHistoryCount = await RepairHistory.countDocuments({ client: clientId });

        const prestation = await Prestation.findById(prestationId);
        if (!prestation) {
            throw new Error("Prestation not found");
        }

        const price = repairHistoryCount > 4 ? prestation.price * 0.9 : prestation.price; //10% amle prix prestation
        return price;
    } catch (error) {
        console.error("Erreur :", error.message);
        return null;
    }
}
//------------------------//

const getRepairHistoryForMecanicien = async (req,res) => {
    try{
        const repairHistory = await RepairHistory.find({mecanicien: req.params.mecanicienId})
        .populate('mecanicien')
        .populate('prestation')
        .populate('client').exec();
        
        res.json(repairHistory);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

const generateInvoiceNumber = () => {
    const randomString = generateRandomString(8); // Génère une chaîne aléatoire de 8 caractères
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ajoute un zéro si le mois est inférieur à 10
    const day = date.getDate().toString().padStart(2, '0'); // Ajoute un zéro si le jour est inférieur à 10
    return `INV-${year}${month}${day}-${randomString}`;
}

const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
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
        
        const vehicule = await Vehicule.findById({_id: data.vehiculeId});
        if(!vehicule){
            
            throw new Error('Vehicule not found');
        }

        const history = new RepairHistory({
            prestation: prestation._id,
            mecanicien: mecanicien._id,
            client: client._id,
            vehicule: vehicule._id,
            numFacture: generateInvoiceNumber()
        });
        
        await history.save();
        res.status(201).json(history);

    } catch(error){
        res.status(400).json({message: error.message});
    }
}

module.exports = {
    addHistory, getAllRepairHistory, getRepairHistoryForMecanicien
}