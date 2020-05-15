const AST = require('../AST');
const Tabla = require('../tabla/Tabla');
const Return = require('../expresiones/Return');
const Excepcion = require('../Excepciones/Excepcion');


class Funcion extends AST {
    nombre = "";
    listaParametros = [];
    bloqueInstrucciones = [];

    constructor(tipo, nombre, listaParametros, bloqueInstrucciones, fila, columna) {
        super(tipo, fila, columna);
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

        let tipoReturn = null;
        this.bloqueInstrucciones.map(m => {
            if (m instanceof Return) {
                tipoReturn = m.validar(tabla,arbol);
            }
            m.validar(tabla, arbol);
        });
        if(tipoReturn != null) {
            if (this.tipo.toString().toLowerCase() != tipoReturn) {
                const excepcion = new Excepcion("Semántico", `El tipo de la función '${this.tipo.toString()}' no coincide con el tipo del Return '${tipoReturn.toString()}'.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        }
    }

    generarC3D(tabla, arbol) {
        const funcionExiste = tabla.getFuncion(this.nombre);
        tabla.currentSize.push(funcionExiste.tamanoFuncion);
        tabla.ambito = true;
        let codigo = `proc ${this.nombre} begin\n`;
        this.bloqueInstrucciones.map(m => {
            codigo += m.generarC3D(tabla, arbol);
        });

        tabla.listaReturn.map(m => {
            codigo += `${m}:\n`
        });
        codigo += `end\n\n`
        tabla.ambito = false;
        tabla.listaReturn = [];
        tabla.currentSize.pop();
        tabla.listaTemporales = [];
        return codigo;
    }


    buildNombreFuncion(nombre, listaParametros) {
        const tiposParametros = [];
        listaParametros.map(m => {
            tiposParametros.push(m.tipo.toString().toLowerCase());
        });
        return tiposParametros.length == 0 ?
            `${nombre}` :
            `${nombre}_${tiposParametros.join('_')}`;
    }
}
module.exports = Funcion;