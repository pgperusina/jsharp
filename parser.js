var fs = require('fs');
var parser = require('./grammar/jsharp.js');

let tree;

let data = fs.readFileSync('./entrada2.txt');

tree = parser.parse(data.toString());

console.log(tree);

fs.writeFile('AST.json', JSON.stringify(tree), function (err) {
    if (err) return console.log(err);
    console.log('tree > AST.json');
});

