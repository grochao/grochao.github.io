(function($) {

    $(window).load(function() {

        $(".all-content").attr('style', '');


    });

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


    function copy(selector) {
        var $temp = $("<div>");
        $("body").append($temp);
        $temp.attr("contenteditable", true)
            .html(($(selector).html()).replace(/\s+/g, '')).select()
            .on("focus", function() { document.execCommand('selectAll', false, null); })
            .focus();
        document.execCommand("copy");
        $temp.remove();
    }


    $('body').on('click', '.copy', function() {
        var elementID = "#copy-" + $.trim(($("#credit-card ul li.show-card").attr("class")).replace('show-card', ''));
        console.log(elementID);
        copy(elementID);
        return false;
    });
    $('body').on('click', '.close', function() {
        $("#credit-card").removeClass('show');
        return false;
    });



    $('body').on('click', '#select-card span', function() {
        var itemCard = $.trim(($(this).attr("class")).replace("current", ""));
        $("#select-card span").removeClass('current');
        $("#cuentas li").removeClass('show-card');
        $("#cuentas li." + itemCard).addClass('show-card');
        $(this).addClass('current');
    });

    function resizeCard() {
        var ScreenW = $(window).outerWidth(true);
        var ScreenH = $(window).outerHeight(true);
        ScreenW = ScreenW - (ScreenW * 0.10);
        ScreenH = ScreenH - (ScreenH * 0.15);


        if ($(window).outerWidth(true) < 768) {
            $('.card.credit-card').css({
                'height': ScreenW,
                'width': ScreenH,
                'left': -(ScreenH) / 2,
                'top': -(ScreenW) / 2,
            });
            $('#cuentas li').css({
                'height': $('.card.credit-card').outerHeight() - 20
            })
        } else {
            $('.card.credit-card').attr("style", "");
            $('.#cuentas li').attr("style", "");

        }


        ;
    }
    $(window).resize(function() {
        resizeCard();
    });

    $('body').on('click', '.click-cuentas', function() {

        $('#credit-card').addClass('show');

        resizeCard();


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

    /*$('body').on('click', '.click-recarga-tigo-internet', function() {

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
    });*/



    /*$('body').on('dblclick', ".container-card", function() {
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




})(jQuery);