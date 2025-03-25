const Avis = require("../models/Avis");
const User = require("../models/User");
const Role = require("../models/Role");
const RepairHistory = require("../models/RepairHistory");
const RendezVous = require("../models/RendezVous");

const mecanicienPerformance = async (req, res) => {
  try {
    const avis = await Avis.find().populate("mecanicien").exec();
    res.json(avis);
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


module.exports = {
    mecanicienPerformance,
    getCountUser,
    getMecanicienDispoNow,
    getCountClientPerMonth,
    getCountRendezVousPerMonth
};
