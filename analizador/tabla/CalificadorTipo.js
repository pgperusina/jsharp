const calificadores = {
    VAR: 'VAR',
    CONST: 'CONST',
    GLOBAL: 'GLOBAL'
}

class CalificadorTipo {
    calificadorTipo = null;

    constructor(calificadorTipo) {
        this.calificadorTipo = calificadorTipo;
    }

    toString() {
        return '' + Types[this.tipo].toLowerCase();
    }
}

exports.CalificadorTipo = CalificadorTipo;
exports.calificadores = calificadores;