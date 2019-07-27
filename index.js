const server = require('./server');
const port = 4000;

server.listen(port, _ => console.log(`Server listening on port - ${port}`));