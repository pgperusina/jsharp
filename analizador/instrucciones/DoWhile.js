const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tabla = require('../tabla/Tabla');

class DoWhile extends AST {
    condicion = null;
    listaInstrucciones = [];

    constructor(condicion, listaInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.listaInstrucciones = listaInstrucciones;

    }

    validar(t, arbol) {
        const tabla = new Tabla();
        tabla.anterior = t;
        tabla.listaEstructuras = t.listaEstructuras;

        let result = this.condicion.validar(tabla, arbol);
        if (result instanceof Excepcion) {
            return result;
        }

        this.listaInstrucciones.map(m => {
            let result = m.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });
        return null;
    }
}
module.exports = DoWhile;