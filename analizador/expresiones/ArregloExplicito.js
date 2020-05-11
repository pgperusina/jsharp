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
            let tipoTmp = tabla.getVariable(this.listaValores[i].id).tipo;
            let tipoTmp2 = tabla.getVariable(this.listaValores[i+1].id).tipo;
            if(tipoTmp.toString() !== tipoTmp2.toString()) {
                tiposIguales = false;
            }
        }
        if (!tiposIguales) {
            const excepcion = new Excepcion("Semántico", `Los tipos de los elementos del arreglo no son iguales. Definir un mismo tipo para todos los elementos.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        const tipoValores = tabla.getVariable(this.listaValores[0].id);
        return new Tipo(tipoValores, true, null);
    }
}
module.exports = ArregloExplicito;