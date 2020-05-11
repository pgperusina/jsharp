const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const Identificador = require('./Identificador');

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

        const estructura = tabla.getEstructura(tipoExpresion.nombreStruct);
        if (estructura == null) {
            const excepcion = new Excepcion("Semántico", `La variable '${this.expresion.id}' no tiene como tipo una estructura, por lo tanto no tiene atributos definidos.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        const propiedadesEstructura = estructura.propiedades;
        for (const propiedad of         propiedadesEstructura) {
            if (propiedad.id.toLowerCase() == this.propiedad.id.toLowerCase()) {
                return propiedad.tipo;
            }
        }
        const excepcion = new Excepcion("Semántico", `La propiedad '${this.propiedad.id}' no está definida en la estructura '${estructura.id}'.`, this.propiedad.fila, this.propiedad.columna);
        arbol.errores.push(excepcion);
        return excepcion;

        //     const tipoIzquierdo = this.izquierdo.validar(tabla, arbol);
    //     if (tipoIzquierdo instanceof Excepcion) {
    //         return tipoIzquierdo;
    //     }
    //     const tipoDerecho = this.derecho.validar(tabla,arbol);
    //     if (tipoDerecho instanceof Excepcion) {
    //         return tipoDerecho;
    //     }
    //     // TODO - validar que no se pueda asignar nuevo valor a una constante
    //
    //     if (tipoIzquierdo.toString() == tipoDerecho.toString()) {
    //         return tipoIzquierdo;
    //     } else {
    //         const excepcion = new Excepcion("Semántico", `Error de asignación. Los tipos ${tipoIzquierdo.toString()} y ${tipoDerecho.toString()} no son compatibles.`, this.fila, this.columna);
    //         arbol.errores.push(excepcion);
    //         return excepcion;
    //     }
     }
}
module.exports = AccesoPropiedadEstructura;