const AST = require('../AST');

class Arreglo extends AST {
    tipo = null;
    tamano = 0;

    constructor(tipo, tamano, fila, columna) {
        super(null, fila, columna);
        this.tipo = tipo;
        this.tamano = tamano;
    }
}
module.exports = Arreglo;