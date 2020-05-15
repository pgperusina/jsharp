const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Return = require('../expresiones/Return');
const Continue = require('../expresiones/Continue');

class CasoDefault extends AST {
    bloqueInstrucciones = [];

    constructor(bloqueInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.bloqueInstrucciones = bloqueInstrucciones;
    }

    validar(tabla, arbol) {
        this.bloqueInstrucciones.map(m => {
            let result = m.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });

        return "default";
    }
}
module.exports = CasoDefault;