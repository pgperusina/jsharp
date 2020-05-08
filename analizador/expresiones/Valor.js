
const AST = require('../AST');
class Valor extends AST {

    valor = null;

    constructor(tipo, valor, fila, columna) {
        super(tipo, fila, columna);
        this.valor = valor;
    }

    validarTipos(tabla, arbol) {
        return this.tipo;
    }
}

module.exports = Valor;