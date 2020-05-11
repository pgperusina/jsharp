class Excepcion {

    tipo = null;
    descripcion = null;
    fila = 0;
    columna = 0;

    constructor(tipo, descripcion, fila, columna) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fila = fila;
        this.columna = columna;
    }

    toString() {
        return `${this.tipo} : ${this.descripcion} en línea: ${this.fila} y columna: ${this.columna}`;
    }
}
module.exports = Excepcion;