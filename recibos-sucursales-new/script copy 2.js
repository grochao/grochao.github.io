/**
 * CORE UI utilities for enrollment module.
 * Agrupa el render de tabla y alertas en clases reutilizables.
 */
class TablaDinamicaFiltro {
    constructor(contenedor, data, options = {}) {
        this.contenedor =
            typeof contenedor === 'string' ? document.querySelector(contenedor) : contenedor;
        if (!this.contenedor) throw new Error('Contenedor no encontrado');

        this.rawData = data || {};
        this.registros = [];
        this.numColumnas = 0;
        this.headers = [];
        this.columnaFiltro = options.columnaFiltro ?? 0;
        this.columnaSede = options.columnaSede ?? 1;
        this.inputNombreSelector = options.inputNombreSelector || '#filtroNombre';
        this.selectSedeSelector = options.selectSedeSelector || '#filtroSede';
        this.inputNombre = null;
        this.selectSede = null;

        this._boundHandleClick = this._handleClick.bind(this);

        this._parseData();
        this._determinarHeaders();
        this._vincularFiltros();
        this._renderTabla();
    }

    _parseData() {
        this.registros = [];
        let maxLen = 0;

        for (const [clave, valores] of Object.entries(this.rawData)) {
            if (!Array.isArray(valores)) continue;
            maxLen = Math.max(maxLen, valores.length);
            this.registros.push({ id: clave, valores: [...valores] });
        }

        this.numColumnas = maxLen;
    }

    _determinarHeaders() {
        if (this.headers.length === this.numColumnas) return;

        this.headers = [];
        for (let i = 0; i < this.numColumnas; i++) {
            if (i === 0) this.headers.push('Nombre del estudiante');
            else if (i === 1) this.headers.push('Sede');
            else if (i === 2) this.headers.push('Nivel Ant.');
            else if (i === 3) this.headers.push('Nivel a Matri.');
            else this.headers.push(`Columna ${i + 1}`);
        }
    }

    _getTextoNombre() {
        return this.inputNombre ? this.inputNombre.value.trim().toLowerCase() : '';
    }

    _getSedeSeleccionada() {
        return this.selectSede ? this.selectSede.value : 'TODAS';
    }

    _aplicarFiltros() {
        const texto = this._getTextoNombre();
        const sede = this._getSedeSeleccionada();

        let filtrados = this.registros;

        if (texto) {
            filtrados = filtrados.filter((reg) => {
                const valor = reg.valores[this.columnaFiltro] || '';
                return String(valor).toLowerCase().includes(texto);
            });
        }

        if (sede !== 'TODAS') {
            filtrados = filtrados.filter((reg) => {
                const valorSede = reg.valores[this.columnaSede] || '';
                return valorSede === sede;
            });
        }

        return filtrados;
    }

    _renderTabla() {
        const datosFiltrados = this._aplicarFiltros();
        const textoBusqueda = this._getTextoNombre();

        const theadCols = this.headers
            .map((header) => `<th>${this._escapeHTML(header)}</th>`)
            .join('');
        const theadHTML = `<thead><tr>${theadCols}<th>Acción</th></tr></thead>`;

        let tbodyHTML = '<tbody>';
        if (!datosFiltrados.length) {
            tbodyHTML += `<tr class="empty-row"><td colspan="${this.numColumnas + 1}">✨ No hay resultados para "<strong>${this._escapeHTML(textoBusqueda)}</strong>" ✨</td></tr>`;
        } else {
            for (const registro of datosFiltrados) {
                const celdas = [];
                for (let i = 0; i < this.numColumnas; i++) {
                    let valor = registro.valores[i] ?? '';

                    if (i === 3) {
                        const texto = this._escapeHTML(valor);
                        const color = texto.includes('DESERSIÓN')
                            ? '-orange'
                            : texto.includes('REPITE')
                                ? '-red'
                                : texto.includes('PENDIENTE')
                                    ? '-yellow'
                                    : '';
                        valor = `<span class="badge-nivel${color}">${texto}</span>`;
                    } else {
                        valor = this._escapeHTML(valor);
                    }

                    celdas.push(`<td>${valor}</td>`);
                }

                celdas.push(
                    `<td><button class="btn btn-sm btn-primary" data-id="${this._escapeHTML(registro.id)}">Seleccionar</button></td>`,
                );

                tbodyHTML += `<tr>${celdas.join('')}</tr>`;
            }
        }
        tbodyHTML += '</tbody>';

        this.contenedor.innerHTML = `<table>${theadHTML}${tbodyHTML}</table>`;
        this._asignarEventosBotones();
    }

    _asignarEventosBotones() {
        const botones = this.contenedor.querySelectorAll('.btn-primary');
        botones.forEach((btn) => {
            btn.removeEventListener('click', this._boundHandleClick);
            btn.addEventListener('click', this._boundHandleClick);
        });
    }

    _handleClick(e) {
        const id = e.currentTarget.getAttribute('data-id');
        const registro = this.registros.find((r) => r.id === id);

        if (registro) {
            alert(`Seleccionaste:\nID: ${registro.id}\nDatos: ${registro.valores.join(' | ')}`);
        } else {
            alert('Registro no encontrado');
        }
    }

    _vincularFiltros() {
        this.inputNombre = document.querySelector(this.inputNombreSelector);
        this.selectSede = document.querySelector(this.selectSedeSelector);

        if (this.inputNombre) {
            this.inputNombre.addEventListener('input', () => this._renderTabla());
        }

        if (this.selectSede) {
            this.selectSede.addEventListener('change', () => this._renderTabla());
        }
    }

