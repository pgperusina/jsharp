const AST = require('../AST');

class ExpresionPostIncremento extends AST {
    expresion = null;

    constructor(expresion, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
    }
}
module.exports = ExpresionPostIncremento;