const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tabla = require('../tabla/Tabla');
const Continue = require('../expresiones/Continue');

class If extends AST {
    condicion = null;
    bloqueInstrucciones = [];

    constructor(condicion, bloqueInstrucciones, fila, columna) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.bloqueInstrucciones = bloqueInstrucciones;
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
            const excepcion = new Excepcion("Semántico", `La expresión de la instrucción If debe de ser de tipo Boolean.`, this.condicion.fila, this.condicion.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }

        this.bloqueInstrucciones.map(m => {
            let result = m.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });
        return null;
    }
}
module.exports = If;