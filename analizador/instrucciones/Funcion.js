const AST = require('../AST');
const Tabla = require('../tabla/Tabla');

class Funcion extends AST {
    tipo = null;
    nombre = "";
    listParametros = [];
    bloqueInstrucciones = [];

    constructor(tipo, nombre, listaParametros, bloqueInstrucciones, fila, columna) {
        super(tipo, fila, columna);
        this.tipo = tipo;
        this.nombre = this.buildNombreFuncion(nombre, listaParametros);
        this.listaParametros = listaParametros;
        this.bloqueInstrucciones = bloqueInstrucciones;
    }

    validar(t, arbol) {
        const tabla = new Tabla();
        tabla.anterior = t;
        tabla.listaEstructuras = t.listaEstructuras;
        this.listaParametros.map(m => {
            m.validar(tabla, arbol);
        });

        this.bloqueInstrucciones.map(m => {
            m.validar(tabla, arbol);
        });
    }

    buildNombreFuncion(nombre, listaParametros) {
        const tiposParametros = [];
        listaParametros.map(m => {
            tiposParametros.push(m.tipo.toString());
        });
        return tiposParametros.length == 0 ?
            `${nombre}` :
            `${nombre}_${tiposParametros.join('_')}`;
    }
}
module.exports = Funcion;