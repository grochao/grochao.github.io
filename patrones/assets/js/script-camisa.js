//const { json } = require("d3");

$(function () {
    var LienzoHeigh = cm_px(137.16);
    var LienzoWidth = cm_px(50.8)

    function cm_px(num) {
        const _DPI_ = getDPI();
        var base = 1;
        var pixeles = _DPI_;
        return (num * pixeles) / base;
    };

    function cmToReducedPx(cm) {
        const pxPerCm = 38;
        const reductionFactor = 0.05640423;

        const pixels = cm * pxPerCm;
        const reducedPixels = pixels * reductionFactor;

        return reducedPixels;
    }


    function LoadLienzo(params) {
        const _DPI_ = getDPI();

        console.log("pixeles por pulgadas" + _DPI_);
        /* if ($("svg").length) {
              svg.selectAll("*").remove();
          } else {
              svg =
                  d3.select("#svg-container")
                      .append("svg")
                      .attr("width", LienzoWidth)
                      .attr("height", LienzoHeigh);
  
          }*/


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