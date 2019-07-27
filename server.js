const express = require('express');
const server = express();

server.use(express.json());

server.get('/', (req, res) => res.status(200).json({ success: true, message: "The Realest Blog API" }));

module.exports = server;