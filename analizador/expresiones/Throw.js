const AST = require('../AST');

class Throw extends AST {
    tipoExcepcion = null;

    constructor(tipoExcepcion, fila, columna) {
        super(null, fila, columna);
        this.tipoExcepcion = tipoExcepcion;
    }
}
module.exports = Throw;