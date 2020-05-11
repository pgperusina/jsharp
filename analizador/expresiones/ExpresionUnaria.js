const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Types = require('../tabla/Tipo').Types;


class ExpresionUnaria extends AST {
    expresion = null;
    operador = null;

    constructor(expresion, operador, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.operador = operador;
    }

    validar(tabla, arbol) {
        const tipo = this.expresion.validar(tabla, arbol);
        if (tipo instanceof Excepcion) {
            return tipo;
        }

        if (this.operador === "-") {
            if (tipo.toString() == 'integer' || tipo.toString() == 'double') {
                this.tipo = tipo;
                return this.tipo;
            } else {
                const excepcion = new Excepcion('Semantico', `Operador unario ${this.operador} no es compatible con el tipo ${tipo.toString()}`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        } else if (this.operador === "!") {
            if (tipo.toString() == 'boolean') {
                this.tipo = tipo;
                return this.tipo;
            } else {
                const excepcion = new Excepcion('Semantico', `Operador unario ${this.operador} no es compatible con el tipo ${tipo.toString()}`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        }
    }
}
module.exports = ExpresionUnaria;