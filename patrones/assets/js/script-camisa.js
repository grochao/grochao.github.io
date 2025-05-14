//const { json } = require("d3");

$(function () {
    var LienzoHeigh_cm = (137.16);
    var LienzoWidth_cm = (79) //79cm o 29"

    var LienzoHeigh_px =cmToReducedPx(LienzoHeigh_cm);
    var LienzoWidth_px =cmToReducedPx(LienzoWidth_cm);

    
    function scale() {
        const _DPI_ = getDPI();
        var WidthLienzo = $("#svg-container").width() - 15;
        var WidthReal = LienzoWidth_cm * _DPI_

        return ((WidthLienzo * 100)/WidthReal)/100

    }
    function cmToReducedPx(cm) {
        const pxPerCm = _DPI_;
        const reductionFactor =scale();

        const pixels = cm * pxPerCm;
        const reducedPixels = pixels * reductionFactor;

        return reducedPixels;
    }


    function LoadLienzo(params) {
        const _DPI_ = getDPI();

        if ($("svg").length) {
              svg.selectAll("*").remove();
          } else {
              svg =
                  d3.select("#svg-container")
                      .append("svg")
                      .attr("width", LienzoWidth_px)
                      .attr("height", LienzoHeigh_px);
  
          }


    }


    function getDPI() {
        // Crear un elemento temporal de 1 pulgada de ancho
        const div = document.createElement("div");
        div.id = "ppp";
        div.style.display = "block";
        div.style.color = "#ffffff";
        div.style.backgroundColor = "#000000"
        div.style.width = "1cm";
        div.style.height = "1cm";
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

    $(window).load(function () {

        LoadLienzo();

    });
});