const Simbolo = require('./Simbolo');
const SimboloFuncion = require('./SimboloFuncion');
const Excepcion = require('../Excepciones/Excepcion');

class Tabla {
    variables = [];
    funciones = [];
    temporal = 0;
    etiqueta = 0;
    heap = 0;
    stack = 0;
    local = false;
    nombreAmbito = "";
    currentSize = [];
    listaEstructuras = [];
    anterior = null;

    getVariable(id) {
        for (let e = this; e != null; e = e.getAnterior()) {
            for (let s of e.variables) {
                if (s.id.toLowerCase() === id.toLowerCase()) {
                    return s;
                }
            }
        }
        return null;
    }
    // getVariable(id) {
    //     for (let s of this.variables) {
    //         if (s.id.toLowerCase() === id.toLowerCase()) {
    //             return s;
    //         }
    //     }
    //     return null;
    // }

    setVariable(simbolo) {
        for (let e = this; e != null; e = e.getAnterior()) {
            for (let s of e.variables) {
                if (s.id.toLowerCase() === simbolo.id.toLowerCase()) {
                    return new Excepcion("Semántico", `La variable '${simbolo.id}' ya está definida.`, simbolo.fila, simbolo.columna);
                }
            }
        }
        this.variables.push(simbolo);
        return null;
    }
    // setVariable(simbolo) {
    //     for (let s of this.variables) {
    //         if (s.id.toLowerCase() === simbolo.id.toLowerCase()) {
    //             return new Excepcion("Semántico", `La variable '${simbolo.id}' ya está definida.`, simbolo.fila, simbolo.columna);
    //         }
    //     }
    //     this.variables.push(simbolo);
    //     return null;
    // }

    setVariableGlobal(simbolo) {
        for (let e = this; e != null; e = e.getAnterior()) {
            if (e.getAnterior() == null) {
                for (let s of e.variables) {
                    if (s.id.toLowerCase() === simbolo.id.toLowerCase()) {
                        return new Excepcion("Semántico", `La variable global '${simbolo.id}' ya está definida.`, simbolo.fila, simbolo.columna);
                    }
                }
                e.variables.push(simbolo);
            }
        }
        return null;
    }

    getAnterior() {
        return this.anterior;
    }

    getTemporal() {
        return "t" + ++this.temporal;
    }

    getTemporalActual() {
        return "t" + this.temporal;
    }

    getHeap() {
        return this.heap++;  //retorna memoria dinámica y aumenta una posición
    }

    getStack() {
        return this.stack++;  //retorna memoria local y aumenta una posición
    }

    setStack(valor) {
        this.stack = valor; //cambia el valor del stack
    }

    getEtiqueta() {
        return "L" + ++this.etiqueta;
    }

    getEtiquetaActual() {
        return "L" + this.etiqueta;
    }

    setFuncion(simbolo) {
        for (let s of this.funciones) {
            if (s.id.toLowerCase() === simbolo.id.toLowerCase()) {
                return new Excepcion("Semántico", `La función '${s.id}' ya está definida.`, simbolo.fila, simbolo.columna);
            }
        }
        this.funciones.push(simbolo);
        return null;
    }

    getFuncion(id) {
        for (let e = this; e != null; e = e.getAnterior()) {
            for (let i of e.funciones) {
                if (i.id === id) {
                    return i;
                }
            }
        }
        return null;
    }

    agregarTemporal(temp) {
        if (this.tempStorage.indexOf(temp) == -1) {
            this.tempStorage.push(temp);
        }
    }

    quitarTemporal(temp) {
        let index = this.tempStorage.indexOf(temp);
        if (index > -1) {
            this.tempStorage.splice(index, 1);
        }
    }

    agregarEstructura(estructura) {
        for (let e of this.listaEstructuras) {
            if (e.id.toLowerCase() === estructura.id.toLowerCase()) {
                return new Excepcion("Semántico", `La estructura '${e.id}' ya está definida.`, e.fila, e.columna);
            }
        }
        this.listaEstructuras.push(estructura);
        return null;
    }

    getEstructura(idEstructura) {
        for (let e of this.listaEstructuras) {
            if (e.id.toLowerCase() === idEstructura.toLowerCase()) {
                return e;
            }
        }
        return null;
    }

}

module.exports = Tabla;