const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const cors = require('cors');

// API fir for interacting with MongoDB
const apiRoutes = require('./server/routes/api');

// cors
app.use(cors());

// Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
//     next();
// });

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