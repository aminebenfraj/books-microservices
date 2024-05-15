const mongoose = require('mongoose');

// Extract the Schema constructor from mongoose
const Schema = mongoose.Schema;

// Define the Book schema with 'title' and 'author' fields
const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true }
});

// Create a model named 'Book' using the bookSchema
const Book = mongoose.model('Book', bookSchema);

// Export the Book model to be used in other parts of the application
module.exports = Book;
