document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/config')
        .then(response => response.json())
        .then(config => {
            console.log(config);
            const streamURL = `${config.webcamStreamURL}:${config.webcamStreamPort}/stream.mjpg`;
            document.getElementById('camera-stream').src = streamURL;

            const client = mqtt.connect(`ws://${config.mqttServer}:${config.mqttPort}`, {
                username: config.mqttUsername,
                password: config.mqttPassword
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
                const msg = JSON.stringify({ command });
                console.log(`Sending command: ${msg}`);
                client.publish(topic, msg);
            }

            document.querySelectorAll('button').forEach((button) => {
                const startEvent = (e) => {
                    e.preventDefault();
                    const command = button.getAttribute('data-command');
                    sendCommand(command);
                };

                const endEvent = (e) => {
                    e.preventDefault();
                    sendCommand(-1);
                };

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