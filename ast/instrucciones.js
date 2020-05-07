import AST from './AST.js';

export default class Declaracion extends AST {
    id = null;
    valor = null;

    constructor(fila, columna, id, valor) {
        super(fila, columna);
        this.id = id;
        this.valor = valor;
    }
}