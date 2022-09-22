var drawing1 = new Image();
drawing1.crossOrigin = "Anonymous";
var drawing2 = new Image();
drawing2.crossOrigin = "Anonymous";

var NameBox;
var LabelBox;



var stage;
var layer;
var canvas_width = 300;
var canvas_height = 300;


var click_text_nombre = false;
var click_text_frase = false;

var tmp_nombre = '';
var tmp_frase = '';
var tmp_size_nombre = 0;
var tmp_size_frase = 0;
var tmp_position_frase = 0;
var tmp_position_nombre = 0;


var current_nombre = '';
var current_frase = '';
var current_size_nombre = 0;
var current_size_frase = 0;
var current_position_frase = 0;
var current_position_nombre = 0;

//var tmp_imagen = 1;



function max_width_text(_text_, width_canvas, font_size) {
    var size;
    _text_.fontSize(font_size);

    //console.log("canvas: " + width_canvas + "> text:" + parseInt(_text_.width()) + "= fontsize:" + font_size);
    if (parseInt(_text_.width()) >= (width_canvas)) {
        size = max_width_text(_text_, width_canvas, font_size - 1);
    } else {
        size = font_size;
    }
    console.log(size)
    return size;
}

function min_width_text(_text_, min_width, font_size) {
    var size;
    _text_.fontSize(font_size);

    //console.log("canvas: " + width_canvas + "> text:" + parseInt(_text_.width()) + "= fontsize:" + font_size);
    if (parseInt(_text_.width()) <= (min_width)) {
        size = min_width_text(_text_, min_width, font_size + 1);
    } else {
        size = font_size;
    }
    return size;
}

function CreateText(Id, Text, _edit_, Font, Color) {



    var _text_ = new Konva.Text({
        text: Text,
        fontSize: 50,
        fontFamily: Font /*'Great Vibes',*/ ,
        fill: Color,
        verticalAlign: 'middle',
        shadowColor: '#ffffff',
        shadowBlur: 0,
        padding: 15,

        /*shadowOffsetX: 1,
        shadowOffsetY: 1,
        */
        shadowOpacity: 1,
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        draggable: _edit_,

    });
    //NameBox.fontStyle('bold');
    _text_.align('center');
    _text_.id = Id;
    _text_.fontSize(max_width_text(_text_, canvas_width - 30, 200));
    //console.log(_text_.id);
    if (_text_.id == 'nombre') {

        if (current_size_nombre != 0) {
            _text_.fontSize(current_size_nombre);
        }
    } else {
        if (current_size_frase != 0) {
            _text_.fontSize(current_size_frase);
        }
    }


    _text_.dragBoundFunc(function(pos) {
        //console.log(this.id);
        if (this.id == 'nombre') {
            current_position_nombre = pos.y;
            current_size_nombre = this.fontSize();

        } else {
            current_position_frase = pos.y;
            current_size_frase = this.fontSize();

        }

        return {
            x: (canvas_width / 2) - (_text_.width() / 2),
            y: pos.y
        }
    })
    _text_.x((stage.width() / 2) - (_text_.width() / 2));
    if (_text_.id == 'nombre') {
        if (current_position_nombre == 0) {
            _text_.y((stage.height() / 2) - (_text_.height() / 2) - 40);
        } else {
            _text_.y(current_position_nombre);
        }
    } else {
        if (current_position_frase == 0) {
            _text_.y((stage.height() / 2) - (_text_.height() / 2));
        } else {
            _text_.y(current_position_frase);
        }
    }

    //current_position_frase


    if (_edit_) {
        _text_.on('mouseenter', function() {
            stage.container().style.cursor = 'pointer';
        });

        _text_.on('mouseleave', function() {
            stage.container().style.cursor = 'default';
        });

        _text_.on("mousedown touchstart", function() {
            var pointerPos = stage.getPointerPosition();
            console.log(this.id);

            if (this.id == 'nombre' && click_text_nombre == false) {
                click_text_nombre = true;
                click_text_frase = false;
                CreateImagen(true, this.id);
            }
            if (this.id == 'frase' && click_text_frase == false) {
                click_text_nombre = false;
                click_text_frase = true;
                CreateImagen(true, this.id);
            }



            //var r = pointerPos.x % 255;
            //var g = pointerPos.y % 255;
            //circB.fill("rgb(" + r + ", " + g + ", 100)");
            //layerA.draw();
        });

        _text_.on('transformend', function() {
            // console.log('transform end - before reset font size = ' + this.fontSize() + ' at scale ' + this.scaleX());
            this.fontSize(this.fontSize() * this.scaleX());
            this.scale({ x: 1, y: 1 });
            layer.batchDraw();

            this.fontSize(max_width_text(this, canvas_width - 30, this.fontSize()));

            this.fontSize(min_width_text(this, 80, this.fontSize()));

            if (this.id == 'nombre') {
                current_size_nombre = this.fontSize();
                console.log("name font-size:" + current_size_nombre)

            } else {
                current_size_frase = this.fontSize();
                console.log("frase font-size:" + current_size_frase)
            }



            var _x_ = ((canvas_width / 2) - (this.width() / 2));
            // var _y_ = ((canvas_height / 2) - (this.height() / 2));
            this.x(_x_);
            // this.y(_y_);
            //console.log('transform end - after reset font size = ' + this.fontSize() + ' at scale ' + this.scaleX());
        });
    }
    return _text_;
}

