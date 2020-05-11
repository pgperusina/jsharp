const AST = require('../AST');
const Tipo = require('../tabla/Tipo').Tipo;
const Excepcion = require('../Excepciones/Excepcion');

class ArregloExplicito extends AST {
    listaValores = [];

    constructor(listaValores, fila, columna) {
        super(null, fila, columna);
        this.listaValores = listaValores
    }

    validar(tabla, arbol) {
        let tiposIguales = true;
        this.listaValores.map(valor => {
           const tipoValor = valor.validar(tabla, arbol);
           if (tipoValor instanceof Excepcion) {
               return tipoValor;
           }
        });
        for(var i = 0; i < this.listaValores.length - 1; i++) {
            if(this.listaValores[i].tipo.toString() !== this.listaValores[i+1].tipo.toString()) {
                tiposIguales = false;
            }
        }
        if (!tiposIguales) {
            const excepcion = new Excepcion("Semántico", `Los tipos de los elementos del arreglo no son iguales. Definir un mismo tipo para todos los elementos..`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        return new Tipo(this.listaValores[0].tipo.tipo, true, null);
    }
}
module.exports = ArregloExplicito;