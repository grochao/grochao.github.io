/* =============================================================================
        * MdlMsgBox — Modal message box global (Vanilla JS, ES2023+)
        * v1.3 — onAccept con override + async handlers
        * ============================================================================= */
class MdlMsgBox {
  static VERSION = '1.3.0';
  static #stack = [];
  static #uid = 0;
  static #stylesInjected = false;

  /* -------- SVG Icons -------- */
  static #ICONS = {
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5"/><line x1="12" y1="16.5" x2="12" y2="11.5"/>
      <circle cx="12" cy="8" r="0.7" fill="currentColor" stroke="none"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    question: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none"/></svg>`
  };

  /* -------- CSS (solo tema claro) -------- */
  static #CSS = `
  .mdl-msgbox-root{
    --mdl-msgbox-bg:#fff;--mdl-msgbox-fg:#0f172a;--mdl-msgbox-muted:#64748b;
    --mdl-msgbox-border:#e2e8f0;--mdl-msgbox-radius:14px;--mdl-msgbox-width:400px;
    --mdl-msgbox-accent:#2563eb;--mdl-msgbox-accent-soft:#dbeafe;
    --mdl-msgbox-backdrop:rgba(15,23,42,.55);
    --mdl-msgbox-shadow:0 25px 50px -12px rgba(15,23,42,.35);
    position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:16px;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    font-size:15px;line-height:1.5;color:var(--mdl-msgbox-fg);-webkit-font-smoothing:antialiased;
  }
  .mdl-msgbox-root[data-type="info"]    {--mdl-msgbox-accent:#2563eb;--mdl-msgbox-accent-soft:#dbeafe}
  .mdl-msgbox-root[data-type="success"] {--mdl-msgbox-accent:#16a34a;--mdl-msgbox-accent-soft:#dcfce7}
  .mdl-msgbox-root[data-type="warning"] {--mdl-msgbox-accent:#d97706;--mdl-msgbox-accent-soft:#fef3c7}
  .mdl-msgbox-root[data-type="error"]   {--mdl-msgbox-accent:#dc2626;--mdl-msgbox-accent-soft:#fee2e2}
  .mdl-msgbox-root[data-type="question"]{--mdl-msgbox-accent:#7c3aed;--mdl-msgbox-accent-soft:#ede9fe}

  .mdl-msgbox__backdrop{position:absolute;inset:0;background:var(--mdl-msgbox-backdrop);
    backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;transition:opacity .2s ease}
  .mdl-msgbox-root.is-open .mdl-msgbox__backdrop{opacity:1}
  .mdl-msgbox-root.is-closing .mdl-msgbox__backdrop{opacity:0}

  .mdl-msgbox{position:relative;width:min(100%,var(--mdl-msgbox-width));
    max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);
    display:flex;flex-direction:column;background:var(--mdl-msgbox-bg);
    border-radius:var(--mdl-msgbox-radius);box-shadow:var(--mdl-msgbox-shadow);
    overflow:hidden;transform:translateY(10px) scale(.97);opacity:0;
    transition:transform .22s cubic-bezier(.2,.8,.2,1),opacity .22s ease;outline:none}
  .mdl-msgbox-root.is-open .mdl-msgbox{transform:translateY(0) scale(1);opacity:1}
  .mdl-msgbox-root.is-closing .mdl-msgbox{transform:translateY(6px) scale(.98);opacity:0}

  /* HEADER — solo botón cerrar, alineado a la izquierda */
  .mdl-msgbox__header{display:flex;justify-content:flex-start;padding:12px 16px 0}
  .mdl-msgbox__close{all:unset;display:grid;place-items:center;width:32px;height:32px;
    border-radius:8px;color:var(--mdl-msgbox-muted);cursor:pointer;flex-shrink:0;
    transition:background .15s,color .15s}
  .mdl-msgbox__close:hover{background:rgba(0,0,0,.06);color:var(--mdl-msgbox-fg)}
  .mdl-msgbox__close:focus-visible{outline:2px solid var(--mdl-msgbox-accent);outline-offset:2px}
  .mdl-msgbox__close svg{width:18px;height:18px}

  /* BODY — icono → título → contenido */
  .mdl-msgbox__body{display:flex;flex-direction:column;align-items:center;gap:14px;
    padding:8px 20px 8px;overflow-y:auto;text-align:center;flex:1 1 auto;min-height:0}

  .mdl-msgbox__icon{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;
    color:var(--mdl-msgbox-accent);background:var(--mdl-msgbox-accent-soft);flex-shrink:0;
    will-change:transform}
  .mdl-msgbox__icon svg{width:34px;height:34px;display:block}
  .mdl-msgbox__icon:empty{display:none}

  /* TITLE — mismo color que el icono */
  .mdl-msgbox__title{margin:0;width:100%;text-align:center;
    font-size:1.125rem;font-weight:600;line-height:1.35;
    color:var(--mdl-msgbox-accent)}
  .mdl-msgbox__title:empty{display:none}

  .mdl-msgbox__content{width:100%;color:var(--mdl-msgbox-muted);font-size:.9375rem;
    line-height:1.55;text-align:center}
  .mdl-msgbox__content:empty{display:none}
  .mdl-msgbox__content img{max-width:100%;height:auto;border-radius:8px;display:block;margin:0 auto}
  .mdl-msgbox__content>form,.mdl-msgbox__content>ul,.mdl-msgbox__content>ol,
  .mdl-msgbox__content>p,.mdl-msgbox__content>.mdl-form{text-align:left}

  .mdl-msgbox__footer{display:flex;justify-content:flex-end;gap:8px;
    padding:12px 20px 20px;flex-wrap:wrap}
  .mdl-msgbox__button{all:unset;display:inline-flex;align-items:center;justify-content:center;
    min-height:38px;padding:0 18px;border-radius:9px;font-size:.875rem;font-weight:600;
    cursor:pointer;text-align:center;white-space:nowrap;
    transition:background .15s,color .15s,transform .1s,filter .15s}
  .mdl-msgbox__button:active{transform:translateY(1px)}
  .mdl-msgbox__button:focus-visible{outline:2px solid var(--mdl-msgbox-accent);outline-offset:2px}
  .mdl-msgbox__button--primary{background:var(--mdl-msgbox-accent);color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.08)}
  .mdl-msgbox__button--primary:hover{filter:brightness(1.07)}
  .mdl-msgbox__button--secondary{background:rgba(0,0,0,.06);color:var(--mdl-msgbox-fg)}
  .mdl-msgbox__button--secondary:hover{background:rgba(0,0,0,.1)}
  .mdl-msgbox__button--ghost{background:transparent;color:var(--mdl-msgbox-muted);
    border:1px solid var(--mdl-msgbox-border)}
  .mdl-msgbox__button--ghost:hover{background:rgba(0,0,0,.04);color:var(--mdl-msgbox-fg)}
  .mdl-msgbox__button--danger{background:#dc2626;color:#fff}
  .mdl-msgbox__button--danger:hover{filter:brightness(1.07)}
  .mdl-msgbox__button--success{background:#16a34a;color:#fff}
  .mdl-msgbox__button--success:hover{filter:brightness(1.07)}

  @media (prefers-reduced-motion:reduce){
    .mdl-msgbox__backdrop,.mdl-msgbox{transition:none!important}
  }
  @media (max-width:480px){
    .mdl-msgbox__footer{flex-direction:column-reverse}
    .mdl-msgbox__button{width:100%}
  }

  /* -------- Animación de iconos -------- */
  @keyframes mdl-icon-pop{
    0%{transform:scale(0);opacity:0} 55%{transform:scale(1.15);opacity:1} 100%{transform:scale(1);opacity:1}
  }
  @keyframes mdl-icon-pop-bounce{
    0%{transform:scale(0) rotate(-15deg);opacity:0}
    50%{transform:scale(1.2) rotate(8deg);opacity:1}
    75%{transform:scale(.95) rotate(-3deg)}
    100%{transform:scale(1) rotate(0)}
  }
  @keyframes mdl-icon-shake{
    0%{transform:scale(0);opacity:0} 30%{transform:scale(1.1);opacity:1}
    40%{transform:scale(1) translateX(-7px)} 50%{transform:scale(1) translateX(7px)}
    60%{transform:scale(1) translateX(-5px)} 70%{transform:scale(1) translateX(5px)}
    80%{transform:scale(1) translateX(-3px)} 90%{transform:scale(1) translateX(3px)}
    100%{transform:scale(1) translateX(0)}
  }
  @keyframes mdl-icon-pulse{
    0%{transform:scale(0);opacity:0} 40%{transform:scale(1.1);opacity:1}
    60%{transform:scale(1)} 70%{transform:scale(1.06)} 80%{transform:scale(1)}
    90%{transform:scale(1.04)} 100%{transform:scale(1)}
  }
  @keyframes mdl-icon-tilt{
    0%{transform:scale(0) rotate(-20deg);opacity:0}
    55%{transform:scale(1.15) rotate(10deg);opacity:1}
    75%{transform:scale(.98) rotate(-4deg)}
    100%{transform:scale(1) rotate(0)}
  }
  .mdl-msgbox-root.is-open .mdl-msgbox__icon{
    animation:mdl-icon-pop .45s cubic-bezier(.2,1.3,.4,1) both;
  }
  .mdl-msgbox-root[data-type="success"].is-open .mdl-msgbox__icon{
    animation:mdl-icon-pop-bounce .6s cubic-bezier(.2,1.3,.4,1) both;
  }
  .mdl-msgbox-root[data-type="error"].is-open .mdl-msgbox__icon{
    animation:mdl-icon-shake .65s cubic-bezier(.36,.07,.19,.97) both;
  }
  .mdl-msgbox-root[data-type="warning"].is-open .mdl-msgbox__icon{
    animation:mdl-icon-pulse .7s ease both;
  }
  .mdl-msgbox-root[data-type="question"].is-open .mdl-msgbox__icon{
    animation:mdl-icon-tilt .6s cubic-bezier(.2,1.3,.4,1) both;
  }
  @media (prefers-reduced-motion:reduce){
    .mdl-msgbox-root.is-open .mdl-msgbox__icon{animation:none!important}
  }
  `;

  /* -------- Private fields -------- */
  #id; #opts; #resolve; #promise;
  #rootEl = null; #dialogEl = null;
  #previouslyFocused = null; #prevOverflow = null;
  #keydownHandler = null; #closed = false;

  constructor(options = {}) {
    this.#opts = MdlMsgBox.#normalize(options);
    this.#id = `mdl-msgbox-${++MdlMsgBox.#uid}`;
    this.#promise = new Promise((resolve) => { this.#resolve = resolve; });
  }

  get id() { return this.#id; }
  get promise() { return this.#promise; }
  get element() { return this.#rootEl; }
  get options() { return { ...this.#opts }; }
  get isOpen() { return !!this.#rootEl && !this.#closed; }

  /* ============================================================
   *  OPEN / CLOSE
   * ============================================================ */

  open() {
    if (this.#rootEl) return this.#promise;
    MdlMsgBox.#injectStyles();

    this.#previouslyFocused = document.activeElement;
    this.#buildDOM();
    document.body.appendChild(this.#rootEl);

    const html = document.documentElement;
    if (MdlMsgBox.#stack.length === 0) {
      this.#prevOverflow = html.style.overflow;
      html.style.overflow = 'hidden';
    }
    MdlMsgBox.#stack.push(this);

    void this.#rootEl.offsetWidth;
    this.#rootEl.classList.add('is-open');

    this.#applyInitialFocus();

    this.#keydownHandler = (e) => this.#onKeyDown(e);
    document.addEventListener('keydown', this.#keydownHandler, true);
    this.#dialogEl.addEventListener('keydown', (e) => this.#trapFocus(e));
    this.#bindBackdropClose();

    if (typeof this.#opts.onOpen === 'function') {
      try { this.#opts.onOpen(this.#dialogEl, this); }
      catch (err) { console.error('[MdlMsgBox] onOpen error:', err); }
    }
    return this.#promise;
  }

  close(value = null, reason = 'programmatic') {
    if (this.#closed || !this.#rootEl) return;
    this.#closed = true;

    const result = {
      isConfirmed: reason === 'button',
      isDismissed: reason !== 'button',
      value, reason
    };

    const idx = MdlMsgBox.#stack.indexOf(this);
    if (idx !== -1) MdlMsgBox.#stack.splice(idx, 1);
    if (MdlMsgBox.#stack.length === 0) {
      document.documentElement.style.overflow = this.#prevOverflow ?? '';
    }
    if (this.#keydownHandler) {
      document.removeEventListener('keydown', this.#keydownHandler, true);
    }

    this.#rootEl.classList.remove('is-open');
    this.#rootEl.classList.add('is-closing');

    const finish = () => {
      this.#rootEl?.remove();
      if (this.#previouslyFocused?.focus) {
        try { this.#previouslyFocused.focus({ preventScroll: true }); } catch (_) { }
      }
      if (typeof this.#opts.onClose === 'function') {
        try { this.#opts.onClose(result); }
        catch (err) { console.error('[MdlMsgBox] onClose error:', err); }
      }
      this.#resolve(result);
    };
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    reduce ? finish() : setTimeout(finish, 200);
  }

  /* ============================================================
   *  BUILD
   * ============================================================ */

  #buildDOM() {
    const root = document.createElement('div');
    root.className = `mdl-msgbox-root ${this.#opts.className}`.trim();
    root.dataset.type = this.#opts.type;
    root.id = this.#id;
    if (this.#opts.width) root.style.setProperty('--mdl-msgbox-width', this.#opts.width);

    const backdrop = document.createElement('div');
    backdrop.className = 'mdl-msgbox__backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    const dialog = document.createElement('div');
    dialog.className = 'mdl-msgbox';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.tabIndex = -1;

    const headerEl = this.#buildHeader();
    const bodyEl = this.#buildBody();
    const footerEl = this.#buildFooter();

    const titleEl = bodyEl.querySelector('.mdl-msgbox__title');
    if (titleEl && this.#opts.title) {
      titleEl.id = `${this.#id}-title`;
      dialog.setAttribute('aria-labelledby', titleEl.id);
    } else if (this.#opts.ariaLabel) {
      dialog.setAttribute('aria-label', this.#opts.ariaLabel);
    } else {
      dialog.setAttribute('aria-label', this.#opts.title || 'Diálogo');
    }

    dialog.append(
      headerEl ?? document.createComment(''),
      bodyEl,
      footerEl
    );
    root.append(backdrop, dialog);
    this.#rootEl = root;
    this.#dialogEl = dialog;
  }

  /** HEADER — solo botón de cierre, alineado a la izquierda. */
  #buildHeader() {
    if (!this.#opts.showCloseButton) return null;
    const header = document.createElement('header');
    header.className = 'mdl-msgbox__header';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mdl-msgbox__close';
    btn.setAttribute('aria-label', 'Cerrar');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    btn.addEventListener('click', () => this.close(null, 'close'));
    header.append(btn);

    return header;
  }

  /** BODY — icono → título → contenido. */
  #buildBody() {
    const body = document.createElement('div');
    body.className = 'mdl-msgbox__body';

    const iconEl = document.createElement('div');
    iconEl.className = 'mdl-msgbox__icon';
    const iconNode = this.#resolveIcon(this.#opts.icon ?? this.#opts.type);
    if (iconNode) iconEl.append(iconNode);

    const titleEl = document.createElement('h2');
    titleEl.className = 'mdl-msgbox__title';
    titleEl.textContent = this.#opts.title || '';

    const contentEl = this.#resolveContent(this.#opts.content);

    body.append(iconEl, titleEl, contentEl);
    return body;
  }

  #resolveButtons() {
    const explicit = this.#opts.buttons;
    if (Array.isArray(explicit) && explicit.length) {
      return explicit.map((btn, i) => {
        if (btn.text) return { ...btn };
        let text = 'Aceptar';
        if (btn.accept === true || btn.value === true) text = this.#opts.acceptText ?? 'Aceptar';
        else if (btn.cancel === true || btn.value === false) text = this.#opts.cancelText ?? 'Cancelar';
        else if (btn.deny === true) text = this.#opts.denyText ?? 'Rechazar';
        else if (btn.variant === 'primary') text = this.#opts.acceptText ?? 'Aceptar';
        else if (btn.variant === 'ghost') text = this.#opts.cancelText ?? 'Cancelar';
        else if (i === explicit.length - 1) text = this.#opts.acceptText ?? 'Aceptar';
        else text = this.#opts.cancelText ?? 'Cancelar';
        return { ...btn, text };
      });
    }

    const isConfirm = this.#opts.type === 'question';
    if (isConfirm) {
      return [
        { text: this.#opts.cancelText ?? 'Cancelar', value: false, variant: 'ghost', cancel: true },
        { text: this.#opts.acceptText ?? 'Aceptar', value: true, variant: 'primary', accept: true, autofocus: true }
      ];
    }
    return [
      { text: this.#opts.acceptText ?? 'Aceptar', value: true, variant: 'primary', accept: true, autofocus: true }
    ];
  }

  /* ============================================================
   *  FOOTER — v1.3 con onAccept override + async
   * ============================================================ */
  #buildFooter() {
    const footer = document.createElement('footer');
    footer.className = 'mdl-msgbox__footer';

    const buttons = this.#resolveButtons();
    if (buttons.length === 0) { footer.hidden = true; return footer; }

    // ¿Cuál botón es "aceptar"?
    let acceptIdx = buttons.findIndex(b => b.accept === true);
    if (acceptIdx === -1) acceptIdx = buttons.findIndex(b => b.value === true);
    if (acceptIdx === -1) acceptIdx = buttons.findIndex(b => b.variant === 'primary');
    if (acceptIdx === -1) acceptIdx = buttons.length - 1;

    buttons.forEach((cfg, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `mdl-msgbox__button mdl-msgbox__button--${cfg.variant ?? 'secondary'}`;
      btn.textContent = cfg.text ?? 'Aceptar';
      if (cfg.autofocus) btn.dataset.autofocus = 'true';
      if (cfg.value !== undefined) btn.dataset.value = String(cfg.value);
      if (cfg.ariaLabel) btn.setAttribute('aria-label', cfg.ariaLabel);

      // Listener async para soportar onAccept / onClick / onAction asíncronos
      btn.addEventListener('click', async (e) => {
        let overrideValue;
        let hasOverride = false;

        // 1) onClick por botón — solo veto (false)
        if (typeof cfg.onClick === 'function') {
          let r;
          try { r = await Promise.resolve(cfg.onClick(this, e)); }
          catch (err) { console.error('[MdlMsgBox] onClick error:', err); return; }
          if (r === false) return;
        }

        // 2) onAccept — veto (false) u override (cualquier valor != undefined)
        if (idx === acceptIdx && typeof this.#opts.onAccept === 'function') {
          const bodyEl = this.#dialogEl?.querySelector('.mdl-msgbox__body') ?? null;
          let r;
          try { r = await Promise.resolve(this.#opts.onAccept(this, bodyEl, cfg, e)); }
          catch (err) { console.error('[MdlMsgBox] onAccept error:', err); return; }

          if (r === false) return;                 // veto
          if (r !== undefined) {                   // override
            overrideValue = r;
            hasOverride = true;
          }
        }

        // 3) onAction genérico — solo veto (false)
        if (typeof this.#opts.onAction === 'function') {
          let r;
          try { r = await Promise.resolve(this.#opts.onAction(cfg.value, cfg, this)); }
          catch (err) { console.error('[MdlMsgBox] onAction error:', err); return; }
          if (r === false) return;
        }

        // 4) Cierre — respeta override si existe
        if (cfg.closes !== false && this.#opts.closeOnButton) {
          const finalValue = hasOverride ? overrideValue : (cfg.value ?? null);
          this.close(finalValue, 'button');
        }
      });

      footer.append(btn);
    });
    return footer;
  }

  /* ============================================================
   *  RESOLVERS
   * ============================================================ */

  #resolveIcon(icon) {
    if (!icon) return null;
    if (icon instanceof Node) return icon;
    if (typeof icon === 'string') {
      const trimmed = icon.trim();
      if (MdlMsgBox.#ICONS[trimmed]) return MdlMsgBox.#svgFromString(MdlMsgBox.#ICONS[trimmed]);
      if (trimmed.startsWith('<')) return MdlMsgBox.#svgFromString(trimmed);
    }
    return null;
  }

  #resolveContent(content) {
    const wrap = document.createElement('div');
    wrap.className = 'mdl-msgbox__content';

    let resolved = content;
    if (typeof content === 'function') {
      try { resolved = content(this); }
      catch (err) { console.error('[MdlMsgBox] content() error:', err); resolved = ''; }
    }
    if (resolved == null) return wrap;
    if (resolved instanceof Node) wrap.append(resolved);
    else wrap.textContent = String(resolved);
    return wrap;
  }

  static #svgFromString(str) {
    const tpl = document.createElement('template');
    tpl.innerHTML = str.trim();
    return tpl.content.firstElementChild;
  }

  /* ============================================================
   *  FOCUS & EVENTS
   * ============================================================ */

  #getFocusable() {
    const sel = ['a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'].join(',');
    return Array.from(this.#dialogEl.querySelectorAll(sel))
      .filter((el) => el.offsetParent !== null || el === document.activeElement);
  }

  #applyInitialFocus() {
    const mode = this.#opts.autofocus;
    if (mode === 'none') { this.#dialogEl.focus({ preventScroll: true }); return; }
    const auto = this.#dialogEl.querySelector('[data-autofocus="true"]');
    if (auto) { auto.focus({ preventScroll: true }); return; }
    if (typeof mode === 'string' && mode !== 'first') {
      const el = this.#dialogEl.querySelector(mode);
      if (el) { el.focus({ preventScroll: true }); return; }
    }
    if (typeof mode === 'number') {
      const list = this.#getFocusable();
      (list[mode] ?? list[0])?.focus({ preventScroll: true });
      return;
    }
    this.#dialogEl.focus({ preventScroll: true });
  }

  #trapFocus(e) {
    if (e.key !== 'Tab') return;
    const list = this.#getFocusable();
    if (list.length === 0) { e.preventDefault(); this.#dialogEl.focus(); return; }
    const first = list[0], last = list[list.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === this.#dialogEl)) {
      e.preventDefault(); last.focus({ preventScroll: true });
    } else if (!e.shiftKey && active === last) {
      e.preventDefault(); first.focus({ preventScroll: true });
    }
  }

  #onKeyDown(e) {
    if (MdlMsgBox.#stack[MdlMsgBox.#stack.length - 1] !== this) return;
    if (e.key === 'Escape' && this.#opts.closeOnEscape) {
      e.preventDefault();
      this.close(null, 'escape');
    }
  }

  #bindBackdropClose() {
    if (!this.#opts.closeOnBackdrop) return;
    const backdrop = this.#rootEl.querySelector('.mdl-msgbox__backdrop');
    let downTarget = null;
    backdrop.addEventListener('mousedown', (e) => { downTarget = e.target; });
    backdrop.addEventListener('mouseup', (e) => {
      if (downTarget === backdrop && e.target === backdrop) this.close(null, 'backdrop');
      downTarget = null;
    });
    backdrop.addEventListener('touchstart', (e) => { downTarget = e.target; }, { passive: true });
    backdrop.addEventListener('touchend', (e) => {
      if (downTarget === backdrop && e.target === backdrop) this.close(null, 'backdrop');
      downTarget = null;
    });
  }

  /* ============================================================
   *  NORMALIZATION & STYLES
   * ============================================================ */

  static #normalize(raw) {
    let o = raw;
    if (o == null) o = {};
    if (typeof o === 'string' || typeof o === 'function' || o instanceof Node) o = { content: o };
    return {
      type: o.type ?? 'info',
      title: o.title ?? '',
      content: o.content ?? '',
      icon: o.icon === undefined ? null : o.icon,
      buttons: Array.isArray(o.buttons) ? o.buttons.map((b) => ({ ...b })) : null,
      showCloseButton: o.showCloseButton !== false,
      closeOnBackdrop: o.closeOnBackdrop !== false,
      closeOnEscape: o.closeOnEscape !== false,
      closeOnButton: o.closeOnButton !== false,
      width: o.width ?? null,
      className: o.className ?? '',
      ariaLabel: o.ariaLabel ?? null,
      autofocus: o.autofocus ?? 'first',
      acceptText: o.acceptText ?? null,
      cancelText: o.cancelText ?? null,
      denyText: o.denyText ?? null,
      onOpen: typeof o.onOpen === 'function' ? o.onOpen : null,
      onClose: typeof o.onClose === 'function' ? o.onClose : null,
      onAction: typeof o.onAction === 'function' ? o.onAction : null,
      onAccept: typeof o.onAccept === 'function' ? o.onAccept : null
    };
  }

  static #merge(raw, base) {
    let o = raw;
    if (o == null) o = {};
    if (typeof o === 'string' || typeof o === 'function' || o instanceof Node) o = { content: o };
    return { ...base, ...o };
  }

  static #injectStyles() {
    if (MdlMsgBox.#stylesInjected) return;
    if (typeof document === 'undefined') return;
    if (document.getElementById('mdl-msgbox-styles')) {
      MdlMsgBox.#stylesInjected = true; return;
    }
    const style = document.createElement('style');
    style.id = 'mdl-msgbox-styles';
    style.textContent = MdlMsgBox.#CSS;
    document.head.appendChild(style);
    MdlMsgBox.#stylesInjected = true;
  }

  /* ============================================================
   *  STATIC FACTORY
   * ============================================================ */

  static open(options) { return new MdlMsgBox(options).open(); }

  static info(options) { return new MdlMsgBox(MdlMsgBox.#merge(options, { type: 'info' })).open(); }
  static success(options) { return new MdlMsgBox(MdlMsgBox.#merge(options, { type: 'success' })).open(); }
  static warning(options) { return new MdlMsgBox(MdlMsgBox.#merge(options, { type: 'warning' })).open(); }
  static error(options) { return new MdlMsgBox(MdlMsgBox.#merge(options, { type: 'error' })).open(); }
  static alert(options) { return MdlMsgBox.info(options); }

  static question(options) { return new MdlMsgBox(MdlMsgBox.#merge(options, { type: 'question' })).open(); }
  static confirm(options) { return MdlMsgBox.question(options); }
}


/* =============================================================================
 *  Exposición global
 * ============================================================================= */
if (typeof window !== 'undefined') {
  window.MdlMsgBox = MdlMsgBox;
  window.mdl_msgbox = {
    alert: (o) => MdlMsgBox.alert(o),
    info: (o) => MdlMsgBox.info(o),
    success: (o) => MdlMsgBox.success(o),
    warning: (o) => MdlMsgBox.warning(o),
    error: (o) => MdlMsgBox.error(o),
    question: (o) => MdlMsgBox.question(o),
    confirm: (o) => MdlMsgBox.confirm(o),
    open: (o) => MdlMsgBox.open(o),
    VERSION: MdlMsgBox.VERSION
  };
}
