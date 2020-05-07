export default class Simbolo {
    id = '';
    tipo = null;
    valor = null;
    fila = 0;
    columna = 0;

    constructor(id, tipo, valor, fila, columna) {
        this.id = id;
        this.tipo = tipo;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }

    getId() {
        return this.id;
    }

    getTipo() {
        return this.tipo;
    }

    getValor() {
        return this.valor;
    }

    setTipo(tipo) {
        this.tipo = tipo;
    }

    setValor(valor) {
        this.valor = valor;
    }

    setFila(fila) {
        this.fila = fila;
    }

    setColumna(columna) {
        this.columna = columna;
    }
}


export default class Tabla