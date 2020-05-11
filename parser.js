const Tabla = require('./analizador/tabla/Tabla');
const Import = require('./analizador/instrucciones/Import');
const Declaracion = require('./analizador/instrucciones/Declaracion');
const DefinicionEstructura = require('./analizador/instrucciones/DefinicionEstructura');
const Funcion = require('./analizador/instrucciones/Funcion');
const addFuncion = require('./analizador/utils/Utils').addFuncion;
const Excepcion = require('./analizador/Excepciones/Excepcion');

var fs = require('fs');
var parser = require('./grammar/jsharp.js');

let arbol;

let data = fs.readFileSync('./entrada2.txt');

arbol = parser.parse(data.toString());

fs.writeFile('AST.json', JSON.stringify(arbol), function (err) {
    if (err) return console.log(err);
    console.log('tree > AST.json');
});

if (arbol.errores.length === 0) {
    //obteniendo imports
    let imports = [];
    const tabla = new Tabla();
    tabla.currentSize.push(0); //tamaño de global es cero

    arbol.instrucciones.map(m => {
        if (m instanceof Import) {
            imports.push(m);
        }
    });

    // obteniendo definicion de estructuras
    arbol.instrucciones.map(i => {
       if (i instanceof DefinicionEstructura) {
           const estructura = tabla.agregarEstructura(i);
           if (estructura instanceof Excepcion) {
               arbol.errores.push(estructura);
           }
        }
    });

    // todo - parsear archivos de imports de carpeta imports

    // TODO - VALIDAR QUE NO VENGAN RETURNS, CONTINUE, BREAKS U OTRAS INSTRUCCIONES NO ACEPTADAS

    //obteniendo funciones
    arbol.instrucciones.map(m => {
       if (m instanceof Funcion) {
           addFuncion(tabla, arbol, m);
       }
    });

    //obteniendo declaraciones para pedir espacio en heap
    let conteoGlobales = 0;
    arbol.instrucciones.map(m => {
        if (m instanceof Declaracion) {
            if (m.id instanceof Array) {  //si la declaracion incluye varios identificadores
                m.id.map(i => {
                   m.posicion.push(tabla.getHeap());
                   conteoGlobales++;
                });
            } else {
                m.posicion.push(tabla.getHeap());
                conteoGlobales++;
            }

        }
    });

    // TODO - AGREGAR EN C3D LAS GLOBALES AL HEAP USANDO CONTEOSGLOBALES

    arbol.instrucciones.map(m => {
       m.validar(tabla, arbol);
    });

    console.log(JSON.stringify(tabla, null, 2));

    if (arbol.errores.length > 0 ) {
        arbol.errores.map(e => {
           console.log(JSON.stringify(e));
        });
    }

} else {
    //TODO - retornar el array de errores;
    arbol.errores.map(e => {
        console.log(JSON.stringify(e));
    });

}
