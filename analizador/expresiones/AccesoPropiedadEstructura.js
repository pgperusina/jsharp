const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Identificador = require('./Identificador');
const LlamadaFuncion = require('./LlamadaFuncion');
const Types = require('../tabla/Tipo').Types;
const Tipo = require('../tabla/Tipo').Tipo;

class AccesoPropiedadEstructura extends AST {
    expresion = null;
    propiedad = null;

    constructor(expresion, propiedad, fila, columna) {
        super(null, fila, columna);
        this.expresion = expresion;
        this.propiedad = propiedad;
    }

    validar(tabla, arbol) {
        const tipoExpresion = this.expresion.validar(tabla, arbol);
        if (tipoExpresion instanceof Excepcion) {
            return tipoExpresion;
        }
        if (tipoExpresion.nombreStruct == null && tipoExpresion.esArreglo == false) {
            const excepcion = new Excepcion("Semántico", `La variable '${this.expresion.id}' no es de tipo estructura, por lo tanto no tiene propiedades definidas.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        if (tipoExpresion.esArreglo) {
            if (this.propiedad.id.toLowerCase() != "length") {
                const excepcion = new Excepcion("Semántico", `El único atributo por defecto de un arreglo es 'length'.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            } else {
                return new Tipo(Types.INTEGER, false, null);
            }
            const result = this.propiedad.validar(tabla,arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        }
        const estructura = tabla.getEstructura(tipoExpresion.nombreStruct);
        if (estructura == null) {
            const excepcion = new Excepcion("Semántico", `La variable '${this.expresion.id}' no tiene como tipo una estructura, por lo tanto no tiene atributos definidos.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        if (!(this.propiedad instanceof LlamadaFuncion)) {
            const propiedadesEstructura = estructura.propiedades;
            for (const propiedad of propiedadesEstructura) {
                if (propiedad.id.toLowerCase() == this.propiedad.id.toLowerCase()) {
                    return propiedad.tipo;
                }
            }
        }
        if (this.propiedad instanceof LlamadaFuncion) {
            const tipoFuncion = this.propiedad.validar(tabla, arbol);
            if (tipoFuncion instanceof Excepcion) {
                return tipoFuncion;
            }
            return tipoFuncion;
        }
        const excepcion = new Excepcion("Semántico", `La propiedad '${this.propiedad.id}' no está definida en la estructura '${estructura.id}'.`, this.propiedad.fila, this.propiedad.columna);
        arbol.errores.push(excepcion);
        return excepcion;
     }
}
module.exports = AccesoPropiedadEstructura;