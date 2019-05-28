const express = require('express');

const router = require('./router.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
    <h2>Server established</h2>
    `)
})

server.use('/api/posts', router);

module.exports = server;