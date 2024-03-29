function drawTextAlongArc(context, str, centerX, centerY, radius, angle) {
    var len = str.length,
        s;
    radius = 180;
    context.save();
    context.translate(centerX, centerY);
    context.rotate(-1 * angle / 2);
    context.rotate(-1 * (angle / len) / 2);
    context.fillStyle = '#ffffff';
    context.font = '25pt Oxygen';


    for (var n = 0; n < len; n++) {
        context.rotate(angle / len);
        context.save();
        context.translate(0, -1 * radius);
        s = str[n];
        context.fillText(s, 0, 0);
        context.restore();
    }
    context.restore();
}
var context;
var canvas;

function reset_value() {
    tmp_nombre = $('#name').val();
    tmp_frase = $('#frase').val();
    tmp_size_nombre = $('#size-nombre').val();
    tmp_size_frase = $('#size-frase').val();
    tmp_position_frase = $('#position-frase').val();
    tmp_position_nombre = $('#position-nombre').val();
}

function AddCircle(context, centerX, centerY, radius) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    context.lineWidth = 7;
    context.strokeStyle = '#d9a404';
    context.fillStyle = 'rgba(255,255,255,0.5)';
    // context.globalAlpha = 0.5;
    context.arc(centerX, centerY, 198, 0, 2 * Math.PI, true);
    context.fill();
    context.stroke();
    context.restore();
}

function AddName(context, Text, centerX, centerY, size) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    context.fillStyle = '#EFB810';
    context.font = size + 'pt Great Vibes';
    context.textAlign = "center";
    context.textBaseline = 'middle';
    var textString = Text;


    context.fillText(textString, centerX, centerY);


    context.stroke();
    context.restore();
}

function AddLabel(context, Text, centerX, centerY, size) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    context.fillStyle = '#0067c6';
    context.font = size + 'pt Oxygen';
    //drawTextAlongArc(context, 'Guillermo Rocha', centerX, centerY, radius, angle);
    context.textAlign = "center";
    context.textBaseline = 'middle';
    var textString = Text;
    context.fillText(textString, centerX, centerY);
    context.stroke();
    context.restore();
}

var drawing1 = new Image();
drawing1.crossOrigin = "Anonymous";
var drawing2 = new Image();
drawing2.crossOrigin = "Anonymous";

function AddBackGround(context, Text, centerX, centerY) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    //drawing = new Image()
    //drawing.crossOrigin = "Anonymous";
    //drawing.src = "https://grochao.github.io/images/flor.png";
    //  drawing.src = "images/flor.png"; 
    // drawing.src = tmp_imagen;
    /*drawing.onload = function() {

        // context.drawImage(image, 0, 0);
        
    };*/
    if (tmp_imagen == 1) {

        context.drawImage(drawing1, 0, 0, 600, 600);
    } else {
        context.drawImage(drawing2, 0, 0, 600, 600);

    }

    context.stroke();
    context.restore();
}


