// Import the Kafka class from the 'kafkajs' module
const { Kafka } = require('kafkajs');

// Create a new instance of Kafka with client and broker configuration
const kafka = new Kafka({
  clientId: 'library-system', // Client identifier for Kafka connection
  brokers: ['localhost:9092']// Array of Kafka broker endpoints
});

// Create a Kafka consumer instance with group configuration
const consumer = kafka.consumer({ groupId: 'library-group' });

// Define an asynchronous function to run the Kafka consumer
const run = async () => {
    // Connect the consumer to the Kafka cluster
  await consumer.connect();
    // Subscribe the consumer to a specific topic with option to read from the beginning
  await consumer.subscribe({ topic: 'library-events', fromBeginning: true });

    // Start consuming messages from the subscribed topic
  await consumer.run({
        // Define the callback function to handle each consumed message
    eachMessage: async ({ topic, partition, message }) => {
            // Log the value of the consumed message
      console.log({
        value: message.value.toString(),// Convert message value to string and log
      });
    },
  });
};
// Call the run function and handle any errors
run().catch(console.error);
// Documentation in Comments:
// Kafka Configuration:

// The clientId identifies the client connecting to Kafka.
// The brokers array contains Kafka broker endpoints.
// Consumer Configuration:

// The groupId specifies the consumer group to which the consumer belongs.
// Connecting Consumer to Kafka:

// The connect() method establishes a connection to the Kafka cluster.
// Subscribing to Topic:

// The subscribe() method subscribes the consumer to a specific topic.
// The fromBeginning: true option ensures that messages are consumed from the beginning of the topic.
// Consuming Messages:

// The run() method starts consuming messages from the subscribed topic.
// The eachMessage callback function handles each consumed message.
// Handling Errors:

// The catch() method catches and logs any errors that occur during execution.