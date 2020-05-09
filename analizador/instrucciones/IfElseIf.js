const AST = require('../AST');

class IfElseIf extends AST {
    condicion = null;
    bloqueInstrucciones = [];
    if2 = null;

    constructor(condicion, bloqueInstrucciones, if2, fila, columna) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.bloqueInstrucciones = bloqueInstrucciones;
        this.if2 = if2;
    }
}
module.exports = IfElseIf;