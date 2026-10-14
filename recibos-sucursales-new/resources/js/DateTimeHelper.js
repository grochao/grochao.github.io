/* ============================================================
 *  DateTimeHelper — helper con estado + chaining fluido
 * ============================================================ */
class DateTimeHelper {
  #locale;
  #timeZone;
  #options;
  #cache;

  constructor({ locale, timeZone, options } = {}) {
    this.#locale   = locale   ?? (typeof navigator !== 'undefined' ? navigator.language : 'es-NI');
    this.#timeZone = timeZone ?? undefined;
    this.#options  = options  ?? {};
    this.#cache    = new Map();
  }

  // ---------- Configuración (chainable) ----------
  setLocale(locale)     { this.#locale = locale;     this.#cache.clear(); return this; }
  setTimeZone(tz)       { this.#timeZone = tz;       this.#cache.clear(); return this; }
  setOptions(opts)      { this.#options = { ...this.#options, ...opts }; this.#cache.clear(); return this; }

  // ---------- Getters de configuración ----------
  get locale()   { return this.#locale; }
  get timeZone() { return this.#timeZone; }
  get options()  { return { ...this.#options }; }

  // ---------- Formatters cacheados ----------
  #getFormatter(type, options) {
    const key = type + '|' + this.#locale + '|' + (this.#timeZone ?? '') + '|' + JSON.stringify(options);
    if (this.#cache.has(key)) return this.#cache.get(key);

    const fmt = new Intl.DateTimeFormat(this.#locale, {
      timeZone: this.#timeZone,
      ...this.#options,
      ...options,
    });
    this.#cache.set(key, fmt);
    return fmt;
  }

  getDateFormatter(options = {}) {
    return this.#getFormatter('date', {
      year: 'numeric', month: '2-digit', day: '2-digit', ...options,
    });
  }

  getTimeFormatter(options = {}) {
    return this.#getFormatter('time', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', ...options,
    });
  }

  getDateTimeFormatter(options = {}) {
    return this.#getFormatter('datetime', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      ...options,
    });
  }

  // ---------- Valores listos para usar ----------
  currentDate(options = {})     { return this.getDateFormatter(options).format(new Date()); }
  currentTime(options = {})     { return this.getTimeFormatter(options).format(new Date()); }
  currentDateTime(options = {}) { return this.getDateTimeFormatter(options).format(new Date()); }

  // ---------- Utilidades misceláneas ----------
  format(date, options = {}) {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) throw new RangeError('Fecha inválida: ' + date);
    return this.getDateTimeFormatter(options).format(d);
  }

  parts(date = new Date()) {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) throw new RangeError('Fecha inválida: ' + date);
    const p = this.getDateTimeFormatter().formatToParts(d);
    return Object.fromEntries(p.map(({ type, value }) => [type, value]));
  }

  updateDateTime(target = '[data-datetime]', options = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return this;
    el.textContent = this.currentDateTime(options);
    return this;
  }
}

/* ============================================================
 *  _HELPERS_ — fachada con namespaces cacheables
 * ============================================================ */
const _HELPERS_ = (() => {
  const instances = new Map();

  const ns = (name, Factory, opts) => {
    if (!instances.has(name)) instances.set(name, new Factory(opts));
    return instances.get(name);
  };

  return {
    dateTime(options) {
      return ns('dateTime', DateTimeHelper, options);
    },
    updateDateTime(target, options) {
      return this.dateTime().updateDateTime(target, options);
    },
  };
})();

/* ============================================================
 *  DEMO · Wiring UI ↔ _HELPERS_
 * ============================================================ */
