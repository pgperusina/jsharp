const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tabla = require('../tabla/Tabla');

class For extends AST {
    inicio = null;
    condicion = null;
    final = null;
    listaInstrucciones = [];

    constructor(inicio, condicion, final, listaInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.inicio = inicio;
        this.condicion = condicion;
        this.final = final;
        this.listaInstrucciones = listaInstrucciones;

    }

    validar(t, arbol) {
        const tabla = new Tabla();
        tabla.anterior = t;
        tabla.listaEstructuras = t.listaEstructuras;
        if (this.inicio != null) {
            let result = this.inicio.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        }

        if (this.condicion != null) {
            let result = this.condicion.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        }

        if (this.final != null) {
            let result = this.final.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
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
module.exports = For;