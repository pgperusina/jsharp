const AST = require('../AST');

class Switch extends AST {
    expresion = null;
    listaCasos = [];

    constructor(expresion, listaCasos, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.listaCasos = listaCasos;

    }
}
module.exports = Switch;