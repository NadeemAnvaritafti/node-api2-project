const express = require('express');

const dbRouter = require('../data/db-router'); // 1st step

const server = express();

server.use(express.json()); // We don't technically need this because we're not parsing any JSON in this file anymore --> been moved to hubs-router.js

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});


server.use('/api/posts', dbRouter); // 2nd step

// export default server; // ES6 modules
module.exports = server;    // <<<<< export the server