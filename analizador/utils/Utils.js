const If = require('../instrucciones/If');
const IfElse = require('../instrucciones/IfElse');
const IfElseIf = require('../instrucciones/IfElseIf');
const While = require('../instrucciones/While');
const DoWhile = require('../instrucciones/DoWhile');
const For = require('../instrucciones/For');
const Declaracion = require('../instrucciones/Declaracion');
const SimboloFuncion = require('../tabla/SimboloFuncion');
const Excepcion = require('../Excepciones/Excepcion');


function addFuncion(tabla, arbol, funcion) {
    const tipo = funcion.tipo;
    const identificador = funcion.nombre;
    const parametros = funcion.listaParametros.length;
    tabla.setStack(1);
    //seteo la posicion relativa para cada parámetro
    funcion.listaParametros.map(m => {
        m.posicion = tabla.getStack();
    });

    const tamanoFuncion = getTamanoFuncion(tabla, funcion.bloqueInstrucciones) + parametros + 1; // +1 para el return
    funcion.tipo = tipo;
    const simbolo = new SimboloFuncion(tipo, identificador, parametros, tamanoFuncion, funcion);
    const result = tabla.setFuncion(simbolo);
    if (result != null) {
        arbol.errores.push(result);
    }
}

function getTamanoFuncion(tabla, instrucciones) {
    let size = 0;
    for (let i in instrucciones) {
        const instruccion = instrucciones[i];
        if (instruccion instanceof Declaracion) {
            size = size + 1;
            instruccion.posicion.push(tabla.getStack());
        } else if (instruccion instanceof If) {
            size = size + getTamanoFuncion(tabla, instruccion.bloqueInstrucciones);
        } else if (instruccion instanceof IfElse) {
            size = size + getTamanoFuncion(tabla, instruccion.bloqueInstruccionesTrue);
            size = size + getTamanoFuncion(tabla, instruccion.bloqueInstruccionesFalse);
        } else if (instruccion instanceof IfElseIf) {
            size = size + getTamanoFuncion(tabla, instruccion.bloqueInstrucciones);
            size = size + getTamanoFuncion(tabla, instruccion.if2.bloqueInstrucciones);
        } else if (instruccion instanceof While || instruccion instanceof DoWhile) {
            size = size + getTamanoFuncion(tabla, instruccion.listaInstrucciones);
        } else if (instruccion instanceof For) {
            if (instruccion.inicio instanceof Declaracion) {
                size = size + 1;
                instruccion.inicio.posicion = tabla.getStack();
            }
            size = size + getTamanoFuncion(tabla, instruccion.listaInstrucciones);
        } else {
            continue;
        }
    }
    return size;
}

function addEstructura(tabla, arbol, estructura) {
    const id = estructura.id;
    const propiedades = estructura.propiedades.length;
    const nombresPropiedades = [];
    tabla.setStack(1);
    //seteo la posicion relativa para cada propiedad
    estructura.propiedades.map(p => {
        p.posicion = tabla.getStack();
        nombresPropiedades.push(p.id);
    });
    const hasDuplicates = nombresPropiedades.length !== new Set(nombresPropiedades).size;
    if (hasDuplicates) {
        const excepcion = new Excepcion("Semántico", `La estructura '${estructura.id}' tiene propiedades duplicadas.`, estructura.fila, estructura.columna);
        arbol.errores.push(excepcion);
        return excepcion;
    }
    estructura.tamano = propiedades;
    tabla.listaEstructuras.push(estructura);
}

exports.addFuncion = addFuncion;
exports.getTamanoFuncion = getTamanoFuncion;
exports.addEstructura = addEstructura;