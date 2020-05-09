const AST = require('../AST');

class ExpresionAsignacion extends AST {
    izquierdo = null;
    derecho = null;

    constructor(izquierdo, derecho, fila, columna) {
        super(null, fila, columna);
        this.izquierdo = izquierdo;
        this.derecho = derecho;
    }
}
module.exports = ExpresionAsignacion;