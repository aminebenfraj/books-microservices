const Author = require('../author/author');
const Book = require('../book/book');
const Borrower = require('../borrower/borrower');
const sendMessage = require('../kafka/kafkaProducer');

// Define resolvers for GraphQL queries and mutations
const resolvers = {
  Query: {
    // Resolver for fetching all authors
    authors: async () => await Author.find(),
    // Resolver for fetching all books with author information populated
    books: async () => await Book.find().populate('author'),
    // Resolver for fetching all borrowers
    borrowers: async () => await Borrower.find(),
  },
  Mutation: {
    // Resolver for creating a new author
    createAuthor: async (_, { name }) => {
      const author = new Author({ name });
      await author.save();// Save the new author to the database
      // Send a message to Kafka topic about the author creation event
      await sendMessage('library-events', `Author created: ${author.name}`);
      return author;// Return the created author
    },
    // Resolver for updating an existing author
    updateAuthor: async (_, { id, name }) => {
      const author = await Author.findByIdAndUpdate(id, { name }, { new: true });
      if (!author) throw new Error('Author not found');// Throw error if author is not found
      // Send a message to Kafka topic about the author update event
      await sendMessage('library-events', `Author updated: ${author.name}`);
      return author;// Return the updated author
    },
    // Resolver for deleting an author
    deleteAuthor: async (_, { id }) => {
      const author = await Author.findByIdAndDelete(id);
      if (!author) throw new Error('Author not found'); // Throw error if author is not found
      // Send a message to Kafka topic about the author deletion event
      await sendMessage('library-events', `Author deleted: ${author.name}`);
      return "Author deleted";// Return a success message
    },
    // Resolver for creating a new book
    createBook: async (_, { title, authorId }) => {
      const author = await Author.findById(authorId);
      if (!author) throw new Error('Author not found');// Throw error if author is not found
      const book = new Book({ title, author });
      await book.save(); // Save the new book to the database
      // Send a message to Kafka topic about the book creation event
      await sendMessage('library-events', `Book created: ${book.title}`);
      return book;// Return the created book
    },
    // Resolver for updating an existing book
    updateBook: async (_, { id, title, authorId }) => {
      const author = await Author.findById(authorId);
      if (!author) throw new Error('Author not found'); // Throw error if author is not found
      const book = await Book.findByIdAndUpdate(id, { title, author }, { new: true });
      if (!book) throw new Error('Book not found');// Throw error if book is not found
      // Send a message to Kafka topic about the book update event
      await sendMessage('library-events', `Book updated: ${book.title}`);
      return book; // Return the updated book
    },
    // Resolver for deleting a book
    deleteBook: async (_, { id }) => {
      const book = await Book.findByIdAndDelete(id);
      if (!book) throw new Error('Book not found');// Throw error if book is not found
      // Send a message to Kafka topic about the book deletion event
      await sendMessage('library-events', `Book deleted: ${book.title}`);
      return "Book deleted";
    },
    // Resolver for creating a new borrower
    createBorrower: async (_, { name }) => {
      const borrower = new Borrower({ name });
      await borrower.save();// Save the new borrower to the database
      // Send a message to Kafka topic about the borrower creation event
      await sendMessage('library-events', `Borrower created: ${borrower.name}`);
      return borrower;// Return the created borrower
    },
    // Resolver for updating an existing borrower
    updateBorrower: async (_, { id, name }) => {
      const borrower = await Borrower.findByIdAndUpdate(id, { name }, { new: true });
      if (!borrower) throw new Error('Borrower not found');// Throw error if borrower is not found
      // Send a message to Kafka topic about the borrower update event
      await sendMessage('library-events', `Borrower updated: ${borrower.name}`);
      return borrower;// Return the updated borrower
    },
    // Resolver for deleting a borrower
    deleteBorrower: async (_, { id }) => {
      const borrower = await Borrower.findByIdAndDelete(id);
      if (!borrower) throw new Error('Borrower not found');// Throw error if borrower is not found
      // Send a message to Kafka topic about the borrower deletion event
      await sendMessage('library-events', `Borrower deleted: ${borrower.name}`);
      return "Borrower deleted";// Return a success message
    },
  },
};
// Export the resolvers module
module.exports = resolvers;
