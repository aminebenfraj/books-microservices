// Import the Kafka class from the 'kafkajs' module
const { Kafka } = require('kafkajs');
// Create a new instance of Kafka with client and broker configuration
const kafka = new Kafka({
  clientId: 'library-system',// Client identifier for Kafka connection
  brokers: ['localhost:9092'],// Array of Kafka broker endpoints
});

// Create a Kafka producer instance
const producer = kafka.producer();

// Define an asynchronous function to send messages to Kafka
const sendMessage = async (topic, message) => {
    // Connect the producer to the Kafka cluster
  await producer.connect();
    // Send the message to the specified topic
  await producer.send({
    topic, // Kafka topic to which the message will be sent
    messages: [
      { value: message },// Message to be sent
    ],
  });
    // Disconnect the producer from the Kafka cluster
  await producer.disconnect();
};
// Export the sendMessage function to be used in other parts of the application
module.exports = sendMessage;

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
