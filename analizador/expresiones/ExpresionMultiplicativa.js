const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tipo = require('../tabla/Tipo').Tipo;
const Types = require('../tabla/Tipo').Types;

class ExpresionMultiplicativa extends AST {
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

        if (this.operador === "*") {
            if (tipoIzquierdo.toString().toLowerCase() == "integer" && tipoDerecho.toString().toLowerCase() == "integer" ||
                tipoIzquierdo.toString().toLowerCase() == "integer" && tipoDerecho.toString().toLowerCase() == "char" ||
                tipoIzquierdo.toString().toLowerCase() == "char" && tipoDerecho.toString().toLowerCase() == "integer" ||
                tipoIzquierdo.toString().toLowerCase() == "char" && tipoDerecho.toString().toLowerCase() == "char") {
                this.tipo = new Tipo(Types.INTEGER, false, null);
                return this.tipo;
            } else if (tipoIzquierdo.toString().toLowerCase() == "integer" && tipoDerecho.toString().toLowerCase() == "double" ||
                tipoIzquierdo.toString().toLowerCase() == "double" && tipoDerecho.toString().toLowerCase() == "integer" ||
                tipoIzquierdo.toString().toLowerCase() == "double" && tipoDerecho.toString().toLowerCase() == "char" ||
                tipoIzquierdo.toString().toLowerCase() == "char" && tipoDerecho.toString().toLowerCase() == "double" ||
                tipoIzquierdo.toString().toLowerCase() == "double" && tipoDerecho.toString().toLowerCase() == "double") {
                this.tipo = new Tipo(Types.DOUBLE, false, null);
                return this.tipo;
            } else {
                const excepcion = new Excepcion("Semántico", `Los tipos ${tipoIzquierdo.toString()} y ${tipoDerecho.toString()} no son compatibles con el operador ${this.operador}.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        } else if (this.operador === "/") {
            if (tipoIzquierdo.toString().toLowerCase() == "integer" && tipoDerecho.toString().toLowerCase() == "integer" ||
                tipoIzquierdo.toString().toLowerCase() == "integer" && tipoDerecho.toString().toLowerCase() == "double" ||
                tipoIzquierdo.toString().toLowerCase() == "double" && tipoDerecho.toString().toLowerCase() == "integer" ||
                tipoIzquierdo.toString().toLowerCase() == "integer" && tipoDerecho.toString().toLowerCase() == "char" ||
                tipoIzquierdo.toString().toLowerCase() == "char" && tipoDerecho.toString().toLowerCase() == "integer" ||
                tipoIzquierdo.toString().toLowerCase() == "double" && tipoDerecho.toString().toLowerCase() == "char" ||
                tipoIzquierdo.toString().toLowerCase() == "char" && tipoDerecho.toString().toLowerCase() == "double" ||
                tipoIzquierdo.toString().toLowerCase() == "double" && tipoDerecho.toString().toLowerCase() == "double" ||
                tipoIzquierdo.toString().toLowerCase() == "char" && tipoDerecho.toString().toLowerCase() == "char") {
                this.tipo = new Tipo(Types.DOUBLE, false, null);
                return this.tipo;
            } else {
                const excepcion = new Excepcion("Semántico", `Los tipos ${tipoIzquierdo.toString()} y ${tipoDerecho.toString()} no son compatibles con el operador ${this.operador}.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        } else if (this.operador === "%") {
            if (tipoIzquierdo.toString().toLowerCase() == "integer" && tipoDerecho.toString().toLowerCase() == "integer") {
                this.tipo = new Tipo(Types.INTEGER, false, null);
                return this.tipo;
            } else {
                const excepcion = new Excepcion("Semántico", `Los tipos ${tipoIzquierdo.toString()} y ${tipoDerecho.toString()} no son compatibles con el operador ${this.operador}. Los tipos deben de ser iguales.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        }
    }


}
module.exports = ExpresionMultiplicativa;