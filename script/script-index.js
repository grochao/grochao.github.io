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

function AddCircle(context, centerX, centerY, radius) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    context.lineWidth = 15;
    context.strokeStyle = '#EFB810';
    context.fillStyle = 'rgba(255,255,255,0.5)';
    // context.globalAlpha = 0.5;
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    context.fill();
    context.stroke();
    context.restore();
}

function AddName(context, Text, centerX, centerY) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    context.fillStyle = '#0067c6';
    context.font = '60pt Great Vibes';
    //drawTextAlongArc(context, 'Guillermo Rocha', centerX, centerY, radius, angle);
    context.textAlign = "center";
    context.textBaseline = 'middle';
    var textString = Text;
    context.fillText(textString, centerX, centerY - 10);
    context.stroke();
    context.restore();
}

function AddLabel(context, Text, centerX, centerY) {

    context.save();
    context.moveTo(0, 0);
    context.beginPath();
    context.fillStyle = '#0067c6';
    context.font = '25pt Oxygen';
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
    drawing.src = "https://grochao.github.io/images/bk-diagonal.png"
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
        angle = (Math.PI) * 0.8,
            radius = 200;



        /*INSERT CIRCLE */
        // AddCircle(context, centerX, centerY, radius);

        /*INSERT TEXT */




        /*context.fillStyle = "#0067c6";
        context.fillRect(0, 0, canvas.width, canvas.height);
*/
        AddBackGround(context, centerX, centerY, );



        AddCircle(context, centerX, centerY, radius);
        AddName(context, "Guillermo Rocha", centerX, centerY);
        AddLabel(context, "¡Es más nica que el pinol!", centerX, centerY);
        //AddCircle(context, centerX, centerY, 295);


        // drawTextAlongArc(context, "¡ES MAS NICA QUE EL PINOL!", centerX, centerY, radius, angle)


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