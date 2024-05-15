// Import the mongoose module for MongoDB interaction

const mongoose = require('mongoose');
// Define an asynchronous function to connect to the MongoDB database

const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the specified URI and options
    await mongoose.connect('mongodb://localhost:27017/library', {
      useNewUrlParser: true,// Use new URL parser
      useUnifiedTopology: true,// Use new Server Discover and Monitoring engine
      useFindAndModify: false,// Disables use of deprecated methods for find and modify operations
    });
    // Log a message indicating successful connection to the MongoDB database
    console.log('MongoDB connected...');
  } catch (err) {
    // If an error occurs during connection, log the error message
    console.error(err.message);
    // Terminate the Node.js process with an error code (1)
    process.exit(1);
  }
};
// Export the connectDB function to make it accessible to other parts of the application
module.exports = connectDB;
