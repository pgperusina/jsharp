class Simbolo {
    id = '';
    tipo = null;
    calificadorTipo = null;
    fila = 0;
    columna = 0;
    posicion = 0; //posicion en stack o heap

    constructor(tipo, id, calificadorTipo, posicion , fila, columna) {
        this.tipo = tipo;
        this.id = id;
        this.calificadorTipo = calificadorTipo;
        this.fila = fila;
        this.columna = columna;
        this.posicion = posicion;
    }

}
module.exports = Simbolo