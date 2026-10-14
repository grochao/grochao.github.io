class WheelFloating {
    /**
     * @param {Object}  options
     * @param {string|HTMLElement} options.element          Selector o nodo del div flotante
     * @param {string}  [options.excludeSelector]           Contenedor(es) cuyo wheel se ignora
     * @param {string}  [options.visibleClass='is-visible'] Clase CSS para mostrar
     * @param {number}  [options.threshold=0]               deltaY mínimo por evento para considerarlo
     * @param {number}  [options.hideDelay=0]               ms de retardo para ocultar al subir
     * @param {number}  [options.minAllowedWidth=0]         Ancho mínimo del viewport para activar el efecto
     * @param {number}  [options.minScroll=0]               deltaY acumulado mínimo para mostrar el div
     * @param {boolean} [options.closeOnEsc=true]           Cerrar con ESC
     * @param {boolean} [options.closeOnClick=true]         Cerrar al hacer clic en el div
     * @param {boolean} [options.closeButton=true]          Inyectar botón de cierre
     * @param {string}  [options.closeButtonLabel='✕']      Texto/icono del botón
     * @param {Function}[options.onClose]                   Callback al cerrarse
     */
    constructor(options = {}) {
        this.el = typeof options.element === 'string'
            ? document.querySelector(options.element)
            : options.element;

        if (!this.el) throw new Error('WheelFloating: no se encontró el elemento flotante');

        this.excludeSelector = options.excludeSelector || null;
        this.visibleClass = options.visibleClass || 'is-visible';
        this.threshold = options.threshold ?? 0;
        this.hideDelay = options.hideDelay ?? 0;
        this.minAllowedWidth = options.minAllowedWidth ?? 0;
        this.minScroll = options.minScroll ?? 0;
        this.closeOnEsc = options.closeOnEsc ?? true;
        this.closeOnClick = options.closeOnClick ?? true;
        this.closeButton = options.closeButton ?? true;
        this.closeButtonLabel = options.closeButtonLabel ?? '✕';
        this.onClose = options.onClose || null;

        // Estado interno
        this._hideTimer = null;
        this._dismissed = false;   // cerrado manualmente
        this._accumulated = 0;       // deltaY positivo acumulado
        this._enabled = true;    // según minAllowedWidth

        // Handlers bound
        this._onWheel = this._onWheel.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onResize = this._onResize.bind(this);

        this._initCloseButton();
        this._initCloseOnClick();

        // Evaluación inicial del ancho
        this._enabled = this._checkWidth();

        window.addEventListener('wheel', this._onWheel, { passive: true });
        window.addEventListener('resize', this._onResize);

        if (this.closeOnEsc) {
            document.addEventListener('keydown', this._onKeyDown);
        }
    }

    /* ---------- Ancho mínimo de viewport ---------- */

    _checkWidth() {
        return window.innerWidth >= this.minAllowedWidth;
    }

    _onResize() {
        const wasEnabled = this._enabled;
        this._enabled = this._checkWidth();

        // Si pasó de habilitado → deshabilitado, aseguramos que quede oculto
        if (wasEnabled && !this._enabled) {
            this._dismissed = true;
            this._accumulated = 0;
            this.el.classList.remove(this.visibleClass);
        }
        // Si pasó de deshabilitado → habilitado, reseteamos estado
        if (!wasEnabled && this._enabled) {
            this._dismissed = false;
            this._accumulated = 0;
        }
    }

    /* ---------- Inicialización de cierres ---------- */

    _initCloseButton() {
        if (!this.closeButton) return;

        if (getComputedStyle(this.el).position === 'static') {
            this.el.style.position = 'fixed';
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wf-close-btn';
        btn.setAttribute('aria-label', 'Cerrar');
        btn.textContent = this.closeButtonLabel;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });

        this.el.appendChild(btn);
        this._closeBtn = btn;
    }

    _initCloseOnClick() {
        if (!this.closeOnClick) return;
        this._onClick = () => this.close();
        this.el.addEventListener('click', this._onClick);
    }

    /* ---------- Wheel ---------- */

    _isExcluded(target) {
        if (!this.excludeSelector) return false;
        if (!(target instanceof Element)) return false;
        return target.matches(this.excludeSelector) ||
            !!target.closest(this.excludeSelector);
    }

    _onWheel(e) {
        // 1) Efecto desactivado por ancho de viewport
        if (!this._enabled) return;

        // 2) Ignorar wheel sobre contenedores excluidos
        if (this._isExcluded(e.target)) return;

        // 3) Ignorar deltas diminutos (ruido de touchpad)
        if (Math.abs(e.deltaY) < this.threshold) return;

        if (e.deltaY > 0) {
            // ⬇️ Bajar: acumulamos
            this._accumulated += e.deltaY;

            // Solo mostramos al superar minScroll
            if (this._accumulated >= this.minScroll) {
                this._dismissed = false;
                this._show();
            }
        } else {
            // ⬆️ Subir: ocultamos y reseteamos el acumulador
            this._accumulated = 0;
            this._hide();
        }
    }

    /* ---------- ESC ---------- */

    _onKeyDown(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (this.el.classList.contains(this.visibleClass)) {
                this.close();
            }
        }
    }

    /* ---------- Mostrar / ocultar / cerrar ---------- */

    _show() {
        if (this._dismissed) return;
        clearTimeout(this._hideTimer);
        this.el.classList.add(this.visibleClass);
    }

    _hide() {
        if (this.hideDelay > 0) {
            clearTimeout(this._hideTimer);
            this._hideTimer = setTimeout(() => {
                this.el.classList.remove(this.visibleClass);
            }, this.hideDelay);
        } else {
            this.el.classList.remove(this.visibleClass);
        }
    }

    /** Cierre manual (ESC, clic en el div o botón). */
    close() {
        clearTimeout(this._hideTimer);
        this._dismissed = true;
        this._accumulated = 0;
        this.el.classList.remove(this.visibleClass);
        if (typeof this.onClose === 'function') this.onClose();
    }

    /** Reabrir manualmente. */
    open() {
        if (!this._enabled) return;
        this._dismissed = false;
        this._show();
    }

    /* ---------- Limpieza ---------- */

    destroy() {
        window.removeEventListener('wheel', this._onWheel);
        window.removeEventListener('resize', this._onResize);
        document.removeEventListener('keydown', this._onKeyDown);
        if (this._onClick) this.el.removeEventListener('click', this._onClick);
        if (this._closeBtn) this._closeBtn.remove();
        clearTimeout(this._hideTimer);
    }
}



// ============================================================
//  EXPOSICIÓN GLOBAL
// ============================================================
if (typeof window !== 'undefined') {
    window.WheelFloating = WheelFloating;
}