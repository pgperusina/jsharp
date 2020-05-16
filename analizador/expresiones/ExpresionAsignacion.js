const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Identificador = require('../expresiones/Identificador');
const Tipo = require('../tabla/Tipo').Tipo;
const Types = require('../tabla/Tipo').Types;

class ExpresionAsignacion extends AST {
    izquierdo = null;
    derecho = null;

    constructor(izquierdo, derecho, fila, columna) {
        super(null, fila, columna);
        this.izquierdo = izquierdo;
        this.derecho = derecho;
    }

    validar(tabla, arbol) {
        const tipoIzquierdo = this.izquierdo.validar(tabla, arbol);
        if (tipoIzquierdo instanceof Excepcion) {
            return tipoIzquierdo;
        }
        const tipoDerecho = this.derecho.validar(tabla,arbol);
        if (tipoDerecho instanceof Excepcion) {
            return tipoDerecho;
        }
        // TODO - validar que no se pueda asignar nuevo valor a una constante

        if (tipoIzquierdo.toString().toLowerCase() == tipoDerecho.toString().toLowerCase()) {
            return tipoIzquierdo;
        } else {
            const excepcion = new Excepcion("Semántico", `Error de asignación. Los tipos ${tipoIzquierdo.toString()} y ${tipoDerecho.toString()} no son compatibles.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
    }

    generarC3D(tabla, arbol) {
        let codigo = "";
        // let variable = tabla.getVariable(this.identificador);
        if (this.izquierdo instanceof  Identificador) {
            let variable = tabla.getVariable(this.izquierdo.id);
            let valor3D = this.derecho.generarC3D(tabla, arbol);
            codigo += valor3D;
            if (!tabla.ambito) {
                codigo += `heap[h] = ${tabla.getTemporalActual()};\n`;
                codigo += `h = h + 1;\n`;
                tabla.quitarTemporal(tabla.getTemporalActual());
            } else {
                let t1 = tabla.getTemporalActual();
                let t2 = tabla.getTemporal();
                codigo += `${t2} = p + ${variable.posicion};\n`;
                codigo += `stack[${t2}] = ${t1};\n`;
                tabla.quitarTemporal(t1);
            }
        }

        return codigo;
    }


}
module.exports = ExpresionAsignacion;