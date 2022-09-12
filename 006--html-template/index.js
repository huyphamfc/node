const fs = require('fs');
const http = require('http');


const html = fs.readFileSync(`${__dirname}/page.html`, 'utf-8');
const subHtml = fs.readFileSync(`${__dirname}/component.html`, 'utf-8');

const rawData = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const data = JSON.parse(rawData);


const fillTemplate = (html, data) => {
    let output = html;

    output = output
        .replace(/{user_id}/g, data.id)
        .replace(/{user_name}/g, data.name)
        .replace(/{user_phone}/g, data.phone)
        .replace(/{user_mail}/g, data.email);

    return output;
}


const server = http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === '/') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const users = data
            .map(user => fillTemplate(subHtml, user))
            .join('');
        const output = html.replace(/{users}/g, users);

        res.end(output);
        return;
    }

    res.writeHead(400, {
        'Context-type': 'text/html'
    });
    res.end(`<p>Page Not Found!</p>`);
});

server.listen(8000, err => {
    if (err) throw err;
    console.log('Listening to the requests on port 8000 ...');
});