const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./database');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/schema');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const sendMessage = require('./kafka/kafkaProducer'); // Ensure correct import

// Initialize Express application
const app = express();
// Connect to the database
connectDB();

// Middleware setup
app.use(cors());// Enable Cross-Origin Resource Sharing
app.use(bodyParser.json());// Parse JSON requests

// Load Protos
const borrowerProtoPath = __dirname + '/borrower/borrower.proto';
const borrowerPackageDefinition = protoLoader.loadSync(borrowerProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
// Create a gRPC client for the Borrower service
const borrowerProto = grpc.loadPackageDefinition(borrowerPackageDefinition).borrower;

const borrowerClient = new borrowerProto.BorrowerService('localhost:50053', grpc.credentials.createInsecure());

// Define REST API endpoints for Borrower service
app.post('/borrower', (req, res) => {
  borrowerClient.CreateBorrower(req.body, async (error, response) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      await sendMessage('library-events', `Borrower created: ${response.name}`);
      res.send(response);
    }
  });
});

app.get('/borrower/:id', (req, res) => {
  borrowerClient.GetBorrower({ id: req.params.id }, (error, response) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.send(response);
    }
  });
});

app.put('/borrower/:id', (req, res) => {
  borrowerClient.UpdateBorrower({ id: req.params.id, name: req.body.name }, async (error, response) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      await sendMessage('library-events', `Borrower updated: ${response.name}`);
      res.send(response);
    }
  });
});

app.delete('/borrower/:id', (req, res) => {
  borrowerClient.DeleteBorrower({ id: req.params.id }, async (error, response) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      await sendMessage('library-events', `Borrower deleted: ${response.name}`);
      res.send(response);
    }
  });
});

// GraphQL Endpoint setup
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });
// Start the Express server
const port = 3001;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
  console.log(`GraphQL endpoint available at http://localhost:${port}${server.graphqlPath}`);
});
// Documentation in Comments:
// Middleware Setup:

// cors() enables Cross-Origin Resource Sharing.
// bodyParser.json() parses JSON requests.
// gRPC Client Setup:

// Protobuf files are loaded and used to create a gRPC client for the Borrower service.
// REST API Endpoints:

// /borrower - POST, GET, PUT, DELETE endpoints to interact with Borrower service via gRPC.
// Each endpoint handles gRPC calls to create, retrieve, update, or delete a borrower.
// GraphQL Endpoint Setup:

// Apollo Server is set up with type definitions and resolvers.
// Middleware is applied to the Express app to create a GraphQL endpoint.
// Server Start:

// Express server listens on port 3001.
// Console logs indicate the server is running and provide the GraphQL endpoint URL.