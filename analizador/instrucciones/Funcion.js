const AST = require('../AST');

class Funcion extends AST {
    tipo = null;
    id = null;
    listParametros = [];
    bloqueInstrucciones = [];

    constructor(tipo, id, listaParametros, bloqueInstrucciones, fila, columna) {
        super(tipo, fila, columna);
        this.tipo = tipo;
        this.id = id;
        this.listaParametros = listaParametros;
        this.bloqueInstrucciones = bloqueInstrucciones;
    }
}
module.exports = Funcion;