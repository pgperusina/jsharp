
const AST = require('../AST');
class Cadena extends AST {
    valor = null;
    arreglo = null

    constructor(tipo, valor, arreglo, fila, columna) {
        super(tipo, fila, columna);
        this.valor = valor;
        this.arreglo = arreglo;
    }

    validar(tabla, arbol) {
        return this.tipo;
    }

    generarC3d(tabla, arbol) {
        const temporal = tabla.getTemporal();
        let c3d = `${temporal} = ${this.valor} \n`;
        tabla.AgregarTemporal(tabla.getTemporalActual());
        return c3d;
    }
}

module.exports = Cadena;