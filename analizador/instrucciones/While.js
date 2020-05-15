const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tabla = require('../tabla/Tabla');

class While extends AST {
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
        if (result.toString().toLowerCase() != "boolean") {
            const excepcion = new Excepcion("Semántico", `La expresión de la instrucción While debe de ser de tipo Boolean.`, this.condicion.fila, this.condicion.columna);
            arbol.errores.push(excepcion);
            return excepcion;
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
module.exports = While;