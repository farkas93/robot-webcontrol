const express = require('express');
const app = express();

const fs = require('fs');
const config = require('./config.json');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Route to serve config.json content
app.get('/config', (req, res) => {
  fs.readFile('config.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading configuration file');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.listen(config.port, config.ipAddress, () => {
  console.log(`Example app listening on all IP addresses on port ${config.port}`);
});
