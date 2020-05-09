const AST = require('../AST');

class ExpresionMultiplicativa extends AST {
    izquierdo = null;
    derecho = null;
    operador = null;

    constructor(izquierdo, derecho, operador, fila, columna) {
        super(null, fila, columna);
        this.izquierdo = izquierdo;
        this.derecho = derecho;
        this.operador = operador;
    }
}
module.exports = ExpresionMultiplicativa;