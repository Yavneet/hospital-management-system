const connectDB = require('../config/db');
const seedData = require('../utils/seedData');

const runSeed = async (req, res) => {
  try {
    await connectDB();
    const result = await seedData();
    res.json({ success: true, seeded: result });
  } catch (err) {
    console.error('Seed endpoint failed:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { runSeed };
