const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

// API fir for interacting with MongoDB
const apiRoutes = require('./server/routes/api');

// Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extented: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location
app.use('/api', apiRoutes);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

if (!module.parent) server.listen(port, () => {
    console.log('Started Running on localhost: '+ port);
});

module.exports = {
    app
};