/**
 * CORE UI utilities for enrollment module.
 * Manejo de modales con cierre automático en .close-modal.
 * Soporte completo para múltiples elementos con la misma clase en callbacks.
 */

// ==================== CLASE CORE (Singleton) ====================
class ModalCore {
    constructor() {
        this.modals = new Map();
        this.currentOpen = null;
    }

    _getOrCreateController(element, defaultOptions = {}) {
        if (!this.modals.has(element)) {
            const controller = new ModalController(element, this, defaultOptions);
            this.modals.set(element, { controller, isOpen: false });
        }
        return this.modals.get(element).controller;
    }

    _hideModal(element) {
        const entry = this.modals.get(element);
        if (entry && entry.isOpen) {
            entry.controller._internalHide();
            entry.isOpen = false;
            if (this.currentOpen === element) this.currentOpen = null;
        }
    }

    _hideOthers(exceptElement) {
        for (const [element, entry] of this.modals.entries()) {
            if (element !== exceptElement && entry.isOpen) {
                entry.controller._internalHide();
                entry.isOpen = false;
            }
        }
        this.currentOpen = exceptElement;
    }

    _showModal(element, options = {}) {
        this._hideOthers(element);
        const entry = this.modals.get(element);
        if (entry) {
            entry.controller._removeCustomEventListeners();
            entry.controller._internalShow(options);
            entry.isOpen = true;
            this.currentOpen = element;
        }
    }

    closeAllModals() {
        for (const [element, entry] of this.modals.entries()) {
            if (entry.isOpen) {
                entry.controller._internalHide();
                entry.isOpen = false;
            }
        }
        this.currentOpen = null;
    }
}

// ==================== CONTROLLER POR CADA MODAL ====================
class ModalController {
    constructor(element, core, defaultOptions = {}) {
        this.element = element;
        this.core = core;
        this.defaultOptions = {
            callbacks: defaultOptions.callbacks || {},
            init: defaultOptions.init || null
        };
        this.currentCallbacks = {};
        this.currentInitializers = [];
        this.boundHandlers = new Map(); // clave: "selector|identificador_unico_del_target"
    }

    show(options = {}) {
        const mergedOptions = {
            callbacks: { ...this.defaultOptions.callbacks, ...(options.callbacks || {}) },
            init: options.init !== undefined ? options.init : this.defaultOptions.init
        };
        this.core._showModal(this.element, mergedOptions);
    }

    hide() {
        this.core._hideModal(this.element);
    }

    _internalHide() {
        this.element.style.display = 'none';
        this._removeCustomEventListeners();
        this.currentCallbacks = {};
        this.currentInitializers = [];
        this.element.dispatchEvent(new CustomEvent('modal:closed', { detail: { element: this.element } }));
    }

    _internalShow(options = {}) {
        this.element.style.display = 'flex';
        this.currentCallbacks = options.callbacks || {};
        const init = options.init;
        this.currentInitializers = init
            ? (Array.isArray(init) ? init : [init])
            : [];

        this._attachCustomEventListeners();
        this._runInitializers();

        this.element.dispatchEvent(new CustomEvent('modal:opened', { detail: { element: this.element, options } }));
    }

    _attachCustomEventListeners() {
        const userSelectors = Object.keys(this.currentCallbacks);
        const allSelectors = new Set(userSelectors);
        if (!userSelectors.includes('.close-modal')) {
            allSelectors.add('.close-modal');
        }

        for (const selector of allSelectors) {
            let callback;
            if (selector === '.close-modal' && !this.currentCallbacks['.close-modal']) {
                callback = (event, controller) => {
                    event.stopPropagation();
                    controller.hide();
                };
            } else {
                callback = this.currentCallbacks[selector];
                if (!callback) continue;
            }

            // Obtener TODOS los elementos que coinciden con el selector dentro del modal
            const targets = this.element.querySelectorAll(selector);

            // Para cada elemento, asignar un listener único
            targets.forEach((target, index) => {
                // Crear una clave única para este elemento + selector
                // Usamos una combinación de selector, identificador único del elemento y un índice
                const uniqueId = target.id || target.getAttribute('data-modal-id') ||
                    `${target.tagName}_${target.className}_${index}`;
                const handlerKey = `${selector}|${uniqueId}`;

                // Evitar duplicados (por si acaso)
                if (this.boundHandlers.has(handlerKey)) return;

                const handler = (event) => {
                    event.stopPropagation();
                    callback(event, this);
                };

                target.addEventListener('click', handler);
                this.boundHandlers.set(handlerKey, { element: target, handler });
            });
        }
    }

    _runInitializers() {
        for (const initializer of this.currentInitializers) {
            if (typeof initializer === 'function') {
                initializer();
            }
        }
    }

    _removeCustomEventListeners() {
        for (const [, { element, handler }] of this.boundHandlers.entries()) {
            element.removeEventListener('click', handler);
        }
        this.boundHandlers.clear();
    }

    destroy() {
        this._internalHide();
        this.core.modals.delete(this.element);
    }
}

// ==================== VARIABLES GLOBALES ====================
window._MODAL_ = function (selector, options = {}) {
    const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
    if (!element) {
        console.error(`Modal: no se encontró el elemento con selector "${selector}"`);
        return null;
    }
    if (!window.__modalCore__) {
        window.__modalCore__ = new ModalCore();
    }
    const core = window.__modalCore__;
    return core._getOrCreateController(element, options);
};

