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


    context.fillText(textString, centerX, centerY - 10);


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
    context.fillText(textString, centerX, centerY + 50);
    context.stroke();
    context.restore();
}


function AddBackGround(context, Text, centerX, centerY) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    drawing = new Image()
    drawing.crossOrigin = "Anonymous";
    drawing.src = "https://grochao.github.io/images/bk-diagonal-flower.png"

    context.drawImage(drawing, 0, 0, 600, 600);
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
    var str_name = $("#name").val();
    var str_label = $("#frase").val();

    AddBackGround(context, centerX, centerY, );

    var nombre = $.trim($("#name").val());
    var frase = $.trim($("#frase").val());
    nombre = nombre == '' ? "Tu Nombre" : nombre;
    frase = frase == '' ? "Tu Frase" : frase;
    AddName(context, nombre, centerX, centerY, size_name);
    AddLabel(context, "¡" + frase + "!", centerX, centerY, size_label);
    context.stroke();
    context.save();
    // drawTextAlongArc(context, "¡ES MAS NICA QUE EL PINOL!", centerX, centerY, radius, angle)

}
(function($) {

    $(window).load(function() {




        $btnDescargar = document.querySelector("#btnDescargar");





        $btnDescargar.addEventListener("click", () => {
            // Crear un elemento <a>
            var enlace = document.createElement('a');
            // El título
            enlace.download = "pefil.png";

            var _PICTURE_ = document.getElementById('myCanvas');
            // Convertir la imagen a Base64 y ponerlo en el enlace

            enlace.href = _PICTURE_.toDataURL();
            // Hacer click en él
            enlace.click();
        });

        $("#slider-vertical-frase").slider({
            orientation: "Horizontal",
            range: "min",
            min: 0,
            max: 100,
            value: 25,
            slide: function(event, ui) {
                $("#size-frase").val(ui.value);
                CreateImagen();
                var g = parseInt(ui.value <= 50 ? 255 : 255 - ((ui.value - 50) * (255 / 50)));
                var r = parseInt(ui.value >= 50 ? 255 : 255 - ((50 - ui.value) * (255 / 50)));
                $(".ui-widget-header").css("background-color", "rgb(255,165,0)");
            }
        });
        $("#size-frase").val($("#slider-vertical-frase").slider("value"));

        $("#slider-vertical-nombre").slider({
            orientation: "Horizontal",
            range: "min",
            min: 0,
            max: 100,
            value: 60,
            slide: function(event, ui) {
                $("#size-nombre").val(ui.value);
                CreateImagen();
                var g = parseInt(ui.value <= 50 ? 255 : 255 - ((ui.value - 50) * (255 / 50)));
                var r = parseInt(ui.value >= 50 ? 255 : 255 - ((50 - ui.value) * (255 / 50)));
                $(".ui-widget-header").css("background-color", "rgb(255,165,0)");
            }
        });
        $("#size-nombre").val($("#slider-vertical-nombre").slider("value"));
        CreateImagen();
        $('body').on('keyup touchend', '.create', function() {
            CreateImagen();
        });
    });




})(jQuery);