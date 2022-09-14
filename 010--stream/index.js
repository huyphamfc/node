const fs = require('fs');
const http = require('http');


const server = http.createServer();

server.on('request', (_, res) => {
    const readable = fs.createReadStream(`${__dirname}/text.txt`);
    readable.pipe(res);
});

server.listen(8000, () => {
    console.log('Listening ...');
});