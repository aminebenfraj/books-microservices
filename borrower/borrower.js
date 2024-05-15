const mongoose = require('mongoose');

// Extract the Schema constructor from mongoose
const Schema = mongoose.Schema;

// Define the Borrower schema with a 'name' field
const borrowerSchema = new Schema({
  name: { type: String, required: true }// 'name' field must be a string and is required
});

// Create a model named 'Borrower' using the borrowerSchema
const Borrower = mongoose.model('Borrower', borrowerSchema);

// Export the Borrower model to be used in other parts of the application
module.exports = Borrower;
