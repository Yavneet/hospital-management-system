const mongoose = require('mongoose');
const bedSchema = new mongoose.Schema({
  bedNumber: Number,
  ward: String,
  available: Boolean
});
module.exports = mongoose.model('Bed', bedSchema);
