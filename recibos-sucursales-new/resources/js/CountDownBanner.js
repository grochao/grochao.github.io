/**
* ================================================================
*  CountdownBanner – Cuenta regresiva con banner persistente
*  Versión: 6.0.0 (sin repetición diaria, finaliza correctamente)
*
*  Comportamiento:
*    - Si se define hourMax y/o minuteMax, el contador cuenta hasta esa hora.
*      Al llegar, finaliza y el banner desaparece.
*    - Si no se define hora límite, usa duración fija.
*    - Primera visita: desactivado por defecto.
* ================================================================
*/
class CountdownBanner {
    // ---------- Constantes ----------
    static #TICK_MS = 1000;
    static #DEFAULT_DURATION = 3_600_000;

    // ---------- Campos privados ----------
    #duration;
    #hourMax;
    #minuteMax;
    #storageKey;
    #disabledKey;
    #bannerId;
    #startTime;
    #intervalId;
    #isFinished;
    #bannerElement;
    #onFinish;
    #onDisable;
    #preFix;

    constructor(options = {}) {
        // FIX #1: validación de duration
        const duration = options.duration ?? CountdownBanner.#DEFAULT_DURATION;
        if (!Number.isFinite(duration) || duration < 0) {
            throw new TypeError('`duration` debe ser un número finito >= 0');
        }
        this.#duration = duration;
        this.#preFix = String(options.prefix ?? '').trim().toUpperCase();
        this.#preFix = this.#preFix !== '' ? this.#preFix + '_' : '';


        this.#hourMax = CountdownBanner.#validarEntero(options.hourMax, 0, 23, 'hourMax');
        this.#minuteMax = CountdownBanner.#validarEntero(options.minuteMax, 0, 59, 'minuteMax');

        this.#storageKey = this.#preFix + (options.storageKey ?? 'countdown_data');
        this.#disabledKey = this.#preFix + (options.disabledKey ?? 'countdown_disabled');
        this.#bannerId = this.#preFix + (options.bannerId ?? 'previous-receipt-banner');
        this.#onFinish = typeof options.onFinish === 'function' ? options.onFinish : null;
        this.#onDisable = typeof options.onDisable === 'function' ? options.onDisable : null;

        this.#startTime = 0;
        this.#intervalId = null;
        this.#isFinished = false;
        this.#bannerElement = null;
    }

