const mongoose = require('mongoose');
const Role = require('./Role');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    pswd: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;