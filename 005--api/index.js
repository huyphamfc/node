const fs = require('fs');
const http = require('http');


const data = fs.readFileSync(
    `${__dirname}/data.json`, 'utf-8'
);

const server = http.createServer((req, res) => {
    const pathName = req.url;
    if (pathName === '/')
        return res.end(`Hello, I'm a sever!`);
    if (pathName === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
        return;
    }

    res.writeHead(404, {
        'Content-type': 'text/html'
    });
    res.end('<p>Page not found.</p>');
});

server.listen(8000, '127.0.0.1', err => {
    if (err) throw err;
    console.log('Listening to the requests on port 8000...');
});