    _escapeHTML(str) {
        if (str === undefined || str === null) return '';
        return String(str).replace(/[&<>]/g, (m) => {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    setData(nuevoData) {
        this.rawData = nuevoData || {};
        this._parseData();
        this._determinarHeaders();
        this._renderTabla();
    }
}

class CustomAlert {
    static #container = null;
    static #defaultDuration = 5500;

    static #getContainer() {
        if (!this.#container || !document.body.contains(this.#container)) {
            let container = document.getElementById('customAlertRoot');
            if (!container) {
                container = document.createElement('div');
                container.id = 'customAlertRoot';
                container.className = 'custom-alert-global-container';
                document.body.appendChild(container);
            }
            container.style.zIndex = '2147483647';
            this.#container = container;
        }
        return this.#container;
    }

    static show(message, type, duration = this.#defaultDuration) {
        const normalizedMessage = typeof message === 'string' && message ? message : 'Notificación';
        const normalizedType = String(type || '').toLowerCase();

        const alertTypeClass =
            normalizedType === 'error' || normalizedType === 'danger'
                ? 'alert-type-error'
                : normalizedType === 'success' || normalizedType === 'exito' || normalizedType === 'ok'
                    ? 'alert-type-success'
                    : 'alert-type-warning';

        const alertElement = document.createElement('div');
        alertElement.className = `custom-alert-item ${alertTypeClass}`;

        const messageSpan = document.createElement('span');
        messageSpan.className = 'alert-message-text';
        messageSpan.textContent = normalizedMessage;

        const closeButton = document.createElement('button');
        closeButton.className = 'alert-close-button';
        closeButton.innerHTML = '✕';
        closeButton.setAttribute('aria-label', 'Cerrar alerta');

        const closeAlertWithAnimation = () => {
            if (!alertElement.parentNode) return;
            alertElement.classList.add('exit-animation');
            setTimeout(() => alertElement.parentNode && alertElement.parentNode.removeChild(alertElement), 200);
            if (alertElement._timeoutId) {
                clearTimeout(alertElement._timeoutId);
                delete alertElement._timeoutId;
            }
        };

        closeButton.addEventListener('click', closeAlertWithAnimation);
        alertElement.append(messageSpan, closeButton);
        CustomAlert.#getContainer().appendChild(alertElement);

        if (duration && duration > 0) {
            alertElement._timeoutId = setTimeout(closeAlertWithAnimation, duration);
        }

        return alertElement;
    }

    static error(message, duration = this.#defaultDuration) {
        return this.show(message, 'error', duration);
    }

    static success(message, duration = this.#defaultDuration) {
        return this.show(message, 'success', duration);
    }

    static warning(message, duration = this.#defaultDuration) {
        return this.show(message, 'warning', duration);
    }

    constructor(options = {}) {
        this.defaultDuration = options.duration || CustomAlert.#defaultDuration;
    }

    show(message, type, duration = this.defaultDuration) {
        return CustomAlert.show(message, type, duration);
    }

    error(message, duration = this.defaultDuration) {
        return CustomAlert.error(message, duration);
    }

    success(message, duration = this.defaultDuration) {
        return CustomAlert.success(message, duration);
    }

    warning(message, duration = this.defaultDuration) {
        return CustomAlert.warning(message, duration);
    }
}

window.TablaDinamicaFiltro = TablaDinamicaFiltro;
window.CustomAlert = CustomAlert;

// Exponer globalmente
window.CustomAlert = CustomAlert;

// ============================================================
// VARIABLES GLOBALES
// ============================================================
let _LIST_ENROLLMENT_AUTOCOMPLETE_ = null;
try {
    _LIST_ENROLLMENT_AUTOCOMPLETE_ = {
        "99999": [
            "DIFERENCIAL CAMBIARIO ...",
            "MAG",
            "CP-01",
            "CP-02"
        ],
        "LEO00000": [
            "ESPINOZA NUÑEZ NASHLY ALAIA",
            "MAG",
            "ES-7",
            "ES-8"
        ],
        "LEO00001": [
            "SIRIAS OSEJO HENRY ALESSANDRO",
            "MAG",
            "ADUL-10",
            "DESERSIÓN"
        ],
        "LEO00002": [
            "HERNÁNDEZ RIVERA KENDRICK ISAAC",
            "MAG",
            "ADOL-03",
            "REPITE"
        ],
        "LEO00003": [
            "PICHARDO SOTO JAIR JOSSIEL",
            "MAG",
            "ADOL-09",
            "PENDIENTE EXAM."

        ],
        "LEO00004": [
            "ZELAYA PARRALES AURA INES",
            "EST",
            "ES-08",
            "ES-09"
        ]
    };
}
catch (err) {
    _LIST_ENROLLMENT_AUTOCOMPLETE_ = {
        "A999999": ["DIFERENCIAL CAMBIARIO", "0", "01/01/2025"]
    }
}

let _LIST_ADMISSION_AUTOCOMPLETE_ = {
    "A99787": [
        "Guillermo Mauricio Rocha Ortiz",
        "Guillermo Rocha",
        "09/07/1983",
        "g.rocha.o@live.com",
        "83256836",
        "Managua nicaragua"
    ],
    "A99788": [
        "Rocha Acosta Karla Inés",
        "Juan Carlos Rocha",
        "09/07/1983",
        "g.rocha.o@live.com",
        "84787652",
        "Managua nicaragua"
    ],
    "A99789": [
        "Rocha Ortiz Juan Carlos",
        "Carlos Rocha",
        "09/07/1983",
        "g.rocha.o@live.com",
        "82987893",
        "Managua nicaragua"
    ]
};

var _ALL_CONFIG_APP_ = {
    "CURSOS": ["2026~LEO~LEO~PR~SAB~03~SABATÍNO", "2026~LEO~LEO~PR~SAB~02~SABATÍNO", "2026~EST~EST~PR~SAB~02~SABATÍNO"]
};
var _SEDE_GLOBAL = 'LEÓN';
var _CURRENT_URL_APP_ = 'https:\/\/script.google.com\/a\/ans.edu.ni\/macros\/s\/AKfycbyWvjhXF2QcpBOLG4MrRcIRIWJ3J5NhdZ6zyjyz-yU\/dev';

var _DATA_ELI_;
try {
    _DATA_ELI_ = {
        "LEO": {
            "EARLY-SUCCESS": {
                "sede": "LEO",
                "categoria": "EARLY SUCCESS",
                "precios": {
                    "colegiatura": 4220
                },
                "niveles": {
                    "_1": {
                        "title-book": "DOODLE TOWN NURSERY",
                        "thumb_img": "DOODLE-TOWN-NURSERY.png",
                        "price": 1650
                    },
                    "_2": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    }
                }
            },
            "ADOLESCENTE": {
                "sede": "LEO",
                "categoria": "ADOLESCENTE",
                "precios": {
                    "colegiatura": 4770
                },
                "niveles": {
                    "_1": {
                        "title-book": "SPEAK YOUR MIND STARTER",
                        "thumb_img": "SPEAK-YOUR-MIND-STARTER.png",
                        "price": 1840
                    },
                    "_2": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    },
                    "_3": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    },
                    "_4": {
                        "title-book": "SPEAK YOUR MIND #1",
                        "thumb_img": "SPEAK-YOUR-MIND-1.png",
                        "price": 1840
                    },
                }
            },
            "ADULTO": {
                "sede": "LEO",
                "categoria": "ADULTO",
                "precios": {
                    "colegiatura": 4770
                },
                "niveles": {
                    "_1": {
                        "title-book": "SPEAK YOUR MIND STARTER",
                        "thumb_img": "SPEAK-YOUR-MIND-STARTER.png",
                        "price": 1840
                    },
                    "_2": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    },
                    "_3": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    }
                }
            }
        },
        "EST": {
            "ADOLESCENTE": {
                "sede": "EST",
                "categoria": "ADOLESCENTE",
                "precios": {
                    "colegiatura": 4770
                },
                "niveles": {
                    "_1": {
                        "title-book": "SPEAK YOUR MIND STARTER",
                        "thumb_img": "SPEAK-YOUR-MIND-STARTER.png",
                        "price": 1840
                    },
                    "_2": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    },
                    "_3": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    },
                    "_4": {
                        "title-book": "SPEAK YOUR MIND #1",
                        "thumb_img": "SPEAK-YOUR-MIND-1.png",
                        "price": 1840
                    },
                }
            },
            "ADULTO": {
                "sede": "EST",
                "categoria": "ADULTO",
                "precios": {
                    "colegiatura": 4770
                },
                "niveles": {
                    "_1": {
                        "title-book": "SPEAK YOUR MIND STARTER",
                        "thumb_img": "SPEAK-YOUR-MIND-STARTER.png",
                        "price": 1840
                    },
                    "_2": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    },
                    "_3": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    },
                    "_4": {
                        "title-book": "SPEAK YOUR MIND #1",
                        "thumb_img": "SPEAK-YOUR-MIND-1.png",
                        "price": 1840
                    }
                }
            }, "LET'S-TALK-1": {
                "sede": "EST",
                "categoria": "LET'S TALK 1",
                "precios": {
                    "colegiatura": 5130
                },
                "niveles": {
                    "_15": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    }
                }
            }, "LET'S-TALK-2": {
                "sede": "EST",
                "categoria": "LET'S TALK 2",
                "precios": {
                    "colegiatura": 5130
                },
                "niveles": {
                    "_16": {
                        "title-book": null,
                        "thumb_img": null,
                        "price": 0
                    }
                }
            }
        }
    }
}
catch (err) {
    console.error(err);
}

