const AST = require('../AST');

class Caso extends AST {
    expresion = null;
    bloqueInstrucciones = [];

    constructor(expresion, bloqueInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.bloqueInstrucciones = bloqueInstrucciones;
    }
}
module.exports = Caso;