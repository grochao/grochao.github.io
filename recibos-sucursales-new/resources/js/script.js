const _HELPERS_ = {
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


window.addEventListener('load', function () {
    const ChoiceField = new ChoiceContainerBuilder({
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
        // ---------- 👇 NUEVO: onchange ----------
        onchange: (element, values) => {
            /*  // element = el .choice-container cuyo menú fue accedido
              // values  = arreglo con { rowIndex, rowLabel, name, id, label, type, value, prefix }
              console.log('▶ onchange:', element.dataset.choice_id, values);
  
              // Render en el panel de la demo
              document.getElementById('onchange-el').textContent =
                  `<div class="choice-container" data-choice_id="${element.dataset.choice_id}">`;
              document.getElementById('onchange-values').textContent =
                  'values = ' + JSON.stringify(values, null, 2);*/
        },
        /*
                onAccept: (accepted, container) => {
                    console.log('▶ onAccept:', accepted.toJSON(), 'en', container.dataset.choice_id);
                    printOutput();
                }*/
    });
    const total = ChoiceField.buildAll();

    _HELPERS_.LoadSession("#txt_session", window._SESIONES_);

    const tabla = new DynamicTable('#Dynacmic-table-eli', {
        addItemButtonText: '[+] Click aquí para agregar otro producto'
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
            insertLabel: 'Col2',
            options: [

                { value: 'LBR', label: 'COMPRA DE LIBRO', label_field: 'NOMBRE DEL LIBRO' },
                { value: 'MORA', label: 'MORA POR INSCRIPCIÓN TARDÍA', label_field: 'DETALLE DE OTROS SERVICIOS', price: '700' },
                { value: 'OTROS', label: 'OTROS SERVICIOS', label_field: 'DETALLE DE OTROS SERVICIOS' },
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
                                label_field: 'CÓDIGO DE BECA'
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
                                label_field: 'CÓDIGO DE BECA'
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
                                label_field: 'NOMBRE DEL FAMILIAR'
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
                                label_field: 'NOMBRE DE LA EMPRESA'
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
                                label_field: 'NOMBRE DEL COLEGIO'
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
                                }
                            },
                            {
                                value: '010-DT', label: '10% TEMPORAL', discount: {
                                    type: 'percentage',
                                    value: '10'
                                },
                            },
                            {
                                value: '050-BTT', label: '50% DESC. TOTAL', discount: {
                                    type: 'percentage',
                                    value: '50'
                                },
                            },
                            {
                                value: '100-BTT', label: '100% DESC. TOTAL', discount: {
                                    type: 'percentage',
                                    value: '100'
                                },
                            },
                            {
                                value: '050-BT/201-RR', label: '50% RECONOCIMIENTO DE RECIBO', discount: {
                                    type: 'percentage',
                                    value: '50'
                                },
                                label_field: 'CÓDIGO DE RECONOCIMEMTO'
                            },
                            {
                                value: '100-BT/201-RR', label: '100% RECONOCIMIENTO DE RECIBO', discount: {
                                    type: 'percentage',
                                    value: '100'
                                },
                                label_field: 'CÓDIGO DE RECONOCIMEMTO'
                            },

                        ]
                    }
                },
                {
                    group: {
                        label: "VARIOS",
                        options: [
                            { value: 'BTL-PLAST', label: 'COMPRA DE BOTELLA PLÁSTICA' },
                            { value: 'CAN', label: 'CANCELACIÓN DE FACTURA' },
                            { value: 'ABONO', label: 'ABONO A LA CUENTA' },
                            { value: 'CURSO-INT-ONLINE', label: 'ANTICIPO CURSO INTENSIVO' },
                            { value: 'CAM-GRAD', label: 'CAMISA PARA GRADUACIÓN', price: '600' },
                            { value: 'ANT', label: 'REGISTRAR COMO ANTICIPO' },
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
                            new_value = CurrentValue + '/MEDIA BECA';
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
    tabla.createBody({ total_row: 7 });



    tabla.updateTFoot({
        sumAllColumn: { Col4: true },
        LabelTotal: { Col3: true }
    });

    // ChoiceField.disableAll();
    _HELPERS_.DisableMaterialInputs();

    console.groupCollapsed('books');
    window._BOOKS_.setInit({ selectorBookTitle: '[data-field_status="txt_book"]', selectorBookCover: "#book-cover" })
    console.groupEnd();

    tabla.disableTable();

    const watcher = FormChangeWatcher.attach('#TheForm', {
        onChange: (payload, el, ev) => {
            const _ID_ = payload.id || null;
            const _VALUE_ = String(payload.value || '').trim();



            let _DATA_LEVELS_, _sesion_, _sede_, _category_;
            if (['txt_receipt_type', "txt_session", 'txt_categories', 'txt_levels'].includes(_ID_)) {
                tabla.clearBody();
                tabla.disableTable();
            }
            switch (_ID_) {
                case 'txt_receipt_type':
                    _HELPERS_.DisableMaterialInputs();
                    ChoiceField.disableAll();
                    tabla.clearBody();
                    tabla.disableTable();
                    window._BOOKS_.clearBook();
                    //36436656 - 
                    switch (_VALUE_) {
                        case 'CLG':
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
                    ChoiceField.disableAll();
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
                    ChoiceField.disableAll();
                    tabla.clearBody();
                    tabla.disableTable();
                    window._BOOKS_.clearBook();
                    _HELPERS_.DisableMaterialInputs('txt_levels,txt_notes');

                    if (_VALUE_ !== '') {
                        _sesion_ = document.querySelector("#txt_session") || null;
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
                    ChoiceField.disableAll();
                    // tabla.enableTable();
                    tabla.clearBody();
                    tabla.disableTable();
                    window._BOOKS_.clearBook();
                    _HELPERS_.EnableMaterialInputs('txt_notes');
                    _HELPERS_.DisableMaterialInputs('txt_book');
                    _sesion_ = document.querySelector("#txt_session") || null;

                    _sede_ = (_sesion_) ? String(_sesion_.value).substring(4, 7) : null;
                    _category_ = document.querySelector("#txt_categories") || false ? document.querySelector("#txt_categories").value : null;

                    let _level_ = String(_VALUE_).trim() || null;
                    if (_sesion_ && _sede_ && _category_ && _level_) {
                        const _DATA_PRICES_ = window._DATA_ELI_?.[_sede_]?.[_category_] || null;
                        ChoiceField.enableAll();
                        if (_DATA_PRICES_) {
                            let _CLG_ = _DATA_PRICES_?.precios?.colegiatura || '0.00';
                            let _LBR_ = _DATA_PRICES_?.niveles?.[_level_]?.price || '0.00';
                            let _LBR_NAME_ = _DATA_PRICES_?.niveles?.[_level_]?.['title-book'] || '';


                            if (document.querySelector('[data-choice_id="txt_method_cash"] .menu')) {
                                document.querySelector('[data-choice_id="txt_method_cash"] .menu').setAttribute('data-maxamount', parseFloat(_CLG_) + parseFloat(_LBR_));
                                document.querySelector('[data-choice_id="txt_method_cash"] #details-cash_change').value = parseFloat(_CLG_) + parseFloat(_LBR_);

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
                                    row: { Col1: 'LBR', Col2: 'LIBRO: ' + _LBR_NAME_, Col3: '-', Col4: String(_LBR_) },
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
        }
    });


});