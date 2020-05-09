const AST = require('../AST');

class For extends AST {
    inicio = null;
    condicion = null;
    final = null;
    listaInstrucciones = [];

    constructor(inicio, condicion, final, listaInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.inicio = inicio;
        this.condicion = condicion;
        this.final = final;
        this.listaInstrucciones = listaInstrucciones;

    }
}
module.exports = For;