window._CLOSE_ALL_MODALS_ = function () {
    if (window.__modalCore__) {
        window.__modalCore__.closeAllModals();
    }
};
class dataList {

    constructor(contenedor, data, options = {}) {
        this.inputFilter = null;
        this.container = contenedor;
        this.data = data || {};
        this.options = options;
        this.selector_filter = options.selector_filter || null;

        if (this.selector_filter) {
            this.container.classList.add('data-list-container');
            this.inputFilter = document.querySelector(this.selector_filter);
        }

        // Inicializar eventos
        this._filterInput();
        this._attachRowClickHandler();  // 👈 único listener para clics en filas
        this._renderTabla();
    }

    // Filtro por input (ya existente)
    _filterInput() {
        if (this.inputFilter) {
            this.inputFilter.addEventListener('input', () => {
                if (this.inputFilter.value !== "") {
                    this.container.style.display = 'block';
                } else {
                    this.container.style.display = 'none';
                }
                this._renderTabla();
            });
        }
    }

    // Método para filtrar datos (aún vacío, puedes implementarlo)
    _filterData() {
        // Aquí tu lógica de filtrado avanzado si la necesitas
    }

    // Renderizado principal de la tabla
    _renderTabla() {
        this.table = this.container.querySelector('table');
        const _JSON_ = this.data ? structuredClone(Array.isArray(this.data) ? this.data : Object.values(this.data)) : [];


        // Filtrar según el input si existe
        const _data_ = this.inputFilter
            ? _JSON_.filter((item) => item[0].toLowerCase().includes(this.inputFilter.value.toLowerCase()))
            : _JSON_;

        // Si no existe la tabla, la creamos desde cero
        if (!this.table) {
            this.container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th rowspan="2">NOMBRE DEL ALUMNO<sup>(Haga clic sobre el nombre para seleccionarlo)</sup></th>
                        <th rowspan="2">SESIÓN</th>
                        <th rowspan="2">SEDE</th>
                        <th colspan="2">NIVEL</th>
                    </tr>
                    <tr>
                        <th>ANTERIOR</th>
                        <th>ACTUAL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6">✨ No se encontraron datos</td>
                    </tr>
                </tbody>
            </table>`;
            this.table = this.container.querySelector('table');
        }

        // Limpiar cuerpo de la tabla
        this.table.tBodies[0].innerHTML = '';

        if (_data_.length > 0) {
            _data_.forEach((element, index) => {
                // Pasamos el índice para poder referenciar el dato original después
                const fila = this._crearFila(element, index);
                this.table.tBodies[0].appendChild(fila);
            });
        } else {
            this.container.style.display = 'none';
        }

        // Guardamos los datos actuales para usarlos en el evento click (opcional)
        this.currentData = _data_;
    }

    // Crear una fila a partir de un array de celdas
    _crearFila(data, index) {
        const tr = document.createElement('tr');
        // Guardamos el índice como atributo data para recuperar el objeto original al hacer clic
        tr.setAttribute('data-row-index', index);

        data.forEach(element => {
            const td = document.createElement('td');
            const texto = element.replace("DESERSIÓN", "REPITE").replace("PENDIENTE EXAM.", "PENDIENTE");
            if (texto.includes('REPITE')) {
                td.classList.add('repite');
            } else if (texto.includes('PENDIENTE')) {
                td.classList.add('pendiente');
            }
            td.textContent = texto;
            tr.appendChild(td);
        });
        return tr;
    }

    _SetAutoComplete(selector, value) {



        const field = document.getElementById(selector);
        if (!field) return;
        field.value = value;

        if (value !== "") {
            if (!field.classList.contains('autocompleted')) {
                field.classList.add("autocompleted");
                field.classList.add("not_empty");

            } else {
                field.classList.remove("autocompleted");
                field.classList.remove("not_empty");

            }

        }


        window.enrollmentAppInstance.applyNotEmpty(field);



        if (field instanceof HTMLSelectElement) {
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (value !== "") {
            if (field.classList.contains('autocompleted')) {

                field.readOnly = true;
                field.disabled = true;
            } else {

                field.readOnly = false;
                field.disabled = false;
            }

        }




    }
    // Manejador de clics mediante delegación (se añade UNA SOLA WEZ)
    _attachRowClickHandler() {
        // El evento se captura en el contenedor principal (nunca se destruye)
        this.container.addEventListener('click', (event) => {
            // Buscar el elemento <tr> más cercano (puede que el clic esté en un <td> o <span>)
            const targetRow = event.target.closest('tr');
            if (!targetRow) return;

            // Evitar que se dispare si el clic fue en la cabecera (thead)
            if (targetRow.parentElement?.parentElement?.tagName === 'THEAD') return;

            // Obtener el índice de la fila (si se guardó)
            const rowIndex = targetRow.getAttribute('data-row-index');

            // Obtener los datos de la fila en formato array de textos
            const rowData = Array.from(targetRow.cells).map(td => td.textContent);

            if (String(rowData[2]).trim() !== window._SEDE_GLOBAL.id) {
                window.modalCambioDeSucursal.show({
                    callbacks: {
                        'close-modal': (event, modalController) => {
                            modalController.hide();
                            window.enrollmentAppInstance.setSelectorValue("#txt_tipo_recibo", "~");
                        },
                        '.cancel': (event, modalController) => {
                            modalController.hide();
                            window.enrollmentAppInstance.setSelectorValue("#txt_tipo_recibo", "~")
                        },
                        '.ok': (event, modalController) => {

                            const txt_new_sesion = document.querySelector("#txt_new_sesion").value;
                            if (String(txt_new_sesion).trim() !== '~') {
                                window.ListaParaMatricular._SetAutoComplete("txt_curso", txt_new_sesion);
                                const _new_value_cat = (((((String(((rowData[2] === 'REPITE') ? rowData[3] : rowData[4]).split("-")[0]).trim()).replace("ES", "EARLY-SUCCESS")).replace("CP", "CHILDREN PROGRAM")).replace("ADUL", "ADULTO")).replace("ADOL", "ADOLESCENTE")).toUpperCase();
                                const _new_value_level = "_" + String(parseInt(((rowData[2] === 'REPITE') ? rowData[3] : rowData[4]).split("-")[1])).trim();
                                window.ListaParaMatricular._SetAutoComplete("txt_categoria", _new_value_cat);
                                window.ListaParaMatricular._SetAutoComplete("txt_nivel", _new_value_level);
                                modalController.hide();
                            } else {
                                window.CustomAlert.warning(
                                    "⚠️ Debe seleccionar una sesión",
                                    "error",
                                    5000
                                )
                            }



                        }
                    },
                    init: () => {
                        const element = document.querySelector("#txt_new_sesion");
                        if (!element) return;
                        element.innerHTML = window.enrollmentAppInstance.returnCursos();

                        const _new_value_cat = (((((String(((rowData[2] === 'REPITE') ? rowData[3] : rowData[4]).split("-")[0]).trim()).replace("ES", "EARLY-SUCCESS")).replace("CP", "CHILDREN PROGRAM")).replace("ADUL", "ADULTO")).replace("ADOL", "ADOLESCENTE")).toUpperCase();
                        const _new_value_level = "_" + String(parseInt(((rowData[2] === 'REPITE') ? rowData[3] : rowData[4]).split("-")[1])).trim();

                        window.enrollmentAppInstance.setSelectorValue("#txt_new_categoria", _new_value_cat)
                        window.enrollmentAppInstance.setSelectorValue("#txt_new_nivel", _new_value_level);


                    }
                });
            }

            // Obtener el objeto original completo si tenemos currentData y el índice
            let originalData = null;
            if (rowIndex !== null && this.currentData && this.currentData[rowIndex]) {
                originalData = this.currentData[rowIndex];
            }

            // Llamar al callback personalizado si se proporcionó en options
            if (typeof this.options.onRowClick === 'function') {
                this.options.onRowClick({
                    rowData: rowData,
                    originalData: originalData,
                    rowElement: targetRow,
                    originalEvent: event,
                    rowIndex: rowIndex
                });
            }

            // También despachar un evento personalizado para mayor flexibilidad
            this.container.dispatchEvent(new CustomEvent('rowclick', {
                detail: {
                    rowData: rowData,
                    originalData: originalData,
                    rowElement: targetRow,
                    originalEvent: event,
                    rowIndex: rowIndex
                }
            }));

            const info = {
                rowData: rowData,
                originalData: originalData,
                rowElement: targetRow,
                originalEvent: event,
                rowIndex: rowIndex
            };
            if (String(info.rowData[4]).trim().toUpperCase() === "PENDIENTE") {
                window.CustomAlert.warning('⚠️ Debe de esperar el resultado del examen, para continuar el proceso.', 10000);
                this.container.style.display = 'none';
                // this._SetAutoComplete("txt_nombre", "");
                window.enrollmentAppInstance.setSelectorValue("#txt_tipo_recibo", "~")
                return;
            }

            const nombre = info.rowData[0];
            const sesion = info.rowData[1];
            const sede = info.rowData[2];

            const currentLevel = (info.rowData[4].toUpperCase() !== "REPITE") ? info.rowData[4] : info.rowData[3];
            const nivel = "_" + String(parseInt(currentLevel.split("-")[1].trim()));

            _IS_REPEATER_ = false;
            if (info.rowData[4].toUpperCase() === "REPITE") {
                _IS_REPEATER_ = true;
            }

            const categoria = (((((currentLevel.split("-")[0].trim()).replace("ES", "EARLY-SUCCESS")).replace("CP", "CHILDREN PROGRAM")).replace("ADUL", "ADULTO")).replace("ADOL", "ADOLESCENTE")).toUpperCase();

            console.log("info", JSON.stringify(info, null, 2))
            this._SetAutoComplete("txt_nombre", nombre);
            this._SetAutoComplete("txt_curso", sesion);
            this._SetAutoComplete("txt_categoria", categoria);
            this._SetAutoComplete("txt_nivel", nivel);

            //console.log("---", sesion, "---", categoria, "---", nivel);
            this.container.style.display = 'none';

            const field_code_3 = document.getElementById("txt_code_3");
            if (field_code_3 && _IS_REPEATER_) {
                field_code_3.value = "200-RP";

                document.querySelectorAll(".print_observaciones .valor").forEach(element => {
                    element.textContent = "200-RP";
                });
            }
        });
    }
}

class CustomAlert {
    static #container = null;
    static #defaultDuration = 5500;
    constructor(options = {}) {
        this.defaultDuration = options.duration || CustomAlert.#defaultDuration;
    }
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

var _IS_REPEATER_ = false;
let _CURRENT_DATE_TIME_ = "";
window._IS_ENROLLMENT_ =
    function () {
        return ["CLG", "CLG-NUEVO", "CLG-REINGRESO"].includes(document.getElementById('txt_tipo_recibo').value.toUpperCase());
    };
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

    setSelectorValue(selector, valor) {
        const elemento = document.querySelectorAll(selector);
        if (elemento) {
            elemento.forEach(el => {
                el.value = valor;
                el.dispatchEvent(new Event('change', { bubbles: true }));
            })
        }
    }

    numeroALetras(num) {

        const Unidades = function (num) {
            switch (num) {
                case 1: return "UN"; case 2: return "DOS"; case 3: return "TRES";
                case 4: return "CUATRO"; case 5: return "CINCO"; case 6: return "SEIS";
                case 7: return "SIETE"; case 8: return "OCHO"; case 9: return "NUEVE";
                default: return "";
            }
        }
        const Decenas = function (num) {
            let decena = Math.floor(num / 10);
            let unidad = num - (decena * 10);
            switch (decena) {
                case 1:
                    switch (unidad) {
                        case 0: return " DIEZ"; case 1: return " ONCE"; case 2: return " DOCE";
                        case 3: return " TRECE"; case 4: return " CATORCE"; case 5: return " QUINCE";
                        default: return " DIECI" + Unidades(unidad);
                    }
                case 2:
                    if (unidad === 0) return " VEINTE";
                    return " VEINTI" + Unidades(unidad).trim();
                case 3: return DecenasY("TREINTA", unidad);
                case 4: return DecenasY("CUARENTA", unidad);
                case 5: return DecenasY("CINCUENTA", unidad);
                case 6: return DecenasY("SESENTA", unidad);
                case 7: return DecenasY("SETENTA", unidad);
                case 8: return DecenasY("OCHENTA", unidad);
                case 9: return DecenasY("NOVENTA", unidad);
                default: return Unidades(unidad);
            }
        }
        const DecenasY = function (strSin, numUnidades) {
            return numUnidades > 0 ? strSin + " Y " + Unidades(numUnidades) : strSin;
        }
        const Centenas = function (num) {
            let centenas = Math.floor(num / 100);
            let decenas = num - (centenas * 100);
            switch (centenas) {
                case 1: return decenas > 0 ? " CIENTO " + Decenas(decenas) : " CIEN ";
                case 2: return " DOSCIENTOS " + Decenas(decenas);
                case 3: return " TRESCIENTOS " + Decenas(decenas);
                case 4: return " CUATROCIENTOS " + Decenas(decenas);
                case 5: return " QUINIENTOS " + Decenas(decenas);
                case 6: return " SEISCIENTOS " + Decenas(decenas);
                case 7: return " SETECIENTOS " + Decenas(decenas);
                case 8: return " OCHOCIENTOS " + Decenas(decenas);
                case 9: return " NOVECIENTOS " + Decenas(decenas);
                default: return Decenas(decenas);
            }
        }
        const Seccion = function (num, divisor, strSingular, strPlural) {
            let cientos = Math.floor(num / divisor);
            let resto = num - (cientos * divisor);
            let letras = "";
            if (cientos > 0) {
                letras = (cientos > 1) ? Centenas(cientos) + strPlural : strSingular;
            }
            if (resto > 0) letras += "";
            return letras;
        }
        const Miles = function (num) {
            let divisor = 1000;
            let strMiles = Seccion(num, divisor, "UN MIL ", " MIL ");
            let strCentenas = Centenas(num - (Math.floor(num / divisor) * divisor));
            return strMiles === "" ? strCentenas : strMiles + strCentenas;
        }
        const Millones = function (num) {
            let divisor = 1000000;
            let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
            let strMiles = Miles(num - (Math.floor(num / divisor) * divisor));
            return strMillones === "" ? strMiles : strMillones + strMiles;
        }


        let data = {
            enteros: Math.floor(num),
            centavos: Math.round((num - Math.floor(num)) * 100),
            letrasMonedaPlural: 'CÓRDOBAS',
            letrasMonedaSingular: 'CÓRDOBA'
        };
        let letrasCentavos = data.centavos > 0 ? "CON " + data.centavos + "/100" : "";
        if (data.enteros === 0) return " CERO " + data.letrasMonedaPlural + " " + letrasCentavos;
        if (data.enteros === 1) return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + letrasCentavos;
        return "TOTAL EN LETRA: " + (Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + letrasCentavos).trim().replace("  ", ' ');


    }
    /*numeroALetras(num) {
       
        
       
    }*/

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
                        window.enrollmentAppInstance.setSelectorValue("#txt_tipo_recibo", "~")

                        break;
                    case 'telepagos':
                        window.modalTelepagos.show();
                        break;
                    case 'clear-all':
                        window.enrollmentAppInstance.setSelectorValue("#txt_tipo_recibo", "~")
                        window._ALL_DEPOSITS = {};
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

    /*  currentDate(type = false) {
          const d = new Date(); const dd = String(d.getDate()).padStart(2, '0'); const mm = String(d.getMonth() + 1).padStart(2, '0'); const yyyy = d.getFullYear();
          if (type === 'html') return `<div class="date-label">DÍA / MES / AÑO</div><div class="valor">${dd} / ${mm} / ${yyyy}</div>`;
          return `${mm}/${dd}/${yyyy}`;
      }
  */
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
                                el.parentNode.parentNode.classList.remove("withuot-book")
                                if (_value_ === "---") {
                                    el.parentNode.parentNode.classList.add("withuot-book")
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
                            el.innerHTML = `${window._SEDE_GLOBAL.label}`
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
                        if (window._IS_ENROLLMENT_() || String(document.querySelector("#txt_tipo_recibo").value || "").trim() === "LBR") {

                            self.setBook();
                        }
                    },
                    get value() {
                        let nombre_libro = String(Array.from(this.screen).map((el) => el.value).join(' ').toUpperCase() || '').trim();
                        if (nombre_libro === "") {
                            //((nombre_libro.parentNode).parentNode).classList.add("withuot-book")
                            nombre_libro = "---"//(window._IS_ENROLLMENT_() ? "NO SE REQUIERE LA COMPRA DE LIBRO" : "──────────────────────");
                        }
                        return nombre_libro;
                    }
                },
                Obserbaciones: {
                    print: document.querySelectorAll('.print_observaciones .valor'),
                    get value() {

                        const _is_empty_obserbations_ = function (str) {
                            return ((str !== "") ? "<br>" : "")
                        }
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
                            _obserbaciones_ += _is_empty_obserbations_(_obserbaciones_) + txt_code_2 + " " + txt_code_value_2;
                        }
                        if (txt_code_3 !== "") {
                            _obserbaciones_ += _is_empty_obserbations_(_obserbaciones_) + txt_code_3 + " " + txt_code_value_3;
                        }
                        if (txt_retencion_1 && !txt_retencion_2) {
                            _obserbaciones_ += _is_empty_obserbations_(_obserbaciones_) + 'Se aplicó retención: 1%';
                        } else if (!txt_retencion_1 && txt_retencion_2) {
                            _obserbaciones_ += _is_empty_obserbations_(_obserbaciones_) + 'Se aplicó retención: 2%';
                        } else if (txt_retencion_1 && txt_retencion_2) {
                            _obserbaciones_ += _is_empty_obserbations_(_obserbaciones_) + 'Se aplicó retención: 3%';
                        }



                        const _typeReceipt = self.getValue(self.getEl("txt_tipo_recibo"));


                        if (_typeReceipt.trim() === "LBR") {
                            _obserbaciones_ += _is_empty_obserbations_(_obserbaciones_) + 'COMPRA DE LIBRO QUE USARÁ EN NIVEL';
                        }
                        if (window._STATIC_PRICES_[_typeReceipt.trim()]) {
                            _obserbaciones_ += _is_empty_obserbations_(_obserbaciones_) + window._STATIC_PRICES_[_typeReceipt.trim()].label;
                        }


                        const _otros_obserbaciones_ = self.getValue(self.getEl("txt_otras_observaciones"));
                        if (_otros_obserbaciones_.trim() !== "") {
                            _obserbaciones_ += _is_empty_obserbations_(_obserbaciones_) + _otros_obserbaciones_;
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

                        const import_print = f.print;
                        const txt_tipo_recibo = document.getElementById("txt_tipo_recibo").value;






                        import_print.forEach((el) => {
                            if (txt_tipo_recibo === "ANT" && el.parentNode.classList.contains("print_otros")) {
                                console.log(txt_tipo_recibo, " parent-class:", JSON.stringify(el.parentNode.classList))
                                const tituloAnterior = el.previousElementSibling;
                                tituloAnterior.innerText = "ANTICIPO: ";
                            }

                            el.parentNode.classList.add('hidden');

                        });

                    });
                },
                updateAmount: () => {
                    this.allAmounts.Total = (parseFloat(this.allAmounts.Colegiatura) + parseFloat(this.allAmounts.Descuento)) + (parseFloat(this.allAmounts.Libro) + parseFloat(this.allAmounts.Otros));


                    this.allAmounts.Retencion = -(parseFloat((this.allAmounts.Total * this.allAmounts.Retencion).toFixed(2)));
                    //if (this.allAmounts.Retencion > 0)
                    this.allAmounts.Total += this.allAmounts.Retencion;

                    const cantidad = this.numeroALetras(this.allAmounts.Total)
                    console.log("CANTIDAD: ", cantidad);

                    const elCantidad = document.querySelectorAll('.importe-letras');

                    elCantidad.forEach(el => el.innerHTML = cantidad);

                    Object.keys(this.fieldData.Amount).forEach((key) => {
                        const value = asCurrency(this.allAmounts[key] || 0);
                        const f = this.fieldData.Amount[key];
                        if (f?.screen) f.screen.value = value;
                        if (f?.print) f.print.forEach((el) => {


                            el.innerHTML = "C$ " + value;
                            if (value !== "0.00") {
                                el.parentNode.classList.remove('hidden');
                            } else {
                                el.parentNode.classList.add('hidden');
                            }
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
    disableSelectedCode(opcion = {}) {
        let {
            disabled = true,
            value = "~",
            selector = null
        } = opcion;
        //console.log(selector.id, "...", value);
        selector.value = value;
        selector.disabled = disabled;
        selector.readOnly = disabled;
        selector.parentElement && selector.parentElement.classList.toggle('txt_disable', disabled);
    }
    detectType() {

        const ef = this.getEl('txt_tipo_efectivo')?.checked;
        const tj = this.getEl('txt_tipo_tarjeta')?.checked;
        const tlp = this.getEl('txt_tipo_telepago')?.checked;
        const dep = String(this.getValue(this.getEl('txt_deposito_referencia'))).trim() !== '';
        const chq = String(this.getValue(this.getEl('txt_cheque_referencia'))).trim() !== '';

        // console.clear();
        //console.log(tj, "||", tlp)
        if ((ef || tj || dep || chq || tlp) && window._IS_ENROLLMENT_()) {


            this.fieldGroup.action?.enable('code,observations,button,printButton');
            this.resetCodeSelected({ disabled: false });

            if (tj || tlp) {

                this.disableSelectedCode(
                    {
                        disabled: true,
                        value: "~",
                        selector: this.getEl('txt_code_1')
                    }

                );
                this.disableSelectedCode({
                    disabled: true,
                    value: "",
                    selector: this.getEl('txt_code_value_1')
                });

                this.disableSelectedCode(
                    {
                        disabled: true,
                        value: "~",
                        selector: this.getEl('txt_code_2')
                    }

                );
                this.disableSelectedCode({
                    disabled: true,
                    value: "",
                    selector: this.getEl('txt_code_value_2')
                });

                /*
                if (tlp) {
                    this.disableSelectedCode(this.getEl('txt_code_3'));
                    this.disableSelectedCode(this.getEl('txt_code_value_3', ""));
                } else {
                    this.disableSelectedCode(this.getEl('txt_code_3'), false);
                    this.disableSelectedCode(this.getEl('txt_code_3', false, ""));
                }*/
            }
        } else {

            this.resetCodeSelected();
            this.fieldGroup.action?.enable('observations,printButton');
        }

    }

    setBook(options = {}) {
        let { clear = false,
            curso = String(this.safeGet('txt_curso') ?? ''),
            sede = String(this.safeGet('txt_curso') ?? '').trim().substring(4, 7),
            categoria = String(this.safeGet('txt_categoria') ?? '').trim(),
            nivel = String(this.safeGet('txt_nivel') ?? '').trim()
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
            document.querySelectorAll(".print_nombre_libro .valor").forEach((el) => {
                el.innerText = NombreLibro;
                if (NombreLibro === "" || NombreLibro === "---") {
                    el.parentNode.parentNode.classList.add("withuot-book")
                } else {
                    el.parentNode.parentNode.classList.remove("withuot-book")
                }
            });
        } else {
            const preview = this.getEl('preview-image');
            if (preview) preview.classList.remove('show');
            if (imgthumb) imgthumb.remove();
            if (imgzoom) imgzoom.remove();
        }

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
            case 'ANT':
            case 'CURSO-INT-ONLINE':
            case 'CAN':
            case 'ABONO':
            case 'OTROS':
                this.allAmounts.Colegiatura = 0;
                this.allAmounts.Libro = 0;
                this.allAmounts.Descuento = 0;
                break;

            default:
                if (window._STATIC_PRICES_[txtTipoRecibo]) {
                    this.allAmounts.Colegiatura = 0;
                    this.allAmounts.Libro = 0;
                    this.allAmounts.Descuento = 0;
                    this.allAmounts.Otros = window._STATIC_PRICES_[txtTipoRecibo.trim()].price;
                    // _obserbaciones_ += _is_empty_obserbations_(_obserbaciones_) + window._STATIC_PRICES_[txtTipoRecibo.trim()].label;
                }
                break;
        }
        let discount = 0;
        const r1 = !!this.safeGet('txt_retencion_1');
        const r2 = !!this.safeGet('txt_retencion_2');
        this.allAmounts.Retencion = r1 && r2 ? 0.03 : r1 ? 0.01 : r2 ? 0.02 : 0;



        if (window._IS_ENROLLMENT_()) {
            if (txt_code_3 === '305-TR' && sede === 'EST') discount += 0.1;
            if (!this.isEmptyValue(txt_code_1)) discount = (parseInt(String(txt_code_1).substring(0, 3), 10) || 0) / 100;
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


        } else {

            if (['ANT', 'CURSO-INT-ONLINE', 'CAN', 'ABONO'].includes(txtTipoRecibo)) {
                //this.allAmounts.Otros = 0;

                this.allAmounts.Otros = this.getValue(this.getEl('txt_importe_otros'));

            }


        }




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

                const positions = [
                    "center center",
                    "right top",
                    "right center",
                    "right bottom",
                    "left top",
                    "left center",
                    "left bottom",
                ];
                const selectedPosition = positions[Math.floor(Math.random() * positions.length)];
                const selectPattern = Math.floor(Math.random() * 3)
                document.querySelectorAll('.custom-pattern').forEach(el => {
                    el.style.backgroundPosition = selectedPosition;
                    el.classList.remove('pattern1');
                    el.classList.remove('pattern2');
                    el.classList.remove('pattern3');
                    el.classList.add('pattern' + (selectPattern + 1))

                });


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

                } else {
                    this.fieldGroup.action?.disable('all');
                }
                break;
            case 'txt_nombre':
                this.fieldGroup.action?.disable('paymentType,code,observations,amount,button');
                if (value !== '') {

                    this.fieldGroup.action?.enable('Courses');
                }
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

                if (window._IS_ENROLLMENT_()) {

                    this.setBook();
                }
                break;
            case 'txt_tipo_efectivo':
            case 'txt_tipo_tarjeta':
            case 'txt_tipo_telepago':
            case 'txt_deposito_referencia':
            case 'txt_cheque_referencia':
                this.resetCodeSelected();
                this.detectType();
                const typeReceipt = this.getValue(this.getEl('txt_tipo_recibo'));


                switch (typeReceipt) {
                    case 'ANT': case 'CURSO-INT-ONLINE': case 'CAN': case 'ABONO': case 'OTROS':
                        this.setDisabled(this.getEl('txt_importe_otros'), false); break;
                    default: break;
                }
                break;


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
            window.modalDepositos.show();
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
        /*this.on("click", ".close-depositos-clear", function () {
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
        });*/

        /* this.on("click", ".btn-clear-depo", function () {
 
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
 
                 document.querySelector("#input-depo-0" + (totaldepo + 1)).parentNode.classList.remove("isBlocked");
             }
         });*/

        this.on('keydown', '.input-depo', function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
            }
        });

        /* this.on("click", ".save-depositos", function () {
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
             self.detectType();
             // <-- CORRECCIÓN: usar self
         });*/

        this.on('click', '#txt_deposito_referencia', () => {



            window.modalDepositos.show()


        });
        this.on('change', '[id*="txt_"]:not(.stop_event)', (e) => {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
                return;
            }

            this.applyNotEmpty(e.target);
        });


        document.addEventListener('contextmenu', function (event) {
            if (document.body.classList.contains("isDevMode")) return;
            event.preventDefault();

            return false;
        });

        document.addEventListener("keydown", function (event) {
            console.log(document.body.classList)
            if (!document.body.classList.contains("isDevMode")) {// Ctrl+Shift+I (Windows/Linux)
                // En Mac: Ctrl+Shift+I también funciona, pero la combinación nativa es Cmd+Option+I
                // Detectamos ambas para mayor cobertura
                const isCtrlShiftI = event.ctrlKey && event.shiftKey && ((event.key).toLowerCase() === 'i');

                const isCtrlShiftP = event.ctrlKey && event.shiftKey && ((event.key).toLowerCase() === 'p');
                // También detectar F12 (herramientas de desarrollo en muchos navegadores)
                const isF12 = event.key === 'F12';

                // Ctrl+Shift+J (consola)
                const isCtrlShiftJ = event.ctrlKey && event.shiftKey && ((event.key).toLowerCase() === 'j');

                // Ctrl+U (ver código fuente)
                const isCtrlU = event.ctrlKey && ((event.key).toLowerCase() === 'u');

                // Para Mac: Cmd+Option+I (equivalente a Ctrl+Shift+I)
                const isMacDevTools = event.metaKey && event.altKey && ((event.key).toLowerCase() === 'i');

                if (isCtrlShiftI || isF12 || isCtrlShiftJ || isCtrlU || isMacDevTools || isCtrlShiftP) {
                    event.preventDefault();

                    // Opcional: también puedes limpiar la consola o redirigir
                    //console.clear(); // Intenta limpiar la consola (no siempre funciona)
                    return false;
                }
            }


            const ctrlKey = event.ctrlKey;
            const keyPress = event.key.toLowerCase();
            if (ctrlKey && keyPress === "p") {
                event.preventDefault();
                console.log("CTRL + P detectado");
                window.print();
            } else if (ctrlKey && keyPress === "d") {
                console.log("CTRL + D detectado");

                modalDepositos.show();
                event.preventDefault();
            } else if (keyPress === "escape") {

                window._CLOSE_ALL_MODALS_();
                const dataList = document.querySelectorAll(".data-list-container");
                dataList.forEach(element => {
                    element.style.display = "none";
                });

                event.preventDefault();
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

        //const contenedor = document.querySelector('#modalListaParaMatricular #tablaContainer');

        /*if (contenedor && TablaDinamicaFiltro) {
            window.ListaParaMatricular = new TablaDinamicaFiltro(contenedor, _LIST_ENROLLMENT_AUTOCOMPLETE_, {
                columnaFiltro: 0,
                columnaSede: 2,
                inputNombreSelector: '#filtroInput',
                selectSedeSelector: '#filtroSede'
            });
        }*/
        const contenedor = document.querySelector('#list-student');
        window.ListaParaMatricular = new dataList(contenedor, _LIST_ENROLLMENT_AUTOCOMPLETE_, {
            selector_filter: '#txt_nombre'

        });

        this.bindCoreEvents();
        this._callbackButtons();
    }
}

function LoadScroll() {
    // Elementos del DOM
    const panel = document.getElementById('slidingPanel');

    const screen = document.querySelector('.screen');





    // Estado interno: si el panel está visible o no
    let isPanelVisible = false;

    // Variable para almacenar la posición previa del scroll (detección de dirección)
    let lastScrollY = window.scrollY;

    // Umbral mínimo de desplazamiento para evitar cambios muy bruscos? 
    // Por suavidad y precisión, usamos el cambio de dirección directamente.
    // No se necesita umbral porque la experiencia es natural.

    // Función para mostrar el panel (si no está visible)
    function showPanel() {
        if (!isPanelVisible) {
            panel.classList.add('visible');
            screen.classList.add('shadow');
            isPanelVisible = true;


        }
    }

    // Función para ocultar el panel (si está visible)
    function hidePanel() {
        if (isPanelVisible) {
            panel.classList.remove('visible');
            screen.classList.remove('shadow');
            isPanelVisible = false;

        }
    }

    // Detección del evento scroll → dirección y toggle
    function handleScroll() {
        const currentScrollY = window.scrollY;
        // Diferencia para determinar dirección (positivo = scroll hacia abajo, negativo = hacia arriba)
        const delta = currentScrollY - lastScrollY;

        // Evitar acciones si el delta es cero (no hubo movimiento real)
        if (delta === 0) {
            // Actualizamos lastScrollY por si acaso, pero no cambiamos estado
            lastScrollY = currentScrollY;
            return;
        }

        if (delta > 0) {
            // SCROLL HACIA ABAJO: debe aparecer el segundo div (si no está visible)
            if (!isPanelVisible) {
                showPanel();
            }
        }
        else if (delta < 0) {
            // SCROLL HACIA ARRIBA: debe desaparecer el segundo div
            if (isPanelVisible) {
                hidePanel();
            }
        }

        // Actualizar última posición para la siguiente iteración
        lastScrollY = currentScrollY;
    }

    // Evento scroll con optimización pasiva para mejor rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Interacción adicional: Botón de cerrar panel manualmente ---
    const closeBtn = document.getElementById('closePanelBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Si el panel está visible, lo ocultamos manualmente
            if (isPanelVisible) {
                hidePanel();

            }
        });
    }

    // Botón "Más info" solo muestra un mensaje de demo (no afecta el comportamiento scroll)
    const infoBtn = document.getElementById('fakeActionBtn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            alert('📘 Panel interactivo: Aparece/desaparece con el scroll. Prueba a hacer scroll hacia arriba/abajo.');
        });
    }

    // Asegurar estado inicial correcto: el panel debe estar oculto al cargar la página (sin clase visible)
    // Pero por si algún caso extraño de que el scrollY inicial sea > 0, sincronizamos.
    // Esto previene que si la página se recarga con scrollY >0, el panel se muestre inesperadamente.
    // Forzamos a que al inicio el panel esté siempre oculto, independientemente del scrollY.
    // Ya que al cargar la clase no existe 'visible', y isPanelVisible = false. Perfecto.
    // Sin embargo si por casualidad el usuario recargó con scrollY!=0, debemos forzar oculto visual y estado.
    // Además, actualizamos lastScrollY con el scroll real.
    const initScroll = window.scrollY;
    lastScrollY = initScroll;
    // Garantizar que el panel no está visible al inicio (clase removida)
    if (panel.classList.contains('visible')) {
        panel.classList.remove('visible');
        screen.classList.remove('shadow');
    }
    isPanelVisible = false;


    console.log('✅ Efecto de scroll listo: Panel aparece desde abajo al scroll down, desaparece al scroll up.');

    // Por si es necesario resetear en dispositivos táctiles: todo funciona.
    // })();
}

window.addEventListener('load', () => {
    const app = new EnrollmentAppCore();
    app.init();
    // ✅ Guardamos la instancia para usarla globalmente
    window.enrollmentAppInstance = app;


    modalDepositos = window._MODAL_('#modalDepositos', {
        init: {
            'load_sessions': () => {
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
                        console.log("MODAL DEPO", key, _value_, index);
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
            }
        },
        callbacks: {
            '.save-depositos': (event, modalController) => {

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
                window.enrollmentAppInstance.detectType();
                // <-- CORRECCIÓN: usar self

            },
            '.btn-clear-depo': (event, modalController) => {
                if ((event.target).parentNode.getAttribute("class").includes("isBlocked")) return false;
                const input = (event.target).parentNode.querySelector('.input-depo')
                console.log("INPUT", (event.target))
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
                        const _fliendDepositsNext_ = document.querySelector("#input-depo-0" + (index + 2))
                        if (_fliendDepositsNext_) {
                            _fliendDepositsNext_.parentNode.classList.remove("isBlocked")
                        }
                    });
                    const totaldepo = document.querySelectorAll("#modalDepositos .not_empty").length;

                    document.querySelector("#input-depo-0" + (totaldepo + 1)).parentNode.classList.remove("isBlocked");
                }
            },
            'close-depositos-clear': (event, modalController) => {

                const _fliendDeposits_ = document.querySelectorAll(".input-depo");
                _fliendDeposits_.forEach(field => {
                    field.value = "";
                    field.disabled = false;
                });

                window._ALL_DEPOSITS = {};
                const deposito_referencia = document.getElementById("txt_deposito_referencia")
                if (deposito_referencia) {
                    deposito_referencia.value = "";
                    deposito_referencia.classList.remove("not_empty");
                }
                modalController.hide();
                self.detectType();  // <-- CORRECCIÓN: usar self en lugar de this



            }
        }
    });

    modalTelepagos = window._MODAL_('#modalTelepagos'
        , {
            init: () => {
                const element = document.querySelector("#txt_telepago_sesion");
                if (!element) return;
                element.innerHTML = window.enrollmentAppInstance.returnCursos();



            }
        })

    modalCambioDeSucursal = window._MODAL_('#modalCambioDeSucursal'
    );



    LoadScroll();
});