const AST = require('../AST');

class AccesoArreglo extends AST {
    expresion = null;
    posicion = 0;

    constructor(expresion, posicion, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.posicion = posicion;
    }
}
module.exports = AccesoArreglo;