const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Book = require('./book'); // Make sure this path is correct
const Author = require('../author/author'); // Make sure this path is correct

// Define the path to the book.proto file
const PROTO_PATH = __dirname + '/book.proto';
// Load the protobuf file and create a package definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,// Keep field casing as defined in the .proto file
  longs: String,// Convert long values to strings
  enums: String,// Convert enum values to strings
  defaults: true, // Use default values for fields if not set
  oneofs: true,// Use the oneof feature
});

// Load the package definition into the gRPC object
const bookProto = grpc.loadPackageDefinition(packageDefinition).book;
// Create a new gRPC server instance
const server = new grpc.Server();
// Add the BookService to the server and define its methods
server.addService(bookProto.BookService.service, {
  GetBook: async (call, callback) => {
    try {
      const book = await Book.findById(call.request.id).populate('author');
      if (!book) {
        return callback(new Error('Book not found'));
      }
      callback(null, { id: book.id, title: book.title, authorId: book.author.id });
    } catch (err) {
      callback(err);
    }
  },

  // Define the CreateBook RPC method
  CreateBook: async (call, callback) => {
    try {
      const author = await Author.findById(call.request.authorId);
      if (!author) {
        return callback(new Error('Author not found'));
      }
      const book = new Book({ title: call.request.title, author });
      await book.save();
      callback(null, { id: book.id, title: book.title, authorId: author.id });
    } catch (err) {
      callback(err);
    }
  },

  // Define the UpdateBook RPC method
  UpdateBook: async (call, callback) => {
    try {
      const author = await Author.findById(call.request.authorId);
      if (!author) {
        return callback(new Error('Author not found'));
      }
      const book = await Book.findByIdAndUpdate(
        call.request.id,
        { title: call.request.title, author },
        { new: true }
      ).populate('author');
      if (!book) {
        return callback(new Error('Book not found'));
      }
      callback(null, { id: book.id, title: book.title, authorId: book.author.id });
    } catch (err) {
      callback(err);
    }
  },
  // Define the DeleteBook RPC method
  DeleteBook: async (call, callback) => {
    try {
      const book = await Book.findByIdAndDelete(call.request.id);
      if (!book) {
        return callback(new Error('Book not found'));
      }
      callback(null, { id: book.id, title: book.title, authorId: book.author.id });
    } catch (err) {
      callback(err);
    }
  },
});
// Bind the server to a specific address and port
server.bindAsync('localhost:50052', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Book gRPC service running at localhost:50052');
  // Start the gRPC server
  server.start();
});
