const http = require('http');
const url = require('url');


const server = http.createServer((req, res) => {
    const obj = JSON.stringify(url.parse(req.url, true));

    res.writeHead(200, {
        'Content-type': 'application/json'
    });
    res.end(obj);
});

server.listen(8000, err => {
    if (err) throw err;
    console.log('Listening to the requests on port 8000 ...');
})