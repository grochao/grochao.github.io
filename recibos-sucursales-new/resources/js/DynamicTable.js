
/* ============================================================
 *  DynamicTable
 *  insertPosition + idRow + idSlug + blockRow + afterOpen + onChange + silent
 * ============================================================ */
class DynamicTable {
    #container;
    #table = null;
    #thead = null;
    #tbody = null;
    #tfoot = null;

    #headers = {};
    #options = {};
    #debug = false;
    #lastTFootOptions = { sumAllColumn: {}, LabelTotal: {} };
    #fieldSchema = {};
    #schemaAfterOpen = null;
    #onChange = null;
    #changeDepth = 0;
    #rowCounter = 0;
    #abortController = null;
    #tableDisabled = false;

    #lastTotalRow = null;

    #dialog = null;
    #dialogFieldsContainer = null;
    #dialogErrorBox = null;

    #NUMERIC_TYPES = new Set(['number', 'currency', 'money', 'decimal', 'float', 'int', 'integer']);
    #DISABLED_CLASS = 'disableTable';
    #DEFAULT_TOTAL_ROW = 1;

    constructor(container, options = {}) {
        this.#container = (typeof container === 'string')
            ? document.querySelector(container)
            : container;

        if (!this.#container) throw new Error('DynamicTable: contenedor no encontrado.');

        this.#debug = options.debug ?? false;
        this.#onChange = typeof options.onChange === 'function' ? options.onChange : null;
        this.#options = {
            tableClass: options.tableClass ?? 'dynamic-table',
            addItemRowClass: options.addItemRowClass ?? 'add-item-row',
            addItemButtonClass: options.addItemButtonClass ?? 'add-item',
            addItemButtonText: options.addItemButtonText ?? '+ Agregar fila',
            removeButtonClass: options.removeButtonClass ?? 'remove-row',
            defaultRemovable: options.defaultRemovable ?? false,
            disabledClass: options.disabledClass ?? this.#DISABLED_CLASS,
            insertPosition: ['afterLastData', 'firstEmpty', 'beforeAdd']
                .includes(options.insertPosition) ? options.insertPosition : 'afterLastData'
        };

        this.#table = document.createElement('table');
        this.#table.classList.add(this.#options.tableClass);

        this.#thead = document.createElement('thead');
        this.#tbody = document.createElement('tbody');
        this.#tfoot = document.createElement('tfoot');

        this.#table.appendChild(this.#thead);
        this.#table.appendChild(this.#tbody);
        this.#table.appendChild(this.#tfoot);

        this.#container.innerHTML = '';
        this.#container.appendChild(this.#table);

        this.#abortController = new AbortController();
        const { signal } = this.#abortController;

        this.#tbody.addEventListener('click', (e) => {
            if (this.#tableDisabled) return;
            const btn = e.target.closest(`.${this.#options.addItemButtonClass}`);
            if (!btn || btn.disabled) return;
            this.openInsertDialog();
        }, { signal });

