const fs = require('fs');
const http = require('http');
const url = require('url');


const overview = fs.readFileSync(`${__dirname}/pages/overview.html`, 'utf-8');
const product = fs.readFileSync(`${__dirname}/pages/product.html`, 'utf-8');
const card = fs.readFileSync(`${__dirname}/components/card.html`, 'utf-8');


const rawData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const data = JSON.parse(rawData);


const fillTemplate = (template, data) => {
    let output = template;

    output = output
        .replace(/{product_name}/g, data.productName)
        .replace(/{product_image}/g, data.image)
        .replace(/{product_price}/g, data.price)
        .replace(/{product_place}/g, data.place)
        .replace(/{product_nutrients}/g, data.nutrients)
        .replace(/{product_quantity}/g, data.quantity)
        .replace(/{product_description}/g, data.description)
        .replace(/{product_id}/g, data.id);

    if (data.organic)
        output = output.replace(/{not_organic}/g, 'not-organic');

    return output;
}


const server = http.createServer((req, res) => {
    const pathName = req.url;
    const { pathname, query } = url.parse(pathName, true);

    const createResponse = (code, type, output) => {
        res.writeHead(code, {
            'Content-type': type
        });
        res.end(output);
    }

    if (pathName === '/' || pathName === '/overview') {
        const cards = data
            .map(product => fillTemplate(card, product))
            .join('');
        const html = overview.replace('{product_cards}', cards);

        return createResponse(200, 'text/html', html);
    }

    if (pathName === '/api')
        return createResponse(200, 'application/json', rawData);

    if (pathname === '/product' && query.id) {
        const result = data.find(item => item.id == query.id);
        if (!result)
            return createResponse(400, 'text/html', `<p>Page Not Found!</p>`);

        const html = fillTemplate(product, result);
        return createResponse(200, 'text/html', html);
    }

    return createResponse(400, 'text/html', `<p>Page Not Found!</p>`);
});

server.listen(8000, () => {
    console.log('Listening to the requests on port 8000 ...');
});