    static #validarEntero(value, min, max, name) {
        if (value === undefined || value === null) return null;
        if (!Number.isInteger(value) || value < min || value > max) {
            throw new RangeError(`${name} debe ser un entero entre ${min} y ${max}`);
        }
        return value;
    }

    // ============================================================
    //  GETTERS PÚBLICOS
    // ============================================================

    /** Alias semántico de `isActive()` (FIX #4). */
    get isPastDay() {
        return this.isActive();
    }

    get hourMax() { return this.#hourMax; }
    get minuteMax() { return this.#minuteMax; }

    // ============================================================
    //  MÉTODOS PÚBLICOS
    // ============================================================

    start() {
        if (this.#intervalId) return this;                // FIX #10
        if (this.#isDisabled()) {
            console.info('⏹️ Countdown desactivado (no se iniciará).');
            this.#cleanupDate();
            return this;
        }

        const data = this.#readState();
        if (data?.active === true) {
            this.#startTime = data.startTime ?? Date.now();
            if (Number.isInteger(data.hourMax)) this.#hourMax = data.hourMax;
            if (Number.isInteger(data.minuteMax)) this.#minuteMax = data.minuteMax;
            if (Number.isFinite(data.duration)) this.#duration = data.duration;

            if (this.#getRemainingMs() <= 0) {
                this.#finish();
            } else {
                console.info(`⏳ Reanudando countdown (inicio ${new Date(this.#startTime).toLocaleTimeString()})`);
                this.#startLoop();
            }
        } else {
            this.#writeDisabled(true);
            this.#isFinished = true;
            console.info('⏸️ Primera visita: modo desactivado. Llama a .enable() para activarlo.');
        }
        return this;
    }

    enable() {
        if (!this.#isDisabled() && !this.#isFinished) {
            console.info('ℹ️ Countdown ya está activo.');
            return this;
        }

        this.#writeDisabled(false);
        this.#isFinished = false;

        const data = this.#readState();
        if (!data) {
            this.#startTime = Date.now();
            this.#saveState(true);
            console.info('🔓 Modo activado (nuevo estado).');
            this.#startLoop();
            return this;
        }
        // FIX #2: se elimina rama muerta `data.active === false`.
        console.info('🔓 Modo activado. Reanudando countdown...');
        return this.start();
    }

    disable() {
        this.#disableManually();
        return this;
    }

    stop() {
        this.#clearInterval();
        this.#removeState();
        this.#cleanupDate();
        this.#isFinished = true;
        this.#removeBanner();
        console.info('⏹️ Countdown detenido (reset total).');
        return this;
    }

    restart() {
        console.log('🔄 REINICIANDO...');
        this.#clearInterval();
        this.#removeBanner();
        this.#isFinished = false;
        this.#removeState();

        this.#startTime = Date.now();
        this.#saveState(true);

        // FIX #3: si el objetivo ya pasó, abortar limpiamente.
        if (this.#getRemainingMs() <= 0) {
            console.warn('⚠️ Restart abortado: el objetivo ya pasó.');
            this.#finish();
            return this;
        }
        console.info('🚀 Countdown reiniciado desde cero.');
        this.#startLoop();
        return this;
    }

    getRemaining() {
        if (this.#isFinished) return 0;
        const r = this.#getRemainingMs();
        return r > 0 ? r : 0;
    }

    isActive() {
        return !this.#isFinished && !this.#isDisabled();
    }

    // ============================================================
    //  MÉTODOS PRIVADOS
    // ============================================================

    #isDisabled() {
        try { return localStorage.getItem(this.#disabledKey) === 'true'; }
        catch { return false; }
    }

    #writeDisabled(on) {
        try {
            if (on) localStorage.setItem(this.#disabledKey, 'true');
            else localStorage.removeItem(this.#disabledKey);
        } catch { /* storage bloqueado */ }
    }

    #readState() {
        try {
            const raw = localStorage.getItem(this.#storageKey);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    #writeState(obj) {
        try { localStorage.setItem(this.#storageKey, JSON.stringify(obj)); } catch { }
    }

    #removeState() {
        try {
            localStorage.removeItem(this.#storageKey);
            localStorage.removeItem(this.#disabledKey);
        } catch { }
    }

    #getTargetTime() {
        const now = new Date();
        const target = new Date(now);

        if (this.#hourMax !== null && this.#minuteMax !== null) {
            target.setHours(this.#hourMax, this.#minuteMax, 0, 0);
        } else if (this.#hourMax !== null) {
            target.setHours(this.#hourMax, 0, 0, 0);
        } else if (this.#minuteMax !== null) {
            target.setMinutes(this.#minuteMax, 0, 0);
        } else {
            return null;
        }
        return target;
    }

    #getRemainingMs() {
        const target = this.#getTargetTime();
        if (!target) {
            const elapsed = Date.now() - this.#startTime;
            const remaining = this.#duration - elapsed;
            return remaining > 0 ? remaining : 0;
        }
        const diff = target.getTime() - Date.now();
        return diff > 0 ? diff : 0;
    }

    #saveState(active = true) {
        this.#writeState({
            startTime: this.#startTime,
            duration: this.#duration,
            active,
            ...(this.#hourMax !== null && { hourMax: this.#hourMax }),
            ...(this.#minuteMax !== null && { minuteMax: this.#minuteMax })
        });
    }

    #finish() {
        if (this.#isFinished) return;
        this.#isFinished = true;
        this.#clearInterval();
        try { localStorage.removeItem(this.#storageKey); } catch { }
        this.#writeDisabled(true);
        this.#removeBanner();
        this.#cleanupDate();
        console.info(`✅ FINALIZADO a las ${new Date().toLocaleTimeString()}`);
        this.#onFinish?.();
    }

    #disableManually() {
        this.#clearInterval();
        try { localStorage.removeItem(this.#storageKey); } catch { }
        this.#writeDisabled(true);
        this.#cleanupDate();

        // FIX #9: acceso seguro a globales.
        if (typeof globalThis.ResetDate === 'function') {
            try { globalThis.ResetDate(); }
            catch (err) { console.error('ResetDate() lanzó:', err); }
        }

        this.#isFinished = true;
        this.#removeBanner();
        console.info('⏹️ Countdown desactivado manualmente.');
        this.#onDisable?.();
    }

    #removeBanner() {
        const existing = document.getElementById(this.#bannerId);
        if (existing) existing.remove();
        this.#bannerElement = null;
    }

    #createBanner(remainingMs) {
        let banner = document.getElementById(this.#bannerId);
        const targetTime = this.#getTargetTime();
        const timeStr = targetTime ? this.#formatTime(targetTime) : '';

        if (!banner) {
            banner = document.createElement('div');
            banner.id = this.#bannerId;
            banner.className = 'previous-receipt';
            banner.innerHTML = `
        <p>
          El modo de <strong>CAMBIO DE FECHA</strong> está habilitado
          ${timeStr ? `hasta las <strong>${timeStr}</strong>` : ''}.
          Tiempo Restante <strong id="tmp_previous_date_countdown"></strong>
          Para salir de este modo haga click en la ✕ de la derecha de esta barra.
        </p>
        <button class="close" type="button" aria-label="Cerrar">✕</button>
      `;
            document.body.appendChild(banner);
            banner.querySelector('.close')
                .addEventListener('click', () => this.#disableManually());
        }
        this.#bannerElement = banner;
        this.#updateBannerTime(remainingMs);
        return banner;
    }

    #updateBannerTime(remainingMs) {
        const span = this.#bannerElement?.querySelector('#tmp_previous_date_countdown');
        if (!span) return;
        const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
        const minutes = String(Math.floor(totalSec / 60)).padStart(2, '0');
        const seconds = String(totalSec % 60).padStart(2, '0');
        span.textContent = `${minutes} minutos y ${seconds} segundos`;
    }

    #startLoop() {
        if (this.#intervalId) return;                     // FIX #10
        const remaining = this.#getRemainingMs();         // FIX #11 (una sola lectura)
        if (remaining <= 0) { this.#finish(); return; }

        this.#createBanner(remaining);

        this.#intervalId = setInterval(() => {
            const r = this.#getRemainingMs();
            if (r <= 0) { this.#finish(); return; }
            this.#updateBannerTime(r);
        }, CountdownBanner.#TICK_MS);
    }

    #clearInterval() {
        if (this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
    }

    #formatTime(date) {
        if (!date) return '';
        let h = date.getHours();
        const m = String(date.getMinutes()).padStart(2, '0');
        const ap = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ap}`;
    }

    #cleanupDate() {
        /*if (typeof window !== 'undefined' && window._slug_sede_) {
            try { localStorage.removeItem(this.#preFix + 'new_date'); } catch { }
        }
        if (typeof window._NEW_DATE_ !== 'undefined') {
            window._NEW_DATE_ = { status: false, day: '', month: '', year: '' };
        }*/
    }
}

// ============================================================
//  EXPOSICIÓN GLOBAL (opcional)
// ============================================================
window.hourmax_change_receipt_day = 9;
if (typeof window !== 'undefined') {

    window.CountdownBanner = CountdownBanner;
    window.hourmax_change_receipt_day = 14;



}
