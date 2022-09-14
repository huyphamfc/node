const fs = require('fs');
const express = require('express');


const app = express();

app.use(express.json());

const data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));

app.get('/api', (_, res) => {
    res.status(200).json(data);
});

app.post('/api', (req, res) => {
    const id = data.length;
    data.push({
        id: id,
        ...req.body
    });

    fs.writeFile(`${__dirname}/data.json`, JSON.stringify(data), err => {
        if (err) throw err;
        res.status(201).json({
            status: 'success',
            data: data
        });
    });
});

app.listen(8000, err => {
    if (err) throw err;
    console.log('Listening on the port 8000 ...');
});