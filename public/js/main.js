$('document').ready(function(){

    $(document).ready(function(){
        /**
         * Funcionalidad de tabs
         */
        $("#myTab a").click(function(e){
            e.preventDefault();
            $(this).tab('show');
        });

        /**
         * Agregar lineas a text areas
         */
        $('.lined').numberedtextarea();

        /**
         * Agregar funcionalidad a botón compilar
         * @type {*|jQuery.fn.init|jQuery|HTMLElement}
         */
        let btn_compilar = $("#btn-compilar");
        btn_compilar.click(function(e) {
            console.log("compilando...")
        });

        /**
         * Habilitar botón compilar al agregar
         * contenido a text area alto nivel
         */
        $('#taaltonivel').keyup(function(e) {
            if (btn_compilar.hasClass("disabled")) {
                btn_compilar.removeClass("disabled");
                btn_compilar.removeAttr("disabled");
            }
        });

        /**
         * Agregando funcionalidad a botón optimizar
         * @type {*|jQuery.fn.init|jQuery|HTMLElement}
         */
        let btn_optimizar = $("#btn-optimizar");
        btn_optimizar.click(function(e) {
            console.log("optimizando...");
        });

        $("#tac3d_no_optimizado").keyup(function (e) {
            btn_optimizar.removeClass("disabled");
            btn_optimizar.removeAttr("disabled");
        });


    });

})