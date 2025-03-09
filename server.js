const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const roleAuth = require('./src/routes/auth');

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
app.use('/prestations', require('./src/routes/prestationRoute'))
app.use('/avis', require('./src/routes/avisRoute'))

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
