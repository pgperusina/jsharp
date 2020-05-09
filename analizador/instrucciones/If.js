const AST = require('../AST');

class If extends AST {
    condicion = null;
    bloqueInstrucciones = [];

    constructor(condicion, bloqueInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.bloqueInstrucciones = bloqueInstrucciones;
    }
}
module.exports = If;