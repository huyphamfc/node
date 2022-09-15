const fs = require('fs');
const express = require('express');


const app = express();
app.use(express.json());

const data = JSON.parse(
    fs.readFileSync(`${__dirname}/data.json`)
);

app
    .route('/users')
    .get((_, res) => {
        res.status(200).json(data);
    })
    .post((req, res) => {
        data.push({
            id: data.length,
            ...req.body
        });

        fs.writeFile(
            `${__dirname}/data.json`,
            JSON.stringify(data),
            () => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            }
        )
    });

app.listen(8000, err => {
    if (err) throw err;
    console.log('Listening on port 8000 ...');
});