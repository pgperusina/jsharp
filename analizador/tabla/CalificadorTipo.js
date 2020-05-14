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
}

exports.CalificadorTipo = CalificadorTipo;
exports.calificadores = calificadores;