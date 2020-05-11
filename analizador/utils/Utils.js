const If = require('../instrucciones/If');
const IfElse = require('../instrucciones/IfElse');
const IfElseIf = require('../instrucciones/IfElseIf');
const While = require('../instrucciones/While');
const DoWhile = require('../instrucciones/DoWhile');
const For = require('../instrucciones/For');
const Declaracion = require('../instrucciones/Declaracion');
const SimboloFuncion = require('../tabla/SimboloFuncion');

function addFuncion(tabla, arbol, funcion) {
    const tipo = funcion.tipo;
    const identificador = funcion.nombre;
    const parametros = funcion.listaParametros.length;
    tabla.setStack(1);
    //seteo la posicion en stack para cada parámetro de la función
    funcion.listaParametros.map(m => {
        m.posicion = tabla.getStack();
    });

    const tamanoFuncion = getTamanoFuncion(tabla, funcion.bloqueInstrucciones) + parametros + 1; // +1 para el return
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
            instruccion.posicion = tabla.getStack();
        } else if (instruccion instanceof If) {
            size = size + getTamanoFuncion(tabla, instruccion.bloqueInstrucciones);
        } else if (instruccion instanceof IfElse) {
            size = size + getTamanoFuncion(tabla, instruccion.bloqueInstruccionesTrue);
            size = size + getTamanoFuncion(tabla, instruccion.bloqueInstruccionesFalse);
        } else if (instruccion instanceof IfElseIf) {
            size = size + getTamanoFuncion(tabla, instruccion.bloqueInstrucciones);
            size = size + getTamanoFuncion(tabla, instruccion.if2.bloqueInstrucciones);
        } else if (instruccion instanceof While || instruccion instanceof DoWhile || instruccion instanceof For) {
            size = size + getTamanoFuncion(tabla, instruccion.listaInstrucciones);
        } else {
            continue;
        }
    }
    return size;
}

exports.addFuncion = addFuncion;
exports.getTamanoFuncion = getTamanoFuncion;