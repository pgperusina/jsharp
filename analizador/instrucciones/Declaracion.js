const AST = require('../AST');

class Declaracion extends AST {
    calificadorTipo = null;
    id = null;
    valor = null;

    constructor(tipo, calificadorTipo, id, valor, fila, columna) {
        super(tipo, fila, columna);
        this.calificadorTipo = calificadorTipo;
        this.id = id;
        this.valor = valor;
    }
}
module.exports = Declaracion;