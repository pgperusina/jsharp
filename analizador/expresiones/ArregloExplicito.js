const AST = require('../AST');

class ArregloExplicito extends AST {
    listaValores = [];

    constructor(listaValores, fila, columna) {
        super(null, fila, columna);
        this.listaValores = listaValores
    }
}
module.exports = ArregloExplicito;