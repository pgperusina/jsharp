const AST = require('../AST');
const logger = require('../utils/Utils').logger;

class DefinicionEstructura extends AST {
    id = null;
    propiedades = [];
    tamano = 0;

    constructor(id, propiedades, fila, columna) {
        super(null, fila, columna);
        this.id = id;
        this.propiedades = propiedades;
    }

    validar(tabla, arbol) {
        return null;
    }

    generarC3D(tabla, arbol) {
        /**
         * LA ESTRUCTURA TIENE EL TAMAÑO DE LA CANTIDAD DE PROPIEDADES QUE TENGA, ESO SIRVE PARA EL HEAP
         * PERO, EN STACK SOLAMENTE TENDRÁ UNA POSICIÓN, QUE ES EL VALOR DE RETORNO (P+0)!!!
         */
        let codigo = `proc ${this.id.toLowerCase()}_${this.id.toLowerCase()} begin\n`;
        let t1 = tabla.getTemporal();
        codigo += `${t1} = h;\n`; // t1 = h;  debemos colocarla en stack al final de la función
        codigo += `h = h + ${this.tamano};\n`;
        this.propiedades.map(propiedad => {
            let tipoPropiedad = propiedad.tipo;
            /**
             * Verificar tipo de la propiedad para definir valores iniciales en heap
             * al instanciar la estructura
             */
            if (tipoPropiedad.tipo != null) {
                if (tipoPropiedad.esArreglo) {
                    let t2 = tabla.getTemporal();
                    codigo += `${t2} = ${t1} + ${propiedad.posicion};\n`;
                    codigo += `heap[${t2}] = -1;\n`;
                } else  if (tipoPropiedad.nombreStruct != null) {
                    let t2 = tabla.getTemporal();
                    codigo += `${t2} = ${t1} + ${propiedad.posicion};\n`;
                    codigo += `heap[${t2}] = -1;\n`;
                } else if (tipoPropiedad.toString().toLowerCase() == "integer") {
                    let t2 = tabla.getTemporal();
                    codigo += `${t2} = ${t1} + ${propiedad.posicion};\n`;
                    codigo += `heap[${t2}] = 0;\n`;
                } else
                if (tipoPropiedad.toString().toLowerCase() == "double") {
                    let t2 = tabla.getTemporal();
                    codigo += `${t2} = ${t1} + ${propiedad.posicion};\n`;
                    codigo += `heap[${t2}] = 0.0;\n`;
                } else
                if (tipoPropiedad.toString().toLowerCase() == "boolean") {
                    let temp2 = tabla.getTemporal();
                    codigo += `${temp2} = ${t1} + ${propiedad.posicion};\n`;
                    codigo += `heap[${temp2}] = 0;\n`;
                } else
                if (tipoPropiedad.toString().toLowerCase() == "char") {
                    let temp2 = tabla.getTemporal();
                    codigo += `${temp2} = ${t1} + ${propiedad.posicion};\n`;
                    codigo += `heap[${temp2}] = ${'\0'.charCodeAt(0)};\n`;
                }

            } else {
                console.log("Error generando C3D de Definición Estructura");
            }
        });
        let t3 = tabla.getTemporal();
        codigo += `${t3} = P + 0;\n`;  //Posición del return del constructor de la estructura
        codigo += `Stack[${t3}] = ${t1};\n`;  //en stack[x] coloco la dirección en HEAP donde comienza la estructura

        codigo += `end\n\n`

        return codigo;
    }

}
module.exports = DefinicionEstructura;