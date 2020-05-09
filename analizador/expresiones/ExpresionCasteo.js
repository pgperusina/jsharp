const AST = require('../AST');

class ExpresionCasteo extends AST {
    tipo = null;
    expresion = null;

    constructor(tipo, expresion, fila, columna) {
        super(null, fila, columna);
        this.tipo = tipo;
        this.expresion = expresion;
    }
}
module.exports = ExpresionCasteo;