function CreateImagen() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    angle = (Math.PI) * 0.8,
        radius = 200;

    var size_name = ($("#size-nombre").val());
    var size_label = ($("#size-frase").val());
    // var str_name = $("#name").val();
    // var str_label = $("#frase").val();
    var position_frase = $("#position-frase").val();
    var position_nombre = $("#position-nombre").val();


    //$("#position-frase").val(ui.value);

    AddBackGround(context, centerX, centerY, );

    var nombre = $.trim($("#name").val());
    var frase = $.trim($("#frase").val());
    nombre = nombre == '' ? "Tu Nombre" : nombre;
    frase = frase == '' ? "Tu Frase" : frase;
    AddName(context, nombre, centerX, position_nombre, size_name);
    AddLabel(context, "¡" + frase + "!", centerX, position_frase, size_label);
    context.stroke();
    context.save();
    // drawTextAlongArc(context, "¡ES MAS NICA QUE EL PINOL!", centerX, centerY, radius, angle)



}
var tmp_nombre = '';
var tmp_frase = '';
var tmp_size_nombre = 0;
var tmp_size_frase = 0;
var tmp_position_frase = 0;
var tmp_position_nombre = 0;
var tmp_imagen = 1;
(function($) {

    $(window).load(function() {

        $('#carrousel-help').slick({
            dots: true,
            arrows: false,
            infinite: false,
            speed: 300,
            slidesToShow: 1,
        });
        $('body').on('click', '#myCanvas', function() {
            $("#instruction").addClass('show');
        });
        $('body').on('click', '#btnContinuar', function() {
            $("#instruction").removeClass('show');
            CreateImagen();
        });

        $('body').on('click', '#contenainer-style-background span.ave', function() {

            tmp_imagen = 2;
            CreateImagen();

        });
        $('body').on('click', '#contenainer-style-background span.flor', function() {

            tmp_imagen = 1;
            CreateImagen();

        });
        $('body').on('click', '#btnEditarNombre', function() {
            $('.box .col, .calltoaction:not(.edit), #contenainer-position-nombre, #contenainer-position-frase').removeClass('show');
            $('.box-edit-nombre, .calltoaction.edit, #contenainer-position-nombre').addClass('show');

            reset_value();

        });
        $('body').on('click', '#btnEditarFrase', function() {
            $('.box .col, .calltoaction:not(.edit), #contenainer-position-nombre, #contenainer-position-frase').removeClass('show');
            $('.box-edit-frase, .calltoaction.edit, #contenainer-position-frase').addClass('show');
            reset_value
        });
        $('body').on('click', '#btnAceptar', function() {
            $('.box .col, .calltoaction, #contenainer-position-nombre, #contenainer-position-frase').removeClass('show');

            $('.calltoaction:not(.edit)').addClass('show');
            $('.calltoaction.edit').removeClass('show');

        });
        $('body').on('click', '#btnCalcelar', function() {
            $('.box .col, .calltoaction, #contenainer-position-nombre, #contenainer-position-frase').removeClass('show');

            $('.calltoaction:not(.edit)').addClass('show');
            $('#name').val(tmp_nombre);
            $('#frase').val(tmp_frase);
            $('#size-nombre').val(tmp_size_nombre);
            $('#size-frase').val(tmp_size_frase);
            $('#position-frase').val(tmp_position_frase);
            $('#position-nombre').val(tmp_position_nombre);
            reset_value();
            CreateImagen();

        });


        $('body').on('click', '#btnDescargar', function() {

            var _PICTURE_ = document.getElementById('myCanvas');
            _imagen_ = _PICTURE_.toDataURL("image/png");
            _imagen_ = _imagen_.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
            _imagen_ = _imagen_.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=perfil.png');

            var enlace = document.createElement('a');
            // El título
            enlace.download = "perfil.png";
            enlace.href = _imagen_;
            console.log(_imagen_);
            enlace.click();

            gtag('event', 'click', { 'event_category': 'button', 'event_label': 'descargar' });
        });

        $("#slider-vertical-frase").slider({
            orientation: "Horizontal",
            range: "min",
            min: 10,
            max: 200,
            value: 25,
            slide: function(event, ui) {
                $("#size-frase").val(ui.value);
                CreateImagen();

            }
        });
        $("#size-frase").val($("#slider-vertical-frase").slider("value"));

        $("#slider-vertical-nombre").slider({
            orientation: "horizontal",
            range: "min",
            min: 10,
            max: 200,
            value: 80,
            slide: function(event, ui) {
                $("#size-nombre").val(ui.value);
                CreateImagen();

            }
        });
        $("#size-nombre").val($("#slider-vertical-nombre").slider("value"));

        $("#slider-position-nombre").slider({
            orientation: "vertical",
            range: "min",
            min: 0,
            max: 500,
            value: 300,
            slide: function(event, ui) {
                $("#position-nombre").val(600 - (ui.value));
                CreateImagen();

            }
        });
        $("#position-nombre").val($("#slider-position-nombre").slider("value"));


        $("#slider-position-frase").slider({
            orientation: "vertical",
            range: "min",
            min: 0,
            max: 500,
            value: 350,
            slide: function(event, ui) {
                $("#position-frase").val(600 - ui.value);
                CreateImagen();
            }
        });
        $("#position-frase").val($("#slider-position-frase").slider("value"));



        $('body').on('keyup touchend', '.create', function() {
            CreateImagen();
        });
        drawing1.src = "images/flor.png";
        drawing1.onload = function() {

            drawing2.src = "images/ave.png";
            drawing2.onload = function() {

                $("body").removeClass('loading');
                CreateImagen();
            };

        };


        ResetSize();
        $(window).resize(function() {
            ResetSize();
        });

    });

    function ResetSize() {
        var _SCEERN_WIDTH_ = parseInt($(window).width());

        _SCEERN_WIDTH_ = (($('.form').outerWidth() - 50) * 100) / 600;

        if ((parseInt($(window).width())) <= 767) {
            $('#myCanvas').css({
                zoom: (_SCEERN_WIDTH_) + "%"
            });
        } else {
            $('#myCanvas').css({
                zoom: "100%"
            });
        }

    }


})(jQuery);