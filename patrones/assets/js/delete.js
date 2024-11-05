function centimetrosAPixeles(centimetros) {

    const pulgadas = centimetros / 2.54
    return pulgadas * getDPI();
}

function MesureRatio(_mesure_) {
    return (_mesure_ * 1000) / 182.88
        //_mesure_
}

var LienzoHeigh = centimetrosAPixeles(27.94 - 3); //MesureRatio(200) //   182.88cm  // 1000; /* 72pulgadas o 200cm */
var LienzoWidth = centimetrosAPixeles(21.59 - 1.5); //MesureRatio(76.2) //  76,2cm  416.6666666666666; /* 30 pulgadas o 76,2cm */


/*.attr("stroke-width", 2) // Ancho de la línea
   .attr("stroke-dasharray", "5,5"); // Patrón punteado: 5 píxeles de línea, 5 píxeles de espaci*/

// Crear el SVG en el cuerpo de la página
const svg = d3.select("body")
    .append("svg")
    .attr("width", LienzoWidth)
    .attr("height", LienzoHeigh);

var TelaHeigh = MesureRatio(200) //   182.88cm  // 1000; /* 72pulgadas o 200cm */
var TelaWidth = MesureRatio(76.2) //  76,2cm  416.6666666666666; /* 30 pulgadas o 76,2cm */
svg.append("rect")
    .attr("x", 0) // Posición x del rectángulo
    .attr("y", 0) // Posición y del rectángulo
    .attr("width", TelaWidth) // Ancho del rectángulo
    .attr("height", TelaHeigh) // Altura del rectángulo
    .attr("fill", "orange") // Color de relleno
    .attr("stroke", "black") // Color del borde
    .attr("stroke-width", 2); // Ancho del borde


/* =================[PROCECCIONES PUNTEO]==================*/
const PuntoA_A1 = [{
    x: MesureRatio(1),
    y: MesureRatio(1)
}, {
    x: MesureRatio(40),
    y: MesureRatio(1)
}];
const lineaPunteo1 = d3.line()
    .x(d => LienzoWidth - d.x) // Invertir la coordenada x
    .y(d => d.y); // Mantener la coordenada y



// Dibujar la línea en el SVG
svg.append("path")
    .datum(PuntoA_A1) // Vincular datos
    .attr("d", lineaPunteo1) // Usar la función de línea para trazar el camino
    .attr("fill", "none") // Sin relleno, solo trazo
    .attr("stroke", "#ED1842") // Color de la línea
    .attr("stroke-width", 2) // Ancho de la línea
    .attr("stroke-dasharray", "10,3"); // Patrón punteado: 5 píxeles de línea, 5 píxeles de espaci
const PuntoB_B1 = [{
    x: MesureRatio(1),
    y: MesureRatio(40)
}, {
    x: MesureRatio(40),
    y: MesureRatio(40)
}];
svg.append("path")
    .datum(PuntoB_B1) // Vincular datos
    .attr("d", lineaPunteo1) // Usar la función de línea para trazar el camino
    .attr("fill", "none") // Sin relleno, solo trazo
    .attr("stroke", "#ED1842") // Color de la línea
    .attr("stroke-width", 2) // Ancho de la línea
    .attr("stroke-dasharray", "10,3"); // Patrón punteado: 5 píxeles de línea, 5 píxeles de espaci

const PuntoP_P1 = [{
    x: MesureRatio(20),
    y: MesureRatio(1)
}, {
    x: MesureRatio(20),
    y: MesureRatio(100)
}];
/*LINEA DE APLOME*/
svg.append("path")
    .datum(PuntoP_P1) // Vincular datos
    .attr("d", lineaPunteo1) // Usar la función de línea para trazar el camino
    .attr("fill", "none") // Sin relleno, solo trazo
    .attr("stroke", "#ED1842") // Color de la línea
    .attr("stroke-width", 2) // Ancho de la línea
    .attr("stroke-dasharray", "10,3"); // Patrón punteado: 5 píxeles de línea, 5 píxeles de espaci
/* =================[PROCECCIONES PUNTEO]==================*/



svg.append("rect")
    .attr("x", MesureRatio(20)) // Posición horizontal
    .attr("y", MesureRatio(1)) // Posición vertical
    .attr("width", 2) // Ancho del cuadrado
    .attr("height", 2) // Alto del cuadrado
    .attr("fill", "red");

const PuntoAB = [{
    x: MesureRatio(1),
    y: MesureRatio(1)
}, {
    x: MesureRatio(1),
    y: MesureRatio(24)
}];

const PuntoBC = [{
    x: MesureRatio(1),
    y: MesureRatio(24)
}, {
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