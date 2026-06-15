require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDatabase = require('./db');
const seedData = require('./seedData');

const run = async () => {
  try {
    await connectDatabase();
    await seedData();
    console.log('Seed completed');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
