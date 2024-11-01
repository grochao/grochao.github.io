$(function() {
    var svg;
    var Tela;

    function getDPI() {
        // Crear un elemento temporal de 1 pulgada de ancho
        const div = document.createElement("div");
        div.id = "ppp";
        div.style.display = "block";
        div.style.color = "#ffffff";
        div.style.backgroundColor = "#000000"
        div.style.width = "1in";
        div.style.height = "1in";
        div.style.position = "absolute";
        //div.style.top = "-100%"; // Ocultarlo fuera de la pantalla
        document.body.appendChild(div);

        // Obtener el ancho del elemento en píxeles
        const dpi = div.offsetWidth;


        // Eliminar el elemento temporal

        //var _ppp_ = document.getElementById("ppp");
        //_ppp_.appendChild(document.createTextNode(dpi));
        document.body.removeChild(div);

        return dpi;
    }

    function calcularPixelesPorCm(centimetros) {

        const pulgadas = centimetros / 2.54
        return pulgadas * getDPI();
    }

    function calcularPixelesPorCm(cm, ppp) {
        const pulgadasPorCm = 2.54;
        const pixelesPorCm = ppp / pulgadasPorCm;
        return cm * pixelesPorCm;
    }

    function MesureRatio(_mesure_) {
        var _mesure_ = (_mesure_ * 1000) / 182.88;
        return _mesure_ - (_mesure_ * 0.50)
            //_mesure_
    }

    function LoadLienzo(params) {
        var LienzoHeigh = calcularPixelesPorCm(200) //calcularPixelesPorCm(27.94 - 3); //c
        var LienzoWidth = calcularPixelesPorCm(76.2) //calcularPixelesPorCm(21.59 - 1.5);

        svg = d3.select("#content_svg")
            .append("svg")
            .attr("width", LienzoWidth)
            .attr("height", LienzoHeigh);

        const lineaPunteo = d3.line()
            .x(d => LienzoWidth - d.x) // Invertir la coordenada x
            .y(d => d.y); // Mantener la coordenada y



        var TelaHeigh = calcularPixelesPorCm(50) //   182.88cm  // 1000; /* 72pulgadas o 200cm */
        var TelaWidth = calcularPixelesPorCm(76.2)

        const MedioCorte = [{
            x: calcularPixelesPorCm(0),
            y: calcularPixelesPorCm(5)
        }, {
            x: MesureRatio(50),
            y: calcularPixelesPorCm(5)
        }];

        svg.append("path")
            .datum(MedioCorte) // Vincular datos
            .attr("d", lineaPunteo) // Usar la función de línea para trazar el camino
            .attr("fill", "none") // Sin relleno, solo trazo
            .attr("stroke", "#ED1842") // Color de la línea
            .attr("stroke-width", 2) // Ancho de la línea
            .attr("stroke-dasharray", "10,3"); // Patrón punteado: 5 píxeles de línea, 5 píxeles de espaci
    }

    function loadTela() {
        var TelaHeigh = calcularPixelesPorCm(200) //   182.88cm  // 1000; /* 72pulgadas o 200cm */
        var TelaWidth = calcularPixelesPorCm(76.2) //  76,2cm  416.6666666666666; /* 30 pulgadas o 76,2cm */

        Tela = svg.append("g")
            .attr("transform", "translate(50, 0)")


        Tela.append("rect")
            .attr("x", 0) // Posición x del rectángulo
            .attr("y", 0) // Posición y del rectángulo
            .attr("width", TelaWidth) // Ancho del rectángulo
            .attr("height", TelaHeigh) // Altura del rectángulo
            .attr("fill", "orange") // Color de relleno
            .attr("stroke", "black") // Color del borde
            .attr("stroke-width", 2);
    }

    function LoadScale() {

    }
    $(window).load(function() {
        const _DPI_ = getDPI();
        LoadLienzo();
        //  loadTela();
        LoadScale();
    });
}); {
    x: MesureRatio(4),
    y: MesureRatio(35)
}, {
    x: MesureRatio(5),
    y: MesureRatio(53)
}];
const PuntoCD = [{
    x: MesureRatio(5),
    y: MesureRatio(53)
}, {
    x: MesureRatio(8),
    y: MesureRatio(92)
}];



// Crear una función de línea



// Crear una función de línea, invirtiendo el eje x
const linea1 = d3.line()
    .x(d => LienzoWidth - d.x) // Invertir la coordenada x
    .y(d => d.y); // Mantener la coordenada y



// Dibujar la línea en el SVG
svg.append("path")
    .datum(PuntoAB) // Vincular datos
    .attr("d", linea1) // Usar la función de línea para trazar el camino
    .attr("fill", "none") // Sin relleno, solo trazo
    .attr("stroke", "#074973") // Color de la línea
    .attr("stroke-width", 2); // Ancho de la línea

const linea2 = d3.line()
    .curve(d3.curveBasis)
    .x(d => LienzoWidth - d.x) // Invertir la coordenada x
    .y(d => d.y); // Mantener la coordenada y
svg.append("path")
    .datum(PuntoBC) // Vincular datos
    .attr("d", linea2) // Usar la función de línea para trazar el camino
    .attr("fill", "none") // Sin relleno, solo trazo
    .attr("stroke", "#049DD9") // Color de la línea
    .attr("stroke-width", 2); // Ancho de la línea


// Dibujar la línea en el SVG
svg.append("path")
    .datum(PuntoCD) // Vincular datos
    .attr("d", linea1) // Usar la función de línea para trazar el camino
    .attr("fill", "none") // Sin relleno, solo trazo
    .attr("stroke", "#074973") // Color de la línea
    .attr("stroke-width", 2); // Ancho de la línea