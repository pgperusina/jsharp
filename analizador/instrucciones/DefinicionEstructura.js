const AST = require('../AST');

class DefinicionEstructura extends AST {
    id = null;
    propiedades = [];

    constructor(id, propiedades, fila, columna) {
        super(null, fila, columna);
        this.id = id;
        this.propiedades = propiedades;
    }

}
module.exports = DefinicionEstructura;