function CreateImagen(_edit_, obj_click) {
    obj_click = obj_click || '';
    var canvas_width = 300;
    var canvas_height = 300;
    _edit_ = _edit_ || false;
    stage = new Konva.Stage({
        container: 'content-canvas',
        width: canvas_width,
        height: canvas_height,
    });
    layer = new Konva.Layer({ draggable: false });
    stage.add(layer);

    var nombre = $.trim($("#nombre").val());
    var frase = $.trim($("#frase").val());
    nombre = nombre == '' ? "Tu Nombre" : nombre;
    frase = frase == '' ? "Aquí va tu Frase" : frase;
    var picture = new Konva.Image({
        x: 0,
        y: 0,
        image: drawing2,
        width: canvas_width,
        height: canvas_height,
    });
    // add the shape to the layer
    layer.add(picture);
    NameBox = CreateText('nombre', nombre, _edit_, 'Great Vibes', '#EFB810');
    LabelBox = CreateText('frase', frase, _edit_, 'Oxygen', '#0067c6');


    // Add a transformer - note we use enabledAnchors to ensure no height0onlly or width-only anchors are used as these do not respect the ratio.
    var transFormer = new Konva.Transformer({

        enabledAnchors: [
            'middle-right',
            /*'middle-left',*/
        ],
        rotateEnabled: false,
        flipEnabled: false,
        anchorFill: "#ffffff",
        anchorStroke: "#00abdc",
        anchorStrokeWidth: 3,
        anchorSize: 25,
        anchorCornerRadius: 20,
        centeredScaling: true,
        borderDash: [5, 5]
    });
    transFormer.keepRatio(true); // ** Tell the transformer to maintain aspect ratio **


    if (_edit_) {
        layer.add(transFormer);
        if (obj_click == 'nombre') {
            transFormer.nodes([NameBox]);
        } else if (obj_click == 'frase') {

            transFormer.nodes([LabelBox])
        }
    }
    layer.add(NameBox);
    layer.add(LabelBox);





    stage.draw();
    //stage.setSize(600, 600);

    var _imagen_ = stage.toDataURL({
        mimeType: 'image/png',
        quality: 1.0,

    });

    //document.getElementById('myCanvas');
    // _imagen_ = _PICTURE_.toDataURL("image/png");
    // _imagen_ = _imagen_.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
    _imagen_ = _imagen_.replace(/^data:image\/png/, 'data:image/png;headers=Content-Disposition%3A%20attachment%3B%20filename=perfil.png');

    $("#render-image #this").attr({
        "src": _imagen_,
        "download": "perfil.png",
        "title": "perfil.png"
    })


}

