const mongoose = require('mongoose');
const medicineSchema = new mongoose.Schema({
  name: String,
  stock: Number,
  price: Number,
  expiry: String,
  alternatives: [String]
});
module.exports = mongoose.model('Medicine', medicineSchema);
