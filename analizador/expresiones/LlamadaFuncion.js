const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');

class LlamadaFuncion extends AST {
    identificador = null;
    listaArgumentos = [];

    constructor(identificador, listaArgumentos, fila, columna) {
        super(null, fila, columna);
        this.identificador = identificador;
        this.listaArgumentos = listaArgumentos;
    }

    validar(tabla, arbol) {
        const tipoExpresion = this.identificador.validar(tabla, arbol);
        if (tipoExpresion instanceof Excepcion) {
            return tipoExpresion;
        }
        this.nombreFuncion = this.identificador + '_';
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
            const excepcion = new Excepcion('Semantico', `La funcipon '${this.nombreFuncion}' no ha sido definida aún.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        this.tipo = result.tipo;
        return this.tipo;

    }
}
module.exports = LlamadaFuncion;