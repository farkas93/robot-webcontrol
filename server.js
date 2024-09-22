require('dotenv').config();
const express = require('express');
const app = express();
const ipAddress = process.env.IP_ADDRESS || '0.0.0.0';
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/config', (req, res) => {
    res.json({
        mqttServer: process.env.MQTT_SERVER,
        mqttPort: process.env.MQTT_PORT,
        mqttUsername: process.env.MQTT_USER,
        mqttPassword: process.env.MQTT_PASSWORD,
        webcamStreamURL: process.env.WEBCAM_STREAM_URL,
        webcamStreamPort: process.env.WEBCAM_STREAM_PORT
    });
});

app.listen(port, ipAddress, () => {
    console.log(`Server running on ${ipAddress}:${port}`);
});