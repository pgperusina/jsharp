const AST = require('../AST');
const Excepcion = require('../Excepciones/Excepcion');
const AccesoArreglo = require('../expresiones/AccesoArreglo');
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
        /**
         * Si la expresion no es un arreglo de structs, o sea es de tipo primitivo
         */
        if (tipoExpresion.nombreStruct == null && tipoExpresion.esArreglo == false) {
            const excepcion = new Excepcion("Semántico", `La variable '${this.expresion.id}' no es de tipo estructura, por lo tanto no tiene propiedades definidas.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }

        if (tipoExpresion.nombreStruct != null) {
            const estructura = tabla.getEstructura(tipoExpresion.nombreStruct);
            if (estructura == null) {
                const excepcion = new Excepcion("Semántico", `La estructura '${tipoExpresion.nombreStruct}' a la que se trata de acceder no existe.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
            if (tipoExpresion.esArreglo) {
                if (this.expresion instanceof AccesoArreglo) {
                    // est.arreglo[1].propiedad -- solo puedo verificar si this.propiedad es parte de la estructura de la posicion 1 del arreglo
                    let propiedadExiste = false;
                    let tipoPropiedad = null;
                    let propiedadId;
                    if (this.propiedad instanceof AccesoArreglo) {
                        propiedadId = this.propiedad.expresion.id;
                    } else {
                        propiedadId = this.propiedad.id;
                    }
                    estructura.propiedades.map(p => {
                        if (p.id == propiedadId) {
                            propiedadExiste = true;
                            tipoPropiedad = p.tipo;
                        }
                    });
                    if (propiedadExiste) {
                        //this.tipo = tipoPropiedad;
                        return tipoPropiedad;
                    } else {
                        const excepcion = new Excepcion("Semántico", `La estructura '${tipoExpresion.nombreStruct}' no posee una propiedad llamada '${this.propiedad.id}'.`, this.fila, this.columna);
                        arbol.errores.push(excepcion);
                        return excepcion;
                    }
                    console.log("expresion acceso a arreglo");
                    // verificar tipo de la estructura que conforma el arreglo y verificar si this.propiedad es parte de la estructura
                } else {  // el tipo es arreglo pero no es acceso a arreglo
                    // est.arreglo.propiedad -- solo puedo verificar la opcion length y el tipo de esta expresion integer por 'length'
                    let propiedadId;
                    if (this.propiedad instanceof AccesoArreglo) {
                        propiedadId = this.propiedad.expresion.id;
                    } else {
                        propiedadId = this.propiedad.id;
                    }
                    if (propiedadId.toLowerCase() == "length") {
                        //this.tipo = new Tipo(Types.INTEGER, false, null);
                        return new Tipo(Types.INTEGER, false, null);
                    } else {
                        const excepcion = new Excepcion("Semántico", `El único atributo por defecto de un arreglo es 'length'.`, this.fila, this.columna);
                        arbol.errores.push(excepcion);
                        return excepcion;
                    }
                }
            } else {
                if (this.expresion instanceof AccesoArreglo) {
                    // est.prop[2]
                    let propiedadExiste = false;
                    let tipoPropiedad = null;
                    let propiedadId;
                    if (this.propiedad instanceof AccesoArreglo) {
                        propiedadId = this.propiedad.expresion.id;
                    } else {
                        propiedadId = this.propiedad.id;
                    }
                    estructura.propiedades.map(p => {
                        if (p.id == propiedadId) {
                            propiedadExiste = true;
                            tipoPropiedad = p.tipo;
                        }
                    });
                    if (propiedadExiste) {
                        //this.tipo = tipoPropiedad;
                        // if (this.propiedad instanceof AccesoArreglo) {
                        //     this.tipo.esArreglo = false;
                        // }  // if (this.propiedad instanceof AccesoArreglo) {
                        //     this.tipo.esArreglo = false;
                        // }
                        return tipoPropiedad;
                    } else {
                        const excepcion = new Excepcion("Semántico", `La estructura '${tipoExpresion.nombreStruct}' no posee una propiedad llamada '${this.propiedad.id}'.`, this.fila, this.columna);
                        arbol.errores.push(excepcion);
                        return excepcion;
                    }
                } else {
                    // est.edad // est no es arreglo.
                    let propiedadExiste = false;
                    let tipoPropiedad = null;
                    let propiedadId;
                    if (this.propiedad instanceof AccesoArreglo) {
                        propiedadId = this.propiedad.expresion.id;
                    } else {
                        propiedadId = this.propiedad.id;
                    }
                    if (tipoExpresion.esArreglo) {
                        if (this.propiedad.id.toLowerCase() == "length") {
                            //this.tipo = new Tipo(Types.INTEGER, false, null);
                            return new Tipo(Types.INTEGER, false, null);
                        } else {
                            const excepcion = new Excepcion("Semántico", `El único atributo por defecto de un arreglo es 'length'.`, this.fila, this.columna);
                            arbol.errores.push(excepcion);
                            return excepcion;
                        }
                    }
                    estructura.propiedades.map(p => {
                        if (p.id == propiedadId) {
                            propiedadExiste = true;
                            tipoPropiedad = p.tipo;
                        }
                    });
                    if (propiedadExiste) {
                       // this.tipo = tipoPropiedad;
                        let tipoReturn = new Tipo(tipoPropiedad.tipo, tipoPropiedad.esArreglo, tipoPropiedad.nombreStruct);
                        if (this.propiedad instanceof AccesoArreglo) {
                            tipoReturn.esArreglo = false;
                        }
                        return tipoReturn;
                    } else {
                        const excepcion = new Excepcion("Semántico", `Laaa estructura '${tipoExpresion.nombreStruct}' no posee una propiedad llamada '${this.propiedad.id}'.`, this.fila, this.columna);
                        arbol.errores.push(excepcion);
                        return excepcion;
                    }
                }
            }
        } else {  // expresion es primitivo
            if (tipoExpresion.esArreglo) {
                if (this.propiedad.id.toLowerCase() == "length") {
                    //this.tipo = new Tipo(Types.INTEGER, false, null);
                    return new Tipo(Types.INTEGER, false, null);
                } else {
                    const excepcion = new Excepcion("Semántico", `El único atributo por defecto de un arreglo es 'length'.`, this.fila, this.columna);
                    arbol.errores.push(excepcion);
                    return excepcion;
                }
            }
        }

     }
}
module.exports = AccesoPropiedadEstructura;