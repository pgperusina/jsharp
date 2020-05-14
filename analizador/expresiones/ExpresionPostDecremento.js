const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Identificador = require('../expresiones/Identificador');

class ExpresionPostDecremento extends AST {
    expresion = null;

    constructor(expresion, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
    }

    validar(tabla, arbol) {
        const tipo = this.expresion.validar(tabla, arbol);
        if (tipo instanceof Excepcion) {
            return tipo;
        }

        if (this.expresion instanceof Identificador) {
            if (tipo.toString().toLowerCase() == 'integer' || tipo.toString().toLowerCase() == 'double') {
                this.tipo = tipo;
                return this.tipo;
            } else {
                const excepcion = new Excepcion('Semantico', `Operador de decremento '--' no es compatible con el tipo ${tipo.toString()}`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        } else {
            const excepcion = new Excepcion('Semantico', `Operador de decremento '--' solo puede utilizarse en identificadores.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
    }
}
module.exports = ExpresionPostDecremento;