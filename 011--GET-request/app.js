const fs = require('fs');
const express = require('express');


const app = express();

const data = JSON.parse(
    fs.readFileSync(`${__dirname}/data.json`)
);

app.get('/api/users', (_, res) => {
    res
        .status(200)
        .json(data);
});

app.listen(8000, err => {
    if (err) throw err;
    console.log('Listening on port 8000 ...');
});