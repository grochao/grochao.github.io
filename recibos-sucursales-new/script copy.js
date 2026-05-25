

// ==================== VARIABLES GLOBALES ====================
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
var _TC_ = 36.6243;
var SAVE_PRINT = true;
var _DATA_ = null;
var _PAGE_ = '';

// ==================== FUNCIONES AUXILIARES NATIVAS ====================
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
    el.disabled = disabled;
    if (disabled) {
        addClass(el, "txt_disable");
        if (el.getAttribute("id") !== "txt_tipo_recibo") {
            if (el.tagName === 'SELECT') el.value = "";
            else if (el.type === 'checkbox') el.checked = false;
            else el.value = "";
        }
    }
    else {
        removeClass(el, "txt_disable");
    }
}
function getValue(el) { return el ? el.value : ''; }
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
    document.getElementById("preview-image").classList.remove("show");

}
// Máscaras
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

// SetupAutocomplete mejorado: evita reconstrucción después de selección
let _skipAutocomplete = false;
function setupAutocomplete(input, sourceFn) {
    const datalistId = input.id + '_datalist';
    let datalist = getEl(datalistId);
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = datalistId;
        input.setAttribute('list', datalistId);
        input.parentNode.appendChild(datalist);
    }
    input.addEventListener('input', function () {
        // Si estamos en el período de omisión después de una selección, no reconstruir
        if (_skipAutocomplete) {
            _skipAutocomplete = false;
            return;
        }
        const val = this.value.toLowerCase();
        const items = sourceFn();
        datalist.innerHTML = '';
        items.forEach(item => {
            if (item.toLowerCase().includes(val)) {
                const option = document.createElement('option');
                option.value = item;
                datalist.appendChild(option);
            }
        });
    });
}