// Variables de estado global
var _SERIAL_NUMBER_;
var _LIST_ENROLLMENT_SEDE_;
window._ALL_DEPOSITS = {};

if (typeof (Storage) !== "undefined") {
    _SERIAL_NUMBER_ = localStorage.getItem("serial_number");
    _LIST_ENROLLMENT_SEDE_ = localStorage.getItem("enrollment_sede");
} else {
    console.log("LocalStorage no soportado en este navegador");
}
if (_SERIAL_NUMBER_ === null) {
    localStorage.setItem("serial_number", "I|7000");
    _SERIAL_NUMBER_ = localStorage.getItem("serial_number");
}

let fieldGroup = {};
let allAmounts = {
    Colegiatura: 0,
    Libro: 0,
    Otros: 0,
    Descuento: 0,
    Retencion: 0,
    Total: 0
}
var _DATA_ = null;

// ============================================================
// FUNCIONES AUXILIARES NATIVAS
// ============================================================
function $(selector, context = document) {
    return context.querySelector(selector);
}
function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}
function getEl(id) { return document.getElementById(id); }
function hasClass(el, className) { return el.classList.contains(className); }
function addClass(el, className) { el.classList.add(className); }
function removeClass(el, className) { el.classList.remove(className); }
function toggleClass(el, className, force) { el.classList.toggle(className, force); }
function setDisabled(el, disabled) {
    if (el.getAttribute("id") === "txt_nombre_libro") return false;

    el.disabled = disabled;
    el.readOnly = disabled;
    // console.log(el.getAttribute("id"), "disabled", disabled);
    if (disabled) {
        addClass(el.parentNode, "txt_disable");
        if (el.getAttribute("id") !== "txt_tipo_recibo") {
            if (el.tagName === 'SELECT') el.value = "~";
            else if (el.type === 'checkbox') el.checked = false;
            else el.value = "";
        }
    }
    else {
        // removeClass(el, "txt_disable");
        removeClass(el.parentNode, "txt_disable");
    }
}
function getValue(el) {
    //console.log("ReturnTypeTag", ReturnTypeTag(el));
    const _tag_ = ReturnTypeTag(el);
    if (("CHECKBOX|RADIO").includes(_tag_)) { return (el.checked) ? true : false; } else {

        return el ? ((el.value) == "~" ? "" : el.value) : '';
    }
}
function setValue(el, val) { if (el) el.value = val; }
function on(event, selector, handler) {
    document.addEventListener(event, function (e) {
        let target = e.target;
        while (target && target !== document) {
            if (target.matches && target.matches(selector)) {
                handler.call(target, e);
                break;
            }
            target = target.parentNode;
        }
    });
}

function ClearIMGPreview() {
    const thumb_img_book = document.getElementById("thumb-img-book");
    const zoom_img_book = document.getElementById("zoom-img-book");
    if (thumb_img_book) thumb_img_book.remove();
    if (zoom_img_book) zoom_img_book.remove();
    getEl("txt_nombre_libro").value = "";
    getEl("txt_nombre_libro").classList.remove("not_empty");
    getEl("txt_nombre_libro").parentElement.classList.remove("txt_disable");
    setDisabled(getEl("txt_nombre_libro"), false);

    document.getElementById("preview-image").classList.remove("show");
}




// ============================================================
// HELPERS DE LÓGICA DEL RECIBO
// ============================================================
function ReturnTypeTag(el) {
    let tag = el.tagName.toUpperCase();
    if (tag === "INPUT") tag = (el.type || "text").toUpperCase();
    return tag;
}

function Current_date(type = false) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    if (type === "html") {
        return `<div class="col box_day"><span class="label">DÍA</span><span class="number">${dd}</span></div>
                <div class="col box_month"><span class="label">MES</span><span class="number">${mm}</span></div>
                <div class="col box_year"><span class="label">AÑO</span><span class="number">${yyyy}</span></div>`;
    }
    return `${mm}/${dd}/${yyyy}`;
}

