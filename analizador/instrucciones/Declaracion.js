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
        // if (this.calificadorTipo === null) {  // declaracion tipo 1, 5, de estructuras y de arreglos de estructuras
        //     for (let i = 0; i < this.id.length; i++) {
        //         tabla.setVariable(new Simbolo(this.tipo,this.id[i], this.posicion[i], this.fila, this.columna));
        //     }
        // } else {  // declaracion tipo 2,3 y 4
        //     tabla.setVariable(new Simbolo(this.tipo, this.id[0], this.posicion[0], this.fila, this.columna));
        // }
        ///////////////////////////////////////////////////////
        let codigo = '';
        let variable;
        /**
         * Si la declaración incluye una lista de ID's
         */
        if (this.id instanceof Array) {
            let pos = 0;
            this.id.map(v => {
                variable = tabla.getVariable(v);
                if (this.valor != null) {
                    let valor3D = this.valor.generarC3D(tabla, arbol);
                    codigo += valor3D;
                    // Almacenamos la variable en la posicion que reservamos, con el valor recien obtenido
                    if (!tabla.ambito) {
                        // codigo += `heap[${this.posicion[pos]}] = ${tabla.getTemporalActual()};\n`;
                        codigo += `heap[h] = ${tabla.getTemporalActual()};\n`;
                        codigo += `h = h + 1;\n`;
                    } else {
                        let t1 = tabla.getTemporalActual();  // por ejemplo, el temporal que generó el nodo Valor t1;
                        let t2 = tabla.getTemporal();  // t2;
                        ///codigo += `${t1} = ${tabla.getTemporalActual()}\n`;
                        // codigo += `${t2} = p;\n`;  // t2 = P
                        codigo += `${t2} = p + ${this.posicion[pos++]};\n`;// t2 = t2 + 0; calculo posicion de variable en stack
                        codigo += `stack[${t2}] = ${t1};\n`;   // stack[t2]  = t1;  guardo valor en stack
                    }
                    tabla.quitarTemporal(tabla.getTemporalActual());
                } else {  // DECLARACION DE PRIMITIVOS, VERIFICAR SI ESTOY EN FUNCION O SI ESTOY EN GLOBAL
                    if (!tabla.ambito) {
                        if (this.tipo.toString().toLowerCase() == "integer") {
                            codigo += `heap[h] = 0;\n`;
                            codigo += `h = h + 1;\n`;
                        } else
                        if (this.tipo.toString().toLowerCase() == "double") {
                            codigo += `heap[h] = 0.0;\n`;
                            codigo += `h = h + 1;\n`;
                        } else
                        if (this.tipo.toString().toLowerCase() == "boolean") {
                            codigo += `heap[h] = 0;\n`;
                            codigo += `h = h + 1;\n`;
                        } else
                        if (this.tipo.toString().toLowerCase() == "char") {
                            codigo += `heap[h] = ${'\0'.charCodeAt(0)};\n`;
                            codigo += `h = h + 1;\n`;
                        }
                    } else {
                        let t1 = tabla.getTemporal();  // t1;
                        codigo += `${t1} = p + ${this.posicion[pos++]};\n`;  // t1 = p + posicionRelativa
                        if (this.tipo.toString().toLowerCase() == "integer") {
                            codigo += `stack[${t1}] = 0;\n`;   // stack[t1]  = valor default
                        } else
                        if (this.tipo.toString().toLowerCase() == "double") {
                            codigo += `stack[${t1}] = 0.0;\n`;
                        } else
                        if (this.tipo.toString().toLowerCase() == "boolean") {
                            codigo += `stack[${t1}] = 0;\n`;
                        } else
                        if (this.tipo.toString().toLowerCase() == "char") {
                            codigo += `stack[${t1}] = ${'\0'.charCodeAt(0)};\n`;
                        }
                    }
                }
            });
        }
        codigo += `\n`;
        return codigo;
    }
}
module.exports = Declaracion;