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
        return this.tipo;
    }
}
module.exports = Arreglo;