function returnCursos(_sede_) {
    let _the_SEDE_ = '';
    switch (_sede_) {
        case "LEÓN": case "TEST": _the_SEDE_ = "LEO"; break;
        case "ESTELÍ": _the_SEDE_ = "EST"; break;
        case "DEPÓSITOS-MANAGUA": _the_SEDE_ = "MAG"; break;
        default: _the_SEDE_ = _sede_; break;
    }
    let _optionCuorces_ = '<option value="~"></option>';
    let _year_course_ = "";
    if (_SEDE_GLOBAL === "TEST" || _SEDE_GLOBAL === "ESTELÍ" || _SEDE_GLOBAL === "LEÓN" || _SEDE_GLOBAL === "DEPÓSITOS-MANAGUA") {
        (_ALL_CONFIG_APP_.CURSOS || []).forEach(function (curso) {
            if (curso !== "") {
                var _col_ = curso.split("~");
                if (_year_course_ !== _col_[2] + _col_[0] + _col_[5]) {
                    _optionCuorces_ += (_year_course_ !== "2000" ? "</optgroup>" : "") + '<optgroup label="' + _col_[0] + ' CURSO ' + _col_[5] + '" >';
                    _year_course_ = _col_[2] + _col_[0] + _col_[5];
                }
                _optionCuorces_ += '<option value="' + _col_[0] + _col_[2] + _col_[4] + _col_[5] + (_col_[3] === "ON" ? "-ONLINE" : "") + '">' + _col_[6] + '</option>';
            }
        });
        _optionCuorces_ += '</optgroup>';
    }
    return _optionCuorces_;
}




