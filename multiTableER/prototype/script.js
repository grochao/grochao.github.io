//const { json } = require("d3");

$(function() {
    var svg;
    var CorteFrontal;
    var CorteTrasero;
    var LienzoHeigh = Ratio_cm_px((91.44 * 2) + 1)
    var LienzoWidth = Ratio_cm_px(86.2)
    var SettingStyleColors;
    var FontInitialX = 0;
    var FontInitialY = 0;
    let offsetY = 0;
    var traslate = {
        x: Ratio_cm_px(2 + 10),
        y: Ratio_cm_px(2)
    }
    var medidas = {
        alto: 0,
        tiro: 0,
        cintura: 0,
        copa: 0,
        cadera: 0,
        rodilla: 0,
        ruedo: 0,
        bota: 6,
        aplome: 0,
        holgura_tiro: 0,
        alto_de_cadera: 0,
        bota: 0,
        delantero: {
            holgura_tiro: 0
        },
        trasero: {
            holgura_tiro: 0
        }
    }

    function GetMesures() {
        medidas.alto = (Number($("#txt_alto").val()));
        medidas.tiro = (Number($("#txt_tiro").val()));
        medidas.cintura = (Number($("#txt_cintura").val()));
        medidas.copa = (Number($("#txt_copa").val()));
        medidas.cadera = (Number($("#txt_cadera").val()));
        medidas.rodilla = (Number($("#txt_rodilla").val()));
        medidas.ruedo = (Number($("#txt_ruedo").val()));


        medidas.aplome = ((medidas.cadera / 4) + 6) / 2
        medidas.delantero.holgura_tiro = 6
        medidas.alto_de_cadera = medidas.tiro - 8;

        medidas.bota = medidas.alto + 6;

        medidas.trasero.holgura_tiro = ((medidas.cadera / 2) / 6) - 2

        $("#txt_rodilla").val(medidas.rodilla);

        $("#str_alto").html(medidas.alto + "<sub>cm</sub>");
        $("#str_tiro").html(medidas.tiro + "<sub>cm</sub>");
        $("#str_cintura").html(medidas.cintura + "<sub>cm</sub>");
        $("#str_copa").html(medidas.copa + "<sub>cm</sub>");
        $("#str_cadera").html(medidas.cadera + "<sub>cm</sub>");
        $("#str_rodilla").html(medidas.rodilla + "<sub>cm</sub>");
        $("#str_ruedo").html(medidas.ruedo + "<sub>cm</sub>");

        medidas.alto = Ratio_cm_px(medidas.alto);
        medidas.tiro = Ratio_cm_px(medidas.tiro);
        medidas.cintura = Ratio_cm_px(medidas.cintura);
        medidas.copa = Ratio_cm_px(medidas.copa);
        medidas.cadera = Ratio_cm_px(medidas.cadera);
        medidas.rodilla = Ratio_cm_px(medidas.rodilla);
        medidas.ruedo = Ratio_cm_px(medidas.ruedo);
        medidas.aplome = Ratio_cm_px(medidas.aplome);
    }

    function Coord(x, y) {
        return {
            x: traslate.x + x,
            y: traslate.y + y
        }
    }

    function ReturnMeasures(_TYPE_ = "FRONTEND") {
        GetMesures();
        var Ancho_de_marca = traslate.y + (medidas.cadera / 4) + Ratio_cm_px(10)

        console.error(Ancho_de_marca);
        var alto_de_rodilla = (((medidas.alto - medidas.tiro) / 2) - Ratio_cm_px(5)) + medidas.tiro
        if ((_TYPE_).toUpperCase() == "FRONTEND") {
            return [{
                    Title: "Cintura",
                    Label: "A",
                    Marcas: [Coord(0, 0), Coord(Ancho_de_marca, 0)],
                    Cortes: [Coord(0, 0), Coord(0, 0)],
                    Point: {
                        a0: Coord(0, 0),
                        a1: Coord(Ancho_de_marca, 0)
                    }
                },
                {
                    Title: "Cadera",
                    Label: "B",
                    Marcas: [Coord(0, medidas.tiro - Ratio_cm_px(8)), Coord(Ancho_de_marca, medidas.tiro - Ratio_cm_px(8))],
                    Cortes: [Coord(0, 0), Coord(0, medidas.alto_de_cadera)],
                    Point: {
                        a0: null, // a0: Coord(0, medidas.alto_de_cadera),
                        a1: null // a1: Coord(Ancho_de_marca, medidas.alto_de_cadera)
                    }
                },
                {
                    Title: "Tiro",
                    Label: "C",
                    Marcas: [Coord(0, medidas.tiro), Coord(Ancho_de_marca, medidas.tiro)],
                    Cortes: [Coord(0, 0), Coord(0, medidas.tiro)],

                    Point: {
                        a0: null, // a0: Coord(0, medidas.alto_de_cadera),
                        a1: null // a1: Coord(Ancho_de_marca, medidas.alto_de_cadera)
                    }
                },
                {
                    Title: "Rodilla",
                    Label: "D",
                    Marcas: [Coord(0, alto_de_rodilla), Coord(Ancho_de_marca, alto_de_rodilla)],
                    Cortes: [
                        Coord(0, medidas.tiro),
                        Coord(medidas.aplome - ((medidas.rodilla / 4) - Ratio_cm_px(0)), alto_de_rodilla - ((alto_de_rodilla - medidas.tiro) * 0.50)),
                        Coord(medidas.aplome - (medidas.rodilla / 4), alto_de_rodilla)
                    ],
                    Point: {
                        a0: null, // a0: Coord(0, medidas.alto_de_cadera),
                        a1: null // a1: Coord(Ancho_de_marca, medidas.alto_de_cadera)
                    }
                },
                {
                    Title: "Alto",
                    Label: "E",
                    Marcas: [Coord(0, medidas.alto), Coord(Ancho_de_marca, medidas.alto)],
                    Cortes: [Coord(medidas.aplome - (medidas.rodilla / 4), alto_de_rodilla), Coord(medidas.aplome - (medidas.ruedo / 4), medidas.alto)],
                    Point: {
                        a0: null, // a0: Coord(0, medidas.alto_de_cadera),
                        a1: null // a1: Coord(Ancho_de_marca, medidas.alto_de_cadera)
                    }
                },
                {
                    Title: "Bota",
                    Label: "F",
                    Marcas: [Coord(0, medidas.alto + Ratio_cm_px(6)), Coord(Ancho_de_marca, medidas.alto + Ratio_cm_px(6))],
                    Cortes: [Coord(medidas.aplome - (medidas.ruedo / 4), medidas.alto), Coord((medidas.aplome - (medidas.ruedo / 4)) - Ratio_cm_px(1.5), medidas.alto + Ratio_cm_px(6))],
                    Point: {
                        a0: null, // a0: Coord(0, medidas.alto_de_cadera),
                        a1: null // a1: Coord(Ancho_de_marca, medidas.alto_de_cadera)
                    }
                },
                {
                    Title: "Bota-Horizontal",
                    Label: "G" /*G-G₁ */ ,
                    Marcas: [Coord(0, 0), Coord(0, 0)],
                    Cortes: [Coord((medidas.aplome - (medidas.ruedo / 4)) - Ratio_cm_px(1.5), medidas.alto + Ratio_cm_px(6)), Coord((medidas.aplome + (medidas.ruedo / 4)) + Ratio_cm_px(1.5), medidas.alto + Ratio_cm_px(6))],
                    Point: {
                        a0: null, // a0: Coord(0, medidas.alto_de_cadera),
                        a1: null // a1: Coord(Ancho_de_marca, medidas.alto_de_cadera)
                    }
                },
                {
                    Title: "Bota-Vertical",
                    Label: "G-F" /*G-F */ ,
                    Marcas: [Coord(0, 0), Coord(0, 0)],
                    Cortes: [Coord((medidas.aplome - (medidas.ruedo / 4)) - Ratio_cm_px(1.5), medidas.alto + Ratio_cm_px(6)), Coord((medidas.aplome + (medidas.ruedo / 4)) + Ratio_cm_px(1.5), medidas.alto + Ratio_cm_px(6))],
                    Point: {
                        a0: null, // a0: Coord(0, medidas.alto_de_cadera),
                        a1: null // a1: Coord(Ancho_de_marca, medidas.alto_de_cadera)
                    }
                }

            ]

        } else {
            return [{
                Title: "Bota",
                Label: "F",
                Marcas: [Coord(0, medidas.bota), Coord(Ancho_de_marca, medidas.bota)],
                Cortes: [Coord(0, medidas.bota), Coord(0 - Ratio_cm_px(2), medidas.bota)],
                Point: {
                    a0: null, // a0: Coord(0, medidas.alto_de_cadera),
                    a1: null // a1: Coord(Ancho_de_marca, medidas.alto_de_cadera)
                }
            }]
        }
    }

    function CreateLine(_points_, _TYPE_ = "FRONTEND", type_line = "trazo") {
        linea = d3.line()
            .curve(d3.curveBasis)
            .x(d => LienzoWidth - d.x) // Invertir la coordenada x
            .y(d => d.y);
        if (_TYPE_ == "FRONTEND") {
            if (type_line == "trazo") {
                CorteFrontal.append("path")
                    .datum(_points_) // Vincular datos
                    .attr("d", linea) // Usar la función de línea para trazar el camino
                    .attr("fill", "none") // Sin relleno, solo trazo
                    .attr("stroke", SettingStyleColors.lineColorCortes) // Color de la línea
                    .attr("stroke-width", 3) // Ancho de la línea
                    .attr("stroke-linecap", "round");


            } else if (type_line == "dash") {
                CorteFrontal.append("path")
                    .datum(_points_) // Vincular datos
                    .attr("d", linea) // Usar la función de línea para trazar el camino
                    .attr("fill", "none") // Sin relleno, solo trazo}
                    .attr("stroke", SettingStyleColors.dottedColor) // Color de la línea
                    .attr("stroke-width", 2) // Ancho de la línea
                    .attr("stroke-dasharray", "8,5")
                    .attr("stroke-linecap", "round");


            } else if (type_line == "pointers") {

                console.warn("***: " + JSON.stringify(_points_.coord));

                if (_points_.coord.a0 !== null) {
                    CorteFrontal.append("circle")
                        .attr("cx", LienzoWidth - traslate.x) // Ajustar 'x' restando del ancho total
                        .attr("cy", _points_.coord.a0.y) // 'y' se mantiene igual
                        .attr("r", Ratio_cm_px(1.3))
                        .attr("fill", SettingStyleColors.backgroundColor)
                        .attr("stroke", SettingStyleColors.colorLabel) // Color del borde
                        .attr("stroke-width", 1);

                    CorteFrontal.append("circle")
                        .attr("cx", LienzoWidth - traslate.x) // Ajustar 'x' restando del ancho total
                        .attr("cy", _points_.coord.a0.y) // 'y' se mantiene igual
                        .attr("r", Ratio_cm_px(0.4))
                        .attr("fill", SettingStyleColors.colorLabel)
                }

                if (_points_.coord.a1 !== null) {
                    CorteFrontal.append("circle")
                        .attr("cx", LienzoWidth - traslate.x) // Ajustar 'x' restando del ancho total
                        .attr("cy", _points_.coord.a1.y) // 'y' se mantiene igual
                        .attr("r", Ratio_cm_px(1.3))
                        .attr("fill", SettingStyleColors.backgroundColor)
                        .attr("stroke", SettingStyleColors.colorLabel) // Color del borde
                        .attr("stroke-width", 1);

                    CorteFrontal.append("circle")
                        .attr("cx", LienzoWidth - traslate.x) // Ajustar 'x' restando del ancho total
                        .attr("cy", _points_.coord.a1.y) // 'y' se mantiene igual
                        .attr("r", Ratio_cm_px(0.4))
                        .attr("fill", SettingStyleColors.colorLabel)
                }



                /*CorteFrontal.append("circle")
                    .attr("cx", LienzoWidth - traslate.x) // Ajustar 'x' restando del ancho total
                    .attr("cy", _points_.coord.a1.y) // 'y' se mantiene igual
                    .attr("r", Ratio_cm_px(1.3))
                    .attr("fill", SettingStyleColors.backgroundColor)
                    .attr("stroke", SettingStyleColors.colorLabel) // Color del borde
                    .attr("stroke-width", 1);

                CorteFrontal.append("circle")
                    .attr("cx", LienzoWidth - traslate.x) // Ajustar 'x' restando del ancho total
                    .attr("cy", _points_.coord.a1.y) // 'y' se mantiene igual
                    .attr("r", Ratio_cm_px(0.4))
                    .attr("fill", SettingStyleColors.colorLabel)*/



                /*CorteFrontal.append("text")
                    .attr("x", (LienzoWidth / 2) - (traslate.x - Ratio_cm_px(0))) // Coordenada x
                    .attr("y", traslate.Y + Ratio_cm_px(0)) // Coordenada y
                    .text(trazo[1].name + " ->") // Texto que se mostrará
                    .attr("font-size", "13px") // Tamaño de la fuente
                    .attr("fill", SettingStyleColors.colorLabel) // Color del texto
                    .attr("text-anchor", "end") // Centrar el texto horizontalmente
                    .attr("dy", "-0.5em")
                    .style("font-family", "Marck Script")*/
            }

        }
    }

    function CreateFrontend() {
        var _DATA_ = ReturnMeasures("FRONTEND");


        var _TRAZOS_ = _DATA_.map(data => {
            return {
                marcas: [
                    data.Marcas
                ],
                cortes: [
                    data.Cortes
                ],
                pointers: {
                    title: data.Title + " ->",
                    label: {
                        der: data.Label,
                        izq: data.Label + "₁"
                    },
                    coord: data.Point
                }

            }
        });

        var i = 0;
        _TRAZOS_.forEach(_trazo_ => {

            _trazo_.marcas.forEach(_marca_ => {
                CreateLine(_marca_, "FRONTEND", "dash");
            });
            _trazo_.cortes.forEach(_corte_ => {
                CreateLine(_corte_, "FRONTEND", "trazo");
            });


        });
        _TRAZOS_.forEach(_trazo_ => {
            //console.log("===========[1]");
            CreateLine(_trazo_.pointers, "FRONTEND", "pointers");
            //console.log("===========[2]");


        });
    }

    function ResturStyles(Style = "Blue") {
        var StyleColor = {
            Blue: {
                backgroundColor: "#2172B9",
                textColor: "#FFFFFF",
                dottedColor: "#cddaee",
                scaleBackgroundColor: "#000000",
                scaleTextColor: "#000000",
                scaleLineColor: "#ff0000",
                colorLabel: "#FFFFFF",
                lineColorCortes: "#F0B605"
            },
            Black: {
                backgroundColor: "#FFFFFF",
                textColor: "#000000",
                dottedColor: "#818181",
                scaleBackgroundColor: "#000000",
                scaleTextColor: "#000000",
                scaleLineColor: "#ff0000",
                colorLabel: "#000000",
                lineColorCortes: "#2172B9"
            }
        }

        return StyleColor[Style];
    }

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


    function clearCanvas() {
        svg.selectAll("*").remove();
    }

    function calcularPixelesPorCm(cm) {
        const pulgadasPorCm = 2.54;
        const pixelesPorCm = getDPI() / pulgadasPorCm;
        return cm * pixelesPorCm;
    }

    function Ratio_cm_px(num) {
        var base = 1;
        var pixeles = 4.3;
        return (num * pixeles) / base;
    };

    /*function mesure(_mesure_) {
        var _mesure_ = (_mesure_ * 1000) / 182.88;
        return _mesure_ - (_mesure_ * 0.50)
            //_mesure_
    }*/
    function loadCoord_scale(type = "") {
        var Yarda = Ratio_cm_px(91.44);
        var Width_line_scale = Ratio_cm_px(10);
        _Scale_ = [
            [{
                x: 0,
                y: Yarda / 2,
                label: "1/2 yd"
            }, {
                x: Width_line_scale,
                y: Yarda / 2,
                label: "1/2 yd"
            }],
            [{
                    x: 0,
                    y: Yarda,
                    label: "1 yd"
                }, {
                    x: Width_line_scale,
                    y: Yarda,
                    label: "1 yd"
                },

            ],
            [{
                x: 0,
                y: Yarda + (Yarda / 2),
                label: "1½ yd"
            }, {
                x: Width_line_scale,
                y: Yarda + (Yarda / 2),
                label: "1½ yd"
            }],
            [{
                x: 0,
                y: Yarda + (Yarda / 4),
                label: "1¼ yd"
            }, {
                x: Width_line_scale,
                y: Yarda + (Yarda / 4),
                label: "1¼ yd"
            }],
            [{
                x: 0,
                y: Yarda + ((Yarda * 3) / 4),
                label: "1¾ yd"
            }, {
                x: Width_line_scale,
                y: Yarda + ((Yarda * 3) / 4),
                label: "1¾ yd"
            }],
            [{
                x: 0,
                y: Yarda * 2,
                label: "2 yd"
            }, {
                x: Width_line_scale,
                y: Yarda * 2,
                label: "2 yd"
            }]
        ]

        if (type == "Coord") {
            return _Scale_.map(scale => {
                return [{
                    x: scale[0].x,
                    y: scale[0].y
                }, {
                    x: scale[1].x,
                    y: scale[1].y
                }]
            });
        } else {
            return _Scale_.map(scale => {
                return [{
                    x: scale[0].x,
                    y: scale[0].y,
                    label: scale[0].label
                }]
            });
        }
    }

    function LoadLienzo(params) {


        if ($("svg").length) {
            svg.selectAll("*").remove();
        } else {
            svg =
                d3.select("#content_svg")
                .append("svg")
                .attr("width", LienzoWidth)
                .attr("height", LienzoHeigh);

        }


    }

    function loadTela() {
        var TelaHeigh = Ratio_cm_px(91.44 * 2) //   182.88cm  // 1000; /* 72pulgadas o 200cm */
        var TelaWidth = Ratio_cm_px(76.2) //  76,2cm  416.6666666666666; /* 30 pulgadas o 76,2cm */


        FontInitialX = 45; //LienzoHeigh //- TelaWidth
        // Crear un grupo (g) y añadir formas dentro
        /*const group = svg.append("g")
            .attr("transform", `translate(${FontInitialX}, ${FontInitialY})`);
*/
        svg.append("rect")
            .attr("x", LienzoWidth - TelaWidth) // Posición x del rectángulo
            .attr("y", 0) // Posición y del rectángulo
            .attr("width", TelaWidth) // Ancho del rectángulo
            .attr("height", TelaHeigh) // Altura del rectángulo
            .attr("fill", SettingStyleColors.backgroundColor) // Color de relleno
            .attr("stroke", "black") // Color del borde
            .attr("stroke-width", 1);

        CorteFrontal = svg.append("g")
            .attr("transform", `translate(${FontInitialX}, ${FontInitialY})`);

        CorteTrasero = svg.append("g");
        /* .attr("transform", "translate(50, 0)")*/



    }

    function LoadScale() {

        const lineaPunteo = d3.line()
            .x(d => d.x) // Invertir la coordenada x
            .y(d => d.y); // Mantener la coordenada y




        const MedioCorte = loadCoord_scale("Coord");
        MedioCorte.forEach(trazo => {
            svg.append("path")
                .datum(trazo) // Vincular datos
                .attr("d", lineaPunteo) // Usar la función de línea para trazar el camino
                .attr("fill", "none") // Sin relleno, solo trazo
                .attr("stroke", SettingStyleColors.scaleLineColor) // Color de la línea
                .attr("stroke-width", 2) // Ancho de la línea
                .attr("stroke-dasharray", "5,2")
                .attr("stroke-linecap", "round");
        });
        const Scale = loadCoord_scale();
        Scale.forEach(dato => {

            svg.append("text")
                .attr("x", 40) // Coordenada x
                .attr("y", dato[0].y + 2) // Coordenada y
                .text(dato[0].label) // Texto que se mostrará
                .attr("font-size", "15px") // Tamaño de la fuente
                .style("font-family", "Marck Script")
                .attr("fill", SettingStyleColors.scaleBackgroundColor) // Color del texto
                .attr("text-anchor", "end") // Centrar el texto horizontalmente
                .attr("dy", "-0.5em"); // Ajuste vertical para colocar el texto encima del punto

        });
    }

    function loadData(type = "") {

        /*alto = (Number($("#txt_alto").val()));
        tiro = (Number($("#txt_tiro").val()));
        cadera
        rodilla = (Number((((alto - tiro) / 2) - 5) + tiro));*/
        if (type == "Cortes") {
            return [
                /* horizontales */
                [{
                        orientacion: "Horizontal",
                        name: "Tiro",
                        label: "A",
                        x: traslate.x,
                        y: traslate.y + Ratio_cm_px(0)
                    },
                    {
                        orientacion: "Horizontal",
                        name: "Tiro",
                        label: "B",
                        x: traslate.x,
                        y: traslate.y + Ratio_cm_px(medidas.tiro)
                    }
                ],
                [{
                        orientacion: "Horizontal",
                        name: "Rodilla",
                        label: "B",
                        x: traslate.x,
                        y: traslate.y + Ratio_cm_px(medidas.tiro)
                    },
                    {
                        orientacion: "Horizontal",
                        name: "Rodilla",
                        label: "A",
                        x: traslate.x + Ratio_cm_px((medidas.aplome - (medidas.rodilla / 4)) - ((medidas.aplome - (medidas.rodilla / 4)) * 0.10)),
                        y: traslate.y + Ratio_cm_px(medidas.rodilla - ((medidas.rodilla - medidas.tiro) * 0.40))
                    },
                    {
                        orientacion: "Horizontal",
                        name: "Rodilla",
                        label: "A",
                        x: traslate.x + Ratio_cm_px(medidas.aplome - (medidas.rodilla / 4)),
                        y: traslate.y + Ratio_cm_px(medidas.rodilla)
                    }
                ],
                [{
                        orientacion: "Horizontal",
                        name: "Rodilla",
                        label: "A",
                        x: traslate.x + Ratio_cm_px(medidas.aplome - (medidas.rodilla / 4)),
                        y: traslate.y + Ratio_cm_px(medidas.rodilla)
                    },
                    {
                        orientacion: "Horizontal",
                        name: "Alto Total",
                        label: "D",
                        x: traslate.x + Ratio_cm_px(medidas.aplome - (medidas.ruedo / 4)),
                        y: traslate.y + Ratio_cm_px(medidas.alto)
                    }
                ],
                [{
                        orientacion: "Horizontal",
                        name: "Bota",
                        label: "E",
                        x: traslate.x + Ratio_cm_px(medidas.aplome - (medidas.ruedo / 4)),
                        y: traslate.y + Ratio_cm_px(medidas.alto)
                    },
                    {
                        orientacion: "Horizontal",
                        name: "Bota",
                        label: "E",
                        x: traslate.x + Ratio_cm_px(medidas.aplome - (medidas.ruedo / 4)),
                        y: traslate.y + Ratio_cm_px(medidas.alto + 6)
                    }
                ],
                [{
                    orientacion: "Horizontal",
                    name: "Bota",
                    label: "E",
                    x: traslate.x + Ratio_cm_px(medidas.aplome - (medidas.ruedo / 4)),
                    y: traslate.y + Ratio_cm_px(medidas.alto + 6)
                }, {
                    orientacion: "Horizontal",
                    name: "Bota",
                    label: "E",
                    x: traslate.x + Ratio_cm_px(medidas.aplome + (medidas.ruedo / 4)),
                    y: traslate.y + Ratio_cm_px(medidas.alto + 6)
                }],
                [{
                        orientacion: "Horizontal",
                        name: "Bota 2",
                        label: "E",
                        x: traslate.x + Ratio_cm_px(medidas.aplome + (medidas.ruedo / 4)),
                        y: traslate.y + Ratio_cm_px(medidas.alto)
                    },
                    {
                        orientacion: "Horizontal",
                        name: "Bota",
                        label: "E",
                        x: traslate.x + Ratio_cm_px(medidas.aplome + (medidas.ruedo / 4)),
                        y: traslate.y + Ratio_cm_px(medidas.alto + 6)
                    }
                ],
                [{
                        orientacion: "Horizontal",
                        name: "Bota 2",
                        label: "E",
                        x: traslate.x + Ratio_cm_px(medidas.aplome + (medidas.ruedo / 4)),
                        y: traslate.y + Ratio_cm_px(medidas.alto)
                    },
                    {
                        orientacion: "Horizontal",
                        name: "Rodilla",
                        label: "A",
                        x: traslate.x + Ratio_cm_px(medidas.aplome + (medidas.rodilla / 4)),
                        y: traslate.y + Ratio_cm_px(medidas.rodilla)
                    }
                ],
                [{
                        orientacion: "Horizontal",
                        name: "Rodilla",
                        label: "A",
                        x: traslate.x + Ratio_cm_px(medidas.aplome + (medidas.rodilla / 4)),
                        y: traslate.y + Ratio_cm_px(medidas.rodilla)
                    },
                    { orientacion: "Vertical", name: "Cadera", label: "B1", x: traslate.x + Ratio_cm_px((medidas.cadera / 4) + 6), y: traslate.y + Ratio_cm_px(medidas.tiro) }
                ],
                /* verticales*/
                [
                    { orientacion: "Vertical", name: "Cadera", label: "A", x: traslate.x, y: traslate.y },
                    { orientacion: "Vertical", name: "Cadera", label: "A1", x: traslate.x + Ratio_cm_px(medidas.cadera / 4), y: traslate.y }
                ],
                [
                    { orientacion: "Vertical", name: "Cadera", label: "B", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.tiro) },
                    { orientacion: "Vertical", name: "Cadera", label: "B1", x: traslate.x + Ratio_cm_px((medidas.cadera / 4) + 6), y: traslate.y + Ratio_cm_px(medidas.tiro) }
                ],
                [
                    //Ratio_cm_px((medidas.cadera / 4) + 6)
                    { orientacion: "Horizontal", name: "Zipper", label: "B1", x: traslate.x + Ratio_cm_px((medidas.cadera / 4) + 6), y: traslate.y + Ratio_cm_px(medidas.tiro) },
                    { orientacion: "Vertical", name: "Zipper", label: "B1", x: traslate.x + Ratio_cm_px((medidas.cadera / 4)), y: traslate.y + Ratio_cm_px(medidas.tiro) },
                    { orientacion: "Vertical", name: "Zipper", label: "A1", x: traslate.x + Ratio_cm_px(medidas.cadera / 4), y: traslate.y + Ratio_cm_px(0) }

                ]
                /*,
                                [
                                    { name: "Rodilla", label: "B", x: traslate.x, y: traslate.y + Ratio_cm_px(tiro) },
                                    { name: "Rodilla", label: "C", x: traslate.x, y: traslate.y + Ratio_cm_px(rodilla) }
                                ],
                                [
                                    { name: "Alto Total", label: "C", x: traslate.x, y: traslate.y + Ratio_cm_px(rodilla) },
                                    { name: "Alto Total", label: "D", x: traslate.x, y: traslate.y + Ratio_cm_px(alto) }
                                ],
                                [
                                    { name: "Bota", label: "D", x: traslate.x, y: traslate.y + Ratio_cm_px(alto) },
                                    { name: "Bota", label: "E", x: traslate.x, y: traslate.y + Ratio_cm_px(alto + 6) }
                                ]*/

            ]
        }
        if (type == "trasos") {
            return [
                { name: "Cintura", label: "A", x: traslate.x, y: traslate.y + Ratio_cm_px(0), size: Ratio_cm_px(0.8) },
                { name: "Tiro", label: "B", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.tiro), size: Ratio_cm_px(0.8) },
                { name: "Rodilla", label: "C", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.rodilla), size: Ratio_cm_px(0.8) },
                { name: "Ruedo", label: "D", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.alto), size: Ratio_cm_px(0.8) },
                { name: "Bota", label: "E", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.alto + 6), size: Ratio_cm_px(0.8) },
            ]
        } else {
            return [
                [
                    { name: "Tiro", label: "A", x: traslate.x, y: traslate.y + Ratio_cm_px(0) },
                    { name: "Tiro", label: "B", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.tiro) }
                ],
                [
                    { name: "Rodilla", label: "B", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.tiro) },
                    { name: "Rodilla", label: "C", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.rodilla) }
                ],
                [
                    { name: "Alto Total", label: "C", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.rodilla) },
                    { name: "Alto Total", label: "D", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.alto) }
                ],
                [
                    { name: "Bota", label: "D", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.alto) },
                    { name: "Bota", label: "E", x: traslate.x, y: traslate.y + Ratio_cm_px(medidas.alto + 6) }
                ],
                [
                    //Ratio_cm_px((medidas.cadera / 4) + 6)
                    { name: "APLOME", label: "X", x: traslate.x + Ratio_cm_px(((medidas.cadera / 4) + 6) / 2), y: traslate.y },
                    { name: "APLOME", label: "X", x: traslate.x + Ratio_cm_px(((medidas.cadera / 4) + 6) / 2), y: traslate.y + Ratio_cm_px(medidas.alto + 6) }
                ]

            ]
        }



    }

    function CreateBackend() {
        const marcas = loadData();
        const linea = d3.line()
            .curve(d3.curveBasis)
            .x(d => LienzoWidth - d.x) // Invertir la coordenada x
            .y(d => d.y); // Mantener la coordenada y


        marcas.forEach(marca => {
            CorteTrasero.append("path")
                .datum(marca) // Vincular datos
                .attr("d", linea) // Usar la función de línea para trazar el camino
                .attr("fill", "none") // Sin relleno, solo trazo
                .attr("stroke", SettingStyleColors.dottedColor) // Color de la línea
                .attr("stroke-width", 2) // Ancho de la línea
                .attr("stroke-dasharray", "8,5")
                .attr("stroke-linecap", "round");


        });
        const Trazos = loadData("trasos");




        const Prologue = Trazos.map(trazo => {
            return [{
                x: trazo.x + 5,
                y: trazo.y,
                name: trazo.name
            }, {
                x: trazo.x + Ratio_cm_px(34) + 5,
                y: trazo.y,
                name: trazo.name
            }]
        });

        Prologue.forEach(trazo => {
            CorteTrasero.append("path")
                .datum(trazo) // Vincular datos
                .attr("d", linea) // Usar la función de línea para trazar el camino
                .attr("fill", "none") // Sin relleno, solo trazo
                .attr("stroke", SettingStyleColors.dottedColor) // Color de la línea
                .attr("stroke-width", 2) // Ancho de la línea
                .attr("stroke-dasharray", "8,5")
                .attr("stroke-linecap", "round");




        });
    }
    /*
       function CreateFrontend() {
           var _TRAZOS_ = ReturnMeasures("FRONTEND");

           _TRAZOS_.forEach(_Trazo_ => {

           });
          


                   const marcas = loadData();
                   const linea = d3.line()
                       .curve(d3.curveBasis)
                       .x(d => LienzoWidth - d.x) // Invertir la coordenada x
                       .y(d => d.y); // Mantener la coordenada y


                   marcas.forEach(marca => {
                       CorteFrontal.append("path")
                           .datum(marca) // Vincular datos
                           .attr("d", linea) // Usar la función de línea para trazar el camino
                           .attr("fill", "none") // Sin relleno, solo trazo
                           .attr("stroke", SettingStyleColors.dottedColor) // Color de la línea
                           .attr("stroke-width", 2) // Ancho de la línea
                           .attr("stroke-dasharray", "8,5")
                           .attr("stroke-linecap", "round");


                   });

                   const Trazos = loadData("trasos");




                   const Prologue = Trazos.map(trazo => {
                       return [{
                           x: trazo.x + 5,
                           y: trazo.y,
                           name: trazo.name
                       }, {
                           x: trazo.x + Ratio_cm_px(34) + 5,
                           y: trazo.y,
                           name: trazo.name
                       }]
                   });

                   Prologue.forEach(trazo => {
                       CorteFrontal.append("path")
                           .datum(trazo) // Vincular datos
                           .attr("d", linea) // Usar la función de línea para trazar el camino
                           .attr("fill", "none") // Sin relleno, solo trazo
                           .attr("stroke", SettingStyleColors.dottedColor) // Color de la línea
                           .attr("stroke-width", 2) // Ancho de la línea
                           .attr("stroke-dasharray", "8,5")
                           .attr("stroke-linecap", "round");




                   });
                   const Cortes = (loadData("Cortes")).map(corte => {



                       return ((corte).length < 3) ? [{
                           x: corte[0].x,
                           y: corte[0].y
                       }, {
                           x: corte[1].x,
                           y: corte[1].y
                       }] : [{
                           x: corte[0].x,
                           y: corte[0].y,
                       }, {
                           x: corte[1].x,
                           y: corte[1].y
                       }, {
                           x: corte[2].x,
                           y: corte[2].y
                       }];
                   });
                   Cortes.forEach(Corte => {
                       CorteFrontal.append("path")
                           .datum(Corte) // Vincular datos
                           .attr("d", linea) // Usar la función de línea para trazar el camino
                           .attr("fill", "none") // Sin relleno, solo trazo
                           .attr("stroke", SettingStyleColors.lineColorCorte) // Color de la línea
                           .attr("stroke-width", 4) // Ancho de la línea
                           .attr("stroke-linecap", "round");

                   });

                   //.style("text-shadow", "0px 0px 4px #ffffff")

                   Trazos.forEach(trazo => {
                       CorteFrontal.append("circle")
                           .attr("cx", LienzoWidth - trazo.x) // Ajustar 'x' restando del ancho total
                           .attr("cy", trazo.y) // 'y' se mantiene igual
                           .attr("r", trazo.size)
                           .attr("fill", SettingStyleColors.backgroundColor)
                           .attr("stroke", SettingStyleColors.colorLabel) // Color del borde
                           .attr("stroke-width", 1);

                       CorteFrontal.append("circle")
                           .attr("cx", LienzoWidth - trazo.x) // Ajustar 'x' restando del ancho total
                           .attr("cy", trazo.y) // 'y' se mantiene igual
                           .attr("r", 0.4)
                           .attr("fill", SettingStyleColors.colorLabel)



                       CorteFrontal.append("text")
                           .attr("x", LienzoWidth - (trazo.x + 8)) // Coordenada x
                           .attr("y", trazo.y + 20) // Coordenada y
                           .text(trazo.label) // Texto que se mostrará
                           .attr("font-size", "11px") // Tamaño de la fuente

                       .attr("fill", SettingStyleColors.colorLabel) // Color del texto
                           .attr("text-anchor", "middle") // Centrar el texto horizontalmente
                           .attr("dy", "-0.5em"); // Ajuste vertical para colocar el texto encima del punto

                       CorteFrontal.append("text")
                           .attr("x", LienzoWidth - (trazo.x + Ratio_cm_px(38))) // Coordenada x
                           .attr("y", trazo.y + 20) // Coordenada y
                           .text(trazo.label + "₁") // Texto que se mostrará
                           .attr("font-size", "11px") // Tamaño de la fuente
                           .attr("fill", SettingStyleColors.colorLabel) // Color del texto
                           .attr("text-anchor", "middle") // Centrar el texto horizontalmente

                       .attr("dy", "-0.5em"); // Ajuste vertical para colocar el texto encima del punto
                   });
                   Prologue.forEach(trazo => {

                       CorteFrontal.append("text")
                           .attr("x", (LienzoWidth / 2) - (trazo[1].x - Ratio_cm_px(75))) // Coordenada x
                           .attr("y", trazo[1].y + 20) // Coordenada y
                           .text(trazo[1].name + " ->") // Texto que se mostrará
                           .attr("font-size", "13px") // Tamaño de la fuente
                           .attr("fill", SettingStyleColors.colorLabel) // Color del texto
                           .attr("text-anchor", "end") // Centrar el texto horizontalmente
                           .attr("dy", "-0.5em")
                           .style("font-family", "Marck Script")

                       //.attr("transform", `rotate(-90, ${LienzoWidth / 2}, ${LienzoHeigh / 2})`);


                   });

                   // Agregar funcionalidad de arrastrar y soltar (drag & drop)
                   CorteFrontal.call(
                       d3.drag()
                       .on("start", dragStarted)
                       .on("drag", dragged)
                       .on("end", dragEnded)
                   );
           

       }*/
    // Funciones de manejo de eventos
    // Funciones de manejo de eventos
    function dragStarted(event) {
        // Calcula el desplazamiento entre el clic y el inicio del grupo
        const transform = d3.select(this).attr("transform");
        const translateY = transform ? +transform.match(/translate\(\d+,\s*(\d+)\)/)[1] : FontInitialY;
        offsetY = event.y - translateY;

        d3.select(this).raise().attr("stroke", "black");
    }

    function dragged(event) {
        // Usa offsetY para mover el grupo sin desplazamiento brusco
        d3.select(this)
            .attr("transform", `translate(${FontInitialX}, ${event.y - offsetY})`);
    }

    function dragEnded(event) {
        d3.select(this).attr("stroke", null);
    }



    function InitReset(Style = "Blue") {

        GetMesures();

        SettingStyleColors = ResturStyles(Style);

        //alert(Style);

        LoadLienzo();
        LoadScale();

        loadTela();
        CreateFrontend();

        // CreateBackend();

    }
    $(window).load(function() {
        const _DPI_ = getDPI();

        $("body").on("click", ".click", function() {
            var IDColor = ($(this).attr("id")).replace("btn_click", "");


            InitReset(IDColor);
        })

    });
});