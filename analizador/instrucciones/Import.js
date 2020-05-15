const AST = require('../AST');

class Import extends AST {
    archivos = [];

    constructor(archivos, fila, columna) {
        super(null, fila, columna);
        this.archivos = archivos;
    }
    generarC3D(tabla, arbol) {
        return '\n';
    }
}
module.exports = Import;