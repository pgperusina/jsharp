const AST = require('../AST');

class AccesoPropiedadEstructura extends AST {
    expresion = null;
    id = null;

    constructor(expresion, id, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.id = id;
    }
}
module.exports = AccesoPropiedadEstructura;