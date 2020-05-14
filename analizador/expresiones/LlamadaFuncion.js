const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Tabla = require('../tabla/Tabla');

class LlamadaFuncion extends AST {
    id = null;
    listaArgumentos = [];

    constructor(identificador, listaArgumentos, fila, columna) {
        super(null, fila, columna);
        this.id = identificador;
        this.listaArgumentos = listaArgumentos;
    }

    validar(t, arbol) {
        const tabla = new Tabla();
        tabla.anterior = t;
        tabla.listaEstructuras = t.listaEstructuras;
        this.nombreFuncion = this.id + '_';
        this.listaArgumentos.map(argumento => {
           const tipoArgumento = argumento.validar(tabla, arbol);
           if (tipoArgumento instanceof Excepcion) {
               return tipoArgumento;
           }
           this.nombreFuncion += tipoArgumento.toString().toLowerCase() + '_';
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