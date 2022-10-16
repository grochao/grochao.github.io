(function($) {

    $(window).load(function() {
        $(".card.credit-card").attr("style", "background-image: url(images/0" + getRandomInt(1, 13) + ".png)");
        $(".all-content").removeClass('hide');
        $("#txt_number").inputmask({ mask: "9999 9999", greedy: false, jitMasking: true });
        $("#txt_minutos").inputmask({ mask: "999", greedy: false, jitMasking: true });
        // raturTasaDeCambio();
    });

    function SetRecargaNormal() {
        var numero = (($.trim($('#txt_number').val())).replace(" ", ''));
        var minute = (($.trim($('#txt_minutos').val())).replace(" ", ''));
        var prefix = '*108*';

        numero = (numero == '') ? 0 : parseInt(numero);
        minute = (minute == '') ? 0 : parseInt(minute);

        console.log(numero.length + " " + minute)
        if ((numero !== 0 && $.trim(numero).length == 8) && (minute !== 0)) {

            $("a#txt_call").each(function(i) {
                prefix = $(this).data('prefix');
                codigo = 'tel:' + encodeURIComponent(prefix + minute + '*' + numero + "*1234*#");
                $(this).attr({
                    "href": codigo
                });
            });



        } else {
            $("a#txt_call").attr({
                "href": "#"
            });

        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validateOnlyNumbers(phone) {
        if (phone.match(/^\+?\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/)) {
            return true;
        } else if (phone.match(/^[0-9]{4}[-\s\.]{0,1}[0-9]{4}$/)) {
            return true;
        }

    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    /*  const input = document.querySelector("input");
    const h1 = document.querySelector("h1");
*/


    $('body').on('keyup touchend', '#input-text', function() {
        var text = $(this).val();
        var number = '';
        // console.log(text);
        if (validateOnlyNumbers(text)) {
            number = encodeURIComponent((((((text.replaceAll(" ", '')).replaceAll("-", '')).replaceAll("(", '')).replaceAll(")", '')).replaceAll('+', '')).replaceAll('.', ''));
            $('.link-whatsapp-msg').show();
            $(".link-whatsapp").attr({
                "href": "https://wa.me/" + number
            });
            $('.text-msg').val('');
            $('.opaque').show();
        } else {
            $('.link-whatsapp-msg').hide();
            $(".link-whatsapp").attr({
                "href": ''
            });
            $('.text-msg').val('');
            $('.opaque').hide();

        }
    });

    $('body').on('keyup touchend', '.text-msg', function() {
        if ($(this).val() !== "") {
            var text = $.trim($(this).val());
            var text = '?text=' + encodeURIComponent((((((text.replaceAll(" ", '')).replaceAll("-", '')).replaceAll("(", '')).replaceAll(")", '')).replaceAll('+', '')).replaceAll('.', ''));
            var number = $("#input-text").val()
            $(".link-whatsapp").attr({
                "href": "https://wa.me/" + number + text
            });
        } else {
            $(".link-whatsapp").attr({
                "href": "https://wa.me/" + number
            });
        }


    });


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


    $('body').on('click', '.click-cuentas', function() {

        $('#credit-card').addClass('show');
        return false;
    });

    $('body').on('click', '.click-recarga-tigo-minutos', function() {

        $('#recargas,.content-minute,.content-calltoaction,.content-calltoaction-direct,h2').addClass('show');
        $('.list').removeClass('show');

        var ScreenW = $(window).outerWidth(true);
        var ScreenH = $(window).outerHeight(true);
        var BoxW = ScreenW - 30;
        var BoxH = ScreenH - 30;
        $('.card.recargas').css({
            'width': ScreenW - 30,
            'height': ScreenH - 30,
            'top': (ScreenH - BoxH) / 2,
            'left': (ScreenW - BoxW) / 2,
        });



        return false;
    });

    $('body').on('click', '.click-recarga-tigo-internet', function() {

        $('#recargas').addClass('show');
        $('.list').addClass('show');
        $('.content-minute,.content-calltoaction,.content-calltoaction-direct,h2').removeClass('show');
        var ScreenW = $(window).outerWidth(true);
        var ScreenH = $(window).outerHeight(true);
        var BoxW = ScreenW - 30;
        var BoxH = ScreenH - 30;
        $('.card.recargas').css({
            'width': ScreenW - 30,
            'height': ScreenH - 30,
            'top': (ScreenH - BoxH) / 2,
            'left': (ScreenW - BoxW) / 2,
        });
        $('.list').css({
            "height": $('.card.recargas').outerHeight(true) - $(".content-number").outerHeight(true) - 40
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


    /*function raturTasaDeCambio() {
        var contaninerHTML = $('<div>').load('https://www.banprogrupopromerica.com.ni');
        //var values = contaninerHTML.find('.exchange-rate__buy-value #buying-rate').text();
        alert(contaninerHTML.html());
    }*/

})(jQuery);