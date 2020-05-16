const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');

class Identificador extends AST {
    id = null;
    constructor(id, fila, columna) {
        super(null, fila, columna);
        this.id = id;
    }

    validar(tabla, arbol) {
        let result = tabla.getVariable(this.id);
        if (result == null) {
            const excepcion = new Excepcion('Semantico', `Variable '${this.id}' no ha sido declarada.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        this.tipo = result.tipo;
        return result.tipo;
    }

    generarC3D(tabla, arbol) {
        let codigo = "";
        let variable = tabla.getVariable(this.id);
        if (!tabla.ambito) {
            codigo += `${tabla.getTemporal()} = heap[${variable.posicion}]\n`;
        } else {
            let temp = tabla.getTemporal();
            codigo += `${temp} = P\n`;
            codigo += `${temp} = ${temp} + ${variable.posicion}\n`;
            codigo += `${tabla.getTemporal()} = stack[${temp}]\n`;
        }
        tabla.AgregarTemporal(tabla.getTemporalActual());
        return codigo;
    }
}
module.exports = Identificador;