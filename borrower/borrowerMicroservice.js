
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Borrower = require('./borrower');
const connectDB = require('../database'); // Ensure correct path to your database file

// Define the path to the borrower.proto file
const PROTO_PATH = __dirname + '/borrower.proto';// Ensure the file path is correct
// Load the protobuf file and create a package definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
// Load the package definition into the gRPC object
const borrowerProto = grpc.loadPackageDefinition(packageDefinition).borrower;
// Create a new gRPC server instance
const server = new grpc.Server();

// Connect to MongoDB
connectDB();

// Add the BorrowerService to the server and define its methods
server.addService(borrowerProto.BorrowerService.service, {
    // Define the GetBorrower RPC method
  GetBorrower: async (call, callback) => {
    try {
            // Find the borrower by ID
      const borrower = await Borrower.findById(call.request.id);
      if (!borrower) {
                // If borrower is not found, return an error
        return callback(new Error('Borrower not found'));
      }
            // If borrower is found, return the borrower details
      callback(null, { id: borrower.id, name: borrower.name });
    } catch (err) {
            // Handle any errors during the process
      callback(err);
    }
  },
    // Define the CreateBorrower RPC method
  CreateBorrower: async (call, callback) => {
    try {
      const borrower = new Borrower({ name: call.request.name });
      await borrower.save();
      callback(null, { id: borrower.id, name: borrower.name });
    } catch (err) {
      callback(err);
    }
  },
    // Define the UpdateBorrower RPC method
  UpdateBorrower: async (call, callback) => {
    try {
      const borrower = await Borrower.findByIdAndUpdate(
        call.request.id,
        { name: call.request.name },
        { new: true }
      );
      if (!borrower) {
        return callback(new Error('Borrower not found'));
      }
      callback(null, { id: borrower.id, name: borrower.name });
    } catch (err) {
      callback(err);
    }
  },
    // Define the DeleteBorrower RPC method
  DeleteBorrower: async (call, callback) => {
    try {
      const borrower = await Borrower.findByIdAndDelete(call.request.id);
      if (!borrower) {
        return callback(new Error('Borrower not found'));
      }
      callback(null, { id: borrower.id, name: borrower.name });
    } catch (err) {
      callback(err);
    }
  },
});
// Bind the server to a specific address and port
server.bindAsync('localhost:50053', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Borrower gRPC service running at localhost:50053');
    // Start the gRPC server
  server.start();
});
