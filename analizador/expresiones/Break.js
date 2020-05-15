const AST = require('../AST');

class Break extends AST {

    constructor(fila, columna) {
        super(null, fila, columna);
    }

    validar(tabla, arbol) {
        return null;
    }
}
module.exports = Break;