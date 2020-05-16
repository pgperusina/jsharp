
const AST = require('../AST');
class Valor extends AST {

    valor = null;

    constructor(tipo, valor, fila, columna) {
        super(tipo, fila, columna);
        this.valor = valor;
    }

    validar(tabla, arbol) {
        return this.tipo;
    }

    generarC3D(tabla, arbol) {
        const temporal = tabla.getTemporal();  //t1
        let valor;
        if (this.tipo.toString().toLowerCase() == "char") {
            valor = this.valor.toString().charCodeAt(0);
        } else {
            valor = this.valor;
        }
        let c3d = `${temporal} = ${valor};\n`;  // t1 = 1
        tabla.agregarTemporal(tabla.getTemporalActual());
        return c3d;
    }
}

module.exports = Valor;