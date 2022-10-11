(function($) {

    $(window).load(function() {

        $(".all-content").removeClass('hide');
        $("#txt_number").inputmask({ mask: "9999 9999", greedy: false, jitMasking: true });
        $("#txt_minutos").inputmask({ mask: "999", greedy: false, jitMasking: true });

    });

    function resizeBoxPopup() {
        var ScreenW = $(window).outerWidth(true);
        var ScreenH = $(window).outerHeight(true);
        var BoxW = $('.card.recargas').outerWidth(true);
        var BoxH = $('.card.recargas').outerHeight(true);
        // alert(ScreenW);
        $('.card.recargas').css({
            'top': ((ScreenH / 2) - (BoxH / 2)),
            'left': ((ScreenW / 2) - (BoxW / 2)),
        });
    }

    function SetRecargaNormal() {
        var numero = (($.trim($('#txt_number').val())).replace(" ", ''));
        var minute = (($.trim($('#txt_minutos').val())).replace(" ", ''));
        var prefix = '*108*';

        numero = (numero == '') ? 0 : parseInt(numero);
        minute = (minute == '') ? 0 : parseInt(minute);

        console.log(numero.length + " " + minute)
        if ((numero !== 0 && $.trim(numero).length == 8) && (minute >= 10)) {

            $("a#txt_call").each(function(i) {
                prefix = $(this).data('prefix');
                codigo = 'tel:' + encodeURIComponent(prefix + minute + '*' + numero + "*1234*#");
                $(this).attr({
                    "href": codigo
                });
            }).addClass('isclick');



        } else {
            $("a#txt_call").attr({
                "href": "#"
            }).removeClass('isclick');

        }
    }





    $('body').on('keyup touchend', '#txt_minutos', function() {
        SetRecargaNormal();
    });
    $('body').on('keyup touchend', '#txt_number', function() {
        var number = (($.trim($(this).val())).replace(" ", '')).replace("_", '');
        var prefix = '';
        SetRecargaNormal();
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
        }


    });


    $('body').on('click', '.close', function() {
        $('#recargas,.content-minute,.content-calltoaction,.content-calltoaction-direct,h3').removeClass('show');
    });

    $('body').on('click', '.click-recarga-tigo-minutos', function() {

        $('#recargas,.content-minute,.content-calltoaction,.content-calltoaction-direct,h3').addClass('show');
        $('.list').removeClass('show');

        resizeBoxPopup();



        return false;
    });
    $(window).resize(function() {
        resizeBoxPopup();
    });
    $('body').on('click', '.click-recarga-tigo-internet', function() {

        $('#recargas').addClass('show');
        $('.list').addClass('show');
        $('.content-minute,.content-calltoaction,.content-calltoaction-direct,h3').removeClass('show');
        resizeBoxPopup();
        $('.list').css({
            "height": $('.card.recargas').outerHeight(true) - $(".content-number").outerHeight(true) - 70
        });
        return false;
    });



    $('body').on('dblclick', ".container-card", function() {
        if ($(this).hasClass("show")) {
            $('.container-card').removeClass('show');
        }
        return false;
    });





    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        number = Math.floor(Math.random() * (max - min + 1)) + min;
        return (number < 10) ? '0' + number : number;
    }


})(jQuery);