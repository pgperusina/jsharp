const AST = require('../AST');

class ParametroPorValor extends AST {
    tipo = null;
    id = null;

    constructor(tipo, id, fila, columna) {
        super(tipo, fila, columna);
        this.tipo = tipo;
        this.id = id;
    }
}
module.exports = ParametroPorValor;