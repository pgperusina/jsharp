const AST = require('../AST');

class Parametro extends AST {
    tipo = null;
    id = null;

    constructor(tipo, id, fila, columna) {
        super(tipo, fila, columna);
        this.tipo = tipo;
        this.id = id;
    }
}
module.exports = Parametro;