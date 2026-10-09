/* ================================================================
   AcceptedResult
   ================================================================ */
class AcceptedResult {
    constructor(data = {}) {
        this.choiceId = data.choiceId ?? null;
        this.label = data.label ?? '';
        this.rows = Array.isArray(data.rows) ? data.rows : [];
        this.flat = data.flat && typeof data.flat === 'object' ? data.flat : {};
        this.prefixes = data.prefixes && typeof data.prefixes === 'object' ? data.prefixes : {};
    }
    returnString(options = {}) {
        const { rowSeparator = ' | ', valueSeparator = ' - ', wrap = ['(', ')'],
            skipEmptyRows = true, skipEmptyValues = false, includePrefix = true } = options;
        const [open, close] = wrap; const parts = [];
        this.rows.forEach(row => {
            const entries = Object.entries(row.values || {});
            const filtered = skipEmptyValues ? entries.filter(([, v]) => v !== '' && v !== null && v !== undefined) : entries;
            if (skipEmptyRows && filtered.length === 0) return;
            const fv = filtered.map(([k, v]) => {
                const p = includePrefix ? (this.prefixes[k] || '') : '';
                return `${open}${p}${v ?? ''}${close}`;
            }).join(valueSeparator);
            parts.push(`${this.label}: ${fv}`);
        });
        return parts.join(rowSeparator);
    }
    toJSON() { return { choiceId: this.choiceId, label: this.label, rows: this.rows, flat: this.flat, prefixes: this.prefixes }; }
    getFlat() { return { ...this.flat }; }
    getPrefixes() { return { ...this.prefixes }; }
}

/* ================================================================
   ChoiceContainerBuilder
   ================================================================ */
class ChoiceContainerBuilder {
    #selector; #context; #options;
    #clickHandler = null; #listenerAttached = false; #clickDebug = false;
    #usedIds = new Set();
    #lastAcceptedValues = null;
    #onAccept = null; #onChange = null;
    #choicesMap = new Map();

    static DEFAULT_DENOMINATIONS = [1000, 500, 200, 100, 50, 20, 10, 5, 1];
    static SUMMARY_ROW_CLASSES = ['autosum-row', 'cash-calc-total-row', 'cash-calc-change-row'];

    constructor(options = {}) {
        this.#selector = options.selector ?? '.choice-container[data-choice_id]';
        this.#context = options.context ?? document;
        this.#options = {
            preserveAttributes: options.preserveAttributes ?? true,
            onlyEmpty: options.onlyEmpty ?? true,
            autoAttachEvents: options.autoAttachEvents ?? true,
            debug: options.debug ?? false
        };
        this.#clickDebug = this.#options.debug;
        this.#onAccept = options.onAccept || null;
        this.#onChange = options.onchange || options.onChange || null;

