$(function() {
    function cm_to_mm(value) {
        return value * 10;
    }

    function trasnform_escale(value) {
        ratio_x_pixel = 3;
        return value * ratio_x_pixel / 10;
    }

    function return_rodapie(position, top, left, loza_size, ispar) {
        position = position || 'top';
        var _loza_ = $('<div class="roda-pie ' + ispar + '">');
        switch (position) {
            case 'top':
                _loza_.css({
                    top: 0,
                    left: left,
                    width: loza_size.width,
                    height: 2
                });

                break;
            case 'left':
                _loza_.css({
                    top: top,
                    left: 0,
                    width: 2,
                    height: loza_size.width
                });

                break;
            case 'right':
                _loza_.css({
                    top: top,
                    right: 0,
                    width: 2,
                    height: loza_size.width
                });

                break;

            default:
                break;
        }
        return _loza_;
    }

    function return_piso(top, left, loza_size, ispar, Num) {

        var _loza_ = $('<div class="loza-piso ' + ispar + '">');
        _loza_.css({
            top: top,
            left: left,
            width: loza_size.width,
            height: loza_size.width
        });
        _loza_.html('<span>' + Num + '</span>')

        return _loza_;
    }
    $(window).on('load', function() {

        Color1 = '#fff';
        Color2 = "#fff"

        width = cm_to_mm(280);
        height = cm_to_mm(248) - cm_to_mm(10); /* ..248/237.. */

        loza = {
            width: trasnform_escale(cm_to_mm(33)),
            height: trasnform_escale(cm_to_mm(33))
        };
        /* Crea el área de trabajo*/
        mm_w = trasnform_escale(width);
        mm_h = trasnform_escale(height);
        $('#dimension-cuarto').css({
            'width': mm_w,
            'height': mm_h
        });

        /* RODA PIES TOP*/
        totalW = mm_w / loza.width;
        totalW = totalW > parseInt(totalW) ? parseInt(totalW) + 1 : (totalW);

        for (i = 1; i <= totalW; i++) {
            ispar = (i % 2 == 0) ? '_par' : '_impar';
            $('#dimension-cuarto').append(return_rodapie('top', 0, ((loza.width * i) - loza.width), loza, ispar));
        }




        // RODA PIES LEFT
        totalH = mm_h / loza.width;
        totalH = totalH > parseInt(totalH) ? parseInt(totalH) + 1 : (totalH);

        for (i = 1; i <= totalH; i++) {
            ispar = (i % 2 == 0) ? '_par' : '_impar';
            $('#dimension-cuarto').append(return_rodapie('left', ((loza.width * i) - loza.width), 0, loza, ispar));
        }
        // RODA PIES RIGH
        for (i = 1; i <= totalH; i++) {
            ispar = (i % 2 == 0) ? '_par' : '_impar';
            $('#dimension-cuarto').append(return_rodapie('right', ((loza.width * i) - loza.width), 0, loza, ispar));
        }




        loza = {
            width: trasnform_escale(cm_to_mm(33)),
            height: trasnform_escale(cm_to_mm(33))
        };
        // Crea el área de trabajo
        mm_w = trasnform_escale(width);
        mm_h = trasnform_escale(height);
        ispar = '';
        NumLozaPar = 0;
        NumLozaImPar = 0;
        Num = 0;
        for (row = 1; row <= totalH; row++) {
            for (col = 1; col <= totalW; col++) {
                if (row % 2 == 0) {
                    ispar = (col % 2 == 0) ? '_par' : '_impar';
                } else {
                    ispar = (col % 2 == 0) ? '_impar' : '_par';
                }
                if (ispar == '_par') {
                    NumLozaPar++;
                    Num = NumLozaPar;
                } else {
                    NumLozaImPar++;
                    Num = NumLozaImPar;
                }
                console.log(Num);
                $('#dimension-cuarto').append(return_piso(((loza.height * row) - loza.height), ((loza.width * col) - loza.width), loza, ispar, Num));
                //return_piso
            }
        }

        var _centro_ = $('<div class="centro">');
        _centro_.css({
            /* width: width - (loza.width * 7),
             height: height - (loza.height * 7),*/
            top: '50%',
            left: '50%'
        })

        var _decorado_centro_ = $('<div class="decorado_centro">');
        _decorado_centro_.css({
            width: (loza.width * 8),
            height: (loza.height * 6),
            left: (-1) * (((loza.width * 8)) / 2),
            top: (-1) * (((loza.height * 6)) / 2),

        })
        _centro_.append(_decorado_centro_);

        $('#dimension-cuarto').append(_centro_);

        /* var _cama_ = $('<div class="cama">');
        _cama_.css({
            width: trasnform_escale(cm_to_mm(108)),
            height: trasnform_escale(cm_to_mm(197)),
            top: 0,
            left: 0
        })
        $('#dimension-cuarto').append(_cama_)

        var _mesa_ = $('<div class="mesa">');
        _mesa_.css({
            width: trasnform_escale(cm_to_mm(130)),
            height: trasnform_escale(cm_to_mm(62)),
            top: 0,
            right: 0
        })
        $('#dimension-cuarto').append(_mesa_)
*/
    });
});