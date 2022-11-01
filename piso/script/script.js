;
(function($) {

    $(window).load(function() {
        resizeArea();
    });


    function resizeArea() {

        var ContentLienzo = {
            _MAX_WIDTH_: ($('#content-lienzo').outerWidth(true)) - 30,
            _MAX_HEIGHT_: ($('#content-lienzo').outerHeight(true)) - 30
        }
        var Lienzo = {
            width: trasnform_escale(cm_to_mm($('#txt-ancho').val())),
            height: trasnform_escale(cm_to_mm($('#txt-alto').val()))
        }

        var percent = {
            width: trasnform_escale(cm_to_mm($('#txt-ancho').val())),
            height: trasnform_escale(cm_to_mm($('#txt-alto').val()))
        }

        var loza = {
            width: trasnform_escale(cm_to_mm($('#txt-loza-ancho').val())),
            height: trasnform_escale(cm_to_mm($('#txt-loza-alto').val()))
        };

        var totalLozasW = Lienzo.width / loza.width;
        var totalLozasH = Lienzo.height / loza.height;

        var ratioW = ContentLienzo._MAX_WIDTH_ / Lienzo.width; // Width ratio
        var ratioH = ContentLienzo._MAX_HEIGHT_ / Lienzo.height; // Height ratio



        if (ratioH > ratioW) {
            Lienzo.width = (ContentLienzo._MAX_WIDTH_);
            Lienzo.height = parseInt(Lienzo.height * ratioW);


        } else { // otherwise we scale width
            Lienzo.height = ContentLienzo._MAX_HEIGHT_;
            Lienzo.width = parseInt(Lienzo.width * ratioH);

        }

        totalLozasW = Lienzo.width / totalLozasW;
        totalLozasH = Lienzo.height / totalLozasH;


        $('#lienzo,#lienzo-inner').css({
            width: Lienzo.width,
            height: Lienzo.height,
            top: -(Lienzo.height / 2),
            left: -(Lienzo.width / 2)
        });

        console.log((Lienzo.height / loza.height));
        $('#lienzo-inner').html('');
        for (row = 0; row < (Lienzo.height / totalLozasH); row++) {
            var piso = '';
            var row_width = 0;
            for (i = 0; i < (Lienzo.width / totalLozasW); i++) {
                row_width += totalLozasW;
                piso += '<span style="width:' + totalLozasW + 'px;height:' + totalLozasH + 'px"></span>';

            }
            $('#lienzo-inner').append('<div class="row" style="width:' + row_width + 'px;height:' + totalLozasW + 'px">' + piso + '</div>');
        }


    }
    $('body').on("click", '#btn-calcular', function() {
        resizeArea();
    });

    function cm_to_mm(value) {
        return value * 10;
    }

    function trasnform_escale(value) {
        ratio_x_pixel = 3;
        return value * ratio_x_pixel / 10;
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        number = Math.floor(Math.random() * (max - min + 1)) + min;
        return (number < 10) ? '0' + number : number;
    }
})(jQuery);