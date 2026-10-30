const _HELPERS_ = {
    Current_Long_Date() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var hora = today.getHours();
        var min = today.getMinutes();

        /*if (_NEW_DATE_.status) {
            dd = _NEW_DATE_.day;
            mm = _NEW_DATE_.month;
            yyyy = _NEW_DATE_.year;
            hora = 21;
        }*/

        const esAM = hora < 12 ? 'AM' : 'PM';

        return {
            dia: dd,
            mes: mm,
            anio: yyyy,
            hora: (hora > 12 ? hora - 12 : hora) + ":" + min + " " + esAM
        };
    },
    IncrementarSerie() {
        var _serie_ = $getEl("#txt_receipt_number");
        if (!_serie_._exist()) return;

        const [SERIE = '', ROC = '0'] = (String(_serie_.value).replace('SERIE ', '')).split('#')

        var _NewROC_ = parseInt(ROC) + 1;

        const NumROC = String(((String(SERIE).toUpperCase() === "G") ? String(_NewROC_).padStart(7, '0') : _NewROC_)).trim();

        _serie_.value = ("SERIE " + SERIE.toUpperCase() + " #" + NumROC);

        localStorage.setItem("serial_number_" + window._SEDE_, String(SERIE).toUpperCase().trim() + "|" + NumROC);
        window._SERIAL_NUMBER_ = String(SERIE).toUpperCase().trim() + "|" + NumROC;
    },
    getHora12(fecha = new Date()) {
        return new Intl.DateTimeFormat('es-NI', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(fecha);
    },
    getFechaHora(fecha = new Date()) {
        return new Intl.DateTimeFormat('es-NI', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(fecha);
    },
    ResteDate(date) {
        const nameMonths = {
            'ENE': '01',
            'FEB': '02',
            'MAR': '03',
            'ABR': '04',
            'MAY': '05',
            'JUN': '06',
            'JUL': '07',
            'AGO': '08',
            'SEP': '09',
            'OCT': '10',
            'NOV': '11',
            'DIC': '12'
        }
        const [day, month, year] = String(date).split('/');
        return `${day}/${nameMonths[month.toUpperCase()]}/${year}`;
    },
    UnitedStatesDateFormat(date) {
        const nameMonths = {
            'ENE': '01',
            'FEB': '02',
            'MAR': '03',
            'ABR': '04',
            'MAY': '05',
            'JUN': '06',
            'JUL': '07',
            'AGO': '08',
            'SEP': '09',
            'OCT': '10',
            'NOV': '11',
            'DIC': '12'
        }
        const [day, month, year] = String(date).split('/');
        return `${month}/${day}/${year}`;
    },
    GetAmounts(_data_) {
        const allDiscounts = [
            '010-DF',
            '010-DC',
            '015-DC',
            '005-DT',
            '010-DT',
            '010-DTT',
            '050-BTT',
            '100-BTT',
            '050-BT/201-RR',
            '100-BT/201-RR',
            '050-MB',
            '100-BC'
        ]
        const others = [

        ]
        const sanitizeSTR = (str) => {
            return parseFloat(String(str).trim().replaceAll(',', ''));
        }

        let Colegiatura = 0;
        let Libro = 0;
        let Descuento = 0;
        let Otros = 0;
        let Retencion = 0;
        _data_.forEach(row => {
            const _amount_ = sanitizeSTR(row.AMOUNT);
            if (row.CODE.includes('CLG')) {
                Colegiatura += _amount_;
            } else if (row.CODE.includes('LBR')) {
                Libro += _amount_;
            } else if (allDiscounts.includes(row.CODE)) {
                Descuento += _amount_;
            } else if (['RET_1', 'RET_2', 'RET_1_2'].includes(row.CODE)) {
                Retencion += _amount_;
            } else {
                Otros += _amount_;
            }

        })

        return {
            IMPORTE_COLEGIATURA: Colegiatura,
            IMPORTE_LIBRO: Libro,
            IMPORTE_DESCUENTO: Descuento,
            IMPORTE_RETENCION: Retencion,
            IMPORTE_OTROS: Otros
        };

    },
    SetObservations({ notes = '', receiptType = '', prefix = null, isPrint = false } = {}) {
        let othersServices = String(((window.tabla.getData()).rows).filter(row => (!['CLG', 'LBR', 'CAN'].includes(String(row.Col1).trim().toUpperCase()))).map(row => {

            let CODE = ((row.Col1).includes('005-') ||
                (row.Col1).includes('010-') ||
                (row.Col1).includes('015-') ||
                (row.Col1).includes('020-') ||
                (row.Col1).includes('050-') ||
                (row.Col1).includes('100-') ||
                (row.Col1).includes('801-') ||
                (row.Col1).includes('802-')
            ) ? row.Col1 + '/' : null;
            let DITAIL = String(row.Col2).trim() + " " + String(row.Col3).trim() + " " + String(row.Col4).trim();

            let PRICE = '';

            if (isPrint) {
                PRICE = null;
            } else {
                PRICE = (row?.Col5 || null) ? " C$" + row?.Col5 : null;
            }


            (['OTROS', 'ANT', 'BTL-PLAST', 'CAM-GRAD']) ? ((row?.Col5 || null) ? " C$" + row?.Col5 : null) : null;
            return [CODE, DITAIL, PRICE].join('.');

        }).join("/")).trim().toUpperCase() || '';




        // 1) Agregar notas con separador si corresponde
        if (notes !== '') {
            const separator = othersServices !== '' ? '/' : '';
            othersServices += separator + notes;
        }

        // 2) Prefijo según el tipo de recibo
        let ExtraBook = '';

        if (receiptType === 'CLG-REPITE') {
            const hasExtraBook = othersServices.includes('LIBRO (EXTRA)');
            ExtraBook = hasExtraBook
                ? '201-RP/REPITENTE Y PAGÓ '
                : '200-RP/REPITENTE NO LLEVA LIBRO/';
        }

        const normalized = (str) => {
            let s = String(str);
            let prev;
            do {
                prev = s;
                s = (s
                    .replaceAll('/.', '/')
                    .replaceAll('./', '/')
                    .replaceAll(' .', '.')
                    .replaceAll(':  -', '')
                    .replaceAll(' /', '/')).replace(/\/+$/, '');
            } while (s !== prev);
            return s;
        };
        return [prefix, normalized(ExtraBook + othersServices)].map(r => String(r ?? '').trim()).filter(Boolean).join('/');
    },
    CreateDialogField({
        label = '', tag = 'input', id = '', className = '', value = '', options = []
    } = {}) {
        const contenDialogfield = document.createElement('div');
        contenDialogfield.classList.add('dialog-field', 'one_of_one');
        if (typeof className === 'string' && className != '') {

            (className.split(' ')).forEach(item => {
                contenDialogfield.classList.add(item);
            })
        }
        const _label_ = document.createElement('label');
        _label_.appendChild(document.createTextNode(label));
        _label_.setAttribute('for', id + '_field');
        const _element_ = document.createElement(tag);
        if (tag === 'select' && options.length > 0) {
            options.forEach(op => {
                const _option_ = document.createElement('option');
                if (op?.value) _option_.value = op.value;
                if (op?.label) _option_.text = op.label;
                _element_.appendChild(_option_);
            })
        } else {
            _element_.value = value;
        }


        if (id != '') {
            contenDialogfield.id = id
            _element_.id = id + '_field';
            _element_.name = id + '_field'
        };

        contenDialogfield.appendChild(_label_);
        contenDialogfield.appendChild(_element_);
        return contenDialogfield;
    },
    hideOthersComments({ hide = true, ctx = null, showComment = false, placeholder = '' } = {}) {

        const col3 = 'Col3';
        const col4 = 'Col4';



        const _input_COL3_ = $getEl('.dynamic-table-dialog div[data-col="' + col3 + '"]');
        const _input_COL4_ = $getEl('.dynamic-table-dialog div[data-col="' + col4 + '"]');


        if (hide) {
            if (_input_COL3_) _input_COL3_._removeClass('dialog-field--hidden');
            if (_input_COL4_) _input_COL4_._addClass('dialog-field--hidden');

        } else {
            if (_input_COL3_) _input_COL3_._addClass('dialog-field--hidden');
            if (_input_COL4_) _input_COL4_._removeClass('dialog-field--hidden');
        }

        if (showComment) {
            _input_COL4_._removeClass('dialog-field--hidden');
        }
        if (ctx) {
            if (hide) {


                ctx.setValue({ colKey: col3, val: '', readOnly: false, disabled: false, placeholder: String(placeholder).trim() });

            } else {
                ctx.setValue({ colKey: col3, val: '-', readOnly: true, disabled: true });
            }
            ctx.setValue({ colKey: col4, val: '', readOnly: false, disabled: false });
        }

    },
    InsertAmount({ data = {} } = null) {

        if (!data) return;
        const CreateAmountBox = ({ data = {}, isTotal = false } = {}) => {
            if (!data && !data?.label && !data?.amount) return;

            const box = document.createElement('div');
            box.classList.add('container-amounts');
            if (isTotal) {
                box.classList.add('black');
            }


            const label = document.createElement('span');
            label.classList.add('label');
            label.textContent = String(data.label).replace(' SÉBACO', '').replace(' SAN ISIDRO', '').replace(' LA TRINIDAD', '');

            const amount = document.createElement('span');
            amount.classList.add('amount');
            amount.textContent = data.amount;

            box.appendChild(label);
            box.appendChild(amount);

            return box;
        }
        const _box_concepts_ = $getEl('#preview-print .box_concepts');

        const amount = {
            productos: data.rows.map(_row_ => {
                let _label_ = [];
                if ((_row_?.Col2).includes('/')) {
                    _label_ = (_row_?.Col2).split('/');
                }
                else {
                    _label_[0] = _row_?.Col2;
                }
                return {
                    label: String(_label_[0]).trim().toUpperCase() + ' (C$)',
                    amount: _row_?.Col5
                }
            }),
            total: [{
                label: 'TOTAL:', amount: data.totals.Col5
            }]
        }


        if (_box_concepts_._exist()) {
            _box_concepts_.forEach(el => {
                el.replaceChildren();
                (amount.productos || []).forEach(item => {
                    const _new_amount_box_ = CreateAmountBox({ data: item });
                    el.appendChild(_new_amount_box_);
                });

                (amount.total || []).forEach(item => {
                    const _new_amount_box_ = CreateAmountBox({ data: item, isTotal: true });
                    el.appendChild(_new_amount_box_);
                });
            })
        }
    },
    updateDateTime() {
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        const day = String(hoy.getDate()).padStart(2, '0');
        let _new_date_localStorage_ = JSON.parse(localStorage.getItem(window._SEDE_ + "_new_date"));

        let _current_date_ = `${day}/${_HELPERS_.loadMonthName({ month: month })}/${year}`;
        if ((_new_date_localStorage_?.status || false) == true) {
            _current_date_ = _new_date_localStorage_.day + "/" + this.loadMonthName({ month: _new_date_localStorage_.month }) + "/" + _new_date_localStorage_.year;
        } else {
            _new_date_localStorage_ = { status: true, day: day, month: month, year: year };
        }

        const dateScreen = document.getElementById('txt_date');
        if (dateScreen) {
            dateScreen.value = _current_date_;
        }

        const datePrint = document.querySelectorAll('#preview-print .page .date');
        if (datePrint) {

            datePrint.forEach(_date_ => {
                let day = _date_.querySelector('span.number-day');
                let month = _date_.querySelector('span.number-month');
                let year = _date_.querySelector('span.number-year');

                if (day) { day.replaceChildren(); day.appendChild(document.createTextNode(_new_date_localStorage_.day)) };
                if (month) { month.replaceChildren(); month.appendChild(document.createTextNode(_HELPERS_.loadMonthName({ month: _new_date_localStorage_.month }))) };
                if (year) { year.replaceChildren(); year.appendChild(document.createTextNode(_new_date_localStorage_.year)) };
            });
        }

        return _current_date_;
    },
    loadMonthName({ month = null, length = 'short' }) {
        if (month === null) return 'ENE';
        const meses = {
            '1': { long: 'ENERO', short: 'ENE' },
            '2': { long: 'FEBRERO', short: 'FEB' },
            '3': { long: 'MARZO', short: 'MAR' },
            '4': { long: 'ABRIL', short: 'ABR' },
            '5': { long: 'MAYO', short: 'MAY' },
            '6': { long: 'JUNIO', short: 'JUN' },
            '7': { long: 'JULIO', short: 'JUL' },
            '8': { long: 'AGOSTO', short: 'AGO' },
            '9': { long: 'SEPTIEMBRE', short: 'SEP' },
            '10': { long: 'OCTUBRE', short: 'OCT' },
            '11': { long: 'NOVIEMBRE', short: 'NOV' },
            '12': { long: 'DICIEMBRE', short: 'DIC' }
        };

        if (!meses[month]) return '';
        return length === 'short' ? meses[Number(month)].short : meses[Number(month)].long;
    },
    padWithZeros({ value = '', length = 1, direction = 'left' }) {
        const str = String(value);

        if (direction === 'left') {
            return str.padStart(length, '0');
        }

        if (direction === 'right') {
            return str.padEnd(length, '0');
        }

        return str; // dirección no válida → devuelve sin cambios
    },
    sumNumericValues(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return 0;

        return arr.reduce((acc, value) => {
            const num = Number(String(value).replace(/,/g, ''));
            return Number.isNaN(num) ? acc : acc + num;
        }, 0);
    },
    esNumerico(value = null) {
        // Verifica que el valor no sea null o booleano
        if (value === null || typeof value === 'boolean') {
            return false;
        }

        value = String(value).replace(',', '').trim();
        // Si es tipo number y no es NaN
        if (typeof value === 'number') {
            return !Number.isNaN(value);
        }

        // Si es cadena, intenta convertirla a número
        if (typeof value === 'string' && value.trim() !== '') {
            return !Number.isNaN(Number(value));
        }

        // Otros tipos no son numéricos
        return false;
    },
    updateCSS({ selector = null, style = { prop: null, value: null } }) {

        if (!selector && !style.prop && !style.value) return;


        const _field_ = document.querySelectorAll(selector);

        if (_field_) {
            _field_.forEach(el => {
                el.style[style.prop] = style.value;
            })
            /*  if (option.value === 'LBR') {
                  if (_field_2_) {
                      _field_2_.style.display = 'none';
                  }
              }*/
        }

    },
    existe(v) {
        return v !== undefined
            && v !== null
            && String(v).trim() !== '';
    },
    getClassByPrefix(elemento, prefijo) {
        const clase = [...elemento.classList].find(c => c.startsWith(prefijo));
        return clase ? String(clase.slice(prefijo.length)).toLowerCase().trim() : null;
    },
    DisableMaterialInputs(selector = null) {
        let MaterialInputs;
        let _selector_string_ = selector ? selector.split(',').map(word => `.material-design[data-field_status="${word}"]`).join(', ') : null;
        if (selector != null) {
            MaterialInputs = document.querySelectorAll(_selector_string_);
            MaterialInputs.forEach(element => {
                element.classList.add('txt_disabled')
                element.classList.remove('show_book_name');
            });
        } else {
            MaterialInputs = document.querySelectorAll('.material-design[data-field_status]');

            MaterialInputs.forEach(element => {
                element.classList.add('txt_disabled');
                element.classList.remove('show_book_name');

                if (element.classList.contains('material-design')) {
                    const fields = element.querySelectorAll('input,select,textarea');
                    fields.forEach(field => {
                        field.readOnly = true;
                        field.disabled = true;
                        field.value = '';
                    });
                }
            });
        }

    },
    EnableMaterialInputs(selector) {
        let MaterialInputs;
        let _selector_string_ = selector ? selector.split(',').map(word => `.material-design[data-field_status="${String(word).trim()}"]`).join(', ') : null;
        if (selector != null) {
            MaterialInputs = document.querySelectorAll(_selector_string_);
            MaterialInputs.forEach(element => {
                element.classList.remove('txt_disabled');
                if (element.classList.contains('material-design')) {
                    const fields = element.querySelectorAll('input,select,textarea');
                    fields.forEach(field => {
                        field.readOnly = false;
                        field.disabled = false;
                        field.value = '';
                    });
                }
            });
        } else {
            MaterialInputs = document.querySelectorAll('[data-field_status="txt_company"]');
            MaterialInputs.forEach(element => {
                element.classList.remove('txt_disabled');
            });
        }

    },
    LoadSimpleSelect(selector, json = null) {
        const select = document.querySelector(selector);
        if (!select) {
            console.error(`No se encontró el elemento: ${selector}`);
            return;
        }

        // Si json es null, undefined o un objeto vacío, solo limpiar
        if (!json || (typeof json === 'object' && !Array.isArray(json) && Object.keys(json).length === 0)) {
            select.replaceChildren();
            return;
        }



        const fragment = document.createDocumentFragment();

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.selected = true;
        defaultOption.appendChild(document.createTextNode(''));
        fragment.appendChild(defaultOption);



        json.forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.appendChild(document.createTextNode(item.label));
            fragment.appendChild(option);
        });

        select.replaceChildren(fragment);
    },
    LoadSession(selector, json) {
        const select = document.querySelector(selector);
        if (!select) {
            console.error(`No se encontró el elemento: ${selector}`);
            return;
        }

        const fragment = document.createDocumentFragment();

        const optVacia = document.createElement('option');
        optVacia.value = '';
        fragment.appendChild(optVacia);

        const sesion = json.sesion || {};

        Object.keys(sesion).sort().forEach(anio => {
            const grupos = sesion[anio] || {};

            Object.keys(grupos).forEach(nombreGrupo => {
                const sesiones = grupos[nombreGrupo] || {};
                const optgroup = document.createElement('optgroup');
                optgroup.label = nombreGrupo;

                Object.keys(sesiones).sort().forEach(clave => {
                    const item = sesiones[clave];
                    const option = document.createElement('option');
                    option.value = item.VALUE;
                    option.textContent = item.LABEL;
                    optgroup.appendChild(option);
                });

                if (optgroup.children.length > 0) {
                    fragment.appendChild(optgroup);
                }
            });
        });

        select.replaceChildren(fragment);
    },
    formatWithCommasAndDecimals(cadena) {
        // Validar que sea string
        cadena = String(cadena || '').trim();
        if (typeof cadena !== 'string') return null;

        // Limpiar espacios
        let valor = cadena.trim();
        if (valor === '') return null;

        // Quitar comas de miles (solo si están en posición de miles)
        // Ej: "5,479" -> "5479" | "1,234,567.89" -> "1234567.89"
        valor = valor.replace(/,(?=\d{3}(\D|$))/g, '');

        // Validar que sea numérico (enteros, decimales, negativos)
        if (!/^-?\d+(\.\d+)?$/.test(valor)) return null;

        // Convertir a número
        const numero = parseFloat(valor);
        if (!isFinite(numero)) return null;

        // Formatear con comas de miles y 2 decimales
        return numero.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }


}




