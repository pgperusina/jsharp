const Types = {
    INTEGER: 'integer',
    DOUBLE: 'double',
    CHAR: 'char',
    BOOLEAN: 'boolean',
    VOID: 'void',
    NULL: 'null',
    STRING: 'string'
}

class Tipo {
    tipo = null;
    esArreglo = false;
    nombreStruct = null;

    constructor(tipo, esArreglo, nombreStruct) {
        this.tipo = tipo;
        this.esArreglo = esArreglo;
        this.nombreStruct = nombreStruct;
    }

    toString() {
        if (!this.esArreglo) {
            if (this.nombreStruct != null) {
                return 'struct_' + Types[this.tipo].toLowerCase();
            }
            return Types[this.tipo].toLowerCase();
        } else {
            if (this.nombreStruct != null) {
                return 'array_struct_' + Types[this.tipo].toLowerCase();
            }
            return 'arreglo_' + Types[this.tipo].toLowerCase();
        }
    }
}
exports.Types = Types;
exports.Tipo = Tipo;