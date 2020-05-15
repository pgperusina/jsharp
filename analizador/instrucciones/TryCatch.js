const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const DefinicionEstructura = require('../instrucciones/DefinicionEstructura');
const Simbolo = require('../tabla/Simbolo');
const Tabla = require('../tabla/Tabla');
const Tipo = require('../tabla/Tipo').Tipo;

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

    validar(t, arbol) {
        const tabla = new Tabla();
        const tabla2 = new Tabla();
        tabla.anterior = t;
        tabla.listaEstructuras = t.listaEstructuras;
        tabla2.anterior = t;
        tabla2.listaEstructuras = t.listaEstructuras;
        // TODO - Agregar el resto de excepciones AGREGARLAS GLOBALMENTE!!!!!!!
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
        const varId = tabla.setVariable(new Simbolo(new Tipo("", false, this.tipoExcepcion), this.idExcepcion.id, this.idExcepcion.fila, this.idExcepcion.columna));
        if (varId instanceof Excepcion) {
            return varId;
        }

        tabla2.anterior = t;
        tabla2.listaEstructuras = t.listaEstructuras;
        this.bloqueInstrucciones.map(m => {
            let result = m.validar(tabla2, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });
    }
}
module.exports = TryCatch;