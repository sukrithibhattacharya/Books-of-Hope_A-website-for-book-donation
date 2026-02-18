const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
  bookName: String,
  subject: String,
  medium: String,
  board: String,
  status: {
    type: String,
    enum: ["Available", "Requested", "Donated"],
    default: "Available",
  },
});

module.exports = mongoose.model("Book", bookSchema);
