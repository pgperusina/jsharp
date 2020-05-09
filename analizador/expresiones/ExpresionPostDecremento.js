const AST = require('../AST');

class ExpresionPostDecremento extends AST {
    expresion = null;

    constructor(expresion, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
    }
}
module.exports = ExpresionPostDecremento;