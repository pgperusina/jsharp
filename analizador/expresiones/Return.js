const AST = require('../AST');

class Return extends AST {
    expresion = null;

    constructor(expresion, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
    }
}
module.exports = Return;