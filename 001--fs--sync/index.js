const fs = require('fs');


const textInput = fs.readFileSync('./text/input.txt', 'utf-8');


const textOutput = `- File: input.txt
- Date: ${new Date()}.
- Content: ${textInput}.`;

fs.writeFileSync('./text/output.txt', textOutput);