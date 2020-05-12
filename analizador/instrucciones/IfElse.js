const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tabla = require('../tabla/Tabla');

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
        tabla.anterior = t;
        tabla.listaEstructuras = t.listaEstructuras;

        let result = this.condicion.validar(tabla, arbol);
        if (result instanceof Excepcion) {
            return result;
        }

        this.bloqueInstruccionesTrue.map(m => {
            let result = m.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });
        this.bloqueInstruccionesFalse.map(m => {
            let result = m.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });
        return null;
    }
}
module.exports = IfElse;