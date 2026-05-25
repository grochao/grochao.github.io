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
            else if (i === 1) this.headers.push('SESIÓN');
            else if (i === 2) this.headers.push('Sede');
            else if (i === 3) this.headers.push('Nivel Ant.');
            else if (i === 4) this.headers.push('Nivel a Matri.');
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

                    if (i === 4) {
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

        this.contenedor.innerHTML = `<table class="table">${theadHTML}${tbodyHTML}</table>`;
        this._asignarEventosBotones();
    }

    _asignarEventosBotones() {
        const botones = this.contenedor.querySelectorAll('.btn-primary');
        botones.forEach((btn) => {
            btn.removeEventListener('click', this._boundHandleClick);
            btn.addEventListener('click', this._boundHandleClick);
        });
    }



    _displayModal(selector, visible = true) {
        let modal = document.querySelectorAll(selector);//document.getElementById(modalId);

        if (modal) modal.forEach(element => {
            //console.log(element.id, String(element.getAttribute('class')).trim(), visible)
            element.style.display = (visible === true ? 'flex' : 'none')
        });

    }
    _toggleAutocompleted(field) {
        if (!field.classList.contains('autocompleted')) {
            field.classList.add("autocompleted");
            field.classList.add("not_empty");
        } else {
            field.classList.remove("autocompleted");
            field.classList.remove("not_empty");
        }
        field.readOnly = !field.readOnly;
        field.disabled = !field.disabled;
        //if (!field.readOnly) {
        window.enrollmentAppInstance.applyNotEmpty(field);
        //}
    }
    _handleClick(e) {
        const id = e.currentTarget.getAttribute('data-id');
        const registro = this.registros.find((r) => r.id === id);

        if (registro) {
            this._displayModal('#modalListaParaMatricular', false);
            //console.log(JSON.stringify(registro.valores, null, true));



            let _CatLevel_ = [];
            switch (registro.valores[4]) {
                case "DESERSIÓN":
                case "REPITE":
                    _CatLevel_ = registro.valores[3].split("-");
                    _IS_REPEATER_ = true;
                    break;
                case "PENDIENTE EXAM.":
                    _CatLevel_ = registro.valores[3].split("-");

                    const Field_tipo_recibo = document.getElementById("txt_tipo_recibo");
                    Field_tipo_recibo.value = "~";
                    if (window.enrollmentAppInstance) {
                        window.enrollmentAppInstance.applyNotEmpty(Field_tipo_recibo);
                    }
                    _CatLevel_ = null;
                    break;
                default:
                    _CatLevel_ = registro.valores[4].split("-");


                    break;
            }


            if (_CatLevel_ !== null) {
                if (window.enrollmentAppInstance) {

                    const Nombre = registro.valores[0];
                    const field_nombre = document.getElementById("txt_nombre");
                    field_nombre.value = Nombre;
                    this._toggleAutocompleted(field_nombre);


                    //registro.valores[4]



                    const Sesion = registro.valores[1];

                    const field_sesion = document.getElementById("txt_curso");
                    field_sesion.value = Sesion;
                    this._toggleAutocompleted(field_sesion);

                    const _cat_ = (
                        _CatLevel_[0]
                            .replace("ES", "EARLY-SUCCESS")
                            .replace("CP", "CHILDREN PROGRAM")
                            .replace("ADUL", "ADULTO")
                            .replace("ADOL", "ADOLESCENTE")
                    ).toUpperCase();




                    const field_categoria = document.getElementById("txt_categoria");
                    field_categoria.value = _cat_;
                    this._toggleAutocompleted(field_categoria);


                    const field_nivel = document.getElementById("txt_nivel");
                    const _nivel_ = "_" + parseInt(_CatLevel_[1]);


                    field_nivel.value = _nivel_;

                    this._toggleAutocompleted(field_nivel);

                    field_nivel.dispatchEvent(new Event('change', { bubbles: true }));

                    console.log("--_cat_--", _cat_);


                    this._toggleAutocompleted(document.querySelector('#txt_empresa'));
                    this._toggleAutocompleted(document.querySelector('#txt_tutor'));
                    this._toggleAutocompleted(document.querySelector('#txt_correo'));
                    this._toggleAutocompleted(document.querySelector('#txt_telefono'));
                    this._toggleAutocompleted(document.querySelector('#txt_fecha_nacimiento'));

                    const field_code_3 = document.getElementById("txt_code_3");
                    if (field_code_3 && _IS_REPEATER_) {
                        field_code_3.value = "200-RP";

                        document.querySelectorAll(".print_observaciones .valor").forEach(element => {
                            element.textContent = "200-RP";
                        });
                    }

                }

            }


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


    abrirContainer() {
        this.contenedor.style.display = '';
        console.log("ABRIENDO CONTENEDOR", this.contenedor);
        if (this.contenedor.style.display === '') {
            delete this.contenedor.style.display;
        }
    }

    cerrarContainer() {
        this.contenedor.style.display = 'none';
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

window.CustomAlert = CustomAlert;

// ============================================================
// VARIABLES GLOBALES (NO ELIMINADAS)
// ============================================================
let _LIST_ENROLLMENT_AUTOCOMPLETE_ = null;
try {
    _LIST_ENROLLMENT_AUTOCOMPLETE_ = {

        "LEO00000": [
            "ESPINOZA NUÑEZ NASHLY ALAIA",
            "2026LEOSAB03",
            "LEO",
            "ES-6",
            "ES-7"
        ],
        "LEO00001": ["SIRIAS OSEJO HENRY ALESSANDRO", "2026LEOSAB03", "LEO", "ADUL-10", "DESERSIÓN"],
        "LEO00002": ["HERNÁNDEZ RIVERA KENDRICK ISAAC", "2026LEOSAB03", "LEO", "ADOL-10", "REPITE"],
        "LEO00003": ["PICHARDO SOTO JAIR JOSSIEL", "2026MAGSAB03", "MAG", "ADOL-09", "PENDIENTE EXAM."],
        "LEO00004": ["ZELAYA PARRALES AURA INES", "2026ESTSAB03", "EST", "ES-08", "ES-09"]
    };
} catch (err) { _LIST_ENROLLMENT_AUTOCOMPLETE_ = { "A999999": ["DIFERENCIAL CAMBIARIO", "0", "01/01/2025"] }; }

let _LIST_ADMISSION_AUTOCOMPLETE_ = {
    "A99787": ["Guillermo Mauricio Rocha Ortiz", "Guillermo Rocha", "09/07/1983", "g.rocha.o@live.com", "83256836", "Managua nicaragua"],
    "A99788": ["Rocha Acosta Karla Inés", "Juan Carlos Rocha", "09/07/1983", "g.rocha.o@live.com", "84787652", "Managua nicaragua"],
    "A99789": ["Rocha Ortiz Juan Carlos", "Carlos Rocha", "09/07/1983", "g.rocha.o@live.com", "82987893", "Managua nicaragua"]
};

var _ALL_CONFIG_APP_ = { "CURSOS": ["2026~LEO~LEO~PR~SAB~03~SABATÍNO", "2026~LEO~MAG~TL~REG~03~TALLER ONLINE", "2026~LEO~LEO~PR~SAB~02~SABATÍNO", "2025~LEO~MAG~ON~REG~03~REGULAR ONLINE"] };

var _CURRENT_URL_APP_ = 'https://script.google.com/a/ans.edu.ni/macros/s/AKfycbyWvjhXF2QcpBOLG4MrRcIRIWJ3J5NhdZ6zyjyz-yU/dev';

var _IS_REPEATER_ = false;
let _CURRENT_DATE_TIME_ = "";

class EnrollmentAppCore {
    constructor() {
        this.fieldGroup = {};
        this.fieldData = {};
        this.helpers = {};
        this.allAmounts = { Colegiatura: 0, Libro: 0, Otros: 0, Descuento: 0, Retencion: 0, Total: 0 };
        this._SERIAL_NUMBER_ = null;
        this._LIST_ENROLLMENT_SEDE_ = null;
        window._ALL_DEPOSITS = window._ALL_DEPOSITS || {};
    }

    $(selector, context = document) { return context.querySelector(selector); }
    $$(selector, context = document) { return Array.from(context.querySelectorAll(selector)); }
    getEl(id) { return document.getElementById(id); }

    SetValue(ObjID, NewValue) {
        if (!ObjID || typeof ObjID !== 'string') return 0;
        const elements = this.$$(ObjID);
        if (!elements.length) return 0;
        let updated = 0;
        elements.forEach((el) => {
            const tag = (el.tagName || '').toUpperCase();
            const acceptsValue = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'BUTTON', 'METER', 'PROGRESS'].includes(tag) || ('value' in el);
            if (acceptsValue) {
                el.value = NewValue;
            } else {
                el.textContent = NewValue;
            }
            updated += 1;
        });
        return updated;
    }

    _callbackButtons(callback) {
        const botones = document.querySelectorAll('[class*="callback-"]');

        botones.forEach((btn) => {
            let sufijo;
            const claseCallback = Array.from(btn.classList).find(cls => cls.startsWith('callback-'));
            if (claseCallback) {
                sufijo = String(claseCallback.slice('callback-'.length)).trim().toLowerCase();
            }

            btn.addEventListener('click', function () {
                const txt_tipo_recibo = document.getElementById('txt_tipo_recibo');
                switch (sufijo) {
                    case 'matricular':
                        break;
                    case 'print':
                        window.print();
                        txt_tipo_recibo.value = "~";
                        txt_tipo_recibo.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    case 'clear-all':
                        txt_tipo_recibo.value = "~";
                        txt_tipo_recibo.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    default:
                        break;
                }
            });
        });
    }

    addClass(el, c) { if (el) el.classList.add(c); }
    removeClass(el, c) { if (el) el.classList.remove(c); }

    returnTypeTag(el) { let tag = el.tagName.toUpperCase(); if (tag === 'INPUT') tag = (el.type || 'text').toUpperCase(); return tag; }
    getValue(el) { if (!el) return ''; const t = this.returnTypeTag(el); if (("CHECKBOX|RADIO").includes(t)) return !!el.checked; return el.value === '~' ? '' : el.value; }
    setDisabled(el, disabled) {
        if (!el || el.getAttribute('id') === 'txt_nombre_libro') return false;
        el.disabled = disabled; el.readOnly = disabled;
        if (disabled) {
            this.addClass(el.parentNode, 'txt_disable');
            if (el.getAttribute('id') !== 'txt_tipo_recibo') {
                if (el.tagName === 'SELECT') el.value = '~';
                else if (el.type === 'checkbox') el.checked = false; else el.value = '';

                if (el.type == "text" || el.tagName === 'SELECT') {
                    el.classList.remove("not_empty");
                }
            }

        }
        else this.removeClass(el.parentNode, 'txt_disable');
    }

    on(event, selector, handler) {
        document.addEventListener(event, (e) => {
            let target = e.target;
            while (target && target !== document) {
                if (target.matches && target.matches(selector)) { handler.call(target, e); break; }
                target = target.parentNode;
            }
        });
    }

    currentDate(type = false) {
        const d = new Date(); const dd = String(d.getDate()).padStart(2, '0'); const mm = String(d.getMonth() + 1).padStart(2, '0'); const yyyy = d.getFullYear();
        if (type === 'html') return `<div class="date-label">DÍA / MES / AÑO</div><div class="valor">${dd} / ${mm} / ${yyyy}</div>`;
        return `${mm}/${dd}/${yyyy}`;
    }

    returnCursos() {
        const cursos = _ALL_CONFIG_APP_.CURSOS || [];

        const parsed = cursos
            .filter(curso => curso)
            .map(curso => {
                const c = curso.split('~');
                return {
                    anio: c[0],
                    c2: c[2],
                    c3: c[3],
                    c4: c[4],
                    sesion: c[5],
                    nombre: c[6],
                    sesionNum: parseInt(c[5], 10)
                };
            });

        parsed.sort((a, b) => {
            if (a.anio !== b.anio) return a.anio.localeCompare(b.anio);
            return a.sesionNum - b.sesionNum;
        });

        let options = '<option value="~"></option>';
        let currentAnio = null;

        for (const curso of parsed) {
            if (currentAnio !== curso.anio) {
                if (currentAnio !== null) options += '</optgroup>';
                options += `<optgroup label="${curso.anio}">`;
                currentAnio = curso.anio;
            }

            let value = `${curso.anio}${curso.c2}${curso.c4}${curso.sesion}`;
            if (curso.c3 === 'ON') value += '-ONLINE';
            const text = `${curso.nombre} SESIÓN ${curso.sesion}`;
            options += `<option value="${value}">${text}</option>`;
        }

        if (currentAnio !== null) options += '</optgroup>';
        return options;
    }

    maskPhone(input) { input.addEventListener('input', function () { let v = this.value.replace(/\D/g, ''); if (v.length > 4) v = v.slice(0, 4) + ' ' + v.slice(4, 8); this.value = v; }); }
    maskDate(input) { input.addEventListener('input', function () { let v = this.value.replace(/\D/g, ''); if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2); if (v.length >= 5) v = v.slice(0, 5) + '/' + v.slice(5, 9); this.value = v; }); }
    maskCurrency(input) { input.addEventListener('input', function () { let v = this.value.replace(/[^0-9.]/g, ''); let p = v.split('.'); if (p.length > 2) v = p[0] + '.' + p.slice(1).join(''); this.value = v; }); }

    initFieldGroup() {
        const self = this;

        const asCurrency = (n) => {
            const num = parseFloat(String(n).trim());
            if (Number.isNaN(num)) return String(n);
            const fixed = num.toFixed(2).split('.');
            fixed[0] = fixed[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return `${fixed[0]}.${fixed[1]}`;
        };
        this.helpers = {
            getCurrentDate(showHour = false) {
                const ahora = new Date();
                const dia = String(ahora.getDate()).padStart(2, '0');
                const mes = String(ahora.getMonth() + 1).padStart(2, '0');
                const anio = ahora.getFullYear();
                let horas24 = ahora.getHours();
                const minutos = String(ahora.getMinutes()).padStart(2, '0');
                const segundos = String(ahora.getSeconds()).padStart(2, '0');
                const ampm = horas24 >= 12 ? 'PM' : 'AM';
                let horas12 = horas24 % 12;
                horas12 = horas12 === 0 ? 12 : horas12;
                const horasStr = String(horas12).padStart(2, '0');
                return `${dia}/${mes}/${anio}` + ((showHour) ? ` │ ${horasStr}:${minutos} ${ampm}` : ``);
            },
            getValue: function (el) {
                if (!el) return '';
                const t = self.returnTypeTag(el);
                if (("CHECKBOX|RADIO").includes(t)) {
                    return !!el.checked;
                } else {
                    return el.value === '~' ? '' : el.value;
                }
            },
            clearScreen: (elements) => {
                elements.forEach((el) => {
                    el.value = '';
                });
            },
            clearPrint: (elements) => {
                elements.forEach((el) => {
                    el.textContent = '';
                });
            },
            asCurrency: (n) => {
                const num = parseFloat(String(n).trim());
                if (Number.isNaN(num)) return String(n);
                const fixed = num.toFixed(2).split('.');
                fixed[0] = fixed[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return `${fixed[0]}.${fixed[1]}`;
            },
            isObject(elemento) {
                return elemento !== null &&
                    elemento !== undefined &&
                    !(elemento instanceof NodeList && elemento.length === 0);
            },
        };
        this.fieldData = {
            actions: {
                updateRecipt: function () {
                    const _dataSet_ = this.fieldData.dataSet;
                    Object.keys(this.fieldData.dataSet).filter((key) => key !== 'tipoRecibo').forEach(fieldName => {
                        const _theField_ = _dataSet_[fieldName] || null;
                        if (_theField_) {
                            let _concatenate_ = [];
                            const delimiter = _theField_?.joinTo?.delimiter || "";
                            const joinToElements = _theField_?.joinTo?.elements || [];
                            if (delimiter) {
                                joinToElements.forEach((key) => {
                                    const _value_ = (key === "Curso") ? _dataSet_[key]?.sessionNumber || '' : _dataSet_[key]?.value || "";
                                    if (_value_) {
                                        _concatenate_.push(_value_);
                                    }
                                });
                            }
                            if (_theField_?.actions) {
                                _theField_.actions();
                            }
                            (_theField_.print || []).forEach((el) => {
                                const _value_ = (fieldName === "Curso") ? _theField_?.sessionNumber || '' : _theField_?.value || "";
                                if (joinToElements) {
                                    el.innerHTML = `${_value_ + delimiter + _concatenate_.join(delimiter)}`;
                                } else {
                                    el.innerHTML = `${_value_}`;
                                }
                            });
                        }
                    });
                    if (_IS_REPEATER_) {
                        self.setBook({ clear: true })
                    }
                    const _sede_ = document.querySelectorAll('.print_sucursal  .valor');
                    if (_sede_) {
                        _sede_.forEach((el) => {
                            el.innerHTML = `${window._SEDE_GLOBAL}`
                        })
                    }
                    self.setAmounts();
                }.bind(this)
            },
            dataSet: {
                Fecha: {
                    screen: document.querySelectorAll('#txt_fecha'),
                    print: document.querySelectorAll('.print_fecha .valor'),
                    get value() {
                        return _CURRENT_DATE_TIME_;
                    }
                },
                tipoRecibo: {
                    screen: document.querySelectorAll('#txt_tipo_recibo'),
                    print: document.querySelectorAll('.tipo_recibo .valor'),
                    get value() {
                        return Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || ''
                    }
                },
                Nombre: {
                    screen: document.querySelectorAll('#txt_nombre'),
                    print: document.querySelectorAll('.print_nombre .valor'),
                    joinTo: { elements: ['Empresa'], delimiter: '<br>' },
                    get value() {
                        return Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || ''
                    }
                },
                Empresa: {
                    screen: document.querySelectorAll('#txt_empresa'),
                    get value() {
                        return Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || ''
                    }
                },
                Tutor: {
                    screen: document.querySelectorAll('#txt_tutor'),
                    get value() {
                        return Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || ''
                    }
                },
                Correo: {
                    screen: document.querySelectorAll('#txt_correo'),
                    get value() {
                        return Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || ''
                    }
                },
                FechaNacimiento: {
                    screen: document.querySelectorAll('#txt_fecha_nacimiento'),
                    get value() {
                        return Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || ''
                    }
                },
                Telefono: {
                    screen: document.querySelectorAll('#txt_telefono'),
                    get value() {
                        return Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || ''
                    }
                },
                Curso: {
                    screen: document.querySelectorAll('#txt_curso'),
                    print: document.querySelectorAll('.print_curso .valor'),
                    get value() {
                        return Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || ''
                    },
                    get branchName() {
                        const _curso_ = Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || ''
                        if (_curso_.includes("EST")) {
                            return "ESTELÍ"
                        } else if (_curso_.includes("LEO")) {
                            return "LEÓN"
                        }
                        else if (_curso_.includes("MAG")) {
                            return "MANAGUA"
                        } else {
                            return "MANAGUA"
                        }
                    },
                    get sessionNumber() {
                        return Array.from(this.screen).map((el) => String(el.value).slice(-2) + "-" + String(el.value).substring(0, 4)).join('|').toUpperCase() || ''
                    }
                },
                Categoria: {
                    screen: document.querySelectorAll('#txt_categoria'),
                    get value() {
                        return Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || ''
                    }
                },
                Nivel: {
                    screen: document.querySelectorAll('#txt_nivel'),
                    print: document.querySelectorAll('.print_nivel .valor'),
                    joinTo: { elements: ['Categoria'], delimiter: '-' },
                    get value() {
                        return Array.from(this.screen).map((el) => String(el.value).replace("_", "")).join(' ').toUpperCase() || ''
                    }
                },
                NombreLibro: {
                    screen: document.querySelectorAll('#txt_nombre_libro'),
                    print: document.querySelectorAll('.print_nombre_libro .valor'),
                    actions: function () {
                        self.setBook();
                    },
                    get value() {
                        let nombre_libro = String(Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || '').trim();
                        if (nombre_libro === "") {
                            nombre_libro = "NO SE REQUIERE LA COMPRA DE LIBRO";
                        }
                        return nombre_libro;
                    }
                },
                Obserbaciones: {
                    print: document.querySelectorAll('.print_observaciones .valor'),
                    get value() {
                        let _obserbaciones_ = "";
                        const txt_retencion_1 = self.getValue(self.getEl("txt_retencion_1"));
                        const txt_retencion_2 = self.getValue(self.getEl("txt_retencion_2"));
                        const txt_code_1 = self.getValue(self.getEl("txt_code_1"));
                        const txt_code_value_1 = self.getValue(self.getEl("txt_code_value_1"));
                        const txt_code_2 = self.getValue(self.getEl("txt_code_2"));
                        const txt_code_value_2 = self.getValue(self.getEl("txt_code_value_2"));
                        const txt_code_3 = self.getValue(self.getEl("txt_code_3"));
                        const txt_code_value_3 = self.getValue(self.getEl("txt_code_value_3"));
                        if (txt_code_1 !== "") {
                            _obserbaciones_ = txt_code_1 + " " + txt_code_value_1;
                        }
                        if (txt_code_2 !== "") {
                            _obserbaciones_ += ((_obserbaciones_ !== "") ? "<br>" : "") + txt_code_2 + " " + txt_code_value_2;
                        }
                        if (txt_code_3 !== "") {
                            _obserbaciones_ += ((_obserbaciones_ !== "") ? "<br>" : "") + txt_code_3 + " " + txt_code_value_3;
                        }
                        if (txt_retencion_1 && !txt_retencion_2) {
                            _obserbaciones_ += ((_obserbaciones_ !== "") ? "<br>" : "") + 'Se aplicó retención: 1%';
                        } else if (!txt_retencion_1 && txt_retencion_2) {
                            _obserbaciones_ += ((_obserbaciones_ !== "") ? "<br>" : "") + 'Se aplicó retención: 2%';
                        } else if (txt_retencion_1 && txt_retencion_2) {
                            _obserbaciones_ += ((_obserbaciones_ !== "") ? "<br>" : "") + 'Se aplicó retención: 3%';
                        }
                        return (_obserbaciones_ || '').toUpperCase()
                    }
                },
                MetodoPago: {
                    screen: document.querySelectorAll('#txt_tipo_efectivo, #txt_tipo_tarjeta,#txt_deposito_referencia, #txt_cheque_referencia'),
                    print: document.querySelectorAll('.print_tipo_pago .valor'),
                    get value() {
                        return ((Array.from(this.screen).map((el) => {
                            const id = el.getAttribute("id");
                            const value = self.getValue(el);
                            if (("txt_tipo_efectivo|txt_tipo_tarjeta|txt_deposito_referencia|txt_cheque_referencia|").includes(id)) {
                                switch (id) {
                                    case "txt_tipo_efectivo":
                                        return (value) ? "efectivo" : "";
                                    case "txt_tipo_tarjeta":
                                        return (value) ? "tarjeta" : "";
                                    case "txt_deposito_referencia":
                                        return (value !== "") ? "Depósito" : "";
                                    case "txt_cheque_referencia":
                                        return (value !== "") ? "Cheque" : "";
                                    default:
                                        return "";
                                }
                            }
                        }).join(' ').toUpperCase() || '').trim()).replace(/\s+/g, ", ");
                    }
                },
            },
            Amount: {
                Colegiatura: {
                    screen: document.querySelector('#txt_importe_colegiatura'),
                    print: document.querySelectorAll('.print_colegiatura .valor')
                },
                Libro: {
                    screen: document.querySelector('#txt_importe_libro'),
                    print: document.querySelectorAll('.print_libro .valor')
                },
                Otros: {
                    screen: document.querySelector('#txt_importe_otros'),
                    print: document.querySelectorAll('.print_otros .valor')
                },
                Descuento: {
                    screen: document.querySelector('#txt_importe_descuento'),
                    print: document.querySelectorAll('.print_descuento .valor')
                },
                Retencion: {
                    screen: document.querySelector('#txt_importe_retencion'),
                    print: document.querySelectorAll('.print_retencion .valor')
                },
                Total: {
                    screen: document.querySelector('#txt_importe_total'),
                    print: document.querySelectorAll('.print_total .valor')
                }
            }
        };
        this.fieldGroup = {
            inforStudent: document.querySelectorAll('.input-disable-infor1_student [id*="txt_"]'),
            tutorContact: document.querySelectorAll('.input-disable-infor2_student [id*="txt_"]'),
            Courses: document.querySelectorAll('.input-disable-infor3_student [id*="txt_"]'),
            paymentType: document.querySelectorAll('.input-disable-infor4_student [id*="txt_"]'),
            code: document.querySelectorAll('.input-disable-infor5_student [id*="txt_"]'),
            observations: document.querySelectorAll('.input-disable-infor6_student [id*="txt_"]'),
            amount: document.querySelectorAll('.input-disable-infor7_student [id*="txt_"]'),
            printButton: document.querySelectorAll('.input-disable-infor8_student .callback-print'),
            action: {
                clearAmount: () => {
                    this.allAmounts = { Colegiatura: 0, Libro: 0, Otros: 0, Descuento: 0, Retencion: 0, Total: 0 };
                    Object.keys(this.fieldData.Amount).forEach((key) => {
                        const value = asCurrency(this.allAmounts[key] || 0);
                        const f = this.fieldData.Amount[key];
                        if (f?.screen) f.screen.value = value;
                        if (f?.print) f.print.innerHTML = value;
                    });
                },
                updateAmount: () => {
                    this.allAmounts.Total = (this.allAmounts.Colegiatura + this.allAmounts.Descuento) + (this.allAmounts.Libro + this.allAmounts.Otros);
                    this.allAmounts.Retencion = -(parseFloat((this.allAmounts.Total * this.allAmounts.Retencion).toFixed(2)));
                    this.allAmounts.Total += this.allAmounts.Retencion;
                    Object.keys(this.fieldData.Amount).forEach((key) => {
                        const value = asCurrency(this.allAmounts[key] || 0);
                        const f = this.fieldData.Amount[key];
                        if (f?.screen) f.screen.value = value;
                        if (f?.print) f.print.forEach((el) => {
                            if (el) el.innerHTML = value;
                        });
                    });
                },
                disable: (groups = '') => {
                    const allGroups = Object.keys(this.fieldGroup).filter((k) => k !== 'action');
                    const targets = !groups || groups.includes('all') ? allGroups : groups.split(',');
                    targets.forEach((g) => (this.fieldGroup[g] || []).forEach((el) => { if (el.getAttribute('id') !== 'txt_tipo_recibo') this.setDisabled(el, true); }));
                },
                enable: (groups = '') => {
                    const allGroups = Object.keys(this.fieldGroup).filter((k) => k !== 'action');
                    const targets = !groups || groups.includes('all') ? allGroups : groups.split(',');
                    targets.forEach((g) => (this.fieldGroup[g] || []).forEach((el) => { if (el.getAttribute('id') !== 'txt_tipo_recibo' && !el.classList.contains('isBlocked')) this.setDisabled(el, false); }));
                },
                clear: (groups = '') => {
                    const allGroups = Object.keys(this.fieldGroup).filter((k) => k !== 'action');
                    const targets = !groups || groups.includes('all') ? allGroups : groups.split(',');
                    targets.forEach((g) => (this.fieldGroup[g] || []).forEach((el) => {
                        if (el.getAttribute('id') !== 'txt_tipo_recibo') {
                            if (el.tagName === 'SELECT') el.value = '';
                            else if (el.type === 'checkbox') el.checked = false;
                            else el.value = '';
                        }
                    }));
                },
                clearFields: (fields = '') => {
                    const allGroups = Object.keys(this.fieldGroup).filter((k) => k !== 'action');
                    allGroups.forEach((nameGroup) => (this.fieldGroup[nameGroup] || []).forEach((el) => {
                        if (el.getAttribute('id') !== 'txt_tipo_recibo' && (fields === 'all' || fields.includes(el.getAttribute('id')))) {
                            if (el.tagName === 'SELECT') el.replaceChildren();
                            else if (el.type === 'checkbox') el.checked = false;
                            else el.value = '';
                        }
                    }));
                }
            }
        };
    }

    resetCodeSelected(options = {}) {
        const { disabled = true } = options;
        this.$$('[id*="txt_code_"]').forEach((item) => {
            item.disabled = disabled;
            item.readOnly = disabled;
            if (!_IS_REPEATER_) item.value = '~';
            item.parentElement && item.parentElement.classList.toggle('txt_disable', disabled);
        });
        this.$$('[id*="txt_code_value_"]').forEach((item) => {
            item.disabled = disabled;
            item.readOnly = disabled;
            if (!_IS_REPEATER_) item.value = '';
            item.parentElement && item.parentElement.classList.toggle('txt_disable', disabled);
        });
    }

    detectType() {
        const ef = this.getEl('txt_tipo_efectivo')?.checked;
        const tj = this.getEl('txt_tipo_tarjeta')?.checked;
        const dep = String(this.getValue(this.getEl('txt_deposito_referencia'))).trim() !== '';
        const chq = String(this.getValue(this.getEl('txt_cheque_referencia'))).trim() !== '';
        if (ef || tj || dep || chq) {
            this.fieldGroup.action?.enable('code,observations,button,printButton');
            this.resetCodeSelected({ disabled: false });
            if (tj) {
                const becasDescuentos = this.getEl('txt_code_1');
                becasDescuentos.value = "~";
                becasDescuentos.disabled = true;
                becasDescuentos.readOnly = true;
                becasDescuentos.parentElement && becasDescuentos.parentElement.classList.toggle('txt_disable', true);
                const becasDescuentosDescription1 = this.getEl('txt_code_value_1');
                becasDescuentosDescription1.value = "";
                becasDescuentosDescription1.disabled = true;
                becasDescuentosDescription1.readOnly = true;
                becasDescuentosDescription1.parentElement && becasDescuentosDescription1.parentElement.classList.toggle('txt_disable', true);
                const descuentosTemporales = this.getEl('txt_code_2');
                descuentosTemporales.value = "~";
                descuentosTemporales.disabled = true;
                descuentosTemporales.readOnly = true;
                descuentosTemporales.parentElement && descuentosTemporales.parentElement.classList.toggle('txt_disable', true);
                const becasDescuentosDescription2 = this.getEl('txt_code_value_2');
                becasDescuentosDescription2.value = "";
                becasDescuentosDescription2.disabled = true;
                becasDescuentosDescription2.readOnly = true;
                becasDescuentosDescription2.parentElement && becasDescuentosDescription2.parentElement.classList.toggle('txt_disable', true);
            }
        } else {
            this.resetCodeSelected();
            this.fieldGroup.action?.disable('observations,printButton');
        }
    }

    setBook(options = {}) {
        let { clear = false,
            curso = String(this.safeGet('txt_curso') ?? ''),
            sede = String(this.safeGet('txt_curso') ?? '').trim().substring(4, 7),
            categoria = String(this.safeGet('txt_categoria') ?? '').trim(),
            nivel = String(this.safeGet('txt_nivel') ?? '').trim().substring(0, 2)
        } = options;

        if (clear === true) {
            curso = "";
            sede = "";
            categoria = "";
            nivel = "";
        }

        let bookInput = document.getElementById('txt_nombre_libro');
        let imgthumb = document.getElementById('thumb-img-book');
        let imgzoom = document.getElementById('zoom-img-book');
        const preview = this.getEl('preview-image');


        if (sede === "" || categoria === "" || nivel === "") {
            bookInput.value = '';
            bookInput.classList.remove('not_empty');
            if (imgthumb) imgthumb.remove();
            if (imgzoom) imgzoom.remove();
            preview.classList.remove('show');
            return;
        };

        //console.log(String(clear), "pass 1: [" + curso + "] [" + sede + "] [" + categoria + "] [" + nivel + "]");

        const data = window._DATA_ELI_[sede][categoria]["niveles"][nivel] || {};
        const NombreLibro = clear ? "" : (data["title-book"] || "");
        const PreviewImage = clear ? "" : (data["thumb_img"] || "");

        if (bookInput) {
            if (NombreLibro !== "") {
                bookInput.value = NombreLibro;
                bookInput.classList.add('not_empty');
            } else {
                bookInput.value = '';
                bookInput.classList.remove('not_empty');
            }
        }

        if (PreviewImage !== "") {
            const thumbImg = this.getEl('thumb-img');
            const zoomImg = this.getEl('big-img');
            if (thumbImg && zoomImg) {
                if (!imgthumb) {
                    imgthumb = document.createElement('img');
                    imgthumb.id = 'thumb-img-book';
                    thumbImg.append(imgthumb);
                }
                imgthumb.src = 'https://dataanalyst-ans.github.io/thumb/' + PreviewImage;
                if (!imgzoom) {
                    imgzoom = document.createElement('img');
                    imgzoom.id = 'zoom-img-book';
                    zoomImg.append(imgzoom);
                }
                imgzoom.src = 'https://dataanalyst-ans.github.io/thumb/' + PreviewImage;
                if (preview) preview.classList.add('show');
            }
            document.querySelector(".print_nombre_libro .valor").innerText = NombreLibro;
        } else {
            const preview = this.getEl('preview-image');
            if (preview) preview.classList.remove('show');
            if (imgthumb) imgthumb.remove();
            if (imgzoom) imgzoom.remove();
        }

        console.log("---NombreLibro---", NombreLibro);
    }

    isEmptyValue(value) {
        return value === '' || value === null || value === undefined || String(value).trim() === '' || String(value).trim() === '~' || String(value).trim().toLowerCase() === 'empty';
    }

    safeGet(id) {
        const el = this.getEl(id);
        return el ? this.getValue(el) : undefined;
    }

    setAmounts() {
        const txtTipoRecibo = String(this.safeGet('txt_tipo_recibo')).trim();
        const txtCourse = String(this.safeGet('txt_curso') ?? '').trim();
        const txtCategory = String(this.safeGet('txt_categoria') ?? '').trim();
        const txtNivel = String((this.safeGet('txt_nivel')) ?? '').trim();
        const sede = txtCourse.substring(4, 7);

        if ([txtTipoRecibo, txtCourse, txtCategory, txtNivel, sede].every((v) => this.isEmptyValue(v))) return false;

        const txt_code_1 = this.safeGet('txt_code_1') ?? '';
        const txt_code_3 = this.safeGet('txt_code_3') ?? '';
        const hasDataPath = !!(window._DATA_ELI_ && window._DATA_ELI_[sede] && window._DATA_ELI_[sede][txtCategory] && window._DATA_ELI_[sede][txtCategory]["niveles"] && window._DATA_ELI_[sede][txtCategory]["niveles"][txtNivel]);
        let _CATEGORY_ = {};
        if (!hasDataPath) return;
        _CATEGORY_ = structuredClone(window._DATA_ELI_[sede][txtCategory]);

        switch (txtTipoRecibo) {
            case 'CLG':
            case 'CLG-NUEVO':
            case 'CLG-REINGRESO':
                if (hasDataPath) {
                    this.allAmounts.Colegiatura = _CATEGORY_["precios"]["colegiatura"] || 0;
                    this.allAmounts.Libro = _CATEGORY_["niveles"][txtNivel]["price"] || 0;
                }
                break;
            case 'LBR':
                if (hasDataPath) {
                    this.allAmounts.Colegiatura = 0;
                    this.allAmounts.Libro = _CATEGORY_["niveles"][txtNivel]["price"] || 0;
                }
                break;
            default:
                break;
        }
        let discount = 0;
        if (!this.isEmptyValue(txt_code_1)) discount = (parseInt(String(txt_code_1).substring(0, 3), 10) || 0) / 100;

        if (txt_code_3 === '305-TR' && sede === 'EST') discount += 0.1;
        else if (txt_code_3 === '305-TR' && sede !== 'EST') {
            window.CustomAlert?.warning('⚠️ El descuento de 10% para los que viajan con Marlon Bravo solo es aplicable para Estelí.', 10000);
            const code3 = this.getEl('txt_code_3'); if (code3) code3.value = '~';
        }

        if ((_IS_REPEATER_ === true && this.allAmounts.Libro > 0) && txt_code_3 !== '201-RP') {
            this.allAmounts.Libro = 0;
            const code3 = this.getEl('txt_code_3');
            if (code3) {
                code3.value = '200-RP';
            }
        } else if (txt_code_3 === '200-RP') {
            this.allAmounts.Libro = 0;
        } else if (hasDataPath) {
            this.allAmounts.Libro = _CATEGORY_["niveles"][txtNivel]["price"] || 0;
        }

        if (['201-RP', '801-EX-LBR'].includes(txt_code_3)) {
            let price_book = 0;
            for (let i = parseInt(txtNivel.replace("_", "")); i >= 1; i--) {
                price_book = window._DATA_ELI_[sede][txtCategory]["niveles"]["_" + i]["price"] || 0;
                if (price_book > 0) {
                    this.setBook({
                        curso: txtCourse,
                        sede: sede,
                        categoria: txtCategory,
                        nivel: "_" + i
                    });
                    break;
                }
            }
            this.allAmounts.Libro = price_book;
        }

        this.allAmounts.Descuento = -(this.allAmounts.Colegiatura * discount);
        const r1 = !!this.safeGet('txt_retencion_1');
        const r2 = !!this.safeGet('txt_retencion_2');
        this.allAmounts.Retencion = r1 && r2 ? 0.03 : r1 ? 0.01 : r2 ? 0.02 : 0;

        this.fieldGroup.action.updateAmount();
        return true;
    }

    applyNotEmpty(target) {
        const id = target?.id || '';
        const tag = this.returnTypeTag(target);
        const value = this.getValue(target);
        if (tag !== 'CHECKBOX' && tag !== 'RADIO') {
            if (value !== '' && value !== '~') this.addClass(target, 'not_empty');
            else this.removeClass(target, 'not_empty');
        }

        let _SEDE_SELECTED_;
        let _CATEGORY_SELECTED_;
        let _LEVEL_;

        switch (id) {
            case 'txt_tipo_recibo':
                _CURRENT_DATE_TIME_ = this.helpers.getCurrentDate(true);
                const dateInput = this.getEl('txt_fecha');
                if (dateInput) dateInput.value = _CURRENT_DATE_TIME_
                this.fieldGroup.action?.clear();
                this.fieldGroup.action?.disable('all');
                this.fieldGroup.action?.clearAmount?.();
                const _all_fields = document.querySelectorAll('[id^="txt_"]')
                _all_fields.forEach(field => {
                    if (field.classList.contains('autocompleted')) {
                        field.classList.remove('autocompleted');
                    }
                });
                this.resetCodeSelected();
                _IS_REPEATER_ = false;
                if (value !== '~' && value !== '') {
                    this.fieldGroup.action?.enable('inforStudent,tutorContact');
                    const nombreInputLocal = this.getEl('txt_nombre');
                    if (nombreInputLocal) {
                        const datalist = this.getEl(nombreInputLocal.id + '_datalist');
                        if (datalist) datalist.innerHTML = '';
                    }
                    if (value === 'CLG-REINGRESO' && window.CustomAlert) window.CustomAlert.warning('⚠️ Alumnos de reingreso deben realizar examen de nivelación.', 10000);
                    if (value === 'CLG') {
                        window.ListaParaMatricular._displayModal('#modalListaParaMatricular', true)
                        document.getElementById('filtroInput').focus()
                    }
                } else {
                    this.fieldGroup.action?.disable('all');
                }
                break;
            case 'txt_nombre':
                this.fieldGroup.action?.disable('paymentType,code,observations,amount,button');
                if (value !== '') this.fieldGroup.action?.enable('Courses');
                else {
                    this.fieldGroup.action?.disable('Courses');
                }
                if (this.getEl('txt_curso')) this.getEl('txt_curso').value = '~';
                if (this.getEl('txt_categoria')) this.getEl('txt_categoria').value = '~';
                if (this.getEl('txt_nivel')) this.getEl('txt_nivel').value = '~';
                this.resetCodeSelected();
                break;
            case 'txt_curso':
                this.fieldGroup.action?.clearAmount?.();
                this.fieldGroup.action?.clearFields('txt_categoria,txt_nivel');
                this.fieldGroup.action?.disable('paymentType,code,observations,amount,button');
                if (String(value).trim() !== '~') {
                    _SEDE_SELECTED_ = (value || '').substring(4, 7);
                    if (_SEDE_SELECTED_ !== '') {
                        const _CATEGORIES_ = Object.keys(window._DATA_ELI_?.[_SEDE_SELECTED_] || {});
                        const categoriesInput = this.getEl('txt_categoria');
                        if (categoriesInput) {
                            categoriesInput.innerHTML = '';
                            const e = document.createElement('option'); e.value = '~'; e.textContent = ''; categoriesInput.appendChild(e);
                            _CATEGORIES_.forEach((opcion) => { const o = document.createElement('option'); o.value = opcion; o.textContent = opcion.replace('-', ' '); categoriesInput.appendChild(o); });
                        }
                    }
                }
                this.fieldGroup.action?.disable('paymentType');
                break;
            case 'txt_categoria':
                this.fieldGroup.action?.clearAmount?.();
                this.fieldGroup.action?.clearFields('txt_nivel');
                this.fieldGroup.action?.disable('paymentType,code,observations,amount,button');
                if (String(value).trim() !== '~') {
                    _SEDE_SELECTED_ = String(this.getValue(this.getEl('txt_curso'))).substring(4, 7);
                    _CATEGORY_SELECTED_ = String(value).trim();
                    _LEVEL_ = Object.keys(window._DATA_ELI_?.[_SEDE_SELECTED_]?.[_CATEGORY_SELECTED_]?.niveles || {});
                    const levelInput = this.getEl('txt_nivel');
                    if (levelInput) {
                        levelInput.innerHTML = '';
                        const e = document.createElement('option'); e.value = '~'; e.textContent = ''; levelInput.appendChild(e);
                        _LEVEL_.forEach((opcion) => { const o = document.createElement('option'); o.value = opcion; o.textContent = opcion.replace('_', ''); levelInput.appendChild(o); });
                    }
                }
                this.fieldGroup.action?.disable('paymentType');
                break;
            case 'txt_nivel':
                this.fieldGroup.action?.disable('paymentType,code,observations,amount,button'); this.resetCodeSelected();
                this.fieldGroup.action?.clearAmount?.();
                if (String(value).trim() !== '~') this.fieldGroup.action?.enable('paymentType');
                console.log("---txt_nivel value---", value);
                this.setBook();
                break;
            case 'txt_tipo_efectivo':
            case 'txt_tipo_tarjeta':
            case 'txt_deposito_referencia':
            case 'txt_cheque_referencia':
                this.resetCodeSelected(); this.detectType();
                const typeReceipt = this.getValue(this.getEl('txt_tipo_recibo'));
                switch (typeReceipt) {
                    case 'ANT': case 'CURSO-INT-ONLINE': case 'CAN': case 'ABONO': case 'OTROS':
                        this.setDisabled(this.getEl('txt_importe_otros'), false); break;
                    default: break;
                }
                break;
            case 'txt_retencion_1':
            default:
                break;
        }
        this.fieldData.actions.updateRecipt()
    }

    bindCoreEvents() {
        const self = this;  // <-- CORRECCIÓN: se captura la referencia de la instancia

        this.on('keyup', '[id^="txt_"]:not(#txt_importe_otros, #txt_deposito_referencia)', (e) => {
            const isAutocompleted = e.target.classList.contains("autocompleted");
            if (isAutocompleted) {
                return;
            } else {
                this.applyNotEmpty(e.target);
            }
        });
        this.on('keydown', '#txt_deposito_referencia', (e) => {
            e.preventDefault();
            window.ListaParaMatricular._displayModal('#modalDepositos', true);
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
        });

        this.on('paste', '.input-depo', async function (e) {
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
                    thisField.disabled = true;
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
                        thisField.value = "";
                        thisField.readOnly = false;
                        thisField.disabled = false;
                        thisField.classList.remove("not_empty");
                        CustomAlert.error('❌ No puedes ingresar el mismo depósito dos veces en este recibo.', 10000);
                    }
                }
            } else {
                CustomAlert.error('❌ Fila incompleta. Copia la fila completa desde el archivo de depósitos.', 10000);
            }
        });
        this.on("click", ".close-depositos", function () {
            const _fliendDeposits_ = document.querySelectorAll(".input-depo");
            _fliendDeposits_.forEach(field => {
                field.value = "";
                field.disabled = false;
            });
            const dialog = document.querySelector('#modalDepositos');
            window._ALL_DEPOSITS = {};
            const deposito_referencia = document.getElementById("txt_deposito_referencia")
            if (deposito_referencia) {
                deposito_referencia.value = "";
                deposito_referencia.classList.remove("not_empty");
            }
            dialog.style.display = 'none';
            self.detectType();  // <-- CORRECCIÓN: usar self en lugar de this
        });

        this.on("click", ".btn-clear-depo", function () {

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
                    field.classList.remove("not_empty")
                    field.parentNode.classList.add("isBlocked");
                    field.value = "";
                });
                Object.entries(window._ALL_DEPOSITS).forEach(([key, _value_], index) => {
                    const _fliendDeposits_ = document.querySelector("#input-depo-0" + (index + 1));
                    if (_fliendDeposits_) {
                        _fliendDeposits_.value = _value_;
                        _fliendDeposits_.classList.add("not_empty");
                        _fliendDeposits_.parentNode.classList.remove("isBlocked");
                    }
                });
                const totaldepo = document.querySelectorAll("#modalDepositos .not_empty").length;
                console.log("totaldepo:", totaldepo);
                document.querySelector("#input-depo-0" + (totaldepo + 1)).parentNode.classList.remove("isBlocked");
            }
        });

        this.on('keydown', '.input-depo', function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
            }
        });

        this.on("click", ".save-depositos", function () {
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
            self.detectType();  // <-- CORRECCIÓN: usar self
        });

        this.on('click', '#txt_deposito_referencia', () => {
            console.log('clic txt_deposito_referencia');
            window.ListaParaMatricular._displayModal('#modalDepositos', true);
        });
        this.on('change', '[id*="txt_"]:not(.stop_event)', (e) => {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
                return;
            }
            this.applyNotEmpty(e.target);
        });

        this.on('click', 'i.close-modal', () => {
            let modal = document.querySelectorAll('.isModal');
            window._ALL_DEPOSITS = {};
            const _fliendDeposits_ = document.querySelectorAll(".input-depo");
            _fliendDeposits_.forEach(field => {
                field.value = "";
                field.disabled = false;
                field.readOnly = false;
                field.classList.remove("not_empty");
                field.parentNode.classList.add("isBlocked");
            });
            _fliendDeposits_[0].parentNode.classList.remove("isBlocked");

            if (modal) modal.forEach(element => {
                window.ListaParaMatricular._displayModal(`#${element.id} `, false);
            });
        });

        document.addEventListener("keydown", function (e) {
            const ctrlKey = e.ctrlKey;
            const keyPress = e.key.toLowerCase();
            if (ctrlKey && keyPress === "p") {
                e.preventDefault();
                console.log("CTRL + P detectado");
                window.print();
            } else if (ctrlKey && keyPress === "d") {
                console.log("CTRL + D detectado");
                window.ListaParaMatricular._displayModal('#modalDepositos', true);
                e.preventDefault();
            } else if (keyPress === "escape") {
                window.ListaParaMatricular._displayModal('.isModal', false);
                e.preventDefault();
            }
        });
    }

    init() {
        if (typeof Storage !== 'undefined') {
            this._SERIAL_NUMBER_ = localStorage.getItem('serial_number');
            this._LIST_ENROLLMENT_SEDE_ = localStorage.getItem('enrollment_sede');
            if (this._SERIAL_NUMBER_ === null) {
                localStorage.setItem('serial_number', 'I|7000');
                this._SERIAL_NUMBER_ = localStorage.getItem('serial_number');
            }
        }

        this.initFieldGroup();
        this.fieldGroup.action?.disable('all');

        const birthInput = this.getEl('txt_fecha_nacimiento'); if (birthInput) this.maskDate(birthInput);
        const phoneInput = this.getEl('txt_telefono'); if (phoneInput) this.maskPhone(phoneInput);
        const otrosInput = this.getEl('txt_importe_otros'); if (otrosInput) this.maskCurrency(otrosInput);

        const cursoSelect = this.getEl('txt_curso');
        if (cursoSelect) cursoSelect.innerHTML = this.returnCursos();

        const contenedor = document.querySelector('#modalListaParaMatricular #tablaContainer');
        if (contenedor && TablaDinamicaFiltro) {
            window.ListaParaMatricular = new TablaDinamicaFiltro(contenedor, _LIST_ENROLLMENT_AUTOCOMPLETE_, {
                columnaFiltro: 0,
                columnaSede: 2,
                inputNombreSelector: '#filtroInput',
                selectSedeSelector: '#filtroSede'
            });
        }

        this.bindCoreEvents();
        this._callbackButtons();
    }
}

window.EnrollmentAppCore = EnrollmentAppCore;
window.addEventListener('load', () => {
    const app = new EnrollmentAppCore();
    app.init();
    // ✅ Guardamos la instancia para usarla globalmente
    window.enrollmentAppInstance = app;
});