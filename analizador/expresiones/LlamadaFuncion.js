const AST = require('../AST');

class LlamadaFuncion extends AST {
    expresion = null;
    listaArgumentos = [];

    constructor(expresion, listaArgumentos, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.listaArgumentos = listaArgumentos;
    }
}
module.exports = LlamadaFuncion;