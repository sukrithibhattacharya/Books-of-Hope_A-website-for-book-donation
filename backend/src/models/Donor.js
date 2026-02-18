const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // Will be stored hashed
  });

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
