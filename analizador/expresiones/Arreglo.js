const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');

class Arreglo extends AST {
    tipo = null;
    tamano = 0;

    constructor(tipo, tamano, fila, columna) {
        super(null, fila, columna);
        this.tipo = tipo;
        this.tamano = tamano;
    }

    validar(tabla, arbol) {
        let result = this.tamano.validar(tabla, arbol);
        if (result instanceof Excepcion) {
            return result;
        }
        if (result.toString().toLowerCase() != "integer") {
            const excepcion = new Excepcion("Semántico", `El tipo de la posición del arreglo debe de ser integer.`, this.tamano.fila, this.tamano.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        return this.tipo;
    }
}
module.exports = Arreglo;