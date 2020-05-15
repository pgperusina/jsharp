const AST = require('../AST');

class Continue extends AST {

    constructor(fila, columna) {
        super(null, fila, columna);
    }

    validar(tabla, arbol) {
        return null;
    }
}
module.exports = Continue;