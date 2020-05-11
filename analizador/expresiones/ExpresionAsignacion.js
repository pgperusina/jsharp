const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tipo = require('../tabla/Tipo').Tipo;
const Types = require('../tabla/Tipo').Types;

class ExpresionAsignacion extends AST {
    izquierdo = null;
    derecho = null;

    constructor(izquierdo, derecho, fila, columna) {
        super(null, fila, columna);
        this.izquierdo = izquierdo;
        this.derecho = derecho;
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
        // TODO - validar que no se pueda asignar nuevo valor a una constante

        if (tipoIzquierdo.toString() == tipoDerecho.toString()) {
            return tipoIzquierdo;
        } else {
            const excepcion = new Excepcion("Semántico", `Error de asignación. Los tipos ${tipoIzquierdo.toString()} y ${tipoDerecho.toString()} no son compatibles.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
    }


}
module.exports = ExpresionAsignacion;