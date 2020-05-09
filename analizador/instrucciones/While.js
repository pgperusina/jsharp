const AST = require('../AST');

class While extends AST {
    condicion = null;
    listaInstrucciones = [];

    constructor(condicion, listaInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.listaInstrucciones = listaInstrucciones;

    }
}
module.exports = While;