const Types = {
    INTEGER: 'INTEGER',
    DOUBLE: 'DOUBLE',
    CHAR: 'CHAR',
    BOOLEAN: 'BOOLEAN',
    VOID: 'VOID',
    NULL: 'NULL',
    STRING: 'STRING'
}

class Tipo {
    tipo = null;
    esArreglo = false;
    nombreStruct = "";

    constructor(tipo, esArreglo, nombreStruct) {
        this.tipo = tipo;
        this.esArreglo = esArreglo;
        this.nombreStruct = nombreStruct;
    }

    toString() {
        //return Types[this.tipo].toLowerCase();
        if (!this.esArreglo) {
            if (this.nombreStruct != null ) {
                return this.nombreStruct.toLowerCase();
            }
            return Types[this.tipo].toLowerCase();
        } else {
            if (this.nombreStruct != null ) {
                return "array_" + this.nombreStruct.toLowerCase();
            }
            return 'array_' + Types[this.tipo].toLowerCase();
        }
    }
}
exports.Types = Types;
exports.Tipo = Tipo;