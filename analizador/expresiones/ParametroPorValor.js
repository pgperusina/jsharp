const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');

class ParametroPorValor extends AST {
    id = null;
    posicion = 0;

    constructor(tipo, id, fila, columna) {
        super(tipo, fila, columna);
        this.id = id;
    }

    validar(tabla, arbol) {
        //valido que el parámetro no exista
        let result = tabla.getVariable(this.id);
        if (result !== null) {
            const excepcion = new Excepcion("Semántico", `La variable '${this.id}' ya ha sido definida`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        //valido valor inicial
        if (this.valorInicial != null) {
            let tipo = this.valorInicial.validar(tabla, arbol);
            if (tipo instanceof Excepcion) {
                return tipo;
            }
            if (tipo.toString().toLowerCase() !== this.tipo.toString().toLowerCase()) {
                const excepcion = new Excepcion("Semántico", `El tipo del parámetro no es igual al tipo del valor ${this.tipo.toString()} -- ${tipo.toString()}.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        }

        tabla.setVariable(new Simbolo(this.tipo, this.id, this.posicion, this.fila, this.columna));
    }
}
module.exports = ParametroPorValor;