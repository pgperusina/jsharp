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

    let declaracionesGlobales = [];
    let heapCounter = 0;
    /**
     * Verificando tipos de instrucciones y guardando funciones, estructuras y declaraciones globales
     */
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
            m.id.map(i => {
                m.posicion.push(heapCounter++);
                declaracionesGlobales.push(m);
            });
        }
    });

    /**
     * Validando tipos
     */
    arbol.instrucciones.map(m => {
       m.validar(tabla, arbol);
    });

    /**
     * Validando tipos de funciones importadas
     */
    tabla.funciones.map(f => {
        const result = f.funcion.validar(tabla, arbol);
        // if (result instanceof Excepcion) {
        //     arbol.errores.push(excepcion);
        // }
    });

    //Verifico si existe función principal
    const principal = tabla.getFuncion("principal")
    if (principal == null) {
        const excepcion = new Excepcion("Semántico", `No existe la función 'Principal'.`, 0, 0);
        arbol.errores.push(excepcion);
    }
    /**
     * Generando C3D
     */
    let c3d = '';
    if (arbol.errores.length == 0) {
        /**
         * Inicializo el C3D (encabezado)
         */
        c3d = inicializarC3D(tabla, arbol, declaracionesGlobales);

        /**
         * Genero C3D para función principal
         */
        const principal = tabla.getFuncion("principal");
        c3d += principal.funcion.generarC3D(tabla, arbol);
        c3d += "goto L200;\n\n";
        /**
         * GENERO C3D
         */
        for (const m of arbol.instrucciones) {
            if (m instanceof Funcion) {
                continue;
            }
            if (!(m instanceof Declaracion)) {
                c3d += m.generarC3D(tabla, arbol);
            }
        };
        /**
         * GENERO C3D DE FUNCIONES
         */
        tabla.funciones.map(t => {
            if (t.funcion.nombre != "principal") {
                c3d += t.funcion.generarC3D(tabla, arbol);
            }
        });

        /**
         * Finalizo el C3D (agregando lista de temporales en encabezado
         * y colocando salto al final del código para evitar parsear la sábana completa
         */
        let etiquetas = finalizarC3D(tabla, arbol);
        c3d = etiquetas + c3d;
        c3d += "L200:\n";

        console.log(c3d);
        fs.writeFile('C3D.j', c3d, function (err) {
            if (err) return console.log(err);
            console.log('c3d > C3D.j');
        });
    } else {
        // TODO - DEVOLVER LOS ERRORES AL FRONTEND
    }

    if (arbol.errores.length > 0 ) {
        arbol.errores.map(e => {
           console.log(JSON.stringify(e));
        });
    }

} else {
    //TODO - DEVOLVER ERRORES AL FRONTEND
    arbol.errores.map(e => {
        console.log(JSON.stringify(e));
    });

}

function inicializarC3D(tabla, arbol, globales) {
    let c3d = "var p=0;\n";
    c3d += "var h=0;\n";
    c3d += "var heap[];\n";
    c3d += "var stack[];\n\n";
    c3d += inicializarGlobales(tabla, arbol, globales);
    return c3d;
}

function finalizarC3D(tabla, arbol) {
    let c3d = "var t0";
    for (let i = 1; i <= tabla.temporal ; i++) {
        c3d += `,t${i}`;
    }
    c3d += ";\n";
    return c3d;
}

function inicializarGlobales(tabla, arbol, globales) {
    let c3d = "";
    c3d += "#* Declaraciones Globales *#\n";
    /**
     * Reservo espacio para cada todas las declaraciones globales
     */
    globales.map(global => {
        if (global.valor != null) {
            let valor3D = global.valor.generarC3D(tabla, arbol);
            c3d += valor3D;
            c3d += `heap[h] = ${tabla.getTemporalActual()};\n`;
            c3d += `h = h + 1;\n`;
            tabla.quitarTemporal(tabla.getTemporalActual());
        } else {
            if (global.tipo.toString().toLowerCase() == "integer") {
                c3d += `heap[h] = 0;\n`;
                c3d += `h = h + 1;\n`;
            } else
            if (global.tipo.toString().toLowerCase() == "double") {
                c3d += `heap[h] = 0.0;\n`;
                c3d += `h = h + 1;\n`;
            } else
            if (global.tipo.toString().toLowerCase() == "boolean") {
                c3d += `heap[h] = 0;\n`;
                c3d += `h = h + 1;\n`;
            } else
            if (global.tipo.toString().toLowerCase() == "char") {
                c3d += `heap[h] = ${'\0'.charCodeAt(0)};\n`;
                c3d += `h = h + 1;\n`;
            }
        }
    });
    return c3d+"\n";
}