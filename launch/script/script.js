(function($) {

    $(window).load(function() {
        $(".card.credit-card").attr("style", "background-image: url(images/0" + getRandomInt(1, 13) + ".png)");
        $(".all-content").removeClass('hide');

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

    $('body').on('keyup touchend', '#txt_number', function() {
        var number = $.trim($(this).val());
        var prefix='';
        if (number !== "" && number.length==8 ) {
           
            $("#list-tigo a").each(function(i){
                prefix = $(this).data('prefix');
                codigo = 'tel:' + encodeURIComponent(prefix+number+"*1234*#");
                $(this).attr({
                    "href": codigo
                });
            });
            

            
        }else{
            $("#list-tigo a").attr({
                "href": "#"
            }); 
        }


    });


    $('body').on('click', '.click-cuentas', function() {

        $('#credit-card').addClass('show');
        return false;
    });


    $('body').on('click', '.click-recarga-tigo', function() {

        $('#recargas').addClass('show');
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