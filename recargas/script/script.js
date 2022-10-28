var ListNumber = [];
var jsonList = {
    "tigo": [


        {
            "Name": "HABLA20",
            "Price": 20,
            "Day": 1,
            "Description": "20min a números Tigo",
            "Social_media": null,
            "Type": "hablar",
            "New": false,
            "Code": "*110*1*CELULAR*PIN#"
        },
        {
            "Name": "HABLA+2",
            "Price": 30,
            "Day": 2,
            "Description": "Llamadas Ilimitadas a Tigo",
            "Social_media": [
                "whatsapp"
            ],
            "Type": "hablar",
            "New": false,
            "Code": "*110*2*CELULAR*PIN#"
        },
        {
            "Name": "HABLA+4",
            "Price": 50,
            "Day": 4,
            "Description": "Llamadas Ilimitadas a Tigo",
            "Social_media": [
                "whatsapp"
            ],
            "Type": "hablar",
            "New": false,
            "Code": "*110*3*CELULAR*PIN#"
        },
        {
            "Name": "CHAT2",
            "Price": 20,
            "Day": 2,
            "Description": "SMS Ilimitados",
            "Social_media": [
                "whatsapp"
            ],
            "Type": "chat",
            "New": false,
            "Code": "*110*4*CELULAR*PIN#"
        },
        {
            "Name": "CR",
            "Price": 20,
            "Day": 1,
            "Description": "20min a Costa Rica",
            "Social_media": null,
            "Type": "habla",
            "New": false,
            "Code": "*110*5*CELULAR*PIN#"
        },
        {
            "Name": "USA20",
            "Price": 20,
            "Day": 1,
            "Description": "20min USA y Canadá",
            "Social_media": null,
            "Type": "habla",
            "New": false,
            "Code": "*110*6*CELULAR*PIN#"
        },
        {
            "Name": "MEGA1",
            "Price": 20,
            "Day": 1,
            "Description": "700MB, 20min Tigo CA y USA",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*110*7*CELULAR*PIN#"
        },
        {
            "Name": "MEGA2",
            "Price": 30,
            "Day": 2,
            "Description": "850MB, 30min Tigo CA y USA",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*110*8*CELULAR*PIN#"
        },

        {
            "Name": "MEGA4",
            "Price": 50,
            "Day": 4,
            "Description": "2.2GB, 80min Tigo CA y USA",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*110*9*CELULAR*PIN#"
        },
        {
            "Name": "MEGA5",
            "Price": 70,
            "Day": 5,
            "Description": "3GB, Llamadas Ilimitadas a Tigo",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*110*10*CELULAR*PIN#"
        },
        {
            "Name": "MEGA7",
            "Price": 110,
            "Day": 7,
            "Description": "4GB, llamadas Ilimitadas a Tigo",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*110*11*CELULAR*PIN#"
        },
        {
            "Name": "MEGA15",
            "Price": 200,
            "Day": 15,
            "Description": "6.2GB, Llamadas Ilimitadas a Tigo",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*110*12*CELULAR*PIN#"
        },
        {
            "Name": "GAMER2",
            "Price": 40,
            "Day": 2,
            "Description": "2GB Juegos, 850MB, 30min Tigo CA y USA",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*110*13*CELULAR*PIN#"
        },
        {
            "Name": "MEGA1+",
            "Price": 25,
            "Day": 1,
            "Description": "850MB, 25min Tigo CA y USA",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": true,
            "Code": "*110*14*CELULAR*PIN#"
        },
        {
            "Name": "MEGA4+",
            "Price": 55,
            "Day": 4,
            "Description": "2.5GB, 80min Tigo CA y USA",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": true,
            "Code": "*110*15*CELULAR*PIN#"
        },
        {
            "Name": "7 PLUS",
            "Price": 110,
            "Day": 7,
            "Description": "4GB, 30min Multiuso, Mlamadas Ilimitadas a Tigo",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*110*16*CELULAR*PIN#"
        },
        {
            "Name": "15 PLUS",
            "Price": 300,
            "Day": 15,
            "Description": "9GB, 50min Multiuso, Llamadas Ilimitadas a Tigo",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*110*17*CELULAR*PIN#"
        }
    ],
    "claro": [{
            "Name": "SMS 1D",
            "Price": 10,
            "Day": 1,
            "Description": "SMS Ilimitado",
            "Social_media": null,
            "Type": "chat",
            "New": false,
            "Code": "*321*PIN*1*1*NUMERO#"
        },
        {
            "Name": "SMS 2D",
            "Price": 20,
            "Day": 2,
            "Description": "SMS Ilimitados",
            "Social_media": null,
            "Type": "chat",
            "New": false,
            "Code": "*321*PIN*1*2*NUMERO#"
        },
        {
            "Name": "SMS 4D",
            "Price": 30,
            "Day": 4,
            "Description": "SMS Ilimitados",
            "Social_media": null,
            "Type": "chat",
            "New": false,
            "Code": "*321*PIN*1*3*NUMERO#"
        },
        {
            "Name": "SMS 10D",
            "Price": 50,
            "Day": 10,
            "Description": "SMS Ilimitados",
            "Social_media": null,
            "Type": "chat",
            "New": false,
            "Code": "*321*PIN*1*4*NUMERO#"
        },
        {
            "Name": "SMS 15D",
            "Price": 60,
            "Day": 15,
            "Description": "SMS Ilimitados",
            "Social_media": null,
            "Type": "chat",
            "New": false,
            "Code": "*321*PIN*1*5*NUMERO#"
        },
        {
            "Name": "Internet 1D",
            "Price": 20,
            "Day": 1,
            "Description": "250MB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*1*NUMERO#"
        },
        {
            "Name": "Internet 2D",
            "Price": 30,
            "Day": 2,
            "Description": "300MB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*2*NUMERO#"
        },
        {
            "Name": "Internet 5D",
            "Price": 80,
            "Day": 5,
            "Description": "1GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*4*NUMERO#"
        },
        {
            "Name": "Internet 7D",
            "Price": 110,
            "Day": 7,
            "Description": "1.5GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*5*NUMERO#"
        },
        {
            "Name": "Internet 7D",
            "Price": 130,
            "Day": 7,
            "Description": "2GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*6*NUMERO#"
        },
        {
            "Name": "Internet 15D",
            "Price": 230,
            "Day": 15,
            "Description": "2.5GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*7*NUMERO#"
        },
        {
            "Name": "Internet 20D",
            "Price": 400,
            "Day": 20,
            "Description": "3GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*8*NUMERO#"
        },
        {
            "Name": "Internet 30D",
            "Price": 600,
            "Day": 30,
            "Description": "5GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*8*NUMERO#"
        },
        {
            "Name": "MIN Claro",
            "Price": 25,
            "Day": 0,
            "Description": "25min",
            "Social_media": null,
            "Type": "solo-minutos-nic",
            "New": false,
            "Code": "*321*PIN*4*1*NUMERO#"
        },
        {
            "Name": "TODO1",
            "Price": 50,
            "Day": 0,
            "Description": "",
            "Social_media": null,
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*1*NUMERO#"
        },
        {
            "Name": "TODO2",
            "Price": 70,
            "Day": 0,
            "Description": "",
            "Social_media": null,
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*2*NUMERO#"
        },
        {
            "Name": "TODO4",
            "Price": 200,
            "Day": 0,
            "Description": "",
            "Social_media": null,
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*4*NUMERO#"
        },
        {
            "Name": "TODO5",
            "Price": 300,
            "Day": 0,
            "Description": "",
            "Social_media": null,
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*5*NUMERO#"
        },
        {
            "Name": "TODO6",
            "Price": 50,
            "Day": 0,
            "Description": "",
            "Social_media": null,
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*5*NUMERO#"
        },
        {
            "Name": "TODO7",
            "Price": 20,
            "Day": 0,
            "Description": "",
            "Social_media": null,
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*7*NUMERO#"
        },
        {
            "Name": "TODO7",
            "Price": 30,
            "Day": 0,
            "Description": "",
            "Social_media": null,
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*8*NUMERO#"
        },
        {
            "Name": "PAQUETODO1",
            "Price": 25,
            "Day": 0,
            "Description": "",
            "Social_media": null,
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*10*NUMERO#"
        },
        {
            "Name": "PAQUETODO2",
            "Price": 35,
            "Day": 0,
            "Description": "",
            "Social_media": null,
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*11*NUMERO#"
        }
    ]

};
(function($) {

    $(window).load(function() {
        $(".all-content").removeClass('hide');
        $("#number-phone").inputmask({ mask: "9999-9999", greedy: false, jitMasking: true });
        $("#amount").inputmask({ mask: "999", greedy: false, jitMasking: true });
        var keys = Object.keys(jsonList);
        var key = '';
        LoadPacks(jsonList, 'full')
    });

    function LoadPacks(ThePacks, Type) {
        for (var k in ThePacks) {
            key = k;
            obj = $("#list-" + key + " .box-pack");
            obj.html('');


            $.each(jsonList[key], function(i, pack) {
                if (Type == 'full') {
                    obj.append(loadHTMLpack(pack, false));
                } else if (Type == pack.Type) {
                    obj.append(loadHTMLpack(pack, false));
                }
            });
            if (Type === 'full' || Type === 'tiempo-aire' || Type === 'habla') {
                for (i = 1; i <= 15; i++) {
                    var Price = (10 * i);
                    obj.append(loadHTMLpack({
                        "Name": "Tiempo Aire",
                        "Price": Price,
                        "Day": null,
                        "Description": null,
                        "Social_media": null,
                        "Type": "tiempo-aire",
                        "New": false,
                        "Code": "*108*" + Price + "*CELULAR*PIN#"
                    }, (Type === 'tiempo-aire') ? true : false));
                }
            }

        }
    }

    $('body').on("click", 'a.box', function() {
        var PDV;
        if ($('body').hasClass('bk-tigo')) {
            PDV = 'Tigo';
        } else {
            PDV = 'Claro';
        }

        //https://oxygenacademy.es/guardar-datos-de-forma-persistente-en-el-navegador-con-javascript/
        /*if (typeof(Storage) !== "undefined") {
            //ListNumber = localStorage.getItem("RegistrarVentas");
            if (localStorage.getItem("RegistrarVentas") !== null) {

                ListNumber.push($("#list-" + (PDV).toLowerCase() + " .filter-numberphone input").val() + "|" + $(this).data('monto') + "|" + PDV);
                localStorage.setItem("RegistrarVentas", ListNumber);
            } else {
                ListNumber.push($("#list-" + (PDV).toLowerCase() + " .filter-numberphone input").val() + "|" + $(this).data('monto') + "|" + PDV);
                localStorage.setItem("RegistrarVentas", ListNumber);
                //console.log("no hay numeros");
            }

            console.log(localStorage.getItem("RegistrarVentas"))
        }*/

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

        $(".list").addClass('disable');
        $('.filter-consultas, .field-minute').hide();
        //$('.filter-numberphone input').val('');
        $('.content-filter select [value="full"]').prop('selected', true);
        LoadPacks(jsonList, 'full');

        if ($('body').hasClass('bk-claro')) {
            SetRecargaNormal('list-claro');
        } else {
            SetRecargaNormal('list-tigo');
        }
    });

    function loadHTMLpack(_pack, MarginBottom) {
        var isnew = '';
        var days = '';
        var description = '';

        if (_pack.New === true) {
            isnew = '<div class="new blink_me"></div>';
        }
        if (_pack.Day !== null) {
            days = '<h3>' + _pack.Day + ' Día' + ((_pack.Day <= 1) ? '' : 's') + '</h3>';
        }
        if (_pack.Description !== null) {
            description = '<div class="more-info"><div class="info"><p>' + _pack.Description + '</p></div><div class="redes">' + create_html_icons(_pack.Social_media) + '</div></div>';
        }
        var NotMargin = '';
        if (MarginBottom) {
            NotMargin = 'no-margin-bottom';
        }
        return '' +
            '<div class="pack filter-' + _pack.Type + ' ' + NotMargin + '">' +
            '    <a class="box" href="#" data-prefix="' + _pack.Code + '" data-monto="' + _pack.Price + '">' +
            '        ' + isnew +
            '        <h2>' + _pack.Name + '</h2>' +
            '        <div class="principal">' + $.trim(_pack.Price) + ' <span>C$ ' + $.trim(Math.round(_pack.Price * 1.1)) + '</span></div>' +
            '        ' + days +
            '    </a>' +
            '</div>'
    }

    function create_html_icons(list) {
        var _return_ = '';
        $.each(list, function(i, red) {
            _return_ += '<span class="icon-' + (red).toLowerCase() + '"></span>';
        });

        return _return_;
    }



    function SetRecargaNormal(list) {
        var numero = ($.trim($('#number-phone').val())).replace(" ", '').replace("-", '');
        var monto = ($.trim($('#amount').val())).replaceAll(" ", '').replaceAll("-", '');

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
            PIN = '1234';
        } else if (list === 'list-claro') {
            PIN = '2023';
        }
        if ((numero !== 0 && $.trim(numero).length === 8)) {
            if ((monto >= 10)) {
                if (list === 'list-tigo') {
                    HREF = encodeURIComponent('tel:*108*' + monto + "*" + PIN + "*#");
                } else if (list === 'list-claro') {

                    HREF = 'tel:' + encodeURIComponent('*603*1*' + numero + '*' + monto + '*' + PIN + '#');
                }
                $('.link-regargar').attr({
                    "href": HREF
                }).addClass('isclick');

            } else {
                $('.link-regargar').attr({
                    "href": HREF
                }).removeClass('isclick');
            }
            if ($(".list-code .box-pack .pack").length) {
                $(".list-code .box-pack .pack").each(function(i) {
                    var link = $(this).find('a.box');
                    if (link.length) {
                        prefix = link.data('prefix');
                        prefix = prefix.replace("MONTO", monto).replace('CELULAR', numero).replace("PIN", PIN);

                        link.attr({
                            "href": 'tel:' + encodeURIComponent(prefix),
                        }).addClass('isclick');
                    }
                });
                $('.list').removeClass('disable');
            }
        } else {
            $('#' + list + " li .pack a").attr({
                "href": '#',
            }).removeClass('isclick');
            $('.list').addClass('disable');

            $('.link-regargar').attr({
                "href": "#"
            }).removeClass('isclick');
        }
    }

    $('body').on('keyup touchend', '#amount', function() {
        if ($('body').hasClass('bk-claro')) {
            SetRecargaNormal('list-claro');
        } else {
            SetRecargaNormal('list-tigo');
        }
    });
    $('body').on('keyup touchend', '#number-phone', function() {
        if ($('body').hasClass('bk-claro')) {
            SetRecargaNormal('list-claro');
        } else {
            SetRecargaNormal('list-tigo');
        }
    });

    $('body').on('change', '.content-filter select', function() {

        var filter = $.trim(($(this).val()));
        var PDV;
        var Company = 'tigo';
        $('.list').addClass('disable');
        $('.filter-consultas').hide();
        if ($('body').hasClass('bk-tigo')) {
            PDV = '#list-tigo';
            Company = 'tigo';
        } else {
            PDV = '#list-claro';
            Company = 'claro';
        }


        $(".box-pack").html("");
        $('.field-minute').hide();
        //$(PDV + " .filter-tiempo-aire, " + PDV + " .filter-consultas").attr("style", "");
        if (filter == "consultas") {
            $('.filter-consultas.others-link-' + Company).show();
            //  $(PDV + " .filter-consultas").show();
            // $(PDV + " .filter-numberphone").hide();
            //  $(" .list").removeClass('disable');
        } else {
            // $(PDV + " .filter-numberphone").show();
            LoadPacks(jsonList, filter);
            // $(" .list").removeClass('disable');
        }
        /*$(PDV + " li").hide();
        $(PDV + " li.filter-numberphone").show();

        if (filter === "todo") {
            $(PDV + " li").show();
            $(PDV + " li.filter-tiempo-aire," + PDV + " li.filter-consultas").hide();
        } else if (filter === "consultas") {
            $(PDV + " li").hide();

            $('.list').removeClass('disable');
        }
        $(PDV + " li.filter-" + filter).show();*/


        SetRecargaNormal('list-' + Company);

        return false;
    });

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        number = Math.floor(Math.random() * (max - min + 1)) + min;
        return (number < 10) ? '0' + number : number;
    }
})(jQuery);