        if (Array.isArray(options.choices)) {
            options.choices.forEach(c => this.#registerChoiceConfig(c));
        }

        this.#ensureGroupIds();
        if (this.#options.autoAttachEvents) this.attachEvents();
    }

    // ============================================================
    //  API DE CONFIGURACIÓN
    // ============================================================
    #registerChoiceConfig(choice) {
        if (!choice || choice.id == null) return;
        const id = String(choice.id);
        this.#choicesMap.set(id, {
            template: choice.template ?? null,
            maxAmount: choice.maxAmount ?? null,
            label: choice.label ?? null,
            type_element: choice.type_element ?? choice.typeElement ?? null
        });
    }
    getChoices() {
        return Array.from(this.#choicesMap.entries()).map(([id, v]) => ({ id, ...v }));
    }
    getChoice(id) { return this.#choicesMap.get(String(id)) || null; }
    setChoice(id, config = {}) { this.#registerChoiceConfig({ id, ...config }); return this; }
    removeChoice(id) { this.#choicesMap.delete(String(id)); return this; }
    hasChoice(id) { return this.#choicesMap.has(String(id)); }

    get lastAcceptedValues() { return this.#lastAcceptedValues; }
    get areAllDisabled() {
        const c = this.#context.querySelectorAll(this.#selector);
        if (c.length === 0) return false;
        return Array.from(c).every(x => x.querySelector('.choice-buttons')?.hasAttribute('data-choice-disabled') ?? false);
    }

    // ============================================================
    //  CONSTRUCCIÓN
    // ============================================================
    buildAll() {
        this.#ensureGroupIds();
        const c = this.#context.querySelectorAll(this.#selector);
        let n = 0; c.forEach(x => { if (this.build(x)) n++; }); return n;
    }

    build(containerOrSelector) {
        const c = this.#resolveContainer(containerOrSelector);
        if (!c) { console.warn('build: no encontrado →', containerOrSelector); return false; }
        if (this.#options.onlyEmpty && c.querySelector('label.choice-buttons')) return false;

        const id = c.dataset.choice_id || '';
        if (!id) { console.warn('build: falta data-choice_id'); return false; }

        const cfg = this.#choicesMap.get(id) || null;

        if (cfg?.type_element && !c.dataset.type_element) c.dataset.type_element = cfg.type_element;
        if (cfg?.label && !c.dataset.choice_label) c.dataset.choice_label = cfg.label;

        const type = this.getGroupType(c);
        if (!c.dataset.type_element) c.dataset.type_element = type;

        const label = c.dataset.choice_label || '';

        const structure = this.#createStructure({ typeElement: type, id, label });
        c.insertBefore(structure, c.firstChild);

        if (!c.querySelector('input.choice_accepted')) {
            const a = document.createElement('input');
            a.type = 'hidden'; a.className = 'choice_accepted';
            a.name = `accepted_${id}`; a.value = '';
            c.appendChild(a);
        }

        let menuSpan = c.querySelector('span.menu');
        const cfgHasTemplate = !!(cfg && cfg.template);

        if (!menuSpan && cfgHasTemplate) {
            menuSpan = document.createElement('span');
            menuSpan.classList.add('menu');
            if (cfg.maxAmount != null) menuSpan.setAttribute('data-maxAmount', String(cfg.maxAmount));
            c.appendChild(menuSpan);
        } else if (menuSpan && cfg?.maxAmount != null && !menuSpan.hasAttribute('data-maxAmount')) {
            menuSpan.setAttribute('data-maxAmount', String(cfg.maxAmount));
        }

        if (menuSpan) {
            this.#buildMenu(menuSpan, cfg?.template || null);
            menuSpan.addEventListener('input', () => this.#emitChange(c));
            menuSpan.addEventListener('change', () => this.#emitChange(c));
        }

        if (!this.#options.preserveAttributes) {
            delete c.dataset.type_element;
            delete c.dataset.choice_id;
            delete c.dataset.choice_label;
        }
        return true;
    }
    createFragment({ typeElement = 'checkbox', id = '', label = '' } = {}) {
        const f = document.createDocumentFragment();
        f.appendChild(this.#createStructure({ typeElement, id, label }));
        return f;
    }
    resetUsedIds() { this.#usedIds.clear(); return this; }
    getUsedIds() { return [...this.#usedIds]; }

    disableAll() { const c = this.#context.querySelectorAll(this.#selector); c.forEach(x => this.#setDisabled(x, true)); return this; }
    enableAll() { const c = this.#context.querySelectorAll(this.#selector); c.forEach(x => this.#setDisabled(x, false)); return this; }

    // TIPO
    getGroupType(input) {
        let container = null;
        if (input instanceof Element && input.classList.contains('choice-container')) container = input;
        else if (typeof input === 'string') { const one = this.#resolveContainer(input); if (one) container = one; }
        if (container) {
            const own = (container.dataset.type_element || '').toLowerCase();
            if (own === 'radio' || own === 'checkbox') return own;
            const cfg = this.#choicesMap.get(container.dataset.choice_id || '');
            const cfgT = (cfg?.type_element || '').toLowerCase();
            if (cfgT === 'radio' || cfgT === 'checkbox') return cfgT;
        }
        const grouped = (input instanceof Element)
            ? (input.classList.contains('choice-container') ? input.closest('.choice-grouped') : input)
            : this.#resolveGrouped(input);
        if (grouped) {
            if (grouped.classList.contains('choice-grouped-radio')) return 'radio';
            if (grouped.classList.contains('choice-grouped-checkbox')) return 'checkbox';
            const first = grouped.querySelector('.choice-container');
            const fb = (first?.dataset?.type_element || '').toLowerCase();
            if (fb === 'radio' || fb === 'checkbox') return fb;
        }
        const any = this.#context.querySelector(this.#selector);
        const anyT = (any?.dataset?.type_element || '').toLowerCase();
        if (anyT === 'radio' || anyT === 'checkbox') return anyT;
        return 'checkbox';
    }
    getGroupId(g) { const el = (g instanceof Element) ? g : this.#resolveGrouped(g); return el?.id || null; }
    listGroups() {
        return Array.from(this.#context.querySelectorAll('.choice-grouped'))
            .map(g => ({ id: g.id, type: this.getGroupType(g), element: g }));
    }

    // LECTURA
    getContainerAccepted(c) {
        const el = this.#resolveContainer(c); if (!el) return null;
        const i = el.querySelector('input.choice_accepted'); if (!i || !i.value) return null;
        try { return new AcceptedResult(JSON.parse(i.value)); } catch (e) { return null; }
    }
    getGroupedValues(g) {
        const el = this.#resolveGrouped(g); if (!el) return [];
        const out = [];
        el.querySelectorAll('.choice-container').forEach(c => {
            const i = c.querySelector('input.choice_accepted');
            if (!i || !i.value) return;
            try { out.push(new AcceptedResult(JSON.parse(i.value))); } catch (_) { }
        });
        return out;
    }
    getGroupedString(g, options = {}) {
        const { groupSeparator = ' | ', ...rest } = options;
        return this.getGroupedValues(g).map(x => x.returnString(rest)).filter(s => s && s.trim()).join(groupSeparator);
    }
    getGroupedFlat(g) {
        const flat = {};
        this.getGroupedValues(g).forEach(x => Object.assign(flat, x.flat || {}));
        return flat;
    }
    getMenuValues(c) {
        const el = this.#resolveContainer(c); if (!el) return null;
        const m = el.querySelector('.menu'); if (!m) return null;
        return this.#collectValues(m);
    }

    // SNAPSHOT
    getAllChoices(target) {
        let root = this.#context;
        if (target) {
            if (target instanceof Element) root = target;
            else if (typeof target === 'string') {
                const one = this.#resolveContainer(target);
                if (one) return [this.#snapshotChoice(one)];
                const grp = this.#resolveGrouped(target);
                if (grp) root = grp;
                else { const q = this.#context.querySelector(target); if (q) root = q; }
            }
        }
        if (root instanceof Element && root.classList.contains('choice-container')) return [this.#snapshotChoice(root)];
        const containers = root.querySelectorAll(this.#selector);
        return Array.from(containers).map(c => this.#snapshotChoice(c));
    }
    getAllChoicesJSON(target, opts = {}) {
        return JSON.stringify(this.getAllChoices(target), null, opts.pretty ? 2 : 0);
    }
    #snapshotChoice(container) {
        if (!container) return null;
        const labelEl = container.querySelector('.choice-buttons');
        const choiceValue = labelEl?.querySelector("[class*='choice_value']");
        const acceptedInput = container.querySelector('input.choice_accepted');
        const menu = container.querySelector('.menu');
        const cfg = this.#choicesMap.get(container.dataset.choice_id || '') || null;

        let acceptedData = null;
        if (acceptedInput?.value) {
            try {
                const parsed = JSON.parse(acceptedInput.value);
                acceptedData = {
                    choiceId: parsed.choiceId, label: parsed.label, rows: parsed.rows,
                    flat: this.#restructureFlat(parsed.rows), prefixes: parsed.prefixes
                };
            } catch (_) { }
        }
        let menuData = null;
        if (menu) {
            const live = this.#collectValues(menu);
            menuData = { rows: live.rows, flat: this.#restructureFlat(live.rows), prefixes: live.prefixes };
        }
        const autosum = menu ? this.#computeAutosum(menu) : 0;
        return {
            choiceId: container.dataset.choice_id || null,
            label: container.dataset.choice_label || '',
            type: this.getGroupType(container),
            checked: choiceValue?.value === 'checked',
            accepted: !!acceptedData,
            disabled: labelEl?.hasAttribute('data-choice-disabled') ?? false,
            source: cfg ? 'constructor' : 'dom',
            autosum, acceptedData, menu: menuData
        };
    }
    #computeAutosum(menu) {
        if (!menu) return 0;
        let sum = 0;
        menu.querySelectorAll('input[data-type="number"]').forEach(inp => {
            if (inp.readOnly) return;
            if (inp.classList.contains('autosum-value')) return;
            const n = this.#parseFormattedNumber(inp.value);
            if (!isNaN(n)) sum += n;
        });
        return Math.round(sum * 100) / 100;
    }
    #restructureFlat(rows) {
        const SUMMARY = ChoiceContainerBuilder.SUMMARY_ROW_CLASSES;
        const rowArr = []; const extras = {};
        (rows || []).forEach(r => {
            const classes = Array.isArray(r.classes) ? r.classes : [];
            const isSummary = classes.some(c => SUMMARY.includes(c));
            if (isSummary) Object.assign(extras, r.values || {});
            else rowArr.push({ ...(r.values || {}) });
        });
        return { row: rowArr, ...extras };
    }

    // EVENTOS
    attachEvents() {
        if (this.#listenerAttached && this.#clickHandler) return this;
        this.#clickHandler = (e) => this.#handleClick(e);
        document.addEventListener('click', this.#clickHandler);
        this.#listenerAttached = true;
        return this;
    }
    detachEvents() {
        if (!this.#listenerAttached || !this.#clickHandler) return this;
        document.removeEventListener('click', this.#clickHandler);
        this.#clickHandler = null; this.#listenerAttached = false;
        return this;
    }
    isListening() { return this.#listenerAttached; }
    setDebug(b = true) { this.#clickDebug = b; return this; }
    setOnAccept(cb) { this.#onAccept = cb || null; return this; }
    setOnChange(cb) { this.#onChange = cb || null; return this; }

    #emitChange(container) {
        if (typeof this.#onChange !== 'function' || !container) return;
        const menu = container.querySelector('.menu');
        const values = this.#buildValuesArray(menu);
        try { this.#onChange(container, values); } catch (e) { console.error(e); }
    }
    #buildValuesArray(menu) {
        if (!menu) return [];
        const collected = this.#collectValues(menu);
        const out = [];
        collected.rows.forEach(row => {
            Object.entries(row.values).forEach(([name, value]) => {
                const field = menu.querySelector(`[name="${name}"]`);
                out.push({
                    rowIndex: row.index, rowLabel: row.label, name,
                    id: field?.id || null,
                    label: field?.closest('.field-with-label')?.querySelector('label')?.textContent?.trim()
                        || field?.getAttribute('aria-label') || field?.placeholder || '',
                    type: field?.getAttribute('data-type') || field?.type || 'text',
                    value, prefix: collected.prefixes[name] || ''
                });
            });
        });
        return out;
    }

    // HELPERS NUMÉRICOS
    #formatNumber(v) {
        const n = (typeof v === 'number') ? v : parseFloat(String(v ?? '').replace(/,/g, ''));
        if (!isFinite(n)) return '';
        return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    #formatIntegerWithSeparators(v) {
        const n = Math.round(typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, '') || 0));
        if (!isFinite(n)) return '0';
        return n.toLocaleString('en-US');
    }
    #parseFormattedNumber(s) {
        if (s == null) return NaN;
        const c = String(s).replace(/,/g, '').trim();
        return (c === '' || c === '.') ? NaN : parseFloat(c);
    }
    #formatInProgress(s) {
        if (s === '') return '';
        const hasDot = s.includes('.');
        const [ip, dp = ''] = s.split('.');
        return hasDot ? `${ip.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dp}` : ip.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    #sanitizeNumberInput(raw) {
        let s = String(raw ?? '').replace(/[^\d.]/g, '');
        const fd = s.indexOf('.');
        if (fd !== -1) {
            s = s.slice(0, fd + 1) + s.slice(fd + 1).replace(/\./g, '');
            s = s.slice(0, fd) + '.' + s.slice(fd + 1, fd + 3);
        }
        return s;
    }
    #sanitizeIntegerInput(raw) { return String(raw ?? '').replace(/\D/g, ''); }
    #parseMaxAmount(raw) {
        if (raw == null) return null;
        const c = String(raw).replace(/,/g, '').trim();
        if (c === '') return null;
        const n = parseFloat(c); return isFinite(n) ? n : null;
    }

    #wireNumberInputs(root) {
        root.querySelectorAll('input[data-type="number"]:not(.autosum-value):not(.cash-change)').forEach(input => {
            if (input.dataset.numberWired === '1') return;
            input.dataset.numberWired = '1';
            input.setAttribute('inputmode', 'decimal'); input.setAttribute('autocomplete', 'off');
            const initN = this.#parseFormattedNumber(input.value);
            if (!isNaN(initN)) input.value = this.#formatNumber(initN);
            input.addEventListener('input', () => {
                const raw = input.value, cursor = input.selectionStart ?? raw.length;
                const sig = raw.slice(0, cursor).replace(/[^\d.]/g, '').length;
                const clean = this.#sanitizeNumberInput(raw);
                if (clean === '' || clean === '.') { input.value = ''; return; }
                const f = this.#formatInProgress(clean);
                if (f === raw) return;
                input.value = f;
                let c = 0, nc = 0;
                for (let i = 0; i < f.length; i++) { if (/[\d.]/.test(f[i])) c++; nc = i + 1; if (c === sig) break; }
                try { input.setSelectionRange(nc, nc); } catch (_) { }
            });
            input.addEventListener('blur', () => {
                const n = this.#parseFormattedNumber(input.value);
                input.value = isNaN(n) ? '' : this.#formatNumber(n);
            });
        });
    }
    #wireIntegerInputs(root) {
        root.querySelectorAll('input[data-type="integer"]').forEach(input => {
            if (input.dataset.integerWired === '1') return;
            input.dataset.integerWired = '1';
            input.setAttribute('inputmode', 'numeric'); input.setAttribute('autocomplete', 'off');
            input.addEventListener('input', () => {
                const c = this.#sanitizeIntegerInput(input.value);
                if (c !== input.value) input.value = c;
            });
        });
    }
    #wireEnterNavigation(menu) {
        if (menu.dataset.enterNavWired === '1') return;
        menu.dataset.enterNavWired = '1';
        menu.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            const t = e.target;
            if (!t || t.tagName !== 'INPUT') return;
            if (t.type === 'hidden' || t.type === 'checkbox' || t.type === 'radio') return;
            if (t.readOnly) return;
            if (t.classList.contains('autosum-value')) return;
            if (t.classList.contains('cash-subtotal')) return;
            if (t.classList.contains('cash-total')) return;
            if (t.classList.contains('cash-change')) return;

            const inputs = Array.from(menu.querySelectorAll('input'))
                .filter(i => i.type !== 'hidden' && i.type !== 'checkbox' && i.type !== 'radio'
                    && !i.readOnly
                    && !i.classList.contains('autosum-value')
                    && !i.classList.contains('cash-subtotal')
                    && !i.classList.contains('cash-total')
                    && !i.classList.contains('cash-change'));
            const idx = inputs.indexOf(t);
            if (idx === -1) return;
            e.preventDefault(); e.stopPropagation();
            if (e.shiftKey) {
                if (idx > 0) { inputs[idx - 1].focus(); inputs[idx - 1].select(); }
            } else {
                if (idx < inputs.length - 1) { inputs[idx + 1].focus(); inputs[idx + 1].select(); }
                else {
                    const accept = menu.querySelector('.calltoaction-accept-checkbox');
                    if (accept) accept.focus();
                }
            }
        });
    }

    // RENDER
    #renderTableBlock(tableDef) {
        const block = document.createElement('div'); block.classList.add('table-block');
        if (tableDef?.label) block.appendChild(this.#renderBlockLabel(tableDef.label));
        const table = document.createElement('table'); table.classList.add('choice-table');
        const headers = Array.isArray(tableDef?.headers) ? tableDef.headers : [];
        if (headers.length) {
            const thead = document.createElement('thead');
            const trh = document.createElement('tr');
            headers.forEach(h => { const th = document.createElement('th'); th.textContent = h; trh.appendChild(th); });
            thead.appendChild(trh); table.appendChild(thead);
        }
        const tbody = document.createElement('tbody');
        (Array.isArray(tableDef?.fields) ? tableDef.fields : []).forEach(rowFields => {
            const cols = Array.isArray(rowFields) ? rowFields : [rowFields];
            const tr = document.createElement('tr'); tr.classList.add('menu-row');
            cols.forEach(f => { const td = document.createElement('td'); td.appendChild(this.#renderField(f)); tr.appendChild(td); });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody); block.appendChild(table);
        return block;
    }

    /** ✅ NUEVO: helper que arma el bloque .full-line + .details-label */
    #renderBlockLabel(text) {
        const lc = document.createElement('div');
        lc.classList.add('full-line');
        const ls = document.createElement('span');
        ls.classList.add('details-label');
        ls.textContent = text;
        lc.appendChild(ls);
        return lc;
    }

    #renderAutosumRow() {
        const row = document.createElement('div'); row.classList.add('menu-row', 'autosum-row');
        const lc = document.createElement('div'); lc.classList.add('full-line');
        const ls = document.createElement('span'); ls.classList.add('details-label'); ls.textContent = 'Suma total';
        lc.appendChild(ls); row.appendChild(lc);
        const fc = document.createElement('div'); fc.classList.add('column');
        const id = this.#resolveUniqueId('autosum');
        const inp = document.createElement('input');
        inp.type = 'text'; inp.id = `details-${id}`; inp.name = inp.id; inp.readOnly = true;
        inp.classList.add('autosum-value');
        inp.setAttribute('data-type', 'number'); inp.setAttribute('aria-label', 'Total'); inp.value = '0.00';
        fc.appendChild(inp); row.appendChild(fc);
        return row;
    }
    #wireAutosum(menu) {
        if (menu.dataset.autosumWired === '1') return;
        menu.dataset.autosumWired = '1';
        menu.addEventListener('input', e => {
            const t = e.target;
            if (!t || t.tagName !== 'INPUT' || t.classList.contains('autosum-value')) return;
            if ((t.getAttribute('data-type') || '').toLowerCase() !== 'number') return;
            this.#updateAutosum(menu);
        });
    }
    #updateAutosum(menu) {
        if (!menu) return;
        const el = menu.querySelector('.autosum-value'); if (!el) return;
        let sum = 0;
        menu.querySelectorAll('input[data-type="number"]:not(.autosum-value)').forEach(i => {
            const n = this.#parseFormattedNumber(i.value); if (!isNaN(n)) sum += n;
        });
        el.value = this.#formatNumber(sum);
    }
    #renderCashCalculator(denoms, maxAmount) {
        const ds = Array.isArray(denoms) && denoms.length ? denoms : ChoiceContainerBuilder.DEFAULT_DENOMINATIONS;
        const w = document.createElement('div'); w.classList.add('cash-calculator');
        ds.forEach(d => {
            const r = document.createElement('div'); r.classList.add('menu-row', 'cash-calc-row');
            r.setAttribute('data-denomination', String(d));
            const cd = document.createElement('div'); cd.classList.add('column', 'cash-col-denom');
            const sp = document.createElement('span'); sp.classList.add('cash-denom'); sp.textContent = String(d);
            cd.appendChild(sp);
            const cq = document.createElement('div'); cq.classList.add('column', 'cash-col-qty');
            const qid = this.#resolveUniqueId(`cash_qty_${d}`);
            const qi = document.createElement('input');
            qi.type = 'text'; qi.id = `details-${qid}`; qi.name = qi.id;
            qi.setAttribute('data-type', 'integer'); qi.setAttribute('data-denomination', String(d));
            qi.setAttribute('aria-label', `Cantidad de ${d}`); qi.placeholder = '0';
            cq.appendChild(qi);
            const cs = document.createElement('div'); cs.classList.add('column', 'cash-col-sub');
            const sid = this.#resolveUniqueId(`cash_sub_${d}`);
            const si = document.createElement('input');
            si.type = 'text'; si.id = `details-${sid}`; si.name = si.id;
            si.setAttribute('data-type', 'number'); si.readOnly = true; si.tabIndex = -1;
            si.classList.add('cash-subtotal'); si.value = '0';
            cs.appendChild(si);
            r.append(cd, cq, cs); w.appendChild(r);
        });
        const tr = document.createElement('div'); tr.classList.add('menu-row', 'cash-calc-total-row');
        const cl = document.createElement('div'); cl.classList.add('column', 'cash-col-denom');
        const lbl = document.createElement('span'); lbl.classList.add('cash-denom'); lbl.textContent = 'Sub Total';
        cl.appendChild(lbl);
        const ce = document.createElement('div'); ce.classList.add('column', 'cash-col-qty');
        const ct = document.createElement('div'); ct.classList.add('column', 'cash-col-sub');
        const tid = this.#resolveUniqueId('cash_total');
        const ti = document.createElement('input');
        ti.type = 'text'; ti.id = `details-${tid}`; ti.name = ti.id;
        ti.setAttribute('data-type', 'number'); ti.readOnly = true; ti.tabIndex = -1;
        ti.classList.add('cash-total'); ti.value = 'C$ 0.00';
        ct.appendChild(ti);
        tr.append(cl, ce, ct); w.appendChild(tr);
        if (maxAmount != null && isFinite(maxAmount)) {
            const cr = document.createElement('div'); cr.classList.add('menu-row', 'cash-calc-change-row');
            const c1 = document.createElement('div'); c1.classList.add('column', 'cash-col-denom');
            const s2 = document.createElement('span'); s2.classList.add('cash-denom', 'cash-change-label'); s2.textContent = 'Vuelto:';
            c1.appendChild(s2);
            const c2 = document.createElement('div'); c2.classList.add('column', 'cash-col-qty');
            const c3 = document.createElement('div'); c3.classList.add('column', 'cash-col-sub');
            const ci = document.createElement('input');
            ci.type = 'text'; ci.id = `details-${this.#resolveUniqueId('cash_change')}`; ci.name = ci.id;
            ci.setAttribute('data-type', 'number'); ci.readOnly = true; ci.tabIndex = -1;
            ci.classList.add('cash-change'); ci.value = 'C$ 0.00';
            c3.appendChild(ci);
            cr.append(c1, c2, c3); w.appendChild(cr);
        }
        return w;
    }
    #wireCashCalculator(menu) {
        if (menu.dataset.cashWired === '1') return;
        menu.dataset.cashWired = '1';
        menu.addEventListener('input', e => {
            const t = e.target;
            if (!t || t.tagName !== 'INPUT') return;
            if ((t.getAttribute('data-type') || '').toLowerCase() !== 'integer') return;
            this.#updateCashCalculator(menu);
        });
    }
    #updateCashCalculator(menu) {
        if (!menu) return;
        const tEl = menu.querySelector('.cash-total'); if (!tEl) return;
        let gt = 0;
        menu.querySelectorAll('.cash-calc-row').forEach(row => {
            const d = parseFloat(row.getAttribute('data-denomination') || '0');
            const qi = row.querySelector('input[data-type="integer"]');
            const si = row.querySelector('.cash-subtotal');
            if (!qi || !si) return;
            const q = parseInt(this.#sanitizeIntegerInput(qi.value) || '0', 10) || 0;
            const st = d * q;
            si.value = this.#formatIntegerWithSeparators(st);
            gt += st;
        });
        tEl.value = 'C$ ' + this.#formatNumber(gt);
        const cRow = menu.querySelector('.cash-calc-change-row');
        if (!cRow) return;
        const cEl = cRow.querySelector('.cash-change');
        const max = this.#parseMaxAmount(menu.getAttribute('data-maxAmount'));
        if (max == null) return;
        const diff = gt - max;
        cEl.value = 'C$ ' + this.#formatNumber(Math.abs(diff));
        cRow.classList.remove('cash-change-positive', 'cash-change-negative');
        cRow.classList.add(diff >= 0 ? 'cash-change-positive' : 'cash-change-negative');
        const lbl = cRow.querySelector('.cash-change-label');
        if (lbl) lbl.textContent = diff >= 0 ? 'Vuelto:' : 'Falta:';
    }

    // PRIVADOS
    #setDisabled(c, disabled) {
        if (!c) return;
        const l = c.querySelector('.choice-buttons');
        const m = c.querySelector('.menu');
        const a = c.querySelector('input.choice_accepted');
        const v = l?.querySelector("[class*='choice_value']");
        if (disabled) {
            if (l) { l.classList.add('disabled'); l.setAttribute('data-choice-disabled', 'true'); l.classList.remove('showmenu', 'not-empty', 'hover-menu'); }
            if (m) this.#clearMenuInputs(m);
            if (a) a.value = '';
            if (v) v.value = 'unchecked';
        } else {
            if (l) { l.removeAttribute('data-choice-disabled'); l.classList.remove('disabled'); }
        }
    }
    #ensureGroupIds() {
        const groups = this.#context.querySelectorAll('.choice-grouped');
        let n = 1;
        groups.forEach(g => {
            if (!g.id) {
                let cand; do { cand = `choice-grouped-${n++}`; } while (document.getElementById(cand));
                g.id = cand;
            }
        });
    }
    #resolveContainer(input) {
        if (!input) return null;
        if (input instanceof Element) return input;
        if (typeof input !== 'string') return null;
        if (/^[#.\[\]:*]/.test(input)) return this.#context.querySelector(input);
        const byId = this.#context.querySelector(`[data-choice_id="${input}"]`);
        if (byId) return byId;
        return this.#context.querySelector('#' + input);
    }
    #resolveGrouped(input) {
        if (!input) return null;
        if (input instanceof Element) {
            if (input.classList.contains('choice-container')) return input.closest('.choice-grouped');
            return input;
        }
        if (typeof input !== 'string') return null;
        if (/^[#.\[\]:*]/.test(input)) {
            const el = this.#context.querySelector(input);
            if (!el) return null;
            if (el.classList.contains('choice-container')) return el.closest('.choice-grouped');
            return el;
        }
        const c = this.#context.querySelector(`[data-choice_id="${input}"]`);
        return c ? c.closest('.choice-grouped') : null;
    }
    #createStructure({ typeElement, id, label }) {
        const l = document.createElement('label');
        l.classList.add('choice-buttons', 'calltoaction-click-choice');
        l.setAttribute('for', id);

        const i = document.createElement('input');
        i.classList.add('choice_value'); i.type = 'hidden';
        i.value = 'unchecked';
        i.name = id; i.id = id;

        const ic = document.createElement('span'); ic.classList.add('icon');
        ic.appendChild(document.createElement('i'));

        const ls = document.createElement('span'); ls.classList.add('label'); ls.textContent = label;

        l.append(i, ic, ls);
        return l;
    }
    #buildMenu(menuSpan, templateFromConfig = null) {
        let tpl = templateFromConfig;
        if (!tpl) {
            const raw = menuSpan.getAttribute('data-template');
            if (!raw) return;
            try { tpl = this.#parseTemplate(raw); }
            catch (e) { console.error('error data-template', e); return; }
        }
        if (!tpl || typeof tpl !== 'object') return;

        menuSpan.innerHTML = '';
        menuSpan.appendChild(this.#renderTemplate(tpl, menuSpan));
        const type = (tpl.type || 'default').toLowerCase();
        this.#wireEnterNavigation(menuSpan);
        if (type === 'cash_calculator') {
            this.#wireIntegerInputs(menuSpan);
            this.#wireCashCalculator(menuSpan);
            this.#updateCashCalculator(menuSpan);
        } else {
            this.#wireNumberInputs(menuSpan);
            if (type === 'autosum') { this.#wireAutosum(menuSpan); this.#updateAutosum(menuSpan); }
        }
    }
    #parseTemplate(str) {
        let n = str.replace(/'/g, '"').replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":').replace(/""/g, '"');
        try { return JSON.parse(n); }
        catch (e) {
            // eslint-disable-next-line no-new-func
            return new Function('return (' + n + ')')();
        }
    }

    /** ✅ MODIFICADO: ahora renderiza el label del cash_calculator si lo trae */
    #renderTemplate(tpl, menuEl) {
        const f = document.createDocumentFragment();
        f.appendChild(this.#renderMenuCloseButton());
        const type = (tpl.type || 'default').toLowerCase();

        if (type === 'cash_calculator') {
            const max = this.#parseMaxAmount(menuEl?.getAttribute('data-maxAmount'));
            // 👇 NUEVO: si el template trae `label`, se pinta encima de la calculadora
            if (typeof tpl.label === 'string' && tpl.label.trim() !== '') {
                f.appendChild(this.#renderBlockLabel(tpl.label));
            }
            f.appendChild(this.#renderCashCalculator(tpl.denominations, max));
        } else {
            (Array.isArray(tpl.row) ? tpl.row : []).forEach(r => f.appendChild(this.#renderRow(r)));
            (Array.isArray(tpl.table) ? tpl.table : []).forEach(t => f.appendChild(this.#renderTableBlock(t)));
            if (type === 'autosum') f.appendChild(this.#renderAutosumRow());
        }
        f.appendChild(this.#renderButtons());
        return f;
    }

    #renderMenuCloseButton() {
        const w = document.createElement('div'); w.classList.add('menu-close-wrapper');
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'menu-close-button';
        b.setAttribute('aria-label', 'Cerrar menú'); b.title = 'Cerrar'; b.textContent = '✕';
        w.appendChild(b); return w;
    }
    #renderRow(row) {
        const r = document.createElement('div'); r.classList.add('menu-row');
        if (row?.label) r.appendChild(this.#renderBlockLabel(row.label));
        let fs = [];
        if (Array.isArray(row?.fields)) fs = row.fields;
        else if (row?.field && typeof row.field === 'object') fs = [row.field];
        fs.forEach(f => { const c = document.createElement('div'); c.classList.add('column'); c.appendChild(this.#renderField(f)); r.appendChild(c); });
        return r;
    }
    #renderField(field) {
        const type = (field.type || 'text').toLowerCase();
        const fid = this.#resolveUniqueId(field.id || 'field');
        const id = `details-${fid}`, name = id;
        const hasLabel = typeof field.label === 'string' && field.label.trim() !== '';
        const pv = typeof field.prefix_value === 'string' ? field.prefix_value : '';
        let el;
        if (type === 'select') {
            el = document.createElement('select');
            el.id = id; el.name = name; el.setAttribute('data-type', 'select');
            (field.options || []).forEach(o => {
                const op = document.createElement('option');
                op.value = o.value ?? o; op.textContent = o.label ?? o;
                el.appendChild(op);
            });
        } else {
            el = document.createElement('input');
            el.type = 'text'; el.id = id; el.name = name;
            if (type) el.setAttribute('data-type', type);
            if (!hasLabel) el.placeholder = field.placeholder ?? (type === 'number' ? '0.00' : '');
        }
        if (pv) el.setAttribute('data-prefix_value', pv);
        if (hasLabel) {
            const w = document.createElement('div'); w.classList.add('field-with-label');
            const lb = document.createElement('label'); lb.setAttribute('for', id); lb.textContent = field.label;
            w.appendChild(lb); w.appendChild(el); return w;
        }
        return el;
    }
    #resolveUniqueId(base) {
        if (!this.#usedIds.has(base)) { this.#usedIds.add(base); return base; }
        const m = base.match(/^(.*?)(\d+)$/);
        if (m) {
            let n = parseInt(m[2], 10), cand;
            do { n++; cand = m[1] + n; } while (this.#usedIds.has(cand));
            this.#usedIds.add(cand); return cand;
        }
        let n = 2, cand;
        do { cand = `${base}-${n}`; n++; } while (this.#usedIds.has(cand));
        this.#usedIds.add(cand); return cand;
    }
    #renderButtons() {
        const r = document.createElement('div'); r.classList.add('row', 'callback-menu-check');
        const c1 = document.createElement('div'); c1.classList.add('col');
        const cl = document.createElement('button'); cl.type = 'button';
        cl.className = 'btn btn-secondary calltoaction-clear-checkbox';
        cl.textContent = 'Borrar'; c1.appendChild(cl);
        const c2 = document.createElement('div'); c2.classList.add('col');
        const ac = document.createElement('button'); ac.type = 'button';
        ac.className = 'btn btn-primary calltoaction-accept-checkbox';
        ac.textContent = 'Aceptar'; c2.appendChild(ac);
        r.append(c1, c2); return r;
    }
    #collectValues(menu) {
        const rows = [], flat = {}, prefixes = {};
        menu.querySelectorAll('.menu-row').forEach((row, idx) => {
            const lbl = row.querySelector('.full-line .details-label, .cash-col-denom .cash-denom');
            const label = lbl ? lbl.textContent.trim() : '';
            const vals = {};
            row.querySelectorAll('input, select, textarea').forEach(f => {
                const name = f.name || f.id || `field_${idx}`;
                const type = (f.type || '').toLowerCase();
                const dt = (f.getAttribute('data-type') || '').toLowerCase();
                if (type === 'hidden' && !f.closest('.column') && !f.closest('td')) return;
                let v;
                if (type === 'checkbox') v = f.checked;
                else if (type === 'radio') { if (f.checked) v = f.value; else return; }
                else if (f.tagName === 'SELECT' && f.multiple) v = Array.from(f.selectedOptions).map(o => o.value);
                else if (dt === 'integer') {
                    const n = parseInt(this.#sanitizeIntegerInput(f.value) || '0', 10);
                    v = isNaN(n) ? 0 : n;
                } else if (dt === 'number') {
                    const n = this.#parseFormattedNumber(f.value.replace(/^C\$\s*/, ''));
                    v = isNaN(n) ? '' : n;
                } else v = f.value;
                vals[name] = v; flat[name] = v;
                const p = f.getAttribute('data-prefix_value'); if (p) prefixes[name] = p;
            });
            rows.push({ index: idx, label, classes: Array.from(row.classList), values: vals });
        });
        return { rows, flat, prefixes };
    }
    #getGroupContainers(g) { return g ? Array.from(g.querySelectorAll('.choice-container')) : []; }
    #deselectContainer(c) {
        if (!c) return;
        const l = c.querySelector('.choice-buttons');
        const v = l?.querySelector("[class*='choice_value']");
        const m = c.querySelector('.menu');
        const a = c.querySelector('input.choice_accepted');
        if (v) v.value = 'unchecked';
        l?.classList.remove('showmenu', 'not-empty', 'hover-menu', 'disabled');
        if (m) this.#clearMenuInputs(m);
        if (a) a.value = '';
    }
    #clearMenuInputs(menu) {
        if (!menu) return;
        menu.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.classList.contains('autosum-value')) return;
            if (el.classList.contains('cash-subtotal')) return;
            if (el.classList.contains('cash-total')) return;
            if (el.classList.contains('cash-change')) return;
            if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
            else if (el.tagName === 'SELECT' && el.multiple) Array.from(el.options).forEach(o => o.selected = false);
            else el.value = '';
        });
        this.#updateAutosum(menu);
        this.#updateCashCalculator(menu);
    }
    #isContainerAccepted(c) {
        const a = c?.querySelector('input.choice_accepted');
        return !!(a && a.value && a.value.trim() !== '');
    }
    #closeMenu(container) {
        if (!container) return;
        const l = container.querySelector('.choice-buttons');
        const v = l?.querySelector("[class*='choice_value']");
        const m = container.querySelector('.menu');
        const a = container.querySelector('input.choice_accepted');
        const wasAcc = this.#isContainerAccepted(container);
        if (l) l.classList.remove('showmenu');
        const others = this.#getGroupContainers(container.closest('.choice-grouped'));
        others.forEach(o => {
            if (o === container) return;
            const ol = o.querySelector('.choice-buttons');
            if (ol && !ol.classList.contains('showmenu')) ol.classList.remove('disabled');
        });
        if (!wasAcc) {
            if (v) v.value = 'unchecked';
            if (l) l.classList.remove('not-empty', 'hover-menu');
            if (m) this.#clearMenuInputs(m);
            if (a) a.value = '';
        }
    }
    #handleClick(e) {
        const closeBtn = e.target.closest('.menu-close-button');
        if (closeBtn) {
            e.stopPropagation(); e.preventDefault();
            const c = closeBtn.closest('.choice-container');
            if (c) this.#closeMenu(c);
            return;
        }
        const calltoaction = this.#getClassByPrefix(e.target, 'calltoaction-');
        if (!calltoaction) return;

        const container = e.target.closest('.choice-container');
        const grouped = e.target.closest('.choice-grouped');
        const menu = container?.querySelector('.menu');
        const labelEl = container?.querySelector('.choice-buttons');
        if (!labelEl) return;
        if (labelEl.hasAttribute('data-choice-disabled')) { e.stopPropagation(); return; }

        const cv = labelEl.querySelector("[class*='choice_value']");
        if (!cv) return;
        const groupType = this.getGroupType(container);
        const groupContainers = this.#getGroupContainers(grouped);

        switch (calltoaction) {
            case 'click-choice': {
                if (groupType === 'radio') {
                    if (cv.value === 'checked') return;
                    groupContainers.forEach(o => { if (o !== container) this.#deselectContainer(o); });
                    if (menu) labelEl.classList.add('showmenu');
                    cv.value = 'checked';
                    if (menu) this.#emitChange(container);
                } else {
                    const hasMenu = !!menu;
                    const acc = this.#isContainerAccepted(container);
                    if (cv.value === 'checked') {
                        if (hasMenu && acc) { labelEl.classList.add('showmenu'); this.#emitChange(container); return; }
                        labelEl.classList.remove('showmenu', 'not-empty', 'hover-menu');
                        cv.value = 'unchecked';
                        const a = container?.querySelector('input.choice_accepted');
                        if (a) a.value = '';
                        groupContainers.forEach(o => {
                            const ol = o.querySelector('.choice-buttons');
                            if (ol && !ol.classList.contains('showmenu')) ol.classList.remove('disabled');
                        });
                        if (menu) this.#clearMenuInputs(menu);
                    } else {
                        if (menu) labelEl.classList.add('showmenu');
                        cv.value = 'checked';
                        if (menu && grouped) {
                            groupContainers.forEach(o => {
                                if (o === container) return;
                                const ol = o.querySelector('.choice-buttons');
                                if (ol && !ol.classList.contains('showmenu')) ol.classList.add('disabled');
                            });
                        }
                        if (menu) this.#emitChange(container);
                    }
                }
                break;
            }
            case 'accept-checkbox': {
                labelEl.classList.remove('showmenu');
                labelEl.classList.add('not-empty', 'hover-menu');
                if (menu && grouped) {
                    groupContainers.forEach(o => {
                        const ol = o.querySelector('.choice-buttons');
                        if (ol && !ol.classList.contains('showmenu')) ol.classList.remove('disabled');
                    });
                }
                if (menu && container) {
                    const col = this.#collectValues(menu);
                    const data = {
                        choiceId: labelEl.getAttribute('for') || null,
                        label: labelEl.querySelector('.label')?.textContent?.trim() || '',
                        rows: col.rows, flat: col.flat, prefixes: col.prefixes
                    };
                    this.#lastAcceptedValues = new AcceptedResult(data);
                    let a = container.querySelector('input.choice_accepted');
                    if (!a) {
                        a = document.createElement('input');
                        a.type = 'hidden'; a.className = 'choice_accepted';
                        a.name = `accepted_${data.choiceId}`;
                        container.appendChild(a);
                    }
                    a.value = JSON.stringify(data);
                    container.dispatchEvent(new CustomEvent('choice:accepted', { bubbles: true, detail: this.#lastAcceptedValues }));
                    this.#emitChange(container);
                    if (typeof this.#onAccept === 'function') {
                        try { this.#onAccept(this.#lastAcceptedValues, container); } catch (e) { console.error(e); }
                    }
                }
                break;
            }
            case 'clear-checkbox': {
                if (menu) this.#clearMenuInputs(menu);
                cv.value = 'unchecked';
                if (container) {
                    const a = container.querySelector('input.choice_accepted');
                    if (a) a.value = '';
                }
                labelEl.classList.remove('showmenu', 'not-empty', 'hover-menu');
                groupContainers.forEach(o => {
                    const ol = o.querySelector('.choice-buttons');
                    if (ol && !ol.classList.contains('showmenu')) ol.classList.remove('disabled');
                });
                this.#emitChange(container);
                break;
            }
        }
    }
    #getClassByPrefix(el, prefix) {
        while (el && el !== document) {
            if (el.classList && el.classList.length) {
                for (const c of el.classList) if (c.startsWith(prefix)) return c.slice(prefix.length);
            }
            el = el.parentElement;
        }
        return null;
    }
}

// ============================================================
//  EXPOSICIÓN GLOBAL
// ============================================================
if (typeof window !== 'undefined') {
    window.ChoiceContainerBuilder = ChoiceContainerBuilder;
    window.AcceptedResult = AcceptedResult;
}