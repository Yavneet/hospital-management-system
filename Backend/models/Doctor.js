const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  available: Boolean,
  password: String
});
module.exports = mongoose.model('Doctor', doctorSchema);