        this.#buildDialog(signal);
    }

    /* ---------- Numéricos ---------- */
    #sanitizeNumeric(value) {
        let v = String(value ?? '');
        const trimmed = v.trimStart();
        const isNegative = trimmed.startsWith('-');

        v = v.replace(/[^\d.]/g, '');
        const firstDot = v.indexOf('.');
        if (firstDot !== -1) {
            v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
        }
        if (!v.startsWith('0.')) v = v.replace(/^0+(?=\d)/, '');
        if (isNegative && v !== '' && v !== '.') v = '-' + v;
        return v;
    }

    #formatWithCommas(value) {
        let v = String(value ?? '');
        const trimmed = v.trimStart();
        const isNegative = trimmed.startsWith('-');

        v = v.replace(/[^\d.]/g, '');
        const firstDot = v.indexOf('.');
        if (firstDot !== -1) {
            v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
        }

        let intPart = v;
        let decPart = '';
        if (firstDot !== -1) {
            intPart = v.slice(0, firstDot);
            decPart = v.slice(firstDot);
        }
        intPart = intPart.replace(/^0+(?=\d)/, '');
        if (intPart) intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (isNegative ? '-' : '') + intPart + decPart;
    }

    #formatNumeric2Decimals(value) {
        const cleaned = this.#sanitizeNumeric(value);
        if (cleaned === '' || cleaned === '.' || cleaned === '-') return '';

        const num = parseFloat(cleaned);
        if (isNaN(num)) return '';

        const isNegative = num < 0;
        const fixed = Math.abs(num).toFixed(2);
        const [intPart, decPart] = fixed.split('.');
        const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (isNegative ? '-' : '') + withCommas + '.' + decPart;
    }

    #isNumericValue(value) {
        if (typeof value === 'number') return Number.isFinite(value);
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (trimmed === '') return false;
            return /^-?\d[\d,]*(\.\d+)?$/.test(trimmed);
        }
        return false;
    }

    #parseNumeric(value) {
        if (value === null || value === undefined) return null;
        const cleaned = String(value).replace(/[^\d.,-]/g, '').replace(/,/g, '');
        if (cleaned === '' || cleaned === '-') return null;
        const n = parseFloat(cleaned);
        return isNaN(n) ? null : n;
    }

    /* ---------- Slug ---------- */
    #slugify(str) {
        return String(str ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /* ---------- Texto / celdas ---------- */
    #setText(el, text) {
        if (!el) return;
        while (el.firstChild) el.removeChild(el.firstChild);
        el.appendChild(document.createTextNode(text ?? ''));
    }

    #readText(el) {
        if (!el) return '';
        let out = '';
        const walk = (node) => {
            if (node.nodeType === 3) out += node.nodeValue;
            else if (node.childNodes && node.childNodes.length) node.childNodes.forEach(walk);
        };
        el.childNodes.forEach(walk);
        return out;
    }

    #createTd(colKey, value = '') {
        const td = document.createElement('td');
        if (colKey) td.dataset.col = colKey;
        const span = document.createElement('span');
        span.appendChild(document.createTextNode(value ?? ''));
        td.appendChild(span);
        return td;
    }

    #setTdValue(td, value) {
        if (!td) return;
        let span = td.querySelector('span');
        if (!span) { span = document.createElement('span'); td.appendChild(span); }
        while (span.firstChild) span.removeChild(span.firstChild);
        span.appendChild(document.createTextNode(value ?? ''));
    }

    #getTdValue(td) {
        if (!td) return '';
        const span = td.querySelector('span');
        return this.#readText(span || td);
    }

    /* ---------- Estilos ---------- */
    #applyStyles(rootContainer, stylesMap) {
        if (!rootContainer || !stylesMap) return;

        Object.entries(stylesMap).forEach(([targetKey, cssProps]) => {
            if (!cssProps || typeof cssProps !== 'object') return;

            let el = null;
            try { el = rootContainer.querySelector(`#${CSS.escape(targetKey)}`); }
            catch (_) { el = null; }

            if (!el) {
                const wrapper = rootContainer.querySelector(`.dialog-field[data-col="${targetKey}"]`);
                if (wrapper) el = wrapper.querySelector('input, select, textarea');
            }
            if (!el) return;

            Object.entries(cssProps).forEach(([prop, val]) => {
                if (prop.includes('-')) el.style.setProperty(prop, val);
                else el.style[prop] = val;
            });
        });
    }

    #collectSchemaStyles() {
        const all = {};
        Object.values(this.#fieldSchema).forEach(cfg => {
            if (!cfg || typeof cfg !== 'object') return;
            const st = cfg.styles;
            if (!st || typeof st !== 'object') return;

            Object.entries(st).forEach(([targetKey, cssProps]) => {
                all[targetKey] = { ...(all[targetKey] || {}), ...cssProps };
            });
        });
        return all;
    }

    /* ---------- Opciones / selects ---------- */
    #isGroupItem(item) {
        return !!(item && typeof item === 'object' && item.group && typeof item.group === 'object');
    }

    #getGroupOptions(groupObj) {
        if (!groupObj) return [];
        if (Array.isArray(groupObj.options)) return groupObj.options;
        if (Array.isArray(groupObj.opt)) return groupObj.opt;
        return [];
    }

    #flattenOptions(options = []) {
        const out = [];
        options.forEach(item => {
            if (this.#isGroupItem(item)) {
                const inner = this.#getGroupOptions(item.group);
                inner.forEach(o => out.push(o));
            } else out.push(item);
        });
        return out;
    }

    #createOptionElement(opt) {
        const option = document.createElement('option');
        option.value = opt.value;
        option.dataset.label = opt.label;

        Object.entries(opt).forEach(([k, v]) => {
            if (k === 'value' || k === 'label') return;
            if (typeof v === 'object') return;
            option.dataset[k] = v;
        });

        option.appendChild(document.createTextNode(opt.label));
        return option;
    }

    #populateSelect(select, options = []) {
        const empty = document.createElement('option');
        empty.value = '';
        empty.appendChild(document.createTextNode('— Seleccionar —'));
        select.appendChild(empty);

        options.forEach(item => {
            if (this.#isGroupItem(item)) {
                const groupLabel = item.group.label ?? '';
                const optgroup = document.createElement('optgroup');
                optgroup.label = groupLabel;

                const groupOptions = this.#getGroupOptions(item.group);
                groupOptions.forEach(opt => {
                    optgroup.appendChild(this.#createOptionElement(opt));
                });
                select.appendChild(optgroup);
            } else select.appendChild(this.#createOptionElement(item));
        });
    }

    /* ---------- Filtro numérico ---------- */
    #attachNumericFilter(input) {
        const self = this;

        input.addEventListener('keydown', (e) => {
            const allowedKeys = [
                'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                'Home', 'End'
            ];
            if (allowedKeys.includes(e.key)) return;
            if (e.ctrlKey || e.metaKey) return;

            if (e.key === '-') {
                const start = input.selectionStart ?? 0;
                const end = input.selectionEnd ?? 0;
                const hasMinus = input.value.includes('-');
                if (!hasMinus && start === 0 && end === 0) return;
                e.preventDefault();
                return;
            }

            if (e.key === '.') {
                if (input.value.includes('.')) e.preventDefault();
                return;
            }
            if (!/^\d$/.test(e.key)) e.preventDefault();
        });

        const applyFilter = () => {
            const rawValue = input.value;
            const cursorPos = input.selectionStart ?? rawValue.length;
            const beforeCursor = rawValue.slice(0, cursorPos);
            const significantBefore = (beforeCursor.match(/[-\d.]/g) || []).length;

            const formatted = self.#formatWithCommas(rawValue);

            if (rawValue !== formatted) {
                input.value = formatted;
                let newPos = 0;
                let count = 0;
                for (let i = 0; i < formatted.length; i++) {
                    if (count >= significantBefore) break;
                    if (/[-\d.]/.test(formatted[i])) count++;
                    newPos = i + 1;
                }
                if (significantBefore === 0) newPos = 0;
                try { input.setSelectionRange(newPos, newPos); } catch (_) { }
            }
        };

        input.addEventListener('input', applyFilter);
        input.addEventListener('paste', () => { setTimeout(applyFilter, 0); });
    }

    /* ---------- Label dinámico ---------- */
    #updateLabelText(labelEl, newText) {
        if (!labelEl) return;
        let textNode = null;
        for (const child of labelEl.childNodes) {
            if (child.nodeType === 3) { textNode = child; break; }
        }
        if (textNode) textNode.nodeValue = newText ?? '';
        else labelEl.insertBefore(document.createTextNode(newText ?? ''), labelEl.firstChild);
    }

    #applyLabelField(fieldConfig, option) {
        if (!fieldConfig || typeof fieldConfig !== 'object') return;
        const targetCol = fieldConfig.insertLabel;
        if (!targetCol) return;

        const targetWrapper = this.#dialogFieldsContainer.querySelector(`.dialog-field[data-col="${targetCol}"]`);
        if (!targetWrapper) return;

        const targetLabel = targetWrapper.querySelector('label');
        if (!targetLabel) return;

        let newLabel = this.#headers[targetCol] ?? targetCol;

        if (option && typeof option.label_field === 'string' && option.label_field.trim() !== '') {
            const lf = option.label_field.trim();
            newLabel = Object.prototype.hasOwnProperty.call(this.#headers, lf) ? this.#headers[lf] : lf;
        }
        this.#updateLabelText(targetLabel, newLabel);
    }

    #getFieldLabelText(wrapper) {
        if (!wrapper) return '';
        const label = wrapper.querySelector('label');
        if (!label) return '';
        for (const child of label.childNodes) {
            if (child.nodeType === 3) return child.nodeValue.trim();
        }
        return label.textContent.trim();
    }

    /* ---------- Headers / schema ---------- */
    setHeaders(headers = {}) {
        this.#headers = { ...headers };
        this.#thead.innerHTML = '';
        const tr = document.createElement('tr');

        const thEmpty = document.createElement('th');
        thEmpty.classList.add('col-actions');
        tr.appendChild(thEmpty);

        Object.entries(this.#headers).forEach(([key, label]) => {
            const th = document.createElement('th');
            th.dataset.col = key;
            th.appendChild(document.createTextNode(label ?? ''));
            tr.appendChild(th);
        });

        this.#thead.appendChild(tr);
        this.#fixAddRowColspan();
        return this;
    }

    setFieldSchema(schema = {}) {
        const { __afterOpen, ...fields } = schema;
        this.#fieldSchema = { ...fields };
        this.#schemaAfterOpen = typeof __afterOpen === 'function' ? __afterOpen : null;
        return this;
    }

    /* ---------- Body ---------- */
    createBody({ total_row = 0 } = {}) {
        this.#lastTotalRow = total_row;

        this.#tbody.innerHTML = '';
        for (let i = 0; i < total_row; i++) {
            this.#tbody.appendChild(this.#createEmptyRow(false));
        }
        this.#tbody.appendChild(this.#createAddItemRow());

        this.#syncAddButtonState();
        return this;
    }

    #findLastDataRow() {
        const rows = this.#tbody.querySelectorAll(`tr:not(.${this.#options.addItemRowClass})`);
        let last = null;
        for (const tr of rows) {
            const cells = tr.querySelectorAll('td[data-col]');
            const hasData = cells.length > 0 &&
                Array.from(cells).some(td => this.#getTdValue(td).trim() !== '');
            if (hasData) last = tr;
        }
        return last;
    }

    #findFirstEmptyRow() {
        const rows = this.#tbody.querySelectorAll(`tr:not(.${this.#options.addItemRowClass})`);
        for (const tr of rows) {
            const cells = tr.querySelectorAll('td[data-col]');
            const isEmpty = cells.length > 0 &&
                Array.from(cells).every(td => this.#getTdValue(td).trim() === '');
            if (isEmpty) return tr;
        }
        return null;
    }

    insertRow(options = {}) {
        const cols = Object.keys(this.#headers);
        if (cols.length === 0) return null;

        let data, canRemove, insertAfterto, insertPosition, idRow;
        if (options && typeof options === 'object' && 'row' in options && typeof options.row === 'object') {
            data = options.row || {};
            canRemove = options.remove !== false;
            insertAfterto = options.insertAfterto || null;
            insertPosition = options.insertPosition || this.#options.insertPosition;
            idRow = (typeof options.idRow === 'string' && options.idRow.trim() !== '')
                ? options.idRow.trim() : null;
        } else {
            data = options || {};
            canRemove = true;
            insertAfterto = null;
            insertPosition = this.#options.insertPosition;
            idRow = null;
        }

        if (idRow) {
            const collision = this.#tbody.querySelector(`tr[data-row-id="${CSS.escape(idRow)}"]`);
            if (collision) {
                if (this.#debug) {
                    console.warn(`DynamicTable: idRow "${idRow}" ya existe; se usará uno autogenerado.`);
                }
                idRow = null;
            }
        }

        let target = null;

        if (insertAfterto && typeof insertAfterto === 'object'
            && typeof insertAfterto.cell === 'string'
            && typeof insertAfterto.search === 'string') {

            const searchCell = insertAfterto.cell;
            const searchText = insertAfterto.search.trim().toLowerCase();

            if (searchText !== '') {
                const rows = this.#tbody.querySelectorAll(`tr:not(.${this.#options.addItemRowClass})`);
                let matchRow = null;
                for (const tr of rows) {
                    const td = tr.querySelector(`td[data-col="${searchCell}"]`);
                    if (!td) continue;
                    const cellText = String(this.#getTdValue(td)).toLowerCase();
                    if (cellText.includes(searchText)) { matchRow = tr; break; }
                }

                if (matchRow) {
                    target = this.#createEmptyRow(false, idRow);
                    matchRow.parentNode.insertBefore(target, matchRow.nextSibling);
                }
            }
        }

        if (!target) {
            if (insertPosition === 'firstEmpty') {
                target = this.#findFirstEmptyRow();
                if (target && idRow) {
                    target.dataset.rowId = idRow;
                    target.dataset.customId = 'true';
                }
            }

            if (!target) {
                target = this.#createEmptyRow(false, idRow);
                const addRow = this.#tbody.querySelector(`.${this.#options.addItemRowClass}`);

                if (insertPosition === 'beforeAdd') {
                    if (addRow) this.#tbody.insertBefore(target, addRow);
                    else this.#tbody.appendChild(target);
                } else {
                    const lastDataRow = this.#findLastDataRow();
                    if (lastDataRow) {
                        lastDataRow.parentNode.insertBefore(target, lastDataRow.nextSibling);
                    } else {
                        const firstRow = this.#tbody.querySelector(`tr:not(.${this.#options.addItemRowClass})`);
                        if (firstRow) this.#tbody.insertBefore(target, firstRow);
                        else if (addRow) this.#tbody.insertBefore(target, addRow);
                        else this.#tbody.appendChild(target);
                    }
                }
            }
        }

        if (idRow && target.dataset.rowId !== idRow) {
            target.dataset.rowId = idRow;
        }
        if (idRow) target.dataset.customId = 'true';

        if (canRemove) this.#addDeleteButton(target);
        else this.#removeDeleteButton(target);

        cols.forEach(key => {
            const td = target.querySelector(`td[data-col="${key}"]`);
            if (!td) return;

            let value = data[key];
            if (this.#isNumericValue(value)) {
                value = this.#formatNumeric2Decimals(value);
            }
            this.#setTdValue(td, value ?? '');
        });

        this.#markRowEmptyState(target);
        this._refreshTFoot();

        this.#emitChange('insert', {
            row: target,
            rowId: target.dataset.rowId || null,
            data: this.#snapshotRow(target)
        });

        return target;
    }

    insertFromDialogValues(values = {}) {
        const data = {};
        const consumed = new Set();
        let insertAfterto = null;
        let derivedIdRow = null;
        let blockRow = false;
        let blockRowSource = null;

        Object.entries(this.#headers).forEach(([key]) => {
            if (consumed.has(key)) return;

            const cfg = this.#fieldSchema[key] || {};
            const rawValue = values[key];

            if (cfg.type === 'select') {
                const value = (rawValue === undefined || rawValue === null) ? '' : String(rawValue);
                if (value === '') { data[key] = ''; return; }

                const flat = this.#flattenOptions(cfg.options || []);
                const optConfig = flat.find(o => String(o.value) === value);
                const label = optConfig?.label ?? value;

                if (optConfig) {
                    if (!derivedIdRow
                        && typeof optConfig.idRow === 'string'
                        && optConfig.idRow.trim() !== '') {
                        derivedIdRow = optConfig.idRow.trim();
                    }
                    if (!derivedIdRow && optConfig.idSlug === true) {
                        const s = this.#slugify(optConfig.value);
                        if (s) derivedIdRow = s;
                    }
                    if (optConfig.blockRow === true) {
                        blockRow = true;
                        blockRowSource = key;
                    }
                    if (optConfig.insertAfterto
                        && typeof optConfig.insertAfterto === 'object'
                        && !insertAfterto) {
                        insertAfterto = optConfig.insertAfterto;
                    }
                }

                if (cfg.insertLabel && typeof cfg.insertLabel === 'string') {
                    data[key] = value;
                    data[cfg.insertLabel] = label;
                    consumed.add(cfg.insertLabel);
                } else {
                    data[key] = `${value}/${label}`;
                }
            } else if (this.#NUMERIC_TYPES.has(String(cfg.type || '').toLowerCase())) {
                data[key] = this.#formatNumeric2Decimals(rawValue ?? '');
            } else {
                data[key] = String(rawValue ?? '').trim();
            }
        });

        Object.entries(this.#fieldSchema).forEach(([colKey, cfg]) => {
            if (!cfg || typeof cfg !== 'object') return;
            if (typeof cfg.onBeforeSave !== 'function') return;
            if (!(colKey in data)) return;
            try {
                const original = data[colKey];
                const modified = cfg.onBeforeSave(original, data);
                if (modified !== undefined && modified !== null) data[colKey] = modified;
            } catch (err) {
                console.error(`DynamicTable: error en onBeforeSave("${colKey}")`, err);
            }
        });

        if (blockRow && derivedIdRow) {
            const collision = this.#tbody.querySelector(`tr[data-row-id="${CSS.escape(derivedIdRow)}"]`);
            if (collision) {
                const fieldLabel = this.#headers[blockRowSource] ?? blockRowSource;
                this.#showError(`Ya existe una fila con id "${derivedIdRow}" (derivado de "${fieldLabel}"). Elige otra opción.`);
                if (this.#debug) {
                    console.warn(`DynamicTable: insertRow bloqueado por blockRow:true · idRow="${derivedIdRow}" ya existe.`);
                }
                return null;
            }
        }

        const tr = this.insertRow({
            row: data,
            remove: true,
            insertAfterto,
            ...(derivedIdRow ? { idRow: derivedIdRow } : {})
        });

        if (this.#debug) {
            console.log('DynamicTable: insertFromDialogValues', {
                derivedIdRow, blockRow, blockRowSource, id: tr?.dataset.rowId
            });
        }

        return tr;
    }

    /* ---------- Tfoot ---------- */
    updateTFoot({ sumAllColumn = {}, LabelTotal = {} } = {}) {
        this.#lastTFootOptions = {
            sumAllColumn: { ...sumAllColumn },
            LabelTotal: { ...LabelTotal }
        };

        this.#tfoot.innerHTML = '';
        const cols = Object.keys(this.#headers);
        if (cols.length === 0) return this;

        const tr = document.createElement('tr');
        const tdEmpty = document.createElement('td');
        tdEmpty.classList.add('col-actions');
        tr.appendChild(tdEmpty);

        cols.forEach(key => {
            let value = '';
            if (sumAllColumn[key] === true) value = this.#formatNumber(this.#sumColumn(key));
            else if (LabelTotal[key]) value = (LabelTotal[key] === true) ? 'TOTAL' : LabelTotal[key];
            tr.appendChild(this.#createTd(key, value));
        });

        this.#tfoot.appendChild(tr);
        return this;
    }

    /* ---------- Dialog ---------- */
    openInsertDialog() {
        if (!this.#dialog) return;
        if (this.#tableDisabled) {
            if (this.#debug) console.warn('DynamicTable: openInsertDialog() bloqueado (tabla deshabilitada).');
            return;
        }

        this.#dialogFieldsContainer.innerHTML = '';
        this.#hideError();

        const collectedStyles = this.#collectSchemaStyles();

        Object.entries(this.#headers).forEach(([key, label]) => {
            const fieldConfig = this.#fieldSchema[key] || { type: 'text' };
            const isRequired = fieldConfig.required === true;
            const isNumeric = this.#NUMERIC_TYPES.has(String(fieldConfig.type || '').toLowerCase());

            const wrapper = document.createElement('div');
            wrapper.classList.add('dialog-field');
            wrapper.dataset.col = key;

            if (Array.isArray(fieldConfig.class)) {
                fieldConfig.class.forEach(cls => {
                    if (typeof cls === 'string' && cls.trim() !== '') wrapper.classList.add(cls.trim());
                });
            } else if (typeof fieldConfig.class === 'string' && fieldConfig.class.trim() !== '') {
                fieldConfig.class.trim().split(/\s+/).forEach(cls => {
                    if (cls !== '') wrapper.classList.add(cls);
                });
            }

            const lbl = document.createElement('label');
            lbl.setAttribute('for', `field-${key}`);
            lbl.appendChild(document.createTextNode(label ?? ''));

            if (isRequired) {
                const req = document.createElement('span');
                req.classList.add('req');
                req.appendChild(document.createTextNode('*'));
                lbl.appendChild(req);
            } else {
                const req = document.createElement('sub');
                req.classList.add('sub');
                req.appendChild(document.createTextNode('(Opcional)'));
                lbl.appendChild(req);
            }
            wrapper.appendChild(lbl);

            let field;

            if (fieldConfig.type === 'select') {
                field = document.createElement('select');
                field.id = `field-${key}`;
                field.dataset.col = key;
                field.dataset.fieldType = 'select';
                this.#populateSelect(field, fieldConfig.options || []);

                if (typeof fieldConfig.onChange === 'function') {
                    field.addEventListener('change', () => {
                        const value = field.value;
                        const flat = this.#flattenOptions(fieldConfig.options || []);
                        const optConfig = flat.find(o => String(o.value) === String(value)) || null;
                        const option = optConfig ? { ...optConfig } : null;

                        this.#applyLabelField(fieldConfig, option);
                        this.#clearFieldError(wrapper);
                        const ctx = this.#buildFieldContext(key);
                        try { fieldConfig.onChange(value, option, field, ctx); }
                        catch (err) { console.error('DynamicTable: error en onChange', err); }
                    });
                }
            } else if (fieldConfig.type === 'textarea') {
                field = document.createElement('textarea');
                field.id = `field-${key}`;
                field.dataset.col = key;
                field.dataset.fieldType = 'textarea';
                field.rows = 3;

                field.addEventListener('input', () => {
                    this.#clearFieldError(wrapper);
                    if (typeof fieldConfig.onChange === 'function') {
                        const ctx = this.#buildFieldContext(key);
                        try { fieldConfig.onChange(field.value, null, field, ctx); }
                        catch (err) { console.error('DynamicTable: error en onChange', err); }
                    }
                });
            } else if (isNumeric) {
                field = document.createElement('input');
                field.type = 'text';
                field.inputMode = 'decimal';
                field.autocomplete = 'off';
                field.id = `field-${key}`;
                field.dataset.col = key;
                field.dataset.fieldType = 'number';
                field.dataset.dataType = String(fieldConfig.type || '').toLowerCase();

                this.#attachNumericFilter(field);

                field.addEventListener('input', () => {
                    this.#clearFieldError(wrapper);
                    if (typeof fieldConfig.onChange === 'function') {
                        const ctx = this.#buildFieldContext(key);
                        try { fieldConfig.onChange(field.value, null, field, ctx); }
                        catch (err) { console.error('DynamicTable: error en onChange', err); }
                    }
                });
            } else {
                field = document.createElement('input');
                field.type = fieldConfig.inputType || 'text';
                field.id = `field-${key}`;
                field.dataset.col = key;
                field.dataset.fieldType = 'text';

                field.addEventListener('input', () => {
                    this.#clearFieldError(wrapper);
                    if (typeof fieldConfig.onChange === 'function') {
                        const ctx = this.#buildFieldContext(key);
                        try { fieldConfig.onChange(field.value, null, field, ctx); }
                        catch (err) { console.error('DynamicTable: error en onChange', err); }
                    }
                });
            }

            wrapper.appendChild(field);
            this.#dialogFieldsContainer.appendChild(wrapper);
        });

        this.#applyStyles(this.#dialogFieldsContainer, collectedStyles);

        this.#dialog.showModal();

        Object.entries(this.#headers).forEach(([key]) => {
            const cfg = this.#fieldSchema[key];
            if (!cfg || typeof cfg.afterOpen !== 'function') return;
            const wrapper = this.#dialogFieldsContainer.querySelector(`.dialog-field[data-col="${key}"]`);
            const field = wrapper?.querySelector('input, select, textarea');
            if (!field) return;
            const ctx = this.#buildFieldContext(key);
            try { cfg.afterOpen(field, ctx); }
            catch (err) { console.error(`DynamicTable: error en afterOpen("${key}")`, err); }
        });

        if (this.#schemaAfterOpen) {
            const ctx = this.#buildFieldContext(null);
            try { this.#schemaAfterOpen(ctx); }
            catch (err) { console.error('DynamicTable: error en __afterOpen', err); }
        }

        setTimeout(() => {
            const active = document.activeElement;
            if (active && this.#dialog && this.#dialog.contains(active)) return;
            const firstField = this.#dialogFieldsContainer.querySelector('input, select, textarea');
            if (firstField) firstField.focus();
        }, 50);
    }

    closeInsertDialog() {
        if (this.#dialog) this.#dialog.close();
    }

    /* ---------- Contexto ---------- */
    #buildFieldContext(currentCol) {
        const container = this.#dialogFieldsContainer;
        const schema = this.#fieldSchema;
        const self = this;

        const getWrapper = (colKey) => {
            if (!colKey) return null;
            return container.querySelector(`.dialog-field[data-col="${colKey}"]`);
        };

        const getInnerField = (colKey) => {
            const wrap = getWrapper(colKey);
            return wrap ? wrap.querySelector('input, select, textarea') : null;
        };

        const dispatch = (f) => {
            if (!f) return;
            const evName = (f.tagName === 'SELECT') ? 'change' : 'input';
            f.dispatchEvent(new Event(evName, { bubbles: true }));
        };

        return {
            currentCol,
            dialog: self.#dialog,
            fieldsContainer: container,

            getAllValues() {
                const out = {};
                Object.keys(self.#headers).forEach(k => {
                    const f = getInnerField(k);
                    if (f) out[k] = f.value;
                });
                return out;
            },

            setValues(map, { trigger = false } = {}) {
                if (!map || typeof map !== 'object') return false;
                Object.entries(map).forEach(([k, v]) => {
                    const f = getInnerField(k);
                    if (!f) return;
                    f.value = v ?? '';
                    if (trigger) dispatch(f);
                });
                return true;
            },

            showError(msg) { self.#showError(msg); return true; },
            hideError() { self.#hideError(); return true; },
            close() { self.closeInsertDialog(); return true; },

            getWrapper(colKey) { return getWrapper(colKey); },
            getField(colKey) { return getInnerField(colKey); },

            getValue(colKey) {
                const f = getInnerField(colKey);
                return f ? f.value : null;
            },

            setValue({ colKey, val, trigger = true, readOnly = false, disabled = false }) {
                const f = getInnerField(colKey);
                if (!f) return false;

                let finalVal = val ?? '';
                const isNumericField = f.dataset.fieldType === 'number';
                if (isNumericField) {
                    const twoDec = self.#formatNumeric2Decimals(finalVal);
                    finalVal = self.#formatWithCommas(twoDec !== '' ? twoDec : finalVal);
                }

                f.value = finalVal;
                f.readOnly = readOnly;
                f.disabled = disabled;
                if (trigger) dispatch(f);
                return true;
            },

            clearField(colKey, { disable = false } = {}) {
                const f = getInnerField(colKey);
                if (!f) return false;
                f.value = '';
                f.readOnly = false;
                f.disabled = disable;
                dispatch(f);
                return true;
            },

            getLabel(colKey, value) {
                const f = getInnerField(colKey);
                if (!f || f.tagName !== 'SELECT') return null;
                const opt = Array.from(f.options).find(o => o.value === value);
                return opt ? (opt.dataset.label || self.#readText(opt)) : null;
            },

            target(overrideCol) {
                const cfg = schema[currentCol] || {};
                const colKey = overrideCol || cfg.insertLabel;
                return getInnerField(colKey);
            },

            setLabel(label, overrideCol) {
                const cfg = schema[currentCol] || {};
                const colKey = overrideCol || cfg.insertLabel;
                if (!colKey) return false;
                const f = getInnerField(colKey);
                if (!f) return false;
                f.value = label ?? '';
                f.readOnly = true;
                f.disabled = true;
                dispatch(f);
                return true;
            },

            getCellValue(searchCol, search, returnCol = null) {
                return self.getCellValue(searchCol, search, returnCol);
            },
            getRowsByCellValue(colKey, search) {
                return self.getRowsByCellValue(colKey, search);
            },
            getTotalAllColumn() {
                return self.getTotalAllColumn();
            },
            disableTable() { return self.disableTable(); },
            enableTable() { return self.enableTable(); },
            isTableDisabled() { return self.isTableDisabled; }
        };
    }

    /* ---------- Validación ---------- */
    #validateRequired() {
        const invalidFields = [];
        let firstInvalidField = null;

        Object.entries(this.#fieldSchema).forEach(([key, config]) => {
            if (config.required !== true) return;

            const wrapper = this.#dialogFieldsContainer.querySelector(`.dialog-field[data-col="${key}"]`);
            if (!wrapper) return;
            const field = wrapper.querySelector('input, select, textarea');
            if (!field) return;

            const value = (field.value || '').trim();
            if (value === '') {
                wrapper.classList.add('is-invalid');
                let labelText = this.#getFieldLabelText(wrapper);
                if (!labelText) labelText = this.#headers[key] || key;
                invalidFields.push(labelText);
                if (!firstInvalidField) firstInvalidField = field;
            } else wrapper.classList.remove('is-invalid');
        });

        if (invalidFields.length > 0) {
            this.#showError(`Los siguientes campos son obligatorios: ${invalidFields.join(', ')}.`);
            if (firstInvalidField) firstInvalidField.focus();
            return false;
        }

        this.#hideError();
        return true;
    }

    #clearFieldError(wrapper) {
        if (!wrapper) return;
        wrapper.classList.remove('is-invalid');
        const stillInvalid = this.#dialogFieldsContainer.querySelectorAll('.dialog-field.is-invalid').length;
        if (stillInvalid === 0) this.#hideError();
    }

    #showError(message) {
        if (!this.#dialogErrorBox) return;
        this.#setText(this.#dialogErrorBox, message);
        this.#dialogErrorBox.classList.add('is-visible');
    }

    #hideError() {
        if (!this.#dialogErrorBox) return;
        this.#setText(this.#dialogErrorBox, '');
        this.#dialogErrorBox.classList.remove('is-visible');
    }

    /* ---------- Filas ---------- */
    #nextRowId() {
        return `row-${++this.#rowCounter}`;
    }

    #createEmptyRow(withDeleteButton = false, customId = null) {
        const tr = document.createElement('tr');
        tr.dataset.rowId = customId || this.#nextRowId();
        tr.dataset.empty = 'true';

        const tdActions = document.createElement('td');
        tdActions.classList.add('col-actions');
        tr.appendChild(tdActions);

        if (withDeleteButton) this.#attachDeleteButton(tr, tdActions);

        Object.keys(this.#headers).forEach(key => {
            tr.appendChild(this.#createTd(key, ''));
        });

        return tr;
    }

    #markRowEmptyState(tr) {
        if (!tr) return;
        const dataCells = tr.querySelectorAll('td[data-col]');
        const isEmpty = dataCells.length > 0 &&
            Array.from(dataCells).every(td => this.#getTdValue(td).trim() === '');
        tr.dataset.empty = isEmpty ? 'true' : 'false';
    }

    #addDeleteButton(tr) {
        if (!tr) return;
        if (tr.querySelector(`.${this.#options.removeButtonClass}`)) return;
        const tdActions = tr.querySelector('.col-actions');
        if (!tdActions) return;
        this.#attachDeleteButton(tr, tdActions);
    }

    #attachDeleteButton(tr, tdActions) {
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = this.#options.removeButtonClass;
        removeBtn.appendChild(document.createTextNode('✕'));
        removeBtn.title = 'Eliminar fila';

        removeBtn.addEventListener('click', () => {
            this.removeRow(tr);
        });

        tdActions.appendChild(removeBtn);
    }

    #removeDeleteButton(tr) {
        if (!tr) return;
        const btn = tr.querySelector(`.${this.#options.removeButtonClass}`);
        if (btn) btn.remove();
    }

    #createAddItemRow() {
        const addRow = document.createElement('tr');
        addRow.classList.add(this.#options.addItemRowClass);

        const addTd = document.createElement('td');
        addTd.colSpan = Object.keys(this.#headers).length + 1;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.add(this.#options.addItemButtonClass);
        btn.appendChild(document.createTextNode(this.#options.addItemButtonText));
        btn.disabled = this.#tableDisabled;

        addTd.appendChild(btn);
        addRow.appendChild(addTd);
        return addRow;
    }

    #fixAddRowColspan() {
        const addRow = this.#tbody.querySelector(`.${this.#options.addItemRowClass}`);
        if (!addRow) return;
        const td = addRow.querySelector('td');
        if (td) td.colSpan = Object.keys(this.#headers).length + 1;
    }

    #syncAddButtonState() {
        const btn = this.#tbody.querySelector(`.${this.#options.addItemButtonClass}`);
        if (btn) btn.disabled = this.#tableDisabled;
    }

    #buildDialog(signal) {
        this.#dialog = document.createElement('dialog');
        this.#dialog.className = 'dynamic-table-dialog';

        const form = document.createElement('form');
        form.method = 'dialog';

        const title = document.createElement('h3');
        title.appendChild(document.createTextNode('Insertar registro'));
        form.appendChild(title);

        this.#dialogFieldsContainer = document.createElement('div');
        this.#dialogFieldsContainer.className = 'dialog-fields';
        form.appendChild(this.#dialogFieldsContainer);

        this.#dialogErrorBox = document.createElement('div');
        this.#dialogErrorBox.className = 'dialog-error';
        form.appendChild(this.#dialogErrorBox);

        const actions = document.createElement('div');
        actions.className = 'dialog-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.appendChild(document.createTextNode('Cancelar'));
        cancelBtn.addEventListener('click', () => this.closeInsertDialog());

        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'btn btn-primary';
        saveBtn.appendChild(document.createTextNode('Guardar'));
        saveBtn.addEventListener('click', () => this.#handleInsertSubmit());

        actions.appendChild(cancelBtn);
        actions.appendChild(saveBtn);
        form.appendChild(actions);

        this.#dialog.appendChild(form);

        this.#dialog.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.matches('input[type="text"]')) {
                e.preventDefault();
                this.#handleInsertSubmit();
            }
        }, { signal });

        document.body.appendChild(this.#dialog);
    }

    /* ---------- Submit ---------- */
    #handleInsertSubmit() {
        if (!this.#validateRequired()) return;

        const values = {};
        const fields = this.#dialogFieldsContainer.querySelectorAll(
            'input[data-col], select[data-col], textarea[data-col]'
        );
        fields.forEach(field => {
            const key = field.dataset.col;
            if (key in values) return;
            values[key] = field.value;
        });

        const tr = this.insertFromDialogValues(values);
        if (tr) this.closeInsertDialog();
    }

    /* ---------- Cálculos ---------- */
    #sumColumn(colKey) {
        let total = 0;
        const rows = this.#tbody.querySelectorAll(`tr:not(.${this.#options.addItemRowClass})`);
        rows.forEach(tr => {
            const td = tr.querySelector(`td[data-col="${colKey}"]`);
            if (!td) return;
            const raw = String(this.#getTdValue(td)).trim();
            if (raw === '') return;
            const cleaned = raw.replace(/[^\d.,-]/g, '').replace(/,/g, '');
            const num = parseFloat(cleaned);
            if (!isNaN(num)) total += num;
        });
        return total;
    }

    #formatNumber(n) {
        if (typeof n !== 'number' || isNaN(n)) return '0.00';
        const isNegative = n < 0;
        const fixed = Math.abs(n).toFixed(2);
        const [intPart, decPart] = fixed.split('.');
        const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (isNegative ? '-' : '') + withCommas + '.' + decPart;
    }

    _refreshTFoot() {
        const { sumAllColumn, LabelTotal } = this.#lastTFootOptions;
        if (Object.keys(sumAllColumn).length || Object.keys(LabelTotal).length) {
            this.updateTFoot({ sumAllColumn, LabelTotal });
        }
    }

    /* ---------- onChange + silent ---------- */
    #snapshotRow(tr) {
        const out = {};
        if (!tr) return out;
        Object.keys(this.#headers).forEach(key => {
            const td = tr.querySelector(`td[data-col="${key}"]`);
            out[key] = td ? this.#getTdValue(td) : '';
        });
        return out;
    }

    #silent(fn) {
        if (typeof fn !== 'function') return undefined;
        this.#changeDepth++;
        try { return fn(); }
        finally { this.#changeDepth--; }
    }

    #emitChange(action, detail = {}) {
        if (this.#changeDepth > 0) return;
        if (typeof this.#onChange !== 'function') return;

        const self = this;
        const ctx = {
            action,
            table: this,

            // ─── Modo silencioso ───
            silent: (fn) => self.#silent(fn),

            // ─── Lecturas ───
            getData: (opts) => self.getData(opts),
            getTotalAllColumn: () => self.getTotalAllColumn(),
            getCellValue: (c, s, r) => self.getCellValue(c, s, r),
            getRowsByCellValue: (c, s) => self.getRowsByCellValue(c, s),

            // ─── Mutaciones ───
            insertRow: (opts) => self.insertRow(opts),
            removeRow: (r) => self.removeRow(r),
            updateRow: (r, row) => self.updateRow(r, row),
            updateCellValue: (r, col, val) => self.updateCellValue(r, col, val),

            clearBody: () => self.clearBody(),
            disableTable: () => self.disableTable(),
            enableTable: () => self.enableTable(),

            ...detail
        };

        try { this.#onChange.call(this, ctx); }
        catch (err) { console.error('DynamicTable: error en onChange', err); }
    }

    /* ---------- Getters ---------- */
    get table() { return this.#table; }
    get thead() { return this.#thead; }
    get tbody() { return this.#tbody; }
    get tfoot() { return this.#tfoot; }
    get headers() { return { ...this.#headers }; }
    get isTableDisabled() { return this.#tableDisabled; }
    get lastTotalRow() { return this.#lastTotalRow; }

    /* ---------- Consulta ---------- */
    getCellValue(searchCol, search, returnCol = null) {
        const results = [];
        if (!searchCol || typeof searchCol !== 'string') return results;
        if (typeof search !== 'string') return results;

        const needle = search.trim().toLowerCase();
        if (needle === '') return results;

        const targetCol = (typeof returnCol === 'string' && returnCol.trim() !== '')
            ? returnCol : searchCol;

        const rows = this.#tbody.querySelectorAll(`tr:not(.${this.#options.addItemRowClass})`);
        rows.forEach(tr => {
            const searchTd = tr.querySelector(`td[data-col="${searchCol}"]`);
            if (!searchTd) return;
            const searchValue = this.#getTdValue(searchTd);
            if (!String(searchValue).toLowerCase().includes(needle)) return;

            const targetTd = tr.querySelector(`td[data-col="${targetCol}"]`);
            if (!targetTd) return;
            results.push(this.#getTdValue(targetTd));
        });

        return results;
    }

    getRowsByCellValue(colKey, search) {
        const results = [];
        if (!colKey || typeof colKey !== 'string') return results;
        if (typeof search !== 'string') return results;

        const needle = search.trim().toLowerCase();
        if (needle === '') return results;

        const rows = this.#tbody.querySelectorAll(`tr:not(.${this.#options.addItemRowClass})`);
        rows.forEach(tr => {
            const td = tr.querySelector(`td[data-col="${colKey}"]`);
            if (!td) return;
            const value = this.#getTdValue(td);
            if (String(value).toLowerCase().includes(needle)) results.push(tr);
        });

        return results;
    }

    getTotalAllColumn() {
        const result = { __raw: {} };
        const { sumAllColumn = {} } = this.#lastTFootOptions || {};
        const keys = Object.keys(sumAllColumn).filter(k => sumAllColumn[k] === true);
        if (keys.length === 0) return result;

        keys.forEach(colKey => {
            const total = this.#sumColumn(colKey);
            result[colKey] = this.#formatNumber(total);
            result.__raw[colKey] = total;
        });
        return result;
    }

    getData({ includeEmpty = false } = {}) {
        const cols = Object.keys(this.#headers);
        const rows = [];

        const rowsEls = this.#tbody.querySelectorAll(`tr:not(.${this.#options.addItemRowClass})`);
        rowsEls.forEach(tr => {
            const obj = {};
            const raw = {};
            let hasData = false;

            cols.forEach(key => {
                const td = tr.querySelector(`td[data-col="${key}"]`);
                const val = td ? this.#getTdValue(td).trim() : '';
                if (val !== '') hasData = true;
                obj[key] = val;
                raw[key] = this.#parseNumeric(val);
            });

            if (hasData || includeEmpty) {
                obj.__removable = !!tr.querySelector(`.${this.#options.removeButtonClass}`);
                obj.__rowId = tr.dataset.rowId || null;
                obj.__customId = tr.dataset.customId === 'true';
                obj.__empty = !hasData;
                obj.__raw = raw;
                rows.push(obj);
            }
        });

        const tfoot = {};
        const tfootRow = this.#tfoot.querySelector('tr');
        if (tfootRow) {
            cols.forEach(key => {
                const td = tfootRow.querySelector(`td[data-col="${key}"]`);
                tfoot[key] = td ? this.#getTdValue(td).trim() : '';
            });
        }

        const summarized = {};
        const { sumAllColumn = {} } = this.#lastTFootOptions;
        Object.keys(sumAllColumn).forEach(key => {
            if (sumAllColumn[key] === true && key in tfoot) summarized[key] = tfoot[key];
        });

        return { rows, tfoot, summarized, totals: this.getTotalAllColumn() };
    }

    /* ---------- Manipulación ---------- */
    #resolveRow(rowIdOrTr) {
        if (!rowIdOrTr) return null;
        if (typeof rowIdOrTr === 'string') {
            return this.#tbody.querySelector(`tr[data-row-id="${CSS.escape(rowIdOrTr)}"]`);
        }
        if (rowIdOrTr instanceof HTMLTableRowElement) return rowIdOrTr;
        return null;
    }

    updateRow(rowIdOrTr, row) {
        const tr = this.#resolveRow(rowIdOrTr);
        if (!tr || !row || typeof row !== 'object') return false;

        Object.entries(row).forEach(([key, v]) => {
            const td = tr.querySelector(`td[data-col="${key}"]`);
            if (!td) return;
            const value = this.#isNumericValue(v) ? this.#formatNumeric2Decimals(v) : v;
            this.#setTdValue(td, value ?? '');
        });

        this.#markRowEmptyState(tr);
        this._refreshTFoot();

        this.#emitChange('update', {
            row: tr,
            rowId: tr.dataset.rowId || null,
            data: { ...row }
        });

        return true;
    }

    updateCellValue(rowIdOrTr, colKey, value) {
        const tr = this.#resolveRow(rowIdOrTr);
        if (!tr || !colKey) return false;

        const td = tr.querySelector(`td[data-col="${colKey}"]`);
        if (!td) return false;

        const finalValue = this.#isNumericValue(value) ? this.#formatNumeric2Decimals(value) : value;
        this.#setTdValue(td, finalValue ?? '');

        this.#markRowEmptyState(tr);
        this._refreshTFoot();

        this.#emitChange('updateCell', {
            row: tr,
            rowId: tr.dataset.rowId || null,
            colKey,
            value: finalValue,
            data: this.#snapshotRow(tr)
        });

        return true;
    }

    removeRow(rowIdOrTr) {
        const tr = this.#resolveRow(rowIdOrTr);
        if (!tr) return false;
        if (tr.classList.contains(this.#options.addItemRowClass)) return false;

        const rowId = tr.dataset.rowId || null;
        const snapshot = this.#snapshotRow(tr);

        tr.remove();
        this._refreshTFoot();

        this.#emitChange('remove', {
            row: null,
            rowId,
            data: snapshot
        });

        return true;
    }

    /* ---------- Suspend / Resume público ---------- */
    /**
     * Suspende la emisión de onChange hasta resumeOnChange().
     * Anidable por contador. Ideal para envolver varias mutaciones
     * (incluido casos async con await).
     */
    suspendOnChange() {
        this.#changeDepth++;
        return this;
    }

    /**
     * Reanuda la emisión de onChange. No baja de 0.
     */
    resumeOnChange() {
        if (this.#changeDepth > 0) this.#changeDepth--;
        return this;
    }

    /* ---------- Disable / Enable ---------- */
    disableTable() {
        this.clearBody();
        this.#tableDisabled = true;
        this.#syncAddButtonState();

        if (this.#container) this.#container.classList.add(this.#options.disabledClass);
        if (this.#dialog && this.#dialog.open) this.closeInsertDialog();

        if (this.#debug) console.log('DynamicTable: tabla deshabilitada');
        return this;
    }

    enableTable() {
        this.#tableDisabled = false;
        this.#syncAddButtonState();
        if (this.#container) this.#container.classList.remove(this.#options.disabledClass);
        if (this.#debug) console.log('DynamicTable: tabla habilitada');
        return this;
    }

    /* ---------- Limpieza ---------- */
    clearBody() {
        const totalRow = (this.#lastTotalRow === null)
            ? this.#DEFAULT_TOTAL_ROW
            : this.#lastTotalRow;

        this.createBody({ total_row: totalRow });
        this._refreshTFoot();
        if (this.#debug) console.log(`DynamicTable: clearBody() → ${totalRow} fila(s) vacía(s)`);
        return this;
    }

    destroy() {
        if (this.#abortController) this.#abortController.abort();
        if (this.#dialog && this.#dialog.parentNode) {
            this.#dialog.parentNode.removeChild(this.#dialog);
        }
        this.#dialog = null;
        this.#dialogFieldsContainer = null;
        this.#dialogErrorBox = null;
        if (this.#container) {
            this.#container.classList.remove(this.#options.disabledClass);
            this.#container.innerHTML = '';
        }
        this.#table = this.#thead = this.#tbody = this.#tfoot = null;
    }
}


// ============================================================
//  EXPOSICIÓN GLOBAL
// ============================================================
if (typeof window !== 'undefined') {
    window.DynamicTable = DynamicTable;
}
