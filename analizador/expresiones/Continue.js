const AST = require('../AST');

class Continue extends AST {

    constructor(fila, columna) {
        super(null, fila, columna);
    }
}
module.exports = Continue;