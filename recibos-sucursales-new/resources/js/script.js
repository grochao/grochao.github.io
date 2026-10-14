const _HELPERS_ = {
    InsertAmount({ data = {} } = null) {
        //console.log(JSON.stringify(data));
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
            label.textContent = data.label;

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
                    amount: _row_?.Col4
                }
            }),
            total: [{
                label: 'TOTAL:', amount: data.totals.Col4
            }]
        }


        if (_box_concepts_) {
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
            _new_date_localStorage_ = { status: true, day: day, month: this.loadMonthName({ month: month }), year: year };
        }

        const dateScreen = document.getElementById('txt-fecha');
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
    const _ELEMENT_ = document.querySelectorAll("#preview-print .page") || null;

    if (!_ELEMENT_) return false;

    const _DATA_RECEIPT_TYPE_ = document.querySelector("#txt_receipt_type") || null;
    const _DATA_NAME_ = document.querySelector("#txt_name") || null;
    const _DATA_COMPANY_ = document.querySelector("#txt_company") || null;
    const _DATA_SESSION_ = document.querySelector("#txt_session") || null;
    const _DATA_CATEGORIES_ = document.querySelector("#txt_categories") || null;
    const _DATA_LEVELS_ = document.querySelector("#txt_levels") || null;
    const _DATA_BOOK_ = document.querySelector("#txt_book") || null;
    const _DATA_NOTES_ = document.querySelector("#txt_notes") || null;

    if (_DATA_RECEIPT_TYPE_ !== null && _DATA_NAME_ !== null && _DATA_COMPANY_ !== null && _DATA_SESSION_ !== null && _DATA_CATEGORIES_ !== null && _DATA_LEVELS_ !== null && _DATA_BOOK_ !== null && _DATA_NOTES_ !== null) {

        //2026LEOSAB06
        const _session_number_ = _DATA_SESSION_.value.trim().slice(-2);
        const _name_company_ = String(_DATA_COMPANY_.value || "").trim();
        const _name_ = String(_DATA_NAME_.value).trim();
        const _book_name_ = String(_DATA_BOOK_.value || "").trim()
        const _level_category_ = String(String(_DATA_LEVELS_.value || '').trim() + " - " + String(_DATA_CATEGORIES_.value || '').trim()).trim();

        const paymentMethods = JSON.parse(window.ChoiceField.getAllChoicesJSON(undefined, { pretty: true }));


        console.clear();
        console.groupCollapsed("paymentMethods");

        console.log(JSON.stringify(paymentMethods));
        console.groupEnd();
        const paymentMethods_Values = paymentMethods.filter(field => (field.checked === true && field.accepted === true)).map(field => {


            const flat = field.menu.flat;

            _value_ = flat?.["details-cash_total"] || (flat?.["details-autosum"] || 0);

            let _details_ = '';
            if (field.type_template == "autosum") {
                _details_ = flat.row.map(obj => Object.values(obj)) // [["sdfsd", 7848], ["454", 457], ["", ""]]
                    .filter(([ref, amount]) => !(ref === '' && amount === '')) // quita los que tienen ambos vacíos
                    .map(([ref, amount], i) => ((String(ref).trim() !== "") ? ` [REF#${i + 1}:${ref} ` : `[`) + `C$${amount}]`);
            } else {
                _details_ = ["C$" + _value_ + (flat?.["details-cash_total"] && flat?.["details-cash_change"] ? ((flat?.["details-cash_change"] || 0) > 0 ? " | VUELTO -> C$:" + flat["details-cash_change"] : "") : "")];
            }
            return {
                key: field.label,
                value: _value_,
                print: _details_
            }
        }) || [];
        console.groupCollapsed("paymentMethods_Values");
        console.log(JSON.stringify(paymentMethods_Values));
        console.groupEnd();

        let _notes_ = '';
        if (paymentMethods_Values.length > 0) {

            const resultado = paymentMethods_Values
                .map(({ key, print = [] }) => `  🞂 EN ${key}:${print.join(',')}`)
                .join('.~\n');
            _notes_ = 'MÉTODO DE PAGO:\n' + resultado + '.~';
        }

        const UpdateValue = {
            "txt_name": (_name_company_ !== '' ? `${_name_company_}\n${_name_}` : _name_),
            "txt_session": _session_number_,
            "txt_level_category": _level_category_.replace('_', ''),
            "txt_book_name": _book_name_,
            "txt_notes": _notes_


        }
        console.groupCollapsed("UpdateValue:");
        console.log(JSON.stringify(UpdateValue));
        console.groupEnd();


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

                            if (_dataset_idField_ === "txt_name") {
                                SpanLabel.replaceChildren();
                                if (_name_company_ !== '') {
                                    SpanLabel.appendChild(document.createTextNode('RECIBIMOS DE:\nEN REPRESENTACIÓN DE:'));
                                } else {
                                    SpanLabel.appendChild(document.createTextNode('RECIBIMOS DE:'));
                                }
                            }
                            if (_dataset_idField_ === "txt_book_name" && _value_ === "") {
                                _field_.classList.add('hide');
                            } else {

                                SpanValue.appendChild(document.createTextNode(_value_));
                            }
                        }
                    }

                })
            }
        });
    }
}
const actualizarEstadoConexion = (online) => {
    console.log(online ? '🟢 Conexión restaurada' : '🔴 Conexión perdida');

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
                maxAmount: 7894.50,
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
            {
                id: 'txt_method_advance',
                label: 'Anticipo',
                type_element: 'checkbox',

                template: {
                    type: 'autosum',
                    table: [{
                        label: 'Datos de Cheques:',
                        headers: ['N° Recibo', 'Monto'],
                        fields: [
                            [
                                { type: 'text', prefix_value: 'REF: ', id: 'reference-chk-1' },
                                { type: 'number', prefix_value: 'C$ ', id: 'amount-chk-1' }
                            ]
                        ]
                    }]
                }
            }

        ],
        context: document,
        preserveAttributes: true,
        onlyEmpty: true,
        autoAttachEvents: true,
        debug: false,
        onclick: (element, isChecked, meta) => {


            if (['txt_retention_1percent', 'txt_retention_2percent'].includes(meta.choiceId)) {
                // pushEvent('onclick', meta.choiceId, isChecked, meta.type_template);
                //console.log(("getTotalAllColumn:", JSON.stringify(tabla.getTotalAllColumn())));
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
                        console.log("txt_retention", JSON.stringify(txt_retention));
                        if (tabla.getTotalAllColumn()) {
                            let total = (tabla.getTotalAllColumn()).__raw['Col4'] || 0;

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
                            console.log('mount:', mount);
                            if (mount < 0) {
                                tabla.insertRow({
                                    row: { Col1: code, Col2: label, Col3: '-', Col4: mount },
                                    remove: false,
                                    idRow: 'RETENCION'
                                });
                            }

                        }
                    }



                }



                /* if (meta.state === 'checked') {
                     if (tabla.getTotalAllColumn()) {
                         let total = (tabla.getTotalAllColumn()).__raw['Col4'];
 
                         tabla.removeRow('ret_1');
                         tabla.removeRow('ret_2');
 
                         tabla.insertRow({
                             row: { Col1: 'RET_1', Col2: 'RETENCIÓN (1%): ', Col3: '-', Col4: -(total * (1 / 100)) },
                             remove: false,
                             idRow: 'ret_1'
                         });
                     }
                 } else {
 
                 }*/
            }


            // console.log('[onclick]', JSON.stringify(meta.values), isChecked);
        },
        // ---------- 👇 NUEVO: onchange ----------
        onchange: (element, values) => {

            console.log('▶ onchange:', element.dataset.choice_id, values);
            /* */
            UpdatePrintBox();
            /*  // element = el .choice-container cuyo menú fue accedido
              // values  = arreglo con { rowIndex, rowLabel, name, id, label, type, value, prefix }
  
              // Render en el panel de la demo
              document.getElementById('onchange-el').textContent =
                  `<div class="choice-container" data-choice_id="${element.dataset.choice_id}">`;
              document.getElementById('onchange-values').textContent =
                  'values = ' + JSON.stringify(values, null, 2);*/
        },
        onAccept: (accepted, container, ctx) => {
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

                console.log(ctx);
            } else {
                ctx.uncheck('[data-choice_id="txt_method_telepago"]');
            }

            // console.log('▶ onAccept:', accepted.toJSON(), 'en', container.dataset.choice_id);

            //printOutput();
        }
    });
    const total = window.ChoiceField.buildAll();

    _HELPERS_.LoadSession("#txt_session", window._SESIONES_);

    const tabla = new DynamicTable('#Dynacmic-table-eli', {
        addItemButtonText: '[+] Click aquí para agregar otro producto',
        onChange: async (ctx) => {
            _HELPERS_.InsertAmount({ data: ctx.getData() });
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
                            let total = (ctx.getTotalAllColumn()).__raw['Col4'] || 0;

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
                            console.log('mount:', mount);
                            if (mount < 0) {
                                tabla.insertRow({
                                    row: { Col1: code, Col2: label, Col3: '-', Col4: mount },
                                    remove: false,
                                    idRow: 'RETENCION'
                                });
                            }

                        }
                    }



                }
            }

        }
    });

    tabla.setHeaders({
        Col1: 'SERVICIOS',
        Col2: 'DETALLE SERVICIO/PRODUCTO',
        Col3: 'COMENTARIO',
        Col4: 'MONTO'
    });

    tabla.setFieldSchema({
        Col1: {
            type: 'select',
            required: true,
            insertLabel: 'null',


            options: [

                { value: 'LBR', idRow: 'LIBRO', label: 'COMPRA DE LIBRO', label_field: 'NOMBRE DEL LIBRO', idSlug: true, blockRow: false },
                { value: 'MORA', label: 'MORA POR INSCRIPCIÓN TARDÍA', label_field: 'DETALLE DE OTROS SERVICIOS', price: '700', idSlug: true, blockRow: false },
                { value: 'OTROS', label: 'OTROS SERVICIOS', label_field: 'DETALLE DE OTROS SERVICIOS', idSlug: false, blockRow: false },

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
                                label_field: 'CÓDIGO DE BECA',

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
                                label_field: 'CÓDIGO DE BECA',
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
                                label_field: 'NOMBRE DEL FAMILIAR',
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
                                label_field: 'NOMBRE DE LA EMPRESA',
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
                                label_field: 'NOMBRE DEL COLEGIO',
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
                                value: '050-BTT', label: '50% DESC. TOTAL', discount: {
                                    type: 'percentage',
                                    value: '50'
                                },
                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                            {
                                value: '100-BTT', label: '100% DESC. TOTAL', discount: {
                                    type: 'percentage',
                                    value: '100'
                                },
                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                            {
                                value: '050-BT/201-RR', label: '50% RECONOCIMIENTO DE RECIBO', discount: {
                                    type: 'percentage',
                                    value: '50'
                                },
                                label_field: 'CÓDIGO DE RECONOCIMEMTO',
                                idRow: 'DESCUENTO',
                                blockRow: true
                            },
                            {
                                value: '100-BT/201-RR', label: '100% RECONOCIMIENTO DE RECIBO', discount: {
                                    type: 'percentage',
                                    value: '100'
                                },
                                label_field: 'CÓDIGO DE RECONOCIMEMTO',
                                idRow: 'DESCUENTO',
                                blockRow: true
                            },

                        ]
                    }
                },
                {
                    group: {
                        label: "VARIOS",
                        options: [
                            { value: 'ANT', label: 'ANTICIPO' },
                            { value: 'CURSO-INT-ONLINE', label: 'ANTICIPO CURSO INTENSIVO' },
                            { value: 'BTL-PLAST', label: 'COMPRA DE BOTELLA PLÁSTICA' },
                            { value: 'CAN', label: 'CANCELACIÓN DE FACTURA' },
                            { value: 'ABONO', label: 'ABONO A LA CUENTA' },
                            { value: 'CAM-GRAD', label: 'CAMISA PARA GRADUACIÓN', price: '600' },
                        ]
                    }
                },
                {
                    group: {
                        label: "TRANSPORTE",
                        options: [
                            { value: 'TRANSP-SEBACO', label: 'SÉBACO', price: '600.00' },
                            { value: 'TRANSP-SAN_ISIDRO', label: 'SAN ISIDRO', price: '600.00' },
                            { value: 'TRANSP-TRINIDAD', label: 'LA TRINIDAD', price: '600.00' },

                        ]
                    }
                },
                {
                    group: {
                        label: "EXAMENES",
                        options: [
                            { value: 'UBICA-EXAM', label: 'EXAMEN DE UBICACIÓN ALUMNO NUEVO', price: '200' },
                            { value: 'REUBICA-EXAM', label: 'EXAMEN DE REUBICACIÓN ALUMNO ACTIVO', price: '400' },
                            { value: 'REP-EXAM', label: 'REPOSICIÓN DE EXAMEN', price: '600.00' },
                            { value: 'REP-MORA', label: 'REPOSICIÓN DE EXAMEN CON MULTA', price: '600.00' },
                            { value: 'REP-MORA-FT', label: 'REPOSICIÓN DE EXAMEN FUERA DE TIEMPO', price: '600.00' },
                        ]
                    }
                },

                {
                    group: {
                        label: "CONSTANCIAS",
                        options: [
                            { value: 'CONST-ACTIV', label: 'CONSTANCIA DE ALUMNO ACTIVO', price: '600.00' },
                            { value: 'CONST-INACTIV', label: 'CONSTANCIA DE ALUMNO INACTIVO', price: '600.00' },
                        ]
                    }
                },
                {
                    group: {
                        label: "REPOSICIONES",
                        opt: [
                            { value: 'REPOSICION-DIPLO', label: 'REPOSICIÓN DE DIPLOMA', price: '600.00' },
                            { value: 'REPOSICION-CERTI', label: 'REPOSICIÓN DE CERTIFICADO', price: '600.00' },
                        ]
                    }
                }


            ],
            /* AQUI CONTINUAR CON LA OPRIÖN DE COLUMNAS EN EL POPUP */
            class: ["one_of_one"],
            styles: {
                'field-Col1': {
                    'text-align': 'left'
                },
                'field-Col2': {
                    'text-align': 'left'
                },
                'field-Col3': {
                    'text-align': 'left'
                }
                ,
                'field-Col4': {
                    'text-align': 'right'
                }
            },
            afterOpen: (field, ctx) => {
                //console.log(field, ctx);
                const opt = field.querySelectorAll('[label="BECAS"], [label*="DESCUENTOS"]') || full;
                const _txt_receipt_type_ = $getEl('#txt_receipt_type');
                if (opt) {
                    if (_txt_receipt_type_) {
                        if (_txt_receipt_type_.value === 'OTROS') {
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
            },
            onChange: (value, option, field, ctx) => {

                if (_HELPERS_.existe(option)) {

                    const _Field_Ditails_ = 'Col2';
                    const _Field_amount = 'Col4';

                    const discount = {
                        type: String(option?.discount?.type ?? 'percentage').toLowerCase(),
                        value: parseFloat(Number(String((option?.discount?.value || '0%').replace('%', ''))))
                    }
                    const _Categories_level_box_ = document.querySelector('._row_selected_book');

                    if (_Categories_level_box_) {
                        _Categories_level_box_.classList.add('hide');
                    }

                    ctx.setValue({ colKey: _Field_Ditails_, val: '', readOnly: true, disabled: true });
                    ctx.setValue({ colKey: _Field_amount, val: '', readOnly: true, disabled: true });

                    const _Ditails_ = document.querySelector('.dialog-field[data-col="' + _Field_Ditails_ + '"]');

                    if (_Ditails_) {
                        _Ditails_.style.display = 'none';
                    }

                    if (option.value === 'LBR') {

                        if (_Categories_level_box_) {
                            _Categories_level_box_.classList.remove('hide');
                        }
                        const _field_2_ = document.querySelectorAll('.dynamic-table-dialog div[data-col="Col2"]')[0];
                        if (_field_2_) {

                            if (!_Categories_level_box_) {
                                const contenSelectorBooks = document.createElement('div');
                                contenSelectorBooks.classList.add('dialog-field', '_row_selected_book', 'one_of_one');
                                const _label_ = document.createElement('label');
                                _label_.appendChild(document.createTextNode('CATEGORÍA / NIVEL'));
                                const _levels_ = document.createElement('select');
                                _levels_.id = 'txt_dialog_lavels';


                                const _Categories_ = document.createElement('select');
                                _Categories_.id = 'txt_dialog_categories';
                                ["", "EARLY SUCCESS", "CHILDREN PROGRAM", "ADOLESCENTE", "ADULTO"].forEach(item => {
                                    const opt = document.createElement('option');
                                    opt.value = item.replace(' ', '-')
                                    if (item === "") {
                                        opt.appendChild(document.createTextNode("-PROGRAMAS-"));
                                        opt.selected = true;
                                    } else {
                                        opt.appendChild(document.createTextNode(item))
                                    }
                                    _Categories_.appendChild(opt);
                                });
                                _Categories_.addEventListener('change', (e) => {
                                    const _this_ = e.target;
                                    const _LEVELS_WITH_BOOKS = (window._DATA_ELI_[window._SEDE_][_this_.value] || { niveles: null });
                                    const __levels__ = document.querySelector('#txt_dialog_lavels');
                                    _levels_.replaceChildren();
                                    ctx.setValue({ colKey: _Field_Ditails_, val: '', readOnly: true, disabled: true });
                                    ctx.setValue({ colKey: _Field_amount, val: '', readOnly: true, disabled: true });

                                    if (_levels_ && (_LEVELS_WITH_BOOKS?.niveles || null)) {
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
                                            __levels__.appendChild(opt);
                                        })
                                    }
                                });

                                _levels_.addEventListener('change', (e) => {
                                    const _this_ = e.target;
                                    const _categories_ = document.querySelector('#txt_dialog_categories');
                                    if (!_this_ || !_categories_) return;
                                    const _DATA_BOOK_ = (window._DATA_ELI_[window._SEDE_][_categories_.value] || { niveles: null })
                                    const _DATA_ = (_DATA_BOOK_.niveles[_this_.value] || null);
                                    if (_DATA_) {
                                        ctx.setValue({ colKey: _Field_Ditails_, val: _DATA_["title-book"], readonly: true, disabled: true });
                                        ctx.setValue({ colKey: _Field_amount, val: _DATA_["price"], readonly: true, disabled: true });

                                    } else {
                                        ctx.setValue({ colKey: _Field_Ditails_, val: '', readonly: true, disabled: true });
                                        ctx.setValue({ colKey: _Field_amount, val: '', readonly: true, disabled: true });

                                    }
                                });
                                contenSelectorBooks.append(_label_, _Categories_, _levels_);


                                _field_2_.before(contenSelectorBooks);
                            }
                        }

                        ctx.setValue({ colKey: _Field_Ditails_, val: '', readOnly: true, disabled: true });
                        ctx.setValue({ colKey: _Field_amount, val: '', readOnly: true, disabled: true });

                    }
                    else if (['050-BTT', '100-BTT', '050-BT/201-RR', '100-BT/201-RR'].includes(option.value)) {
                        if (_Ditails_) {
                            _Ditails_.style.display = 'unset';
                        }
                        ctx.setValue({ colKey: _Field_Ditails_, val: '' });
                        ctx.setValue({ colKey: _Field_amount, val: (((ctx.getTotalAllColumn()).__raw[_Field_amount] * (discount.value / 100)) * (-1)), readOnly: true, disabled: true });
                    }

                    else {
                        if (_HELPERS_.existe(option.discount)) {

                            if (_Ditails_) {
                                _Ditails_.style.display = 'unset';
                            }


                            ctx.setValue({ colKey: _Field_Ditails_, val: '', readOnly: false, disabled: false });
                            if (discount.type === 'percentage') {
                                const referenceValue = ((_HELPERS_.sumNumericValues(ctx.getCellValue("Col1", "CLG", "Col4"))) * (discount.value / 100)) * -1;

                                ctx.setValue({ colKey: _Field_amount, val: referenceValue, readOnly: true, disabled: true });
                            }


                        } else if (_HELPERS_.existe(option.price)) {
                            if (_HELPERS_.esNumerico(option.price)) {

                                ctx.setValue({ colKey: _Field_Ditails_, val: option ? option.label : '', readOnly: true, disabled: true });
                                ctx.setValue({ colKey: _Field_amount, val: option.price, readOnly: true, disabled: true });
                            }
                        } else {

                            console.clear();

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
            onBeforeSave: (cell_value = '', row = {}) => {

                console.log("cell_value:", cell_value, "   row:", row);
                let new_value;
                let CurrentValue = String(cell_value).trim().toUpperCase();
                const _CODE_ = row?.Col1 ?? '';


                if (['LBR', '050-MB', '100-BC', '010-DF', '010-DC', '015-DC', '005-DT', '010-DT', '050-BT/201-RR', '100-BT/201-RR', '100-BTT', '050-BTT'].includes(_CODE_)) {
                    switch (_CODE_) {
                        case 'LBR':
                            new_value = 'LIBRO: ' + CurrentValue;
                            break;
                        case '010-DF':
                            new_value = "DESC 10%. FAMILIAR/" + CurrentValue;
                            break;

                        case '010-DC':
                            new_value = "DESC 10%. COLEGIO/" + CurrentValue;
                            break;
                        case '015-DC':
                            new_value = "DESC 10%. EMPRESA/" + CurrentValue;
                            break;
                        case '005-DT':
                            new_value = "DESC 5%. TEMPORAL/" + CurrentValue;
                            break;
                        case '010-DT':
                            new_value = "DESC 10%. TEMPORAL/" + CurrentValue;
                            break;
                        case '050-BTT':
                            new_value = "50% DESC. TERMPORAL/" + CurrentValue;
                            break;


                        case '100-BTT':
                            new_value = "100% DESC. TOTAL TEMPORAL/" + CurrentValue;
                            break;
                        case '050-BT/201-RR':
                            new_value = "50% RECONOCIMIENTO DE RECIBO/" + CurrentValue;
                            break;
                        case '100-BT/201-RR':
                            new_value = "100% RECONOCIMIENTO DE RECIBO/" + CurrentValue;
                            break;
                        case '050-MB':
                            new_value = '50% MEDIA BECA/' + CurrentValue;
                            break;


                        default:
                            new_value = CurrentValue;
                            break;
                    }
                }
                return new_value;
            },
        },
        Col3: {
            required:
                false,
            type: 'text',
            class: ["one_of_one"]
        },
        Col4: {
            required:
                true,
            type: 'number',
            class: ["one_of_three", "align-right"]
        }
    });
    tabla.createBody({ total_row: 6 });



    tabla.updateTFoot({
        sumAllColumn: { Col4: true },
        LabelTotal: { Col3: true }
    });

    // ChoiceField.disableAll();
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
                        case 'CLG-REPITE': case 'OTROS':
                            _HELPERS_.EnableMaterialInputs('txt_name,txt_company,txt_session');
                            break;
                        case 'CLG-NUEVO':
                            _HELPERS_.EnableMaterialInputs('txt_name,txt_company,txt_session,txt_contact_info');
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
                    const _txt_receipt_type_ = $getEl("#txt_receipt_type");
                    const DialogTable = $getEl('.dynamic-table-dialog');


                    if (DialogTable && _txt_receipt_type_) {
                        DialogTable.dataset.filter = _txt_receipt_type_;
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
                        if (_DATA_PRICES_ && _txt_receipt_type_) {
                            if (!['CLG', 'CLG-NUEVO', 'CLG-REPITE'].includes(_txt_receipt_type_.value)) return;
                            let _CLG_ = _DATA_PRICES_?.precios?.colegiatura || '0.00';
                            let _LBR_ = _DATA_PRICES_?.niveles?.[_level_]?.price || '0.00';
                            let _LBR_NAME_ = _DATA_PRICES_?.niveles?.[_level_]?.['title-book'] || '';

                            if (_txt_receipt_type_.value === 'CLG-REPITE') {
                                _LBR_NAME_ = '';
                                _LBR_ = '0.00';
                            }



                            if ($getEl('[data-choice_id="txt_method_cash"] .menu')) {
                                $getEl('[data-choice_id="txt_method_cash"] .menu').setAttribute('data-maxamount', parseFloat(_CLG_) + parseFloat(_LBR_));
                                $getEl('[data-choice_id="txt_method_cash"] #details-cash_change').value = parseFloat(_CLG_) + parseFloat(_LBR_);

                            }
                            tabla.insertRow({
                                row: { Col1: 'CLG', Col2: 'COLEGIATURA', Col3: '-', Col4: String(_CLG_) },
                                remove: false
                            });
                            if (_LBR_ && _LBR_ !== '0.00') {

                                _HELPERS_.EnableMaterialInputs('txt_book');
                                window._BOOKS_.loadBook({ sede: _sede_, category: _category_, level: _level_, bookTitle: _LBR_NAME_ })

                                console.log(_LBR_NAME_);
                                tabla.insertRow({
                                    row: { Col1: 'LBR', Col2: 'LIBRO/' + _LBR_NAME_, Col3: '-', Col4: String(_LBR_) },
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
        console.log(hours + '<' + window.hourmax_change_receipt_day);
        return hours < window.hourmax_change_receipt_day || (hours === window.hourmax_change_receipt_day && minutes === 0);
    }

    const _ACTIONS_BUTTONS_ = document.querySelectorAll('footer .container-actionbuttons span[data-tooltip]');
    if (_ACTIONS_BUTTONS_) {
        _ACTIONS_BUTTONS_.forEach(_BTN_ => {
            _BTN_.addEventListener('click', async function (e) {
                const _action_ = this.id;

                switch (_action_) {
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



                        console.log('formValues:', JSON.stringify(formValues));
                        if (formValues) {

                            //console.log(formValues.NEW_DATE);
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