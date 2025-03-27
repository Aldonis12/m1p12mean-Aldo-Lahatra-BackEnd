const Avis = require("../models/Avis");
const User = require("../models/User");
const RepairHistory = require("../models/RepairHistory");

const totalIncome = async (req, res) => {
    try{
        let matchStage = {}; // Default: no filter

        // Period Filtering (Day, Week, Month)
        if (req.query.period) {
            const now = new Date();
            let startDate;

            switch (req.query.period) {
                case 'day':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    const dayOfWeek = now.getDay();
                    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
                    startDate = new Date(now.getFullYear(), now.getMonth(), diff);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                default:
                    // No filter if period is invalid
                    break;
            }

            if (startDate) {
                const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // Inclusive end date.
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

            switch (req.query.period) {
                case 'day':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    const dayOfWeek = now.getDay();
                    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
                    startDate = new Date(now.getFullYear(), now.getMonth(), diff);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                default:
                    // No filter if period is invalid
                    break;
            }

            if (startDate) {
                const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // Inclusive end date.
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
    mecanicienPerformance, totalIncome, incomeService, totalIncomeByMonthThisYear
}