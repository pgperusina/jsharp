const AST = require('../AST');

class Break extends AST {

    constructor(fila, columna) {
        super(null, fila, columna);
    }
}
module.exports = Break;