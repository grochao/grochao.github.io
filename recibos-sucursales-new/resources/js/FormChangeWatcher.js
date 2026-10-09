/**
 * ================================================================
 *  FormChangeWatcher
 *  Escucha cambios en inputs/selects/textarea/checkbox/radio de
 *  un <form> sin duplicar listeners ni disparar callbacks dos veces.
 *
 *  Características:
 *    - Una única instancia por formulario (registro con WeakMap).
 *    - Delegación de eventos a nivel del <form>.
 *    - Deduplicación paste→input y input→change.
 *    - Callbacks específicos: onTextChange, onSelectChange,
 *      onCheckChange, onPaste, y un genérico onChange.
 *    - API estática: FormChangeWatcher.attach / get / destroy.
 *
 *  Uso:
 *    const watcher = FormChangeWatcher.attach('#miForm', {
 *      onChange: (payload, el, ev) => console.log('cambio', payload),
 *      onPaste:  (payload, el, ev) => console.log('paste', payload)
 *    });
 * ================================================================
 */
class FormChangeWatcher {

    // ---------- Estáticos privados ----------
    static #registry = new WeakMap();          // form -> instancia
    static #TEXT_TYPES = new Set([
        'text', 'number', 'email', 'tel', 'password',
        'search', 'url', 'date', 'datetime-local',
        'month', 'week', 'time'
    ]);
    static #DEDUP_WINDOW = 120;                // ms para deduplicar eventos

    // ---------- Instancia: campos privados ----------
    #form;
    #handlers = null;
    #callbacks = {};
    #attached = false;
    #debug = false;
    #lastInputTime = new WeakMap();
    #lastPasteTime = new WeakMap();

    // ============================================================
    //  API ESTÁTICA
    // ============================================================

    /**
     * Crea (o devuelve) la instancia única asociada al formulario.
     * Si ya existe, solo actualiza los callbacks que se pasen.
     *
     * @param {string|HTMLFormElement} formOrSelector
     * @param {Object} [options]
     * @param {Function} [options.onChange]        - Cualquier cambio.
     * @param {Function} [options.onTextChange]    - Cambios en input:text / textarea.
     * @param {Function} [options.onSelectChange]  - Cambios en <select>.
     * @param {Function} [options.onCheckChange]   - Cambios en checkbox/radio.
     * @param {Function} [options.onPaste]         - Paste en texto/textarea.
     * @param {boolean}  [options.autoAttach=true] - Adjuntar listeners al crear.
     * @param {boolean}  [options.debug=false]     - Logs internos.
     * @returns {FormChangeWatcher}
     */
    static attach(formOrSelector, options = {}) {
        const form = FormChangeWatcher.#resolveForm(formOrSelector);
        if (!form) {
            throw new Error('FormChangeWatcher: no se encontró el <form>.');
        }

        let instance = FormChangeWatcher.#registry.get(form);

        if (instance) {
            // Ya existe → actualizar callbacks y asegurar attach
            instance.updateCallbacks(options);
            if (options.debug !== undefined) instance.#debug = !!options.debug;
            instance.attach();
            return instance;
        }

        instance = new FormChangeWatcher(form, options);
        FormChangeWatcher.#registry.set(form, instance);
        return instance;
    }

    /**
     * Obtiene la instancia existente (o null).
     */
    static get(formOrSelector) {
        const form = FormChangeWatcher.#resolveForm(formOrSelector);
        if (!form) return null;
        return FormChangeWatcher.#registry.get(form) || null;
    }

    /**
     * Destruye la instancia asociada al formulario.
     * @returns {boolean} true si existía y fue destruida.
     */
    static destroy(formOrSelector) {
        const form = FormChangeWatcher.#resolveForm(formOrSelector);
        if (!form) return false;
        const instance = FormChangeWatcher.#registry.get(form);
        if (!instance) return false;
        instance.destroy();
        return true;
    }

    static #resolveForm(input) {
        if (!input) return null;
        if (typeof HTMLFormElement !== 'undefined' && input instanceof HTMLFormElement) return input;
        if (typeof input === 'string') {
            const el = document.querySelector(input);
            return (el instanceof HTMLFormElement) ? el : null;
        }
        return null;
    }

    // ============================================================
    //  CONSTRUCTOR
    // ============================================================

    /**
     * No usar directamente: usar FormChangeWatcher.attach(...).
     */
    constructor(form, options = {}) {
        if (!(form instanceof HTMLFormElement)) {
            throw new Error('FormChangeWatcher: se requiere un <form> válido.');
        }

        this.#form = form;
        this.#debug = !!options.debug;

        this.#callbacks = {
            onChange: typeof options.onChange === 'function' ? options.onChange : null,
            onTextChange: typeof options.onTextChange === 'function' ? options.onTextChange : null,
            onSelectChange: typeof options.onSelectChange === 'function' ? options.onSelectChange : null,
            onCheckChange: typeof options.onCheckChange === 'function' ? options.onCheckChange : null,
            onPaste: typeof options.onPaste === 'function' ? options.onPaste : null
        };

        if (options.autoAttach !== false) {
            this.attach();
        }
    }

    // ============================================================
    //  CICLO DE VIDA
    // ============================================================

    /** Adjunta los listeners (idempotente). */
    attach() {
        if (this.#attached) return this;

        this.#handlers = {
            input: (e) => this.#onInput(e),
            change: (e) => this.#onChange(e),
            paste: (e) => this.#onPaste(e)
        };

        this.#form.addEventListener('input', this.#handlers.input);
        this.#form.addEventListener('change', this.#handlers.change);
        this.#form.addEventListener('paste', this.#handlers.paste);

        this.#attached = true;
        this.#log('listeners adjuntos al form:', this.#form);
        return this;
    }

    /** Quita los listeners (sin destruir la instancia). */
    detach() {
        if (!this.#attached || !this.#handlers) return this;

        this.#form.removeEventListener('input', this.#handlers.input);
        this.#form.removeEventListener('change', this.#handlers.change);
        this.#form.removeEventListener('paste', this.#handlers.paste);

        this.#handlers = null;
        this.#attached = false;
        this.#log('listeners removidos del form:', this.#form);
        return this;
    }

    /** Quita listeners y borra la instancia del registro. */
    destroy() {
        this.detach();
        FormChangeWatcher.#registry.delete(this.#form);
        this.#log('instancia destruida');
    }

    /** ¿Está escuchando actualmente? */
    isAttached() {
        return this.#attached;
    }

    /** Devuelve el <form> asociado. */
    getForm() {
        return this.#form;
    }

    // ============================================================
    //  ACTUALIZACIÓN DE CALLBACKS
    // ============================================================

    /**
     * Actualiza solo los callbacks que se pasen (los demás se mantienen).
     */
    updateCallbacks(options = {}) {
        const keys = ['onChange', 'onTextChange', 'onSelectChange', 'onCheckChange', 'onPaste'];
        keys.forEach(k => {
            if (typeof options[k] === 'function') {
                this.#callbacks[k] = options[k];
            }
        });
        return this;
    }

    /** Alias de updateCallbacks. */
    setCallbacks(options = {}) {
        return this.updateCallbacks(options);
    }

    // ============================================================
    //  CLASIFICACIÓN DE ELEMENTOS
    // ============================================================

    #classify(el) {
        if (!el || !el.tagName) return null;

        const tag = el.tagName.toLowerCase();
        const type = (el.type || '').toLowerCase();

        if (tag === 'textarea') return { kind: 'text', tag, type };

        if (tag === 'select') return { kind: 'select', tag, type };

        if (tag === 'input') {
            if (type === 'checkbox') return { kind: 'check', tag, type };
            if (type === 'radio') return { kind: 'radio', tag, type };
            if (FormChangeWatcher.#TEXT_TYPES.has(type)) return { kind: 'text', tag, type };
        }

        return null;
    }

    // ============================================================
    //  HANDLERS
    // ============================================================

    #onInput(e) {
        const el = e.target;
        const meta = this.#classify(el);
        if (!meta) return;

        // Si es texto y viene de un paste inmediato → ya lo emitimos en paste
        if (meta.kind === 'text') {
            const lastPaste = this.#lastPasteTime.get(el);
            if (lastPaste && (Date.now() - lastPaste) < FormChangeWatcher.#DEDUP_WINDOW) {
                // Marcamos input igual para deduplicar el change posterior
                this.#lastInputTime.set(el, Date.now());
                this.#log('input ignorado (viene de paste):', el);
                return;
            }
        }

        this.#lastInputTime.set(el, Date.now());
        this.#emit(meta, el, e, 'input');
    }

    #onChange(e) {
        const el = e.target;
        const meta = this.#classify(el);
        if (!meta) return;

        // Si 'input' ya disparó para este elemento hace muy poco → no duplicar
        const lastInput = this.#lastInputTime.get(el);
        if (lastInput && (Date.now() - lastInput) < FormChangeWatcher.#DEDUP_WINDOW) {
            this.#log('change ignorado (input ya disparó):', el);
            return;
        }

        // Y si viene de paste tampoco duplicamos
        const lastPaste = this.#lastPasteTime.get(el);
        if (lastPaste && (Date.now() - lastPaste) < FormChangeWatcher.#DEDUP_WINDOW) {
            this.#log('change ignorado (paste ya disparó):', el);
            return;
        }

        this.#emit(meta, el, e, 'change');
    }

    #onPaste(e) {
        const el = e.target;
        const meta = this.#classify(el);
        if (!meta) return;
        if (meta.kind !== 'text') return; // paste solo aplica a texto/textarea

        this.#lastPasteTime.set(el, Date.now());
        this.#emit(meta, el, e, 'paste');
    }

    // ============================================================
    //  EMISIÓN DE CALLBACKS
    // ============================================================

    #emit(meta, el, event, source) {
        const payload = this.#buildPayload(meta, el, event, source);

        if (this.#debug) {
            this.#log('emit', source, meta.kind, payload);
        }

        // 1. Callback específico
        const specific = this.#getSpecificCallback(meta, source);
        if (specific) this.#safeCall(specific, payload, el, event);

        // 2. Callback genérico
        if (this.#callbacks.onChange) {
            this.#safeCall(this.#callbacks.onChange, payload, el, event);
        }
    }

    #getSpecificCallback(meta, source) {
        if (source === 'paste') return this.#callbacks.onPaste;

        switch (meta.kind) {
            case 'text': return this.#callbacks.onTextChange;
            case 'select': return this.#callbacks.onSelectChange;
            case 'check':
            case 'radio': return this.#callbacks.onCheckChange;
            default: return null;
        }
    }

    #buildPayload(meta, el, event, source) {
        const payload = {
            kind: meta.kind,          // 'text' | 'select' | 'check' | 'radio'
            tag: meta.tag,            // 'input' | 'textarea' | 'select'
            type: meta.type,          // 'text' | 'number' | 'checkbox' | ...
            id: el.id || null,
            name: el.name || null,
            source,                   // 'input' | 'change' | 'paste'
            value: null,
            checked: null,
            selectedValues: null,
            element: el
        };

        if (meta.kind === 'check' || meta.kind === 'radio') {
            payload.checked = el.checked;
            payload.value = el.value;
        } else if (meta.kind === 'select') {
            if (el.multiple) {
                payload.selectedValues = Array.from(el.selectedOptions).map(o => o.value);
                payload.value = payload.selectedValues;
            } else {
                payload.value = el.value;
            }
        } else {
            payload.value = el.value;
        }

        return payload;
    }

    // ============================================================
    //  UTILIDADES
    // ============================================================

    #safeCall(fn, payload, el, event) {
        try {
            fn(payload, el, event);
        } catch (err) {
            console.error('FormChangeWatcher: error en callback:', err);
        }
    }

    #log(...args) {
        if (this.#debug) console.log('[FormChangeWatcher]', ...args);
    }
}

// ============================================================
//  EXPOSICIÓN GLOBAL
// ============================================================
if (typeof window !== 'undefined') {
    window.FormChangeWatcher = FormChangeWatcher;
}