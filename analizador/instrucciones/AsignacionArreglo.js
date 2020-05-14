const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tipo = require('../tabla/Tipo').Tipo;


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
        if (tipoPosicion.toString().toLowerCase() != "integer") {
            const excepcion = new Excepcion("Semántico", `El tipo de la posición del arreglo debe de ser integer.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        this.tipo = new Tipo(tipoArreglo.tipo, false, tipoArreglo.nombreStruct);
        if (this.tipo.toString().toLowerCase() != tipoValor.toString().toLowerCase()) {
            const excepcion = new Excepcion("Semántico", `El tipo del arreglo y el valor a asignar no coinciden - '${tipoArreglo.toString()}' - '${tipoValor.toString()}'.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        this.tipo = new Tipo(tipoArreglo.tipo, false, tipoArreglo.nombreStruct);
        return this.tipo;
    }
}
module.exports = AsignacionArreglo;