function UpdatePrintBox() {

    const _ELEMENT_ = $getEl("#preview-print .page");

    if (!_ELEMENT_._exist()) return false;

    const _DATA_ = window._RECEIPT_DETAILS;




    if (_DATA_) {








        const paymentMethods = JSON.parse(window.ChoiceField.getAllChoicesJSON(undefined, { pretty: true }));
        const paymentMethods_Values = paymentMethods.filter(field => (field.checked === true && field.accepted === true)).map(field => {
            const flat = field.menu.flat;
            _value_ = flat?.["details-cash_total"] || (flat?.["details-autosum"] || 0);
            let _details_ = '';
            if (field.type_template == "autosum") {
                _details_ = flat.row.map(obj => Object.values(obj)) // [["sdfsd", 7848], ["454", 457], ["", ""]]
                    .filter(([ref, amount]) => !(ref === '' && amount === '')) // quita los que tienen ambos vacíos
                    .map(([ref, amount], i) => ((String(ref).trim() !== "") ? ` [REF#${i + 1}:${ref} ` : `[`) + `MONTO:C$${amount}]`);
            } else {
                _details_ = [" MONTO: C$" + _value_ + (flat?.["details-cash_total"] && flat?.["details-cash_change"] ? ((flat?.["details-cash_change"] || 0) > 0 ? " ~ VUELTO: C$:" + flat["details-cash_change"] : "") : "")];
            }
            return {
                key: field.label,
                value: _value_,
                print: _details_
            }
        }) || [];


        let _notes_ = '';
        if (paymentMethods_Values.length > 0) {

            const resultado = paymentMethods_Values
                .map(({ key, print = [] }) => ` EN ${key}:${print.join(',')}`)
                .join('.|');
            _notes_ = resultado + '.';
        }



        othersServices = _HELPERS_.SetObservations({
            notes: _DATA_.NOTES_().value,
            receiptType: _DATA_.RECEIPT_TYPE().value,
            isPrint: true,
        });




        const UpdateValue = {
            "txt_numToText": window.NumeroALetras.convertir(tabla.getTotalAllColumn().Col5),
            "txt_name": _DATA_.NAME_COMPANY().value,
            "txt_session": _DATA_.COURSE_NUMBER().value,
            "txt_level_category": _DATA_.LEVELS_CATEGORIES().value,
            "txt_book_name": _DATA_.BOOK_TITLE().value,
            "txt_notes": _notes_,
            "txt_other_notes": ((othersServices !== '') ? othersServices : null)
        }


        window._RECEIPT_DETAILS.add('OBSERVATIONS', othersServices);








        _ELEMENT_.forEach(page => {

            _ContainerFields_ = page.querySelectorAll('[data-idField*="txt_"]');
            if (_ContainerFields_) {

                _ContainerFields_.forEach(_field_ => {
                    const _dataset_idField_ = String(_field_.dataset.idfield || '').trim();

                    if (Object.keys(UpdateValue).includes(_dataset_idField_)) {
                        const _value_ = UpdateValue[_dataset_idField_] || '';
                        const SpanValue = _field_.querySelector(".value") || null;
                        const SpanLabel = _field_.querySelector(".label") || null;


                        if (SpanValue) {
                            SpanValue.replaceChildren();
                            _field_.classList.remove('hide');

                            if (_dataset_idField_ === "txt_notes") {
                                if (UpdateValue.txt_other_notes) {
                                    SpanValue.appendChild(document.createTextNode(UpdateValue.txt_other_notes));
                                }
                                const _methods_ = $CreateTag({
                                    tag: 'span',
                                    className: '_methods_'


                                });
                                const _methods_title_ = $CreateTag({
                                    tag: 'span',

                                    textContent: 'MÉTODO DE PAGO:',

                                });
                                const _methods_containerList_ = $CreateTag({
                                    tag: 'ul',

                                });
                                (_value_.split('|')).forEach(method => {
                                    const _method_ = $CreateTag({
                                        tag: 'li',
                                        textContent: method
                                    });
                                    _methods_containerList_.appendChild(_method_);
                                })
                                _methods_.appendChild(_methods_title_);
                                _methods_.appendChild(_methods_containerList_);

                                SpanValue.appendChild(_methods_);


                            } else if (_dataset_idField_ === "txt_name") {
                                SpanLabel.replaceChildren();
                                if (_DATA_.COMPANY().value !== '') {
                                    SpanLabel.appendChild(document.createTextNode('RECIBIMOS DE:\nEN REPRESENTACIÓN DE:'));
                                } else {
                                    SpanLabel.appendChild(document.createTextNode('RECIBIMOS DE:'));
                                }
                                SpanValue.appendChild(document.createTextNode(_value_));
                            } else if (_dataset_idField_ === "txt_book_name" && _value_ === "") {
                                _field_.classList.add('hide');
                            } else {

                                SpanValue.appendChild(document.createTextNode(_value_));
                            }
                        }
                    }

                });



            }
        });
        _HELPERS_.InsertAmount({ data: window.tabla.getData() });
    }
}
const actualizarEstadoConexion = (online) => {
    // console.log(online ? '🟢 Conexión restaurada' : '🔴 Conexión perdida');

    const status_connection = document.querySelector('.type-conection');
    if (!status_connection) return;

    const icon = status_connection.querySelector('[class*="icon-"]');
    if (icon) {
        icon.classList.toggle('icon-connected', online);
        icon.classList.toggle('icon-unconnected', !online);
    }

    const label = status_connection.querySelector('i:not([class*="icon-"])');
    if (label) {
        label.textContent = online ? 'Con Conexión' : 'Sin Conexión';
    }
};

