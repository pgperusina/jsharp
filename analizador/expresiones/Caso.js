const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Return = require('../expresiones/Return');
const Continue = require('../expresiones/Continue');

class Caso extends AST {
    expresion = null;
    bloqueInstrucciones = [];

    constructor(expresion, bloqueInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.bloqueInstrucciones = bloqueInstrucciones;
    }

    validar(tabla, arbol) {
        let tipoExpresion = this.expresion.validar(tabla, arbol);
        if (tipoExpresion instanceof Excepcion) {
            return tipoExpresion;
        }
        if (tipoExpresion.toString().toLowerCase() != "string"
            && tipoExpresion.toString().toLowerCase() != "integer"
            && tipoExpresion.toString().toLowerCase() != "double"
            && tipoExpresion.toString().toLowerCase() != "char"
            && tipoExpresion.toString().toLowerCase() != "boolean") {
            const excepcion = new Excepcion("Semántico", `La expresión del Caso de la instrucción Switch '${tipoExpresion.toString()}' no es soportada.`, this.expresion.fila, this.expresion.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }

        this.bloqueInstrucciones.map(m => {
            let result = m.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });

        this.tipo = tipoExpresion;
        return tipoExpresion;
    }
}
module.exports = Caso;