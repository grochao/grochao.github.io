var ListNumber = [null];
var jsonList = {
    "tigo": [{
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
            "Price": 55,
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
            "Price": 55,
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
            "Code": "*321*PIN*1*1*CELULAR#"
        },
        {
            "Name": "SMS 2D",
            "Price": 20,
            "Day": 2,
            "Description": "SMS Ilimitados",
            "Social_media": null,
            "Type": "chat",
            "New": false,
            "Code": "*321*PIN*1*2*CELULAR#"
        },
        {
            "Name": "SMS 4D",
            "Price": 30,
            "Day": 4,
            "Description": "SMS Ilimitados",
            "Social_media": null,
            "Type": "chat",
            "New": false,
            "Code": "*321*PIN*1*3*CELULAR#"
        },
        {
            "Name": "SMS 10D",
            "Price": 50,
            "Day": 10,
            "Description": "SMS Ilimitados",
            "Social_media": null,
            "Type": "chat",
            "New": false,
            "Code": "*321*PIN*1*4*CELULAR#"
        },
        {
            "Name": "SMS 15D",
            "Price": 60,
            "Day": 15,
            "Description": "SMS Ilimitados",
            "Social_media": null,
            "Type": "chat",
            "New": false,
            "Code": "*321*PIN*1*5*CELULAR#"
        },
        {
            "Name": "Internet 1D",
            "Price": 20,
            "Day": 1,
            "Description": "250MB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*1*CELULAR#"
        },
        {
            "Name": "Internet 2D",
            "Price": 30,
            "Day": 2,
            "Description": "300MB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*2*CELULAR#"
        },
        {
            "Name": "Internet 5D",
            "Price": 80,
            "Day": 5,
            "Description": "1GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*4*CELULAR#"
        },
        {
            "Name": "Internet 7D",
            "Price": 110,
            "Day": 7,
            "Description": "1.5GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*5*CELULAR#"
        },
        {
            "Name": "Internet 7D",
            "Price": 130,
            "Day": 7,
            "Description": "2GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*6*CELULAR#"
        },
        {
            "Name": "Internet 15D",
            "Price": 230,
            "Day": 15,
            "Description": "2.5GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*7*CELULAR#"
        },
        {
            "Name": "Internet 20D",
            "Price": 400,
            "Day": 20,
            "Description": "3GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*8*CELULAR#"
        },
        {
            "Name": "Internet 30D",
            "Price": 600,
            "Day": 30,
            "Description": "5GB",
            "Social_media": null,
            "Type": "solo-internet",
            "New": false,
            "Code": "*321*PIN*2*8*CELULAR#"
        },
        {
            "Name": "MIN Claro",
            "Price": 25,
            "Day": 0,
            "Description": "25min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*1*CELULAR#"
        },
        {
            "Name": "MIN Claro",
            "Price": 20,
            "Day": 0,
            "Description": "20min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*2*CELULAR#"
        },
        {
            "Name": "MIN Claro",
            "Price": 50,
            "Day": 0,
            "Description": "50min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*4*CELULAR#"
        },
        {
            "Name": "MIN Claro",
            "Price": 60,
            "Day": 0,
            "Description": "60min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*5*CELULAR#"
        },
        {
            "Name": "MIN Claro",
            "Price": 70,
            "Day": 0,
            "Description": "70min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*6*CELULAR#"
        },
        {
            "Name": "MIN Claro",
            "Price": 100,
            "Day": 0,
            "Description": "110min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*7*CELULAR#"
        },
        {
            "Name": "MIN USA",
            "Price": 30,
            "Day": 0,
            "Description": "30min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*8*CELULAR#"
        },
        {
            "Name": "MIN USA",
            "Price": 50,
            "Day": 0,
            "Description": "60min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*9*CELULAR#"
        },
        {
            "Name": "MIN C.R",
            "Price": 60,
            "Day": 0,
            "Description": "30min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*11*CELULAR#"
        },
        {
            "Name": "MIN C.R",
            "Price": 100,
            "Day": 0,
            "Description": "60min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*12*CELULAR#"
        },
        {
            "Name": "MIN España",
            "Price": 50,
            "Day": 0,
            "Description": "15min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*14*CELULAR#"
        },
        {
            "Name": "MIN España",
            "Price": 90,
            "Day": 0,
            "Description": "30min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*15*CELULAR#"
        },
        {
            "Name": "MIN MULTIUSO",
            "Price": 30,
            "Day": 0,
            "Description": "10min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*17*CELULAR#"
        },
        {
            "Name": "MIN MULTIUSO",
            "Price": 40,
            "Day": 0,
            "Description": "15min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*18*CELULAR#"
        },
        {
            "Name": "MIN MULTIUSO",
            "Price": 80,
            "Day": 0,
            "Description": "30min",
            "Social_media": null,
            "Type": "solo-minutos",
            "New": false,
            "Code": "*321*PIN*4*20*CELULAR#"
        }

        ,
        {
            "Name": "TODO1",
            "Price": 55,
            "Day": 4,
            "Description": "100min Claro, 10min Multiuso, 100sms + 2.5GB",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter",
                "tiktok",
                "youtube"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*1*CELULAR#"
        },
        {
            "Name": "TODO2",
            "Price": 70,
            "Day": 6,
            "Description": "Min Ilimitados CLaro. 20min Multiuso, 1000sms, 3.5GB",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*2*CELULAR#"
        },
        {
            "Name": "TODO3",
            "Price": 110,
            "Day": 7,
            "Description": "Min Ilimitados CLaro. 40min Multiuso, 3000sms, 4.5GB",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*3*CELULAR#"
        },
        {
            "Name": "TODO4",
            "Price": 200,
            "Day": 15,
            "Description": "Min Ilimitados Claro, 50min Multisuos, SMS Ilimitados, 7GB",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*4*CELULAR#"
        },
        {
            "Name": "TODO5",
            "Price": 300,
            "Day": 15,
            "Description": "Min Ilimitados Claro, 60min Multisuos, SMS Ilimitados, 10GB",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*5*CELULAR#"
        },
        {
            "Name": "TODO6",
            "Price": 50,
            "Day": 4,
            "Description": "Min y SMS Ilimitados",
            "Social_media": [
                "whatsapp"
            ],
            "Type": "chat",
            "New": false,
            "Code": "*321*PIN*6*6*CELULAR#"
        },
        {
            "Name": "TODO7",
            "Price": 20,
            "Day": 1,
            "Description": "25min CLaro,CA,USA,Canadá,México, 25SMS, 800MB",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*7*CELULAR#"
        },
        {
            "Name": "TODO8",
            "Price": 30,
            "Day": 2,
            "Description": "35min Claro/CA/USA/Canadá/México, 25SMS, 1GB",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*8*CELULAR#"
        },
        {
            "Name": "PAQUETODO1",
            "Price": 25,
            "Day": 2,
            "Description": "25min Claro/Multiuso, 1GB",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*10*CELULAR#"
        },
        {
            "Name": "PAQUETODO2",
            "Price": 35,
            "Day": 3,
            "Description": "25min Claro/Multiuso, 1.5GB",
            "Social_media": [
                "whatsapp",
                "facebook",
                "messenger",
                "instagram",
                "twitter"
            ],
            "Type": "todo-incluido",
            "New": false,
            "Code": "*321*PIN*6*11*CELULAR#"
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
                        "Code": (key === 'tigo' ? ("*108*" + Price + "*CELULAR*PIN#") : ("*603*1*CELULAR*" + Price + "*PIN#"))
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
        /* if (typeof(Storage) !== "undefined") {
             //ListNumber = localStorage.getItem("RegistrarVentas");
             if (localStorage.getItem("RegistrarVentas") !== null) {

                 ListNumber.push($("#list-" + (PDV).toLowerCase() + " .filter-numberphone input").val() + "|" + $(this).data('monto') + "|" + PDV);
                 localStorage.setItem("RegistrarVentas", ListNumber);
             } else {
                 ListNumber.push($("#list-" + (PDV).toLowerCase() + " .filter-numberphone input").val() + "|" + $(this).data('monto') + "|" + PDV);
                 localStorage.setItem("RegistrarVentas", ListNumber);

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
            description = '<div class="data-hidden"><div class="info"><p>' + _pack.Description + '</p></div><div class="redes">' + create_html_icons(_pack.Social_media) + '</div></div>';
        }
        var NotMargin = '';
        if (MarginBottom) {
            NotMargin = 'no-margin-bottom';
        }
        return '' +
            '<div class="pack filter-' + _pack.Type + ' ' + NotMargin + '">' +
            '    <div class="box"  data-prefix="' + _pack.Code + '" data-monto="' + _pack.Price + '">' +
            '        ' + isnew +
            '        <h2>' + _pack.Name + '</h2>' +
            '        <div class="principal">' + $.trim(_pack.Price) + ' <span>C$ ' + $.trim(Math.floor(_pack.Price * 1.1)) + '</span></div>' +
            '        ' + days +
            '        ' + description +
            '    </div>' +
            '</div>'
    }

    function create_html_icons(list) {
        var _return_ = '';
        $.each(list, function(i, red) {
            _return_ += '<span class="icon-' + (red).toLowerCase() + '"></span>';
        });

        return _return_;
    }

    function inRangue(PrefixNumber) {
        var PrefixNumber = parseInt(PrefixNumber);
        var is_claro = false;
        var is_tigo = false;
        var PrefixClaro = [
            { "BEGIN": 5740, "END": 5749 },
            /* BEGIN: NEW NUMBERS */
            { "BEGIN": 5753, "END": 5753 },
            { "BEGIN": 5764, "END": 5764 },
            { "BEGIN": 5867, "END": 5867 },
            /* END: NEW NUMBERS */
            { "BEGIN": 5780, "END": 5789 },
            { "BEGIN": 5800, "END": 5849 },
            { "BEGIN": 8330, "END": 8339 },
            { "BEGIN": 8350, "END": 8369 },
            { "BEGIN": 8400, "END": 8449 },
            { "BEGIN": 8490, "END": 8499 },
            { "BEGIN": 8500, "END": 8549 },
            { "BEGIN": 8600, "END": 8669 },
            { "BEGIN": 8690, "END": 8699 },
            { "BEGIN": 8700, "END": 8749 },
            { "BEGIN": 8820, "END": 8859 },
            { "BEGIN": 8900, "END": 8949 }
        ];

        PrefixTigo = [
            { "BEGIN": 7710, "END": 7719 },
            /* BEGIN: NEW NUMBERS */
            { "BEGIN": 7621, "END": 7621 },
            { "BEGIN": 7848, "END": 7848 },
            { "BEGIN": 7703, "END": 7703 },
            { "BEGIN": 7728, "END": 7728 },
            { "BEGIN": 7860, "END": 7860 },
            { "BEGIN": 8286, "END": 8286 },
            /* END: NEW NUMBERS */
            { "BEGIN": 7750, "END": 7759 },
            { "BEGIN": 7870, "END": 7879 },
            { "BEGIN": 8150, "END": 8159 },
            { "BEGIN": 8260, "END": 8269 },
            { "BEGIN": 8320, "END": 8329 },
            { "BEGIN": 8370, "END": 8399 },
            { "BEGIN": 8450, "END": 8489 },
            { "BEGIN": 8550, "END": 8559 },
            { "BEGIN": 8590, "END": 8599 },
            { "BEGIN": 8670, "END": 8689 },
            { "BEGIN": 8750, "END": 8779 },
            { "BEGIN": 8800, "END": 8819 },
            { "BEGIN": 8860, "END": 8899 },
            { "BEGIN": 8950, "END": 8979 },
            { "BEGIN": 8990, "END": 8999 }
        ];
        $.each(PrefixClaro, function(i, RANGE) {
            if (PrefixNumber >= RANGE.BEGIN && PrefixNumber <= RANGE.END) {
                is_claro = true;
            };
        });
        $.each(PrefixTigo, function(i, RANGE) {
            if (PrefixNumber >= RANGE.BEGIN && PrefixNumber <= RANGE.END) {
                is_tigo = true;
            };
        });
        $_return_ = 'isError';
        if (is_tigo) {
            $_return_ = 'isTigo';
        } else if (is_claro) {
            $_return_ = 'isClaro'
        } else {
            $_return_ = 'isError'
        }
        return $_return_;
    }


    function SetRecargaNormal(list) {
        var numero = ($.trim($('#number-phone').val())).replace(" ", '').split("-");
        var monto = ($.trim($('#amount').val())).replaceAll(" ", '').replaceAll("-", '');
        $('.content-filter').attr("class", "content-filter");

        var Validate = numero[0];



        var PIN = '';
        var prefix = '';
        var HREF = '';
        numero = numero.join("");
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
                    var link = $(this).find('.box');
                    if (link.length) {
                        prefix = link.data('prefix');
                        prefix = prefix.replace("MONTO", monto).replace('CELULAR', numero).replace("PIN", PIN);

                        link.attr({
                            "data-number": 'tel:' + encodeURIComponent(prefix),
                        }).addClass('isclick');
                    }
                });
                $('.list').removeClass('disable');
            }
        } else {
            $('#' + list + " li .pack .box").attr({
                "href": '#',
            }).removeClass('isclick');
            $('.list').addClass('disable');

            $('.link-regargar').attr({
                "href": "#"
            }).removeClass('isclick');
        }

        $('.content-filter').removeClass('isError').removeClass('isClaro').removeClass('isTigo');
        $('.content-filter').addClass(inRangue(Validate));
        if (parseInt(Validate) <= 999 || parseInt(Validate) === 'NaN' || $.trim($('#number-phone').val()) === '') {
            $('.content-filter').removeClass('isError').removeClass('isClaro').removeClass('isTigo');
        }

    }

    $('body').on("click", ".box", function() {
        var number = $(this).data("number");
        $("#call-number .calltoacction").html('')

        $("#call-number .calltoacction").html('<i class="cerrar icon-close-solid"></i>' + ($(this).html()).replace("data-hidden", "more-info") + '<a href="#" class=""><i class="icon-phone"></i>MARCAR</a>');
        $("#call-number .calltoacction a").attr("href", number);
        if ($(this).hasClass('isclick')) {
            $("#call-number .calltoacction a").show();
        } else {
            $("#call-number .calltoacction a").hide();

        }
        $("body").addClass('show-popup-call');
    });
    $('body').on("click", ".calltoacction .cerrar", function() {
        $("#call-number .calltoacction").html('')
        $("body").removeClass('show-popup-call');
    });

    /*$('body').on("click", "#call-number .calltoacction a", function() {

    });
*/

    $('body').on('keyup', '#amount', function() {
        if ($('body').hasClass('bk-claro')) {
            SetRecargaNormal('list-claro');
        } else {
            SetRecargaNormal('list-tigo');
        }
    });
    $('body').on('keyup', '#number-phone', function() {
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