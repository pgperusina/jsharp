const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Simbolo = require('../tabla/Simbolo');

class Parametro extends AST {
    id = null;
    valorInicial = null;
    posicion = 0;

    constructor(tipo, id, valorInicial, fila, columna) {
        super(tipo, fila, columna);
        this.id = id;
        this.valorInicial = valorInicial;
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
            if (tipo.toString() !== this.tipo.toString()) {
                const excepcion = new Excepcion("Semántico", `El tipo del parámetro no es igual al tipo del valor inicial ${this.tipo.toString()} -- ${tipo.toString()}.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        }

        if (this.tipo.nombreStruct != null && this.tipo.nombreStruct.length > 0) {
            tabla.setVariable(new Simbolo(this.tipo, this.id, "var", this.posicion, this.fila, this.columna));
        } else {
            tabla.setVariable(new Simbolo(this.tipo, this.id,  "var", this.posicion, this.fila, this.columna));
        }
    }

}
module.exports = Parametro;