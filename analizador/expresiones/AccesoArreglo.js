const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tipo = require('../tabla/Tipo').Tipo;

class AccesoArreglo extends AST {
    expresion = null;
    posicion = 0;

    constructor(expresion, posicion, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.posicion = posicion;
    }

    validar(tabla, arbol) {
        const tipoExpresion = this.expresion.validar(tabla, arbol);
        if (tipoExpresion instanceof Excepcion) {
            return tipoExpresion;
        }
        const result = this.posicion.validar(tabla, arbol);
        if (result instanceof Excepcion) {
            return result;
        }
        if (tipoExpresion.nombreStruct != null) {
            this.tipo = tipoExpresion;
        }

        if (result.toString().toLowerCase() != "integer") {
            const excepcion = new Excepcion("Semántico", `El tipo de la posición de un arreglo debe de ser 'integer'`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        this.tipo = new Tipo(tipoExpresion.tipo, false, tipoExpresion.nombreStruct);

        return this.tipo;
        //const tipoExpresion = tabla.getVariable(this.expresion.id);
    }
}
module.exports = AccesoArreglo;