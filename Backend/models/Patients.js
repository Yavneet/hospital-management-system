const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  diseaseHistory: [String],
  password: String
});
module.exports = mongoose.model('Patient', patientSchema);
