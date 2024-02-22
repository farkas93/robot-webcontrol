document.addEventListener('DOMContentLoaded', (event) => {
    const client = mqtt.connect('ws://192.168.1.122:9001', {
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        clean: true
    });

    client.on('connect', function () {
        console.log('Connected to MQTT broker via WebSocket');
    });

    client.on('error', function (error) {
        console.error('Connection error:', error);
    });

    client.on('close', function () {
        console.log('Connection closed');
    });

    const topic = "robotControl";

    function sendCommand(cmd) {
        const command = parseInt(cmd, 10);
        msg = JSON.stringify({ command })
        console.log(`Sending command: ${msg}`);
        client.publish(topic, msg);
    }

    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('mousedown', () => {
            const command = button.getAttribute('data-command');
            sendCommand(command); // Send the command associated with the button
        });
        button.addEventListener('mouseup', () => sendCommand(-1)); // stop command
    });
});
