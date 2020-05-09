const AST = require('../AST');

class DoWhile extends AST {
    condicion = null;
    listaInstrucciones = [];

    constructor(condicion, listaInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.listaInstrucciones = listaInstrucciones;

    }
}
module.exports = DoWhile;