// ============================================================
// INICIALIZACIÓN Y EVENTOS
// ============================================================
// Contenedor de grupos de campos y acciones
var _HELPERS_ = {
    fn: {
        IsValueEmpy(value) {
            return (value === "" || value === null || value === undefined || value.trim() === "" || value.trim() === "~");
        },
        ConvertToCurrency(numeroStr) {
            numeroStr = String(numeroStr).trim();

            // Convertir a número (admite string o número)
            let num = parseFloat(numeroStr);

            // Si no es un número válido, devolver el original o un fallback
            if (isNaN(num)) return numeroStr;

            // Formatear a exactamente 2 decimales
            let conDosDecimales = num.toFixed(2);

            // Separar parte entera y decimal
            let [parteEntera, parteDecimal] = conDosDecimales.split('.');

            // Agregar comas para miles en la parte entera
            let enterConComas = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            // Unir con el punto decimal
            return `${enterConComas}.${parteDecimal}`;


        },
        mask: {
            // Máscaras

        }

    },
    __data__: {
        initzialize() {
            fieldGroup = {
                inforStudent: document.querySelectorAll('.input-disable-infor1_student [id*="txt_"]'),
                tutorContact: document.querySelectorAll('.input-disable-infor2_student [id*="txt_"]'),
                Courses: document.querySelectorAll('.input-disable-infor3_student [id*="txt_"]'),
                paymentType: document.querySelectorAll('.input-disable-infor4_student [id*="txt_"]'),
                code: document.querySelectorAll('.input-disable-infor5_student [id*="txt_"]'),
                observations: document.querySelectorAll('.input-disable-infor6_student [id*="txt_"]'),
                amount: document.querySelectorAll('.input-disable-infor7_student [id*="txt_"]'),
                button: document.querySelectorAll('.input-disable-infor8_student [class*="_btn"]'),
                action: {
                    fieldsAmount: {
                        Colegiatura: {
                            view: document.querySelector("#txt_importe_colegiatura"),
                            print: document.querySelector(".print_colegiatura .valor")
                        },
                        Libro: {
                            view: document.querySelector("#txt_importe_libro"),
                            print: document.querySelector(".print_libro .valor")
                        },
                        Otros: {
                            view: document.querySelector("#txt_importe_otros"),
                            print: document.querySelector(".print_otros .valor")
                        },
                        Descuento: {
                            view: document.querySelector("#txt_importe_descuento"),
                            print: document.querySelector(".print_descuento .valor")
                        },
                        Retencion: {
                            view: document.querySelector("#txt_importe_retencion"),
                            print: document.querySelector(".print_retencion .valor")
                        },
                        Total: {
                            view: document.querySelector("#txt_importe_total"),
                            print: document.querySelector(".print_total .valor")
                        }
                    },
                    clearAmount: function () {
                        allAmounts.Colegiatura = 0;
                        allAmounts.Libro = 0;
                        allAmounts.Otros = 0;
                        allAmounts.Descuento = 0;
                        allAmounts.Retencion = 0;
                        allAmounts.Total = 0;
                        Object.keys(fieldGroup.action.fieldsAmount).forEach(key => {
                            const _value_ = _HELPERS_.fn.ConvertToCurrency(allAmounts[key] || 0);

                            if (fieldGroup.action?.fieldsAmount[key]) {
                                fieldGroup.action.fieldsAmount[key].view.value = _value_;
                                fieldGroup.action.fieldsAmount[key].print.innerHTML = _value_;
                            }
                        });
                    },
                    updateAmount: function () {

                        /*
                        allAmounts = {
                            Colegiatura: 0,
                            Libro: 0,
                            Otros: 0,
                            Descuentos: 0,
                            Retencion: 0,
                            Total: 0
                        }
                        */
                        allAmounts.Total = ((allAmounts.Colegiatura + allAmounts.Descuento) + (allAmounts.Libro + allAmounts.Otros))

                        allAmounts.Retencion = -(parseFloat((allAmounts.Total * (allAmounts.Retencion)).toFixed(2)));

                        allAmounts.Total = allAmounts.Total + allAmounts.Retencion;

                        Object.keys(fieldGroup.action.fieldsAmount).forEach(key => {
                            const _value_ = _HELPERS_.fn.ConvertToCurrency(allAmounts[key] || 0);


                            if (fieldGroup.action?.fieldsAmount[key]) {
                                fieldGroup.action.fieldsAmount[key].view.value = _value_;
                                fieldGroup.action.fieldsAmount[key].print.innerHTML = _value_;
                            }
                        });

                    },
                    disable: function (groups = "") {
                        if (groups === "") groups = "all";
                        const allGroups = Object.keys(fieldGroup).filter(k => k !== "action");
                        const targets = groups.includes("all") ? allGroups : groups.split(",");
                        targets.forEach(f => {
                            console.log("f", f);
                            if (fieldGroup[f] !== undefined && fieldGroup[f] !== null && fieldGroup[f].length > 0) {
                                fieldGroup[f].forEach(el => {
                                    console.log("el", el.getAttribute("id"));
                                    if (el.getAttribute("id") !== "txt_tipo_recibo") {
                                        setDisabled(el, true)
                                        //el.parentNode.classList.add("txt_disable");
                                    }
                                });
                            }
                        });
                    },
                    enable: function (groups = "") {
                        if (groups === "") groups = "all";
                        const allGroups = Object.keys(fieldGroup).filter(k => k !== "action");
                        const targets = groups.includes("all") ? allGroups : groups.split(",");
                        targets.forEach(f => {
                            if (fieldGroup[f] !== undefined && fieldGroup[f] !== null && fieldGroup[f].length > 0) {
                                fieldGroup[f].forEach(el => {
                                    if (el.getAttribute("id") !== "txt_tipo_recibo" && !el.classList.contains("isBlocked")) {
                                        setDisabled(el, false);
                                        //el.parentElement.classList.remove('txt_disable');
                                    }
                                });
                            }
                        });
                    },
                    clear: function (groups = "") {
                        if (groups === "") groups = "all";
                        const allGroups = Object.keys(fieldGroup).filter(k => k !== "action");
                        const targets = groups.includes("all") ? allGroups : groups.split(",");
                        targets.forEach(f => {
                            if (fieldGroup[f] !== undefined && fieldGroup[f] !== null && fieldGroup[f].length > 0) {
                                fieldGroup[f].forEach(el => {
                                    if (el.getAttribute("id") !== "txt_tipo_recibo") {
                                        if (el.tagName === 'SELECT') el.value = "";
                                        else if (el.type === 'checkbox') el.checked = false;
                                        else el.value = "";
                                    }
                                });
                            }
                        });
                    },
                    clearFields: function (fields = "") {
                        if (fields === "") fields = "all";
                        const allGroups = Object.keys(fieldGroup).filter(k => k !== "action");
                        allGroups.forEach(nameGroup => {
                            fieldGroup[nameGroup].forEach(el => {
                                if (el.getAttribute("id") !== "txt_tipo_recibo" && (fields.includes(el.getAttribute("id")) || fields === "all")) {
                                    if (el.tagName === 'SELECT') el.replaceChildren()
                                    else if (el.type === 'checkbox') el.checked = false;
                                    else el.value = "";
                                }
                            })
                        })
                    }
                }
            };
            return {
                "txt_date": "", "txt_long_date": { "dia": "", "mes": "", "anio": "", "hora": "" },
                "txt_serie_roc": "", "txt_tipo_recibo": "", "txt_nombre": "", "txt_empresa": "",
                "txt_curso": "", "txt_categoria": "", "txt_nivel": "", "txt_nombre_libro": "",
                "txt_tipo_pago": "", "txt_autorizacion": "", "txt_cheque_referencia": "",
                "txt_cheque_currency": "C$", "txt_deposito_referencia": "", "txt_deposito_currency": "C$",
                "txt_importeColegiatura": "", "txt_importeLibro": "", "txt_importeDescuento": "",
                "txt_importeOtros": "", "txt_importeRetencion": "", "txt_importeTotal": "",
                "txt_observaciones": "", "txt_tutor": "", "txt_correo": "", "txt_fecha_nacimiento": "",
                "txt_telefono": ""
            };
        }
    },
};
function maskPhone(input) {
    input.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4) + ' ' + value.slice(4, 8);
        this.value = value;
    });
}
function maskDate(input) {
    input.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
        if (value.length >= 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
        this.value = value;
    });
}
function maskCurrency(input) {
    input.addEventListener('input', function () {
        let value = this.value.replace(/[^0-9.]/g, '');
        let parts = value.split('.');
        if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
        this.value = value;
    });
}
function calculateAmounts() {
    const txtTipoRecibo = getValue(getEl("txt_tipo_recibo"));
    const txtCourse = String(getValue(getEl("txt_curso"))).trim();
    const txtCategory = String(getValue(getEl("txt_categoria"))).trim();
    const txtNivel = String(getValue(getEl("txt_nivel"))).trim();
    const Sede = String(getValue(getEl("txt_curso"))).trim().substring(4, 7);


    if (_HELPERS_.fn.IsValueEmpy(txtTipoRecibo) && _HELPERS_.fn.IsValueEmpy(txtCourse) && _HELPERS_.fn.IsValueEmpy(txtCategory) && _HELPERS_.fn.IsValueEmpy(txtNivel)) return false;

    const txt_code_1 = getValue(getEl("txt_code_1"));
    const txt_code_2 = getValue(getEl("txt_code_2"));
    const txt_code_3 = getValue(getEl("txt_code_3"));

    //let amountCLG = 0;
    // let amountLBR = 0;
    switch (txtTipoRecibo) {
        case "CLG":
        case "CLG-NUEVO":
        case "CLG-REINGRESO":

            if (Sede !== "" && txtCategory !== "" && txtNivel !== "" && txtCourse !== "") {

                allAmounts.Colegiatura = window._DATA_ELI_[Sede][txtCategory]?.precios?.colegiatura || 0;
                allAmounts.Libro = window._DATA_ELI_[Sede][txtCategory]["niveles"][txtNivel]?.price || 0;

            }

            break;
        case "LBR":
            if (Sede !== "" && txtCategory !== "" && txtNivel !== "" && txtCourse !== "") {
                allAmounts.Colegiatura == 0;
                allAmounts.Libro = window._DATA_ELI_[Sede][txtCategory]["niveles"][txtNivel]?.price || 0;
            }
            break;
        case "5":
            break;

        default:
            break;
    }

    let _discount_ = 0;
    if (txt_code_1 !== "") {
        _discount_ = parseInt(txt_code_1.substring(0, 3)) / 100;

    }
    if (txt_code_3 === "305-TR" && Sede === "EST") {
        _discount_ += 0.10;
    } else if (txt_code_3 === "305-TR" && Sede !== "EST") {
        CustomAlert.warning('⚠️ El descuento de 10% para los que viajan con Marlon Bravo solo es aplicable para Estelí.', 10000);
        document.querySelector("#txt_code_3").value = "~";

    }
    if (txt_code_3 === "200-RP") {
        allAmounts.Libro = 0;
        ClearIMGPreview();
    } else if (txt_code_3 !== "200-RP") {

        allAmounts.Libro = window._DATA_ELI_[Sede][txtCategory]["niveles"][txtNivel]?.price || 0;
        SetBook();
    }
    allAmounts.Descuento = -(allAmounts.Colegiatura * _discount_);
    const _retencion_1_ = getValue(getEl("txt_retencion_1"));
    const _retencion_2_ = getValue(getEl("txt_retencion_2"));

    if (_retencion_1_ && !_retencion_2_) {
        allAmounts.Retencion = 0.01;
    } else if (!_retencion_1_ && _retencion_2_) {
        allAmounts.Retencion = 0.02;
    } else if (_retencion_1_ && _retencion_2_) {
        allAmounts.Retencion = 0.03;
    } else {
        allAmounts.Retencion = 0;
    }


    fieldGroup.action.updateAmount();

}


