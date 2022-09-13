const fs = require('fs');


setTimeout(() => console.log('Timer'), 0);

setImmediate(() => console.log('setImmediate'));

fs.readFile(`${__dirname}/text.txt`, 'utf-8', (err, data) => {
    Promise.resolve('Promise')
        .then(data => console.log(data));

    process.nextTick(() => console.log('process.nextTick()'));

    if (err) throw err;
    console.log(data);
    console.log('--------------------');
});

console.log('Event Loop in NodeJS:');


// Event Loop in NodeJS:
// Timer
// setImmediate
// I/O Polling
// --------------------
// process.nextTick()
// Promise