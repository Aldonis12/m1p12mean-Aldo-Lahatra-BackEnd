const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const roleRoutes = require('./src/routes/roles');
const userRoutes = require('./src/routes/users');
const roleAuth = require('./src/routes/auth');
const typeVehiculeRoutes = require('./src/routes/typevehicule');
const vehiculeRoutes = require('./src/routes/vehicules');
const rendezvousRoutes = require('./src/routes/rendezVousRoute');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
  .catch(err => console.error(err));
  
app.use('/login', roleAuth);
app.use('/roles', roleRoutes);
app.use('/users', userRoutes);
app.use('/typevehicule', typeVehiculeRoutes);
app.use('/vehicules', vehiculeRoutes);
app.use('/rendezvous', rendezvousRoutes);
app.use('/prestations', require('./src/routes/prestationRoute'))
app.use('/avis', require('./src/routes/avisRoute'))
app.use('/repair-history', require('./src/routes/repairHistoryRoute'))
app.use('/factures', require('./src/routes/factureRoute'))
app.use('/dashboard', require('./src/routes/dashboardRoute'))

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
