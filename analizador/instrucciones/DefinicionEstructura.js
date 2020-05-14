const AST = require('../AST');

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
        let codigo = '';
        let temp = tabla.getTemporal();
        codigo += `${temp} = h;\n`; // t1 = h;
        codigo += `h = h + ${this.tamano};\n`;
        this.propiedades.map(propiedad => {
            let tipoPropiedad = propiedad.tipo;
            /**
             * Verificar tipo de la propiedad para definir valores iniciales en heap
             * al instanciar la estructura
             */
            if (tipoPropiedad.tipo != null) {
                if (tipoPropiedad.esArreglo) {
                    let temp2 = tabla.getTemporal();

                    let tamanoPropiedad = tabla.getEstructura(tipoPropiedad.nombreStruct);
                    codigo += `${temp2} = ${temp} + ${propiedad.posicion};\n`;
                    codigo += `heap[${temp2}] = -1;\n`;
                } else {

                }
            } else if (tipoPropiedad.nombreStruct != null) {
                let temp2 = tabla.getTemporal();
                let tamanoPropiedad = tabla.getEstructura(tipoPropiedad.nombreStruct);
                codigo += `${temp2} = ${temp} + ${propiedad.posicion};\n`;
                codigo += `heap[${temp2}] = -1;\n`;
            } else if (tipoPropiedad.esArreglo) {

            }{}
        })

        return codigo;
    }

}
module.exports = DefinicionEstructura;