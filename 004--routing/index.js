const http = require('http');


const server = http.createServer((req, res) => {
    const pathName = req.url;
    if (pathName === '/' || pathName === '/home')
        return res.end(`Hello, I'm a server!`);
    if (pathName === '/products')
        return res.end(`This is the Products.`);

    res.writeHead(404, {
        'Content-type': 'text/html',
        'my-own-header': 'hello-world'
    });
    res.end('<p>Page not found!</p>');
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});