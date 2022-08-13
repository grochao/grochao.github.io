$(function() {

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validateOnlyNumbers(phone) {
        return phone.match(/^\+?\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/);
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    const input = document.querySelector("input");
    const h1 = document.querySelector("h1");



    /*$('body').on('keyup', '#input-text', function() {
        var text = $(this).val();
        if (validateOnlyNumbers(text)) {
            $('.link-whatsapp').show();
            $(".link-whatsapp").parent().attr({
                "href": (((text.replaceAll(" ", '')).replaceAll("-", '')).replaceAll("(", '')).replaceAll(")", '')
            });
        } else {
            $('.link-whatsapp').hide();
            $(".link-whatsapp").parent().attr({
                "href": ''
            })
        }
    });*/
    $('body').on('keyup touchend', '#input-text', function() {
        var text = $(this).val();
        console.log(text);
        if (validateOnlyNumbers(text)) {
            $('.link-whatsapp').show();
            $(".link-whatsapp").parent().attr({
                "href": (((text.replaceAll(" ", '')).replaceAll("-", '')).replaceAll("(", '')).replaceAll(")", '')
            });
        } else {
            $('.link-whatsapp').hide();
            $(".link-whatsapp").parent().attr({
                "href": ''
            })
        }
    });


    $('body').on('click', '#btn_calculate', function() {
        var h_loza = $('#input_height').val();
        var w_loza = $('#input_width').val();
        cal_total(w_loza, h_loza);
    });



    $(window).on('load', function() {



    });

});