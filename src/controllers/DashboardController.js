const Avis = require("../models/Avis");
const User = require("../models/User");
const RepairHistory = require("../models/RepairHistory");
const Role = require("../models/Role");

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
                    _id: null,
                    totalIncome: { $sum: "$prestation.price" } // Replace "totalPrice" with the actual field
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
                    totalIncome: { $sum: "$prestation.price" }, // Sum total income for each service
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
                    totalIncome: { $sum: "$prestation.price" }
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

const mecanicienPerformance = async (req, res) => {
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
    mecanicienPerformance, totalIncome, incomeService, totalIncomeByMonthThisYear
}