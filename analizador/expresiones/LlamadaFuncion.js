const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');

class LlamadaFuncion extends AST {
    id = null;
    listaArgumentos = [];

    constructor(identificador, listaArgumentos, fila, columna) {
        super(null, fila, columna);
        this.id = identificador;
        this.listaArgumentos = listaArgumentos;
    }

    validar(tabla, arbol) {
        this.nombreFuncion = this.id + '_';
        this.listaArgumentos.map(argumento => {
           const tipoArgumento = argumento.validar(tabla, arbol);
           if (tipoArgumento instanceof Excepcion) {
               return tipoArgumento;
           }
           this.nombreFuncion += tipoArgumento.toString() + '_';
        });
        this.nombreFuncion = this.nombreFuncion.slice(0, this.nombreFuncion.length - 1);

        const result = tabla.getFuncion(this.nombreFuncion);
        if (result == null) {
            const excepcion = new Excepcion('Semantico', `La función '${this.nombreFuncion}' no existe.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        this.tipo = result.tipo;
        return this.tipo;

    }
}
module.exports = LlamadaFuncion;