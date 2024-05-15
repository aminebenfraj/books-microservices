// Import the mongoose library

const mongoose = require('mongoose');
// Extract the Schema constructor from mongoose

const Schema = mongoose.Schema;
// Define the Author schema with a single field 'name' which is a required string

const authorSchema = new Schema({
  name: { type: String, required: true }// 'name' field must be a string and is required
});
// Create a model named 'Author' using the authorSchema

const Author = mongoose.model('Author', authorSchema);
// Export the Author model to be used in other parts of the application

module.exports = Author;