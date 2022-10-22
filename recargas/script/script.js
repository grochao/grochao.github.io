(function($) {
    $(window).load(function() {
        $(".all-content").removeClass('hide');
        $(".filter-numberphone input").inputmask({ mask: "9999-9999", greedy: false, jitMasking: true });
        $(".filter-tiempo-aire input").inputmask({ mask: "999", greedy: false, jitMasking: true });
        $(".iconos").each(function() {
            var iconos = (($.trim($(this).attr("class"))).replaceAll("iconos", '').replaceAll(' ', ',')).split(",");

            var html = '';
            iconos.forEach(classIcon => {
                if ($.trim(classIcon) !== '') {
                    html += LoadIcons($.trim(classIcon));
                }
            });
            $(this).html(html);
        });

        $('.ribbon').each(function() {
            var data = (($.trim(($.trim($(this).attr("class"))).replaceAll("ribbon", '').replaceAll(' ', ''))).replaceAll("x", '')).split("_");
            $(this).html(LoadPrice(data));
        });
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

    function create_html_icons(list) {
        var _return_ = '';
        list.forEach(name => {
            _return_ += '<span class="icon-' + (name).toLowerCase() + '"></span>';
        });
        return _return_;
    }

    function LoadPrice(data) {
        return '<span class="price">C$' + data[0] + '</span><span class="day">' + data[1] + ' día' + (data[1] > 1 ? 's' : '') + '</span>';
    }

    function LoadIcons(type) {
        var html = '';
        switch (type) {
            case 'toda-operadora':
                html = create_html_icons(["claro", "tigo"]);
                break;
            case 'todo-incluido':
                html = create_html_icons(["whatsapp", "facebook", "messenger", "instagram", "twitter"]);
                break;
            case 'whatsapp':
                html = create_html_icons(["whatsapp"]);
                break;
            case 'facebook':
                html = create_html_icons(["facebook"]);
                break;

            case 'twitter':
                html = create_html_icons(["twitter"]);
                break;
            case 'instagram':
                html = create_html_icons(["instagram"]);
                break;
            case 'messenger':
                html = create_html_icons(["messenger"]);
                break;
            case 'youtube':
                html = create_html_icons(["youtube"]);
                break;
            case 'claro':
                html = create_html_icons(["claro"]);
                break;
            case 'tigo':
                html = create_html_icons(["tigo"]);
                break;
            default:
                break;
        }
        return html;
    }

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
        if (list === 'list-tigo') {
            prefix = '*108*';
            PIN = '1234';

        } else if (list === 'list-claro') {
            prefix = '*603*1*';
            PIN = '2023';

        }
        if ((numero !== 0 && $.trim(numero).length === 8)) {
            if ((monto >= 10)) {
                if (list === 'list-tigo') {

                    HREF = 'tel:' + encodeURIComponent(prefix + monto + '*' + numero + "*1234*#");
                } else if (list === 'list-claro') {

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
            $('#' + list + " li").each(function(i) {
                if (!$(this).hasClass('filter-tiempo-aire') && !$(this).hasClass('filter-consultas')) {
                    var link = $(this).find('a');
                    if (link.length) {
                        var prefix = link.data('prefix');
                        console.log(PIN);
                        if (list === 'list-tigo') {

                            HREF = 'tel:' + encodeURIComponent(prefix + numero + "*" + PIN + "#");
                        } else if (list === 'list-claro') {
                            HREF = 'tel:' + encodeURIComponent(prefix.replace('PIN', PIN) + numero + "#");
                        }
                        link.attr({
                            "href": HREF
                        }).addClass('isclick');
                    }
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

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        number = Math.floor(Math.random() * (max - min + 1)) + min;
        return (number < 10) ? '0' + number : number;
    }
})(jQuery);