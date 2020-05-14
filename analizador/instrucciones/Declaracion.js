const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Simbolo = require('../tabla/Simbolo');
const CalificadorTipo = require('../tabla/CalificadorTipo').calificadores;

class Declaracion extends AST {
    calificadorTipo = null;
    id = null;
    valor = null;
    posicion = [];

    constructor(tipo, calificadorTipo, id, valor, fila, columna) {
        super(tipo, fila, columna);
        this.calificadorTipo = calificadorTipo;
        this.id = id;
        this.valor = valor;
        this.posicion = [];
    }

    validar(tabla, arbol) {
        if (this.calificadorTipo === null) {
            for (const i of this.id) {
                let result = tabla.getVariable(i);
                if (result != null) {
                    const excepcion = new Excepcion("Semántico", `La variable '${this.id}' ya ha sido definida`, this.fila, this.columna);
                    arbol.errores.push(excepcion);
                    return excepcion;
                }
            }
        } else {
            const result = tabla.getVariable(this.id[0]);
            if (result !== null) {
                const excepcion = new Excepcion("Semántico", `La variable '${this.id}' ya ha sido definida`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        }

        if (this.valor != null) {
            const tipo = this.valor.validar(tabla, arbol);

            if (tipo instanceof Excepcion) {
                return tipo;
            }

            if (this.calificadorTipo !== null) {
                this.tipo = tipo;  // declaracion 2,3,4 se infiere el tipo de la variable vía el valor
            } else {
                let t = this.tipo.toString().toLowerCase();
                if (t.includes("array")) {
                    t = t.split("_")[1];
                }
                let t2 = tipo.toString().toLowerCase();
                if (t2.includes("array")) {
                    t2 = t2.split("_")[1];
                }
                if (t2 !== t) {
                    const excepcion = new Excepcion("Semántico", `El tipo de la variable '${this.id}' no es igual al tipo de su valor [${this.tipo.toString()} -- ${tipo.toString()}].`, this.fila, this.columna);
                    arbol.errores.push(excepcion);
                    return excepcion;
                }
            }
        }

        if (this.calificadorTipo === null) {  // declaracion tipo 1, 5, de estructuras y de arreglos de estructuras
            for (let i = 0; i < this.id.length; i++) {
                tabla.setVariable(new Simbolo(this.tipo,this.id[i], this.posicion[i], this.fila, this.columna));
            }
        } else {  // declaracion tipo 2,3 y 4
            tabla.setVariable(new Simbolo(this.tipo, this.id[0], this.posicion[0], this.fila, this.columna));
        }
        return null;
    }

    generarC3D(tabla, arbol) {
        ///////////////////////////////////////////////////////
        if (this.calificadorTipo === null) {  // declaracion tipo 1, 5, de estructuras y de arreglos de estructuras
            for (let i = 0; i < this.id.length; i++) {
                tabla.setVariable(new Simbolo(this.tipo,this.id[i], this.posicion[i], this.fila, this.columna));
            }
        } else {  // declaracion tipo 2,3 y 4
            tabla.setVariable(new Simbolo(this.tipo, this.id[0], this.posicion[0], this.fila, this.columna));
        }
        ///////////////////////////////////////////////////////
        let codigo = '';
        let variable = tabla.getVariable(this.id);  // TODO - verificar si es declaración múltiple y generar código adecuado
        if (this.valor != null) {
            let valor3D = this.valor.generarC3D(tabla, arbol);
            codigo += valor3D;
            // Almacenamos la variable en la posicion que reservamos, con el valor recien obtenido
            if (!tabla.ambito) {
                codigo += `heap[${variable.posicion}] = ${tabla.getTemporalActual()}\n`;
            } else {
                let temp = tabla.getTemporalActual();
                let temp2 = tabla.getTemporal();
                ///codigo += `${temp} = ${tabla.getTemporalActual()}\n`;
                codigo += `${temp2} = P\n`;  // t2 = P
                codigo += `${temp2} = ${temp2} + ${variable.posicion}\n`;// t2 = t2 + 0; calculo posicion de variable en stack
                codigo += `stack[${temp2}] = ${temp}\n`;   // stack[t2]  = t1;  guardo valor en stack
            }
            tabla.QuitarTemporal(tabla.getTemporalActual());
        } else {
            let temp = tabla.getTemporal();
            if (['numeric', 'boolean'].includes(this.tipo.toString().toLowerCase())) {
                codigo += `${temp} = 0\n`;
            } else {
                codigo += `${temp} = -1\n`;
            }
        }
        return codigo;
    }

}
module.exports = Declaracion;