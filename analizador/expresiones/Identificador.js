const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');

class Identificador extends AST {
    id = null;
    constructor(id, fila, columna) {
        super(null, fila, columna);
        this.id = id;
    }

    validar(tabla, arbol) {
        let result = tabla.getVariable(this.id);
        if (result == null) {
            const excepcion = new Excepcion('Semantico', `Variable '${this.id}' no ha sido declarada.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        return result.tipo;
    }
}
module.exports = Identificador;