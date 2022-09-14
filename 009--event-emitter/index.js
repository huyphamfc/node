const EventEmitter = require('events');


const emitter = new EventEmitter();

emitter.on('customEvent', () =>
    console.log('The Custom Event: Listener 1.')
);

emitter.on('customEvent', () =>
    console.log('The Custom Event: Listener 2.')
);

emitter.on('customEvent', arg =>
    console.log(`The Custom Event: ${arg} - argument.`)
);

emitter.emit('customEvent', 'Hello');

// The Custom Event: Listener 1.
// The Custom Event: Listener 2.
// The Custom Event: Hello - argument.