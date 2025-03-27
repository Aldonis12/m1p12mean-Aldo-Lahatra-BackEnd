const RepairHistory = require("../models/RepairHistory");


const getVenteService = async (req,res) => {

     try{
        let query = {}
        if(req.query.prestationId){
            
            query = {prestation: req.query.prestationId}
        }

        const repairHistories = await RepairHistory.find(query)
        .populate('prestation').exec();
        
        const monthlyData = {};

        repairHistories.forEach(history => {
          const createdAt = new Date(history.createdAt);
          const year = createdAt.getFullYear();
          const month = createdAt.getMonth() + 1; // Months are 0-indexed
    
          const key = `${year}-${month.toString().padStart(2, '0')}`; // YYYY-MM format
    
          if (!monthlyData[key]) {
            monthlyData[key] = [];
          }
          monthlyData[key].push(history);
        });

        res.json(monthlyData);
    } catch(error){
        res.status(500).json({message: error.message});
    }   
}

module.exports = {
    getVenteService
}