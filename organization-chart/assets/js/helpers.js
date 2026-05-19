let _position_button_ = {
    top: 0,
    left: 0
}
const _VIRTUAL_WIDTH_ = 1920;
const _VIRTUAL_HEIGHT_ = 1080;
const _INNERGRID_ = {
    width: Math.floor(_VIRTUAL_WIDTH_ / 100) * 100,
    height: (Math.floor(_VIRTUAL_HEIGHT_ / 100) * 100) - 50,
    x: (_VIRTUAL_WIDTH_ / 2) - ((Math.floor(_VIRTUAL_WIDTH_ / 100) * 100) / 2),
    y: 90
}


let _chart_JSON_ = null;


_HELPERS_ = {
    fn: {

        __esArrayNuloOVacio(_var_) {
            // null o undefined
            if (_var_ == null) return true;

            // string primitivo o String objeto
            if (typeof _var_ === 'string' || _var_ instanceof String) {
                return _var_.toString().trim().length === 0;
            }

            // arrays
            if (Array.isArray(_var_)) return _var_.length === 0;

            // Map/Set
            if (_var_ instanceof Map || _var_ instanceof Set) return _var_.size === 0;

            // objeto “plano”
            if (Object.prototype.toString.call(_var_) === '[object Object]') {
                return Object.keys(_var_).length === 0;
            }

            // number, boolean, function, Date, etc. -> no se consideran “vacíos”
            return false;
        },
        __log({ data = null, title = "Data:" }) {
            console.groupCollapsed(title)
            if (!_HELPERS_.fn.__esArrayNuloOVacio(data)) {
                console.log("%c" + data, "background-color:#026937; color:#fff");
            } else {
                console.log("%c undefined or null", "background-color:#ff0000; color:#fff: ", data);
            }
            console.groupEnd();
        },
        __returnBulletsBTN: function ({
            x = 0,
            y = -5,
            width = 10,
            height = 10,
            fill = "#ffffff",
            stroke = '#0077b6',
            strokeWidth = 2,
            name = "btn"
        }) {
            return new Konva.Rect({
                x: x,
                y: y,
                name: "bullet_" + name,
                width: width,
                height: height,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                opacity: 0,
                cornerRadius: width / 2,
            }).on('mouseenter', (e) => {

            }).on('click', (e) => {
                e.evt.preventDefault();

                const _btn_ = e.currentTarget.getParent();


                // normalizamos
                let realX = 0;
                let realY = 0;

                // obtenemos el rect del contenedor para posicionar el menú en la página
                const menu = d3.select("#contextmenu");

                // obtenemos el rect del contenedor para posicionar el menú en la página
                // const stageRect = stage.container().getBoundingClientRect();


                menu.attr("class", "show " + name)
                menu.attr("style", "")


                switch (name) {
                    case "rightCenter":
                        realX = _btn_.x() + (_btn_.width() / 2) //+ _btn_.width()//  pointer.x / scale;
                        realY = _btn_.y() + (_btn_.height() / 2) // pointer.y / scale;
                        menu.style("left", ((15 + realX) + 5) + "px");
                        menu.style("top", ((90 + realY) - 17) + "px");

                        break;

                    case "bottomCenter":
                        realX = _btn_.x() - (_btn_.width() / 2)//  pointer.x / scale;
                        realY = _btn_.y() + (_btn_.height()) // pointer.y / scale;
                        menu.style("left", ((15 + realX) - 20) + "px");
                        menu.style("top", ((90 + realY) + 5) + "px");

                        break;
                    case "leftCenter":

                        realX = _btn_.x() - (_btn_.width() / 2) //+ _btn_.width()//  pointer.x / scale;
                        realY = _btn_.y() + (_btn_.height()) // pointer.y / scale;
                        menu.style("left", ((15 + realX) - 60) + "px");
                        menu.style("top", ((90 + realY) - 60) + "px");
                        break;

                    default:
                        menu.attr("class", "")
                        break;
                }




            });/*.on('click', (e) => {
                //const _btn_ = e.currentTarget.getParent();


            });*/

        },
        __strTrim: function (str) {
            return (String(str)).replace(/^\s+|\s+$/g, '');
        },
        __strLTrim: function (str) {
            return str.replace(/^\s+/, '');
        }, __strRTrim: function (str) {
            return str.replace(/\s+$/, '');
        },
        __strLeft: function (str, n) {
            if (n <= 0)
                return "";
            else if (n > String(str).length)
                return str;
            else
                return String(str).substring(0, n);
        },
        __strRight: function (str, n) {
            if (n <= 0)
                return "";
            else if (n > String(str).length)
                return str;
            else {
                var iLen = String(str).length;
                return String(str).substring(iLen, iLen - n);
            }
        },
        __Exists: function (variable) {
            // Caso 1: La variable no está definida o es undefined
            if (typeof variable === "undefined" || variable === null) {
                return false;
            }

            // Caso 2: La variable está vacía
            if (typeof variable === "string" && variable.trim() === "") {
                return false; // Cadena vacía
            }
            if (Array.isArray(variable) && variable.length === 0) {
                return false; // Arreglo vacío
            }
            if (typeof variable === "object" && Object.keys(variable).length === 0) {
                return false; // Objeto vacío
            }

            // Si no entra en ninguno de los casos anteriores, es válida
            return true;
        },
        __slug: function (cadena = "") {
            let str = (cadena == "") ? "" : (cadena).toLowerCase() // Convertir a minúsculas
            return str
                .normalize("NFD") // Normalizar para separar letras y acentos
                .replace(/[\u0300-\u036f]/g, "") // Eliminar los acentos
                .replace(/[^a-z0-9\s-]/g, "") // Eliminar caracteres no válidos
                .replace(/\s+/g, "-") // Reemplazar espacios por guiones
                .replace(/-+/g, "-") // Eliminar guiones redundantes
                .replace(/^-|-$/g, ""); // Eliminar guiones al inicio y al final
        },
    },
    _VISTA_: {
        __SettingChange({ text = null, width = null, height = null, x = null, y = null }) {
            const _SELECTOR_ = "page-1";
            const _stage_ = Konva.stages.find(s => s.container().getAttribute('id') === _SELECTOR_);
            const _layer_ = _stage_.findOne(".layer-" + _SELECTOR_);
            const grid_Pattern = _layer_.findOne('.grid_Pattern');
            if (!grid_Pattern) {
                console.error("No se encontró el grupo con la clase 'grid_Pattern'");
                return;
            }







            // ahora sí puedes buscar el grupo con current_click true
            const clickedGroup = grid_Pattern.find(g => g.getAttr('current_click') === true);
            if (clickedGroup && clickedGroup.length) {

                clickedGroup.forEach(bubbles => {
                    const _current_width_ = width || bubbles.width();
                    const _current_height_ = height || bubbles.height();
                    const _current_x_ = x || bubbles.x();
                    const _current_y_ = y || bubbles.y();
                    const _current_text_ = text || bubbles.findOne("inner_text");

                    console.table({
                        text: _current_text_,
                        width: _current_width_,
                        height: _current_height_,
                        x: _current_x_,
                        y: _current_y_
                    });

                    _HELPERS_._VISTA_.__ReSettingBubble(
                        bubbles,
                        {
                            text: _current_text_,
                            width: _current_width_,
                            height: _current_height_,
                            x: _current_x_,
                            y: _current_y_
                        }
                    )

                });
            }

            _layer_.batchDraw();


        },
        __ReSettingBubble(_CurrentBubble_ = null, { text = null, width = null, height = null, x = null, y = null }) {
            if (!_CurrentBubble_) {
                return false;
            }
            if (text !== null) {
                _CurrentBubble_.findOne(".inner_text").text(text)
            }

            if (width !== null) {

                _CurrentBubble_.width(width);
                _CurrentBubble_.findOne(".background").width(width);
                _CurrentBubble_.findOne(".inner_text").width(width);
                _CurrentBubble_.findOne(".rect_active").width(width);

                _CurrentBubble_.findOne(".bullet_rightCenter").x(width - 5)
                _CurrentBubble_.findOne(".bullet_bottomCenter").x((width / 2) - 5)
                _CurrentBubble_.findOne(".lineHorizontal").points([
                    -30, (height / 2),             // inicio
                    (width + 30), (height / 2) // final dinámico
                ]);
            }

            if (height !== null) {
                _CurrentBubble_.height(height);
                _CurrentBubble_.findOne(".background").height(height);
                _CurrentBubble_.findOne(".inner_text").height(height);
                _CurrentBubble_.findOne(".rect_active").height(height);

                _CurrentBubble_.findOne(".bullet_rightCenter").y((height / 2) - 5);
                _CurrentBubble_.findOne(".bullet_leftCenter").y((height / 2) - 5);
                _CurrentBubble_.findOne(".bullet_bottomCenter").y(height - 5);



                _CurrentBubble_.findOne(".lineVertical").points([
                    (width / 2), -30,             // inicio
                    (width / 2), (height + 30) // final dinámico
                ]);


            }

            if (x !== null) {
                _CurrentBubble_.x(x);

            }
            if (y !== null) {
                _CurrentBubble_.y(y);

            }


        },
        __hideContextmenu: function () {
            $("#contextmenu").attr("class", "").attr("style", "");
        },
        __deselectedAllButtons: function (_SELECTOR_) {
            const _stage_ = Konva.stages.find(s => s.container().getAttribute('id') === _SELECTOR_);
            const _layer_ = _stage_.findOne(".layer-" + _SELECTOR_);


            const all_buttons = _layer_.findOne(".grid_Pattern").find("Group");
            all_buttons.forEach(btn => {

                const rect_active = btn.findOne(".rect_active");
                btn.setAttr('current_click', false);
                _HELPERS_._VISTA_.__showHideBullets(btn, true);
                rect_active.opacity(0);
            });
            _layer_.batchDraw();
        },
        __showHideBullets: function (_this_button_, hide = false) {
            if (hide) {
                //_this_button_.findOne(".bullet_topCenter").opacity(0);
                _this_button_.findOne(".bullet_leftCenter").opacity(0);
                _this_button_.findOne(".bullet_rightCenter").opacity(0);
                _this_button_.findOne(".bullet_bottomCenter").opacity(0);
            } else {
                //_this_button_.findOne(".bullet_topCenter").opacity(1);
                _this_button_.findOne(".bullet_leftCenter").opacity(1);
                _this_button_.findOne(".bullet_rightCenter").opacity(1);
                _this_button_.findOne(".bullet_bottomCenter").opacity(1);
            }



        },
        __DrawLine: function (grid_Pattern, _line_) {
            const coord = [_line_.x1, _line_.y1, _line_.x2, _line_.y2];
            const background = "#2242ceff"
            const line = new Konva.Line({
                points: coord,
                stroke: background,
                strokeWidth: 4,
                lineCap: 'round',
                lineJoin: 'round'
            });
            grid_Pattern.add(line);
        },
        __getSetting(_grp_) {
            if ($("#setting_width").length) {
                 $('input[id*="setting_"]').removeAttr('readonly');
                let _this_btn_ = _grp_.findOne(".background");
                $("#setting_text").val(_grp_.findOne(".inner_text").text());
                $("#setting_width").val(_this_btn_.width());
                $("#setting_height").val(_this_btn_.height());
                $("#setting_x").val(_grp_.x());
                $("#setting_y").val(_grp_.y());
            }
        },
        __add_button: function (_SELECTOR_, {
            name = "btn-left",
            x = 0,
            y = 0,
            width = 200,
            height = 80,
            text = "text",
            offsetX = 0,
            offsetY = 0,
            level = 0,
        }) {
            const _stage_ = Konva.stages.find(s => s.container().getAttribute('id') === _SELECTOR_);
            const _layer_ = _stage_.findOne(".layer-" + _SELECTOR_);
            btn = {
                name: name,
                x: x,
                y: y,
                width: width,
                height: height,
                text: text,

                level: level
            }
            // Creamos el grupo que contendrá el botón
            const _group_ = new Konva.Group({
                name: "grp_btn",
                width: btn.width,
                height: btn.height,
                x: btn.x,
                y: btn.y,
                /* offsetX: btn.width / 2 ,
                 offsety: btn.height / 2,*/
                draggable: false,
                level: btn.level,
                current_click: false,
                last_selected: false,
                first_selected: false,
                draggable: true,
                data: {
                    line: {
                        left: null,
                        right: null,
                        bottom: null
                    }
                }

            }).on("dragmove", (e) => {
                const _grp_ = e.currentTarget;
                _HELPERS_._VISTA_.__getSetting(_grp_);
            }).on('mouseenter', (e) => {

                //  const _grp_ = e.currentTarget;

                //_HELPERS_._VISTA_.__showHideBullets(_grp_);
            }).on('mouseleave', (e) => {
                // const _grp_ = e.currentTarget;

                //_HELPERS_._VISTA_.__showHideBullets(_grp_, true);
            }).on('click', (e) => {
                const _grp_ = e.currentTarget;


                if (!e.evt.ctrlKey) {
                    _HELPERS_._VISTA_.__deselectedAllButtons(_SELECTOR_);
                }

                _HELPERS_._VISTA_.__showHideBullets(_grp_);
                const rect_active = _grp_.findOne(".rect_active");
                _grp_.setAttr('current_click', true);

                if (rect_active.opacity() == 0) {
                    rect_active.opacity(1);
                }

                _HELPERS_._VISTA_.__getSetting(_grp_);

            });


            const rect = new Konva.Rect({
                name: "background",
                fill: '#9FB6BF',
                width: btn.width,
                height: btn.height,
                x: 0,
                y: 0,

                /* stroke: '#4F5F61',
                 strokeWidth: 3,*/
                draggable: false
            });


            const _inner_text_ = new Konva.Text({
                x: 0,
                y: 0,
                name: "inner_text",
                width: btn.width,
                height: btn.height,
                text: btn.text,
                fontSize: 16,
                fontFamily: 'Calibri',
                fill: '#000',
                align: 'center',
                verticalAlign: 'middle',
                padding: 10,
                //offsetX: btn.width / 2,
                //offsetY: btn.height / 2,
            });
            const rect_active = new Konva.Rect({
                name: "rect_active",
                width: btn.width + 5,
                height: btn.height + 5,
                x: -2.5,
                y: -2.5,
                fill: 'transparent',
                /*stroke: '#00BDFF',
                strokeWidth: 4,*/
                draggable: false,    // color del borde
                strokeWidth: 2,       // grosor
                /*dash: [6, 6],    */    // [tamaño_linea, espacio]
                cornerRadius: 0,     // opcional: esquinas redondeadas
                opacity: 0

            });

            const pointers = {


                leftCenter:
                    _HELPERS_.fn.__returnBulletsBTN({
                        x: -5,
                        y: (btn.height / 2) - 5,
                        name: "leftCenter"
                    }),
                rightCenter:
                    _HELPERS_.fn.__returnBulletsBTN({
                        x: btn.width - 5,
                        y: (btn.height / 2) - 5,
                        name: "rightCenter"
                    }),
                bottomCenter:
                    _HELPERS_.fn.__returnBulletsBTN({
                        x: (btn.width / 2) - 5,
                        y: btn.height - 5,
                        name: "bottomCenter"
                    })

            }

            const _line_Vertical = new Konva.Line({
                points: [
                    (btn.width / 2), -30,
                    (btn.width / 2), (btn.height + 30),
                ],
                name: "lineVertical",
                stroke: "#ff0000",
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round'
            });

            const _line_Horizontal = new Konva.Line({
                points: [
                    -30, (btn.height / 2),
                    (btn.width + 30), (btn.height / 2),
                ],
                name: "lineHorizontal",
                stroke: "#ff0000",
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round'
            });

            _group_.add(
                _line_Vertical,
                _line_Horizontal,
                rect_active,
                rect,
                _inner_text_,
                pointers.leftCenter,
                pointers.rightCenter,
                pointers.bottomCenter);
            // Lo agregamos al layer y dibujamos
            _layer_.findOne(".grid_Pattern").add(_group_);
            _HELPERS_._VISTA_.__deselectedAllButtons(_SELECTOR_);

            // console.log("Botón agregado: ", _group_.x(), _group_.y());
            _layer_.batchDraw();
        },
        __create_toolbar: function (_SELECTOR_) {

            const _toolbar_ = d3.select("#sidebar_left")
                .insert("div", ":first-child")
                .attr("id", "toolbar")
                .append("ul");

            [
                "icon_add_button",
                "icon_layer",
                "icon_group",
                "icon_ungroup",
                "separator",
                "icon_align_bottom",
                "icon_align_top",
                "icon_align_right",
                "icon_align_left",
                "icon_align_center_vertical",
                "icon_align_center_horizontal",
                "separator",
                "icon_aling_vertical_screen",
                "icon_aling_horizontal_screen",
                "separator",
                "arrow_right",
                "arrow_right_down",
                "arrow_right_down_black",
                "arrow_left",
                "arrow_left_down",
                "arrow_left_down_black",
                "arrow_bottom",
                "arrow_bottom_left_down",
                "arrow_bottom_right_down",
                "arrow_bottom_left",
                "arrow_bottom_right"

                ,
            ].forEach((name_icon, index) => {
                // Crear cada li con i adentro
                const _class_ = String((name_icon.startsWith("arrow_") ? " disabled" : ""))
                const li = _toolbar_
                    .append("li")
                    .attr("id", ("btn-" + (index + 1)))
                    .attr("class", ((name_icon == "separator") ? "separator" : ""))
                /*.style("cursor", "pointer");*/

                li.append("i")
                    .attr("class", name_icon + _class_);

                // Listener en cada li
                li.on("click", function () {
                    const VerticalSeparator = 20;
                    const id = d3.select(this).attr("id");
                    const _mane_icon_ = String(d3.select("#" + id + " i").attr("class")).replace("icon_", "");

                    const _SELECTOR_ = "page-1";
                    const _stage_ = Konva.stages.find(s => s.container().getAttribute('id') === _SELECTOR_);
                    const _layer_ = _stage_.findOne(".layer-" + _SELECTOR_);
                    const grid_Pattern = _layer_.findOne('.grid_Pattern');
                    if (!grid_Pattern) {
                        console.error("No se encontró el grupo con la clase 'grid_Pattern'");
                        return;
                    }
                    // ahora sí puedes buscar el grupo con current_click true
                    const clickedGroup = grid_Pattern.find(g => g.getAttr('current_click') === true);

                    // Helpers de alineación
                    const alignTop = group => {
                        const targetY = Math.min(...group.map(b => b.y()));
                        group.forEach(b => b.y(targetY));
                    };

                    const alignBottom = group => {
                        const targetY = Math.max(...group.map(b => b.y() + b.height()));
                        group.forEach(b => b.y(targetY - b.height()));
                    };

                    const alignLeft = group => {
                        const targetX = Math.min(...group.map(b => b.x()));
                        group.forEach(b => b.x(targetX));
                    };

                    const alignRight = group => {
                        const targetX = Math.max(...group.map(b => b.x() + b.width()));
                        group.forEach(b => b.x(targetX - b.width()));
                    };

                    const alignCenterVertical = group => {
                        const targetX = Math.max(...group.map(b => b.x() + b.width() / 2));
                        group.forEach(b => b.x(targetX - b.width() / 2));
                    };

                    const alignCenterHorizontal = group => {
                        const targetY = Math.max(...group.map(b => b.y() + b.height() / 2));
                        group.forEach(b => b.y(targetY - b.height() / 2));
                    };

                    const alignScreenVertical = (group, grid) => {
                        group.forEach(b => b.x((grid.width / 2) - (b.width() / 2)));
                    };

                    const alignScreenHorizontal = (group, grid) => {
                        group.forEach(b => b.y((grid.height / 2) - (b.height() / 2)));
                    };


                    // Switch principal
                    switch (_mane_icon_) {
                        case "align_top":
                            if (clickedGroup?.length) alignTop(clickedGroup);
                            break;

                        case "align_bottom":
                            if (clickedGroup?.length) alignBottom(clickedGroup);
                            break;

                        case "align_left":
                            if (clickedGroup?.length) alignLeft(clickedGroup);
                            break;

                        case "align_right":
                            if (clickedGroup?.length) alignRight(clickedGroup);
                            break;

                        case "align_center_vertical":
                            if (clickedGroup?.length) alignCenterVertical(clickedGroup);
                            break;

                        case "align_center_horizontal":
                            if (clickedGroup?.length) alignCenterHorizontal(clickedGroup);
                            break;

                        case "aling_vertical_screen":
                            if (clickedGroup?.length) alignScreenVertical(clickedGroup, _INNERGRID_);
                            break;

                        case "aling_horizontal_screen":
                            if (clickedGroup?.length) alignScreenHorizontal(clickedGroup, _INNERGRID_);
                            break;
                        case "add_button":
                            const _width_area_draw_ = Math.floor(_VIRTUAL_WIDTH_ / 100) * 100;
                            const btn = {
                                name: "btn_" + _HELPERS_.fn.__slug(_mane_icon_),
                                width: 180,
                                height: 80,
                                x: (_width_area_draw_ / 2),
                                y: 0,
                                level: 0
                            }
                            _HELPERS_._VISTA_.__add_button(_SELECTOR_, btn);
                            break;

                        case "arrow_right":

                            break;
                        default:
                            break;
                    }

                });

            });




        }
    },
    _CONTROLADOR_: {
        settingBubble: function (_text_ = '') {
            return {
                slug: "bubble-" + _HELPERS_.fn.__slug(_text_),
                text: String(_text_).trim().toUpperCase()
            }
        },
        calculateCoordinates: function (level = null, total_nodes = 1, position = 0) {
            const height_per_level = 80;
            const width_per_node = 180;
            const separator_between_nodes = 20;
            const separator_vertical_between_nodes = 20;

            if (level !== null) {
                const _width_area_draw_ = Math.floor(_VIRTUAL_WIDTH_ / 100) * 100;
                const _x_ = ((_width_area_draw_ / total_nodes) * (position)) + ((_width_area_draw_ / total_nodes) / 2);
                const _y_ = ((level * height_per_level) - (height_per_level / 2)) + ((level - 1) * separator_vertical_between_nodes);
                return {
                    x: _x_,
                    y: _y_,
                    total_same_level: total_nodes,
                    position: position
                }
            };

        },
        // Inicializar el JSON si está vacío
        initChart: function (rootName, rootData = {}) {
            if (!_chart_JSON_) {

                _chart_JSON_ = {
                    /*name: rootName,
                    slug: "btn_" + _HELPERS_.fn.__slug(rootName),*/
                    data: { ..._HELPERS_._CONTROLADOR_.settingBubble(rootName), ...rootData },
                    children: []
                };
            }
        },

        // Agregar un nodo hijo a un padre específico (por nombre)
        addNode: function (parentName, nodeName, nodeData = {}) {
            if (!_chart_JSON_) {
                console.error("Primero inicializá el chart con initChart");
                return;
            }

            function findAndInsert(node) {
                if (node.data.text === parentName) {
                    if (!node.children) node.children = [];
                    node.children.push({
                        /*name: nodeName,
                        slug: "btn_" + _HELPERS_.fn.__slug(nodeName),*/
                        data: { ..._HELPERS_._CONTROLADOR_.settingBubble(nodeName), ...nodeData },
                        children: []
                    });
                    return true;
                }
                if (node.children) {
                    for (let child of node.children) {
                        if (findAndInsert(child)) return true;
                    }
                }
                return false;
            }

            if (!findAndInsert(_chart_JSON_)) {
                console.warn(`No encontré el padre: ${parentName}`);
            }
        }
    }

}