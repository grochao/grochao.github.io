(function($) {

    $(window).load(function() {

        $(".all-content").removeClass('hide');
        $(".filter-numberphone input").inputmask({ mask: "9999-9999", greedy: false, jitMasking: true });
        $(".filter-tiempo-aire input").inputmask({ mask: "999", greedy: false, jitMasking: true });


        //  raturTasaDeCambio();
    });
    $('.switch').click(function() {
        $(this).toggleClass("switchOn");
        if ($(this).hasClass('switchOn')) {
            $('[name="theme-color"],[name="msapplication-TileColor"]').attr('content', '#8a0000');

            $('body').addClass('bk-claro').removeClass('bk-tigo');
        } else {
            $('[name="theme-color"],[name="msapplication-TileColor"]').attr('content', '#00377b');
            $('body').addClass('bk-tigo').removeClass('bk-claro');


        }
    });



    function SetRecargaNormal(list) {
        var numero = ($.trim($('#' + list + ' .filter-numberphone input').val())).replace(" ", '').replace("-", '');
        var monto = ($.trim($('#' + list + ' .filter-tiempo-aire input').val())).replace(" ", '').replace("-", '');

        var PIN = '';
        var prefix = '';
        var HREF = '';



        numero = (numero == '') ? 0 : parseInt(numero);
        monto = (monto == '') ? 0 : parseInt(monto);
        console.clear();

        if ($.trim(numero).length == 8) {
            $('.list').removeClass('disable');
        } else {
            $('.list').addClass('disable');
        }
        if ((numero !== 0 && $.trim(numero).length === 8)) {

            if ((monto >= 10)) {
                if (list === 'list-tigo') {
                    prefix = '*108*';
                    PIN = '1234';
                    HREF = 'tel:' + encodeURIComponent(prefix + monto + '*' + numero + "*" + PIN + "*#");
                } else if (list === 'list-claro') {
                    prefix = '*603*1*';
                    PIN = '2023';
                    HREF = 'tel:' + encodeURIComponent(prefix + numero + '*' + monto + "*" + PIN + "#");
                }
                $('#' + list + " .filter-tiempo-aire a").attr({
                    "href": HREF
                }).addClass('isclick');

            } else {
                $('#' + list + " .filter-tiempo-aire a").attr({
                    "href": "#"
                }).removeClass('isclick');
            }

            /*  $('#' + list + " .filter-tiempo-aire .consulta-recarga").attr({
                  "href": HREF
              }).removeClass('isclick');*/


            $('#' + list + " li").each(function(i) {
                if ($(this).hasClass('filter-tiempo-aire') && $(this).hasClass('filter-consultas')) {
                    return;
                }
                var link = $(this).find('a');
                if (link.length) {
                    var prefix = link.data('prefix');
                    if (list === 'list-tigo') {
                        alert("aquí");
                        HREF = 'tel:' + encodeURIComponent(prefix + numero + '*1234#");
                    } else if (list === 'list-claro') {
                        HREF = 'tel:' + encodeURIComponent(prefix.replace('PIN', PIN) + numero + "#");
                    }
                    link.attr({
                        "href": HREF
                    }).addClass('isclick');;
                }
            });



        }
    }





    $('body').on('keyup touchend', '.filter-tiempo-aire input', function() {
        if ($('body').hasClass('bk-claro')) {
            SetRecargaNormal('list-claro');
        } else {
            SetRecargaNormal('list-tigo');
        }
    });
    $('body').on('keyup touchend', '.filter-numberphone input', function() {
        if ($('body').hasClass('bk-claro')) {
            SetRecargaNormal('list-claro');
        } else {
            SetRecargaNormal('list-tigo');
        }
        /*var number = (($.trim($(this).val())).replace(" ", '')).replace("_", '').replace("-", '');
        var prefix = '';
        if ($('body').hasClass('bk-claro')) {
            SetRecargaNormal('list-claro');
        } else {
            SetRecargaNormal('list-tigo');
        }
        if (number !== "" && number.length == 8) {

            $("#list-tigo a").each(function(i) {
                prefix = $(this).data('prefix');
                codigo = 'tel:' + encodeURIComponent(prefix + number + "*1234*#");
                $(this).attr({
                    "href": codigo
                });
            });

            $('.list').removeClass('disable');

        } else {
            $("#list-tigo a").attr({
                "href": "#"
            });
            $('.list').addClass('disable');
        }*/


    });




    $('body').on('change', '.content-filter select', function() {
        var filter = $.trim(($(this).val()));
        var PDV;
        $('.list').addClass('disable');
        if ($(this).parent().hasClass('select-tigo')) {
            PDV = '#list-tigo';

        } else {
            PDV = '#list-claro';

        }
        $(PDV + " li").hide();
        $(PDV + " li.filter-numberphone").show();

        if (filter === "todo") {
            $(PDV + " li").show();
            $(PDV + " li.filter-tiempo-aire," + PDV + " li.filter-consultas").hide();
        } else if (filter === "consultas") {
            $(PDV + " li").hide();

            $('.list').removeClass('disable');
        }
        $(PDV + " li.filter-" + filter).show();

        return false;
    });



    /* $('body').on('dblclick', ".container-card", function() {
         if ($(this).hasClass("show")) {
             $('.container-card').removeClass('show');
         }
         return false;
     });*/





    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        number = Math.floor(Math.random() * (max - min + 1)) + min;
        return (number < 10) ? '0' + number : number;
    }

    /* function raturTasaDeCambio() {
         var contaninerHTML = $('<div>').load('https://www.delepesoasuspesos.com/indicadores-economicos/cambio-del-dolar table#igsv-1-14DCOXWYFSMrw9UqLogh9sys6pBDA1OPnbtNsUWbXek4');
         //var values = contaninerHTML.find('.exchange-rate__buy-value #buying-rate').text();
         alert(contaninerHTML.html());
     }*/

})(jQuery);