window.addEventListener('online', () => actualizarEstadoConexion(true));
window.addEventListener('offline', () => actualizarEstadoConexion(false));



window.addEventListener('load', function () {
    if (typeof (Storage) !== "undefined") {


        /*
         window._NEW_DATE_ = { status: false, day: "", month: "", year: "" };
        window._SEDE_ = 'LEO';
        */

        window._SERIAL_NUMBER_ = localStorage.getItem("serial_number_" + window._SEDE_);

        if (window._SERIAL_NUMBER_ === null) {
            localStorage.setItem("serial_number_" + window._SEDE_, "A|00000");
            window._SERIAL_NUMBER_ = "A|00000";
        }
        try {
            window._NEW_DATE_ = JSON.parse(localStorage.getItem("new_date_" + window._SEDE_));

        } catch (error) {
            window._NEW_DATE_ = null;
        }

        if (window._NEW_DATE_ === null) {
            localStorage.setItem("new_date_" + window._SEDE_, JSON.stringify({ status: false, day: "", month: "", year: "" }));
            window._NEW_DATE_ = JSON.parse(localStorage.getItem("new_date_" + window._SEDE_));

        } else {


        }
    } else {
        // { status: false, day: "", month: "", year: "" }
        window._NEW_DATE_ = { status: false, day: "", month: "", year: "" };
        window._SERIAL_NUMBER_ = "A|00000";

    }

    var _serie_and_number_ = window._SERIAL_NUMBER_.split("|") || ["A", "000001"];
    const num_recibo_el = $getEl("#txt_receipt_number");

    if (num_recibo_el) {


        num_recibo_el.value = (String("SERIE " + _serie_and_number_[0] + " #" + _serie_and_number_[1]).trim());
    }
    window._RECEIPT_DETAILS = (() => {
        // ---------- helpers (encerrados, no expuestos) ----------
        const getEl = (selector) => document.querySelector(selector);

        const read = (selector) => {
            const el = getEl(selector);
            return el ? String(el.value ?? '').trim() : '';
        };

        const upper = (selector) => read(selector).toUpperCase();

        const write = (selector, value) => {
            const el = getEl(selector);
            if (el) el.value = String(value ?? '');
        };

        const capitalize = (str) =>
            String(str ?? '')
                .toLowerCase()
                .replace(/\p{L}[\p{L}\p{N}]*/gu, (w) => w.charAt(0).toUpperCase() + w.slice(1));

        // ---------- campos simples (generados) ----------
        const simpleFields = {
            RECEIPT_NUMBER: '#txt_receipt_number',
            RECEIPT_TYPE: '#txt_receipt_type',
            DATE: '#txt_date',
            NAME: '#txt_name',
            COMPANY: '#txt_company',
            CONTAC_NAME: '#txt_contact_name',
            PHONE: '#txt_phone',
            EMAIL: '#txt_email',
            BIRTHDATE: '#txt_birthdate',
            SESSION: '#txt_session',
            CATEGORIES: '#txt_categories',
            LEVELS: '#txt_levels',
            BOOK_TITLE: '#txt_book',
            NOTES_: '#txt_notes',
        };

        const api = {};

        for (const [key, selector] of Object.entries(simpleFields)) {
            api[key] = () => ({
                value: upper(selector),
                update: (v) => { write(selector, v) },
            });
        }

        // ---------- campos compuestos ----------
        api.NAME_COMPANY = () => ({
            value: (() => {
                const company = read('#txt_company');
                const name = read('#txt_name');
                const v = company ? `${company}\n${name}` : name;
                return v.trim().toUpperCase();
            })(),
            // "COMPANY\nNAME" → escribe en #txt_company y #txt_name
            update: (v) => {
                const [company = '', ...rest] = String(v ?? '').split('\n');
                write('#txt_company', company);
                write('#txt_name', rest.join('\n'));
            },
        });

        api.LEVELS_CATEGORIES = () => ({
            value: (() => {
                const cat = read('#txt_categories');
                const lev = read('#txt_levels');
                return String(lev ? `${lev} - ${cat}` : cat).trim().replace('_', '');
            })(),
            // "LEVELS - CATEGORIES" (o solo "CATEGORIES") → escribe en cada input
            update: (v) => {
                const raw = String(v ?? '').trim();
                const sepIdx = raw.indexOf(' - ');
                if (sepIdx === -1) {
                    write('#txt_levels', '');
                    write('#txt_categories', raw);
                } else {
                    write('#txt_levels', raw.slice(0, sepIdx).trim());
                    write('#txt_categories', raw.slice(sepIdx + 3).trim());
                }
            },
        });

        api.COURSE_NUMBER = () => ({
            value: read('#txt_session').slice(-2),
            // reemplaza los últimos 2 caracteres del session
            update: (v) => {
                const session = read('#txt_session');
                const tail = String(v ?? '').slice(-2);
                write('#txt_session', session.slice(0, -2) + tail);
            },
        });

        // ---------- lista dinámica de claves ----------
        const valueKeys = [
            ...Object.keys(simpleFields),
            'COURSE_NUMBER',
            'NAME_COMPANY',
            'LEVELS_CATEGORIES',
        ];

        // ---------- utilidades públicas ----------
        api.capitalize = capitalize;
        api.getEl = getEl;

        /**
         * Agrega o REEMPLAZA una propiedad dinámica.
         *
         *   add('CONCEPT_', 'Pago mensual')
         *   add('INVOICE_', { selector: '#txt_invoice' })
         *   add('TOTAL_',  () => 'calculado')
         */
        api.add = (name, value) => {
            const key = String(name ?? '').trim();
            if (!key) throw new Error('add(): el nombre es requerido');

            const protectedKeys = ['add', 'remove', 'getAll', 'update', 'getEl', 'capitalize'];
            if (protectedKeys.includes(key)) {
                throw new Error(`add(): "${key}" es un método reservado`);
            }

            let getter;

            if (typeof value === 'function') {
                // getter dinámico con override opcional
                let override;
                getter = () => ({
                    value: override !== undefined ? String(override) : String(value() ?? ''),
                    update: (v) => { override = String(v ?? ''); },
                });
            } else if (value && typeof value === 'object' && 'selector' in value) {
                getter = () => ({
                    value: upper(value.selector),
                    update: (v) => write(value.selector, v),
                });
            } else {
                let stored = String(value ?? '');
                getter = () => ({
                    value: stored,
                    update: (v) => { stored = String(v ?? ''); },
                });
            }

            const exists = Object.prototype.hasOwnProperty.call(api, key);
            api[key] = getter;

            if (!valueKeys.includes(key)) valueKeys.push(key);
            return api;
        };

        /**
         * Elimina una propiedad dinámica previamente agregada.
         */
        api.remove = (name) => {
            const key = String(name ?? '').trim();
            const idx = valueKeys.indexOf(key);
            if (idx === -1) return api;
            valueKeys.splice(idx, 1);
            delete api[key];
            return api;
        };

        /**
         * Atajo: _RECEIPT_DETAILS.update('NAME_', 'PEDRO')
         */
        api.update = (name, value) => {
            const key = String(name ?? '').trim();
            const fn = api[key];
            if (typeof fn !== 'function') return api;
            const obj = fn();
            if (obj && typeof obj.update === 'function') obj.update(value);
            return api;
        };

        api.getAll = () => {
            const out = {};
            for (const key of valueKeys) {
                const fn = api[key];
                if (typeof fn === 'function') out[key] = fn().value;
            }
            return out;
        };

        return api;
    })();

    const floating = new WheelFloating({
        element: '#preview-print',
        excludeSelector: '#Dynacmic-table-eli, .swal2-container, .mdl-msgbox-root',   // '.scroll-box, .otro-panel'
        threshold: 2,
        hideDelay: 0,
        minAllowedWidth: 600,    // si el viewport < 600px → efecto desactivado
        minScroll: 150,    // mostrar solo tras acumular 200 de deltaY bajando
        closeOnEsc: true,
        closeOnClick: true,
        closeButton: true,
        closeButtonLabel: '✕',
        onClose: () => console.log('Flotante cerrado')
    });

    actualizarEstadoConexion(navigator.onLine);

    window.ChoiceField = new ChoiceContainerBuilder({
        selector: '.choice-container[data-choice_id]',
        choices: [
            {
                id: 'txt_method_cash',
                label: 'Efectivo',
                type_element: 'checkbox',
                maxAmount: 0.00,
                template: {
                    label: 'Detalle el pago recibido en efectivo:',  // ✅ NUEVO
                    type: 'cash_calculator',
                    denominations: [1000, 500, 200, 100, 50, 20, 10, 5, 1, 0.5]
                }
            },
            {
                id: 'txt_method_card',
                label: 'Tarjeta',
                type_element: 'checkbox',

                template: {
                    type: 'autosum',
                    table: [{
                        label: 'Escriba los datos de los cheques:',
                        headers: ['# Autorización', 'Monto'],
                        fields: [
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-1' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-1' }
                            ],
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-2' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-2' }
                            ],
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-3' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-3' }
                            ]
                        ]
                    }]
                }
            },
            {
                id: 'txt_method_telepago',
                label: 'Cheque',
                type_element: 'checkbox',

                template: {
                    type: 'autosum',
                    table: [{
                        label: 'Escriba los datos del telepago:',
                        headers: ['Referencia', 'Monto'],
                        fields: [
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-1' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-1' }
                            ]
                        ]
                    }]
                }
            },
            {
                id: 'txt_method_deposit',
                label: 'Cheque',
                type_element: 'checkbox',

                template: {
                    type: 'autosum',
                    table: [{
                        label: 'Escriba los datos de los depósitos o transferencias:',
                        headers: ['Referencia', 'Monto'],
                        fields: [
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-1' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-1' }
                            ],
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-2' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-2' }
                            ],
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-3' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-3' }
                            ]
                        ]
                    }]
                }
            },
            {
                id: 'txt_method_check',
                label: 'Cheque',
                type_element: 'checkbox',

                template: {
                    type: 'autosum',
                    table: [{
                        label: 'Escriba Datos de los Cheques:',
                        headers: ['Referencia', 'Monto'],
                        fields: [
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-1' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-1' }
                            ],
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-2' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-2' }
                            ],
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-3' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-3' }
                            ]
                        ]
                    }]
                }
            },

        ],
        context: document,
        preserveAttributes: true,
        onlyEmpty: true,
        autoAttachEvents: true,
        debug: false,
        onclick: (element, isChecked, meta) => {


            if (['txt_retention_1percent', 'txt_retention_2percent'].includes(meta.choiceId)) {

                const paymentMethods = JSON.parse(window.ChoiceField.getAllChoicesJSON(undefined, { pretty: true }));
                let txt_retention_1percent, txt_retention_2percent, txt_retention;
                if (paymentMethods) {
                    txt_retention = Object.fromEntries(paymentMethods.filter(choice => ['txt_retention_1percent', 'txt_retention_2percent'].includes(choice.choiceId)).map(chioce => {
                        return {
                            id: String(chioce.choiceId).replace('txt_retention', ''),
                            checked: Boolean(chioce.checked)
                        }
                    }).map(({ id, checked }) => [id, checked])
                    ) || null;

                    if (txt_retention) {

                        if (tabla.getTotalAllColumn()) {
                            let total = (tabla.getTotalAllColumn()).__raw['Col5'] || 0;

                            if (total === 0) return;
                            tabla.removeRow('RETENCION');

                            let code = '';
                            let label = '';
                            let mount = 0;
                            if (txt_retention._1percent && !txt_retention._2percent) {
                                code = 'RET_1';
                                label = 'RETENCIÓN (1%): ';
                                mount = -(total * (1 / 100));
                            } else if (!txt_retention._1percent && txt_retention._2percent) {
                                code = 'RET_2';
                                label = 'RETENCIÓN (2%): ';
                                mount = -(total * (2 / 100));
                            } else if (txt_retention._1percent && txt_retention._2percent) {
                                code = 'RET_1_2';
                                label = 'RETENCIÓN (1% y 2%): ';
                                mount = -(total * (3 / 100));
                            }

                            if (mount < 0) {
                                tabla.insertRow({
                                    row: { Col1: code, Col2: label, Col4: '-', Col5: mount },
                                    remove: false,
                                    idRow: 'RETENCION'
                                });
                            }

                        }
                    }



                }


            }



        },
        // ---------- 👇 NUEVO: onchange ----------
        onchange: (element, values) => {


            UpdatePrintBox();

        },
        onAccept: (accepted, container, ctx) => {
            $getEl("footer .container-actionbuttons>span, #Dynacmic-table-eli, #txt_notes")._enable();
            if (accepted.choiceId == 'txt_method_telepago') {
                [
                    'txt_method_cash',
                    'txt_method_card',
                    'txt_method_deposit',
                    'txt_method_check',
                    'txt_method_advance',
                    'txt_retention_1percent',
                    'txt_retention_2percent'
                ].forEach(_selector => ctx.uncheck("[data-choice_id=" + _selector + "]"))


            } else {
                ctx.uncheck('[data-choice_id="txt_method_telepago"]');
            }


        },
        onOpen(container, meta, b) {
            $getEl("footer .container-actionbuttons>span, #Dynacmic-table-eli, #txt_notes")._disable();
            const AllChoicesJSON = (JSON.parse(window.ChoiceField.getAllChoicesJSON(undefined, { pretty: true })) || []).filter(choice => !['txt_method_cash', 'txt_retention_1percent', 'txt_retention_2percent'].includes(choice.choiceId || ''));
            console.log(JSON.stringify(AllChoicesJSON, null, 2));

            TotalRecibido = (AllChoicesJSON.map(choice => {
                return choice.autosum;
            }) || [0, 0]).reduce((acc, n) => acc + n, 0);


            const v = parseFloat((tabla.getTotalAllColumn()).__raw['Col5'] || 0) - TotalRecibido;
            window.ChoiceField.setMaxAmount('txt_method_cash', v === '' ? null : Number(v));

            console.log('open', `▲ open → ${meta.choiceId} (${meta.reason})`, ` RECIBIDO C$ ${v}`);
            //refresh();
        },
        onClose(container, reason, meta, b) {
            $getEl("footer .container-actionbuttons>span, #Dynacmic-table-eli, #txt_notes")._enable();
            console.log('close', `▼ close → ${meta.choiceId} (${reason})`);
            //refresh();
        },

    });
    const total = window.ChoiceField.buildAll();

    _HELPERS_.LoadSession("#txt_session", window._SESIONES_);


    window.tabla = new DynamicTable('#Dynacmic-table-eli', {
        addItemButtonText: '[+] Click aquí para agregar otro producto',
        Styles: {
            Col5: {

                '[data-field-type]': {
                    'text-align': 'right'
                }
            }
        },
        onChange: async (ctx) => {

            if (ctx.rowId !== 'RETENCION') {
                ctx.silent(() => {
                    ctx.removeRow('RETENCION');
                });
                const paymentMethods = JSON.parse(window.ChoiceField.getAllChoicesJSON(undefined, { pretty: true }));
                let txt_retention_1percent, txt_retention_2percent, txt_retention;
                if (paymentMethods) {
                    txt_retention = Object.fromEntries(paymentMethods.filter(choice => ['txt_retention_1percent', 'txt_retention_2percent'].includes(choice.choiceId)).map(chioce => {
                        return {
                            id: String(chioce.choiceId).replace('txt_retention', ''),
                            checked: Boolean(chioce.checked)
                        }
                    }).map(({ id, checked }) => [id, checked])
                    ) || null;

                    if (txt_retention) {

                        if (ctx.getTotalAllColumn()) {
                            let total = (ctx.getTotalAllColumn()).__raw['Col5'] || 0;

                            if (total === 0) return;




                            let code = '';
                            let label = '';
                            let mount = 0;
                            if (txt_retention._1percent && !txt_retention._2percent) {
                                code = 'RET_1';
                                label = 'RETENCIÓN (1%): ';
                                mount = -(total * (1 / 100));
                            } else if (!txt_retention._1percent && txt_retention._2percent) {
                                code = 'RET_2';
                                label = 'RETENCIÓN (2%): ';
                                mount = -(total * (2 / 100));
                            } else if (txt_retention._1percent && txt_retention._2percent) {
                                code = 'RET_1_2';
                                label = 'RETENCIÓN (1% y 2%): ';
                                mount = -(total * (3 / 100));
                            }

                            if (mount < 0) {
                                tabla.insertRow({
                                    row: { Col1: code, Col2: label, Col4: '-', Col5: mount },
                                    remove: false,
                                    idRow: 'RETENCION'
                                });
                            }

                        }
                    }



                }
            }
            UpdatePrintBox();
        }
    });

    tabla.setHeaders({
        Col1: 'SERVICIOS',
        Col2: 'DEFINICIÓN DEL SERVICIO',
        Col3: 'DETALLES DEL SERVICIO',
        Col4: 'OTROS COMENTARIOS',
        Col5: 'MONTO'
    });

    tabla.setFieldSchema({
        Col1: {
            type: 'select',
            required: true,
            visible: true,
            options: [

                { value: 'LBR-EXTRA', idRow: 'LIBRO', label: 'COMPRA DE LIBRO', idSlug: true, blockRow: true },
                { value: 'MORA', label: 'MORA POR INSCRIPCIÓN TARDÍA', price: '700', idSlug: true, blockRow: true },
                { value: 'OTROS', label: 'OTROS SERVICIOS', idSlug: false, blockRow: false },


                {
                    group: {
                        label: "BECAS",
                        options: [
                            {
                                value: '050-MB',
                                label: '50% MEDIA BECA',
                                discount: {
                                    type: 'percentage',
                                    value: '50'
                                },
                                insertAfterto: {
                                    cell: 'Col1',
                                    search: 'CLG'
                                },


                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                            {
                                value: '100-BC', label: '100% BECA COMPLETA',
                                discount: {
                                    type: 'percentage',
                                    value: '100'
                                },
                                insertAfterto: {
                                    cell: 'Col1',
                                    search: 'CLG'
                                },

                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                        ]
                    }
                },
                {
                    group: {
                        label: "DESCUENTOS",
                        options: [
                            {
                                value: '010-DF', label: '10% DESC. FAMILIAR', discount: {
                                    type: 'percentage',
                                    value: '10'
                                },
                                insertAfterto: {
                                    cell: 'Col1',
                                    search: 'CLG'
                                },

                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                            {
                                value: '010-DE', label: '10% DESC. EMPRESA', discount: {
                                    type: 'percentage',
                                    value: '10'
                                },
                                insertAfterto: {
                                    cell: 'Col1',
                                    search: 'CLG'
                                },

                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                            {
                                value: '010-DTT', label: '10% DESC. TRANSPORTISTA', discount: {
                                    type: 'percentage',
                                    value: '10'
                                },
                                insertAfterto: {
                                    cell: 'Col1',
                                    search: 'CLG'
                                },

                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                            {
                                value: '015-DC', label: '15% DESC. COLEGIO', discount: {
                                    type: 'percentage',
                                    value: '15'
                                },
                                insertAfterto: {
                                    cell: 'Col1',
                                    search: 'CLG'
                                },

                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                        ]
                    }
                },
                {
                    group: {
                        label: "DESCUENTOS TEMPORALES AUTORIZADOS",
                        options: [
                            {
                                value: '005-DT', label: ' 5% TEMPORAL', discount: {
                                    type: 'percentage',
                                    value: '5'
                                },
                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                            {
                                value: '010-DT', label: '10% TEMPORAL', discount: {
                                    type: 'percentage',
                                    value: '10'
                                },
                                idRow: 'DESCUENTO',
                                blockRow: true
                            },

                            {
                                value: '050-BT/201-RR', label: '50% RECONOCIMIENTO DE RECIBO', discount: {
                                    type: 'percentage',
                                    value: '50'
                                },

                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                            {
                                value: '100-BT/201-RR', label: '100% RECONOCIMIENTO DE RECIBO', discount: {
                                    type: 'percentage',
                                    value: '100'
                                },

                                idRow: 'DESCUENTO',
                                blockRow: true
                            }

                        ]
                    }
                },
                {
                    group: {
                        label: "DESCUENTOS ESPECIALES SOBRE EL TOTAL",
                        options: [
                            {
                                value: '050-BTT', label: '50% DESC. SOBRE EL TOTAL', discount: {
                                    type: 'percentage',
                                    value: '50'
                                },
                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                            {
                                value: '100-BTT', label: '100% DESC. SOBRE EL TOTAL', discount: {
                                    type: 'percentage',
                                    value: '100'
                                },
                                idRow: 'DESCUENTO',
                                blockRow: true
                            }
                        ]
                    }
                },
                {
                    group: {
                        label: "VARIOS",
                        options: [
                            { value: 'ANT', label: 'ANTICIPO' },
                            { value: 'DESC-ANT', label: 'DESCARGA ANTICIPO' },
                            { value: 'CURSO-INT-ONLINE', label: 'ANTICIPO CURSO INTENSIVO' },
                            { value: 'BTL-PLAST', label: 'COMPRA DE BOTELLA PLÁSTICA' },


                            { value: 'CAM-GRAD', label: 'CAMISA PARA GRADUACIÓN', price: '600' },

                        ]
                    }
                },
                {
                    group: {
                        label: "TRANSPORTE",
                        options: [
                            { value: 'TRANSP-SEBACO', label: 'PAGO DE TRANSPORTE SÉBACO', price: '1,650.00' },
                            { value: 'TRANSP-SAN_ISIDRO', label: 'PAGO DE TRANSPORTE SAN ISIDRO', price: '1,470.00' },
                            { value: 'TRANSP-TRINIDAD', label: 'PAGO DE TRANSPORTE LA TRINIDAD', price: '1,100.00' },

                        ]
                    }
                },
                {
                    group: {
                        label: "EXAMENES",
                        options: [
                            { value: 'UBICA-EXAM', label: 'EXAMEN DE UBICACIÓN ALUMNO NUEVO', price: '200' },
                            { value: 'REUBICA-EXAM', label: 'EXAMEN DE REUBICACIÓN ALUMNO ACTIVO', price: '750' },
                            { value: 'REP-EXAM', label: 'REPROGRAMACIÓN DE EXAMEN', price: '370.00' },
                            { value: 'REP-MORA', label: 'REPROGRAMACIÓN DE EXAMEN CON MULTA', price: '740.00' },
                            { value: 'REP-MORA-FT', label: 'REPROGRAMACIÓN DE EXAMEN FUERA DE TIEMPO', price: '1,110.00' },
                        ]
                    }
                },

                {
                    group: {
                        label: "CONSTANCIAS",
                        options: [
                            { value: 'CONST-ACTIV', label: 'CONSTANCIA DE ALUMNO ACTIVO', price: '370.00' },
                            { value: 'CONST-INACTIV', label: 'CONSTANCIA DE ALUMNO INACTIVO', price: '740.00' },
                            { value: 'HIST', label: 'CONSTANCIA DE ALUMNO INACTIVO', price: '1,470.00' },

                        ]
                    }
                },
                {
                    group: {
                        label: "REPOSICIONES",
                        opt: [
                            { value: 'REPOSICION-DIPLO', label: 'REPOSICIÓN DE DIPLOMA Y CERTIFICADO', price: '600.00' },
                        ]
                    }
                }


            ],
            /* AQUI CONTINUAR CON LA OPRIÖN DE COLUMNAS EN EL POPUP */
            class: ["one_of_one"],

            afterOpen: (field, ctx) => {

                const opt = field.querySelectorAll('[label="BECAS"], [label*="DESCUENTOS"]') || full;
                const _txt_RECEIPT_TYPE = $getEl('#txt_receipt_type');
                if (opt) {
                    if (_txt_RECEIPT_TYPE) {
                        if (_txt_RECEIPT_TYPE.value === 'OTROS') {
                            opt.forEach(op => {
                                op.hidden = true;
                            });
                        } else {
                            opt.forEach(op => {
                                op.hidden = false;
                            });
                        }

                    }

                }

                _HELPERS_.hideOthersComments({ hide: true, ctx: ctx });
            },
            onChange: (value, option, field, ctx) => {


                const _Field_Ditails_ = 'Col2';
                const _Field_amount = 'Col5';

                const _field_2_ = document.querySelectorAll('.dynamic-table-dialog div[data-col="Col3"]')[0];

                _HELPERS_.hideOthersComments({ hide: false, ctx: ctx });


                let _Categories_level_box_ = $getEl('._row_selected_book');

                if (!_Categories_level_box_) {
                    if (_field_2_) {

                        if (!_Categories_level_box_) {
                            const contenSelectorBooks = $CreateTag({ tag: 'div', className: 'dialog-field _row_selected_book one_of_one' });


                            const _label_ = $CreateTag({ tag: 'label', textContent: 'CATEGORÍA / NIVEL' });
                            const _levels_ = $CreateTag({ tag: 'select', id: 'txt_dialog_lavels' });
                            const _Categories_ = $CreateTag({
                                tag: 'select', id: 'txt_dialog_categories'
                            });

                            ["", "EARLY SUCCESS", "CHILDREN PROGRAM", "ADOLESCENTE", "ADULTO"].forEach(val => {
                                const opt = $CreateTag({ tag: 'option' });
                                opt.value = String(val || '').trim().replace(/ /g, '-');
                                opt.textContent = val || '-- Selecciona --';
                                _Categories_.appendChild(opt);
                            });
                            _Categories_.addEventListener('change', (e) => {
                                const _this_ = e.target;
                                const CurrentValue = String(_this_?.value || '');
                                const _sede_ = ($getEl('#txt_session') ? ($getEl('#txt_session').value).substring(4, 7) : '0000000000') || window._SEDE_;
                                const _LEVELS_WITH_BOOKS = (window._DATA_ELI_[_sede_][CurrentValue] || { niveles: null });
                                const __SelectLevels__ = $getEl('#txt_dialog_lavels');
                                __SelectLevels__.replaceChildren();
                                ctx.setValue({ colKey: 'Col3', val: '', readOnly: true, disabled: true, });
                                ctx.setValue({ colKey: _Field_amount, val: '', readOnly: true, disabled: true });

                                if (__SelectLevels__ && (_LEVELS_WITH_BOOKS?.niveles || null)) {
                                    ([...[""], ...Object.keys(_LEVELS_WITH_BOOKS?.niveles).filter(k => _LEVELS_WITH_BOOKS?.niveles[k].price !== 0)]).forEach(item => {
                                        const opt = document.createElement('option');

                                        const _value_ = String(item).replace('_', '');
                                        if (_value_ === "") {
                                            opt.value = "-Categoría-";
                                            opt.selected = true;
                                        }

                                        opt.value = item



                                        if (item === "") {
                                            opt.appendChild(document.createTextNode("-Nivel-"));
                                            opt.selected = true;
                                        } else {
                                            opt.appendChild(document.createTextNode(_value_))
                                        }
                                        __SelectLevels__.appendChild(opt);
                                    })
                                }
                            });

                            _levels_.addEventListener('change', (e) => {
                                const _this_ = e.target;
                                const _categories_ = document.querySelector('#txt_dialog_categories');
                                if (!_this_ || !_categories_) return;
                                const _sede_ = ($getEl('#txt_session') ? ($getEl('#txt_session').value).substring(4, 7) : '0000000000') || window._SEDE_;

                                const _DATA_BOOK_ = (window._DATA_ELI_[_sede_][_categories_.value] || { niveles: null })
                                const _LEVELS_ = (_DATA_BOOK_.niveles[_this_.value] || null);
                                if (_LEVELS_) {
                                    ctx.setValue({ colKey: 'Col3', val: _LEVELS_["title-book"], readonly: true, disabled: true });
                                    ctx.setValue({ colKey: _Field_amount, val: _LEVELS_["price"], readonly: true, disabled: true });

                                } else {
                                    ctx.setValue({ colKey: 'Col3', val: '', readonly: true, disabled: true });
                                    ctx.setValue({ colKey: _Field_amount, val: '', readonly: true, disabled: true });

                                }
                            });
                            contenSelectorBooks.append(_label_, _Categories_, _levels_);


                            _field_2_.before(contenSelectorBooks);
                        }
                        _Categories_level_box_ = $getEl('._row_selected_book')
                    }
                }
                _Categories_level_box_.classList.add('hide');
                if (_HELPERS_.existe(option)) {


                    const discount = {
                        type: String(option?.discount?.type ?? 'percentage').toLowerCase(),
                        value: parseFloat(Number(String((option?.discount?.value || '0%').replace('%', ''))))
                    }



                    ctx.setValue({ colKey: _Field_Ditails_, val: '', readOnly: false, disabled: false });
                    ctx.setValue({ colKey: _Field_amount, val: '', readOnly: true, disabled: true });


                    if (option.value === 'LBR-EXTRA') {
                        _HELPERS_.hideOthersComments({ hide: true, ctx: ctx, showComment: true, placeholder: 'Selecciones el Nombre del libro' });


                        if (_Categories_level_box_) {
                            _Categories_level_box_.classList.remove('hide');
                        }

                        ctx.setValue({ colKey: _Field_Ditails_, val: '', readOnly: true, disabled: true });
                        ctx.setValue({ colKey: _Field_amount, val: '', readOnly: true, disabled: true });

                    }
                    else if (['050-BTT', '100-BTT', '050-BT/201-RR', '100-BT/201-RR'].includes(option.value)) {

                        if (['050-BTT', '100-BTT'].includes(option.value)) {
                            _HELPERS_.hideOthersComments({ hide: true, ctx: ctx, placeholder: 'Escriba la justificación del Descuento' });
                        } else {
                            _HELPERS_.hideOthersComments({ hide: true, ctx: ctx, placeholder: 'Escriba el # del Recibo al que se refiere' });
                        }
                        ctx.setValue({ colKey: _Field_Ditails_, val: option.label, readonly: false, disabled: false });
                        ctx.setValue({ colKey: _Field_amount, val: (((ctx.getTotalAllColumn()).__raw[_Field_amount] * (discount.value / 100)) * (-1)), readOnly: true, disabled: true });
                    }
                    else if (option.value === 'OTROS') {
                        _HELPERS_.hideOthersComments({ hide: true, ctx: ctx });
                        ctx.setValue({ colKey: _Field_Ditails_, val: option.label, readonly: false, disabled: false });
                        ctx.setValue({ colKey: _Field_amount, val: '', readOnly: false, disabled: false });

                    } else {



                        if (_HELPERS_.existe(option.discount)) {

                            _HELPERS_.hideOthersComments({ hide: true, ctx: ctx });
                            ctx.setValue({ colKey: _Field_Ditails_, val: option.label, readonly: true, disabled: true });
                            if (discount.type === 'percentage') {

                                const referenceValue = ((_HELPERS_.sumNumericValues(ctx.getCellValue("Col1", "CLG", "Col5"))) * (discount.value / 100)) * -1;
                                ctx.setValue({ colKey: _Field_amount, val: referenceValue, readOnly: true, disabled: true });
                            }
                            switch (option.value) {
                                case '050-MB':
                                case '100-BC':
                                    _HELPERS_.hideOthersComments({ hide: true, ctx: ctx, placeholder: 'Escriba el código de beca' });
                                    break;
                                case '010-DF':
                                    _HELPERS_.hideOthersComments({ hide: true, ctx: ctx, placeholder: 'Escriba el nombre del familiar' });

                                    break;
                                case '010-DE':
                                    _HELPERS_.hideOthersComments({ hide: true, ctx: ctx, placeholder: 'Escriba el nonbre de la empresa' });

                                    break;
                                case '015-DC':
                                    _HELPERS_.hideOthersComments({ hide: true, ctx: ctx, placeholder: 'Escriba el nombre del colegio' });
                                    break;
                                default:
                                    break;
                            }


                        } else if (_HELPERS_.existe(option.price)) {
                            if (_HELPERS_.esNumerico(option.price)) {

                                _HELPERS_.hideOthersComments({ hide: false, ctx: ctx });
                                ctx.setValue({ colKey: _Field_Ditails_, val: option ? option.label : '', readOnly: true, disabled: true });
                                ctx.setValue({ colKey: _Field_amount, val: (option.price), readOnly: true, disabled: true });
                            }
                        } else {

                            ctx.setValue({ colKey: _Field_Ditails_, val: option ? option.label : '', readOnly: true, disabled: true });
                            ctx.setValue({ colKey: _Field_amount, val: '' });

                        }
                    }





                }
            }
        },
        Col2: {
            required: true,
            type: 'text',
            class: ["one_of_one"],
            visible: false,
            onBeforeSave: (cell_value = '', row = {}) => {





                let CurrentValue = String(cell_value).trim().toUpperCase();
                const _CODE_ = row?.Col1 ?? '';




                if (['LBR', 'LBR-EXTRA', '050-MB', '100-BC', '010-DF', '010-DC', '015-DC', '005-DT', '010-DT', '010-DTT', '050-BT/201-RR', '100-BT/201-RR', '100-BTT', '050-BTT'].includes(_CODE_)) {
                    switch (_CODE_) {

                        case 'LBR-EXTRA':

                            CurrentValue = ((['CLG-NUEVO', 'CLG-REPITE'].includes(window._RECEIPT_DETAILS.RECEIPT_TYPE().value)) ? 'LIBRO: ' : 'LIBRO (EXTRA): ') + CurrentValue;
                            break;
                        case '010-DF':
                        case '010-DC':
                        case '015-DC':
                        case '005-DT':
                        case '010-DT':
                        case '010-DTT':
                        case '050-BTT':
                        case '100-BTT':
                        case '050-BT/201-RR':
                        case '100-BT/201-RR':
                        case '050-MB':
                        case '100-BC':
                            CurrentValue = 'DESC. ' + CurrentValue;
                            break;
                        default:
                            CurrentValue = CurrentValue;
                            break;
                    }
                }
                return String(CurrentValue).trim().toUpperCase();
            },
        },
        Col3: {
            required: true,
            type: 'text',
            visible: true,
            class: ["one_of_one"]
        },
        Col4: {
            required: false,
            type: 'text',
            visible: true,
            class: ["one_of_one"]
        },
        Col5: {
            required: true,
            visible: true,
            type: 'number',
            class: ["one_of_three", "align-right"]
        }
    });
    tabla.createBody({ total_row: 6 });



    tabla.updateTFoot({
        sumAllColumn: { Col5: true },
        LabelTotal: { Col4: true }
    });

    ChoiceField.disableAll();
    _HELPERS_.DisableMaterialInputs();


    window._BOOKS_.setInit({ selectorBookTitle: '[data-field_status="txt_book"]', selectorBookCover: "#book-cover" })


    tabla.disableTable();
    _HELPERS_.updateDateTime();





    const watcher = FormChangeWatcher.attach('#TheForm', {
        onChange: (payload, el, ev) => {
            const _ID_ = payload.id || null;
            const _VALUE_ = String(payload.value || '').trim();


            _HELPERS_.updateDateTime();
            let _DATA_LEVELS_, _sesion_, _sede_, _category_;
            if (['txt_receipt_type', "txt_session", 'txt_categories', 'txt_levels'].includes(_ID_)) {
                tabla.clearBody();
                tabla.disableTable();
            }
            switch (_ID_) {
                case 'txt_receipt_type':
                    _HELPERS_.DisableMaterialInputs();
                    window.ChoiceField.disableAll();
                    tabla.clearBody();
                    tabla.disableTable();
                    window._BOOKS_.clearBook();
                    //36436656 - 
                    switch (_VALUE_) {
                        case 'CLG':
                        case 'CLG-REPITE':
                        case 'CAN':
                        case 'ABONO':
                        case 'OTROS':
                            _HELPERS_.EnableMaterialInputs('txt_name,txt_company,txt_session');
                            break;
                        case 'CLG-NUEVO':
                            _HELPERS_.EnableMaterialInputs('txt_name,txt_company,txt_session,txt_contact_name,txt_email,txt_phone,txt_birthdate');
                            break;

                        default:
                            break;
                    }
                    break;
                case "txt_session":
                    _HELPERS_.LoadSimpleSelect('#txt_levels', {});
                    _HELPERS_.LoadSimpleSelect('#txt_categories', {});
                    window.ChoiceField.disableAll();
                    tabla.clearBody();
                    tabla.disableTable();

                    window._BOOKS_.clearBook();

                    _HELPERS_.DisableMaterialInputs('txt_categories,txt_levels,txt_book,txt_notes');
                    if (_VALUE_ !== '') {
                        _sede_ = _VALUE_.includes("ONLINE") ? 'ONLINE' : (_VALUE_.includes("TALLER") ? 'TALLER' : String(_VALUE_).substring(4, 7))

                        const _Categories_ = structuredClone(Object.keys(window._DATA_ELI_[_sede_]).map(key => ({
                            value: key,
                            label: window._DATA_ELI_[_sede_][key].categoria
                        })));

                        _HELPERS_.LoadSimpleSelect('#txt_categories', _Categories_);
                        _HELPERS_.EnableMaterialInputs('txt_categories');
                    }
                    break;
                case 'txt_categories':
                    window.ChoiceField.disableAll();
                    tabla.clearBody();
                    tabla.disableTable();
                    window._BOOKS_.clearBook();
                    _HELPERS_.DisableMaterialInputs('txt_levels,txt_notes');

                    if (_VALUE_ !== '') {
                        _sesion_ = $getEl("#txt_session");
                        _HELPERS_.LoadSimpleSelect('#txt_levels', {});
                        if (_sesion_ && String(_sesion_.value).trim() !== '') {
                            _sede_ = String(_sesion_.value).substring(4, 7);
                            _category_ = String(_VALUE_).trim();

                            _DATA_LEVELS_ = window._DATA_ELI_[_sede_][_category_].niveles;

                            let _Listlevels_ = structuredClone(Object.keys(_DATA_LEVELS_).map(key => ({
                                value: key,
                                label: key.replace('_', '')
                            })));


                            _HELPERS_.LoadSimpleSelect('#txt_levels', _Listlevels_);
                            _HELPERS_.EnableMaterialInputs('txt_levels');

                        }

                    }
                    break;
                case 'txt_levels':
                    window.ChoiceField.disableAll();
                    const _txt_RECEIPT_TYPE = $getEl("#txt_receipt_type");
                    const DialogTable = $getEl('.dynamic-table-dialog');


                    if (DialogTable && _txt_RECEIPT_TYPE) {
                        DialogTable.dataset.filter = _txt_RECEIPT_TYPE;
                    }

                    tabla.clearBody();
                    tabla.disableTable();
                    window._BOOKS_.clearBook();
                    _HELPERS_.EnableMaterialInputs('txt_notes');
                    _HELPERS_.DisableMaterialInputs('txt_book');
                    _sesion_ = $getEl("#txt_session");



                    _sede_ = (_sesion_) ? String(_sesion_.value).substring(4, 7) : null;
                    _category_ = $getEl("#txt_categories") ? $getEl("#txt_categories").value : null;

                    let _level_ = String(_VALUE_).trim() || null;
                    if (_sesion_ && _sede_ && _category_ && _level_) {
                        const _DATA_PRICES_ = window._DATA_ELI_?.[_sede_]?.[_category_] || null;
                        tabla.enableTable();
                        window.ChoiceField.enableAll();
                        if (_DATA_PRICES_ && _txt_RECEIPT_TYPE) {
                            if (!['CLG', 'CLG-NUEVO', 'CLG-REPITE', 'CAN'].includes(_txt_RECEIPT_TYPE.value)) return;
                            let _CLG_ = _DATA_PRICES_?.precios?.colegiatura || '0.00';
                            let _LBR_ = _DATA_PRICES_?.niveles?.[_level_]?.price || '0.00';
                            let _LBR_NAME_ = _DATA_PRICES_?.niveles?.[_level_]?.['title-book'] || '';

                            if (_txt_RECEIPT_TYPE.value === 'CLG-REPITE') {
                                _LBR_NAME_ = '';
                                _LBR_ = '0.00';
                            }



                            /*if ($getEl('[data-choice_id="txt_method_cash"] .menu')) {
                                $getEl('[data-choice_id="txt_method_cash"] .menu').setAttribute('data-maxamount', parseFloat(_CLG_) + parseFloat(_LBR_));
                                $getEl('[data-choice_id="txt_method_cash"] #details-cash_change').value = parseFloat(_CLG_) + parseFloat(_LBR_);

                            }*/
                            tabla.insertRow({
                                row: { Col1: 'CLG', Col2: 'COLEGIATURA', Col4: '-', Col5: String(_CLG_) },
                                remove: false
                            });
                            if (_LBR_ && _LBR_ !== '0.00' && _level_ !== '_14') {

                                _HELPERS_.EnableMaterialInputs('txt_book');
                                window._BOOKS_.loadBook({ sede: _sede_, category: _category_, level: _level_, bookTitle: _LBR_NAME_ })


                                tabla.insertRow({
                                    row: { Col1: 'LBR', Col2: 'LIBRO/' + _LBR_NAME_, Col4: '-', Col5: String(_LBR_) },
                                    remove: false
                                });


                            }
                            if (_level_ === '_14') {
                                tabla.insertRow({
                                    row: { Col1: 'CAM-GRAD', Col2: 'CAMISA PARA GRADUACIÓN', Col4: '-', Col5: String(_LBR_) },
                                    remove: false
                                });
                            }


                        }

                    }
                    /*
                    
     
                       
     
                          
                           
     
                           
     
     
                           
                        
                    
                    */

                    break;
                default:
                    break;
            }

            UpdatePrintBox();
        }
    });


    window._HOUR_COUNTER_ = new CountdownBanner({
        hourMax: window.hourmax_change_receipt_day,
        minuteMax: 0,
        prefix: window._SEDE_,
        onFinish: () => {
            console.log('Contador finalizado');
        },
        onDisable: () => {
            console.log('Contador desactivado');
            window._NEW_DATE_ = { status: false, day: '', month: '', year: '' };
            localStorage.setItem(window._SEDE_ + "_new_date", JSON.stringify(window._NEW_DATE_));
            _HELPERS_.updateDateTime();

        }
    });
    window._HOUR_COUNTER_.start();

    function isBeforeOrAt9AM() {
        const now = new Date();
        const hours = now.getHours();   // 0-23
        const minutes = now.getMinutes(); // 0-59

        // Verificar si la hora es menor a 9, o si es exactamente 9:00 AM
        return hours < window.hourmax_change_receipt_day || (hours === window.hourmax_change_receipt_day && minutes === 0);
    }

    const _ACTIONS_BUTTONS_ = document.querySelectorAll('footer .container-actionbuttons span[id*="btn_"]');
    if (_ACTIONS_BUTTONS_) {
        _ACTIONS_BUTTONS_.forEach(_BTN_ => {
            _BTN_.addEventListener('click', async function (e) {
                const _action_ = this.id;
                const elBody = $getEl('body');
                $getEl('body')._removeClass("print-horizontal", "print-vertical", "hide-receipt", "hide-report");

                switch (_action_) {
                    case 'btn_changeNumberReceipt':
                        const {
                            value: ReceiptNumberString
                        } = await mdl_msgbox.open({
                            type: 'question',
                            title: 'CAMBIAR NÚMERO DE RECIBO',
                            content: (modal) => {

                                const _RECIBO_ = $getEl("#txt_receipt_number");

                                if (!_RECIBO_) return;

                                if (String(_RECIBO_.value || '').trim() === '') return;

                                let receipt_number = ((String(_RECIBO_.value || '').trim().toUpperCase()).replace("SERIE ", '')).split('#')

                                const wrap = document.createElement('div');
                                wrap.className = 'row';
                                const p = document.createElement('p');

                                const div_row = document.createElement('div');
                                div_row.classList.add('row');
                                const div_col1 = document.createElement('div');
                                const div_col2 = document.createElement('div');

                                div_col1.className = 'col-3 ';
                                div_col2.className = 'col-9 ';

                                p.textContent = 'Escriba la letra y número del recibo en físico que se encuentra en bandeja de la impresora.';
                                const input = document.createElement('input');
                                input.id = "txt_letter"
                                input.type = 'text';
                                input.value = String(receipt_number[0] || '').trim();
                                input.style.cssText = `width: 100%;appearance: none;outline: none;border: #959595 solid 1px;border-radius: 4px;padding: 7px;font-size: 1.5rem;`;

                                const input2 = document.createElement('input');
                                input2.id = "txt_number"
                                input2.type = 'text';
                                input2.value = String(receipt_number[1] || '').trim();
                                input2.style.cssText = `width: 100%;appearance: none;outline: none;border: #959595 solid 1px;border-radius: 4px;padding: 7px;font-size: 1.5rem;`;

                                div_col1.append(document.createTextNode('LETRA'), input);

                                div_col2.append(document.createTextNode('#. RECIBO'), input2);
                                div_row.append(div_col1, div_col2);

                                wrap.append(p, div_row);


                                return wrap;
                            },
                            onAccept: async (ctx, bodyEl) => {
                                const inputLetter = bodyEl.querySelector('#txt_letter') || null;
                                const inputNumber = bodyEl.querySelector('#txt_number') || null;
                                if ((!inputLetter || !inputNumber) || (inputLetter.value === '' || inputNumber.value === '')) {
                                    await mdl_msgbox.error({
                                        title: 'Lo sentimos pero ocurrió un fallo',
                                        content: 'Debe Escribir la letra y el número de recibo.',
                                        acceptText: 'Entendido',
                                    });
                                    return false;
                                }
                                if (!/^[0-9]+$/.test(inputNumber.value)) {
                                    await mdl_msgbox.error({
                                        title: 'Lo sentimos pero ocurrió un fallo',
                                        content: 'Debe Escribir solo números en el campo del "#. RECIBO".',
                                        acceptText: 'Entendido',
                                    });
                                    return false;
                                }
                                if (!(/^\p{L}+$/u.test(inputLetter.value))) {
                                    await mdl_msgbox.error({
                                        title: 'Lo sentimos pero ocurrió un fallo',
                                        content: 'Debe Escribir solo letras en el campo de la "LETRA".',
                                        acceptText: 'Entendido',
                                    });
                                    return false;
                                }

                                return {
                                    SERIE: String(inputLetter.value).toUpperCase().trim(),
                                    ROC: inputNumber.value
                                };
                                // return { value: inputLetter.value + " #" + inputNumber.value };
                            },
                            acceptText: 'Aceptar',
                            cancelText: 'Cancelar',
                        });




                        if (ReceiptNumberString) {


                            const NumROC = ReceiptNumberString.SERIE + " #" + (((ReceiptNumberString?.SERIE).toUpperCase() === "G") ? String(ReceiptNumberString.ROC).padStart(7, '0') : ReceiptNumberString.ROC);


                            const confirmReceiptNumber = await mdl_msgbox.question({
                                title: '¡EXCELENTE...!',

                                content: (modal) => {
                                    const wrap = document.createElement('div');
                                    wrap.className = 'row';
                                    const p = document.createElement('p');
                                    const span = document.createElement('span');

                                    const div_row = document.createElement('div');
                                    div_row.classList.add('row');



                                    p.textContent = '¿Es correcto en número de recibo?';
                                    span.appendChild(document.createTextNode('SERIE ' + NumROC));
                                    span.style.cssText = 'font-size: 28px;font-weight: bold;'
                                    wrap.append(p, span);


                                    return wrap;
                                },
                                acceptText: 'SÍ, ES CORRETO',
                                cancelText: 'NO',
                            });

                            if (confirmReceiptNumber) {

                                if ($getEl("#txt_receipt_number")) {
                                    $getEl("#txt_receipt_number").value = (String("SERIE " + ReceiptNumberString.SERIE + " #" + ReceiptNumberString.ROC).trim());

                                }
                                localStorage.setItem("serial_number_" + window._SEDE_, ReceiptNumberString.SERIE + "|" + ReceiptNumberString.ROC);

                                window._SERIAL_NUMBER_ = ReceiptNumberString.SERIE + "|" + ReceiptNumberString.ROC;
                            }


                        }
                        break;
                    case 'btn_print_receipt':
                        elBody._addClass("print-vertical", "hide-report");


                        const { grandTotal, detail } = window.ChoiceField.getGrandTotalDetail();

                        const _amopunt_Method_ = detail.filter(item => item.accepted === true && !['txt_method_advance', 'txt_retention_1percent', 'txt_retention_2percent'].includes(item.choiceId));

                        if (_amopunt_Method_.length === 0) {
                            mdl_msgbox.warning({
                                title: '¡NO SE PUEDE IMPRIMIR!',

                                content: (modal) => {
                                    const wrap = document.createElement('div');
                                    wrap.className = 'row';
                                    const p = document.createElement('p');


                                    p.textContent = 'No ha seleccionado un método de pago';

                                    wrap.append(p);


                                    return wrap;
                                },
                                acceptText: 'ENTIENDO',

                            });
                            return;
                        }
                        //console.log('detail:', detail);

                        const AllChoicesJSON = JSON.parse(window.ChoiceField.getAllChoicesJSON(undefined, { pretty: true }));
                        TotalRecibido = (AllChoicesJSON.map(choice => {
                            return choice.autosum;
                        }) || [0, 0]).reduce((acc, n) => acc + n, 0);


                        let _stop_ = false;
                        _amopunt_Method_.forEach(choice => {
                            if (choice.subtotal === 0 && _stop_ === false) {
                                _stop_ = true;
                                mdl_msgbox.warning({
                                    title: '¡NO SE PUEDE IMPRIMIR!',

                                    content: (modal) => {
                                        const wrap = document.createElement('div');
                                        wrap.className = 'row';
                                        const p = document.createElement('p');


                                        p.textContent = 'Seleccionó el método de pago ' + choice.label + ' pero no ha detallado el monto recibido';

                                        wrap.append(p);


                                        return wrap;
                                    },
                                    acceptText: 'ENTIENDO',

                                });
                            }
                        });

                        if (_stop_) return;

                        let total = parseFloat((tabla.getTotalAllColumn()).__raw['Col5'] || 0);

                        console.log('TotalRecibido:', TotalRecibido);
                        console.log('grandTotal:', grandTotal);
                        console.log(grandTotal, " < ", total);
                        console.groupCollapsed('AllChoicesJSON');
                        console.log(JSON.stringify(AllChoicesJSON, null, 2));
                        console.groupEnd();

                        if (TotalRecibido < total) {
                            mdl_msgbox.warning({
                                title: '¡ADVERTENCIA...!',

                                content: (modal) => {
                                    const wrap = document.createElement('div');
                                    wrap.className = 'row';
                                    const p = document.createElement('p');


                                    p.textContent = 'El monto ingresado en los MÉTODOS DE PAGO (C$' + TotalRecibido + ') es menor al TOTAL (C$' + total + '). Por favor, verifique los importes e intente nuevamente.';

                                    wrap.append(p);


                                    return wrap;
                                },
                                acceptText: 'ENTIENDO',

                            });
                            return;
                        }

                        if (TotalRecibido > total) {
                            const confirmAnticipo = await mdl_msgbox.question({
                                title: '¡UN MOMENTO POR FAVOR!',
                                content: 'El monto registrado en los MÉTODOS DE PAGO es superior al TOTAL.\n¿Desea registrar C$ ' + (TotalRecibido - total) + ' como anticipo?',
                                acceptText: 'SÍ',
                                cancelText: 'NO',
                            });


                            if (confirmAnticipo.value) {
                                mdl_msgbox.success({
                                    title: '¡PERFECTO!',

                                    content: 'Nuevo anticipo registrado. Intente la impresión nuevamente',
                                    acceptText: 'ENTENDIDO',

                                });
                                return;
                            } else {
                                return;
                            }
                        }

                        let DataSend = structuredClone(window._RECEIPT_DETAILS.getAll());

                        DataSend.OBSERVATIONS = _HELPERS_.SetObservations({
                            notes: DataSend.NOTES_,
                            receiptType: DataSend.RECEIPT_TYPE,
                            prefix: DataSend.RECEIPT_NUMBER + (DataSend.RECEIPT_TYPE === 'CLG-NUEVO' ? '/[NUEVO-INGRESO]' : '')
                        });

                        const Desuentos = {
                            '010-DF': 'DESC-10%',
                            '010-DC': 'DESC-10%',
                            '015-DC': 'DESC-15%',
                            '005-DT': 'DESC-5%',
                            '010-DT': 'DESC-10%',
                            '010-DTT': 'DESC-10% TRASNPORTISTA',
                            '050-BTT': 'DESC-50% SOBRE EL TOTAL',
                            '100-BTT': 'DESC-100% SOBRE EL TOTAL',
                            '050-BT/201-RR': 'RECONOC-50%',
                            '100-BT/201-RR': 'RECONOC-100%',
                            '050-MB': 'BECA-50%',
                            '100-BC': 'BECA-100%',
                            'UBICA-EXAM': 'EXAM-UBICA',
                            'REUBICA-EXAM': 'EXAM-REUBICA'
                        };

                        const rows = (window.tabla.getData('Col1') || []);


                        rows.forEach((r, index) => {
                            const code = String(r ?? '').trim().toUpperCase();
                            if (code && (Desuentos[code] || false)) {
                                rows[index] = Desuentos[code];
                            }
                        })





                        const clean = rows.map(r => String(r ?? '').trim()).filter(Boolean);

                        const first = clean.filter(x => x === 'CLG') || null;
                        const second = clean.filter(x => x === 'LBR') || null;
                        const rest = clean.filter(x => x !== 'CLG' && x !== 'LBR') || null;



                        const Type = [...first, ...second, ...rest].map(r => String(r ?? '').trim()).filter(Boolean).join(' ');

                        DataSend.RECEIPT_TYPE = Type.replace('CLG LBR', 'CLG-LBR');


                        //    DataSend.OBSERVATIONS = ([DataSend.RECEIPT_NUMBER || null, DataSend.OBSERVATION || null, DataSend.NOTES_ || null].filter(v => v !== null)).join('/');

                        delete DataSend.NOTES_;
                        delete DataSend.LEVELS_CATEGORIES;
                        delete DataSend.COURSE_NUMBER;


                        if (window._isPastDay) {

                            DataSend.isPastDay = window._isPastDay;
                        } else {
                            DataSend.isPastDay = false;
                        }

                        const ChoicesData = (JSON.parse(window.ChoiceField.getAllChoicesJSON()) || []);
                        DataSend['JSON_PAYMENT_METHOD'] = (JSON.stringify(ChoicesData.map(choice => {


                            return {
                                label: choice.label,
                                total: choice.autosum,
                                ditail: (choice.acceptedData) ? choice.acceptedData.rows.map(values => { return { label: values.label, values: values.values } }) : []
                            }
                        }


                        )));

                        dataTable = window.tabla.getData() || [];

                        DataSend['JSON_TABLESERVICES'] = JSON.stringify(dataTable.rows.map(tbl => {
                            return {
                                Cell1: tbl.Col1,
                                Cell2: tbl.Col2,
                                Cell3: tbl.Col3 || '-',
                                Cell4: tbl.Col4 || '-',
                                Cell5: tbl.Col5,
                            }
                        }));


                        const paymentMethods = (JSON.parse(window.ChoiceField.getAllChoicesJSON(undefined, { pretty: true })) || []).filter(choice => !['txt_retention_1percent', 'txt_retention_2percent'].includes(choice.choiceId)).map(choice => {

                            let reference = null;

                            if (choice.type_template.autosum !== 0 && (['txt_method_deposit', 'txt_method_telepago', 'txt_method_check']).includes(choice.choiceId)) {
                                reference = (choice?.menu?.flat?.row || [])
                                    .flatMap(obj => Object.entries(obj))
                                    .filter(([key, val]) => key.startsWith('details-reference-') && String(val ?? '').trim() !== '')
                                    .map(([, val]) => String(val).trim())
                                    .join(', ');
                            }




                            return {
                                id: choice.choiceId,
                                checked: Boolean(choice.checked),
                                label: choice.label,
                                value: choice.autosum,
                                reference: reference ? reference + '-' + (String(choice.label).trim()).substring(0, 3) : ''
                            }
                        });





                        (paymentMethods || []).forEach(Methods => {
                            if (Methods.id !== 'txt_method_advance') {
                                if (String(Methods.value).trim() !== '0' && String(Methods.value).trim() !== '0.00') {
                                    DataSend[((Methods.id).replace('txt_method_', 'check_')).toUpperCase()] = true;

                                } else {
                                    DataSend[((Methods.id).replace('txt_method_', 'check_')).toUpperCase()] = false;
                                }
                                if (['txt_method_deposit', 'txt_method_check', 'txt_method_telepago'].includes(Methods.id)) {
                                    DataSend['REF_' + ((Methods.id).replace('txt_method_', '')).toUpperCase()] = Methods.reference;
                                }
                            }

                        });


                        (paymentMethods || []).forEach(Methods => {
                            DataSend[((Methods.id).replace('txt_method_', 'Method_Detail_')).toUpperCase()] = Methods.value
                        });


                        const AMOUNT = _HELPERS_.GetAmounts((window.tabla.getData().rows || []).map(row => {
                            return {
                                CODE: row.Col1,
                                LABEL: row.Col2,
                                AMOUNT: row.Col5
                            }
                        }));

                        for (const [key, value] of Object.entries(AMOUNT)) {
                            DataSend['AMOUNT_', key] = value;
                        }

                        DataSend.LEVELS = DataSend.LEVELS.replace('_', '');
                        DataSend.DATE = _HELPERS_.ResteDate(DataSend.DATE);
                        DataSend.HOUR = _HELPERS_.getHora12();
                        DataSend.REAL_DATETIME = _HELPERS_.getFechaHora();
                        DataSend.RECEIPT_NUMBER = DataSend.RECEIPT_NUMBER.replace('SERIE ', '');

                        DataSend.IMPORTE_TOTAL = total;

                        const date = _HELPERS_.Current_Long_Date();
                        DataSend.DAY_CURRENT = date.dia;
                        DataSend.MONTH_CURRENT = date.mes;
                        DataSend.YEAR_CURRENT = date.anio;
                        DataSend.HOUR_CURRENT = date.hora;

                        const [month, day, year] = _HELPERS_.UnitedStatesDateFormat(DataSend.DATE).split('/');
                        //  "REAL_DATETIME": "23/10/2026, 09:22 a. m.",
                        const hour = DataSend.REAL_DATETIME.split(', ')[1];
                        DataSend.DAY_CURRENT = day;
                        DataSend.MONTH_CURRENT = month;
                        DataSend.YEAR_CURRENT = year;
                        DataSend.HOUR_CURRENT = hour



                        console.groupCollapsed('DataSend');
                        console.table(DataSend);
                        console.groupEnd();

                        let allowPrinting = true;

                        window.print();
                        _HELPERS_.IncrementarSerie();
                        if ($getEl('#txt_receipt_type')._exist()) {
                            $getEl('#txt_receipt_type')._value('');
                            _HELPERS_.DisableMaterialInputs();
                            window.ChoiceField.disableAll();
                            tabla.clearBody();
                            tabla.disableTable();
                            window._BOOKS_.clearBook();
                        }

                        if (typeof SendData === 'function') {
                            SendData(DataSend);
                        }
                        break;

                    case 'btn_report':
                        elBody._addClass("print-horizontal", "hide-receipt");
                        $getEl('#preview-report')._addClass('is-visible');


                        break;
                    case 'btn_changeDateTime':
                        if (!isBeforeOrAt9AM()) {

                            await mdl_msgbox.warning({
                                title: 'ADVERTENCIA',
                                content: 'No está permitido hacer cambio de fecha después de las 9:00 AM, si es realmente necesario contactarse con el administrador del aplicativo.',
                                acceptText: 'Entendido',
                            });



                            return;
                        }

                        const hoy = new Date();
                        const tresDiasAtras = new Date(hoy);
                        tresDiasAtras.setDate(hoy.getDate() - 4);

                        const ayer = new Date(hoy);
                        ayer.setDate(hoy.getDate() - 1);

                        function formatearFecha(fecha) {
                            const year = fecha.getFullYear();
                            const month = String(fecha.getMonth() + 1).padStart(2, '0');
                            const day = String(fecha.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                        }

                        const {
                            value: formValues
                        } = await mdl_msgbox.open({
                            type: 'question',
                            title: 'CAMBIAR LA FECHA DEL RECIBO',
                            content: (modal) => {
                                const wrap = document.createElement('div');
                                const p = document.createElement('p');
                                p.textContent = 'Seleccione la nueva fecha (DÍA/MES/AÑO) en el recuadro de abajo. Tiene hasta tres días anterior a hoy para escoger.';
                                const input = document.createElement('input');
                                input.type = 'date';
                                input.min = formatearFecha(tresDiasAtras);
                                input.max = formatearFecha(ayer);
                                input.value = formatearFecha(ayer);
                                input.style.cssText = `appearance: none;outline: none;border: #959595 solid 1px;border-radius: 4px;padding: 7px;font-size: 1.5rem;`;
                                wrap.append(p, input);
                                return wrap;
                            },
                            onAccept: async (ctx, bodyEl) => {
                                const input = bodyEl.querySelector('input');
                                if (!input.value) {
                                    await mdl_msgbox.error({
                                        title: 'Error',
                                        content: 'Debe seleccionar una fecha.',
                                        acceptText: 'Entendido',
                                    });
                                    return false;
                                }

                                return { newDate: input.value };
                            },
                            acceptText: 'Aceptar',
                            cancelText: 'Cancelar',
                        });



                        if (formValues) {

                            const [year, month, day] = (formValues.newDate).split("-");
                            window._NEW_DATE_.day = day;
                            window._NEW_DATE_.month = month;
                            window._NEW_DATE_.year = year;
                            window._NEW_DATE_.status = true;



                            localStorage.setItem(window._SEDE_ + "_new_date", JSON.stringify(window._NEW_DATE_));



                            window._HOUR_COUNTER_.restart();

                            _HELPERS_.updateDateTime();
                            // $(".date").html(Current_date("html"));

                        }
                        break;

                    default:
                        break;
                }

            });
        });
    }

});