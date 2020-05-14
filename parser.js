const Tabla = require('./analizador/tabla/Tabla');
const Import = require('./analizador/instrucciones/Import');
const Declaracion = require('./analizador/instrucciones/Declaracion');
const DefinicionEstructura = require('./analizador/instrucciones/DefinicionEstructura');
const Funcion = require('./analizador/instrucciones/Funcion');
const addFuncion = require('./analizador/utils/Utils').addFuncion;
const addEstructura = require('./analizador/utils/Utils').addEstructura;
const Excepcion = require('./analizador/Excepciones/Excepcion');
const Break = require('./analizador/expresiones/Break');
const Return = require('./analizador/expresiones/Return');
const Continue = require('./analizador/expresiones/Continue');

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
    let imports = [];
    const tabla = new Tabla();
    tabla.currentSize.push(0); //tamaño de global es cero

    //Obteniendo imports
    arbol.instrucciones.map(m => {
        if (m instanceof Import) {
            imports.push(m);
        }
    });

    // recorro los imports para obtener funciones
    let arbolImports;
    imports.map(imp => {
        imp.archivos.map(a => {
            let data = fs.readFileSync('./imports/'+a);
            arbolImports = parser.parse(data.toString());
            //obteniendo funciones
            arbolImports.instrucciones.map(m => {
                if (m instanceof Funcion) {
                    tabla.setStack(0);
                    addFuncion(tabla, arbol, m);
                }
            });
        })
    });

    let conteoGlobales = 0;
    arbol.instrucciones.map(m => {
        //Verificando que instrucciones no sean break, continue o return
        if (m instanceof Continue) {
            const excepcion = new Excepcion("Semántico", `Instrucción 'Continue' fuera de ciclo.`, estructura.fila, estructura.columna);
            arbol.errores.push(excepcion);
        }
        if (m instanceof Return) {
            const excepcion = new Excepcion("Semántico", `Instrucción 'Return' fuera de función.`, estructura.fila, estructura.columna);
            arbol.errores.push(excepcion);
        }
        if (m instanceof Break) {
            const excepcion = new Excepcion("Semántico", `Instrucción 'Break' fuera de ciclo.`, estructura.fila, estructura.columna);
            arbol.errores.push(excepcion);
        }
        // Analizando estructuras y agregándolas a la tabla
        if (m instanceof DefinicionEstructura) {
            addEstructura(tabla, arbol, m);
        }
        //Analizando funciones y agregándolas a la tabla
        if (m instanceof Funcion) {
           addFuncion(tabla, arbol, m);
        }
        // Obteniendo declaraciones para pedir espacio en heap
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

    /**
     * Validando tipos
     */
    arbol.instrucciones.map(m => {
       m.validar(tabla, arbol);
    });

    /**
     * Generando C3D
     */
    let c3d = '';
    if (arbol.errores.length == 0) {
        /**
         * Inicializo el C3D (encabezado)
         */
        c3d = inicializarC3D(tabla, arbol);
        /**
         * Reservo espacio para cada declaración global
         */
        for (let i = 0; i < conteoGlobales; i++) {
            c3d += `heap[${i}] = 0\n`;  //todo - colocar valor default dependiendo del tipo
            c3d += `h = h + 1\n`
        }
        //Verifico si existe función principal
        const principal = tabla.getFuncion("principal")
        if (principal == null) {
            const excepcion = new Excepcion("Semántico", `No existe la función 'Principal'.`, 0, 0);
            arbol.errores.push(excepcion);
        }
        /**
         * GENERO C3D
         */
        arbol.instrucciones.map(m => {
           // c3d += m.generarC3D(tabla, arbol);
        });
        console.log(c3d);
    }

  //  console.log(JSON.stringify(tabla, null, 2));

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

function inicializarC3D(tabla, arbol) {
    let c3d = "var P,H;\n";
    c3d += "var Heap[];\n";
    c3d += "var Stack[];\n";
    c3d += `var ${tabla.getTemporalActual()};\n`;
    c3d += `call principal;\n`;
    return c3d;
}
