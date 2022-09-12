const fs = require('fs');
const http = require('http');


const overview = fs.readFileSync(`${__dirname}/pages/overview.html`, 'utf-8');
const product = fs.readFileSync(`${__dirname}/pages/product.html`, 'utf-8');


const server = http.createServer((req, res) => {
    const pathName = req.url;
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        res.end(overview);
        return;
    }
    if (pathName === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        res.end(product);
        return;
    }

    res.writeHead(400, {
        'Context-type': 'text/html'
    });
    res.end(`<p>Page Not Found!</p>`);
});

server.listen(8000, () => {
    console.log('Listening to the requests on port 8000 ...');
})