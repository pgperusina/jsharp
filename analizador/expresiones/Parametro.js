const AST = require('../AST');

class Parametro extends AST {
    tipo = null;
    id = null;
    valorInicial = null;

    constructor(tipo, id, valorInicial, fila, columna) {
        super(tipo, fila, columna);
        this.tipo = tipo;
        this.id = id;
        this.valorInicial = valorInicial;
    }
}
module.exports = Parametro;