const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const seedData = require('../utils/seedData');

async function seed() {
  await connectDB();
  try {
    const result = await seedData();
    console.log('Seed complete:', result);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
