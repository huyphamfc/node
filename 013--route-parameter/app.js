const fs = require('fs');
const express = require('express');


const app = express();

const data = JSON.parse(
    fs.readFileSync(`${__dirname}/data.json`)
);

app.get('/api/user/:id', (req, res) => {
    const id = req.params.id * 1;

    if (id < 0 || id >= data.length) {
        res.status(404).json({
            status: 'fail',
            message: "Invalid ID"
        });
        return;
    }

    const query = data.find(item => item.id === id);
    res.status(200).json({
        status: 'success',
        data: query
    });
});

app.listen(8000, err => {
    if (err) throw err;
    console.log('Listening on port 8000 ...');
});