const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // Will be stored hashed
  });

const Ngo = mongoose.model('Ngo', ngoSchema);

module.exports = Ngo;
