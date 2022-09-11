const fs = require('fs');


fs.readFile('./text/input-1.txt', 'utf-8', (err, data1) => {
    if (err) throw err;
    console.log(data1);

    fs.readFile(`./text/${data1}.txt`, 'utf-8', (err, data2) => {
        if (err) throw err;
        console.log(data2);

        fs.readFile(`./text/${data2}.txt`, 'utf-8', (err, data3) => {
            if (err) throw err;
            console.log(data3);

            fs.writeFile(`./text/final.txt`, `${data1}\n${data2}\n${data3}`, err => {
                if (err) throw err;
                console.log('File written.');
            });
        });
    });
});

console.log('Reading file...');