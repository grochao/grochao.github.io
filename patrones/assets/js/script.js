//const { json } = require("d3");

$(function() {
    var Step = 3;
    var IDStyleColor = "Blue";
    var svg;
    var CorteFrontal;
    var CorteTrasero;
    var LienzoHeigh = Ratio_cm_px((91.44 * 2) + 1)
    var LienzoWidth = Ratio_cm_px(90)
    var SettingStyleColors;
    var FontInitialX = 0;
    var FontInitialY = 0;
    let offsetY = 0;
    var traslate = {
        x: Ratio_cm_px(1),
        y: Ratio_cm_px(1.8)
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
        medidas.bota = Ratio_cm_px(medidas.bota);
        medidas.delantero.holgura_tiro = Ratio_cm_px(medidas.delantero.holgura_tiro);
        medidas.alto_de_cadera = Ratio_cm_px(medidas.alto_de_cadera);
        medidas.trasero.holgura_tiro = Ratio_cm_px(medidas.trasero.holgura_tiro);

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
        var Aplome = (traslate.y + (((medidas.cadera / 4) + 6) / 2)) /* IMPORTANTE CALCULAR LA OLGURA DEL TURO */ ;
        //console.error(Ancho_de_marca);
        var alto_de_rodilla = (((medidas.alto - medidas.tiro) / 2) - Ratio_cm_px(5)) + medidas.tiro;

        if ((_TYPE_).toUpperCase() == "FRONTEND") {
            return [{
                    Title: null,
                    Label: "G",
                    Marcas: [Coord(0, 0), Coord(0, medidas.alto + Ratio_cm_px(6))],
                    Cortes: null,
                    Point: {
                        a0: null,
                        a1: null
                    }
                },
                {
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
                    Marcas: [Coord(0, medidas.alto_de_cadera), Coord(Ancho_de_marca, medidas.alto_de_cadera)],
                    Cortes: [Coord(0, 0), Coord(0, medidas.alto_de_cadera)],
                    Point: {
                        a0: Coord(0, medidas.alto_de_cadera),
                        a1: Coord(Ancho_de_marca, medidas.alto_de_cadera)
                    }
                },
                {
                    Title: "Tiro",
                    Label: "C",
                    Marcas: [Coord(0, medidas.tiro), Coord(Ancho_de_marca, medidas.tiro)],
                    Cortes: [Coord(0, 0), Coord(0, medidas.tiro)],

                    Point: {
                        a0: Coord(0, medidas.tiro),
                        a1: Coord(Ancho_de_marca, medidas.tiro)
                    }
                }

                ,
                /*
                                    {
                                        Title: null, 
                                        Title2:"ANCHO DE CADERA",
                    ,
                    Label: "",
                    Marcas: null,
                    Cortes: [Coord(0, medidas.tiro), Coord(Ancho_de_marca, medidas.tiro)],
                    Point: {
                        a0: null,
                        a1: null
                    }
                }, */
                {
                    Title: null,
                    Title2: "ALTO DEL ZIPPER",
                    Label: "",
                    Marcas: null,
                    Cortes: [Coord(Ancho_de_marca, medidas.tiro), Coord(Ancho_de_marca - Ratio_cm_px(6), medidas.tiro - Ratio_cm_px(2)), Coord(Ancho_de_marca - Ratio_cm_px(6), 0)],
                    Point: {
                        a0: null,
                        a1: null
                    }
                }, {
                    Title: "Rodilla",
                    Label: "D",
                    Marcas: [Coord(0, alto_de_rodilla), Coord(Ancho_de_marca, alto_de_rodilla)],
                    Cortes: [
                        Coord(0, medidas.tiro),
                        Coord(medidas.aplome - ((medidas.rodilla / 4) - Ratio_cm_px(0)), alto_de_rodilla - ((alto_de_rodilla - medidas.tiro) * 0.50)),
                        Coord(medidas.aplome - (medidas.rodilla / 4), alto_de_rodilla)
                    ],
                    Point: {
                        a0: Coord(0, alto_de_rodilla),
                        a1: Coord(Ancho_de_marca, alto_de_rodilla)
                    }
                }, {
                    Title: "Alto",
                    Label: "E",
                    Marcas: [Coord(0, medidas.alto), Coord(Ancho_de_marca, medidas.alto)],
                    Cortes: [Coord(medidas.aplome - (medidas.rodilla / 4), alto_de_rodilla), Coord(medidas.aplome - (medidas.ruedo / 4), medidas.alto)],
                    Point: {
                        a0: Coord(0, medidas.alto),
                        a1: Coord(Ancho_de_marca, medidas.alto)
                    }
                }, {
                    Title: "Bota",
                    Label: "F",
                    Marcas: [Coord(0, medidas.alto + Ratio_cm_px(6)), Coord(Ancho_de_marca, medidas.alto + Ratio_cm_px(6))],
                    Cortes: [Coord(medidas.aplome - (medidas.ruedo / 4), medidas.alto), Coord((medidas.aplome - (medidas.ruedo / 4)) - Ratio_cm_px(1.5), medidas.alto + Ratio_cm_px(6))],
                    Point: {
                        a0: Coord(0, medidas.alto + Ratio_cm_px(6)),
                        a1: Coord(Ancho_de_marca, medidas.alto + Ratio_cm_px(6))
                    }
                },

                {
                    Title: "Aplome",
                    Label: "G",
                    Marcas: [Coord(Aplome, 0), Coord(Aplome, medidas.alto + Ratio_cm_px(6))],
                    Cortes: null,
                    Point: {
                        a0: Coord(Aplome, medidas.alto + Ratio_cm_px(6)),
                        a1: Coord(Aplome, 0)
                    }
                },

                {
                    Title: "Bota-Horizontal",
                    Label: "G", //G-G₁ 

                    Marcas: [Coord(0, 0), Coord(0, 0)],
                    Cortes: [Coord((medidas.aplome - (medidas.ruedo / 4)) - Ratio_cm_px(1.5), medidas.alto + Ratio_cm_px(6)), Coord((medidas.aplome + (medidas.ruedo / 4)) + Ratio_cm_px(1.5), medidas.alto + Ratio_cm_px(6))],
                    Point: {
                        a0: null, // a0: Coord(0, medidas.alto_de_cadera),
                        a1: null // a1: Coord(Ancho_de_marca, medidas.alto_de_cadera)
                    }
                }, {
                    Title: "Bota-Vertical",
                    Label: "G-F", //G-F ,
                    Marcas: null,
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

    function appendCircle(_corte_, _points_, stroke_type = "solid", stroke_width = 2) {
        var marker = _corte_.append("g").attr("title", "Circle" + _points_.Label.izq)
        LineColor = SettingStyleColors.dottedColor;
        FillColor = SettingStyleColors.backgroundColor
        marker.append("circle")
            .attr("cx", (LienzoWidth) - _points_.Coord.x) // Ajustar 'x' restando del ancho total
            .attr("cy", _points_.Coord.y) // 'y' se mantiene igual
            .attr("r", Ratio_cm_px(0.9))
            .attr("fill", FillColor)
            .attr("stroke-dasharray", "none")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "none")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1)
            .attr("stroke", LineColor);

        marker.append("circle")
            .attr("cx", (LienzoWidth) - _points_.Coord.x) // Ajustar 'x' restando del ancho total
            .attr("cy", _points_.Coord.y) // 'y' se mantiene igual
            .attr("r", Ratio_cm_px(0.4))
            .attr("fill", LineColor)
            .attr("stroke-width", "none")
            .attr("stroke-dasharray", "none")
            .attr("stroke-linecap", "none")
            .attr("stroke-width", "none")
            .attr("stroke", "none");
    }

    function appendLine(_corte_, _points_, stroke_type = "solid", stroke_width = 2) {
        var linea = d3.line()
            .curve(d3.curveBasis)
            .x(d => LienzoWidth - d.x) // Invertir la coordenada x
            .y(d => d.y);
        var dasharray = "";
        var LineColor = "";
        if (stroke_type == "dash") {
            dasharray = "12,8";
            LineColor = SettingStyleColors.dottedColor;
        } else if (stroke_type == "solid") {
            dasharray = "none";
            LineColor = SettingStyleColors.lineColorCortes;
        } else if (stroke_type == "marker") {
            dasharray = "none";
            LineColor = SettingStyleColors.dottedColor;
        }


        _corte_.append("path")
            .datum(_points_) // Vincular datos
            .attr("d", linea) // Usar la función de línea para trazar el camino
            .attr("fill", "none") // Sin relleno, solo trazo
            .attr("stroke-linecap", "round")
            .attr("stroke", LineColor) // Color de la línea
            .attr("stroke-dasharray", dasharray)
            .attr("stroke-width", stroke_width);

    }

    function CreateLine(_points_, _TYPE_ = "FRONTEND", type_line = "trazo") {
        var Ancho_de_marca = traslate.y + (medidas.cadera / 4) + Ratio_cm_px(10)
        linea = d3.line()
            .curve(d3.curveBasis)
            .x(d => LienzoWidth - d.x) // Invertir la coordenada x
            .y(d => d.y);
        if (_TYPE_ == "FRONTEND") {
            // console.info(_points_);
            if (type_line == "trazo") {
                appendLine(CorteFrontal, _points_, "solid", 3);
            } else if (type_line == "dash") {
                appendLine(CorteFrontal, _points_, "dash", 2);
            } else if (type_line == "pointers") {
                if (_points_.Coord.a0 !== null) {


                    appendCircle(CorteFrontal, {

                        Title: _points_.Title,
                        Label: {
                            der: _points_.Label.der,
                            izq: _points_.Label.der
                        },
                        Coord: _points_.Coord.a0

                    }, "marker", 2);

                    console.log("entró");

                }
                if (_points_.Coord.a1 !== null) {

                    appendCircle(CorteFrontal, {

                        Title: _points_.Title,
                        Label: {
                            der: _points_.Label.der,
                            izq: _points_.Label.der
                        },
                        Coord: _points_.Coord.a1

                    }, "marker", 2);
                }

                if (_points_.Coord.a1 !== null) {

                    if (_points_.Title !== null) {
                        if ((_points_.Title).includes("Aplome")) {
                            CorteFrontal.append("text")
                                .attr("x", (LienzoWidth) - _points_.Coord.a0.x) // Coordenada x
                                .attr("y", _points_.Coord.a0.y - (_points_.Coord.a0.y * 0.30)) // Coordenada y
                                .text(_points_.Title) // Texto que se mostrará
                                .attr("font-size", "14px") // Tamaño de la fuente
                                .attr("fill", SettingStyleColors.colorLabel) // Color del texto
                                .attr("text-anchor", "middle") // Centrar horizontalmente
                                .attr("dominant-baseline", "middle") // Centrar verticalmente
                                .attr("dy", "-0.5em")
                                .style("font-family", "Marck Script")
                                .attr("transform", `rotate(-90, ${(LienzoWidth) -_points_.Coord.a0.x}, ${_points_.Coord.a0.y-(_points_.Coord.a0.y*0.30) })`)
                                .attr("stroke-width", "none")
                                .attr("stroke-dasharray", "none")
                                .attr("stroke-linecap", "none")
                                .attr("stroke-width", "none")
                                .attr("stroke", "none");
                        } else {
                            CorteFrontal.append("text")
                                .attr("x", (LienzoWidth) - Ancho_de_marca - Ratio_cm_px(20)) // Coordenada x
                                .attr("y", _points_.Coord.a0.y + Ratio_cm_px(3)) // Coordenada y
                                .text(_points_.Title) // Texto que se mostrará
                                .attr("font-size", "14px") // Tamaño de la fuente
                                .attr("fill", SettingStyleColors.colorLabel) // Color del texto
                                .attr("text-anchor", "end") // Centrar el texto horizontalmente
                                .attr("dy", "-0.5em")
                                .style("font-family", "Marck Script")
                                .attr("stroke-width", "none")
                                .attr("stroke-dasharray", "none")
                                .attr("stroke-linecap", "none")
                                .attr("stroke-width", "none")
                                .attr("stroke", "none");

                        }
                    }





                    CorteFrontal.append("text")
                        .attr("x", (LienzoWidth) - _points_.Coord.a0.x - Ratio_cm_px(4)) // Coordenada x
                        .attr("y", _points_.Coord.a0.y + Ratio_cm_px(5)) // Coordenada y
                        .text(_points_.Label.der) // Texto que se mostrará
                        .attr("font-size", "10px") // Tamaño de la fuente
                        .attr("fill", SettingStyleColors.colorLabel) // Color del texto
                        .attr("text-anchor", "begin") // Centrar el texto horizontalmente
                        .attr("dy", "-0.5em")
                        .style("font-family", "Arial")

                    CorteFrontal.append("text")
                        .attr("x", (LienzoWidth) - _points_.Coord.a1.x + Ratio_cm_px(2)) // Coordenada x
                        .attr("y", _points_.Coord.a1.y + Ratio_cm_px(5)) // Coordenada y
                        .text(_points_.Label.izq) // Texto que se mostrará
                        .attr("font-size", "10px") // Tamaño de la fuente
                        .attr("fill", SettingStyleColors.colorLabel) // Color del texto
                        .attr("text-anchor", "begin") // Centrar el texto horizontalmente
                        .attr("dy", "-0.5em")
                        .style("font-family", "Arial")
                }



                /*CorteFrontal.append("circle")
                    .attr("cx", LienzoWidth - traslate.x) // Ajustar 'x' restando del ancho total
                    .attr("cy", _points_.Coord.a1.y) // 'y' se mantiene igual
                    .attr("r", Ratio_cm_px(1.3))
                    .attr("fill", SettingStyleColors.backgroundColor)
                    .attr("stroke", SettingStyleColors.colorLabel) // Color del borde
                    .attr("stroke-width", 1);

                CorteFrontal.append("circle")
                    .attr("cx", LienzoWidth - traslate.x) // Ajustar 'x' restando del ancho total
                    .attr("cy", _points_.Coord.a1.y) // 'y' se mantiene igual
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
                    Title: data.Title + " ->",
                    Label: {
                        der: data.Label,
                        izq: data.Label + "₁"
                    },
                    Coord: data.Point
                }

            }
        });

        var i = 0;
        _TRAZOS_.forEach((_trazo_, index) => {

            _trazo_.marcas.forEach(_marca_ => {
                if (_marca_ !== null) {
                    CreateLine(_marca_, "FRONTEND", "dash");
                }
            });
            _trazo_.cortes.forEach(_corte_ => {
                //(value, index)

                //console.warn(index + "<= " + Step);
                if (_corte_ !== null && (index < Step)) {
                    CreateLine(_corte_, "FRONTEND", "trazo");
                }
            });


        });
        _TRAZOS_.forEach(_trazo_ => {
            ////console.log("===========[1]");
            CreateLine(_trazo_.pointers, "FRONTEND", "pointers");
            ////console.log("===========[2]");


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
        var pixeles = 5.3;
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


        FontInitialX = Ratio_cm_px(0); //LienzoHeigh //- TelaWidth
        FontInitialy = Ratio_cm_px(0);
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
            .attr("stroke-width", 1)

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
        const groupScale = svg.append("g")

        cuarto_de_yarda = Ratio_cm_px(91.44) / 8;
        impar = 0;
        for (let _PosVertital_ = 0; _PosVertital_ < (2 * 8); _PosVertital_++) {
            isPar = (_PosVertital_ + 1) % 2 === 0 ? true : false;

            groupScale.append("rect")
                .attr("x", Ratio_cm_px(0))
                .attr("y", 0 + (_PosVertital_ * cuarto_de_yarda))
                .attr("width", Ratio_cm_px(1))
                .attr("height", cuarto_de_yarda)
                .attr("fill", (isPar) ? "#000000" : "#ebebeb");

        }
        MedioCorte.forEach(trazo => {
            groupScale.append("path")
                .datum(trazo) // Vincular datos
                .attr("d", lineaPunteo) // Usar la función de línea para trazar el camino
                .attr("fill", "none") // Sin relleno, solo trazo
                .attr("stroke", SettingStyleColors.scaleLineColor) // Color de la línea
                .attr("stroke-width", 2) // Ancho de la línea
                .attr("stroke-linecap", "round");
        });
        const Scale = loadCoord_scale();




        Scale.forEach(dato => {


            groupScale.append("text")
                .attr("x", 20) // Coordenada x
                .attr("y", dato[0].y + 2) // Coordenada y
                .text(dato[0].label) // Texto que se mostrará
                .attr("font-size", "15px") // Tamaño de la fuente
                .style("font-family", "Marck Script")
                .attr("fill", SettingStyleColors.scaleBackgroundColor) // Color del texto
                .attr("text-anchor", "center") // Centrar el texto horizontalmente
                .attr("dy", "-0.5em"); // Ajuste vertical para colocar el texto encima del punto

        });
    }


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
        $(".col2").scrollTop(0);
        GetMesures();

        SettingStyleColors = ResturStyles(Style);

        //alert(Style);

        LoadLienzo();


        loadTela();
        CreateFrontend();
        LoadScale();
        // CreateBackend();

    }
    $(window).load(function() {
        const _DPI_ = getDPI();
        $(".slider").slider({
            max: 20,
            min: 0,
            value: Step,
            slide: function(e, ui) {

                Step = ui.value;
                InitReset(IDStyleColor);
            }
        });
        $("body").on("click", ".click", function() {
            IDStyleColor = ($(this).attr("id")).replace("btn_click", "");
            InitReset(IDStyleColor);
        })

    });
});