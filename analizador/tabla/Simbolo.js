class Simbolo {
    id = '';
    tipo = null;
    fila = 0;
    columna = 0;
    posicion = 0; //posicion en stack o heap

    constructor(tipo, id, posicion , fila, columna) {
        this.tipo = tipo;
        this.id = id;
        this.fila = fila;
        this.columna = columna;
        this.posicion = posicion;
    }

}
module.exports = Simbolo