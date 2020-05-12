const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');

class AsignacionArreglo extends AST {
    id = null;
    posicion = 0;
    valor = null;

    constructor(id, posicion, valor, fila, columna) {
        super(null, fila, columna);
        this.id = id;
        this.posicion = posicion;
        this.valor = valor;
    }

    validar(tabla, arbol) {
        const tipoArreglo = this.id.validar(tabla, arbol);
        if (tipoArreglo instanceof Excepcion) {
            return tipoArreglo;
        }
        const tipoValor = this.valor.validar(tabla, arbol);
        if (tipoValor instanceof Excepcion) {
            return tipoValor;
        }
        const tipoPosicion = this.posicion.validar(tabla, arbol);
        if (tipoPosicion instanceof Excepcion) {
            return tipoPosicion;
        }
        if (tipoPosicion.toString() != "integer") {
            const excepcion = new Excepcion("Semántico", `El tipo de la posición del arreglo debe de ser integer.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        return null;
    }
}
module.exports = AsignacionArreglo;