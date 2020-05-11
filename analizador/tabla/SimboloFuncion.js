class SimboloFuncion {
    id = null;
    tipo = null;
    cantidadParametros = 0;
    tamanoFuncion = 0;
    funcion = null; //objeto de la funcion

    constructor(tipo, id, cantidadParametros, tamanoFuncion, funcion) {
        this.id = id;
        this.tipo = tipo;
        this.cantidadParametros = cantidadParametros;
        this.tamanoFuncion = tamanoFuncion;
        this.funcion = funcion;
    }

}
module.exports = SimboloFuncion;