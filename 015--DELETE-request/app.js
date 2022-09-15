const fs = require('fs');
const express = require('express');


const app = express();
app.use(express.json());

const data = JSON.parse(
    fs.readFileSync(`${__dirname}/data.json`)
);

app.delete('/user/:id', (req, res) => {
    const id = req.params.id * 1;

    if (id < 0 || id >= data.length) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
        return;
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

app.listen(8000, err => {
    if (err) throw err;
    console.log('Listening on port 8000 ...');
});