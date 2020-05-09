const AST = require('../AST');

class CasoDefault extends AST {
    bloqueInstrucciones = [];

    constructor(bloqueInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.bloqueInstrucciones = bloqueInstrucciones;
    }
}
module.exports = CasoDefault;