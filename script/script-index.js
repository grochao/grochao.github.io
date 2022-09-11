/*function drawTextAlongArc(context, str, centerX, centerY, radius, angle) {
    var len = str.length,
        s;
    context.save();
    context.translate(centerX, centerY);
    context.rotate(-1 * angle / 2);
    context.rotate(-1 * (angle / len) / 2);
    for (var n = 0; n < len; n++) {
        context.rotate(angle / len);
        context.save();
        context.translate(0, -1 * radius);
        s = str[n];
        context.fillText(s, 0, 0);
        context.restore();
    }
    context.restore();
}*/
var context;

function AddCircle(context, centerX, centerY, radius) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = '#0067c6';
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

    context.stroke();
    context.restore();
}

function AddText(context, Text, centerX, centerY) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    context.fillStyle = '#0067c6';
    context.font = '85pt The Nautigal';
    //drawTextAlongArc(context, 'Guillermo Rocha', centerX, centerY, radius, angle);
    context.textAlign = "center";
    context.textBaseline = 'middle';
    var textString = Text;
    context.fillText(textString, centerX, centerY);
    context.stroke();
    context.restore();
}



function AddBackGround(context, Text, centerX, centerY) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    drawing = new Image()
    drawing.src = "https://grochao.github.io/images/bk.png"
    context.drawImage(drawing, 0, 0, 600, 600);
    context.stroke();
    context.restore();
}


(function($) {

    $(window).load(function() {


        var canvas = document.getElementById('myCanvas');
        context = canvas.getContext('2d');
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        // angle = Math.PI * 0.8,
        radius = 150;



        /*INSERT CIRCLE */
        // AddCircle(context, centerX, centerY, radius);

        /*INSERT TEXT */




        /*context.fillStyle = "#0067c6";
        context.fillRect(0, 0, canvas.width, canvas.height);
*/
        AddBackGround(context, centerX, centerY, );



        AddCircle(context, centerX, centerY, radius);
        AddText(context, "Guillermo", centerX, centerY);
        //AddCircle(context, centerX, centerY, 295);
        $btnDescargar = document.querySelector("#btnDescargar");





        $btnDescargar.addEventListener("click", () => {
            // Crear un elemento <a>
            let enlace = document.createElement('a');
            // El título
            enlace.download = "Canvas como imagen.png";
            // Convertir la imagen a Base64 y ponerlo en el enlace
            enlace.href = canvas.toDataURL();
            // Hacer click en él
            enlace.click();
        });

        // context.stroke();
    });




})(jQuery);