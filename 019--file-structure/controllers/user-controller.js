const fs = require('fs');


const data = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/users.json`)
);

exports.getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        data
    });
}

exports.getUser = (req, res) => {
    const id = req.params.id * 1;

    if (id < 0 || id >= data.length) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid ID!'
        });
        return;
    }

    const result = data.find(item => item.id === id);
    res.status(200).json({
        status: 'success',
        data: result
    });
}