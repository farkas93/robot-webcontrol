document.addEventListener('DOMContentLoaded', (event) => {
    // Fetch the configuration
    fetch('/config')
        .then(response => response.json()) // Parse the JSON from the response
        .then(config => {
            // Now that we have the config, we can connect to the MQTT broker
            const client = mqtt.connect(`ws://${config.mqttServer}:${config.mqttPort}`);

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
                const msg = JSON.stringify({ command });
                console.log(`Sending command: ${msg}`);
                client.publish(topic, msg);
            }

            // Setup button event listeners
            document.querySelectorAll('button').forEach((button) => {
                const startEvent = (e) => {
                    e.preventDefault(); // Prevent the default event
                    const command = button.getAttribute('data-command');
                    sendCommand(command); // Send the command associated with the button
                };

                const endEvent = (e) => {
                    e.preventDefault(); // Prevent the default event
                    sendCommand(-1); // Send the stop command
                };

                // Listen for both mouse and touch events
                button.addEventListener('mousedown', startEvent);
                button.addEventListener('touchstart', startEvent);
                button.addEventListener('mouseup', endEvent);
                button.addEventListener('touchend', endEvent);
            });
        })
        .catch(error => {
            console.error('Failed to load config:', error);
        });
});