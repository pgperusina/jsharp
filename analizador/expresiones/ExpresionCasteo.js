const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Types = require('../tabla/Tipo').Types;
const Tipo = require('../tabla/Tipo').Tipo;


class ExpresionCasteo extends AST {
    tipoCasteo = null;
    expresion = null;

    constructor(tipoCasteo, expresion, fila, columna) {
        super(null, fila, columna);
        this.tipoCasteo = tipoCasteo;
        this.expresion = expresion;
    }

    validar(tabla, arbol) {
        const tipoExpresion = this.expresion.validar(tabla,arbol);
        if (tipoExpresion instanceof Excepcion) {
            return tipoExpresion;
        }
        if (this.tipoCasteo.toLowerCase() == "integer") {
            if (tipoExpresion.toString().toLowerCase() == "double") {
                this.tipo = new Tipo(Types.INTEGER, false, null);
                return this.tipo;
            } else {
                const excepcion = new Excepcion('Semantico', `Error de casteo de tipo '${tipoExpresion.toString()}' hacia '${this.tipoCasteo.toLowerCase()}'.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        } else if (this.tipoCasteo.toLowerCase() == "char") {
            if (tipoExpresion.toString() == "double") {
                this.tipo = new Tipo(Types.CHAR, false, null);
                return this.tipo;
            } else if (tipoExpresion.toString() == "integer") {
                this.tipo = new Tipo(Types.CHAR, false, null);
                return this.tipo;
            } else {
                const excepcion = new Excepcion('Semantico', `Error de casteo de tipo '${tipoExpresion.toString()}' hacia '${this.tipoCasteo.toLowerCase()}'.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        } else {
            const excepcion = new Excepcion('Semantico', `Error de casteo. Tipo '${this.tipoCasteo.toLowerCase()}' no aceptado.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
    }
}
module.exports = ExpresionCasteo;