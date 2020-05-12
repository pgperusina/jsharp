const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');


class Return extends AST {
    expresion = null;

    constructor(expresion, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
    }

    validar(tabla, arbol) {
        const result = this.expresion.validar(tabla, arbol);
        if (result instanceof Excepcion) {
            return result;
        }
        this.tipo = result;
        return this.tipo;
    }
}
module.exports = Return;