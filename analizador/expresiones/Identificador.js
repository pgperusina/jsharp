const AST = require('../AST');

class Identificador extends AST {
    id = null;
    constructor(id, fila, columna) {
        super(null, fila, columna);
        this.id = id;
    }

    validarTipos(tabla, arbol) {
        return this.tipo;
    }
}
module.exports = Identificador;