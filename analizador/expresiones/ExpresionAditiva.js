const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tipo = require('../tabla/Tipo').Tipo;
const Types = require('../tabla/Tipo').Types;

class ExpresionAditiva extends AST {
    izquierdo = null;
    derecho = null;
    operador = null;

    constructor(izquierdo, operador, derecho, fila, columna) {
        super(null, fila, columna);
        this.izquierdo = izquierdo;
        this.derecho = derecho;
        this.operador = operador;
    }

    validar(tabla, arbol) {
        const tipoIzquierdo = this.izquierdo.validar(tabla, arbol);
        if (tipoIzquierdo instanceof Excepcion) {
            return tipoIzquierdo;
        }
        const tipoDerecho = this.derecho.validar(tabla,arbol);
        if (tipoDerecho instanceof Excepcion) {
            return tipoDerecho;
        }

        if (this.operador === "+") {
            if (tipoIzquierdo.toString() == "integer" && tipoDerecho.toString() == "integer" ||
                tipoIzquierdo.toString() == "integer" && tipoDerecho.toString() == "char" ||
                tipoIzquierdo.toString() == "char" && tipoDerecho.toString() == "integer" ||
                tipoIzquierdo.toString() == "char" && tipoDerecho.toString() == "char") {
                this.tipo = new Tipo(Types.INTEGER, false, null);
                return this.tipo;
            } else if (tipoIzquierdo.toString() == "integer" && tipoDerecho.toString() == "double" ||
                tipoIzquierdo.toString() == "double" && tipoDerecho.toString() == "integer" ||
                tipoIzquierdo.toString() == "double" && tipoDerecho.toString() == "char" ||
                tipoIzquierdo.toString() == "char" && tipoDerecho.toString() == "double" ||
                tipoIzquierdo.toString() == "double" && tipoDerecho.toString() == "double") {
                this.tipo = new Tipo(Types.DOUBLE, false, null);
                return this.tipo;
            } else if (tipoIzquierdo.toString() == "integer" && tipoDerecho.toString() == "string" ||
                tipoIzquierdo.toString() == "string" && tipoDerecho.toString() == "integer" ||
                tipoIzquierdo.toString() == "double" && tipoDerecho.toString() == "string" ||
                tipoIzquierdo.toString() == "string" && tipoDerecho.toString() == "double" ||
                tipoIzquierdo.toString() == "char" && tipoDerecho.toString() == "string" ||
                tipoIzquierdo.toString() == "string" && tipoDerecho.toString() == "char" ||
                tipoIzquierdo.toString() == "char" && tipoDerecho.toString() == "char" ||
                tipoIzquierdo.toString() == "string" && tipoDerecho.toString() == "boolean" ||
                tipoIzquierdo.toString() == "boolean" && tipoDerecho.toString() == "string" ||
                tipoIzquierdo.toString() == "string" && tipoDerecho.toString() == "string") {
                this.tipo = new Tipo(Types.STRING, false, null);
                return this.tipo;
            } else {
                const excepcion = new Excepcion("Semántico", `Los tipos ${tipoIzquierdo.toString()} y ${tipoDerecho.toString()} no son compatibles con el operador ${this.operador}.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        } else if (this.operador === "-") {
            if (tipoIzquierdo.toString() == "integer" && tipoDerecho.toString() == "integer" ||
                tipoIzquierdo.toString() == "integer" && tipoDerecho.toString() == "char" ||
                tipoIzquierdo.toString() == "char" && tipoDerecho.toString() == "integer" ||
                tipoIzquierdo.toString() == "char" && tipoDerecho.toString() == "char") {
                this.tipo = new Tipo(Types.INTEGER, false, null);
                return this.tipo;
            } else if (tipoIzquierdo.toString() == "integer" && tipoDerecho.toString() == "double" ||
                tipoIzquierdo.toString() == "double" && tipoDerecho.toString() == "integer" ||
                tipoIzquierdo.toString() == "double" && tipoDerecho.toString() == "char" ||
                tipoIzquierdo.toString() == "char" && tipoDerecho.toString() == "double" ||
                tipoIzquierdo.toString() == "double" && tipoDerecho.toString() == "double") {
                this.tipo = new Tipo(Types.DOUBLE, false, null);
                return this.tipo;
            } else {
                const excepcion = new Excepcion("Semántico", `Los tipos ${tipoIzquierdo.toString()} y ${tipoDerecho.toString()} no son compatibles con el operador ${this.operador}.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        }
    }
}
module.exports = ExpresionAditiva;