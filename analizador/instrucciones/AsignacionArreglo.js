const AST = require('../AST');

class AsignacionArreglo extends AST {
    id = null;
    posicion = 0;
    valor = null;

    constructor(id, posicion, valor, fila, columna) {
        super(null, fila, columna);
        this.id = id;
        this.posicion = posicion;
        this.valor = valor;
    }
}
module.exports = AsignacionArreglo;