// ==================== HELPERS CON NÚMEROS A LETRAS INTEGRADO ====================
var _HELPERS_ = {
    numeroALetras: {
        Unidades: function (num) {
            switch (num) {
                case 1: return "UN"; case 2: return "DOS"; case 3: return "TRES";
                case 4: return "CUATRO"; case 5: return "CINCO"; case 6: return "SEIS";
                case 7: return "SIETE"; case 8: return "OCHO"; case 9: return "NUEVE";
                default: return "";
            }
        },
        Decenas: function (num) {
            let decena = Math.floor(num / 10);
            let unidad = num - (decena * 10);
            switch (decena) {
                case 1:
                    switch (unidad) {
                        case 0: return " DIEZ"; case 1: return " ONCE"; case 2: return " DOCE";
                        case 3: return " TRECE"; case 4: return " CATORCE"; case 5: return " QUINCE";
                        default: return " DIECI" + this.Unidades(unidad);
                    }
                case 2:
                    if (unidad === 0) return " VEINTE";
                    return " VEINTI" + this.Unidades(unidad).trim();
                case 3: return this.DecenasY("TREINTA", unidad);
                case 4: return this.DecenasY("CUARENTA", unidad);
                case 5: return this.DecenasY("CINCUENTA", unidad);
                case 6: return this.DecenasY("SESENTA", unidad);
                case 7: return this.DecenasY("SETENTA", unidad);
                case 8: return this.DecenasY("OCHENTA", unidad);
                case 9: return this.DecenasY("NOVENTA", unidad);
                default: return this.Unidades(unidad);
            }
        },
        DecenasY: function (strSin, numUnidades) {
            return numUnidades > 0 ? strSin + " Y " + this.Unidades(numUnidades) : strSin;
        },
        Centenas: function (num) {
            let centenas = Math.floor(num / 100);
            let decenas = num - (centenas * 100);
            switch (centenas) {
                case 1: return decenas > 0 ? " CIENTO " + this.Decenas(decenas) : " CIEN ";
                case 2: return " DOSCIENTOS " + this.Decenas(decenas);
                case 3: return " TRESCIENTOS " + this.Decenas(decenas);
                case 4: return " CUATROCIENTOS " + this.Decenas(decenas);
                case 5: return " QUINIENTOS " + this.Decenas(decenas);
                case 6: return " SEISCIENTOS " + this.Decenas(decenas);
                case 7: return " SETECIENTOS " + this.Decenas(decenas);
                case 8: return " OCHOCIENTOS " + this.Decenas(decenas);
                case 9: return " NOVECIENTOS " + this.Decenas(decenas);
                default: return this.Decenas(decenas);
            }
        },
        Seccion: function (num, divisor, strSingular, strPlural) {
            let cientos = Math.floor(num / divisor);
            let resto = num - (cientos * divisor);
            let letras = "";
            if (cientos > 0) {
                letras = (cientos > 1) ? this.Centenas(cientos) + strPlural : strSingular;
            }
            if (resto > 0) letras += "";
            return letras;
        },
        Miles: function (num) {
            let divisor = 1000;
            let strMiles = this.Seccion(num, divisor, "UN MIL ", " MIL ");
            let strCentenas = this.Centenas(num - (Math.floor(num / divisor) * divisor));
            return strMiles === "" ? strCentenas : strMiles + strCentenas;
        },
        Millones: function (num) {
            let divisor = 1000000;
            let strMillones = this.Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
            let strMiles = this.Miles(num - (Math.floor(num / divisor) * divisor));
            return strMillones === "" ? strMiles : strMillones + strMiles;
        },
        Convertir: function (num) {
            let data = {
                enteros: Math.floor(num),
                centavos: Math.round((num - Math.floor(num)) * 100),
                letrasMonedaPlural: 'CÓRDOBAS',
                letrasMonedaSingular: 'CÓRDOBA'
            };
            let letrasCentavos = data.centavos > 0 ? "CON " + data.centavos + "/100" : "";
            if (data.enteros === 0) return " CERO " + data.letrasMonedaPlural + " " + letrasCentavos;
            if (data.enteros === 1) return this.Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + letrasCentavos;
            return this.Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + letrasCentavos;
        }
    },
    __data__: {
        initzialize() {
            fieldGroup = {
                inforStudent: document.querySelectorAll('.input-disable-infor1_student [id*="txt_"]'),
                tutorContact: document.querySelectorAll('.input-disable-infor2_student [id*="txt_"]'),
                allCourses: document.querySelectorAll('.input-disable-infor3_student [id*="txt_"]'),
                paymentType: document.querySelectorAll('.input-disable-infor4_student [id*="txt_"]'),
                code: document.querySelectorAll('.input-disable-infor5_student [id*="txt_"]'),
                observations: document.querySelectorAll('.input-disable-infor6_student [id*="txt_"]'),
                amount: document.querySelectorAll('.input-disable-infor7_student [id*="txt_"]'),
                button: document.querySelectorAll('.input-disable-infor8_student [class*="_btn"]'),
                action: {
                    disable: function (groups = "") {
                        if (groups === "") groups = "all";
                        const allGroups = Object.keys(fieldGroup).filter(k => k !== "action");
                        const targets = groups.includes("all") ? allGroups : groups.split(",");
                        targets.forEach(f => {
                            if (fieldGroup[f] !== undefined && fieldGroup[f] !== null && fieldGroup[f].length > 0) {
                                fieldGroup[f].forEach(el => {
                                    if (el.getAttribute("id") !== "txt_tipo_recibo") {
                                        setDisabled(el, true)
                                        el.parentNode.classList.add("txt_disable");
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

                                        el.parentElement.classList.remove('txt_disable');
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
                                //console.log(el.getAttribute("id"),fields);
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
    __alert__: {
        successFulPrint() {
            Swal.fire({
                icon: "success", showCancelButton: true, confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33", confirmButtonText: "Reimprimir Último Recibo",
                cancelButtonText: "Salir",
                text: "La impresión puede no haberse completado correctamente..."
            }).then((result) => { if (result.isConfirmed) window.print(); });
        },
        errorNoConected() {
            Swal.fire({
                icon: "error", title: "¡LO SENTIMOS!", showCancelButton: true,
                confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
                confirmButtonText: "Intentar Nuevamente", cancelButtonText: "Cancelar",
                text: "No se ha logrado guardar el registro nuevo..."
            }).then((result) => { if (result.isConfirmed) PrintBox(); });
        }
    }
};

// ==================== FUNCIONES DE LÓGICA DEL RECIBO (VANILLA JS) ====================
function ReturnTypeTag(el) {
    let tag = el.tagName.toUpperCase();
    if (tag === "INPUT") tag = (el.type || "text").toUpperCase();
    return tag;
}
function _CLEAR_IDS_(_IDs_ = []) {
    _IDs_.forEach(id => {
        const el = getEl(id);
        if (!el) return;
        const type = ReturnTypeTag(el);
        if (type === "SELECT") el.value = "~";
        else if (type === "CHECKBOX") el.checked = false;
        else el.value = "";
        if (el.parentElement && hasClass(el.parentElement, "price")) el.value = "";
        removeClass(el, "not_empty");
    });
}
function _CLEAR_ALL_(currentID = "") {
    $$(".data_clear").forEach(el => {
        if (currentID !== el.id) _CLEAR_IDS_([el.id]);
    });
    const numCursoEl = $(".select-curso .num_curso");
    if (numCursoEl) numCursoEl.innerHTML = "";
    ClearBook();
}
function EnableFields(objs, clear = true) {
    objs.forEach(container => {
        container.querySelectorAll("input, select, textarea, button").forEach(inp => {
            removeClass(inp, "txt_disable");
            inp.disabled = false;
            if (clear && inp.tagName !== 'BUTTON') inp.value = "";
        });
    });
}
function DisableFields(objs, Clear = true) {
    objs.forEach(container => {
        container.querySelectorAll("input, select, textarea, button").forEach(inp => {
            addClass(inp, "txt_disable");
            inp.disabled = true;
            if (Clear && inp.tagName !== 'BUTTON') inp.value = "";
        });
    });
}
function ClearBook() {
    const libro = getEl("txt_nombre_libro");
    if (libro) { libro.value = ""; removeClass(libro, "not_empty"); removeClass(libro, "show"); }
    const colLibro = $(".col-libro");
    if (colLibro) {
        const img = colLibro.querySelector("img");
        if (img) img.remove();
        removeClass(colLibro, "show");
    }
}
function formatearNumero(numero) {
    let _numero_ = (numero.trim() === '' || numero === "0.00") ? "0" : parseFloat(numero.replace(/\,/g, ''));
    if (isNaN(_numero_)) return "0.00";
    if (_numero_ !== 0) {
        let partes = _numero_.toFixed(2).split('.');
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return partes.join('.');
    }
    return "0.00";
}
function Current_Long_Date() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    let hora = today.getHours();
    const min = today.getMinutes();
    const esAM = hora < 12 ? 'AM' : 'PM';
    return { dia: dd, mes: mm, anio: yyyy, hora: ((hora > 12 ? hora - 12 : hora) + ":" + min + " " + esAM) };
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
function onFailure(error) {
    _GLOBAL_DATA_OFFLINE_.push(_DATA_);
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("unsaved_receipts", JSON.stringify(_GLOBAL_DATA_OFFLINE_));
    }
}
function onSuccess(message) {
    if (_GLOBAL_DATA_OFFLINE_ && _GLOBAL_DATA_OFFLINE_.length > 0) {
        google.script.run.withSuccessHandler(onSuccess2).withFailureHandler(onFailure2).UpdateByBatch(_GLOBAL_DATA_OFFLINE_, _SEDE_GLOBAL);
    }
}
function onFailure2(error) { console.log("onFailure2"); }
function onSuccess2(message) {
    _GLOBAL_DATA_OFFLINE_ = [];
    localStorage.setItem("unsaved_receipts", JSON.stringify(_GLOBAL_DATA_OFFLINE_));
}
function set_printer_values(_field_, _value_, _label_ = '') {
    const valorEl = $(`.box-receipt .print_${_field_} .valor`);
    if (valorEl) {
        _value_ = (_value_ === '') ? (hasClass(valorEl, "currency") ? "0.00" : "-") : _value_;
        valorEl.innerHTML = _value_;
    }
    const importeField = getEl(`txt_importe_${_field_}`);
    if (importeField) importeField.value = (_value_ === "0.00") ? "" : _value_;
    if (_label_ !== '') {
        if (importeField) {
            const parent = importeField.parentElement?.parentElement;
            const title = parent?.querySelector(".title");
            if (title) title.innerHTML = _label_;
        }
        const tituloEl = $(`.box-receipt .print_${_field_} .titulo`);
        if (tituloEl) tituloEl.innerHTML = _label_;
    }
}
function reset_printer_values() {
    $$('.box-receipt [class*="print_"]:not(.not-clear) .valor').forEach(el => el.innerHTML = "&nbsp;");
    $$(".box-receipt .all_fields_prices .valor").forEach(el => el.innerHTML = "0.00");
    const chequeTitulo = $(".box-receipt .print_cheque_referencia .titulo");
    if (chequeTitulo) chequeTitulo.innerHTML = "CHEQUE REF: ";
    const depositoTitulo = $(".box-receipt .print_deposito_referencia .titulo");
    if (depositoTitulo) depositoTitulo.innerHTML = "DEPÓSITO REF: ";
    const descuentoTitulo = $(".box-receipt .print_descuento .titulo");
    if (descuentoTitulo) descuentoTitulo.innerHTML = "DESCUENTO: ";
    const retencionTitulo = $(".box-receipt .print_retencion .titulo");
    if (retencionTitulo) retencionTitulo.innerHTML = "RETENCIÓN: ";
    const letrasEl = $(".importe-letras");
    if (letrasEl) letrasEl.innerHTML = "";
}
function parseNumber(value) { return (value == null || value === '') ? 0 : !isNaN(Number(value)) ? Number(value) : 0; }
function truncarADosDecimalesFormateado(numero) {
    let _NUM_ = parseNumber(numero);
    return String(_NUM_).trim() !== "" ? Math.floor(_NUM_ * 100) / 100 : 0.00;
}
function ReturnDiscount(_CODE_ = "", _ImporteColegiatura_ = 0) {
    switch (_CODE_) {
        case "010-DF": case "010-DE": case "010-DT": case "305-TR": case "306-TR":
            return _ImporteColegiatura_ * 0.10;
        case "015-DC": return _ImporteColegiatura_ * 0.15;
        case "005-DT": return _ImporteColegiatura_ * 0.05;
        case "050-MB": case "050-BT": return _ImporteColegiatura_ * 0.50;
        case "100-BC": case "100-BT": return _ImporteColegiatura_;
        default: return 0;
    }
}
function SetBook(_TITLE_ = false) {
    if (_TITLE_ !== false) {
        if (_TITLE_["title-book"] !== null) {
            const colLibro = $(".col-libro");
            if (colLibro) addClass(colLibro, "show");
            const txtLibro = getEl("txt_nombre_libro");
            if (txtLibro) { txtLibro.value = _TITLE_["title-book"]; addClass(txtLibro, "show not_empty"); }
            if (_TITLE_.thumb_img !== null) {
                const thumbDiv = $(".thumb-img");
                if (thumbDiv) thumbDiv.innerHTML = '<img src="https://dataanalyst-ans.github.io/thumb/' + _TITLE_.thumb_img + '">';
                const bigDiv = $(".big-img");
                if (bigDiv) bigDiv.innerHTML = '<img src="https://dataanalyst-ans.github.io/thumb/' + _TITLE_.thumb_img + '">';
            }
        } else {
            ClearBook();
        }
    }
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
    } else {
        var fechaActual = new Date();
        var mesActual = fechaActual.getMonth() + 1;
        mesActual = mesActual >= 12 ? 1 : mesActual;
        mesActual = (mesActual % 2 === 0) ? mesActual : mesActual + 1;
        var _anioActual_ = fechaActual.getFullYear();
        var _PeriodoActual_ = Math.ceil(((mesActual % 2 === 0) ? mesActual : mesActual + 1) / 2);
        if ((mesActual % 2 !== 0)) {
            _optionCuorces_ += '<optgroup label="CURSO ' + (_PeriodoActual_ == 1 ? 6 : _PeriodoActual_ - 1) + '">' +
                '<option value="' + (_PeriodoActual_ == 1 ? _anioActual_ - 1 : _anioActual_) + _the_SEDE_ + 'SAB0' + (_PeriodoActual_ == 1 ? 6 : _PeriodoActual_ - 1) + '">SABATINO</option>' +
                (_the_SEDE_ == "MAG" ? '<option value="' + (_PeriodoActual_ == 1 ? _anioActual_ - 1 : _anioActual_) + _the_SEDE_ + 'REG0' + (_PeriodoActual_ == 1 ? 6 : _PeriodoActual_ - 1) + '">REGULAR PRESENCIAL</option>' : '') +
                '<option value="' + (_PeriodoActual_ == 1 ? _anioActual_ - 1 : _anioActual_) + "MAG" + 'REG0' + (_PeriodoActual_ == 1 ? 6 : _PeriodoActual_ - 1) + '-ONLINE">REGULAR ONLINE</option>' +
                '</optgroup>';
        }
        _optionCuorces_ += '<optgroup label="' + _anioActual_ + ' CURSO 6">' +
            '<option value="2024' + _the_SEDE_ + 'SAB06">SABATINO</option>' +
            '</optgroup>';
        _anioActual_++;
        _optionCuorces_ += '<optgroup label="' + _anioActual_ + ' CURSO ' + _PeriodoActual_ + '">' +
            '<option value="' + _anioActual_ + _the_SEDE_ + 'SAB0' + _PeriodoActual_ + '">SABATINO</option>' +
            (_the_SEDE_ == "MAG" ? '<option value="' + _anioActual_ + _the_SEDE_ + 'REG0' + _PeriodoActual_ + '">REGULAR PRESENCIAL</option>' : '') +
            '</optgroup>';
    }
    return _optionCuorces_;
}
function getVALUE(selector) { return getValue(selector); }
function detect_payment_type() {
    return (getEl("txt_tipo_efectivo")?.checked || getEl("txt_tipo_tarjeta")?.checked || getEl("txt_tipo_payphone")?.checked ||
        getValue(getEl("txt_cheque_referencia")) !== '' || getValue(getEl("txt_deposito_referencia")) !== '');
}
function returnAutoList(_JSON__LIST_ENROLLMENT_AUTOCOMPLETE__, list = "list1") {
    let tmp_array = [""];
    for (let k in _JSON__LIST_ENROLLMENT_AUTOCOMPLETE__) {
        tmp_array.push(_JSON__LIST_ENROLLMENT_AUTOCOMPLETE__[k][0]);
    }
    return tmp_array;
}
function IncrementarSerie() {
    let serie = getValue(getEl("txt_serie"));
    let roc = parseInt(getValue(getEl("txt_roc")));
    let newROC = roc + 1;
    const serialSpan = getEl("serial_recibo");
    if (serialSpan) serialSpan.innerHTML = "SERIE " + serie + " &nbsp;&nbsp;#&nbsp; " + newROC;
    setValue(getEl("txt_serie"), serie);
    setValue(getEl("txt_roc"), newROC);
    localStorage.setItem("serial_number", serie + "|" + newROC);
    _SERIAL_NUMBER_ = serie + "|" + newROC;
}
function PrintBox(iteration = 1) {
    let max_iteration = 6;
    if (iteration >= max_iteration) {
        SAVE_PRINT = true;
        document.body.classList.remove('printing-mode');
        _HELPERS_.__alert__.errorNoConected();
        return;
    }
    if (!document.body.classList.contains("printing-mode")) {
        document.body.classList.add('printing-mode');
        SAVE_PRINT = false;
    }
    const modalP = document.querySelector(".printing-mode ._modal_ p span");
    if (modalP) modalP.textContent = "Intento " + iteration + " de " + max_iteration + "...";
    try {
        google.script.run
            .withSuccessHandler(function () {
                SAVE_PRINT = true;
                document.body.classList.remove('printing-mode');
                window.print();
            })
            .withFailureHandler(function () {
                setTimeout(() => { PrintBox(iteration + 1); }, 2000);
            })
            .NewRecord(_DATA_, (_LABEL_SEDE_ === "TEST") ? _LABEL_SEDE_ : _SEDE_GLOBAL);
    } catch (error) {
        _HELPERS_.__alert__.errorNoConected();
    }
}
function DATA_RESET() {
    _DATA_ = _HELPERS_.__data__.initzialize();
}
function propiedadProfundaExiste(objeto, ruta) {
    const propiedades = ruta.split('.');
    let temp = objeto;
    for (const prop of propiedades) {
        if (temp?.hasOwnProperty(prop)) temp = temp[prop];
        else return false;
    }
    return true;
}
function redondearHaciaArribaAMultiploDe10(numero) { return Math.ceil(numero / 10) * 10; }
function completa_ceros(valor) {
    let numero = parseFloat(valor);
    return isNaN(numero) ? "0.00" : numero.toFixed(2);
}

// ==================== CÁLCULOS PRINCIPALES (COMPLETOS) ====================
function CalculePrices() {
    //const _DATA_ELI_ = window._DATA_ELI_ || {};
    const txtCurso = getEl("txt_curso");
    const txtCategoria = getEl("txt_categoria");
    const txtNivel = getEl("txt_nivel");
    const txtTipoRecibo = getEl("txt_tipo_recibo");
    if (!txtCurso || !txtCategoria || !txtNivel) return;
    const cursoVal = getValue(txtCurso);
    if (cursoVal === "~") return;
    let SEDE_SELECTED = cursoVal.includes("ONLINE") ? "ONLINE" : cursoVal.substring(4, 7);
    let ALL_DATA_SEDE = _DATA_ELI_[SEDE_SELECTED] || {};
    let nivel = getValue(txtNivel);
    let categoria = getValue(txtCategoria).replace("ONLINE-", "");
    let tipoRecibo = getValue(txtTipoRecibo).toUpperCase();
    let ImporteDescuento = 0, ImporteColegiatura = 0, ImporteLibro = 0, txt_otros = 0, total_retencion = 0;
    let txt_otros_detalles = "", LabelCODE = "";
    const CODE_DESC = ["005-DT", "010-DF", "015-DC", "010-DE", "010-DT", "050-MB", "050-BT", "100-BC", "100-BT", "305-TR"];

    // Obtener código de descuento ingresado
    let codigoDescuento = getEl("txt_codigo_descuento") ? getValue(getEl("txt_codigo_descuento")) : "";
    // Obtener otros ingresos
    let otrosInput = getEl("txt_importe_otros");
    if (otrosInput) txt_otros = parseNumber(getValue(otrosInput));
    // Obtener retenciones (checkboxes)
    let ret1 = getEl("txt_retencion_1") ? getEl("txt_retencion_1").checked : false;
    let ret2 = getEl("txt_retencion_2") ? getEl("txt_retencion_2").checked : false;

    // Si es un tipo de recibo especial "OTROS" o "DIFF", usar CalculeOtros
    if (tipoRecibo === "OTROS" || tipoRecibo === "DIFF") {
        CalculeOtros();
        return;
    }

    // Buscar datos del curso según nivel y categoría
    if (ALL_DATA_SEDE[nivel] && ALL_DATA_SEDE[nivel][categoria]) {
        let cursoData = ALL_DATA_SEDE[nivel][categoria];
        ImporteColegiatura = cursoData.colegiatura || 0;
        ImporteLibro = cursoData.libro || 0;
    }

    // Aplicar descuento según código
    if (CODE_DESC.includes(codigoDescuento)) {
        ImporteDescuento = ReturnDiscount(codigoDescuento, ImporteColegiatura);
    }

    // Calcular retención (si aplica sobre otros ingresos)
    total_retencion = truncarADosDecimalesFormateado(txt_otros * ((ret1 ? 0.01 : 0) + (ret2 ? 0.02 : 0)));

    // Actualizar impresión
    set_printer_values("colegiatura", formatearNumero(ImporteColegiatura.toString()));
    set_printer_values("libro", formatearNumero(ImporteLibro.toString()));
    set_printer_values("descuento", formatearNumero((ImporteDescuento * -1).toString()));
    set_printer_values("otros", formatearNumero(txt_otros.toString()));
    set_printer_values("retencion", formatearNumero((total_retencion * -1).toString()));

    let ImporteTotal = ImporteColegiatura - ImporteDescuento + ImporteLibro + txt_otros - total_retencion;
    set_printer_values("total", formatearNumero(ImporteTotal.toString()));

    const letrasEl = $(".importe-letras");
    if (letrasEl) letrasEl.innerHTML = _HELPERS_.numeroALetras.Convertir(ImporteTotal);
}

function CalculeOtros() {
    const txtOtros = getEl("txt_importe_otros");
    let otros = parseNumber(getValue(txtOtros));
    let ret1 = getEl("txt_retencion_1")?.checked ? 0.01 : 0;
    let ret2 = getEl("txt_retencion_2")?.checked ? 0.02 : 0;
    let total_retencion = truncarADosDecimalesFormateado(otros * (ret1 + ret2));
    let ImporteTotal = truncarADosDecimalesFormateado(otros - total_retencion);
    set_printer_values("otros", formatearNumero(otros.toString()));
    set_printer_values("retencion", formatearNumero((total_retencion * -1).toString()));
    set_printer_values("total", formatearNumero(ImporteTotal.toString()));
    const letrasEl = $(".importe-letras");
    if (letrasEl) letrasEl.innerHTML = _HELPERS_.numeroALetras.Convertir(ImporteTotal);
}

// ==================== MANEJADOR OPTIMIZADO PARA txt_nombre (SIN DUPLICADOS) ====================
// Esta función se usará como único listener para el campo nombre
function handleNombreChange(e) {
    const input = e.target;
    const value = input.value;
    if (value === "~") return;

    const txtEmpresa = getValue(getEl("txt_empresa")).toUpperCase();
    const printNombre = $(".print_nombre .valor");
    if (printNombre) printNombre.innerHTML = (txtEmpresa !== '' ? (txtEmpresa + "<br>") : '') + value;

    // Determinar qué lista usar según el tipo de recibo actual
    const tipoRecibo = getValue(getEl("txt_tipo_recibo"));
    let listaActiva = (tipoRecibo === "CLG-NUEVO") ? _LIST_INSCRIPTION_AUTOCOMPLETE_ : _LIST_ENROLLMENT_AUTOCOMPLETE_;

    // Buscar coincidencia en la lista activa
    for (let k in listaActiva) {
        if (listaActiva[k][0] == value) {
            switch (tipoRecibo) {
                case "CLG-NUEVO":

                    const tutorField = getEl("txt_tutor");
                    const birthField = getEl("txt_fecha_nacimiento");
                    const phoneField = getEl("txt_telefono");
                    const emailField = getEl("txt_correo");



                    if (tutorField) {
                        tutorField.value = listaActiva[k][1] || ""
                        tutorField.classList.add("not_empty");
                    };
                    if (birthField) {
                        birthField.value = listaActiva[k][2] || ""
                        birthField.classList.add("not_empty");
                    };
                    if (emailField) {
                        emailField.value = listaActiva[k][3] || ""
                        emailField.classList.add("not_empty");
                    };
                    if (phoneField) {
                        phoneField.value = listaActiva[k][4] || ""
                        phoneField.classList.add("not_empty");
                    };
                    break;
                case "CLG":
                    const nameField = getEl("txt_nombre");
                    if (nameField) nameField.value = listaActiva[k][0] || "";
                    break;
                default:
                    break;
            }

            break;
        }
    }

    // Activar campos de cursos y demás según necesidad
    fieldGroup.action.enable("allCourses");
}

// ==================== INICIALIZACIÓN Y EVENTOS ====================
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

    // --- Configuración única del autocompletado y evento change para txt_nombre ---
    const nombreInput = getEl("txt_nombre");
    if (nombreInput) {
        // Configurar el datalist dinámico según el tipo de recibo actual
        const updateAutocompleteSource = () => {
            const tipoRecibo = getValue(getEl("txt_tipo_recibo"));
            const listaActiva = (tipoRecibo === "CLG-NUEVO") ? _LIST_INSCRIPTION_AUTOCOMPLETE_ : _LIST_ENROLLMENT_AUTOCOMPLETE_;
            return returnAutoList(listaActiva);
        };
        setupAutocomplete(nombreInput, updateAutocompleteSource);
        // Listener único para el evento change
        nombreInput.addEventListener('change', handleNombreChange);
        // Cuando cambie el tipo de recibo, actualizar el datalist sin duplicar eventos
        const tipoReciboSelect = getEl("txt_tipo_recibo");
        if (tipoReciboSelect) {
            tipoReciboSelect.addEventListener('change', function () {
                // Forzar la regeneración del datalist la próxima vez que se escriba
                // Simplemente se actualizará la fuente cuando se dispare input.
                // No se añaden nuevos listeners.
                const datalistId = nombreInput.id + '_datalist';
                const datalist = getEl(datalistId);
                if (datalist) datalist.innerHTML = ''; // limpiar para que se regenere
            });
        }
    }



    // --- Evento change genérico para campos con id txt_* ---
    on('change', '[id*="txt_"]', function (e) {

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
        //console.log(id);
        switch (id) {
            case "txt_tipo_recibo":
                fieldGroup.action.clear();
                fieldGroup.action.disable("all");
                if (value !== "~") {
                    fieldGroup.action.enable("inforStudent,tutorContact");
                }
                // Al cambiar tipo recibo, actualizar la fuente del autocompletado de nombre
                const nombreInputLocal = getEl("txt_nombre");
                if (nombreInputLocal) {
                    const datalistId = nombreInputLocal.id + '_datalist';
                    const datalist = getEl(datalistId);
                    if (datalist) datalist.innerHTML = ''; // Forzar regeneración
                }

                if (value === "CLG-REINGRESO") {
                    console.log(value);
                    CustomAlert.warning('⚠️ Alumnos de reingreso deben realizar examen de nivelación.', 10000);
                }
                break;
            case "txt_nombre":
                fieldGroup.action.disable("paymentType,code,observations,amount,button");
                // Ya manejado por handleNombreChange, evitar duplicación
                break;
            case "txt_curso":
                ClearIMGPreview();
                fieldGroup.action.clearFields("txt_categoria,txt_nivel");
                fieldGroup.action.disable("paymentType");
                if (value.trim() != "~") {
                    _SEDE_SELECTED_ = (value).substring(4, 7);
                    const _CATEGORIES_ = Object.keys(window._DATA_ELI_[_SEDE_SELECTED_]);
                    const categoriesInput = getEl("txt_categoria");

                    // Seleccionar el <select> existente (cambia el selector según tu HTML)
                    // Puedes usar id, clase o cualquier selector válido
                    //const selectElement = document.querySelector('#miSelect'); // Ejemplo con id="miSelect"
                    // Si no tienes un id específico y es el único select: document.querySelector('select')

                    // Limpiar opciones previas (opcional, pero útil para evitar duplicados)
                    categoriesInput.innerHTML = '';

                    // Crear la primera opción vacía
                    const emptyOption = document.createElement('option');
                    emptyOption.value = '~';
                    emptyOption.textContent = '';       // Deja el texto vacío
                    // También puedes usar un placeholder visible: emptyOption.textContent = 'Selecciona...';
                    categoriesInput.appendChild(emptyOption);

                    // Recorrer el array y crear las opciones
                    _CATEGORIES_.forEach(opcion => {
                        const option = document.createElement('option');
                        option.value = opcion;           // Asigna el mismo valor que el texto
                        option.textContent = opcion.replace("-", " ");     // Muestra el texto original
                        categoriesInput.appendChild(option);
                    });

                }

                /*const categoriesInput = document.getElementById('txt_categoria');
                categoriesInput.replaceChildren();
                const levelInput = document.getElementById('txt_nivel');
                levelInput.replaceChildren();*/
                fieldGroup.action.disable("paymentType");
                break;
            case "txt_categoria":
                ClearIMGPreview();
                fieldGroup.action.clearFields("txt_nivel");
                fieldGroup.action.disable("paymentType");
                if (value.trim() != "~") {
                    _SEDE_SELECTED_ = (getValue(getEl("txt_curso"))).substring(4, 7);
                    _CATEGORY_SELECTED_ = String(value).trim();
                    _LEVEL_ = Object.keys(window._DATA_ELI_[_SEDE_SELECTED_][_CATEGORY_SELECTED_]["niveles"]);
                    const levelInput = getEl("txt_nivel");

                    // Seleccionar el <select> existente (cambia el selector según tu HTML)
                    // Puedes usar id, clase o cualquier selector válido
                    //const selectElement = document.querySelector('#miSelect'); // Ejemplo con id="miSelect"
                    // Si no tienes un id específico y es el único select: document.querySelector('select')

                    // Limpiar opciones previas (opcional, pero útil para evitar duplicados)
                    levelInput.innerHTML = '';

                    // Crear la primera opción vacía
                    const emptyOptionlevel = document.createElement('option');
                    emptyOptionlevel.value = '~';
                    emptyOptionlevel.textContent = '';       // Deja el texto vacío
                    // También puedes usar un placeholder visible: emptyOption.textContent = 'Selecciona...';
                    levelInput.appendChild(emptyOptionlevel);

                    // Recorrer el array y crear las opciones
                    _LEVEL_.forEach(opcion => {
                        const option = document.createElement('option');
                        option.value = opcion;           // Asigna el mismo valor que el texto
                        option.textContent = opcion.replace("_", "");     // Muestra el texto original
                        levelInput.appendChild(option);
                    });
                }


                fieldGroup.action.disable("paymentType");
                break;
            case "txt_nivel":
                ClearIMGPreview();
                fieldGroup.action.disable("paymentType");
                if (value.trim() != "~") {
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
                    fieldGroup.action.enable("paymentType");
                }

                break;
            case "txt_tipo_efectivo":
            case "txt_tipo_tarjeta":
            case "txt_deposito_referencia":
            case "txt_cheque_referencia":

                const isCheckedEFECTIVO = document.getElementById("txt_tipo_efectivo").checked;
                const isCheckedTarjeta = document.getElementById("txt_tipo_tarjeta").checked;
                const noEmptyDeposito = String(getValue(document.getElementById("txt_deposito_referencia"))).trim() === "" ? false : true;
                const noEmptyCheque = String(getValue(document.getElementById("txt_cheque_referencia"))).trim() === "" ? false : true;

                if (isCheckedEFECTIVO || isCheckedTarjeta || noEmptyDeposito || noEmptyCheque) {
                    fieldGroup.action.enable("code,observations,amount");
                } else {
                    fieldGroup.action.disable("code,observations,amount");
                }

                break;
            default:
                break;
        }
        // Recalcular precios según corresponda
        // const tipoRecibo = getValue(getEl("txt_tipo_recibo"));
        // if (tipoRecibo !== "OTROS" && tipoRecibo !== "DIFF") CalculePrices();
        // else CalculeOtros();
        // const dateDiv = $(".date");
        // if (dateDiv) dateDiv.innerHTML = Current_date("html");
    });

    on('paste', '.input-depo', async function (e) {
        const thisField = this;
        let idIndex = parseInt((thisField.getAttribute("id")).replace("txt_depo_", ""));

        if (thisField.parentNode.getAttribute("class").includes("isBlocked")) return false;
        const valida = {
            formatDate: function (cadena) {
                const str = String(cadena).trim().toUpperCase()
                return str.replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g, (match, dia, mes, año) => {
                    // Agrega cero a la izquierda si es necesario
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
        // Obtener el texto pegado directamente del portapapeles (síncrono)
        const pastedText = e.clipboardData.getData('text/plain');
        e.preventDefault();
        // Reemplazar todos los tabuladores por "|"
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
                    console.log("ENTRÓ");
                    if (idIndex >= 1) {
                        idIndex++;
                        console.log("idIndex", idIndex);

                        const next_input_depo = document.getElementById("txt_depo_" + ((idIndex < 10) ? "0" : "") + idIndex)
                        if (next_input_depo) {
                            next_input_depo.parentNode.classList.remove("isBlocked")
                        }
                    }

                    console.log(JSON.stringify(window._ALL_DEPOSITS, null, 2));

                } else {
                    this.value = "";
                    CustomAlert.error('❌ No puedes ingresar el mismo depósito dos veces en este recibo.', 10000);
                }
            }
        } else {
            CustomAlert.error('❌ Fila incompleta. Copia la fila completa desde el archivo de depósitos.', 10000);

        }

    });
    on("click", "#txt_deposito_referencia", function () {

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
                // key es algo como "76112994_"
                // _value_ es el depósito

                const _fliendDeposits_ = document.querySelector("#txt_depo_0" + (index + 1));
                if (_fliendDeposits_) {

                    _fliendDeposits_.value = _value_;
                    _fliendDeposits_.classList.add("not_empty")
                    _fliendDeposits_.parentNode.classList.remove("isBlocked")

                }
                const _fliendDepositsNext_ = document.querySelector("#txt_depo_0" + (index + 2))
                if (_fliendDepositsNext_) {
                    _fliendDepositsNext_.parentNode.classList.remove("isBlocked")
                }
            });
        }

        dialog.style.display = 'flex';

    });
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
        const isCheckedEFECTIVO = document.getElementById("txt_tipo_efectivo").checked;
        const isCheckedTarjeta = document.getElementById("txt_tipo_tarjeta").checked;
        const noEmptyDeposito = String(getValue(document.getElementById("txt_deposito_referencia"))).trim() === "" ? false : true;
        const noEmptyCheque = String(getValue(document.getElementById("txt_cheque_referencia"))).trim() === "" ? false : true;

        if (isCheckedEFECTIVO || isCheckedTarjeta || noEmptyDeposito || noEmptyCheque) {
            fieldGroup.action.enable("code,observations,amount");
        } else {
            fieldGroup.action.disable("code,observations,amount");
        }
    });

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
                // key es algo como "76112994_"
                // _value_ es el depósito

                const _fliendDeposits_ = document.querySelector("#txt_depo_0" + (index + 1));
                if (_fliendDeposits_) {
                    console.log("#txt_depo_0" + (index + 1))
                    _fliendDeposits_.value = _value_;
                    _fliendDeposits_.classList.add("not_empty")

                }
            });
        }


        // input.value = "";
        // input.classList.remove("not_empty")

        //console.log(JSON.stringify(window._ALL_DEPOSITS, null, 2));
    })
    on('keydown', '.input-depo', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();

        }
    })
    on("click", ".save-depositos", function () {


        const _fliendDeposits_ = document.querySelectorAll(".input-depo");
        _fliendDeposits_.forEach(field => {
            field.value = "";
        });
        const dialog = document.querySelector('#modalDepositos');

        dialog.style.display = 'none';


        const deposito_referencia = document.getElementById("txt_deposito_referencia")

        console.log(window._ALL_DEPOSITS);

        if (deposito_referencia && Object.keys(window._ALL_DEPOSITS).length > 0) {
            deposito_referencia.value = (Object.keys(window._ALL_DEPOSITS).join(", ")).replace(/\_/g, "")
            deposito_referencia.classList.add("not_empty");
        }
        const isCheckedEFECTIVO = document.getElementById("txt_tipo_efectivo").checked;
        const isCheckedTarjeta = document.getElementById("txt_tipo_tarjeta").checked;
        const noEmptyDeposito = String(getValue(document.getElementById("txt_deposito_referencia"))).trim() === "" ? false : true;
        const noEmptyCheque = String(getValue(document.getElementById("txt_cheque_referencia"))).trim() === "" ? false : true;

        if (isCheckedEFECTIVO || isCheckedTarjeta || noEmptyDeposito || noEmptyCheque) {
            fieldGroup.action.enable("code,observations,amount");
        } else {
            fieldGroup.action.disable("code,observations,amount");
        }
    });


    /*
        // --- Eventos de botones (telepago, reporte, guardar, imprimir, nuevo, serie) ---
        on('click', '.telepago button', function () {
            _PAGE_ = "?page=df0846233a72640344ee06deaff94933";
            window.open(_CURRENT_URL_APP_ + _PAGE_ + "&sede=" + _SEDE_GLOBAL, '_blank');
        });
        on('click', '.reporte button', async function () {
            const loadFilter = () => {
                if (_MULTIFILTER_ && _SEDE_GLOBAL == "TEST") {
                    return `<div class="row"><div class="col"><p>Seleccione el rango de fecha...</p></div></div>
                         <div id="box-reporte" class="row">
                         <div class="col-xs-12 col-md-4"><span>LOCALIDAD</span>
                         <select id="value_tmp_sede_reporte" class="swal2-input"><option value="~">-SELECCIONAR-</option>
                         <option value="ESTELÍ">ESTELÍ</option><option value="LEÓN">LEÓN</option>
                         <option value="TELEPAGO">TELEPAGOS</option></select></div>
                         <div class="col-xs-12 col-md-3"><span>USRUARIO</span>
                         <select id="value_tmp_usuario_reporte" class="swal2-input"><option value="~">-SELECCIONAR-</option>
                         <option value="eliesteli@ans.edu.ni">NAHIRIS</option><option value="irela.jarquin@ans.edu.ni">IRELA</option>
                         <option value="elileon@eli.ans.edu.ni">MAGALY</option><option value="kblanco@ans.edu.ni">KEYLER</option>
                         <option value="guillermo.rocha@ans.edu.ni">GUILLERMO ROCHA</option><option value="all">TODOS</option></select></div>
                         <div class="col-xs-12 col-md-5"><span>FECHA</span>
                         <input id="value_tmp_fecha_reporte" class="swal2-input verde" placeholder="DD/MM/YYYY - DD/MM/YYYY"></div></div>`;
                } else {
                    return `<div class="row"><div class="col"><p>Seleccione el rango de fecha...</p></div></div>
                         <div id="box-reporte" class="row"><div class="col-xs-12 col-12"><span>Fecha</span>
                         <input id="value_tmp_fecha_reporte" class="swal2-input verde" placeholder="DD/MM/YYYY - DD/MM/YYYY"></div></div>`;
                }
            };
            await Swal.fire({
                title: "REPORTE DE CIERRE", showCancelButton: true, showConfirmButton: false,
                cancelButtonText: "CERRAR", didOpen: () => {
                    const fechaInput = $("#box-reporte #value_tmp_fecha_reporte");
                    if (fechaInput) {
                        fechaInput.addEventListener('change', function () {
                            const range = this.value.split(' - ');
                            if (range.length === 2) {
                                const start = range[0].split('/').reverse().join('-');
                                const end = range[1].split('/').reverse().join('-');
                                const sede = getEl("value_tmp_sede_reporte")?.value || _SEDE_GLOBAL;
                                const user = getEl("value_tmp_usuario_reporte")?.value || '';
                                if (_MULTIFILTER_ && _SEDE_GLOBAL == "TEST") {
                                    window.open(_CURRENT_URL_APP_ + "?page=8e115b88fef759a73cfa66735001816b&sede=" + sede + "&rango1=" + start + '&rango2=' + end + '&filter=' + user, '_blank');
                                } else {
                                    window.open(_CURRENT_URL_APP_ + "?page=8e115b88fef759a73cfa66735001816b&sede=" + _SEDE_GLOBAL + "&rango1=" + start + '&rango2=' + end, '_blank');
                                }
                            }
                        });
                    }
                },
                html: loadFilter()
            });
        });
        on('click', '.guardar button', function () {
            let _msg_ = '';
            const autorizacion = getEl("txt_autorizacion")?.value.trim().toUpperCase() || "";
            if (getValue(getEl("txt_nombre")) === '') _msg_ = "No ingresó el nombre del Alumno o Empresa";
            else if (autorizacion === '') _msg_ = "Escriba el número de autorización";
            if (_msg_ !== '') {
                Swal.fire({ icon: "error", title: "¡LO SENTIMOS!", text: _msg_ });
            } else {
                IncrementarSerie();
                if (SAVE_PRINT) {
                    SAVE_PRINT = false;
                    google.script.run.withSuccessHandler(onSuccess).withFailureHandler(onFailure).AddRecord(_DATA_, (_LABEL_SEDE_ === "TEST") ? "TEST" : _SEDE_GLOBAL);
                }
                Swal.fire({
                    icon: "success", title: "¡REGISTRO GUARDADO!", text: "Los datos del recibo fueron almacenados con éxito",
                    timer: 3000, timerProgressBar: true, willClose: () => {
                        SAVE_PRINT = true;
                        const allGroups = $$('[class*="input-disable-infor"]');
                        DisableFields(allGroups);
                        $$(".data_clear").forEach(el => removeClass(el, "not_empty"));
                        _CLEAR_ALL_();
                        const preview = $(".previews-receipt");
                        if (preview) removeClass(preview, "show");
                        _DATA_ = _HELPERS_.__data__.initzialize();
                    }
                });
            }
        });
    
        on('click', '.imprimir button', function () { PrintBox(); });
        on('click', '.nuevo button', function () {
            SAVE_PRINT = true;
            const allGroups = $$('[class*="input-disable-infor"]');
            DisableFields(allGroups);
            $$(".data_clear").forEach(el => removeClass(el, "not_empty"));
            _CLEAR_ALL_();
            const preview = $(".previews-receipt");
            if (preview) removeClass(preview, "show");
            _DATA_ = _HELPERS_.__data__.initzialize();
        });
        on('click', '.serie-recibo', async function () {
            const serie = getValue(getEl("txt_serie"));
            const roc = getValue(getEl("txt_roc"));
            const { value: formValues } = await Swal.fire({
                title: "NÚMERO DE RECIBO", showCancelButton: true,
                confirmButtonText: "ACEPTAR", cancelButtonText: "CANCELAR",
                html: `<div class="row"><p>Escriba la letra y número del recibo...</p></div>
                    <div id="box-receipt" class="row">
                    <div class="col-xs-5 col-md-5"><span>LETRA</span> <input id="value_tmp_letra" class="swal2-input" value="${serie}"></div>
                    <div class="col-xs-7 col-md-7"><span>NÚMERO</span> <input id="value_tmp_serie" class="swal2-input" value="${roc}"></div></div>`,
                focusConfirm: false, preConfirm: () => ({ SERIE: getEl("value_tmp_letra").value.toUpperCase(), ROC: getEl("value_tmp_serie").value })
            });
            if (formValues) {
                Swal.fire({
                    title: `${formValues.SERIE} #${formValues.ROC}`, text: "¿ES CORRECTO EL NÚMERO DEL RECIBO?", icon: "question",
                    showCancelButton: true, confirmButtonText: "ACEPTAR", cancelButtonText: "CANCELAR",
                }).then((result) => {
                    if (result.isConfirmed) {
                        const serieInp = getEl("txt_serie");
                        const rocInp = getEl("txt_roc");
                        if (serieInp) serieInp.value = formValues.SERIE;
                        if (rocInp) rocInp.value = formValues.ROC;
                        const serialSpan = getEl("serial_recibo");
                        if (serialSpan) serialSpan.innerHTML = `SERIE ${formValues.SERIE} &nbsp;&nbsp;#&nbsp; ${formValues.ROC}`;
                        localStorage.setItem("serial_number", `${formValues.SERIE}|${formValues.ROC}`);
                        _SERIAL_NUMBER_ = `${formValues.SERIE}|${formValues.ROC}`;
                    }
                });
            }
        });
        */

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


