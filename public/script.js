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
        // Handle mouse down or touch start
        const startEvent = (e) => {
            // Prevent the default mouse event from firing if this is a touch event
            e.preventDefault();
            const command = button.getAttribute('data-command');
            sendCommand(command); // Send the command associated with the button
        };

        // Handle mouse up or touch end
        const endEvent = (e) => {
            // Prevent the default mouse event from firing if this is a touch event
            e.preventDefault();
            sendCommand(-1); // stop command
        };

        // Listen for both mouse and touch events
        button.addEventListener('mousedown', startEvent);
        button.addEventListener('touchstart', startEvent);
        button.addEventListener('mouseup', endEvent);
        button.addEventListener('touchend', endEvent);
    });
});
