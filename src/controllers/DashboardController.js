const Avis = require("../models/Avis");
const User = require("../models/User");

const mecanicienPerformance = async (req, res) => {
    try{
        const mecanicien = await User.aggregate([
            {
                $lookup: {
                    from: 'avis', // Assuming your User collection is named 'users'
                    localField: '_id',
                    foreignField: 'mecanicien',
                    as: 'avis',
                },
            },
            {
                $unwind: '$avis',
            },
        ])

        res.json(mecanicien);
    } catch(error){
        res.status(500).json({message: error.message});
    }   
}

module.exports = {
    mecanicienPerformance
}