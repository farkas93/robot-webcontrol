require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const ipAddress = process.env.IP_ADDRESS || '0.0.0.0';
const port = process.env.PORT || 3000;

const topic = "robotControl";

// Serve static files
app.use(express.static('public'));

const mqttEndpoint = `mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_PORT}`
console.log(mqttEndpoint)
const mqttConf = {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD
}
console.log(mqttConf)
// MQTT setup
const mqttClient = mqtt.connect(mqttEndpoint, mqttConf);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(topic, (err) => {
        if (err) {
            console.error(`Failed to subscribe to topic ${topic}:`, err);
        } else {
            console.log(`Subscribed to topic ${topic}`);
        }
    });
});

mqttClient.on('error', (err) => {
    console.error('MQTT connection error:', err);
});

mqttClient.on('message', (topic, message) => {
    console.log(`Message received on topic ${topic}: ${message.toString()}`);
    io.emit('mqttMessage', { topic, message: message.toString() });
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('publish', (data) => {
        console.log(`Publishing message to topic ${topic}: ${data.message}`);
        mqttClient.publish(topic, data.message, (err) => {
            if (err) {
                console.error(`Failed to publish message to topic ${topic}:`, err);
            } else {
                console.log(`Message ${data.message} published to topic ${topic}`);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Endpoint to provide configuration
app.get('/config', (req, res) => {
    res.json({
        webcamStreamURL: process.env.WEBCAM_STREAM_URL,
        webcamStreamPort: process.env.WEBCAM_STREAM_PORT
    });
});

// Start the server
server.listen(port, ipAddress, () => {
    console.log(`Server running on ${ipAddress}:${port}`);
});