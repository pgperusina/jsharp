const AST = require('../AST');

class IfElse extends AST {
    condicion = null;
    bloqueInstruccionesTrue = [];
    bloqueInstruccionesFalse = [];

    constructor(condicion, bloqueInstruccionesTrue, bloqueInstruccionesFalse, fila, columna) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.bloqueInstruccionesTrue = bloqueInstruccionesTrue;
        this.bloqueInstruccionesFalse = bloqueInstruccionesFalse;
    }
}
module.exports = IfElse;