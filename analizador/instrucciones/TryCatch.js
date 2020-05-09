const AST = require('../AST');

class TryCatch extends AST {
    bloqueInstrucciones = [];
    tipoExcepcion = null;
    idExcepcion = null;
    bloqueInstruccionesCatch = [];

    constructor(bloqueInstrucciones, tipoExcepcion, idExcepcion, bloqueInstruccionesCatch, fila, columna) {
        super(null, fila, columna);
        this.bloqueInstrucciones = bloqueInstrucciones;
        this.tipoExcepcion = tipoExcepcion;
        this.idExcepcion = idExcepcion;
        this.bloqueInstruccionesCatch = bloqueInstruccionesCatch;
    }
}
module.exports = TryCatch;