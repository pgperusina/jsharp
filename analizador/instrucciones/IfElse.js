const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tabla = require('../tabla/Tabla');
const Continue = require('../expresiones/Continue');

class IfElse extends AST {
    condicion = null;
    bloqueInstruccionesTrue = [];
    bloqueInstruccionesFalse = [];

    constructor(condicion, bloqueInstruccionesTrue, bloqueInstruccionesFalse, fila, columna) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.bloqueInstruccionesTrue = bloqueInstruccionesTrue;
        this.bloqueInstruccionesFalse = bloqueInstruccionesFalse;
    }

    validar(t, arbol) {
        const tabla = new Tabla();
        const tabla2 = new Tabla();
        tabla.anterior = t;
        tabla.listaEstructuras = t.listaEstructuras;

        let result = this.condicion.validar(tabla, arbol);
        if (result instanceof Excepcion) {
            return result;
        }
        if (result.toString().toLowerCase() != "boolean") {
            const excepcion = new Excepcion("Semántico", `La expresión de la instrucción If-Else debe de ser de tipo Boolean.`, this.condicion.fila, this.condicion.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }

        this.bloqueInstruccionesTrue.map(m => {
            let result = m.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });

        tabla2.anterior = t;
        tabla2.listaEstructuras = t.listaEstructuras;
        this.bloqueInstruccionesFalse.map(m => {
            let result = m.validar(tabla2, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });
        return null;
    }
}
module.exports = IfElse;