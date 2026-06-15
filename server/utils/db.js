const mongoose = require('mongoose');

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const connectDatabase = async (maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${maxAttempts} failed: ${error.message}`);
      if (attempt === maxAttempts) throw error;
      await sleep(5000);
    }
  }
};

module.exports = connectDatabase;
