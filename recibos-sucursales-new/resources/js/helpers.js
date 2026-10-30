/* ============================================================
          $getEl — NodeList vacío | Element | NodeList (NUNCA null)
          ============================================================ */
const $getEl = (selector) => {
    const els = document.querySelectorAll(selector);
    if (els.length === 0) return els;
    return els.length === 1 ? els[0] : els;
};

/* ============================================================
   DomExtension — métodos con prefijo _
   ============================================================ */
class DomExtension {
    static #DISABLE_STORE = new WeakMap();
    static #DISPLAY_STORE = new WeakMap();
    static #silent = false;

    static #DISABLE_STYLES = {
        pointerEvents: 'none',
        opacity: '0.5',
        cursor: 'not-allowed',
    };

    /* ---------- logging interno ---------- */
    static #warn(msg, ...args) {
        if (!DomExtension.#silent) console.warn('[DomExtension]', msg, ...args);
    }
    static set silent(v) { DomExtension.#silent = !!v; }

    /* ---------- helpers de tipo ---------- */
    static #isCollection(ctx) {
        return ctx instanceof NodeList || Array.isArray(ctx);
    }
    static #isElementLike(el) {
        return el && typeof el === 'object' && 'style' in el;
    }

    /* ---------- ejecutores protegidos ---------- */
    static #each(ctx, fn) {
        if (!ctx) return;
        const run = (el) => {
            if (!DomExtension.#isElementLike(el)) {
                DomExtension.#warn('elemento inválido', el);
                return;
            }
            try { fn(el); }
            catch (err) { DomExtension.#warn(err.message, el); }
        };
        if (DomExtension.#isCollection(ctx)) ctx.forEach(run);
        else run(ctx);
    }

    static #getter(ctx, fn) {
        if (!ctx) return null;
        const run = (el) => {
            if (!DomExtension.#isElementLike(el)) return null;
            try { return fn(el); }
            catch (err) { DomExtension.#warn(err.message, el); return null; }
        };
        if (DomExtension.#isCollection(ctx)) return Array.from(ctx).map(run);
        return run(ctx);
    }

    /* ---------- validadores ---------- */
    static #classes(names) {
        return names
            .flatMap((n) => String(n ?? '').trim().split(/\s+/))
            .filter(Boolean);
    }
    static #isValidAttr(name) {
        return typeof name === 'string'
            && name.length > 0
            && !/[\s"'<>/=]/.test(name);
    }
    static #isValidDataKey(key) {
        return typeof key === 'string' && key.length > 0 && !/\s/.test(key);
    }

    /* ---------- disable / enable ---------- */
    static #applyDisable(el) {
        if (!DomExtension.#DISABLE_STORE.has(el)) {
            DomExtension.#DISABLE_STORE.set(el, {
                pointerEvents: el.style.pointerEvents,
                opacity: el.style.opacity,
                cursor: el.style.cursor,
                disabled: 'disabled' in el ? el.disabled : null,
            });
        }
        Object.assign(el.style, DomExtension.#DISABLE_STYLES);
        if ('disabled' in el) el.disabled = true;
    }
    static #applyEnable(el) {
        const saved = DomExtension.#DISABLE_STORE.get(el);
        if (saved) {
            el.style.pointerEvents = saved.pointerEvents;
            el.style.opacity = saved.opacity;
            el.style.cursor = saved.cursor;
            if (saved.disabled !== null) el.disabled = saved.disabled;
            DomExtension.#DISABLE_STORE.delete(el);
        } else {
            el.style.pointerEvents = '';
            el.style.opacity = '';
            el.style.cursor = '';
            if ('disabled' in el) el.disabled = false;
        }
    }

    /* ---------- hide / show ---------- */
    static #applyHide(el) {
        if (!DomExtension.#DISPLAY_STORE.has(el)) {
            DomExtension.#DISPLAY_STORE.set(el, el.style.display);
        }
        el.style.display = 'none';
    }
    static #applyShow(el) {
        if (DomExtension.#DISPLAY_STORE.has(el)) {
            el.style.display = DomExtension.#DISPLAY_STORE.get(el);
            DomExtension.#DISPLAY_STORE.delete(el);
        } else {
            el.style.display = '';
        }
    }

    /* ============================================================
       MÉTODOS INYECTADOS — prefijo _
       ============================================================ */
    static #METHODS = {

        /* ---------- estado visual ---------- */
        _disable() {
            DomExtension.#each(this, DomExtension.#applyDisable);
            return this;
        },
        _enable() {
            DomExtension.#each(this, DomExtension.#applyEnable);
            return this;
        },
        _hide() {
            DomExtension.#each(this, DomExtension.#applyHide);
            return this;
        },
        _show() {
            DomExtension.#each(this, DomExtension.#applyShow);
            return this;
        },

        /* ---------- data-* ---------- */
        _getdata(key) {
            if (!DomExtension.#isValidDataKey(key)) {
                DomExtension.#warn(`_getdata: key inválida "${key}"`);
                return null;
            }
            return DomExtension.#getter(this, (el) =>
                el.dataset ? el.dataset[key] ?? null : null
            );
        },
        _setdata(key, value) {
            if (!DomExtension.#isValidDataKey(key)) {
                DomExtension.#warn(`_setdata: key inválida "${key}"`);
                return this;
            }
            DomExtension.#each(this, (el) => {
                if (el.dataset) el.dataset[key] = value;
            });
            return this;
        },

        /* ---------- eventos ---------- */
        _on(event, handler) {
            if (typeof event !== 'string' || !event) {
                DomExtension.#warn(`_on: evento inválido "${event}"`);
                return this;
            }
            if (typeof handler !== 'function') {
                DomExtension.#warn('_on: handler no es función');
                return this;
            }
            DomExtension.#each(this, (el) => el.addEventListener(event, handler));
            return this;
        },

        /* ---------- clases (múltiples) ---------- */
        _addClass(...names) {
            const list = DomExtension.#classes(names);
            if (!list.length) return this;
            DomExtension.#each(this, (el) => {
                if (el.classList) el.classList.add(...list);
                else DomExtension.#warn('elemento sin classList', el);
            });
            return this;
        },
        _removeClass(...names) {
            const list = DomExtension.#classes(names);
            if (!list.length) return this;
            DomExtension.#each(this, (el) => {
                if (el.classList) el.classList.remove(...list);
                else DomExtension.#warn('elemento sin classList', el);
            });
            return this;
        },

        /* ---------- atributos (get/set/remove) ---------- */
        _attr(name, value) {
            if (!DomExtension.#isValidAttr(name)) {
                DomExtension.#warn(`_attr: nombre inválido "${name}"`);
                return arguments.length === 1 ? null : this;
            }
            if (arguments.length === 1) {
                return DomExtension.#getter(this, (el) => el.getAttribute(name));
            }
            DomExtension.#each(this, (el) => el.setAttribute(name, value));
            return this;
        },
        _removeAttr(...names) {
            const list = DomExtension.#classes(names).filter((n) => {
                if (DomExtension.#isValidAttr(n)) return true;
                DomExtension.#warn(`_removeAttr: nombre inválido "${n}"`);
                return false;
            });
            if (!list.length) return this;

            DomExtension.#each(this, (el) => {
                list.forEach((name) => el.removeAttribute(name));
            });
            return this;
        },

        /* ---------- text (get/set) ---------- */
        _text(value) {
            if (arguments.length === 0) {
                return DomExtension.#getter(this, (el) => el.textContent);
            }
            DomExtension.#each(this, (el) => {
                try { el.textContent = value; }
                catch (err) { DomExtension.#warn(err.message); }
            });
            return this;
        },

        /* ---------- html (get/set) ---------- */
        _html(value) {
            if (arguments.length === 0) {
                return DomExtension.#getter(this, (el) => el.innerHTML);
            }
            DomExtension.#each(this, (el) => {
                try { el.innerHTML = value; }
                catch (err) { DomExtension.#warn(err.message); }
            });
            return this;
        },

        /* ---------- value (get/set) ---------- */
        _value(value) {
            if (arguments.length === 0) {
                return DomExtension.#getter(this, (el) =>
                    'value' in el ? el.value : null
                );
            }
            DomExtension.#each(this, (el) => {
                if ('value' in el) el.value = value;
                else DomExtension.#warn('elemento sin .value', el);
            });
            return this;
        },

        /* ---------- existe? ---------- */
        _exist() {
            if (DomExtension.#isCollection(this)) return this.length > 0;
            if (!this) return false;
            return true;
        },
    };

    /* ---------- instalación ---------- */
    static #extend(proto) {
        for (const [name, fn] of Object.entries(DomExtension.#METHODS)) {
            try {
                Object.defineProperty(proto, name, {
                    value: fn, writable: true, configurable: true,
                });
            } catch (err) {
                DomExtension.#warn(`no se pudo inyectar ${name}: ${err.message}`);
            }
        }
    }

    static install() {
        this.#extend(Element.prototype);
        this.#extend(NodeList.prototype);
        return this;
    }
}

DomExtension.install();