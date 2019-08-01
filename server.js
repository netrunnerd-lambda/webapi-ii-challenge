const express = require('express');
const server = express();

const postsRouter = require('./routes/posts');

server.use(express.json());

server.get('/', (req, res) => res.status(200).json({ success: true, message: "The Realest Blog API" }));
server.use('/api/posts', postsRouter);

module.exports = server;