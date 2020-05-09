const AST = require('../AST');

class ExpresionUnaria extends AST {
    expresion = null;
    operador = null;

    constructor(expresion, operador, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.operador = operador;
    }
}
module.exports = ExpresionUnaria;