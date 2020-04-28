var fs = require('fs');
var parser = require('./grammar/jsharp.js');

fs.readFile('./entrada.txt', (err, data) => {
    if (err) throw err;
    parser.parse(data.toString());
});