(() => {
  const $ = (id) => document.getElementById(id);
  const logEl        = $('log');
  const outFormatter = $('out-formatter');
  const outValue     = $('out-value');
  const kvLocale     = $('kv-locale');
  const kvTz         = $('kv-tz');
  const liveClock    = $('live-clock');

  let clockInterval = null;

  const log = (msg, kind = '') => {
    const line = document.createElement('div');
    line.className = 'demo-log__line';
    line.innerHTML = `<span class="demo-log__time">${new Date().toLocaleTimeString()}</span>
                      <span class="demo-log__msg ${kind ? 'demo-log__msg--' + kind : ''}">${msg}</span>`;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
    while (logEl.children.length > 100) logEl.removeChild(logEl.firstChild);
  };

  const safe = (label, fn) => {
    try {
      const result = fn();
      log(`${label} → OK`, 'ok');
      return result;
    } catch (err) {
      log(`${label} → ERROR: ${err.message}`, 'err');
      return null;
    }
  };

  const refreshConfigView = () => {
    const dt = _HELPERS_.dateTime();
    kvLocale.textContent = dt.locale;
    kvTz.textContent     = dt.timeZone ?? '(del sistema)';
  };

  // ---------- Configuración ----------
  $('btn-apply').addEventListener('click', () => {
    const hour12 = $('cfg-hour12').value;
    const opts   = hour12 === '' ? {} : { hour12: hour12 === 'true' };

    const dt = _HELPERS_.dateTime();
    const ret = safe('setLocale().setTimeZone().setOptions()', () =>
      dt.setLocale($('cfg-locale').value)
        .setTimeZone($('cfg-tz').value || undefined)
        .setOptions(opts)
    );
    if (ret) {
      refreshConfigView();
      log(`Config aplicada · locale=${dt.locale} · tz=${dt.timeZone ?? 'sistema'} · opts=${JSON.stringify(opts)}`);
    }
  });

  $('btn-chain-check').addEventListener('click', () => {
    const dt = _HELPERS_.dateTime();
    const a = dt.setLocale(dt.locale);
    const b = a.setTimeZone(dt.timeZone);
    const same = a === b && b === dt;
    log(`Chaining devuelve la misma instancia: ${same}`, same ? 'ok' : 'err');
    outFormatter.textContent = `setLocale() === setTimeZone() === _HELPERS_.dateTime() → ${same}`;
  });

  $('btn-reset-cfg').addEventListener('click', () => {
    _HELPERS_.dateTime().setLocale(navigator.language).setTimeZone(undefined).setOptions({});
    $('cfg-locale').value = 'es-NI';
    $('cfg-tz').value     = 'America/Managua';
    $('cfg-hour12').value = '';
    refreshConfigView();
    log('Configuración reseteada');
  });

  // ---------- Formatters ----------
  const showFormatter = (label, factory) => {
    const fmt = safe(label, () => factory(_HELPERS_.dateTime()));
    if (!fmt) return;
    const now = new Date();
    outFormatter.textContent =
      `resolvedOptions() = ${JSON.stringify(fmt.resolvedOptions(), null, 2)}\n` +
      `format(now)       = ${fmt.format(now)}`;
    log(`Formatter activo: ${label}`);
  };

  $('btn-fmt-date').addEventListener('click', () =>
    showFormatter('getDateFormatter()', (dt) => dt.getDateFormatter()));

  $('btn-fmt-time').addEventListener('click', () =>
    showFormatter('getTimeFormatter()', (dt) => dt.getTimeFormatter()));

  $('btn-fmt-datetime').addEventListener('click', () =>
    showFormatter('getDateTimeFormatter()', (dt) => dt.getDateTimeFormatter()));

  $('btn-fmt-date-weekday').addEventListener('click', () =>
    showFormatter('getDateFormatter({ weekday:"long", month:"long" })',
      (dt) => dt.getDateFormatter({ weekday: 'long', month: 'long' })));

  // ---------- Valores ----------
  const showValue = (label, fn) => {
    const val = safe(label, () => fn(_HELPERS_.dateTime()));
    if (val === null || val === undefined) return;
    outValue.textContent =
      typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
    log(`${label} → ${typeof val === 'object' ? 'object' : val}`);
  };

  $('btn-current-date').addEventListener('click', () =>
    showValue('currentDate()', (dt) => dt.currentDate()));

  $('btn-current-time').addEventListener('click', () =>
    showValue('currentTime()', (dt) => dt.currentTime()));

  $('btn-current-datetime').addEventListener('click', () =>
    showValue('currentDateTime()', (dt) => dt.currentDateTime()));

  $('btn-format-iso').addEventListener('click', () =>
    showValue("format('2026-12-25T09:30:00Z')", (dt) => dt.format('2026-12-25T09:30:00Z')));

  $('btn-parts').addEventListener('click', () =>
    showValue('parts()', (dt) => dt.parts()));

  // ---------- updateDateTime + reloj ----------
  $('btn-update-once').addEventListener('click', () => {
    const ret = safe("updateDateTime('#live-clock')", () =>
      _HELPERS_.dateTime().updateDateTime('#live-clock'));
    if (ret) log(`DOM actualizado: "${liveClock.textContent}"`);
  });

  $('btn-update-compat').addEventListener('click', () => {
    const ret = safe('_HELPERS_.updateDateTime() [retro-compat]', () =>
      _HELPERS_.updateDateTime('#live-clock'));
    if (ret) log(`Retro-compat OK: "${liveClock.textContent}"`, 'ok');
  });

  $('btn-clock-start').addEventListener('click', () => {
    if (clockInterval) { log('Reloj ya está corriendo', 'warn'); return; }
    const tick = () => _HELPERS_.dateTime().updateDateTime('#live-clock');
    tick();
    clockInterval = setInterval(tick, 1000);
    log('⏱️ Reloj iniciado');
  });

  $('btn-clock-stop').addEventListener('click', () => {
    if (!clockInterval) { log('Reloj no está corriendo', 'warn'); return; }
    clearInterval(clockInterval);
    clockInterval = null;
    log('⏹️ Reloj detenido', 'warn');
  });

  $('btn-clear-log').addEventListener('click', () => {
    logEl.innerHTML = '';
    log('🧼 Log limpiado');
  });

  // ---------- Arranque ----------
  refreshConfigView();
  log('👋 Demo listo. Cada botón ejecuta un método real.');
  log(`Intl soportado: ${typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function'}`);
})();