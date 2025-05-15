//const { json } = require("d3");

$(function () {
    const _DPI_ = getDPI();
    var LienzoHeigh_cm = (137.16);
    var LienzoWidth_cm = (79) //79cm o 29"

    var LienzoHeigh_px = cmToReducedPx(LienzoHeigh_cm);
    var LienzoWidth_px = cmToReducedPx(LienzoWidth_cm);


    function scale() {

        var WidthLienzo = $("#svg-container").width() - 30;
        var WidthReal = LienzoWidth_cm * _DPI_

        return ((WidthLienzo * 100) / WidthReal) / 100

    }
    function cmToReducedPx(cm) {
        const pxPerCm = _DPI_;
        const reductionFactor = scale();

        const pixels = cm * pxPerCm;
        const reducedPixels = pixels * reductionFactor;

        return reducedPixels;
    }


    function LoadLienzo(params) {

        if ($("svg").length) {
            svg.selectAll("*").remove();
        } else {
            svg =
                d3.select("#content-svg")
                    .append("svg")
                    .attr("width", LienzoWidth_px)
                    .attr("height", LienzoHeigh_px);

                    svg.append("image")
    .attr("href", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png")
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", 100)
    .attr("height", 100);

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
        document.body.appendChild(div);
        // Obtener el ancho del elemento en píxeles
        const dpi = div.offsetWidth;
        document.body.removeChild(div);
        return dpi;
    }

    $(window).load(function () {

        //LoadLienzo();

    });
    $('#txt_zoom').on('input', function() {
    let valor = $(this).val();
    $('#pages-zoom').css('transform', 'scale(' + (valor/100) + ')');
});
});