const Avis = require("../models/Avis");
const User = require("../models/User");
const Role = require("../models/Role");
const RepairHistory = require("../models/RepairHistory");
const RendezVous = require("../models/RendezVous");

const totalIncome = async (req, res) => {
    try{
        let matchStage = {}; // Default: no filter

        // Period Filtering (Day, Week, Month)
        if (req.query.period) {
            const now = new Date();
            let startDate;

            let endDate;
            
            switch (req.query.period) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                    
                    break;
                    
                case 'week':
                    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
                    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                    startDate = new Date(now.getFullYear(), now.getMonth(), diff);
                    endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7);
                    break;
                    
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                    break;
                    
                default:
                    // No date filtering if period is invalid
                    break;
            }

            if (startDate) {
                matchStage.createdAt = { $gte: startDate, $lt: endDate };
            }
        }

        const repairHistory = await RepairHistory.aggregate([
            
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$price" } // Replace "totalPrice" with the actual field
                }
            }
            // Add other aggregation stages as needed (e.g., grouping, summing)
        ]);
        
        res.json(repairHistory);
    }catch(error){

        res.status(500).json({message: error.message});
    }
}

const incomeService = async (req, res) => {
    try{
        let matchStage = {}; // Default: no filter

        // Period Filtering (Day, Week, Month)
        if (req.query.period) {
            const now = new Date();
            let startDate;
            let endDate;
            
            switch (req.query.period) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                    
                    break;
                    
                case 'week':
                    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
                    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                    startDate = new Date(now.getFullYear(), now.getMonth(), diff);
                    endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7);
                    break;
                    
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                    break;
                    
                default:
                    // No date filtering if period is invalid
                    break;
            }

            if (startDate) {
                matchStage.createdAt = { $gte: startDate, $lt: endDate };
            }
        }

        const repairHistory = await RepairHistory.aggregate([
            {
                $lookup: {
                    from: 'prestations', // Assuming your User collection is named 'users'
                    localField: 'prestation',
                    foreignField: '_id',
                    as: 'prestation',
                },
            },
            {
                $unwind: '$prestation',
            },
            { $match: matchStage },
            {
                $group: {
                    _id: "$prestation.name", // Group by service name
                    totalIncome: { $sum: "$price" }, // Sum total income for each service
                    count: { $sum: 1 } // count the number of services
                }
            }
            // Add other aggregation stages as needed (e.g., grouping, summing)
        ]);
        
        res.json(repairHistory);
    } catch(error){
        res.status(500).json({message: error.message});
    } 
}