function ResetSize() {
    /*var _SCEERN_WIDTH_ = parseInt($(window).width());

    _SCEERN_WIDTH_ = (($('#content-canvas').outerWidth() - 30) * 100) / 500;

    if ((parseInt($(window).width())) <= 767) {
        $('#content-canvas .konvajs-content').css({
            zoom: (_SCEERN_WIDTH_) + "%"
        });
    } else {
        $('#content-canvas .konvajs-content').css({
            zoom: "100%"
        });

    }*/

    //console.log(_SCEERN_WIDTH_);
}

function cancel_text_value() {
    current_nombre = tmp_nombre;
    current_frase = tmp_frase;
    current_size_nombre = tmp_size_nombre;
    current_size_frase = tmp_size_frase;
    current_position_frase = tmp_position_frase;
    current_position_nombre = tmp_position_nombre;
}

function set_text_value() {
    tmp_nombre = current_nombre;
    tmp_frase = current_frase;
    tmp_size_nombre = (current_size_nombre);
    tmp_size_frase = (current_size_frase);
    tmp_position_frase = (current_position_frase);
    tmp_position_nombre = (current_position_nombre);
}
(function($) {
    $('#carrousel-help').slick({
        dots: true,
        arrows: false,
        infinite: false,
        speed: 300,
        slidesToShow: 1,
    });
    $('body').on('click', '#btnContinuar', function() {
        $("#instruction").removeClass('show');
        CreateImagen();
    });
    $('body').on('keyup touchend', '.editText', function() {
        var id = $(this).attr('id');
        current_nombre = $('#nombre').val();
        current_frase = $('#frase').val();

        if (id == 'nombre') {
            NameBox.text($.trim($(this).val()));
            NameBox.fontSize(200);
            NameBox.fontSize(max_width_text(NameBox, canvas_width - 30, NameBox.fontSize()));
            NameBox.x((canvas_width / 2) - (NameBox.width() / 2));
        } else {
            LabelBox.text($.trim($(this).val()));
            LabelBox.fontSize(200);
            LabelBox.fontSize(max_width_text(LabelBox, canvas_width - 30, LabelBox.fontSize()));
            LabelBox.x((canvas_width / 2) - (LabelBox.width() / 2));

        }
        //CreateImagen(true);
    });




    $('body').on('click', '#btnEditar', function() {
        click_text_nombre = false;
        click_text_frase = false;
        $(".box-edit").addClass('show');
        $('.calltoaction').removeClass('show');
        $('.calltoaction.edit').addClass('show');
        set_text_value();
        $(".content-image-canva ").removeClass('show-download');
        CreateImagen(true);

    });
    $('body').on('click', '#btnAceptar', function() {
        click_text_nombre = false;
        click_text_frase = false;
        $(".box-edit").removeClass('show');
        $('.calltoaction').removeClass('show');
        $('.calltoaction:not(.edit)').addClass('show');
        $(".content-image-canva ").addClass('show-download');
        CreateImagen();

        //console.log("--");
    });


    $('body').on('click', '#btnDescargar', function() {

        var _imagen_ = stage.toDataURL({
            mimeType: 'image/png',
            quality: 1.0,

        });


        _imagen_ = _imagen_.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
        _imagen_ = _imagen_.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=perfil.png');

        var enlace = document.createElement('a');
        // El título
        enlace.download = "perfil.png";
        enlace.href = _imagen_;

        enlace.click();

        //gtag('event', 'click', { 'event_category': 'button', 'event_label': 'descargar' });
    });
    /*$('body').on('click', '#btnCalcelar', function() {
        $(".box-edit").removeClass('show');
        $('.calltoaction').removeClass('show');
        $('.calltoaction:not(.edit)').addClass('show'); +
        cancel_text_value();
        CreateImagen();
    });*/
    /**/

    $(window).load(function() {


        drawing1.src = "images/flor.png";
        drawing1.onload = function() {

            drawing2.src = "images/ave.png";
            drawing2.onload = function() {

                $("body").removeClass('loading');
                CreateImagen();
                ResetSize();
            };

        };


        $(window).resize(function() {
            ResetSize();
        });

    });




})(jQuery);