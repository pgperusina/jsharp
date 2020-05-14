const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tipo = require('../tabla/Tipo').Tipo;
const Types = require('../tabla/Tipo').Types;

class InstanciaEstructura extends AST {
    idEstructura = null;

    constructor(idEstructura, fila, columna) {
        super(null, fila, columna);
        this.idEstructura = idEstructura;
    }

    validar(tabla, arbol) {
        const result = tabla.getEstructura(this.idEstructura);
        if (result == null) {
            const excepcion = new Excepcion("Semántico", `La estructura '${this.idEstructura}' no ha sido definida y no puede ser instanciada.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        this.tipo = new Tipo("", false, this.idEstructura);
        return this.tipo;
    }
}
module.exports = InstanciaEstructura;