const totalIncomeByMonthThisYear = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();

        const result = await RepairHistory.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(currentYear, 0, 1),  // January 1st of current year
                        $lt: new Date(currentYear + 1, 0, 1) // January 1st of next year
                    }
                }
            },
            {
                $lookup: {
                    from: 'prestations', // Assuming your User collection is named 'users'
                    localField: 'prestation',
                    foreignField: '_id',
                    as: 'prestation',
                },
            },
            {
                $unwind: '$prestation',
            },
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month
                    totalIncome: { $sum: "$price" }
                }
            },
            {
                $sort: { month: 1 } // Sort by month
            }
        ]);

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCountUser = async (req, res) => {
    try {
      const clientRole = await Role.findOne({ name: "Client" });
      const mecanicienRole = await Role.findOne({ name: "Mecanicien" });
  
      const clientCount = await User.countDocuments({ role: clientRole._id });
      const mecanicienCount = await User.countDocuments({ role: mecanicienRole._id });
  
      res.json({ clients: clientCount, mecaniciens: mecanicienCount });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const getMecanicienDispoNow = async (req, res) => {
    try {
        const mecanicienRole = await Role.findOne({ name: "Mecanicien" });

        if (!mecanicienRole) {
            return res.status(404).json({ message: "Rôle 'Mecanicien' non trouvé" });
        }

        const mecaniciens = await User.find({ role: mecanicienRole._id });

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        const reparationsEnCours = await RepairHistory.find({
            createdAt: { 
                $gte: new Date(formattedDate + "T00:00:00Z"),
                $lt: new Date(formattedDate + "T23:59:59Z")
            }
        });
        
        const mecaniciensOccupes = reparationsEnCours.map(r => r.mecanicien.toString());
        
        const mecaniciensDispo = mecaniciens.filter(m => !mecaniciensOccupes.includes(m._id.toString()));
        
        if (mecaniciensDispo.length === mecaniciens.length) {
            return res.status(200).json({ total: mecaniciensDispo.length,message: "Tous disponibles" });
        }
        
        res.status(200).json({
            total: mecaniciensDispo.length,
            mecaniciens: mecaniciensDispo.map(m => ({ id: m._id, nom: m.name }))
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des mécaniciens disponibles : " + error.message });
    }
};

const getCountClientPerMonth = async (req, res) => {
    try {
        const clientRole = await Role.findOne({ name: "Client" });

        if (!clientRole) {
            return res.status(404).json({ message: "Rôle 'Client' non trouvé" });
        }

        const clientsStats = await User.aggregate([
            { 
                $match: { 
                    role: clientRole._id
                }
            },
            { 
                $group: {
                    _id: {
                        year: { $year: "$createdAt" }, // Extraire l'année
                        month: { $month: "$createdAt" } // Extraire le mois
                    },
                    totalClients: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        res.status(200).json(clientsStats);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques des clients : " + error.message });
    }
};

    const getCountRendezVousPerMonth = async (req, res) => {
        try {
            const statsRendezVous = await RendezVous.aggregate([
                {
                    $match: {
                        $or: [
                            { type: false, date_annulation: { $ne: null } },
                            { type: true }
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$date_rdv" },
                            month: { $month: "$date_rdv" }
                        },
                        totalRdvFalse: {
                            $sum: {
                                $cond: [{ $eq: ["$type", false] }, 1, 0]
                            }
                        },
                        totalRdvTrue: {
                            $sum: {
                                $cond: [{ $eq: ["$type", true] }, 1, 0]
                            }
                        },
                        totalRdv: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ]);
    
            res.status(200).json(statsRendezVous);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des statistiques des rendez-vous : " + error.message });
        }
    };
    const mecanicienPerformance = async(req, res) => {
    try{

        const mecanicienRole = await Role.findOne({name: 'Mecanicien'});


        if (!mecanicienRole) {
            // Handle the case where the "Mecanicien" role is not found
            return []; // Or throw an error, or handle as needed
        }

        const mecanicien = await User.aggregate([
            {
                $match: {
                    'role': mecanicienRole._id
                }
            },
            {
                $lookup: {
                    from: 'avis', 
                    localField: '_id',
                    foreignField: 'mecanicien',
                    as: 'avis',
                },
            },
            {
                $unwind: {
                    path: '$avis',
                    preserveNullAndEmptyArrays: true // Keep users even with no reviews
                }
            },
            
            {
                $group: {
                    _id: {
                        userId: "$_id",
                        userName: "$name" // Assuming "nom" is the user name field
                    },
                    totalNote: { $sum: "$avis.note" }, // Sum total income for each service
                    count: { $sum: 1 } // count the number of services
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id.userId",
                    userName: "$_id.userName",
                    totalNote: 1,
                    count: 1,
                    
                    adjustedCount: {
                        $cond: {
                            if: { $eq: ["$totalNote", 0] },
                            then: 0,
                            else: { $multiply: ["$count", 5] }
                        },
                    },
                },
            },
            {
                $sort: { userName: 1 } // Sort by username in ascending order
            }
        ])

        res.json(mecanicien);
    } catch(error){
        res.status(500).json({message: error.message});
    }   
}

module.exports = {
    mecanicienPerformance,
    getCountUser,
    getMecanicienDispoNow,
    getCountClientPerMonth,
    getCountRendezVousPerMonth,
    totalIncome, incomeService, totalIncomeByMonthThisYear
};