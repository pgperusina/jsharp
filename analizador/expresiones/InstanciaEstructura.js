const AST = require('../AST');

class InstanciaEstructura extends AST {
    idEstructura = null;

    constructor(idEstructura, fila, columna) {
        super(null, fila, columna);
        this.idEstructura = idEstructura;
    }
}
module.exports = InstanciaEstructura;