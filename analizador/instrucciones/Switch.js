const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');

class Switch extends AST {
    expresion = null;
    listaCasos = [];

    constructor(expresion, listaCasos, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.listaCasos = listaCasos;
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
            const excepcion = new Excepcion("Semántico", `La expresión de la instrucción Switch es de un tipo no soportado '${tipoExpresion.toString()}'.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }

        for (const caso of this.listaCasos) {
            let result = caso.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
            if (result == "default") {
                // Caso default
                continue;
            }
            if (result.toString().toLowerCase() != tipoExpresion.toString().toLowerCase()) {
                const excepcion = new Excepcion("Semántico", `La expresión de la instrucción Switch y el tipo de uno de sus casos, no coinciden. ['${tipoExpresion.toString()}' - '${result.toString()}'].`, caso.fila, caso.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        };
        return null;
    }
}
module.exports = Switch;