const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // Will be stored hashed
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

