document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/config')
        .then(response => response.json())
        .then(config => {
            let streamURL = `${config.webcamStreamURL}`;
            const webcamStreamPort = Number(config.webcamStreamPort);

            if (webcamStreamPort !== 443 && webcamStreamPort !== 80) {
                streamURL = `${streamURL}:${config.webcamStreamPort}`;
            }
            streamURL = `${streamURL}/stream.mjpg`;
            document.getElementById('camera-stream').src = streamURL;

            const socket = io();

            socket.on('connect', function () {
                console.log('Connected to server via WebSocket');
            });

            socket.on('mqttMessage', function (data) {
                console.log(`Received MQTT message: ${data.topic} - ${data.message}`);
            });

            function sendCommand(cmd) {
                const command = parseInt(cmd, 10);
                const msg = JSON.stringify({ command });
                console.log(`Sending command: ${msg}`);
                socket.emit('publish', { message: msg });
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