const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Author = require('./author');

// Define the path to the author.proto file
const PROTO_PATH = __dirname + '/author.proto'; // Ensure the file path is correct

// Load the protobuf file and create a package definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,// Keep field casing as defined in the .proto file
  longs: String,// Convert long values to strings
  enums: String,// Convert enum values to strings
  defaults: true,// Use default values for fields if not set
  oneofs: true,// Use the oneof feature
});

// Load the package definition into the gRPC object
const authorProto = grpc.loadPackageDefinition(packageDefinition).author;

// Create a new gRPC server instance
const server = new grpc.Server();

// Add the AuthorService to the server and define its methods
server.addService(authorProto.AuthorService.service, {
  GetAuthor: async (call, callback) => {
    try {
      const author = await Author.findById(call.request.id);
      if (!author) {
        return callback(new Error('Author not found'));
      }
      callback(null, { id: author.id, name: author.name });
    } catch (err) {
      callback(err);
    }
  },


  // Define the CreateAuthor RPC method
  CreateAuthor: async (call, callback) => {
    try {
      const author = new Author({ name: call.request.name });
      await author.save();
      callback(null, { id: author.id, name: author.name });
    } catch (err) {
      callback(err);
    }
  },

  // Define the UpdateAuthor RPC method
  UpdateAuthor: async (call, callback) => {
    try {
      const author = await Author.findByIdAndUpdate(call.request.id, { name: call.request.name }, { new: true });
      if (!author) {
        return callback(new Error('Author not found'));
      }
      callback(null, { id: author.id, name: author.name });
    } catch (err) {
      callback(err);
    }
  },

  // Define the DeleteAuthor RPC method
  DeleteAuthor: async (call, callback) => {
    try {
      const author = await Author.findByIdAndDelete(call.request.id);
      if (!author) {
        return callback(new Error('Author not found'));
      }
      callback(null, { id: author.id, name: author.name });
    } catch (err) {
      callback(err);
    }
  },
});

// Bind the server to a specific address and port
server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Author gRPC service running at localhost:50051');
  // Start the gRPC server
  server.start();
});
