const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tabla = require('../tabla/Tabla');

class IfElseIf extends AST {
    condicion = null;
    bloqueInstrucciones = [];
    if2 = null;

    constructor(condicion, bloqueInstrucciones, if2, fila, columna) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.bloqueInstrucciones = bloqueInstrucciones;
        this.if2 = if2;
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

        tabla2.anterior = t;
        tabla2.listaEstructuras = t.listaEstructuras;
        this.bloqueInstrucciones.map(m => {
            let result = m.validar(tabla2, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });

        result = this.if2.validar(tabla, arbol);
        if (result instanceof Excepcion) {
            return result;
        }

        return null;
    }
}
module.exports = IfElseIf;