function ResetCodeSelected(options) {
    const { disabled = true, except = "" } = options || {}
    document.querySelectorAll('[id*="txt_code_"]').forEach(function (item) {
        item.value = "~";
        item.disabled = disabled;
        item.readOnly = disabled;
        if (disabled) {
            item.parentElement.classList.add("txt_disable");

        } else {
            item.parentElement.classList.remove("txt_disable");
        }

    });
    document.querySelectorAll('[id*="txt_code_value_"]').forEach(function (item) {
        item.value = "";
        item.disabled = disabled;
        item.readOnly = disabled;
        if (disabled) {
            item.parentElement.classList.add("txt_disable");

        } else {
            item.parentElement.classList.remove("txt_disable");
        }
    });
}

function detectType() {
    const isCheckedEFECTIVO = document.getElementById("txt_tipo_efectivo").checked;
    const isCheckedTarjeta = document.getElementById("txt_tipo_tarjeta").checked;
    const noEmptyDeposito = String(getValue(document.getElementById("txt_deposito_referencia"))).trim() === "" ? false : true;
    const noEmptyCheque = String(getValue(document.getElementById("txt_cheque_referencia"))).trim() === "" ? false : true;
    if (isCheckedEFECTIVO || isCheckedTarjeta || noEmptyDeposito || noEmptyCheque) {
        fieldGroup.action.enable("code,observations,button");
        ResetCodeSelected({ disabled: false, except: "" });
        if (isCheckedTarjeta) {
            ResetCodeSelected(); //
            document.querySelector('#txt_code_3').disabled = false;
            document.querySelector('#txt_code_3').readOnly = false;
            document.querySelector('#txt_code_3').parentElement.classList.remove("txt_disable");
            document.querySelector('#txt_code_value_3').disabled = false;
            document.querySelector('#txt_code_value_3').readOnly = false;
            document.querySelector('#txt_code_value_3').parentElement.classList.remove("txt_disable");
        }

    } else {
        ResetCodeSelected(); //
        fieldGroup.action.disable("observations,button");
        // console.log(isCheckedEFECTIVO + "||" + isCheckedTarjeta + "||" + noEmptyDeposito + "||" + noEmptyCheque)
    }


}
function SetBook() {
    _SEDE_SELECTED_ = (getValue(getEl("txt_curso"))).substring(4, 7);
    _CATEGORY_SELECTED_ = getValue(getEl("txt_categoria"));
    const _LEVEL_SELECTED_ = getValue(getEl("txt_nivel"));
    const _BOOK_NAME_ = (window._DATA_ELI_[_SEDE_SELECTED_][_CATEGORY_SELECTED_]["niveles"][_LEVEL_SELECTED_]["title-book"]);
    const _BOOK_IMAGE_ = (window._DATA_ELI_[_SEDE_SELECTED_][_CATEGORY_SELECTED_]["niveles"][_LEVEL_SELECTED_]["thumb_img"]);
    const bookInput = getEl("txt_nombre_libro");
    if (_BOOK_NAME_ !== null) {
        bookInput.value = (_BOOK_NAME_);
        bookInput.classList.add("not_empty");
    } else {
        bookInput.value = "";
        bookInput.classList.remove("not_empty");
    }
    if (_BOOK_IMAGE_ !== null) {
        const thumbImg = document.getElementById("thumb-img");
        const imgthumb = document.createElement("img");
        imgthumb.id = "thumb-img-book";
        imgthumb.src = "https://dataanalyst-ans.github.io/thumb/" + _BOOK_IMAGE_;
        thumbImg.append(imgthumb);
        const zoomImg = document.getElementById("big-img");
        const imgzoom = document.createElement("img");
        imgzoom.id = "zoom-img-book";
        imgzoom.src = "https://dataanalyst-ans.github.io/thumb/" + _BOOK_IMAGE_;
        zoomImg.append(imgzoom);
        document.getElementById("preview-image").classList.add("show");
    }
}
function detectChange(e) {
    const target = e.target;
    const id = target.id;
    const tag = ReturnTypeTag(target);
    let value = getValue(target);

    let _SEDE_SELECTED_;
    let _CATEGORY_SELECTED_;
    let _LEVEL_;

    if (tag !== "CHECKBOX" && tag !== "RADIO") {
        if (value !== '' && value !== '~') addClass(target, "not_empty");
        else removeClass(target, "not_empty");
    }

    //console.log(id, ": ", value);
    switch (id) {
        case "txt_tipo_recibo":
            fieldGroup.action.clear();
            fieldGroup.action.disable("all");
            ResetCodeSelected();
            if (value !== "~") {
                fieldGroup.action.enable("inforStudent,tutorContact");
            }
            const nombreInputLocal = getEl("txt_nombre");
            if (nombreInputLocal) {
                const datalistId = nombreInputLocal.id + '_datalist';
                const datalist = getEl(datalistId);
                if (datalist) datalist.innerHTML = '';
            }
            if (value === "CLG-REINGRESO") {

                CustomAlert.warning('⚠️ Alumnos de reingreso deben realizar examen de nivelación.', 10000);
            }

            break;
        case "txt_nombre":


            fieldGroup.action.disable("paymentType,code,observations,amount,button");

            if (value !== "") {

                fieldGroup.action.enable("Courses");
            } else {

                fieldGroup.action.disable("Courses");
                setDisabled(getEl("txt_nombre_libro"), true)
            }
            getEl("txt_curso").value = "~";
            getEl("txt_categoria").value = "~";
            getEl("txt_nivel").value = "~";
            ResetCodeSelected();
            break;
        case "txt_curso":
            ClearIMGPreview();
            ResetCodeSelected();
            fieldGroup.action.clearFields("txt_categoria,txt_nivel");
            fieldGroup.action.disable("paymentType,code,observations,amount,button");
            if (value.trim() != "~") {
                _SEDE_SELECTED_ = (value || "").substring(4, 7);

                console.log("_SEDE_SELECTED_: ", _SEDE_SELECTED_);
                if (_SEDE_SELECTED_ !== "") {
                    const _CATEGORIES_ = Object.keys(window._DATA_ELI_[_SEDE_SELECTED_]);
                    const categoriesInput = getEl("txt_categoria");
                    categoriesInput.innerHTML = '';
                    const emptyOption = document.createElement('option');
                    emptyOption.value = '~';
                    emptyOption.textContent = '';
                    categoriesInput.appendChild(emptyOption);
                    _CATEGORIES_.forEach(opcion => {
                        const option = document.createElement('option');
                        option.value = opcion;
                        option.textContent = opcion.replace("-", " ");
                        categoriesInput.appendChild(option);
                    });
                }

            }
            fieldGroup.action.disable("paymentType");
            break;
        case "txt_categoria":
            ClearIMGPreview();
            ResetCodeSelected();
            fieldGroup.action.clearFields("txt_nivel");
            fieldGroup.action.disable("paymentType,code,observations,amount,button");
            if (value.trim() != "~") {
                _SEDE_SELECTED_ = (getValue(getEl("txt_curso"))).substring(4, 7);
                _CATEGORY_SELECTED_ = String(value).trim();
                _LEVEL_ = Object.keys(window._DATA_ELI_[_SEDE_SELECTED_][_CATEGORY_SELECTED_]["niveles"]);
                const levelInput = getEl("txt_nivel");
                levelInput.innerHTML = '';
                const emptyOptionlevel = document.createElement('option');
                emptyOptionlevel.value = '~';
                emptyOptionlevel.textContent = '';
                levelInput.appendChild(emptyOptionlevel);
                _LEVEL_.forEach(opcion => {
                    const option = document.createElement('option');
                    option.value = opcion;
                    option.textContent = opcion.replace("_", "");
                    levelInput.appendChild(option);
                });
            }
            fieldGroup.action.disable("paymentType");
            break;
        case "txt_nivel":
            ClearIMGPreview();
            fieldGroup.action.disable("paymentType,code,observations,amount,button");
            ResetCodeSelected();
            SetBook();
            if (value.trim() != "~") {

                fieldGroup.action.enable("paymentType");
            }
            break;
        case "txt_tipo_efectivo":
        case "txt_tipo_tarjeta":
        case "txt_deposito_referencia":
        case "txt_cheque_referencia":
            ResetCodeSelected();
            detectType();
            const _value_type_receipt = getValue(getEl("txt_tipo_recibo"));
            //fieldGroup.action.disable("code,observations,amount,button");
            switch (_value_type_receipt) {
                case "ANT":
                case "CURSO-INT-ONLINE":
                case "CAN":
                case "ABONO":
                case "OTROS":
                    ClearIMGPreview();


                    //console.log("_value_type_receipt", _value_type_receipt);
                    setDisabled(getEl("txt_importe_otros"), false);
                    //getEl("txt_importe_otros").parentNode().classList.remove("txt_disable");
                    break;

                default:
                    // fieldGroup.action.enable("code");
                    break;
            }

            break;
        case "txt_retencion_1":
            /* const txt_retencion_1 = (target.checked) ? "si" : "no";
             console.log("txt_retencion_1", txt_retencion_1);*/
            break;
        default:
            break;
    }

    calculateAmounts();
}
window.addEventListener('load', function () {
    _HELPERS_.__data__.initzialize();
    const serieNumber = _SERIAL_NUMBER_.split("|");
    const txtSerie = getEl("txt_serie");
    const txtRoc = getEl("txt_roc");
    if (txtSerie) txtSerie.value = serieNumber[0];
    if (txtRoc) txtRoc.value = serieNumber[1].trim();
    const serialRecibo = getEl("serial_recibo");
    if (serialRecibo) serialRecibo.innerHTML = `Serie ${serieNumber[0]} &nbsp;&nbsp;#&nbsp; ${serieNumber[1]}`;
    const dateEl = $(".date");
    if (dateEl) dateEl.innerHTML = Current_date("html");
    const birthInput = getEl("txt_fecha_nacimiento");
    if (birthInput) maskDate(birthInput);
    const phoneInput = getEl("txt_telefono");
    if (phoneInput) maskPhone(phoneInput);
    const otrosInput = getEl("txt_importe_otros");
    if (otrosInput) maskCurrency(otrosInput);
    const cursoSelect = getEl("txt_curso");
    if (cursoSelect) {
        const localidad = (_SEDE_GLOBAL == "TELEPAGO") ? getValue(getEl("txt_tipo_recibo")) : _SEDE_GLOBAL;
        cursoSelect.innerHTML = returnCursos(localidad);
    }

    const contenedor = document.getElementById('tablaContainer');
    if (contenedor) {
        new TablaDinamicaFiltro(contenedor, _LIST_ENROLLMENT_AUTOCOMPLETE_, {
            columnaFiltro: 0,        // filtro nombre en columna 0
            columnaSede: 1,          // filtro sede en columna 1
            inputNombreSelector: '#filtroNombre',
            selectSedeSelector: '#filtroSede'
        });
    } else {
        console.error('No se encontró #tablaContainer');
    }

    fieldGroup.action.disable("all");



    on('keyup', '[id^="txt_"]:not(#txt_importe_otros)', function (e) {

        detectChange(e)
    });

    // --- Evento change genérico para campos con id txt_* ---
    on('change', '[id*="txt_"]:not(.stop_event)', function (e) {

        detectChange(e)

    });

    // Manejador de pegado para depósitos
    on('paste', '.input-depo', async function (e) {
        const thisField = this;
        let idIndex = parseInt((thisField.getAttribute("id")).replace("input-depo-", ""));
        if (thisField.parentNode.getAttribute("class").includes("isBlocked")) return false;
        const valida = {
            formatDate: function (cadena) {
                const str = String(cadena).trim().toUpperCase()
                return str.replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g, (match, dia, mes, año) => {
                    const diaFormateado = dia.padStart(2, '0');
                    const mesFormateado = mes.padStart(2, '0');
                    return `${diaFormateado}/${mesFormateado}/${año}`;
                });
            },
            date: function (str) {
                return (str) => /^\d{2}\/\d{2}\/\d{4}$/.test(str);
            },
            isamount: function (str = "") {
                return (string) => /^[+-]?\d+(\.\d+)?$/.test(str.replace(/,/g, ''))
            }
        }
        const pastedText = e.clipboardData.getData('text/plain');
        e.preventDefault();
        const transformedText = pastedText.replace(/\t/g, '|');
        const _columns_ = transformedText.split("|");
        if (_columns_.length >= 4) {
            let data = {
                date: valida.formatDate(_columns_[0] || ""),
                ref: String((_columns_[1] || "")).trim().toUpperCase(),
                details: String((_columns_[2] || "")).trim().toUpperCase(),
                amount: (String((_columns_[3] || "")).trim().toUpperCase()).replace(/,/g, '')
            };
            if (valida.date(data.date) && valida.isamount(data.amount)) {
                const _currentDeposit_ = data.date + "  ║  " +
                    data.ref + "  ║  " +
                    data.amount + "  ║  " +
                    data.details;
                thisField.value = _currentDeposit_
                thisField.focus();
                thisField.setSelectionRange(0, 0);
                thisField.readOnly = true;
                this.classList.add("not_empty");
                if (!window._ALL_DEPOSITS[data.ref + "_"]) {
                    window._ALL_DEPOSITS[data.ref + "_"] = _currentDeposit_;

                    if (idIndex >= 1) {
                        idIndex++;

                        const next_input_depo = document.getElementById("input-depo-" + ((idIndex < 10) ? "0" : "") + idIndex)
                        if (next_input_depo) {
                            next_input_depo.parentNode.classList.remove("isBlocked")
                        }
                    }

                } else {
                    this.value = "";
                    CustomAlert.error('❌ No puedes ingresar el mismo depósito dos veces en este recibo.', 10000);
                }
            }
        } else {
            CustomAlert.error('❌ Fila incompleta. Copia la fila completa desde el archivo de depósitos.', 10000);
        }
    });


    on("click", "#big-img", function () {
        const preview = document.getElementById("preview-image");
        if (preview) {
            preview.classList.remove("hover")
            console.log("cerrar")
        } else {
            console.log("no cerraar")
        }
    });
    on("click", ".thumb-img", function () {

        document.getElementById("preview-image").classList.add("hover")
    });
    // Abrir modal de depósitos
    /*  on("click", "#txt_deposito_referencia", function () {
          const dialog = document.querySelector('#modalDepositos');
          const _fliendDeposits_ = document.querySelectorAll(".input-depo");
          _fliendDeposits_.forEach((field, index) => {
              field.value = "";
              field.classList.remove("not_empty")
              if (index > 0) {
                  field.parentNode.classList.add("isBlocked")
              }
          });
          if (Object.keys(window._ALL_DEPOSITS).length > 0) {
              Object.entries(window._ALL_DEPOSITS).forEach(([key, _value_], index) => {
                  const _fliendDeposits_ = document.querySelector("#input-depo-0" + (index + 1));
                  if (_fliendDeposits_) {
                      _fliendDeposits_.value = _value_;
                      _fliendDeposits_.classList.add("not_empty")
                      _fliendDeposits_.parentNode.classList.remove("isBlocked")
                  }
                  const _fliendDepositsNext_ = document.querySelector("#input-depo-0" + (index + 2))
                  if (_fliendDepositsNext_) {
                      _fliendDepositsNext_.parentNode.classList.remove("isBlocked")
                  }
              });
          }
          dialog.style.display = 'flex';
      });
      */

    // Cerrar modal de depósitos sin guardar
    on("click", ".close-depositos", function () {
        const _fliendDeposits_ = document.querySelectorAll(".input-depo");
        _fliendDeposits_.forEach(field => {
            field.value = "";
        });
        const dialog = document.querySelector('#modalDepositos');
        window._ALL_DEPOSITS = {};
        const deposito_referencia = document.getElementById("txt_deposito_referencia")
        if (deposito_referencia) {
            deposito_referencia.value = "";
            deposito_referencia.classList.remove("not_empty");
        }
        dialog.style.display = 'none';
        detectType();
    });

    // Limpiar un depósito individual
    on("click", ".btn-clear-depo", function () {
        if (this.parentNode.getAttribute("class").includes("isBlocked")) return false;
        const input = this.parentNode.querySelector('.input-depo')
        const _currentValue_ = input.value;
        if (String(_currentValue_).trim() !== "") {
            const _data_ = _currentValue_.split("  ║  ");
            if (_data_.length >= 4) {
                const _ref_ = _data_[1];
                delete window._ALL_DEPOSITS[_ref_ + "_"];
            }
            const _fliendDeposits_ = document.querySelectorAll(".input-depo");
            _fliendDeposits_.forEach(field => {
                field.value = "";
                field.classList.remove("not_empty")
            });
            Object.entries(window._ALL_DEPOSITS).forEach(([key, _value_], index) => {
                const _fliendDeposits_ = document.querySelector("#input-depo-0" + (index + 1));
                if (_fliendDeposits_) {

                    _fliendDeposits_.value = _value_;
                    _fliendDeposits_.classList.add("not_empty")
                }
            });
        }
    });

    // Evitar que Tab se comporte mal dentro de inputs de depósito
    on('keydown', '.input-depo', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    });

    // Guardar depósitos y cerrar modal
    on("click", ".save-depositos", function () {
        const _fliendDeposits_ = document.querySelectorAll(".input-depo");
        _fliendDeposits_.forEach(field => {
            field.value = "";
        });
        const dialog = document.querySelector('#modalDepositos');
        dialog.style.display = 'none';
        const deposito_referencia = document.getElementById("txt_deposito_referencia")

        if (deposito_referencia && Object.keys(window._ALL_DEPOSITS).length > 0) {
            deposito_referencia.value = (Object.keys(window._ALL_DEPOSITS).join(", ")).replace(/\_/g, "")
            deposito_referencia.classList.add("not_empty");
        }
        detectType();
    });

    // Restringir entrada numérica para referencias de cheque/depósito
    const refs = ["#txt_deposito_referencia", "#txt_cheque_referencia"];
    refs.forEach(sel => {
        const el = $(sel);
        if (el) {
            el.addEventListener("keydown", function (e) {
                const key = e.keyCode;
                if ([46, 8, 9, 27, 13, 109, 111, 188, 189, 190, 191, 220, 110, 32].includes(key) ||
                    (key === 65 && e.ctrlKey) || (key === 67 && e.ctrlKey) || (key === 86 && e.ctrlKey) ||
                    (key === 88 && e.ctrlKey) || (key >= 35 && key <= 39)) return;
                if ((e.shiftKey || (key < 48 || key > 57)) && (key < 96 || key > 105)) e.preventDefault();
            });
            el.addEventListener("paste", function (e) {
                const pastedData = (e.clipboardData || window.clipboardData).getData('Text');
                if (!/^\d+$/.test(pastedData)) e.preventDefault();
            });
        }
    });
});