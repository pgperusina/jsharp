const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tabla = require('../tabla/Tabla');

class TryCatch extends AST {
    bloqueInstrucciones = [];
    tipoExcepcion = null;
    idExcepcion = null;
    bloqueInstruccionesCatch = [];

    constructor(bloqueInstrucciones, tipoExcepcion, idExcepcion, bloqueInstruccionesCatch, fila, columna) {
        super(null, fila, columna);
        this.bloqueInstrucciones = bloqueInstrucciones;
        this.tipoExcepcion = tipoExcepcion;
        this.idExcepcion = idExcepcion;
        this.bloqueInstruccionesCatch = bloqueInstruccionesCatch;
    }

    validar(tabla, arbol) {
        // TODO - Agregar el resto de excepciones
        tabla.listaEstructuras.push(new DefinicionEstructura("ArithmeticException", 0, 0));
        /**
         * Valido instrucciones catch
         */
        this.bloqueInstrucciones.map(m => {
            let result = m.validar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });

        /**
         * Valido que el tipo de excepción exista (ArithmeticException, NullPointerException, etc"
         */
        let existeExcepcion = false;
        tabla.listaEstructuras.map(e => {
           if (e.id.toLowerCase() == this.tipoExcepcion.toString().toLowerCase()) {
               existeExcepcion = true;
           }
        });
        if (!existeExcepcion) {
            const excepcion = new Excepcion("Semántico", `La excepción '${e.id}' no existe.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
    }
}
module.exports = TryCatch;