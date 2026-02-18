const mongoose = require("mongoose");

const bookDonationSchema = new mongoose.Schema({
  // Donor Information
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  
  // Book Information
  bookTitle: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  ageGroup: {
    type: String,
    required: true
  },
  condition: {
    type: String
  },
  description: {
    type: String
  },
  
  // Cover Image
  coverImagePath: {
    type: String
  },
  
  // Status and Moderation
  status: {
    type: String,
    default: 'Available'
  },
  approved: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  donationDate: {
    type: Date,
    default: Date.now
  }
});

const BookDonation = mongoose.model("BookDonation", bookDonationSchema);
module.exports = BookDonation;
