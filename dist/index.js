var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn2, res) => function __init() {
  return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key) && key !== except)
        __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/api.js
async function fetchWithTimeout(url, options = {}, timeoutMs = 8e3) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs / 1e3}s`);
    }
    throw error;
  }
}
function showToast(message, isError = false) {
  let toast = document.querySelector("#pod-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "pod-toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      border-radius: 24px;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.style.backgroundColor = isError ? "#e53935" : "#2e7d32";
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
  }, 4e3);
}
var init_api = __esm({
  "src/api.js"() {
  }
});

// node_modules/idb-keyval/dist/index.js
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  let dbp;
  const getDB = () => {
    if (dbp)
      return dbp;
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    dbp = promisifyRequest(request);
    dbp.then((db) => {
      db.onclose = () => dbp = void 0;
    }, () => {
      dbp = void 0;
    });
    return dbp;
  };
  return (txMode, callback) => getDB().then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
var defaultGetStoreFunc;
var init_dist = __esm({
  "node_modules/idb-keyval/dist/index.js"() {
  }
});

// src/storage.js
var storage_exports = {};
__export(storage_exports, {
  StorageKeys: () => StorageKeys,
  addCompleteEpisode: () => addCompleteEpisode,
  getCompleteEpisodes: () => getCompleteEpisodes,
  getEpisodeTime: () => getEpisodeTime,
  getInProgressEpisodes: () => getInProgressEpisodes,
  getPlaybackRate: () => getPlaybackRate,
  getSubscription: () => getSubscription,
  removeInProgressEpisode: () => removeInProgressEpisode,
  setEpisodeTime: () => setEpisodeTime,
  setInProgressEpisodes: () => setInProgressEpisodes,
  setPlaybackRate: () => setPlaybackRate,
  setSubscription: () => setSubscription
});
async function getCompleteEpisodes() {
  return await get(StorageKeys.COMPLETE_EPISODES) || [];
}
async function addCompleteEpisode(episode) {
  const current = await getCompleteEpisodes();
  if (!current.some((ep) => ep.title === episode.title)) {
    await set(StorageKeys.COMPLETE_EPISODES, [...current, episode]);
  }
}
async function getInProgressEpisodes() {
  return await get(StorageKeys.IN_PROGRESS_EPISODES) ?? [];
}
async function setInProgressEpisodes(episodes) {
  await set(StorageKeys.IN_PROGRESS_EPISODES, episodes);
}
async function removeInProgressEpisode(episodeIdentifier) {
  const current = await getInProgressEpisodes();
  const updated = current.filter(
    (ep) => ep.id !== episodeIdentifier && ep.title !== episodeIdentifier
  );
  await setInProgressEpisodes(updated);
  return updated;
}
async function getEpisodeTime(title) {
  return await get(StorageKeys.episodeTime(title)) || 0;
}
async function setEpisodeTime(title, time) {
  await set(StorageKeys.episodeTime(title), time);
}
async function getPlaybackRate() {
  return await get(StorageKeys.PLAYBACK_RATE) || 1;
}
async function setPlaybackRate(rate) {
  await set(StorageKeys.PLAYBACK_RATE, rate);
}
async function getSubscription() {
  return await get(StorageKeys.SUBSCRIPTION) || null;
}
async function setSubscription(subscriptionData) {
  await set(StorageKeys.SUBSCRIPTION, subscriptionData);
}
var StorageKeys;
var init_storage = __esm({
  "src/storage.js"() {
    init_dist();
    StorageKeys = {
      COMPLETE_EPISODES: "complete-episodes",
      IN_PROGRESS_EPISODES: "in-progress-episodes",
      PLAYBACK_RATE: "playback-rate",
      SUBSCRIPTION: "pod-surfer/subscription",
      episodeTime: (title) => `episode-${title}-time`
    };
  }
});

// node_modules/@lit/reactive-element/css-tag.js
var t, e, s, o, n, r, i, S, c;
var init_css_tag = __esm({
  "node_modules/@lit/reactive-element/css-tag.js"() {
    t = globalThis;
    e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
    s = Symbol();
    o = /* @__PURE__ */ new WeakMap();
    n = class {
      constructor(t6, e7, o8) {
        if (this._$cssResult$ = true, o8 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t6, this.t = e7;
      }
      get styleSheet() {
        let t6 = this.o;
        const s7 = this.t;
        if (e && void 0 === t6) {
          const e7 = void 0 !== s7 && 1 === s7.length;
          e7 && (t6 = o.get(s7)), void 0 === t6 && ((this.o = t6 = new CSSStyleSheet()).replaceSync(this.cssText), e7 && o.set(s7, t6));
        }
        return t6;
      }
      toString() {
        return this.cssText;
      }
    };
    r = (t6) => new n("string" == typeof t6 ? t6 : t6 + "", void 0, s);
    i = (t6, ...e7) => {
      const o8 = 1 === t6.length ? t6[0] : e7.reduce((e8, s7, o9) => e8 + ((t7) => {
        if (true === t7._$cssResult$) return t7.cssText;
        if ("number" == typeof t7) return t7;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t7 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(s7) + t6[o9 + 1], t6[0]);
      return new n(o8, t6, s);
    };
    S = (s7, o8) => {
      if (e) s7.adoptedStyleSheets = o8.map((t6) => t6 instanceof CSSStyleSheet ? t6 : t6.styleSheet);
      else for (const e7 of o8) {
        const o9 = document.createElement("style"), n10 = t.litNonce;
        void 0 !== n10 && o9.setAttribute("nonce", n10), o9.textContent = e7.cssText, s7.appendChild(o9);
      }
    };
    c = e ? (t6) => t6 : (t6) => t6 instanceof CSSStyleSheet ? ((t7) => {
      let e7 = "";
      for (const s7 of t7.cssRules) e7 += s7.cssText;
      return r(e7);
    })(t6) : t6;
  }
});

// node_modules/@lit/reactive-element/reactive-element.js
var i2, e2, h, r2, o2, n2, a, c2, l, p, d, u, f, b, y;
var init_reactive_element = __esm({
  "node_modules/@lit/reactive-element/reactive-element.js"() {
    init_css_tag();
    init_css_tag();
    ({ is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object);
    a = globalThis;
    c2 = a.trustedTypes;
    l = c2 ? c2.emptyScript : "";
    p = a.reactiveElementPolyfillSupport;
    d = (t6, s7) => t6;
    u = { toAttribute(t6, s7) {
      switch (s7) {
        case Boolean:
          t6 = t6 ? l : null;
          break;
        case Object:
        case Array:
          t6 = null == t6 ? t6 : JSON.stringify(t6);
      }
      return t6;
    }, fromAttribute(t6, s7) {
      let i8 = t6;
      switch (s7) {
        case Boolean:
          i8 = null !== t6;
          break;
        case Number:
          i8 = null === t6 ? null : Number(t6);
          break;
        case Object:
        case Array:
          try {
            i8 = JSON.parse(t6);
          } catch (t7) {
            i8 = null;
          }
      }
      return i8;
    } };
    f = (t6, s7) => !i2(t6, s7);
    b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
    Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
    y = class extends HTMLElement {
      static addInitializer(t6) {
        this._$Ei(), (this.l ??= []).push(t6);
      }
      static get observedAttributes() {
        return this.finalize(), this._$Eh && [...this._$Eh.keys()];
      }
      static createProperty(t6, s7 = b) {
        if (s7.state && (s7.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t6) && ((s7 = Object.create(s7)).wrapped = true), this.elementProperties.set(t6, s7), !s7.noAccessor) {
          const i8 = Symbol(), h7 = this.getPropertyDescriptor(t6, i8, s7);
          void 0 !== h7 && e2(this.prototype, t6, h7);
        }
      }
      static getPropertyDescriptor(t6, s7, i8) {
        const { get: e7, set: r7 } = h(this.prototype, t6) ?? { get() {
          return this[s7];
        }, set(t7) {
          this[s7] = t7;
        } };
        return { get: e7, set(s8) {
          const h7 = e7?.call(this);
          r7?.call(this, s8), this.requestUpdate(t6, h7, i8);
        }, configurable: true, enumerable: true };
      }
      static getPropertyOptions(t6) {
        return this.elementProperties.get(t6) ?? b;
      }
      static _$Ei() {
        if (this.hasOwnProperty(d("elementProperties"))) return;
        const t6 = n2(this);
        t6.finalize(), void 0 !== t6.l && (this.l = [...t6.l]), this.elementProperties = new Map(t6.elementProperties);
      }
      static finalize() {
        if (this.hasOwnProperty(d("finalized"))) return;
        if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
          const t7 = this.properties, s7 = [...r2(t7), ...o2(t7)];
          for (const i8 of s7) this.createProperty(i8, t7[i8]);
        }
        const t6 = this[Symbol.metadata];
        if (null !== t6) {
          const s7 = litPropertyMetadata.get(t6);
          if (void 0 !== s7) for (const [t7, i8] of s7) this.elementProperties.set(t7, i8);
        }
        this._$Eh = /* @__PURE__ */ new Map();
        for (const [t7, s7] of this.elementProperties) {
          const i8 = this._$Eu(t7, s7);
          void 0 !== i8 && this._$Eh.set(i8, t7);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
      }
      static finalizeStyles(s7) {
        const i8 = [];
        if (Array.isArray(s7)) {
          const e7 = new Set(s7.flat(1 / 0).reverse());
          for (const s8 of e7) i8.unshift(c(s8));
        } else void 0 !== s7 && i8.push(c(s7));
        return i8;
      }
      static _$Eu(t6, s7) {
        const i8 = s7.attribute;
        return false === i8 ? void 0 : "string" == typeof i8 ? i8 : "string" == typeof t6 ? t6.toLowerCase() : void 0;
      }
      constructor() {
        super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
      }
      _$Ev() {
        this._$ES = new Promise((t6) => this.enableUpdating = t6), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t6) => t6(this));
      }
      addController(t6) {
        (this._$EO ??= /* @__PURE__ */ new Set()).add(t6), void 0 !== this.renderRoot && this.isConnected && t6.hostConnected?.();
      }
      removeController(t6) {
        this._$EO?.delete(t6);
      }
      _$E_() {
        const t6 = /* @__PURE__ */ new Map(), s7 = this.constructor.elementProperties;
        for (const i8 of s7.keys()) this.hasOwnProperty(i8) && (t6.set(i8, this[i8]), delete this[i8]);
        t6.size > 0 && (this._$Ep = t6);
      }
      createRenderRoot() {
        const t6 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return S(t6, this.constructor.elementStyles), t6;
      }
      connectedCallback() {
        this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t6) => t6.hostConnected?.());
      }
      enableUpdating(t6) {
      }
      disconnectedCallback() {
        this._$EO?.forEach((t6) => t6.hostDisconnected?.());
      }
      attributeChangedCallback(t6, s7, i8) {
        this._$AK(t6, i8);
      }
      _$ET(t6, s7) {
        const i8 = this.constructor.elementProperties.get(t6), e7 = this.constructor._$Eu(t6, i8);
        if (void 0 !== e7 && true === i8.reflect) {
          const h7 = (void 0 !== i8.converter?.toAttribute ? i8.converter : u).toAttribute(s7, i8.type);
          this._$Em = t6, null == h7 ? this.removeAttribute(e7) : this.setAttribute(e7, h7), this._$Em = null;
        }
      }
      _$AK(t6, s7) {
        const i8 = this.constructor, e7 = i8._$Eh.get(t6);
        if (void 0 !== e7 && this._$Em !== e7) {
          const t7 = i8.getPropertyOptions(e7), h7 = "function" == typeof t7.converter ? { fromAttribute: t7.converter } : void 0 !== t7.converter?.fromAttribute ? t7.converter : u;
          this._$Em = e7;
          const r7 = h7.fromAttribute(s7, t7.type);
          this[e7] = r7 ?? this._$Ej?.get(e7) ?? r7, this._$Em = null;
        }
      }
      requestUpdate(t6, s7, i8, e7 = false, h7) {
        if (void 0 !== t6) {
          const r7 = this.constructor;
          if (false === e7 && (h7 = this[t6]), i8 ??= r7.getPropertyOptions(t6), !((i8.hasChanged ?? f)(h7, s7) || i8.useDefault && i8.reflect && h7 === this._$Ej?.get(t6) && !this.hasAttribute(r7._$Eu(t6, i8)))) return;
          this.C(t6, s7, i8);
        }
        false === this.isUpdatePending && (this._$ES = this._$EP());
      }
      C(t6, s7, { useDefault: i8, reflect: e7, wrapped: h7 }, r7) {
        i8 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t6) && (this._$Ej.set(t6, r7 ?? s7 ?? this[t6]), true !== h7 || void 0 !== r7) || (this._$AL.has(t6) || (this.hasUpdated || i8 || (s7 = void 0), this._$AL.set(t6, s7)), true === e7 && this._$Em !== t6 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t6));
      }
      async _$EP() {
        this.isUpdatePending = true;
        try {
          await this._$ES;
        } catch (t7) {
          Promise.reject(t7);
        }
        const t6 = this.scheduleUpdate();
        return null != t6 && await t6, !this.isUpdatePending;
      }
      scheduleUpdate() {
        return this.performUpdate();
      }
      performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
          if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
            for (const [t8, s8] of this._$Ep) this[t8] = s8;
            this._$Ep = void 0;
          }
          const t7 = this.constructor.elementProperties;
          if (t7.size > 0) for (const [s8, i8] of t7) {
            const { wrapped: t8 } = i8, e7 = this[s8];
            true !== t8 || this._$AL.has(s8) || void 0 === e7 || this.C(s8, void 0, i8, e7);
          }
        }
        let t6 = false;
        const s7 = this._$AL;
        try {
          t6 = this.shouldUpdate(s7), t6 ? (this.willUpdate(s7), this._$EO?.forEach((t7) => t7.hostUpdate?.()), this.update(s7)) : this._$EM();
        } catch (s8) {
          throw t6 = false, this._$EM(), s8;
        }
        t6 && this._$AE(s7);
      }
      willUpdate(t6) {
      }
      _$AE(t6) {
        this._$EO?.forEach((t7) => t7.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t6)), this.updated(t6);
      }
      _$EM() {
        this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
      }
      get updateComplete() {
        return this.getUpdateComplete();
      }
      getUpdateComplete() {
        return this._$ES;
      }
      shouldUpdate(t6) {
        return true;
      }
      update(t6) {
        this._$Eq &&= this._$Eq.forEach((t7) => this._$ET(t7, this[t7])), this._$EM();
      }
      updated(t6) {
      }
      firstUpdated(t6) {
      }
    };
    y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");
  }
});

// node_modules/lit-html/lit-html.js
function V(t6, i8) {
  if (!u2(t6) || !t6.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i8) : i8;
}
function M(t6, i8, s7 = t6, e7) {
  if (i8 === E) return i8;
  let h7 = void 0 !== e7 ? s7._$Co?.[e7] : s7._$Cl;
  const o8 = a2(i8) ? void 0 : i8._$litDirective$;
  return h7?.constructor !== o8 && (h7?._$AO?.(false), void 0 === o8 ? h7 = void 0 : (h7 = new o8(t6), h7._$AT(t6, s7, e7)), void 0 !== e7 ? (s7._$Co ??= [])[e7] = h7 : s7._$Cl = h7), void 0 !== h7 && (i8 = M(t6, h7._$AS(t6, i8.values), h7, e7)), i8;
}
var t2, i3, s2, e3, h2, o3, n3, r3, l2, c3, a2, u2, d2, f2, v, _, m, p2, g, $, y2, x, b2, w, T, E, A, C, P, N, S2, R, k, H, I, L, z, Z, j, B, D;
var init_lit_html = __esm({
  "node_modules/lit-html/lit-html.js"() {
    t2 = globalThis;
    i3 = (t6) => t6;
    s2 = t2.trustedTypes;
    e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t6) => t6 }) : void 0;
    h2 = "$lit$";
    o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
    n3 = "?" + o3;
    r3 = `<${n3}>`;
    l2 = document;
    c3 = () => l2.createComment("");
    a2 = (t6) => null === t6 || "object" != typeof t6 && "function" != typeof t6;
    u2 = Array.isArray;
    d2 = (t6) => u2(t6) || "function" == typeof t6?.[Symbol.iterator];
    f2 = "[ 	\n\f\r]";
    v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
    _ = /-->/g;
    m = />/g;
    p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
    g = /'/g;
    $ = /"/g;
    y2 = /^(?:script|style|textarea|title)$/i;
    x = (t6) => (i8, ...s7) => ({ _$litType$: t6, strings: i8, values: s7 });
    b2 = x(1);
    w = x(2);
    T = x(3);
    E = Symbol.for("lit-noChange");
    A = Symbol.for("lit-nothing");
    C = /* @__PURE__ */ new WeakMap();
    P = l2.createTreeWalker(l2, 129);
    N = (t6, i8) => {
      const s7 = t6.length - 1, e7 = [];
      let n10, l4 = 2 === i8 ? "<svg>" : 3 === i8 ? "<math>" : "", c7 = v;
      for (let i9 = 0; i9 < s7; i9++) {
        const s8 = t6[i9];
        let a4, u4, d4 = -1, f5 = 0;
        for (; f5 < s8.length && (c7.lastIndex = f5, u4 = c7.exec(s8), null !== u4); ) f5 = c7.lastIndex, c7 === v ? "!--" === u4[1] ? c7 = _ : void 0 !== u4[1] ? c7 = m : void 0 !== u4[2] ? (y2.test(u4[2]) && (n10 = RegExp("</" + u4[2], "g")), c7 = p2) : void 0 !== u4[3] && (c7 = p2) : c7 === p2 ? ">" === u4[0] ? (c7 = n10 ?? v, d4 = -1) : void 0 === u4[1] ? d4 = -2 : (d4 = c7.lastIndex - u4[2].length, a4 = u4[1], c7 = void 0 === u4[3] ? p2 : '"' === u4[3] ? $ : g) : c7 === $ || c7 === g ? c7 = p2 : c7 === _ || c7 === m ? c7 = v : (c7 = p2, n10 = void 0);
        const x3 = c7 === p2 && t6[i9 + 1].startsWith("/>") ? " " : "";
        l4 += c7 === v ? s8 + r3 : d4 >= 0 ? (e7.push(a4), s8.slice(0, d4) + h2 + s8.slice(d4) + o3 + x3) : s8 + o3 + (-2 === d4 ? i9 : x3);
      }
      return [V(t6, l4 + (t6[s7] || "<?>") + (2 === i8 ? "</svg>" : 3 === i8 ? "</math>" : "")), e7];
    };
    S2 = class _S {
      constructor({ strings: t6, _$litType$: i8 }, e7) {
        let r7;
        this.parts = [];
        let l4 = 0, a4 = 0;
        const u4 = t6.length - 1, d4 = this.parts, [f5, v3] = N(t6, i8);
        if (this.el = _S.createElement(f5, e7), P.currentNode = this.el.content, 2 === i8 || 3 === i8) {
          const t7 = this.el.content.firstChild;
          t7.replaceWith(...t7.childNodes);
        }
        for (; null !== (r7 = P.nextNode()) && d4.length < u4; ) {
          if (1 === r7.nodeType) {
            if (r7.hasAttributes()) for (const t7 of r7.getAttributeNames()) if (t7.endsWith(h2)) {
              const i9 = v3[a4++], s7 = r7.getAttribute(t7).split(o3), e8 = /([.?@])?(.*)/.exec(i9);
              d4.push({ type: 1, index: l4, name: e8[2], strings: s7, ctor: "." === e8[1] ? I : "?" === e8[1] ? L : "@" === e8[1] ? z : H }), r7.removeAttribute(t7);
            } else t7.startsWith(o3) && (d4.push({ type: 6, index: l4 }), r7.removeAttribute(t7));
            if (y2.test(r7.tagName)) {
              const t7 = r7.textContent.split(o3), i9 = t7.length - 1;
              if (i9 > 0) {
                r7.textContent = s2 ? s2.emptyScript : "";
                for (let s7 = 0; s7 < i9; s7++) r7.append(t7[s7], c3()), P.nextNode(), d4.push({ type: 2, index: ++l4 });
                r7.append(t7[i9], c3());
              }
            }
          } else if (8 === r7.nodeType) if (r7.data === n3) d4.push({ type: 2, index: l4 });
          else {
            let t7 = -1;
            for (; -1 !== (t7 = r7.data.indexOf(o3, t7 + 1)); ) d4.push({ type: 7, index: l4 }), t7 += o3.length - 1;
          }
          l4++;
        }
      }
      static createElement(t6, i8) {
        const s7 = l2.createElement("template");
        return s7.innerHTML = t6, s7;
      }
    };
    R = class {
      constructor(t6, i8) {
        this._$AV = [], this._$AN = void 0, this._$AD = t6, this._$AM = i8;
      }
      get parentNode() {
        return this._$AM.parentNode;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      u(t6) {
        const { el: { content: i8 }, parts: s7 } = this._$AD, e7 = (t6?.creationScope ?? l2).importNode(i8, true);
        P.currentNode = e7;
        let h7 = P.nextNode(), o8 = 0, n10 = 0, r7 = s7[0];
        for (; void 0 !== r7; ) {
          if (o8 === r7.index) {
            let i9;
            2 === r7.type ? i9 = new k(h7, h7.nextSibling, this, t6) : 1 === r7.type ? i9 = new r7.ctor(h7, r7.name, r7.strings, this, t6) : 6 === r7.type && (i9 = new Z(h7, this, t6)), this._$AV.push(i9), r7 = s7[++n10];
          }
          o8 !== r7?.index && (h7 = P.nextNode(), o8++);
        }
        return P.currentNode = l2, e7;
      }
      p(t6) {
        let i8 = 0;
        for (const s7 of this._$AV) void 0 !== s7 && (void 0 !== s7.strings ? (s7._$AI(t6, s7, i8), i8 += s7.strings.length - 2) : s7._$AI(t6[i8])), i8++;
      }
    };
    k = class _k {
      get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
      }
      constructor(t6, i8, s7, e7) {
        this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t6, this._$AB = i8, this._$AM = s7, this.options = e7, this._$Cv = e7?.isConnected ?? true;
      }
      get parentNode() {
        let t6 = this._$AA.parentNode;
        const i8 = this._$AM;
        return void 0 !== i8 && 11 === t6?.nodeType && (t6 = i8.parentNode), t6;
      }
      get startNode() {
        return this._$AA;
      }
      get endNode() {
        return this._$AB;
      }
      _$AI(t6, i8 = this) {
        t6 = M(this, t6, i8), a2(t6) ? t6 === A || null == t6 || "" === t6 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t6 !== this._$AH && t6 !== E && this._(t6) : void 0 !== t6._$litType$ ? this.$(t6) : void 0 !== t6.nodeType ? this.T(t6) : d2(t6) ? this.k(t6) : this._(t6);
      }
      O(t6) {
        return this._$AA.parentNode.insertBefore(t6, this._$AB);
      }
      T(t6) {
        this._$AH !== t6 && (this._$AR(), this._$AH = this.O(t6));
      }
      _(t6) {
        this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t6 : this.T(l2.createTextNode(t6)), this._$AH = t6;
      }
      $(t6) {
        const { values: i8, _$litType$: s7 } = t6, e7 = "number" == typeof s7 ? this._$AC(t6) : (void 0 === s7.el && (s7.el = S2.createElement(V(s7.h, s7.h[0]), this.options)), s7);
        if (this._$AH?._$AD === e7) this._$AH.p(i8);
        else {
          const t7 = new R(e7, this), s8 = t7.u(this.options);
          t7.p(i8), this.T(s8), this._$AH = t7;
        }
      }
      _$AC(t6) {
        let i8 = C.get(t6.strings);
        return void 0 === i8 && C.set(t6.strings, i8 = new S2(t6)), i8;
      }
      k(t6) {
        u2(this._$AH) || (this._$AH = [], this._$AR());
        const i8 = this._$AH;
        let s7, e7 = 0;
        for (const h7 of t6) e7 === i8.length ? i8.push(s7 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s7 = i8[e7], s7._$AI(h7), e7++;
        e7 < i8.length && (this._$AR(s7 && s7._$AB.nextSibling, e7), i8.length = e7);
      }
      _$AR(t6 = this._$AA.nextSibling, s7) {
        for (this._$AP?.(false, true, s7); t6 !== this._$AB; ) {
          const s8 = i3(t6).nextSibling;
          i3(t6).remove(), t6 = s8;
        }
      }
      setConnected(t6) {
        void 0 === this._$AM && (this._$Cv = t6, this._$AP?.(t6));
      }
    };
    H = class {
      get tagName() {
        return this.element.tagName;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      constructor(t6, i8, s7, e7, h7) {
        this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t6, this.name = i8, this._$AM = e7, this.options = h7, s7.length > 2 || "" !== s7[0] || "" !== s7[1] ? (this._$AH = Array(s7.length - 1).fill(new String()), this.strings = s7) : this._$AH = A;
      }
      _$AI(t6, i8 = this, s7, e7) {
        const h7 = this.strings;
        let o8 = false;
        if (void 0 === h7) t6 = M(this, t6, i8, 0), o8 = !a2(t6) || t6 !== this._$AH && t6 !== E, o8 && (this._$AH = t6);
        else {
          const e8 = t6;
          let n10, r7;
          for (t6 = h7[0], n10 = 0; n10 < h7.length - 1; n10++) r7 = M(this, e8[s7 + n10], i8, n10), r7 === E && (r7 = this._$AH[n10]), o8 ||= !a2(r7) || r7 !== this._$AH[n10], r7 === A ? t6 = A : t6 !== A && (t6 += (r7 ?? "") + h7[n10 + 1]), this._$AH[n10] = r7;
        }
        o8 && !e7 && this.j(t6);
      }
      j(t6) {
        t6 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t6 ?? "");
      }
    };
    I = class extends H {
      constructor() {
        super(...arguments), this.type = 3;
      }
      j(t6) {
        this.element[this.name] = t6 === A ? void 0 : t6;
      }
    };
    L = class extends H {
      constructor() {
        super(...arguments), this.type = 4;
      }
      j(t6) {
        this.element.toggleAttribute(this.name, !!t6 && t6 !== A);
      }
    };
    z = class extends H {
      constructor(t6, i8, s7, e7, h7) {
        super(t6, i8, s7, e7, h7), this.type = 5;
      }
      _$AI(t6, i8 = this) {
        if ((t6 = M(this, t6, i8, 0) ?? A) === E) return;
        const s7 = this._$AH, e7 = t6 === A && s7 !== A || t6.capture !== s7.capture || t6.once !== s7.once || t6.passive !== s7.passive, h7 = t6 !== A && (s7 === A || e7);
        e7 && this.element.removeEventListener(this.name, this, s7), h7 && this.element.addEventListener(this.name, this, t6), this._$AH = t6;
      }
      handleEvent(t6) {
        "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t6) : this._$AH.handleEvent(t6);
      }
    };
    Z = class {
      constructor(t6, i8, s7) {
        this.element = t6, this.type = 6, this._$AN = void 0, this._$AM = i8, this.options = s7;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AI(t6) {
        M(this, t6);
      }
    };
    j = { M: h2, P: o3, A: n3, C: 1, L: N, R, D: d2, V: M, I: k, H, N: L, U: z, B: I, F: Z };
    B = t2.litHtmlPolyfillSupport;
    B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.3");
    D = (t6, i8, s7) => {
      const e7 = s7?.renderBefore ?? i8;
      let h7 = e7._$litPart$;
      if (void 0 === h7) {
        const t7 = s7?.renderBefore ?? null;
        e7._$litPart$ = h7 = new k(i8.insertBefore(c3(), t7), t7, void 0, s7 ?? {});
      }
      return h7._$AI(t6), h7;
    };
  }
});

// node_modules/lit-element/lit-element.js
var s3, i4, o4;
var init_lit_element = __esm({
  "node_modules/lit-element/lit-element.js"() {
    init_reactive_element();
    init_reactive_element();
    init_lit_html();
    init_lit_html();
    s3 = globalThis;
    i4 = class extends y {
      constructor() {
        super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
      }
      createRenderRoot() {
        const t6 = super.createRenderRoot();
        return this.renderOptions.renderBefore ??= t6.firstChild, t6;
      }
      update(t6) {
        const r7 = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t6), this._$Do = D(r7, this.renderRoot, this.renderOptions);
      }
      connectedCallback() {
        super.connectedCallback(), this._$Do?.setConnected(true);
      }
      disconnectedCallback() {
        super.disconnectedCallback(), this._$Do?.setConnected(false);
      }
      render() {
        return E;
      }
    };
    i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
    o4 = s3.litElementPolyfillSupport;
    o4?.({ LitElement: i4 });
    (s3.litElementVersions ??= []).push("4.2.2");
  }
});

// node_modules/lit-html/is-server.js
var init_is_server = __esm({
  "node_modules/lit-html/is-server.js"() {
  }
});

// node_modules/lit/index.js
var init_lit = __esm({
  "node_modules/lit/index.js"() {
    init_reactive_element();
    init_lit_html();
    init_lit_element();
    init_is_server();
  }
});

// src/EpisodeSelectEvent.js
var EpisodeSelectEvent;
var init_EpisodeSelectEvent = __esm({
  "src/EpisodeSelectEvent.js"() {
    EpisodeSelectEvent = class extends Event {
      constructor(episode) {
        super("episode-select", {
          bubbles: true,
          composed: true
        });
        this.episode = episode;
      }
    };
  }
});

// src/PodSelectEvent.js
var PodSelectEvent;
var init_PodSelectEvent = __esm({
  "src/PodSelectEvent.js"() {
    PodSelectEvent = class extends Event {
      constructor(podcast) {
        super("podcast-select", {
          bubbles: true,
          composed: true
        });
        this.podcast = podcast;
      }
    };
  }
});

// src/pod-scroller.js
var pod_scroller_exports = {};
var PodScroller;
var init_pod_scroller = __esm({
  "src/pod-scroller.js"() {
    init_lit();
    init_EpisodeSelectEvent();
    init_PodSelectEvent();
    PodScroller = class extends i4 {
      static get properties() {
        return {
          items: { type: Array },
          _lastSelected: {
            type: Boolean,
            reflect: true,
            attribute: "has-last-selected"
          },
          _selected: { type: Boolean, reflect: true, attribute: "selected" }
        };
      }
      static get styles() {
        return i`
      :host {
        display: grid;
        gap: 4px;
        grid-template-columns: repeat(var(--item-count), max-content);
        container: scroller / size;
        max-width: calc(100vw - 16px);
        overflow-x: scroll;
      }
      img[selected] {
        view-transition-name: header-image;
      }

      button {
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        background-color: #fff;
        cursor: pointer;
        display: grid;
        place-content: center;
        height: 100cqb;
        object-fit: cover;
        aspect-ratio: 1 / 1;
        padding: 0;
        overflow: hidden;
        position: relative;
        &[complete] {
          opacity: 0.5;
          &:after {
            content: "COMPLETED";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: grid;
            place-content: center;
            color: red;
            rotate: -30deg;
            font-size: 25px;
            font-weight: bold;
            text-shadow: 1px 1px black, 1px -1px black, -1px 1px black,
              -1px -1px black;
          }
        }
        & img {
          height: 100cqb;
        }
        & p {
          margin: 0;
          padding: 4px;
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          color: white;
          height: calc(3lh + 8px);
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.5) 80%,
            rgba(0, 0, 0, 0) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: clip;
        }
      }
    `;
      }
      constructor() {
        super();
        this.items = [];
      }
      updated(changedProperties) {
        if (changedProperties.has("items")) {
          this.style.setProperty("--item-count", this.items.length);
        }
      }
      async #select(item) {
        this._lastSelected = void 0;
        this._selected = item;
        await this.updateComplete;
        if (this.getAttribute("type") == "episode")
          return this.dispatchEvent(new EpisodeSelectEvent(item));
        return this.dispatchEvent(new PodSelectEvent(item));
      }
      async deselect() {
        this._lastSelected = this._selected;
        this._selected = void 0;
        await this.updateComplete;
      }
      async reselect() {
        this._selected = this._lastSelected;
        this._lastSelected = void 0;
        await this.updateComplete;
        requestAnimationFrame(() => {
          this._selected = void 0;
        });
      }
      render() {
        return b2`
      ${this.items.map(
          (item) => b2`
            <button
              ?complete=${item.complete}
              @click=${() => this.#select(item)}
            >
              <img
                ?selected=${this._selected === item}
                ?last-selected=${this._lastSelected === item}
                src=${item.image?.url ?? item.itunes?.image ?? item.podcastImage}
              />
              <p>${item.title}</p>
            </button>
          `
        )}
    `;
      }
    };
    customElements.define("pod-scroller", PodScroller);
  }
});

// node_modules/lit-html/directives/when.js
function n4(n10, r7, t6) {
  return n10 ? r7(n10) : t6?.(n10);
}
var init_when = __esm({
  "node_modules/lit-html/directives/when.js"() {
  }
});

// node_modules/lit/directives/when.js
var init_when2 = __esm({
  "node_modules/lit/directives/when.js"() {
    init_when();
  }
});

// node_modules/lit-html/directive-helpers.js
var t3, n5, r4;
var init_directive_helpers = __esm({
  "node_modules/lit-html/directive-helpers.js"() {
    init_lit_html();
    ({ I: t3 } = j);
    n5 = (o8) => null === o8 || "object" != typeof o8 && "function" != typeof o8;
    r4 = (o8) => void 0 === o8.strings;
  }
});

// node_modules/lit-html/directive.js
var t4, e4, i5;
var init_directive = __esm({
  "node_modules/lit-html/directive.js"() {
    t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
    e4 = (t6) => (...e7) => ({ _$litDirective$: t6, values: e7 });
    i5 = class {
      constructor(t6) {
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AT(t6, e7, i8) {
        this._$Ct = t6, this._$AM = e7, this._$Ci = i8;
      }
      _$AS(t6, e7) {
        return this.update(t6, e7);
      }
      update(t6, e7) {
        return this.render(...e7);
      }
    };
  }
});

// node_modules/lit-html/async-directive.js
function h3(i8) {
  void 0 !== this._$AN ? (o5(this), this._$AM = i8, r5(this)) : this._$AM = i8;
}
function n6(i8, t6 = false, e7 = 0) {
  const r7 = this._$AH, h7 = this._$AN;
  if (void 0 !== h7 && 0 !== h7.size) if (t6) if (Array.isArray(r7)) for (let i9 = e7; i9 < r7.length; i9++) s4(r7[i9], false), o5(r7[i9]);
  else null != r7 && (s4(r7, false), o5(r7));
  else s4(this, i8);
}
var s4, o5, r5, c4, f3;
var init_async_directive = __esm({
  "node_modules/lit-html/async-directive.js"() {
    init_directive_helpers();
    init_directive();
    init_directive();
    s4 = (i8, t6) => {
      const e7 = i8._$AN;
      if (void 0 === e7) return false;
      for (const i9 of e7) i9._$AO?.(t6, false), s4(i9, t6);
      return true;
    };
    o5 = (i8) => {
      let t6, e7;
      do {
        if (void 0 === (t6 = i8._$AM)) break;
        e7 = t6._$AN, e7.delete(i8), i8 = t6;
      } while (0 === e7?.size);
    };
    r5 = (i8) => {
      for (let t6; t6 = i8._$AM; i8 = t6) {
        let e7 = t6._$AN;
        if (void 0 === e7) t6._$AN = e7 = /* @__PURE__ */ new Set();
        else if (e7.has(i8)) break;
        e7.add(i8), c4(t6);
      }
    };
    c4 = (i8) => {
      i8.type == t4.CHILD && (i8._$AP ??= n6, i8._$AQ ??= h3);
    };
    f3 = class extends i5 {
      constructor() {
        super(...arguments), this._$AN = void 0;
      }
      _$AT(i8, t6, e7) {
        super._$AT(i8, t6, e7), r5(this), this.isConnected = i8._$AU;
      }
      _$AO(i8, t6 = true) {
        i8 !== this.isConnected && (this.isConnected = i8, i8 ? this.reconnected?.() : this.disconnected?.()), t6 && (s4(this, i8), o5(this));
      }
      setValue(t6) {
        if (r4(this._$Ct)) this._$Ct._$AI(t6, this);
        else {
          const i8 = [...this._$Ct._$AH];
          i8[this._$Ci] = t6, this._$Ct._$AI(i8, this, 0);
        }
      }
      disconnected() {
      }
      reconnected() {
      }
    };
  }
});

// node_modules/lit-html/directives/private-async-helpers.js
var s5, i6;
var init_private_async_helpers = __esm({
  "node_modules/lit-html/directives/private-async-helpers.js"() {
    s5 = class {
      constructor(t6) {
        this.G = t6;
      }
      disconnect() {
        this.G = void 0;
      }
      reconnect(t6) {
        this.G = t6;
      }
      deref() {
        return this.G;
      }
    };
    i6 = class {
      constructor() {
        this.Y = void 0, this.Z = void 0;
      }
      get() {
        return this.Y;
      }
      pause() {
        this.Y ??= new Promise((t6) => this.Z = t6);
      }
      resume() {
        this.Z?.(), this.Y = this.Z = void 0;
      }
    };
  }
});

// node_modules/lit-html/directives/until.js
var n7, h4, c5, m2;
var init_until = __esm({
  "node_modules/lit-html/directives/until.js"() {
    init_lit_html();
    init_directive_helpers();
    init_async_directive();
    init_private_async_helpers();
    init_directive();
    n7 = (t6) => !n5(t6) && "function" == typeof t6.then;
    h4 = 1073741823;
    c5 = class extends f3 {
      constructor() {
        super(...arguments), this._$Cwt = h4, this._$Cbt = [], this._$CK = new s5(this), this._$CX = new i6();
      }
      render(...s7) {
        return s7.find((t6) => !n7(t6)) ?? E;
      }
      update(s7, i8) {
        const e7 = this._$Cbt;
        let r7 = e7.length;
        this._$Cbt = i8;
        const o8 = this._$CK, c7 = this._$CX;
        this.isConnected || this.disconnected();
        for (let t6 = 0; t6 < i8.length && !(t6 > this._$Cwt); t6++) {
          const s8 = i8[t6];
          if (!n7(s8)) return this._$Cwt = t6, s8;
          t6 < r7 && s8 === e7[t6] || (this._$Cwt = h4, r7 = 0, Promise.resolve(s8).then(async (t7) => {
            for (; c7.get(); ) await c7.get();
            const i9 = o8.deref();
            if (void 0 !== i9) {
              const e8 = i9._$Cbt.indexOf(s8);
              e8 > -1 && e8 < i9._$Cwt && (i9._$Cwt = e8, i9.setValue(t7));
            }
          }));
        }
        return E;
      }
      disconnected() {
        this._$CK.disconnect(), this._$CX.pause();
      }
      reconnected() {
        this._$CK.reconnect(this), this._$CX.resume();
      }
    };
    m2 = e4(c5);
  }
});

// node_modules/lit/directives/until.js
var init_until2 = __esm({
  "node_modules/lit/directives/until.js"() {
    init_until();
  }
});

// src/play-pause.css.js
var playPauseStyles;
var init_play_pause_css = __esm({
  "src/play-pause.css.js"() {
    init_lit();
    playPauseStyles = i`
  svg[play-pause] {
    height: 100%;
    place-self: center;
    aspect-ratio: 1 / 1;
    padding: 0;
    & path {
      fill: black;
      transition: all 0.3s linear;
    }
    &[play] path {
      d: path(
        "M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134l0 268Z"
      );
      fill: var(--primarycolor, #000);
    }

    &[pause] path {
      d: path("M320-200v-560l80 0-0 560Zm235-0Zm80 0 0-560-80 0l0 560Z");
      fill: #000;
    }
  }
`;
  }
});

// node_modules/jsbi/dist/jsbi-umd.js
var require_jsbi_umd = __commonJS({
  "node_modules/jsbi/dist/jsbi-umd.js"(exports, module) {
    (function(e7, t6) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t6() : "function" == typeof define && define.amd ? define(t6) : (e7 = e7 || self, e7.JSBI = t6());
    })(exports, function() {
      "use strict";
      var e7 = Math.imul, t6 = Math.clz32;
      function i8(t7, i9) {
        (null == i9 || i9 > t7.length) && (i9 = t7.length);
        for (var _4 = 0, o9 = Array(i9); _4 < i9; _4++) o9[_4] = t7[_4];
        return o9;
      }
      function _3(e8) {
        if (Array.isArray(e8)) return e8;
      }
      function n10(t7) {
        if (void 0 === t7) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t7;
      }
      function o8(i9, t7, _4) {
        return t7 = r7(t7), v3(i9, b4() ? Reflect.construct(t7, _4 || [], r7(i9).constructor) : t7.apply(i9, _4));
      }
      function l4(e8, t7) {
        if (!(e8 instanceof t7)) throw new TypeError("Cannot call a class as a function");
      }
      function g3(i9, t7, e8) {
        if (b4()) return Reflect.construct.apply(null, arguments);
        var _4 = [null];
        _4.push.apply(_4, t7);
        var n11 = new (i9.bind.apply(i9, _4))();
        return e8 && y4(n11, e8.prototype), n11;
      }
      function a4(i9, e8) {
        for (var _4, n11 = 0; n11 < e8.length; n11++) _4 = e8[n11], _4.enumerable = _4.enumerable || false, _4.configurable = true, "value" in _4 && (_4.writable = true), Object.defineProperty(i9, D3(_4.key), _4);
      }
      function s7(i9, e8, _4) {
        return e8 && a4(i9.prototype, e8), _4 && a4(i9, _4), Object.defineProperty(i9, "prototype", { writable: false }), i9;
      }
      function u4(i9, _4) {
        var e8 = "undefined" != typeof Symbol && i9[Symbol.iterator] || i9["@@iterator"];
        if (!e8) {
          if (Array.isArray(i9) || (e8 = B3(i9)) || _4 && i9 && "number" == typeof i9.length) {
            e8 && (i9 = e8);
            var l5 = 0, g4 = function() {
            };
            return { s: g4, n: function() {
              return l5 >= i9.length ? { done: true } : { done: false, value: i9[l5++] };
            }, e: function(e9) {
              throw e9;
            }, f: g4 };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var s8, d5 = true, h8 = false;
        return { s: function() {
          e8 = e8.call(i9);
        }, n: function() {
          var t7 = e8.next();
          return d5 = t7.done, t7;
        }, e: function(e9) {
          h8 = true, s8 = e9;
        }, f: function() {
          try {
            d5 || null == e8.return || e8.return();
          } finally {
            if (h8) throw s8;
          }
        } };
      }
      function r7(e8) {
        return r7 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e9) {
          return e9.__proto__ || Object.getPrototypeOf(e9);
        }, r7(e8);
      }
      function d4(i9, t7) {
        if ("function" != typeof t7 && null !== t7) throw new TypeError("Super expression must either be null or a function");
        i9.prototype = Object.create(t7 && t7.prototype, { constructor: { value: i9, writable: true, configurable: true } }), Object.defineProperty(i9, "prototype", { writable: false }), t7 && y4(i9, t7);
      }
      function h7(e8) {
        try {
          return -1 !== Function.toString.call(e8).indexOf("[native code]");
        } catch (t7) {
          return "function" == typeof e8;
        }
      }
      function b4() {
        try {
          var e8 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
        } catch (e9) {
        }
        return (b4 = function() {
          return !!e8;
        })();
      }
      function m4(_4, g4) {
        var l5 = null == _4 ? null : "undefined" != typeof Symbol && _4[Symbol.iterator] || _4["@@iterator"];
        if (null != l5) {
          var s8, d5, r8, h8, b5 = [], a5 = true, m5 = false;
          try {
            if (r8 = (l5 = l5.call(_4)).next, 0 === g4) {
              if (Object(l5) !== l5) return;
              a5 = false;
            } else for (; !(a5 = (s8 = r8.call(l5)).done) && (b5.push(s8.value), b5.length !== g4); a5 = true) ;
          } catch (e8) {
            m5 = true, d5 = e8;
          } finally {
            try {
              if (!a5 && null != l5.return && (h8 = l5.return(), Object(h8) !== h8)) return;
            } finally {
              if (m5) throw d5;
            }
          }
          return b5;
        }
      }
      function c7() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function v3(i9, t7) {
        if (t7 && ("object" == typeof t7 || "function" == typeof t7)) return t7;
        if (void 0 !== t7) throw new TypeError("Derived constructors may only return object or undefined");
        return n10(i9);
      }
      function y4(i9, t7) {
        return y4 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(i10, t8) {
          return i10.__proto__ = t8, i10;
        }, y4(i9, t7);
      }
      function f5(t7, i9) {
        return _3(t7) || m4(t7, i9) || B3(t7, i9) || c7();
      }
      function k3(_4, t7) {
        if ("object" != typeof _4 || !_4) return _4;
        var n11 = _4[Symbol.toPrimitive];
        if (void 0 !== n11) {
          var e8 = n11.call(_4, t7 || "default");
          if ("object" != typeof e8) return e8;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === t7 ? String : Number)(_4);
      }
      function D3(e8) {
        var t7 = k3(e8, "string");
        return "symbol" == typeof t7 ? t7 : t7 + "";
      }
      function p4(e8) {
        "@babel/helpers - typeof";
        return p4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e9) {
          return typeof e9;
        } : function(e9) {
          return e9 && "function" == typeof Symbol && e9.constructor === Symbol && e9 !== Symbol.prototype ? "symbol" : typeof e9;
        }, p4(e8);
      }
      function B3(e8, _4) {
        if (e8) {
          if ("string" == typeof e8) return i8(e8, _4);
          var n11 = {}.toString.call(e8).slice(8, -1);
          return "Object" === n11 && e8.constructor && (n11 = e8.constructor.name), "Map" === n11 || "Set" === n11 ? Array.from(e8) : "Arguments" === n11 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n11) ? i8(e8, _4) : void 0;
        }
      }
      function S4(e8) {
        var i9 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
        return S4 = function(e9) {
          function t7() {
            return g3(e9, arguments, r7(this).constructor);
          }
          if (null === e9 || !h7(e9)) return e9;
          if ("function" != typeof e9) throw new TypeError("Super expression must either be null or a function");
          if (void 0 !== i9) {
            if (i9.has(e9)) return i9.get(e9);
            i9.set(e9, t7);
          }
          return t7.prototype = Object.create(e9.prototype, { constructor: { value: t7, enumerable: false, writable: true, configurable: true } }), y4(t7, e9);
        }, S4(e8);
      }
      var C3 = function(e8) {
        var t7 = Math.abs, i9 = Math.max, _4 = Math.floor;
        function g4(e9, t8) {
          var i10;
          if (l4(this, g4), i10 = o8(this, g4, [e9]), i10.sign = t8, Object.setPrototypeOf(i10, g4.prototype), e9 > g4.__kMaxLength) throw new RangeError("Maximum BigInt size exceeded");
          return i10;
        }
        return d4(g4, e8), s7(g4, [{ key: "toDebugString", value: function e9() {
          var t8, i10 = ["BigInt["], _5 = u4(this);
          try {
            for (_5.s(); !(t8 = _5.n()).done; ) {
              var n11 = t8.value;
              i10.push((n11 ? (n11 >>> 0).toString(16) : n11) + ", ");
            }
          } catch (e10) {
            _5.e(e10);
          } finally {
            _5.f();
          }
          return i10.push("]"), i10.join("");
        } }, { key: "toString", value: function e9() {
          var t8 = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 10;
          if (2 > t8 || 36 < t8) throw new RangeError("toString() radix argument must be between 2 and 36");
          return 0 === this.length ? "0" : 0 == (t8 & t8 - 1) ? g4.__toStringBasePowerOfTwo(this, t8) : g4.__toStringGeneric(this, t8, false);
        } }, { key: "valueOf", value: function e9() {
          throw new Error("Convert JSBI instances to native numbers using `toNumber`.");
        } }, { key: "__copy", value: function e9() {
          for (var t8 = new g4(this.length, this.sign), _5 = 0; _5 < this.length; _5++) t8[_5] = this[_5];
          return t8;
        } }, { key: "__trim", value: function e9() {
          for (var t8 = this.length, i10 = this[t8 - 1]; 0 === i10; ) t8--, i10 = this[t8 - 1], this.pop();
          return 0 === t8 && (this.sign = false), this;
        } }, { key: "__initializeDigits", value: function e9() {
          for (var t8 = 0; t8 < this.length; t8++) this[t8] = 0;
        } }, { key: "__clzmsd", value: function e9() {
          return g4.__clz30(this.__digit(this.length - 1));
        } }, { key: "__inplaceMultiplyAdd", value: function n11(e9, t8, _5) {
          _5 > this.length && (_5 = this.length);
          for (var o9 = 32767 & e9, l5 = e9 >>> 15, a5 = 0, s8 = t8, u5 = 0; u5 < _5; u5++) {
            var r8 = this.__digit(u5), h8 = 32767 & r8, b5 = r8 >>> 15, m5 = g4.__imul(h8, o9), c8 = g4.__imul(h8, l5), v4 = g4.__imul(b5, o9), y5 = g4.__imul(b5, l5), f6 = s8 + m5 + a5;
            a5 = f6 >>> 30, f6 &= 1073741823, f6 += ((32767 & c8) << 15) + ((32767 & v4) << 15), a5 += f6 >>> 30, s8 = y5 + (c8 >>> 15) + (v4 >>> 15), this.__setDigit(u5, 1073741823 & f6);
          }
          if (0 !== a5 || 0 !== s8) throw new Error("implementation bug");
        } }, { key: "__inplaceAdd", value: function n11(e9, t8, _5) {
          for (var o9, l5 = 0, g5 = 0; g5 < _5; g5++) o9 = this.__halfDigit(t8 + g5) + e9.__halfDigit(g5) + l5, l5 = o9 >>> 15, this.__setHalfDigit(t8 + g5, 32767 & o9);
          return l5;
        } }, { key: "__inplaceSub", value: function n11(e9, t8, _5) {
          var o9 = _5 - 1 >>> 1, l5 = 0;
          if (1 & t8) {
            t8 >>= 1;
            for (var g5 = this.__digit(t8), a5 = 32767 & g5, s8 = 0; s8 < o9; s8++) {
              var u5 = e9.__digit(s8), r8 = (g5 >>> 15) - (32767 & u5) - l5;
              l5 = 1 & r8 >>> 15, this.__setDigit(t8 + s8, (32767 & r8) << 15 | 32767 & a5), g5 = this.__digit(t8 + s8 + 1), a5 = (32767 & g5) - (u5 >>> 15) - l5, l5 = 1 & a5 >>> 15;
            }
            var d5 = e9.__digit(s8), h8 = (g5 >>> 15) - (32767 & d5) - l5;
            l5 = 1 & h8 >>> 15, this.__setDigit(t8 + s8, (32767 & h8) << 15 | 32767 & a5);
            var b5 = d5 >>> 15;
            if (t8 + s8 + 1 >= this.length) throw new RangeError("out of bounds");
            0 == (1 & _5) && (g5 = this.__digit(t8 + s8 + 1), a5 = (32767 & g5) - b5 - l5, l5 = 1 & a5 >>> 15, this.__setDigit(t8 + e9.length, 1073709056 & g5 | 32767 & a5));
          } else {
            t8 >>= 1;
            for (var m5 = 0; m5 < e9.length - 1; m5++) {
              var c8 = this.__digit(t8 + m5), v4 = e9.__digit(m5), y5 = (32767 & c8) - (32767 & v4) - l5;
              l5 = 1 & y5 >>> 15;
              var f6 = (c8 >>> 15) - (v4 >>> 15) - l5;
              l5 = 1 & f6 >>> 15, this.__setDigit(t8 + m5, (32767 & f6) << 15 | 32767 & y5);
            }
            var k4 = this.__digit(t8 + m5), D4 = e9.__digit(m5), p5 = (32767 & k4) - (32767 & D4) - l5;
            l5 = 1 & p5 >>> 15;
            var B4 = 0;
            0 == (1 & _5) && (B4 = (k4 >>> 15) - (D4 >>> 15) - l5, l5 = 1 & B4 >>> 15), this.__setDigit(t8 + m5, (32767 & B4) << 15 | 32767 & p5);
          }
          return l5;
        } }, { key: "__inplaceRightShift", value: function t8(e9) {
          if (0 !== e9) {
            for (var _5, n11 = this.__digit(0) >>> e9, o9 = this.length - 1, l5 = 0; l5 < o9; l5++) _5 = this.__digit(l5 + 1), this.__setDigit(l5, 1073741823 & _5 << 30 - e9 | n11), n11 = _5 >>> e9;
            this.__setDigit(o9, n11);
          }
        } }, { key: "__digit", value: function t8(e9) {
          return this[e9];
        } }, { key: "__unsignedDigit", value: function t8(e9) {
          return this[e9] >>> 0;
        } }, { key: "__setDigit", value: function i10(e9, t8) {
          this[e9] = 0 | t8;
        } }, { key: "__setDigitGrow", value: function i10(e9, t8) {
          this[e9] = 0 | t8;
        } }, { key: "__halfDigitLength", value: function e9() {
          var t8 = this.length;
          return 32767 >= this.__unsignedDigit(t8 - 1) ? 2 * t8 - 1 : 2 * t8;
        } }, { key: "__halfDigit", value: function t8(e9) {
          return 32767 & this[e9 >>> 1] >>> 15 * (1 & e9);
        } }, { key: "__setHalfDigit", value: function i10(e9, t8) {
          var _5 = e9 >>> 1, n11 = this.__digit(_5), o9 = 1 & e9 ? 32767 & n11 | t8 << 15 : 1073709056 & n11 | 32767 & t8;
          this.__setDigit(_5, o9);
        } }], [{ key: "BigInt", value: function t8(e9) {
          var i10 = Number.isFinite;
          if ("number" == typeof e9) {
            if (0 === e9) return g4.__zero();
            if (g4.__isOneDigitInt(e9)) return 0 > e9 ? g4.__oneDigit(-e9, true) : g4.__oneDigit(e9, false);
            if (!i10(e9) || _4(e9) !== e9) throw new RangeError("The number " + e9 + " cannot be converted to BigInt because it is not an integer");
            return g4.__fromDouble(e9);
          }
          if ("string" == typeof e9) {
            var n11 = g4.__fromString(e9);
            if (null === n11) throw new SyntaxError("Cannot convert " + e9 + " to a BigInt");
            return n11;
          }
          if ("boolean" == typeof e9) return true === e9 ? g4.__oneDigit(1, false) : g4.__zero();
          if ("object" === p4(e9)) {
            if (e9.constructor === g4) return e9;
            var o9 = g4.__toPrimitive(e9);
            return g4.BigInt(o9);
          }
          throw new TypeError("Cannot convert " + e9 + " to a BigInt");
        } }, { key: "toNumber", value: function t8(e9) {
          var i10 = e9.length;
          if (0 === i10) return 0;
          if (1 === i10) {
            var _5 = e9.__unsignedDigit(0);
            return e9.sign ? -_5 : _5;
          }
          var n11 = e9.__digit(i10 - 1), o9 = g4.__clz30(n11), l5 = 30 * i10 - o9;
          if (1024 < l5) return e9.sign ? -Infinity : 1 / 0;
          var a5 = l5 - 1, s8 = n11, u5 = i10 - 1, r8 = o9 + 3, d5 = 32 === r8 ? 0 : s8 << r8;
          d5 >>>= 12;
          var h8 = r8 - 12, b5 = 12 <= r8 ? 0 : s8 << 20 + r8, m5 = 20 + r8;
          for (0 < h8 && 0 < u5 && (u5--, s8 = e9.__digit(u5), d5 |= s8 >>> 30 - h8, b5 = s8 << h8 + 2, m5 = h8 + 2); 0 < m5 && 0 < u5; ) u5--, s8 = e9.__digit(u5), b5 |= 30 <= m5 ? s8 << m5 - 30 : s8 >>> 30 - m5, m5 -= 30;
          var c8 = g4.__decideRounding(e9, m5, u5, s8);
          if ((1 === c8 || 0 === c8 && 1 == (1 & b5)) && (b5 = b5 + 1 >>> 0, 0 === b5 && (d5++, 0 != d5 >>> 20 && (d5 = 0, a5++, 1023 < a5)))) return e9.sign ? -Infinity : 1 / 0;
          var v4 = e9.sign ? -2147483648 : 0;
          return a5 = a5 + 1023 << 20, g4.__kBitConversionInts[g4.__kBitConversionIntHigh] = v4 | a5 | d5, g4.__kBitConversionInts[g4.__kBitConversionIntLow] = b5, g4.__kBitConversionDouble[0];
        } }, { key: "unaryMinus", value: function t8(e9) {
          if (0 === e9.length) return e9;
          var i10 = e9.__copy();
          return i10.sign = !e9.sign, i10;
        } }, { key: "bitwiseNot", value: function t8(e9) {
          return e9.sign ? g4.__absoluteSubOne(e9).__trim() : g4.__absoluteAddOne(e9, true);
        } }, { key: "exponentiate", value: function i10(e9, t8) {
          if (t8.sign) throw new RangeError("Exponent must be positive");
          if (0 === t8.length) return g4.__oneDigit(1, false);
          if (0 === e9.length) return e9;
          if (1 === e9.length && 1 === e9.__digit(0)) return e9.sign && 0 == (1 & t8.__digit(0)) ? g4.unaryMinus(e9) : e9;
          if (1 < t8.length) throw new RangeError("BigInt too big");
          var _5 = t8.__unsignedDigit(0);
          if (1 === _5) return e9;
          if (_5 >= g4.__kMaxLengthBits) throw new RangeError("BigInt too big");
          if (1 === e9.length && 2 === e9.__digit(0)) {
            var n11 = 1 + (0 | _5 / 30), o9 = e9.sign && 0 != (1 & _5), l5 = new g4(n11, o9);
            l5.__initializeDigits();
            var a5 = 1 << _5 % 30;
            return l5.__setDigit(n11 - 1, a5), l5;
          }
          var s8 = null, u5 = e9;
          for (0 != (1 & _5) && (s8 = e9), _5 >>= 1; 0 !== _5; _5 >>= 1) u5 = g4.multiply(u5, u5), 0 != (1 & _5) && (null === s8 ? s8 = u5 : s8 = g4.multiply(s8, u5));
          return s8;
        } }, { key: "multiply", value: function _5(e9, t8) {
          if (0 === e9.length) return e9;
          if (0 === t8.length) return t8;
          var n11 = e9.length + t8.length;
          30 <= e9.__clzmsd() + t8.__clzmsd() && n11--;
          var o9 = new g4(n11, e9.sign !== t8.sign);
          o9.__initializeDigits();
          for (var l5 = 0; l5 < e9.length; l5++) g4.__multiplyAccumulate(t8, e9.__digit(l5), o9, l5);
          return o9.__trim();
        } }, { key: "divide", value: function i10(e9, t8) {
          if (0 === t8.length) throw new RangeError("Division by zero");
          if (0 > g4.__absoluteCompare(e9, t8)) return g4.__zero();
          var _5, n11 = e9.sign !== t8.sign, o9 = t8.__unsignedDigit(0);
          if (1 === t8.length && 32767 >= o9) {
            if (1 === o9) return n11 === e9.sign ? e9 : g4.unaryMinus(e9);
            _5 = g4.__absoluteDivSmall(e9, o9, null);
          } else _5 = g4.__absoluteDivLarge(e9, t8, true, false);
          return _5.sign = n11, _5.__trim();
        } }, { key: "remainder", value: function i10(e9, t8) {
          if (0 === t8.length) throw new RangeError("Division by zero");
          if (0 > g4.__absoluteCompare(e9, t8)) return e9;
          var _5 = t8.__unsignedDigit(0);
          if (1 === t8.length && 32767 >= _5) {
            if (1 === _5) return g4.__zero();
            var n11 = g4.__absoluteModSmall(e9, _5);
            return 0 === n11 ? g4.__zero() : g4.__oneDigit(n11, e9.sign);
          }
          var i11 = g4.__absoluteDivLarge(e9, t8, false, true);
          return i11.sign = e9.sign, i11.__trim();
        } }, { key: "add", value: function i10(e9, t8) {
          var _5 = e9.sign;
          return _5 === t8.sign ? g4.__absoluteAdd(e9, t8, _5) : 0 <= g4.__absoluteCompare(e9, t8) ? g4.__absoluteSub(e9, t8, _5) : g4.__absoluteSub(t8, e9, !_5);
        } }, { key: "subtract", value: function i10(e9, t8) {
          var _5 = e9.sign;
          return _5 === t8.sign ? 0 <= g4.__absoluteCompare(e9, t8) ? g4.__absoluteSub(e9, t8, _5) : g4.__absoluteSub(t8, e9, !_5) : g4.__absoluteAdd(e9, t8, _5);
        } }, { key: "leftShift", value: function i10(e9, t8) {
          return 0 === t8.length || 0 === e9.length ? e9 : t8.sign ? g4.__rightShiftByAbsolute(e9, t8) : g4.__leftShiftByAbsolute(e9, t8);
        } }, { key: "signedRightShift", value: function i10(e9, t8) {
          return 0 === t8.length || 0 === e9.length ? e9 : t8.sign ? g4.__leftShiftByAbsolute(e9, t8) : g4.__rightShiftByAbsolute(e9, t8);
        } }, { key: "unsignedRightShift", value: function e9() {
          throw new TypeError("BigInts have no unsigned right shift; use >> instead");
        } }, { key: "lessThan", value: function i10(e9, t8) {
          return 0 > g4.__compareToBigInt(e9, t8);
        } }, { key: "lessThanOrEqual", value: function i10(e9, t8) {
          return 0 >= g4.__compareToBigInt(e9, t8);
        } }, { key: "greaterThan", value: function i10(e9, t8) {
          return 0 < g4.__compareToBigInt(e9, t8);
        } }, { key: "greaterThanOrEqual", value: function i10(e9, t8) {
          return 0 <= g4.__compareToBigInt(e9, t8);
        } }, { key: "equal", value: function _5(e9, t8) {
          if (e9.sign !== t8.sign) return false;
          if (e9.length !== t8.length) return false;
          for (var n11 = 0; n11 < e9.length; n11++) if (e9.__digit(n11) !== t8.__digit(n11)) return false;
          return true;
        } }, { key: "notEqual", value: function i10(e9, t8) {
          return !g4.equal(e9, t8);
        } }, { key: "bitwiseAnd", value: function _5(e9, t8) {
          if (!e9.sign && !t8.sign) return g4.__absoluteAnd(e9, t8).__trim();
          if (e9.sign && t8.sign) {
            var n11 = i9(e9.length, t8.length) + 1, o9 = g4.__absoluteSubOne(e9, n11), l5 = g4.__absoluteSubOne(t8);
            return o9 = g4.__absoluteOr(o9, l5, o9), g4.__absoluteAddOne(o9, true, o9).__trim();
          }
          if (e9.sign) {
            var a5 = [t8, e9];
            e9 = a5[0], t8 = a5[1];
          }
          return g4.__absoluteAndNot(e9, g4.__absoluteSubOne(t8)).__trim();
        } }, { key: "bitwiseXor", value: function _5(e9, t8) {
          if (!e9.sign && !t8.sign) return g4.__absoluteXor(e9, t8).__trim();
          if (e9.sign && t8.sign) {
            var n11 = i9(e9.length, t8.length), o9 = g4.__absoluteSubOne(e9, n11), l5 = g4.__absoluteSubOne(t8);
            return g4.__absoluteXor(o9, l5, o9).__trim();
          }
          var a5 = i9(e9.length, t8.length) + 1;
          if (e9.sign) {
            var s8 = [t8, e9];
            e9 = s8[0], t8 = s8[1];
          }
          var u5 = g4.__absoluteSubOne(t8, a5);
          return u5 = g4.__absoluteXor(u5, e9, u5), g4.__absoluteAddOne(u5, true, u5).__trim();
        } }, { key: "bitwiseOr", value: function _5(e9, t8) {
          var n11 = i9(e9.length, t8.length);
          if (!e9.sign && !t8.sign) return g4.__absoluteOr(e9, t8).__trim();
          if (e9.sign && t8.sign) {
            var o9 = g4.__absoluteSubOne(e9, n11), l5 = g4.__absoluteSubOne(t8);
            return o9 = g4.__absoluteAnd(o9, l5, o9), g4.__absoluteAddOne(o9, true, o9).__trim();
          }
          if (e9.sign) {
            var a5 = [t8, e9];
            e9 = a5[0], t8 = a5[1];
          }
          var s8 = g4.__absoluteSubOne(t8, n11);
          return s8 = g4.__absoluteAndNot(s8, e9, s8), g4.__absoluteAddOne(s8, true, s8).__trim();
        } }, { key: "asIntN", value: function o9(e9, t8) {
          if (0 === t8.length) return t8;
          if (e9 = _4(e9), 0 > e9) throw new RangeError("Invalid value: not (convertible to) a safe integer");
          if (0 === e9) return g4.__zero();
          if (e9 >= g4.__kMaxLengthBits) return t8;
          var l5 = 0 | (e9 + 29) / 30;
          if (t8.length < l5) return t8;
          var a5 = t8.__unsignedDigit(l5 - 1), s8 = 1 << (e9 - 1) % 30;
          if (t8.length === l5 && a5 < s8) return t8;
          var u5 = (a5 & s8) === s8;
          if (!u5) return g4.__truncateToNBits(e9, t8);
          if (!t8.sign) return g4.__truncateAndSubFromPowerOfTwo(e9, t8, true);
          if (0 == (a5 & s8 - 1)) {
            for (var r8 = l5 - 2; 0 <= r8; r8--) if (0 !== t8.__digit(r8)) return g4.__truncateAndSubFromPowerOfTwo(e9, t8, false);
            return t8.length === l5 && a5 === s8 ? t8 : g4.__truncateToNBits(e9, t8);
          }
          return g4.__truncateAndSubFromPowerOfTwo(e9, t8, false);
        } }, { key: "asUintN", value: function i10(e9, t8) {
          if (0 === t8.length) return t8;
          if (e9 = _4(e9), 0 > e9) throw new RangeError("Invalid value: not (convertible to) a safe integer");
          if (0 === e9) return g4.__zero();
          if (t8.sign) {
            if (e9 > g4.__kMaxLengthBits) throw new RangeError("BigInt too big");
            return g4.__truncateAndSubFromPowerOfTwo(e9, t8, false);
          }
          if (e9 >= g4.__kMaxLengthBits) return t8;
          var o9 = 0 | (e9 + 29) / 30;
          if (t8.length < o9) return t8;
          var l5 = e9 % 30;
          if (t8.length == o9) {
            if (0 === l5) return t8;
            var a5 = t8.__digit(o9 - 1);
            if (0 == a5 >>> l5) return t8;
          }
          return g4.__truncateToNBits(e9, t8);
        } }, { key: "ADD", value: function i10(e9, t8) {
          if (e9 = g4.__toPrimitive(e9), t8 = g4.__toPrimitive(t8), "string" == typeof e9) return "string" != typeof t8 && (t8 = t8.toString()), e9 + t8;
          if ("string" == typeof t8) return e9.toString() + t8;
          if (e9 = g4.__toNumeric(e9), t8 = g4.__toNumeric(t8), g4.__isBigInt(e9) && g4.__isBigInt(t8)) return g4.add(e9, t8);
          if ("number" == typeof e9 && "number" == typeof t8) return e9 + t8;
          throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
        } }, { key: "LT", value: function i10(e9, t8) {
          return g4.__compare(e9, t8, 0);
        } }, { key: "LE", value: function i10(e9, t8) {
          return g4.__compare(e9, t8, 1);
        } }, { key: "GT", value: function i10(e9, t8) {
          return g4.__compare(e9, t8, 2);
        } }, { key: "GE", value: function i10(e9, t8) {
          return g4.__compare(e9, t8, 3);
        } }, { key: "EQ", value: function i10(e9, t8) {
          for (; true; ) {
            if (g4.__isBigInt(e9)) return g4.__isBigInt(t8) ? g4.equal(e9, t8) : g4.EQ(t8, e9);
            if ("number" == typeof e9) {
              if (g4.__isBigInt(t8)) return g4.__equalToNumber(t8, e9);
              if ("object" !== p4(t8)) return e9 == t8;
              t8 = g4.__toPrimitive(t8);
            } else if ("string" == typeof e9) {
              if (g4.__isBigInt(t8)) return e9 = g4.__fromString(e9), null !== e9 && g4.equal(e9, t8);
              if ("object" !== p4(t8)) return e9 == t8;
              t8 = g4.__toPrimitive(t8);
            } else if ("boolean" == typeof e9) {
              if (g4.__isBigInt(t8)) return g4.__equalToNumber(t8, +e9);
              if ("object" !== p4(t8)) return e9 == t8;
              t8 = g4.__toPrimitive(t8);
            } else if ("symbol" === p4(e9)) {
              if (g4.__isBigInt(t8)) return false;
              if ("object" !== p4(t8)) return e9 == t8;
              t8 = g4.__toPrimitive(t8);
            } else if ("object" === p4(e9)) {
              if ("object" === p4(t8) && t8.constructor !== g4) return e9 == t8;
              e9 = g4.__toPrimitive(e9);
            } else return e9 == t8;
          }
        } }, { key: "NE", value: function i10(e9, t8) {
          return !g4.EQ(e9, t8);
        } }, { key: "DataViewGetBigInt64", value: function i10(e9, t8) {
          var _5 = !!(2 < arguments.length && void 0 !== arguments[2]) && arguments[2];
          return g4.asIntN(64, g4.DataViewGetBigUint64(e9, t8, _5));
        } }, { key: "DataViewGetBigUint64", value: function i10(e9, t8) {
          var _5 = !!(2 < arguments.length && void 0 !== arguments[2]) && arguments[2], n11 = _5 ? [4, 0] : [0, 4], o9 = f5(n11, 2), a5 = o9[0], s8 = o9[1], l5 = e9.getUint32(t8 + a5, _5), u5 = e9.getUint32(t8 + s8, _5), r8 = new g4(3, false);
          return r8.__setDigit(0, 1073741823 & u5), r8.__setDigit(1, (268435455 & l5) << 2 | u5 >>> 30), r8.__setDigit(2, l5 >>> 28), r8.__trim();
        } }, { key: "DataViewSetBigInt64", value: function _5(e9, t8, i10) {
          var n11 = !!(3 < arguments.length && void 0 !== arguments[3]) && arguments[3];
          g4.DataViewSetBigUint64(e9, t8, i10, n11);
        } }, { key: "DataViewSetBigUint64", value: function _5(e9, t8, i10) {
          var n11 = !!(3 < arguments.length && void 0 !== arguments[3]) && arguments[3];
          i10 = g4.asUintN(64, i10);
          var o9 = 0, a5 = 0;
          if (0 < i10.length && (a5 = i10.__digit(0), 1 < i10.length)) {
            var s8 = i10.__digit(1);
            a5 |= s8 << 30, o9 = s8 >>> 2, 2 < i10.length && (o9 |= i10.__digit(2) << 28);
          }
          var u5 = n11 ? [4, 0] : [0, 4], r8 = f5(u5, 2), d5 = r8[0], h8 = r8[1];
          e9.setUint32(t8 + d5, o9, n11), e9.setUint32(t8 + h8, a5, n11);
        } }, { key: "__zero", value: function e9() {
          return new g4(0, false);
        } }, { key: "__oneDigit", value: function i10(e9, t8) {
          var _5 = new g4(1, t8);
          return _5.__setDigit(0, e9), _5;
        } }, { key: "__decideRounding", value: function n11(e9, t8, i10, _5) {
          if (0 < t8) return -1;
          var o9;
          if (0 > t8) o9 = -t8 - 1;
          else {
            if (0 === i10) return -1;
            i10--, _5 = e9.__digit(i10), o9 = 29;
          }
          var l5 = 1 << o9;
          if (0 == (_5 & l5)) return -1;
          if (l5 -= 1, 0 != (_5 & l5)) return 1;
          for (; 0 < i10; ) if (i10--, 0 !== e9.__digit(i10)) return 1;
          return 0;
        } }, { key: "__fromDouble", value: function t8(e9) {
          var i10 = 0 > e9;
          g4.__kBitConversionDouble[0] = e9;
          var _5, n11 = 2047 & g4.__kBitConversionInts[g4.__kBitConversionIntHigh] >>> 20, o9 = n11 - 1023, l5 = (0 | o9 / 30) + 1, a5 = new g4(l5, i10), s8 = 1048576, u5 = 1048575 & g4.__kBitConversionInts[g4.__kBitConversionIntHigh] | s8, r8 = g4.__kBitConversionInts[g4.__kBitConversionIntLow], d5 = 20, h8 = o9 % 30, b5 = 0;
          if (h8 < d5) {
            var m5 = d5 - h8;
            b5 = m5 + 32, _5 = u5 >>> m5, u5 = u5 << 32 - m5 | r8 >>> m5, r8 <<= 32 - m5;
          } else if (h8 === d5) b5 = 32, _5 = u5, u5 = r8, r8 = 0;
          else {
            var c8 = h8 - d5;
            b5 = 32 - c8, _5 = u5 << c8 | r8 >>> 32 - c8, u5 = r8 << c8, r8 = 0;
          }
          a5.__setDigit(l5 - 1, _5);
          for (var v4 = l5 - 2; 0 <= v4; v4--) 0 < b5 ? (b5 -= 30, _5 = u5 >>> 2, u5 = u5 << 30 | r8 >>> 2, r8 <<= 30) : _5 = 0, a5.__setDigit(v4, _5);
          return a5.__trim();
        } }, { key: "__isWhitespace", value: function t8(e9) {
          return !!(13 >= e9 && 9 <= e9) || (159 >= e9 ? 32 == e9 : 131071 >= e9 ? 160 == e9 || 5760 == e9 : 196607 >= e9 ? (e9 &= 131071, 10 >= e9 || 40 == e9 || 41 == e9 || 47 == e9 || 95 == e9 || 4096 == e9) : 65279 == e9);
        } }, { key: "__fromString", value: function t8(e9) {
          var i10 = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0, _5 = 0, n11 = e9.length, o9 = 0;
          if (o9 === n11) return g4.__zero();
          for (var l5 = e9.charCodeAt(o9); g4.__isWhitespace(l5); ) {
            if (++o9 === n11) return g4.__zero();
            l5 = e9.charCodeAt(o9);
          }
          if (43 === l5) {
            if (++o9 === n11) return null;
            l5 = e9.charCodeAt(o9), _5 = 1;
          } else if (45 === l5) {
            if (++o9 === n11) return null;
            l5 = e9.charCodeAt(o9), _5 = -1;
          }
          if (0 === i10) {
            if (i10 = 10, 48 === l5) {
              if (++o9 === n11) return g4.__zero();
              if (l5 = e9.charCodeAt(o9), 88 === l5 || 120 === l5) {
                if (i10 = 16, ++o9 === n11) return null;
                l5 = e9.charCodeAt(o9);
              } else if (79 === l5 || 111 === l5) {
                if (i10 = 8, ++o9 === n11) return null;
                l5 = e9.charCodeAt(o9);
              } else if (66 === l5 || 98 === l5) {
                if (i10 = 2, ++o9 === n11) return null;
                l5 = e9.charCodeAt(o9);
              }
            }
          } else if (16 === i10 && 48 === l5) {
            if (++o9 === n11) return g4.__zero();
            if (l5 = e9.charCodeAt(o9), 88 === l5 || 120 === l5) {
              if (++o9 === n11) return null;
              l5 = e9.charCodeAt(o9);
            }
          }
          if (0 !== _5 && 10 !== i10) return null;
          for (; 48 === l5; ) {
            if (++o9 === n11) return g4.__zero();
            l5 = e9.charCodeAt(o9);
          }
          var a5 = n11 - o9, s8 = g4.__kMaxBitsPerChar[i10], u5 = g4.__kBitsPerCharTableMultiplier - 1;
          if (a5 > 1073741824 / s8) return null;
          var r8 = s8 * a5 + u5 >>> g4.__kBitsPerCharTableShift, h8 = 0 | (r8 + 29) / 30, b5 = new g4(h8, false), c8 = 10 > i10 ? i10 : 10, v4 = 10 < i10 ? i10 - 10 : 0;
          if (0 == (i10 & i10 - 1)) {
            s8 >>= g4.__kBitsPerCharTableShift;
            var y5 = [], f6 = [], k4 = false;
            do {
              for (var D4, p5 = 0, B4 = 0; true; ) {
                if (D4 = void 0, l5 - 48 >>> 0 < c8) D4 = l5 - 48;
                else if ((32 | l5) - 97 >>> 0 < v4) D4 = (32 | l5) - 87;
                else {
                  k4 = true;
                  break;
                }
                if (B4 += s8, p5 = p5 << s8 | D4, ++o9 === n11) {
                  k4 = true;
                  break;
                }
                if (l5 = e9.charCodeAt(o9), 30 < B4 + s8) break;
              }
              y5.push(p5), f6.push(B4);
            } while (!k4);
            g4.__fillFromParts(b5, y5, f6);
          } else {
            b5.__initializeDigits();
            var S5 = false, C4 = 0;
            do {
              for (var I3, A3 = 0, T3 = 1; true; ) {
                if (I3 = void 0, l5 - 48 >>> 0 < c8) I3 = l5 - 48;
                else if ((32 | l5) - 97 >>> 0 < v4) I3 = (32 | l5) - 87;
                else {
                  S5 = true;
                  break;
                }
                var P3 = T3 * i10;
                if (1073741823 < P3) break;
                if (T3 = P3, A3 = A3 * i10 + I3, C4++, ++o9 === n11) {
                  S5 = true;
                  break;
                }
                l5 = e9.charCodeAt(o9);
              }
              u5 = 30 * g4.__kBitsPerCharTableMultiplier - 1;
              var O2 = 0 | (s8 * C4 + u5 >>> g4.__kBitsPerCharTableShift) / 30;
              b5.__inplaceMultiplyAdd(T3, A3, O2);
            } while (!S5);
          }
          if (o9 !== n11) {
            if (!g4.__isWhitespace(l5)) return null;
            for (o9++; o9 < n11; o9++) if (l5 = e9.charCodeAt(o9), !g4.__isWhitespace(l5)) return null;
          }
          return b5.sign = -1 === _5, b5.__trim();
        } }, { key: "__fillFromParts", value: function n11(e9, t8, _5) {
          for (var o9 = 0, l5 = 0, g5 = 0, a5 = t8.length - 1; 0 <= a5; a5--) {
            var s8 = t8[a5], u5 = _5[a5];
            l5 |= s8 << g5, g5 += u5, 30 === g5 ? (e9.__setDigit(o9++, l5), g5 = 0, l5 = 0) : 30 < g5 && (e9.__setDigit(o9++, 1073741823 & l5), g5 -= 30, l5 = s8 >>> u5 - g5);
          }
          if (0 !== l5) {
            if (o9 >= e9.length) throw new Error("implementation bug");
            e9.__setDigit(o9++, l5);
          }
          for (; o9 < e9.length; o9++) e9.__setDigit(o9, 0);
        } }, { key: "__toStringBasePowerOfTwo", value: function _5(e9, t8) {
          var n11 = e9.length, o9 = t8 - 1;
          o9 = (85 & o9 >>> 1) + (85 & o9), o9 = (51 & o9 >>> 2) + (51 & o9), o9 = (15 & o9 >>> 4) + (15 & o9);
          var l5 = o9, a5 = t8 - 1, s8 = e9.__digit(n11 - 1), u5 = g4.__clz30(s8), r8 = 30 * n11 - u5, d5 = 0 | (r8 + l5 - 1) / l5;
          if (e9.sign && d5++, 268435456 < d5) throw new Error("string too long");
          for (var h8 = Array(d5), b5 = d5 - 1, m5 = 0, c8 = 0, v4 = 0; v4 < n11 - 1; v4++) {
            var y5 = e9.__digit(v4), f6 = (m5 | y5 << c8) & a5;
            h8[b5--] = g4.__kConversionChars[f6];
            var k4 = l5 - c8;
            for (m5 = y5 >>> k4, c8 = 30 - k4; c8 >= l5; ) h8[b5--] = g4.__kConversionChars[m5 & a5], m5 >>>= l5, c8 -= l5;
          }
          var D4 = (m5 | s8 << c8) & a5;
          for (h8[b5--] = g4.__kConversionChars[D4], m5 = s8 >>> l5 - c8; 0 !== m5; ) h8[b5--] = g4.__kConversionChars[m5 & a5], m5 >>>= l5;
          if (e9.sign && (h8[b5--] = "-"), -1 !== b5) throw new Error("implementation bug");
          return h8.join("");
        } }, { key: "__toStringGeneric", value: function n11(e9, t8, _5) {
          var o9 = e9.length;
          if (0 === o9) return "";
          if (1 === o9) {
            var l5 = e9.__unsignedDigit(0).toString(t8);
            return false === _5 && e9.sign && (l5 = "-" + l5), l5;
          }
          var a5 = 30 * o9 - g4.__clz30(e9.__digit(o9 - 1)), s8 = g4.__kMaxBitsPerChar[t8], u5 = s8 - 1, r8 = a5 * g4.__kBitsPerCharTableMultiplier;
          r8 += u5 - 1, r8 = 0 | r8 / u5;
          var d5, h8, b5 = r8 + 1 >> 1, m5 = g4.exponentiate(g4.__oneDigit(t8, false), g4.__oneDigit(b5, false)), c8 = m5.__unsignedDigit(0);
          if (1 === m5.length && 32767 >= c8) {
            d5 = new g4(e9.length, false), d5.__initializeDigits();
            for (var v4, y5 = 0, f6 = 2 * e9.length - 1; 0 <= f6; f6--) v4 = y5 << 15 | e9.__halfDigit(f6), d5.__setHalfDigit(f6, 0 | v4 / c8), y5 = 0 | v4 % c8;
            h8 = y5.toString(t8);
          } else {
            var k4 = g4.__absoluteDivLarge(e9, m5, true, true);
            d5 = k4.quotient;
            var D4 = k4.remainder.__trim();
            h8 = g4.__toStringGeneric(D4, t8, true);
          }
          d5.__trim();
          for (var p5 = g4.__toStringGeneric(d5, t8, true); h8.length < b5; ) h8 = "0" + h8;
          return false === _5 && e9.sign && (p5 = "-" + p5), p5 + h8;
        } }, { key: "__unequalSign", value: function t8(e9) {
          return e9 ? -1 : 1;
        } }, { key: "__absoluteGreater", value: function t8(e9) {
          return e9 ? -1 : 1;
        } }, { key: "__absoluteLess", value: function t8(e9) {
          return e9 ? 1 : -1;
        } }, { key: "__compareToBigInt", value: function i10(e9, t8) {
          var _5 = e9.sign;
          if (_5 !== t8.sign) return g4.__unequalSign(_5);
          var n11 = g4.__absoluteCompare(e9, t8);
          return 0 < n11 ? g4.__absoluteGreater(_5) : 0 > n11 ? g4.__absoluteLess(_5) : 0;
        } }, { key: "__compareToNumber", value: function _5(e9, i10) {
          if (g4.__isOneDigitInt(i10)) {
            var n11 = e9.sign, o9 = 0 > i10;
            if (n11 !== o9) return g4.__unequalSign(n11);
            if (0 === e9.length) {
              if (o9) throw new Error("implementation bug");
              return 0 === i10 ? 0 : -1;
            }
            if (1 < e9.length) return g4.__absoluteGreater(n11);
            var l5 = t7(i10), a5 = e9.__unsignedDigit(0);
            return a5 > l5 ? g4.__absoluteGreater(n11) : a5 < l5 ? g4.__absoluteLess(n11) : 0;
          }
          return g4.__compareToDouble(e9, i10);
        } }, { key: "__compareToDouble", value: function i10(e9, t8) {
          if (t8 !== t8) return t8;
          if (t8 === 1 / 0) return -1;
          if (t8 === -Infinity) return 1;
          var _5 = e9.sign, n11 = 0 > t8;
          if (_5 !== n11) return g4.__unequalSign(_5);
          if (0 === t8) throw new Error("implementation bug: should be handled elsewhere");
          if (0 === e9.length) return -1;
          g4.__kBitConversionDouble[0] = t8;
          var o9 = 2047 & g4.__kBitConversionInts[g4.__kBitConversionIntHigh] >>> 20;
          if (2047 == o9) throw new Error("implementation bug: handled elsewhere");
          var l5 = o9 - 1023;
          if (0 > l5) return g4.__absoluteGreater(_5);
          var a5 = e9.length, s8 = e9.__digit(a5 - 1), u5 = g4.__clz30(s8), r8 = 30 * a5 - u5, d5 = l5 + 1;
          if (r8 < d5) return g4.__absoluteLess(_5);
          if (r8 > d5) return g4.__absoluteGreater(_5);
          var h8 = 1048576, b5 = 1048576 | 1048575 & g4.__kBitConversionInts[g4.__kBitConversionIntHigh], m5 = g4.__kBitConversionInts[g4.__kBitConversionIntLow], c8 = 20, v4 = 29 - u5;
          if (v4 !== (0 | (r8 - 1) % 30)) throw new Error("implementation bug");
          var y5, f6 = 0;
          if (v4 < c8) {
            var k4 = c8 - v4;
            f6 = k4 + 32, y5 = b5 >>> k4, b5 = b5 << 32 - k4 | m5 >>> k4, m5 <<= 32 - k4;
          } else if (v4 === c8) f6 = 32, y5 = b5, b5 = m5, m5 = 0;
          else {
            var D4 = v4 - c8;
            f6 = 32 - D4, y5 = b5 << D4 | m5 >>> 32 - D4, b5 = m5 << D4, m5 = 0;
          }
          if (s8 >>>= 0, y5 >>>= 0, s8 > y5) return g4.__absoluteGreater(_5);
          if (s8 < y5) return g4.__absoluteLess(_5);
          for (var p5 = a5 - 2; 0 <= p5; p5--) {
            0 < f6 ? (f6 -= 30, y5 = b5 >>> 2, b5 = b5 << 30 | m5 >>> 2, m5 <<= 30) : y5 = 0;
            var B4 = e9.__unsignedDigit(p5);
            if (B4 > y5) return g4.__absoluteGreater(_5);
            if (B4 < y5) return g4.__absoluteLess(_5);
          }
          if (0 !== b5 || 0 !== m5) {
            if (0 === f6) throw new Error("implementation bug");
            return g4.__absoluteLess(_5);
          }
          return 0;
        } }, { key: "__equalToNumber", value: function _5(e9, i10) {
          return g4.__isOneDigitInt(i10) ? 0 === i10 ? 0 === e9.length : 1 === e9.length && e9.sign === 0 > i10 && e9.__unsignedDigit(0) === t7(i10) : 0 === g4.__compareToDouble(e9, i10);
        } }, { key: "__comparisonResultToBool", value: function i10(e9, t8) {
          return 0 === t8 ? 0 > e9 : 1 === t8 ? 0 >= e9 : 2 === t8 ? 0 < e9 : 3 === t8 ? 0 <= e9 : void 0;
        } }, { key: "__compare", value: function _5(e9, t8, i10) {
          if (e9 = g4.__toPrimitive(e9), t8 = g4.__toPrimitive(t8), "string" == typeof e9 && "string" == typeof t8) switch (i10) {
            case 0:
              return e9 < t8;
            case 1:
              return e9 <= t8;
            case 2:
              return e9 > t8;
            case 3:
              return e9 >= t8;
          }
          if (g4.__isBigInt(e9) && "string" == typeof t8) return t8 = g4.__fromString(t8), null !== t8 && g4.__comparisonResultToBool(g4.__compareToBigInt(e9, t8), i10);
          if ("string" == typeof e9 && g4.__isBigInt(t8)) return e9 = g4.__fromString(e9), null !== e9 && g4.__comparisonResultToBool(g4.__compareToBigInt(e9, t8), i10);
          if (e9 = g4.__toNumeric(e9), t8 = g4.__toNumeric(t8), g4.__isBigInt(e9)) {
            if (g4.__isBigInt(t8)) return g4.__comparisonResultToBool(g4.__compareToBigInt(e9, t8), i10);
            if ("number" != typeof t8) throw new Error("implementation bug");
            return g4.__comparisonResultToBool(g4.__compareToNumber(e9, t8), i10);
          }
          if ("number" != typeof e9) throw new Error("implementation bug");
          if (g4.__isBigInt(t8)) return g4.__comparisonResultToBool(g4.__compareToNumber(t8, e9), 2 ^ i10);
          if ("number" != typeof t8) throw new Error("implementation bug");
          return 0 === i10 ? e9 < t8 : 1 === i10 ? e9 <= t8 : 2 === i10 ? e9 > t8 : 3 === i10 ? e9 >= t8 : void 0;
        } }, { key: "__absoluteAdd", value: function n11(e9, t8, _5) {
          if (e9.length < t8.length) return g4.__absoluteAdd(t8, e9, _5);
          if (0 === e9.length) return e9;
          if (0 === t8.length) return e9.sign === _5 ? e9 : g4.unaryMinus(e9);
          var o9 = e9.length;
          (0 === e9.__clzmsd() || t8.length === e9.length && 0 === t8.__clzmsd()) && o9++;
          for (var l5, a5 = new g4(o9, _5), s8 = 0, u5 = 0; u5 < t8.length; u5++) l5 = e9.__digit(u5) + t8.__digit(u5) + s8, s8 = l5 >>> 30, a5.__setDigit(u5, 1073741823 & l5);
          for (; u5 < e9.length; u5++) {
            var d5 = e9.__digit(u5) + s8;
            s8 = d5 >>> 30, a5.__setDigit(u5, 1073741823 & d5);
          }
          return u5 < a5.length && a5.__setDigit(u5, s8), a5.__trim();
        } }, { key: "__absoluteSub", value: function n11(e9, t8, _5) {
          if (0 === e9.length) return e9;
          if (0 === t8.length) return e9.sign === _5 ? e9 : g4.unaryMinus(e9);
          for (var o9, l5 = new g4(e9.length, _5), a5 = 0, s8 = 0; s8 < t8.length; s8++) o9 = e9.__digit(s8) - t8.__digit(s8) - a5, a5 = 1 & o9 >>> 30, l5.__setDigit(s8, 1073741823 & o9);
          for (; s8 < e9.length; s8++) {
            var u5 = e9.__digit(s8) - a5;
            a5 = 1 & u5 >>> 30, l5.__setDigit(s8, 1073741823 & u5);
          }
          return l5.__trim();
        } }, { key: "__absoluteAddOne", value: function _5(e9, t8) {
          var n11 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, o9 = e9.length;
          null === n11 ? n11 = new g4(o9, t8) : n11.sign = t8;
          for (var l5, a5 = 1, s8 = 0; s8 < o9; s8++) l5 = e9.__digit(s8) + a5, a5 = l5 >>> 30, n11.__setDigit(s8, 1073741823 & l5);
          return 0 !== a5 && n11.__setDigitGrow(o9, 1), n11;
        } }, { key: "__absoluteSubOne", value: function _5(e9, t8) {
          var n11 = e9.length;
          t8 = t8 || n11;
          for (var o9, l5 = new g4(t8, false), a5 = 1, s8 = 0; s8 < n11; s8++) o9 = e9.__digit(s8) - a5, a5 = 1 & o9 >>> 30, l5.__setDigit(s8, 1073741823 & o9);
          if (0 !== a5) throw new Error("implementation bug");
          for (var u5 = n11; u5 < t8; u5++) l5.__setDigit(u5, 0);
          return l5;
        } }, { key: "__absoluteAnd", value: function _5(e9, t8) {
          var n11 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, o9 = e9.length, l5 = t8.length, a5 = l5;
          if (o9 < l5) {
            a5 = o9;
            var s8 = e9, u5 = o9;
            e9 = t8, o9 = l5, t8 = s8, l5 = u5;
          }
          var r8 = a5;
          null === n11 ? n11 = new g4(r8, false) : r8 = n11.length;
          for (var d5 = 0; d5 < a5; d5++) n11.__setDigit(d5, e9.__digit(d5) & t8.__digit(d5));
          for (; d5 < r8; d5++) n11.__setDigit(d5, 0);
          return n11;
        } }, { key: "__absoluteAndNot", value: function _5(e9, t8) {
          var n11 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, o9 = e9.length, l5 = t8.length, a5 = l5;
          o9 < l5 && (a5 = o9);
          var s8 = o9;
          null === n11 ? n11 = new g4(s8, false) : s8 = n11.length;
          for (var u5 = 0; u5 < a5; u5++) n11.__setDigit(u5, e9.__digit(u5) & ~t8.__digit(u5));
          for (; u5 < o9; u5++) n11.__setDigit(u5, e9.__digit(u5));
          for (; u5 < s8; u5++) n11.__setDigit(u5, 0);
          return n11;
        } }, { key: "__absoluteOr", value: function _5(e9, t8) {
          var n11 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, o9 = e9.length, l5 = t8.length, a5 = l5;
          if (o9 < l5) {
            a5 = o9;
            var s8 = e9, u5 = o9;
            e9 = t8, o9 = l5, t8 = s8, l5 = u5;
          }
          var r8 = o9;
          null === n11 ? n11 = new g4(r8, false) : r8 = n11.length;
          for (var d5 = 0; d5 < a5; d5++) n11.__setDigit(d5, e9.__digit(d5) | t8.__digit(d5));
          for (; d5 < o9; d5++) n11.__setDigit(d5, e9.__digit(d5));
          for (; d5 < r8; d5++) n11.__setDigit(d5, 0);
          return n11;
        } }, { key: "__absoluteXor", value: function _5(e9, t8) {
          var n11 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, o9 = e9.length, l5 = t8.length, a5 = l5;
          if (o9 < l5) {
            a5 = o9;
            var s8 = e9, u5 = o9;
            e9 = t8, o9 = l5, t8 = s8, l5 = u5;
          }
          var r8 = o9;
          null === n11 ? n11 = new g4(r8, false) : r8 = n11.length;
          for (var d5 = 0; d5 < a5; d5++) n11.__setDigit(d5, e9.__digit(d5) ^ t8.__digit(d5));
          for (; d5 < o9; d5++) n11.__setDigit(d5, e9.__digit(d5));
          for (; d5 < r8; d5++) n11.__setDigit(d5, 0);
          return n11;
        } }, { key: "__absoluteCompare", value: function _5(e9, t8) {
          var n11 = e9.length - t8.length;
          if (0 != n11) return n11;
          for (var o9 = e9.length - 1; 0 <= o9 && e9.__digit(o9) === t8.__digit(o9); ) o9--;
          return 0 > o9 ? 0 : e9.__unsignedDigit(o9) > t8.__unsignedDigit(o9) ? 1 : -1;
        } }, { key: "__multiplyAccumulate", value: function o9(e9, t8, _5, n11) {
          if (0 !== t8) {
            for (var l5 = 32767 & t8, a5 = t8 >>> 15, s8 = 0, u5 = 0, r8 = 0; r8 < e9.length; r8++, n11++) {
              var d5 = _5.__digit(n11), h8 = e9.__digit(r8), b5 = 32767 & h8, m5 = h8 >>> 15, c8 = g4.__imul(b5, l5), v4 = g4.__imul(b5, a5), y5 = g4.__imul(m5, l5), f6 = g4.__imul(m5, a5);
              d5 += u5 + c8 + s8, s8 = d5 >>> 30, d5 &= 1073741823, d5 += ((32767 & v4) << 15) + ((32767 & y5) << 15), s8 += d5 >>> 30, u5 = f6 + (v4 >>> 15) + (y5 >>> 15), _5.__setDigit(n11, 1073741823 & d5);
            }
            for (; 0 !== s8 || 0 !== u5; n11++) {
              var k4 = _5.__digit(n11);
              k4 += s8 + u5, u5 = 0, s8 = k4 >>> 30, _5.__setDigit(n11, 1073741823 & k4);
            }
          }
        } }, { key: "__internalMultiplyAdd", value: function a5(e9, t8, _5, o9, l5) {
          for (var s8 = _5, u5 = 0, d5 = 0; d5 < o9; d5++) {
            var h8 = e9.__digit(d5), b5 = g4.__imul(32767 & h8, t8), m5 = g4.__imul(h8 >>> 15, t8), c8 = b5 + ((32767 & m5) << 15) + u5 + s8;
            s8 = c8 >>> 30, u5 = m5 >>> 15, l5.__setDigit(d5, 1073741823 & c8);
          }
          if (l5.length > o9) for (l5.__setDigit(o9++, s8 + u5); o9 < l5.length; ) l5.__setDigit(o9++, 0);
          else if (0 !== s8 + u5) throw new Error("implementation bug");
        } }, { key: "__absoluteDivSmall", value: function _5(e9, t8) {
          var n11 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
          null === n11 && (n11 = new g4(e9.length, false));
          for (var o9 = 0, l5 = 2 * e9.length - 1; 0 <= l5; l5 -= 2) {
            var a5 = (o9 << 15 | e9.__halfDigit(l5)) >>> 0, s8 = 0 | a5 / t8;
            o9 = 0 | a5 % t8, a5 = (o9 << 15 | e9.__halfDigit(l5 - 1)) >>> 0;
            var u5 = 0 | a5 / t8;
            o9 = 0 | a5 % t8, n11.__setDigit(l5 >>> 1, s8 << 15 | u5);
          }
          return n11;
        } }, { key: "__absoluteModSmall", value: function _5(e9, t8) {
          for (var n11, o9 = 0, l5 = 2 * e9.length - 1; 0 <= l5; l5--) n11 = (o9 << 15 | e9.__halfDigit(l5)) >>> 0, o9 = 0 | n11 % t8;
          return o9;
        } }, { key: "__absoluteDivLarge", value: function o9(e9, t8, i10, _5) {
          var l5 = t8.__halfDigitLength(), n11 = t8.length, a5 = e9.__halfDigitLength() - l5, s8 = null;
          i10 && (s8 = new g4(a5 + 2 >>> 1, false), s8.__initializeDigits());
          var r8 = new g4(l5 + 2 >>> 1, false);
          r8.__initializeDigits();
          var d5 = g4.__clz15(t8.__halfDigit(l5 - 1));
          0 < d5 && (t8 = g4.__specialLeftShift(t8, d5, 0));
          for (var h8 = g4.__specialLeftShift(e9, d5, 1), u5 = t8.__halfDigit(l5 - 1), b5 = 0, m5 = a5; 0 <= m5; m5--) {
            var v4 = 32767, y5 = h8.__halfDigit(m5 + l5);
            if (y5 !== u5) {
              var f6 = (y5 << 15 | h8.__halfDigit(m5 + l5 - 1)) >>> 0;
              v4 = 0 | f6 / u5;
              for (var k4 = 0 | f6 % u5, D4 = t8.__halfDigit(l5 - 2), p5 = h8.__halfDigit(m5 + l5 - 2); g4.__imul(v4, D4) >>> 0 > (k4 << 16 | p5) >>> 0 && (v4--, k4 += u5, !(32767 < k4)); ) ;
            }
            g4.__internalMultiplyAdd(t8, v4, 0, n11, r8);
            var B4 = h8.__inplaceSub(r8, m5, l5 + 1);
            0 !== B4 && (B4 = h8.__inplaceAdd(t8, m5, l5), h8.__setHalfDigit(m5 + l5, 32767 & h8.__halfDigit(m5 + l5) + B4), v4--), i10 && (1 & m5 ? b5 = v4 << 15 : s8.__setDigit(m5 >>> 1, b5 | v4));
          }
          if (_5) return h8.__inplaceRightShift(d5), i10 ? { quotient: s8, remainder: h8 } : h8;
          if (i10) return s8;
          throw new Error("unreachable");
        } }, { key: "__clz15", value: function t8(e9) {
          return g4.__clz30(e9) - 15;
        } }, { key: "__specialLeftShift", value: function o9(e9, t8, _5) {
          var l5 = e9.length, n11 = l5 + _5, a5 = new g4(n11, false);
          if (0 === t8) {
            for (var s8 = 0; s8 < l5; s8++) a5.__setDigit(s8, e9.__digit(s8));
            return 0 < _5 && a5.__setDigit(l5, 0), a5;
          }
          for (var u5, r8 = 0, h8 = 0; h8 < l5; h8++) u5 = e9.__digit(h8), a5.__setDigit(h8, 1073741823 & u5 << t8 | r8), r8 = u5 >>> 30 - t8;
          return 0 < _5 && a5.__setDigit(l5, r8), a5;
        } }, { key: "__leftShiftByAbsolute", value: function _5(e9, t8) {
          var n11 = g4.__toShiftAmount(t8);
          if (0 > n11) throw new RangeError("BigInt too big");
          var o9 = 0 | n11 / 30, l5 = n11 % 30, a5 = e9.length, s8 = 0 !== l5 && 0 != e9.__digit(a5 - 1) >>> 30 - l5, u5 = a5 + o9 + (s8 ? 1 : 0), r8 = new g4(u5, e9.sign);
          if (0 === l5) {
            for (var h8 = 0; h8 < o9; h8++) r8.__setDigit(h8, 0);
            for (; h8 < u5; h8++) r8.__setDigit(h8, e9.__digit(h8 - o9));
          } else {
            for (var b5 = 0, m5 = 0; m5 < o9; m5++) r8.__setDigit(m5, 0);
            for (var c8, v4 = 0; v4 < a5; v4++) c8 = e9.__digit(v4), r8.__setDigit(v4 + o9, 1073741823 & c8 << l5 | b5), b5 = c8 >>> 30 - l5;
            if (s8) r8.__setDigit(a5 + o9, b5);
            else if (0 !== b5) throw new Error("implementation bug");
          }
          return r8.__trim();
        } }, { key: "__rightShiftByAbsolute", value: function _5(e9, t8) {
          var n11 = e9.length, o9 = e9.sign, l5 = g4.__toShiftAmount(t8);
          if (0 > l5) return g4.__rightShiftByMaximum(o9);
          var a5 = 0 | l5 / 30, s8 = l5 % 30, u5 = n11 - a5;
          if (0 >= u5) return g4.__rightShiftByMaximum(o9);
          var r8 = false;
          if (o9) {
            var h8 = (1 << s8) - 1;
            if (0 != (e9.__digit(a5) & h8)) r8 = true;
            else for (var b5 = 0; b5 < a5; b5++) if (0 !== e9.__digit(b5)) {
              r8 = true;
              break;
            }
          }
          if (r8 && 0 === s8) {
            var m5 = e9.__digit(n11 - 1), c8 = 0 == ~m5;
            c8 && u5++;
          }
          var v4 = new g4(u5, o9);
          if (0 === s8) {
            v4.__setDigit(u5 - 1, 0);
            for (var y5 = a5; y5 < n11; y5++) v4.__setDigit(y5 - a5, e9.__digit(y5));
          } else {
            for (var f6, k4 = e9.__digit(a5) >>> s8, D4 = n11 - a5 - 1, p5 = 0; p5 < D4; p5++) f6 = e9.__digit(p5 + a5 + 1), v4.__setDigit(p5, 1073741823 & f6 << 30 - s8 | k4), k4 = f6 >>> s8;
            v4.__setDigit(D4, k4);
          }
          return r8 && (v4 = g4.__absoluteAddOne(v4, true, v4)), v4.__trim();
        } }, { key: "__rightShiftByMaximum", value: function t8(e9) {
          return e9 ? g4.__oneDigit(1, true) : g4.__zero();
        } }, { key: "__toShiftAmount", value: function t8(e9) {
          if (1 < e9.length) return -1;
          var i10 = e9.__unsignedDigit(0);
          return i10 > g4.__kMaxLengthBits ? -1 : i10;
        } }, { key: "__toPrimitive", value: function t8(e9) {
          var i10 = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "default";
          if ("object" !== p4(e9)) return e9;
          if (e9.constructor === g4) return e9;
          if ("undefined" != typeof Symbol && "symbol" === p4(Symbol.toPrimitive) && e9[Symbol.toPrimitive]) {
            var _5 = e9[Symbol.toPrimitive](i10);
            if ("object" !== p4(_5)) return _5;
            throw new TypeError("Cannot convert object to primitive value");
          }
          var n11 = e9.valueOf;
          if (n11) {
            var o9 = n11.call(e9);
            if ("object" !== p4(o9)) return o9;
          }
          var l5 = e9.toString;
          if (l5) {
            var a5 = l5.call(e9);
            if ("object" !== p4(a5)) return a5;
          }
          throw new TypeError("Cannot convert object to primitive value");
        } }, { key: "__toNumeric", value: function t8(e9) {
          return g4.__isBigInt(e9) ? e9 : +e9;
        } }, { key: "__isBigInt", value: function t8(e9) {
          return "object" === p4(e9) && null !== e9 && e9.constructor === g4;
        } }, { key: "__truncateToNBits", value: function _5(e9, t8) {
          for (var n11 = 0 | (e9 + 29) / 30, o9 = new g4(n11, t8.sign), l5 = n11 - 1, a5 = 0; a5 < l5; a5++) o9.__setDigit(a5, t8.__digit(a5));
          var s8 = t8.__digit(l5);
          if (0 != e9 % 30) {
            var u5 = 32 - e9 % 30;
            s8 = s8 << u5 >>> u5;
          }
          return o9.__setDigit(l5, s8), o9.__trim();
        } }, { key: "__truncateAndSubFromPowerOfTwo", value: function n11(e9, t8, _5) {
          for (var o9 = Math.min, l5, a5 = 0 | (e9 + 29) / 30, s8 = new g4(a5, _5), u5 = 0, d5 = a5 - 1, h8 = 0, b5 = o9(d5, t8.length); u5 < b5; u5++) l5 = 0 - t8.__digit(u5) - h8, h8 = 1 & l5 >>> 30, s8.__setDigit(u5, 1073741823 & l5);
          for (; u5 < d5; u5++) s8.__setDigit(u5, 0 | 1073741823 & -h8);
          var m5, c8 = d5 < t8.length ? t8.__digit(d5) : 0, v4 = e9 % 30;
          if (0 === v4) m5 = 0 - c8 - h8, m5 &= 1073741823;
          else {
            var y5 = 32 - v4;
            c8 = c8 << y5 >>> y5;
            var f6 = 1 << 32 - y5;
            m5 = f6 - c8 - h8, m5 &= f6 - 1;
          }
          return s8.__setDigit(d5, m5), s8.__trim();
        } }, { key: "__digitPow", value: function i10(e9, t8) {
          for (var _5 = 1; 0 < t8; ) 1 & t8 && (_5 *= e9), t8 >>>= 1, e9 *= e9;
          return _5;
        } }, { key: "__detectBigEndian", value: function e9() {
          return g4.__kBitConversionDouble[0] = -0, 0 !== g4.__kBitConversionInts[0];
        } }, { key: "__isOneDigitInt", value: function t8(e9) {
          return (1073741823 & e9) === e9;
        } }]);
      }(S4(Array));
      return C3.__kMaxLength = 33554432, C3.__kMaxLengthBits = C3.__kMaxLength << 5, C3.__kMaxBitsPerChar = [0, 0, 32, 51, 64, 75, 83, 90, 96, 102, 107, 111, 115, 119, 122, 126, 128, 131, 134, 136, 139, 141, 143, 145, 147, 149, 151, 153, 154, 156, 158, 159, 160, 162, 163, 165, 166], C3.__kBitsPerCharTableShift = 5, C3.__kBitsPerCharTableMultiplier = 1 << C3.__kBitsPerCharTableShift, C3.__kConversionChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], C3.__kBitConversionBuffer = new ArrayBuffer(8), C3.__kBitConversionDouble = new Float64Array(C3.__kBitConversionBuffer), C3.__kBitConversionInts = new Int32Array(C3.__kBitConversionBuffer), C3.__kBitConversionIntHigh = C3.__detectBigEndian() ? 0 : 1, C3.__kBitConversionIntLow = C3.__detectBigEndian() ? 1 : 0, C3.__clz30 = t6 ? function(e8) {
        return t6(e8) - 2;
      } : function(e8) {
        var t7 = Math.LN2, i9 = Math.log;
        return 0 === e8 ? 30 : 0 | 29 - (0 | i9(e8 >>> 0) / t7);
      }, C3.__imul = e7 || function(e8, t7) {
        return 0 | e8 * t7;
      }, C3;
    });
  }
});

// node_modules/@js-temporal/polyfill/dist/index.esm.js
function m3(t6) {
  return "bigint" == typeof t6 ? import_jsbi.default.BigInt(t6.toString(10)) : t6;
}
function f4(n10) {
  return import_jsbi.default.equal(import_jsbi.default.remainder(n10, r6), t5);
}
function y3(n10) {
  return import_jsbi.default.lessThan(n10, t5) ? import_jsbi.default.unaryMinus(n10) : n10;
}
function p3(t6, n10) {
  return import_jsbi.default.lessThan(t6, n10) ? -1 : import_jsbi.default.greaterThan(t6, n10) ? 1 : 0;
}
function g2(t6, n10) {
  return { quotient: import_jsbi.default.divide(t6, n10), remainder: import_jsbi.default.remainder(t6, n10) };
}
function ne(e7, ...t6) {
  if (!e7 || "object" != typeof e7) return false;
  const n10 = Q(e7);
  return !!n10 && t6.every((e8) => e8 in n10);
}
function re(e7, t6) {
  const n10 = Q(e7)?.[t6];
  if (void 0 === n10) throw new TypeError(`Missing internal slot ${t6}`);
  return n10;
}
function oe(e7, t6, n10) {
  const r7 = Q(e7);
  if (void 0 === r7) throw new TypeError("Missing slots for the given container");
  if (r7[t6]) throw new TypeError(`${t6} already has set`);
  r7[t6] = n10;
}
function ae(e7, t6) {
  Object.defineProperty(e7.prototype, Symbol.toStringTag, { value: t6, writable: false, enumerable: false, configurable: true });
  const n10 = Object.getOwnPropertyNames(e7);
  for (let t7 = 0; t7 < n10.length; t7++) {
    const r8 = n10[t7], o8 = Object.getOwnPropertyDescriptor(e7, r8);
    o8.configurable && o8.enumerable && (o8.enumerable = false, Object.defineProperty(e7, r8, o8));
  }
  const r7 = Object.getOwnPropertyNames(e7.prototype);
  for (let t7 = 0; t7 < r7.length; t7++) {
    const n11 = r7[t7], o8 = Object.getOwnPropertyDescriptor(e7.prototype, n11);
    o8.configurable && o8.enumerable && (o8.enumerable = false, Object.defineProperty(e7.prototype, n11, o8));
  }
  se(t6, e7), se(`${t6}.prototype`, e7.prototype);
}
function se(e7, t6) {
  const n10 = `%${e7}%`;
  if (void 0 !== ie[n10]) throw new Error(`intrinsic ${e7} already exists`);
  ie[n10] = t6;
}
function ce(e7) {
  return ie[e7];
}
function de(e7, t6) {
  let n10 = e7;
  if (0 === n10) return { div: n10, mod: n10 };
  const r7 = Math.sign(n10);
  n10 = Math.abs(n10);
  const o8 = Math.trunc(1 + Math.log10(n10));
  if (t6 >= o8) return { div: 0 * r7, mod: r7 * n10 };
  if (0 === t6) return { div: r7 * n10, mod: 0 * r7 };
  const i8 = n10.toPrecision(o8);
  return { div: r7 * Number.parseInt(i8.slice(0, o8 - t6), 10), mod: r7 * Number.parseInt(i8.slice(o8 - t6), 10) };
}
function he(e7, t6, n10) {
  let r7 = e7, o8 = n10;
  if (0 === r7) return o8;
  const i8 = Math.sign(r7) || Math.sign(o8);
  r7 = Math.abs(r7), o8 = Math.abs(o8);
  const a4 = r7.toPrecision(Math.trunc(1 + Math.log10(r7)));
  if (0 === o8) return i8 * Number.parseInt(a4 + "0".repeat(t6), 10);
  const s7 = a4 + o8.toPrecision(Math.trunc(1 + Math.log10(o8))).padStart(t6, "0");
  return i8 * Number.parseInt(s7, 10);
}
function ue(e7, t6) {
  const n10 = "negative" === t6;
  switch (e7) {
    case "ceil":
      return n10 ? "zero" : "infinity";
    case "floor":
      return n10 ? "infinity" : "zero";
    case "expand":
      return "infinity";
    case "trunc":
      return "zero";
    case "halfCeil":
      return n10 ? "half-zero" : "half-infinity";
    case "halfFloor":
      return n10 ? "half-infinity" : "half-zero";
    case "halfExpand":
      return "half-infinity";
    case "halfTrunc":
      return "half-zero";
    case "halfEven":
      return "half-even";
  }
}
function le(e7, t6, n10, r7, o8) {
  return "zero" === o8 ? e7 : "infinity" === o8 ? t6 : n10 < 0 ? e7 : n10 > 0 ? t6 : "half-zero" === o8 ? e7 : "half-infinity" === o8 ? t6 : r7 ? e7 : t6;
}
function Ae(e7) {
  return "object" == typeof e7 && null !== e7 || "function" == typeof e7;
}
function qe(e7) {
  if ("bigint" == typeof e7) throw new TypeError("Cannot convert BigInt to number");
  return Number(e7);
}
function We(e7) {
  if ("symbol" == typeof e7) throw new TypeError("Cannot convert a Symbol value to a String");
  return String(e7);
}
function _e(e7) {
  const t6 = qe(e7);
  if (0 === t6) return 0;
  if (Number.isNaN(t6) || t6 === 1 / 0 || t6 === -1 / 0) throw new RangeError("invalid number value");
  const n10 = Math.trunc(t6);
  return 0 === n10 ? 0 : n10;
}
function Je(e7, t6) {
  const n10 = _e(e7);
  if (n10 <= 0) {
    if (void 0 !== t6) throw new RangeError(`property '${t6}' cannot be a a number less than one`);
    throw new RangeError("Cannot convert a number less than one to a positive integer");
  }
  return n10;
}
function Ge(e7) {
  const t6 = qe(e7);
  if (Number.isNaN(t6)) throw new RangeError("not a number");
  if (t6 === 1 / 0 || t6 === -1 / 0) throw new RangeError("infinity is out of range");
  if (!function(e8) {
    if ("number" != typeof e8 || Number.isNaN(e8) || e8 === 1 / 0 || e8 === -1 / 0) return false;
    const t7 = Math.abs(e8);
    return Math.floor(t7) === t7;
  }(t6)) throw new RangeError(`unsupported fractional value ${e7}`);
  return 0 === t6 ? 0 : t6;
}
function Ke(e7, t6) {
  return String(e7).padStart(t6, "0");
}
function Ve(e7) {
  if ("string" != typeof e7) throw new TypeError(`expected a string, not ${String(e7)}`);
  return e7;
}
function Xe(e7, t6) {
  if (Ae(e7)) {
    const t7 = e7?.toString();
    if ("string" == typeof t7 || "number" == typeof t7) return t7;
    throw new TypeError("Cannot convert object to primitive value");
  }
  return e7;
}
function ht(e7) {
  const t6 = Ao(e7);
  let n10 = dt.get(t6);
  return void 0 === n10 && (n10 = new ct("en-us", { timeZone: t6, hour12: false, era: "short", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }), dt.set(t6, n10)), n10;
}
function ut(e7) {
  return ne(e7, b3) && !ne(e7, $2, E2);
}
function lt(e7) {
  return ne(e7, Y, R2, j2, k2, N2, x2, L2, P2, U);
}
function mt(e7) {
  return ne(e7, I2);
}
function ft(e7) {
  return ne(e7, M2);
}
function yt(e7) {
  return ne(e7, T2);
}
function pt(e7) {
  return ne(e7, C2);
}
function gt(e7) {
  return ne(e7, O);
}
function wt(e7) {
  return ne(e7, b3, $2, E2);
}
function vt(e7, t6) {
  if (!t6(e7)) throw new TypeError("invalid receiver: method called with the wrong type of this-object");
}
function bt(e7) {
  if (ne(e7, E2) || ne(e7, $2)) throw new TypeError("with() does not support a calendar or timeZone property");
  if (ft(e7)) throw new TypeError("with() does not accept Temporal.PlainTime, use withPlainTime() instead");
  if (void 0 !== e7.calendar) throw new TypeError("with() does not support a calendar property");
  if (void 0 !== e7.timeZone) throw new TypeError("with() does not support a timeZone property");
}
function Dt(e7, t6) {
  return "never" === t6 || "auto" === t6 && "iso8601" === e7 ? "" : `[${"critical" === t6 ? "!" : ""}u-ca=${e7}]`;
}
function Tt(e7) {
  let t6, n10, r7 = false;
  for (Te.lastIndex = 0; n10 = Te.exec(e7); ) {
    const { 1: o8, 2: i8, 3: a4 } = n10;
    if ("u-ca" === i8) {
      if (void 0 === t6) t6 = a4, r7 = "!" === o8;
      else if ("!" === o8 || r7) throw new RangeError(`Invalid annotations in ${e7}: more than one u-ca present with critical flag`);
    } else if ("!" === o8) throw new RangeError(`Unrecognized annotation: !${i8}=${a4}`);
  }
  return t6;
}
function Mt(e7) {
  const t6 = Me.exec(e7);
  if (!t6) throw new RangeError(`invalid RFC 9557 string: ${e7}`);
  const n10 = Tt(t6[16]);
  let r7 = t6[1];
  if ("-000000" === r7) throw new RangeError(`invalid RFC 9557 string: ${e7}`);
  const o8 = +r7, i8 = +(t6[2] ?? t6[4] ?? 1), a4 = +(t6[3] ?? t6[5] ?? 1), s7 = void 0 !== t6[6], c7 = +(t6[6] ?? 0), d4 = +(t6[7] ?? t6[10] ?? 0);
  let h7 = +(t6[8] ?? t6[11] ?? 0);
  60 === h7 && (h7 = 59);
  const u4 = (t6[9] ?? t6[12] ?? "") + "000000000", l4 = +u4.slice(0, 3), m4 = +u4.slice(3, 6), f5 = +u4.slice(6, 9);
  let y4, p4 = false;
  t6[13] ? (y4 = void 0, p4 = true) : t6[14] && (y4 = t6[14]);
  const g3 = t6[15];
  return Ur(o8, i8, a4, c7, d4, h7, l4, m4, f5), { year: o8, month: i8, day: a4, time: s7 ? { hour: c7, minute: d4, second: h7, millisecond: l4, microsecond: m4, nanosecond: f5 } : "start-of-day", tzAnnotation: g3, offset: y4, z: p4, calendar: n10 };
}
function Et(e7) {
  const t6 = Ee.exec(e7);
  let n10, r7, o8, i8, a4, s7, c7;
  if (t6) {
    c7 = Tt(t6[10]), n10 = +(t6[1] ?? 0), r7 = +(t6[2] ?? t6[5] ?? 0), o8 = +(t6[3] ?? t6[6] ?? 0), 60 === o8 && (o8 = 59);
    const e8 = (t6[4] ?? t6[7] ?? "") + "000000000";
    if (i8 = +e8.slice(0, 3), a4 = +e8.slice(3, 6), s7 = +e8.slice(6, 9), t6[8]) throw new RangeError("Z designator not supported for PlainTime");
  } else {
    let t7, d4;
    if ({ time: t7, z: d4, calendar: c7 } = Mt(e7), "start-of-day" === t7) throw new RangeError(`time is missing in string: ${e7}`);
    if (d4) throw new RangeError("Z designator not supported for PlainTime");
    ({ hour: n10, minute: r7, second: o8, millisecond: i8, microsecond: a4, nanosecond: s7 } = t7);
  }
  if (Pr(n10, r7, o8, i8, a4, s7), /[tT ][0-9][0-9]/.test(e7)) return { hour: n10, minute: r7, second: o8, millisecond: i8, microsecond: a4, nanosecond: s7, calendar: c7 };
  try {
    const { month: t7, day: n11 } = Ct(e7);
    xr(1972, t7, n11);
  } catch {
    try {
      const { year: t7, month: n11 } = It(e7);
      xr(t7, n11, 1);
    } catch {
      return { hour: n10, minute: r7, second: o8, millisecond: i8, microsecond: a4, nanosecond: s7, calendar: c7 };
    }
  }
  throw new RangeError(`invalid RFC 9557 time-only string ${e7}; may need a T prefix`);
}
function It(e7) {
  const t6 = Ie.exec(e7);
  let n10, r7, o8, i8;
  if (t6) {
    o8 = Tt(t6[3]);
    let a4 = t6[1];
    if ("-000000" === a4) throw new RangeError(`invalid RFC 9557 string: ${e7}`);
    if (n10 = +a4, r7 = +t6[2], i8 = 1, void 0 !== o8 && "iso8601" !== o8) throw new RangeError("YYYY-MM format is only valid with iso8601 calendar");
  } else {
    let t7;
    if ({ year: n10, month: r7, calendar: o8, day: i8, z: t7 } = Mt(e7), t7) throw new RangeError("Z designator not supported for PlainYearMonth");
  }
  return { year: n10, month: r7, calendar: o8, referenceISODay: i8 };
}
function Ct(e7) {
  const t6 = Ce.exec(e7);
  let n10, r7, o8, i8;
  if (t6) {
    if (o8 = Tt(t6[3]), n10 = +t6[1], r7 = +t6[2], void 0 !== o8 && "iso8601" !== o8) throw new RangeError("MM-DD format is only valid with iso8601 calendar");
  } else {
    let t7;
    if ({ month: n10, day: r7, calendar: o8, year: i8, z: t7 } = Mt(e7), t7) throw new RangeError("Z designator not supported for PlainMonthDay");
  }
  return { month: n10, day: r7, calendar: o8, referenceISOYear: i8 };
}
function Yt(e7) {
  const t6 = Wo.test(e7) ? "Seconds not allowed in offset time zone" : "Invalid time zone";
  throw new RangeError(`${t6}: ${e7}`);
}
function Rt(e7) {
  return Ot.test(e7) || Yt(e7), $t.test(e7) ? { offsetMinutes: sr(e7) / 6e10 } : { tzName: e7 };
}
function St(e7, t6, n10, r7) {
  let o8 = e7, i8 = t6, a4 = n10;
  switch (r7) {
    case "reject":
      xr(o8, i8, a4);
      break;
    case "constrain":
      ({ year: o8, month: i8, day: a4 } = kr(o8, i8, a4));
  }
  return { year: o8, month: i8, day: a4 };
}
function jt(e7, t6, n10, r7, o8, i8, a4) {
  let s7 = e7, c7 = t6, d4 = n10, h7 = r7, u4 = o8, l4 = i8;
  switch (a4) {
    case "reject":
      Pr(s7, c7, d4, h7, u4, l4);
      break;
    case "constrain":
      s7 = jr(s7, 0, 23), c7 = jr(c7, 0, 59), d4 = jr(d4, 0, 59), h7 = jr(h7, 0, 999), u4 = jr(u4, 0, 999), l4 = jr(l4, 0, 999);
  }
  return { hour: s7, minute: c7, second: d4, millisecond: h7, microsecond: u4, nanosecond: l4 };
}
function kt(e7) {
  if (!Ae(e7)) throw new TypeError("invalid duration-like");
  const t6 = { years: void 0, months: void 0, weeks: void 0, days: void 0, hours: void 0, minutes: void 0, seconds: void 0, milliseconds: void 0, microseconds: void 0, nanoseconds: void 0 };
  let n10 = false;
  for (let r7 = 0; r7 < st.length; r7++) {
    const o8 = st[r7], i8 = e7[o8];
    void 0 !== i8 && (n10 = true, t6[o8] = Ge(i8));
  }
  if (!n10) throw new TypeError("invalid duration-like");
  return t6;
}
function Nt({ years: e7, months: t6, weeks: n10, days: r7 }, o8, i8, a4) {
  return { years: e7, months: a4 ?? t6, weeks: i8 ?? n10, days: o8 ?? r7 };
}
function xt(e7, t6) {
  return { isoDate: e7, time: t6 };
}
function Lt(e7) {
  return Ho(e7, "overflow", ["constrain", "reject"], "constrain");
}
function Pt(e7) {
  return Ho(e7, "disambiguation", ["compatible", "earlier", "later", "reject"], "compatible");
}
function Ut(e7, t6) {
  return Ho(e7, "roundingMode", ["ceil", "floor", "expand", "trunc", "halfCeil", "halfFloor", "halfExpand", "halfTrunc", "halfEven"], t6);
}
function Bt(e7, t6) {
  return Ho(e7, "offset", ["prefer", "use", "ignore", "reject"], t6);
}
function Zt(e7) {
  return Ho(e7, "calendarName", ["auto", "always", "never", "critical"], "auto");
}
function Ft(e7) {
  let t6 = e7.roundingIncrement;
  if (void 0 === t6) return 1;
  const n10 = _e(t6);
  if (n10 < 1 || n10 > 1e9) throw new RangeError(`roundingIncrement must be at least 1 and at most 1e9, not ${t6}`);
  return n10;
}
function Ht(e7, t6, n10) {
  const r7 = n10 ? t6 : t6 - 1;
  if (e7 > r7) throw new RangeError(`roundingIncrement must be at least 1 and less than ${r7}, not ${e7}`);
  if (t6 % e7 != 0) throw new RangeError(`Rounding increment must divide evenly into ${t6}`);
}
function zt(e7) {
  const t6 = e7.fractionalSecondDigits;
  if (void 0 === t6) return "auto";
  if ("number" != typeof t6) {
    if ("auto" !== We(t6)) throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${t6}`);
    return "auto";
  }
  const n10 = Math.floor(t6);
  if (!Number.isFinite(n10) || n10 < 0 || n10 > 9) throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${t6}`);
  return n10;
}
function At(e7, t6) {
  switch (e7) {
    case "minute":
      return { precision: "minute", unit: "minute", increment: 1 };
    case "second":
      return { precision: 0, unit: "second", increment: 1 };
    case "millisecond":
      return { precision: 3, unit: "millisecond", increment: 1 };
    case "microsecond":
      return { precision: 6, unit: "microsecond", increment: 1 };
    case "nanosecond":
      return { precision: 9, unit: "nanosecond", increment: 1 };
  }
  switch (t6) {
    case "auto":
      return { precision: t6, unit: "nanosecond", increment: 1 };
    case 0:
      return { precision: t6, unit: "second", increment: 1 };
    case 1:
    case 2:
    case 3:
      return { precision: t6, unit: "millisecond", increment: 10 ** (3 - t6) };
    case 4:
    case 5:
    case 6:
      return { precision: t6, unit: "microsecond", increment: 10 ** (6 - t6) };
    case 7:
    case 8:
    case 9:
      return { precision: t6, unit: "nanosecond", increment: 10 ** (9 - t6) };
    default:
      throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${t6}`);
  }
}
function Wt(e7, t6, n10, r7, o8 = []) {
  let i8 = [];
  for (let e8 = 0; e8 < nt.length; e8++) {
    const t7 = nt[e8], r8 = t7[1], o9 = t7[2];
    "datetime" !== n10 && n10 !== o9 || i8.push(r8);
  }
  i8 = i8.concat(o8);
  let a4 = r7;
  a4 === qt ? a4 = void 0 : void 0 !== a4 && i8.push(a4);
  let s7 = [];
  s7 = s7.concat(i8);
  for (let e8 = 0; e8 < i8.length; e8++) {
    const t7 = i8[e8], n11 = ot[t7];
    void 0 !== n11 && s7.push(n11);
  }
  let c7 = Ho(e7, t6, s7, a4);
  if (void 0 === c7 && r7 === qt) throw new RangeError(`${t6} is required`);
  return c7 && c7 in rt ? rt[c7] : c7;
}
function _t(e7) {
  const t6 = e7.relativeTo;
  if (void 0 === t6) return {};
  let n10, r7, o8, i8, a4, s7 = "option", c7 = false;
  if (Ae(t6)) {
    if (wt(t6)) return { zonedRelativeTo: t6 };
    if (mt(t6)) return { plainRelativeTo: t6 };
    if (yt(t6)) return { plainRelativeTo: pn(re(t6, T2).isoDate, re(t6, E2)) };
    o8 = Nn(t6);
    const e8 = tn(o8, t6, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset", "timeZone"], []);
    ({ isoDate: n10, time: r7 } = on(o8, e8, "constrain")), { offset: a4, timeZone: i8 } = e8, void 0 === a4 && (s7 = "wall");
  } else {
    let e8, d4, h7, u4, l4;
    if ({ year: h7, month: u4, day: l4, time: r7, calendar: o8, tzAnnotation: e8, offset: a4, z: d4 } = Mt(Ve(t6)), e8) i8 = Bn(e8), d4 ? s7 = "exact" : a4 || (s7 = "wall"), c7 = true;
    else if (d4) throw new RangeError("Z designator not supported for PlainDate relativeTo; either remove the Z or add a bracketed time zone");
    o8 || (o8 = "iso8601"), o8 = zo(o8), n10 = { year: h7, month: u4, day: l4 };
  }
  return void 0 === i8 ? { plainRelativeTo: pn(n10, o8) } : { zonedRelativeTo: $n(mn(n10, r7, s7, "option" === s7 ? sr(a4) : 0, i8, "compatible", "reject", c7), i8, o8) };
}
function Jt(e7) {
  return 0 !== re(e7, Y) ? "year" : 0 !== re(e7, R2) ? "month" : 0 !== re(e7, S3) ? "week" : 0 !== re(e7, j2) ? "day" : 0 !== re(e7, k2) ? "hour" : 0 !== re(e7, N2) ? "minute" : 0 !== re(e7, x2) ? "second" : 0 !== re(e7, L2) ? "millisecond" : 0 !== re(e7, P2) ? "microsecond" : "nanosecond";
}
function Gt(e7, t6) {
  return it.indexOf(e7) > it.indexOf(t6) ? t6 : e7;
}
function Kt(e7) {
  return "year" === e7 || "month" === e7 || "week" === e7;
}
function Vt(e7) {
  return Kt(e7) || "day" === e7 ? "date" : "time";
}
function Xt(e7) {
  return ce("%calendarImpl%")(e7);
}
function Qt(e7) {
  return ce("%calendarImpl%")(re(e7, E2));
}
function en(e7, t6, n10 = "date") {
  const r7 = /* @__PURE__ */ Object.create(null), o8 = Xt(e7).isoToDate(t6, { year: true, monthCode: true, day: true });
  return r7.monthCode = o8.monthCode, "month-day" !== n10 && "date" !== n10 || (r7.day = o8.day), "year-month" !== n10 && "date" !== n10 || (r7.year = o8.year), r7;
}
function tn(e7, t6, n10, r7, o8) {
  const i8 = Xt(e7).extraFields(n10), a4 = n10.concat(r7, i8), s7 = /* @__PURE__ */ Object.create(null);
  let c7 = false;
  a4.sort();
  for (let e8 = 0; e8 < a4.length; e8++) {
    const n11 = a4[e8], r8 = t6[n11];
    if (void 0 !== r8) c7 = true, s7[n11] = (0, et[n11])(r8);
    else if ("partial" !== o8) {
      if (o8.includes(n11)) throw new TypeError(`required property '${n11}' missing or undefined`);
      s7[n11] = tt[n11];
    }
  }
  if ("partial" === o8 && !c7) throw new TypeError("no supported properties found");
  return s7;
}
function nn(e7, t6 = "complete") {
  const n10 = ["hour", "microsecond", "millisecond", "minute", "nanosecond", "second"];
  let r7 = false;
  const o8 = /* @__PURE__ */ Object.create(null);
  for (let i8 = 0; i8 < n10.length; i8++) {
    const a4 = n10[i8], s7 = e7[a4];
    void 0 !== s7 ? (o8[a4] = _e(s7), r7 = true) : "complete" === t6 && (o8[a4] = 0);
  }
  if (!r7) throw new TypeError("invalid time-like");
  return o8;
}
function rn(e7, t6) {
  if (Ae(e7)) {
    if (mt(e7)) return Lt(Zo(t6)), pn(re(e7, D2), re(e7, E2));
    if (wt(e7)) {
      const n12 = zn(re(e7, $2), re(e7, b3));
      return Lt(Zo(t6)), pn(n12.isoDate, re(e7, E2));
    }
    if (yt(e7)) return Lt(Zo(t6)), pn(re(e7, T2).isoDate, re(e7, E2));
    const n11 = Nn(e7);
    return pn(Ln(n11, tn(n11, e7, ["year", "month", "monthCode", "day"], [], []), Lt(Zo(t6))), n11);
  }
  let { year: n10, month: r7, day: o8, calendar: i8, z: a4 } = Mt(Ve(e7));
  if (a4) throw new RangeError("Z designator not supported for PlainDate");
  return i8 || (i8 = "iso8601"), i8 = zo(i8), Lt(Zo(t6)), pn({ year: n10, month: r7, day: o8 }, i8);
}
function on(e7, t6, n10) {
  return xt(Ln(e7, t6, n10), jt(t6.hour, t6.minute, t6.second, t6.millisecond, t6.microsecond, t6.nanosecond, n10));
}
function an(e7, t6) {
  let n10, r7, o8;
  if (Ae(e7)) {
    if (yt(e7)) return Lt(Zo(t6)), wn(re(e7, T2), re(e7, E2));
    if (wt(e7)) {
      const n11 = zn(re(e7, $2), re(e7, b3));
      return Lt(Zo(t6)), wn(n11, re(e7, E2));
    }
    if (mt(e7)) return Lt(Zo(t6)), wn(xt(re(e7, D2), { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), re(e7, E2));
    o8 = Nn(e7);
    const i8 = tn(o8, e7, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond"], []), a4 = Lt(Zo(t6));
    ({ isoDate: n10, time: r7 } = on(o8, i8, a4));
  } else {
    let i8, a4, s7, c7;
    if ({ year: a4, month: s7, day: c7, time: r7, calendar: o8, z: i8 } = Mt(Ve(e7)), i8) throw new RangeError("Z designator not supported for PlainDateTime");
    "start-of-day" === r7 && (r7 = { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), Ur(a4, s7, c7, r7.hour, r7.minute, r7.second, r7.millisecond, r7.microsecond, r7.nanosecond), o8 || (o8 = "iso8601"), o8 = zo(o8), Lt(Zo(t6)), n10 = { year: a4, month: s7, day: c7 };
  }
  return wn(xt(n10, r7), o8);
}
function sn(e7) {
  const t6 = ce("%Temporal.Duration%");
  if (lt(e7)) return new t6(re(e7, Y), re(e7, R2), re(e7, S3), re(e7, j2), re(e7, k2), re(e7, N2), re(e7, x2), re(e7, L2), re(e7, P2), re(e7, U));
  if (!Ae(e7)) return function(e8) {
    const { years: t7, months: n11, weeks: r8, days: o8, hours: i8, minutes: a4, seconds: s7, milliseconds: c7, microseconds: d4, nanoseconds: h7 } = function(e9) {
      const t8 = Ye.exec(e9);
      if (!t8) throw new RangeError(`invalid duration: ${e9}`);
      if (t8.every((e10, t9) => t9 < 2 || void 0 === e10)) throw new RangeError(`invalid duration: ${e9}`);
      const n12 = "-" === t8[1] ? -1 : 1, r9 = void 0 === t8[2] ? 0 : _e(t8[2]) * n12, o9 = void 0 === t8[3] ? 0 : _e(t8[3]) * n12, i9 = void 0 === t8[4] ? 0 : _e(t8[4]) * n12, a5 = void 0 === t8[5] ? 0 : _e(t8[5]) * n12, s8 = void 0 === t8[6] ? 0 : _e(t8[6]) * n12, c8 = t8[7], d5 = t8[8], h8 = t8[9], u4 = t8[10], l4 = t8[11];
      let m4 = 0, f5 = 0, y4 = 0;
      if (void 0 !== c8) {
        if (d5 ?? h8 ?? u4 ?? l4) throw new RangeError("only the smallest unit can be fractional");
        y4 = 3600 * _e((c8 + "000000000").slice(0, 9)) * n12;
      } else if (m4 = void 0 === d5 ? 0 : _e(d5) * n12, void 0 !== h8) {
        if (u4 ?? l4) throw new RangeError("only the smallest unit can be fractional");
        y4 = 60 * _e((h8 + "000000000").slice(0, 9)) * n12;
      } else f5 = void 0 === u4 ? 0 : _e(u4) * n12, void 0 !== l4 && (y4 = _e((l4 + "000000000").slice(0, 9)) * n12);
      const p4 = y4 % 1e3, g3 = Math.trunc(y4 / 1e3) % 1e3, w3 = Math.trunc(y4 / 1e6) % 1e3;
      return f5 += Math.trunc(y4 / 1e9) % 60, m4 += Math.trunc(y4 / 6e10), zr(r9, o9, i9, a5, s8, m4, f5, w3, g3, p4), { years: r9, months: o9, weeks: i9, days: a5, hours: s8, minutes: m4, seconds: f5, milliseconds: w3, microseconds: g3, nanoseconds: p4 };
    }(e8);
    return new (ce("%Temporal.Duration%"))(t7, n11, r8, o8, i8, a4, s7, c7, d4, h7);
  }(Ve(e7));
  const n10 = { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, microseconds: 0, nanoseconds: 0 };
  let r7 = kt(e7);
  for (let e8 = 0; e8 < st.length; e8++) {
    const t7 = st[e8], o8 = r7[t7];
    void 0 !== o8 && (n10[t7] = o8);
  }
  return new t6(n10.years, n10.months, n10.weeks, n10.days, n10.hours, n10.minutes, n10.seconds, n10.milliseconds, n10.microseconds, n10.nanoseconds);
}
function cn(e7) {
  let t6;
  if (Ae(e7)) {
    if (ut(e7) || wt(e7)) return Cn(re(e7, b3));
    t6 = Xe(e7);
  } else t6 = e7;
  const { year: n10, month: r7, day: o8, time: i8, offset: a4, z: s7 } = function(e8) {
    const t7 = Mt(e8);
    if (!t7.z && !t7.offset) throw new RangeError("Temporal.Instant requires a time zone offset");
    return t7;
  }(Ve(t6)), { hour: c7 = 0, minute: d4 = 0, second: h7 = 0, millisecond: u4 = 0, microsecond: l4 = 0, nanosecond: m4 = 0 } = "start-of-day" === i8 ? {} : i8, f5 = $r(n10, r7, o8, c7, d4, h7, u4, l4, m4 - (s7 ? 0 : sr(a4)));
  return Kr(f5.isoDate), Cn(pr(f5));
}
function dn(e7, t6) {
  if (Ae(e7)) {
    if (gt(e7)) return Lt(Zo(t6)), bn(re(e7, D2), re(e7, E2));
    let n11;
    return ne(e7, E2) ? n11 = re(e7, E2) : (n11 = e7.calendar, void 0 === n11 && (n11 = "iso8601"), n11 = kn(n11)), bn(Un(n11, tn(n11, e7, ["year", "month", "monthCode", "day"], [], []), Lt(Zo(t6))), n11);
  }
  let { month: n10, day: r7, referenceISOYear: o8, calendar: i8 } = Ct(Ve(e7));
  if (void 0 === i8 && (i8 = "iso8601"), i8 = zo(i8), Lt(Zo(t6)), "iso8601" === i8) return bn({ year: 1972, month: n10, day: r7 }, i8);
  let a4 = { year: o8, month: n10, day: r7 };
  return Lr(a4), a4 = Un(i8, en(i8, a4, "month-day"), "constrain"), bn(a4, i8);
}
function hn(e7, t6) {
  let n10;
  if (Ae(e7)) {
    if (ft(e7)) return Lt(Zo(t6)), Tn(re(e7, M2));
    if (yt(e7)) return Lt(Zo(t6)), Tn(re(e7, T2).time);
    if (wt(e7)) {
      const n11 = zn(re(e7, $2), re(e7, b3));
      return Lt(Zo(t6)), Tn(n11.time);
    }
    const { hour: r7, minute: o8, second: i8, millisecond: a4, microsecond: s7, nanosecond: c7 } = nn(e7);
    n10 = jt(r7, o8, i8, a4, s7, c7, Lt(Zo(t6)));
  } else n10 = Et(Ve(e7)), Lt(Zo(t6));
  return Tn(n10);
}
function un(e7) {
  return void 0 === e7 ? { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 } : re(hn(e7), M2);
}
function ln(e7, t6) {
  if (Ae(e7)) {
    if (pt(e7)) return Lt(Zo(t6)), En(re(e7, D2), re(e7, E2));
    const n11 = Nn(e7);
    return En(Pn(n11, tn(n11, e7, ["year", "month", "monthCode"], [], []), Lt(Zo(t6))), n11);
  }
  let { year: n10, month: r7, referenceISODay: o8, calendar: i8 } = It(Ve(e7));
  void 0 === i8 && (i8 = "iso8601"), i8 = zo(i8), Lt(Zo(t6));
  let a4 = { year: n10, month: r7, day: o8 };
  return Hr(a4), a4 = Pn(i8, en(i8, a4, "year-month"), "constrain"), En(a4, i8);
}
function mn(t6, n10, r7, o8, i8, a4, s7, c7) {
  if ("start-of-day" === n10) return _n(i8, t6);
  const d4 = xt(t6, n10);
  if ("wall" === r7 || "ignore" === s7) return An(i8, d4, a4);
  if ("exact" === r7 || "use" === s7) {
    const e7 = $r(t6.year, t6.month, t6.day, n10.hour, n10.minute, n10.second, n10.millisecond, n10.microsecond, n10.nanosecond - o8);
    Kr(e7.isoDate);
    const r8 = pr(e7);
    return Fr(r8), r8;
  }
  Kr(t6);
  const h7 = pr(d4), u4 = Wn(i8, d4);
  for (let t7 = 0; t7 < u4.length; t7++) {
    const n11 = u4[t7], r8 = import_jsbi.default.toNumber(import_jsbi.default.subtract(h7, n11)), i9 = Eo(r8, 6e10, "halfExpand");
    if (r8 === o8 || c7 && i9 === o8) return n11;
  }
  if ("reject" === s7) {
    const e7 = Hn(o8), t7 = nr(d4, "iso8601", "auto");
    throw new RangeError(`Offset ${e7} is invalid for ${t7} in ${i8}`);
  }
  return qn(u4, i8, d4, a4);
}
function fn(e7, t6) {
  let n10, r7, o8, i8, a4, s7, c7, d4 = false, h7 = "option";
  if (Ae(e7)) {
    if (wt(e7)) {
      const n11 = Zo(t6);
      return Pt(n11), Bt(n11, "reject"), Lt(n11), $n(re(e7, b3), re(e7, $2), re(e7, E2));
    }
    a4 = Nn(e7);
    const d5 = tn(a4, e7, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset", "timeZone"], ["timeZone"]);
    ({ offset: i8, timeZone: o8 } = d5), void 0 === i8 && (h7 = "wall");
    const u5 = Zo(t6);
    s7 = Pt(u5), c7 = Bt(u5, "reject");
    const l4 = Lt(u5);
    ({ isoDate: n10, time: r7 } = on(a4, d5, l4));
  } else {
    let u5, l4, m4, f5, y4;
    ({ year: m4, month: f5, day: y4, time: r7, tzAnnotation: u5, offset: i8, z: l4, calendar: a4 } = function(e8) {
      const t7 = Mt(e8);
      if (!t7.tzAnnotation) throw new RangeError("Temporal.ZonedDateTime requires a time zone ID in brackets");
      return t7;
    }(Ve(e7))), o8 = Bn(u5), l4 ? h7 = "exact" : i8 || (h7 = "wall"), a4 || (a4 = "iso8601"), a4 = zo(a4), d4 = true;
    const p4 = Zo(t6);
    s7 = Pt(p4), c7 = Bt(p4, "reject"), Lt(p4), n10 = { year: m4, month: f5, day: y4 };
  }
  let u4 = 0;
  return "option" === h7 && (u4 = sr(i8)), $n(mn(n10, r7, h7, u4, o8, s7, c7, d4), o8, a4);
}
function yn(e7, t6, n10) {
  Lr(t6), te(e7), oe(e7, D2, t6), oe(e7, E2, n10), oe(e7, I2, true);
}
function pn(e7, t6) {
  const n10 = ce("%Temporal.PlainDate%"), r7 = Object.create(n10.prototype);
  return yn(r7, e7, t6), r7;
}
function gn(e7, t6, n10) {
  Br(t6), te(e7), oe(e7, T2, t6), oe(e7, E2, n10);
}
function wn(e7, t6) {
  const n10 = ce("%Temporal.PlainDateTime%"), r7 = Object.create(n10.prototype);
  return gn(r7, e7, t6), r7;
}
function vn(e7, t6, n10) {
  Lr(t6), te(e7), oe(e7, D2, t6), oe(e7, E2, n10), oe(e7, O, true);
}
function bn(e7, t6) {
  const n10 = ce("%Temporal.PlainMonthDay%"), r7 = Object.create(n10.prototype);
  return vn(r7, e7, t6), r7;
}
function Dn(e7, t6) {
  te(e7), oe(e7, M2, t6);
}
function Tn(e7) {
  const t6 = ce("%Temporal.PlainTime%"), n10 = Object.create(t6.prototype);
  return Dn(n10, e7), n10;
}
function Mn(e7, t6, n10) {
  Hr(t6), te(e7), oe(e7, D2, t6), oe(e7, E2, n10), oe(e7, C2, true);
}
function En(e7, t6) {
  const n10 = ce("%Temporal.PlainYearMonth%"), r7 = Object.create(n10.prototype);
  return Mn(r7, e7, t6), r7;
}
function In(e7, t6) {
  Fr(t6), te(e7), oe(e7, b3, t6);
}
function Cn(e7) {
  const t6 = ce("%Temporal.Instant%"), n10 = Object.create(t6.prototype);
  return In(n10, e7), n10;
}
function On(e7, t6, n10, r7) {
  Fr(t6), te(e7), oe(e7, b3, t6), oe(e7, $2, n10), oe(e7, E2, r7);
}
function $n(e7, t6, n10 = "iso8601") {
  const r7 = ce("%Temporal.ZonedDateTime%"), o8 = Object.create(r7.prototype);
  return On(o8, e7, t6, n10), o8;
}
function Yn(e7) {
  return Qe.filter((t6) => void 0 !== e7[t6]);
}
function Rn(e7, t6, n10) {
  const r7 = Yn(n10), o8 = Xt(e7).fieldKeysToIgnore(r7), i8 = /* @__PURE__ */ Object.create(null), a4 = Yn(t6);
  for (let e8 = 0; e8 < Qe.length; e8++) {
    let s7;
    const c7 = Qe[e8];
    a4.includes(c7) && !o8.includes(c7) && (s7 = t6[c7]), r7.includes(c7) && (s7 = n10[c7]), void 0 !== s7 && (i8[c7] = s7);
  }
  return i8;
}
function Sn(e7, t6, n10, r7) {
  const o8 = Xt(e7).dateAdd(t6, n10, r7);
  return Lr(o8), o8;
}
function jn(e7, t6, n10, r7) {
  return Xt(e7).dateUntil(t6, n10, r7);
}
function kn(e7) {
  if (Ae(e7) && ne(e7, E2)) return re(e7, E2);
  const t6 = Ve(e7);
  try {
    return zo(t6);
  } catch {
  }
  let n10;
  try {
    ({ calendar: n10 } = Mt(t6));
  } catch {
    try {
      ({ calendar: n10 } = Et(t6));
    } catch {
      try {
        ({ calendar: n10 } = It(t6));
      } catch {
        ({ calendar: n10 } = Ct(t6));
      }
    }
  }
  return n10 || (n10 = "iso8601"), zo(n10);
}
function Nn(e7) {
  if (ne(e7, E2)) return re(e7, E2);
  const { calendar: t6 } = e7;
  return void 0 === t6 ? "iso8601" : kn(t6);
}
function xn(e7, t6) {
  return zo(e7) === zo(t6);
}
function Ln(e7, t6, n10) {
  const r7 = Xt(e7);
  r7.resolveFields(t6, "date");
  const o8 = r7.dateToISO(t6, n10);
  return Lr(o8), o8;
}
function Pn(e7, t6, n10) {
  const r7 = Xt(e7);
  r7.resolveFields(t6, "year-month"), t6.day = 1;
  const o8 = r7.dateToISO(t6, n10);
  return Hr(o8), o8;
}
function Un(e7, t6, n10) {
  const r7 = Xt(e7);
  r7.resolveFields(t6, "month-day");
  const o8 = r7.monthDayToISOReferenceDate(t6, n10);
  return Lr(o8), o8;
}
function Bn(e7) {
  if (Ae(e7) && wt(e7)) return re(e7, $2);
  const t6 = Ve(e7);
  if ("UTC" === t6) return "UTC";
  const { tzName: n10, offsetMinutes: r7 } = function(e8) {
    const { tzAnnotation: t7, offset: n11, z: r8 } = function(e9) {
      if (Ot.test(e9)) return { tzAnnotation: e9, offset: void 0, z: false };
      try {
        const { tzAnnotation: t8, offset: n12, z: r9 } = Mt(e9);
        if (r9 || t8 || n12) return { tzAnnotation: t8, offset: n12, z: r9 };
      } catch {
      }
      Yt(e9);
    }(e8);
    return t7 ? Rt(t7) : r8 ? Rt("UTC") : n11 ? Rt(n11) : void 0;
  }(t6);
  if (void 0 !== r7) return mr(r7);
  const o8 = hr(n10);
  if (!o8) throw new RangeError(`Unrecognized time zone ${n10}`);
  return o8.identifier;
}
function Zn(e7, t6) {
  if (e7 === t6) return true;
  const n10 = Rt(e7).offsetMinutes, r7 = Rt(t6).offsetMinutes;
  if (void 0 === n10 && void 0 === r7) {
    const n11 = hr(t6);
    if (!n11) return false;
    const r8 = hr(e7);
    return !!r8 && r8.primaryIdentifier === n11.primaryIdentifier;
  }
  return n10 === r7;
}
function Fn(e7, t6) {
  const n10 = Rt(e7).offsetMinutes;
  return void 0 !== n10 ? 6e10 * n10 : lr(e7, t6);
}
function Hn(e7) {
  const t6 = e7 < 0 ? "-" : "+", n10 = Math.abs(e7), r7 = Math.floor(n10 / 36e11), o8 = Math.floor(n10 / 6e10) % 60, i8 = Math.floor(n10 / 1e9) % 60, a4 = n10 % 1e9;
  return `${t6}${Vn(r7, o8, i8, a4, 0 === i8 && 0 === a4 ? "minute" : "auto")}`;
}
function zn(e7, t6) {
  const n10 = Fn(e7, t6);
  let { isoDate: { year: r7, month: o8, day: i8 }, time: { hour: a4, minute: s7, second: c7, millisecond: d4, microsecond: h7, nanosecond: u4 } } = gr(t6);
  return $r(r7, o8, i8, a4, s7, c7, d4, h7, u4 + n10);
}
function An(e7, t6, n10) {
  return qn(Wn(e7, t6), e7, t6, n10);
}
function qn(t6, n10, r7, o8) {
  const i8 = t6.length;
  if (1 === i8) return t6[0];
  if (i8) switch (o8) {
    case "compatible":
    case "earlier":
      return t6[0];
    case "later":
      return t6[i8 - 1];
    case "reject":
      throw new RangeError("multiple instants found");
  }
  if ("reject" === o8) throw new RangeError("multiple instants found");
  const a4 = pr(r7), s7 = import_jsbi.default.subtract(a4, l3);
  Fr(s7);
  const c7 = Fn(n10, s7), d4 = import_jsbi.default.add(a4, l3);
  Fr(d4);
  const h7 = Fn(n10, d4) - c7;
  switch (o8) {
    case "earlier": {
      const e7 = TimeDuration.fromComponents(0, 0, 0, 0, 0, -h7), t7 = fo(r7.time, e7);
      return Wn(n10, xt(Or(r7.isoDate.year, r7.isoDate.month, r7.isoDate.day + t7.deltaDays), t7))[0];
    }
    case "compatible":
    case "later": {
      const e7 = TimeDuration.fromComponents(0, 0, 0, 0, 0, h7), t7 = fo(r7.time, e7), o9 = Wn(n10, xt(Or(r7.isoDate.year, r7.isoDate.month, r7.isoDate.day + t7.deltaDays), t7));
      return o9[o9.length - 1];
    }
  }
}
function Wn(t6, n10) {
  if ("UTC" === t6) return Kr(n10.isoDate), [pr(n10)];
  const r7 = Rt(t6).offsetMinutes;
  if (void 0 !== r7) {
    const e7 = $r(n10.isoDate.year, n10.isoDate.month, n10.isoDate.day, n10.time.hour, n10.time.minute - r7, n10.time.second, n10.time.millisecond, n10.time.microsecond, n10.time.nanosecond);
    Kr(e7.isoDate);
    const t7 = pr(e7);
    return Fr(t7), [t7];
  }
  return Kr(n10.isoDate), function(t7, n11) {
    let r8 = pr(n11), o8 = import_jsbi.default.subtract(r8, l3);
    import_jsbi.default.lessThan(o8, xe) && (o8 = r8);
    let i8 = import_jsbi.default.add(r8, l3);
    import_jsbi.default.greaterThan(i8, Ne) && (i8 = r8);
    const a4 = lr(t7, o8), s7 = lr(t7, i8), c7 = (a4 === s7 ? [a4] : [a4, s7]).map((o9) => {
      const i9 = import_jsbi.default.subtract(r8, import_jsbi.default.BigInt(o9)), a5 = function(e7, t8) {
        const { epochMilliseconds: n12, time: { millisecond: r9, microsecond: o10, nanosecond: i10 } } = gr(t8), { year: a6, month: s8, day: c8, hour: d4, minute: h7, second: u4 } = br(e7, n12);
        return $r(a6, s8, c8, d4, h7, u4, r9, o10, i10);
      }(t7, i9);
      if (0 === jo(n11, a5)) return Fr(i9), i9;
    });
    return c7.filter((e7) => void 0 !== e7);
  }(t6, n10);
}
function _n(t6, n10) {
  const r7 = xt(n10, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), o8 = Wn(t6, r7);
  if (o8.length) return o8[0];
  const i8 = pr(r7), a4 = import_jsbi.default.subtract(i8, l3);
  return Fr(a4), wr(t6, a4);
}
function Jn(e7) {
  let t6;
  return t6 = e7 < 0 || e7 > 9999 ? (e7 < 0 ? "-" : "+") + Ke(Math.abs(e7), 6) : Ke(e7, 4), t6;
}
function Gn(e7) {
  return Ke(e7, 2);
}
function Kn(e7, t6) {
  let n10;
  if ("auto" === t6) {
    if (0 === e7) return "";
    n10 = Ke(e7, 9).replace(/0+$/, "");
  } else {
    if (0 === t6) return "";
    n10 = Ke(e7, 9).slice(0, t6);
  }
  return `.${n10}`;
}
function Vn(e7, t6, n10, r7, o8) {
  let i8 = `${Gn(e7)}:${Gn(t6)}`;
  return "minute" === o8 || (i8 += `:${Gn(n10)}`, i8 += Kn(r7, o8)), i8;
}
function Xn(e7, t6, n10) {
  let r7 = t6;
  void 0 === r7 && (r7 = "UTC");
  const o8 = re(e7, b3), i8 = nr(zn(r7, o8), "iso8601", n10, "never");
  let a4 = "Z";
  return void 0 !== t6 && (a4 = fr(Fn(r7, o8))), `${i8}${a4}`;
}
function Qn(e7, t6) {
  const n10 = re(e7, Y), r7 = re(e7, R2), o8 = re(e7, S3), i8 = re(e7, j2), a4 = re(e7, k2), s7 = re(e7, N2), c7 = Mr(e7);
  let d4 = "";
  0 !== n10 && (d4 += `${Math.abs(n10)}Y`), 0 !== r7 && (d4 += `${Math.abs(r7)}M`), 0 !== o8 && (d4 += `${Math.abs(o8)}W`), 0 !== i8 && (d4 += `${Math.abs(i8)}D`);
  let h7 = "";
  0 !== a4 && (h7 += `${Math.abs(a4)}H`), 0 !== s7 && (h7 += `${Math.abs(s7)}M`);
  const u4 = TimeDuration.fromComponents(0, 0, re(e7, x2), re(e7, L2), re(e7, P2), re(e7, U));
  u4.isZero() && !["second", "millisecond", "microsecond", "nanosecond"].includes(Jt(e7)) && "auto" === t6 || (h7 += `${Math.abs(u4.sec)}${Kn(Math.abs(u4.subsec), t6)}S`);
  let l4 = `${c7 < 0 ? "-" : ""}P${d4}`;
  return h7 && (l4 = `${l4}T${h7}`), l4;
}
function er(e7, t6 = "auto") {
  const { year: n10, month: r7, day: o8 } = re(e7, D2);
  return `${Jn(n10)}-${Gn(r7)}-${Gn(o8)}${Dt(re(e7, E2), t6)}`;
}
function tr({ hour: e7, minute: t6, second: n10, millisecond: r7, microsecond: o8, nanosecond: i8 }, a4) {
  return Vn(e7, t6, n10, 1e6 * r7 + 1e3 * o8 + i8, a4);
}
function nr(e7, t6, n10, r7 = "auto") {
  const { isoDate: { year: o8, month: i8, day: a4 }, time: { hour: s7, minute: c7, second: d4, millisecond: h7, microsecond: u4, nanosecond: l4 } } = e7;
  return `${Jn(o8)}-${Gn(i8)}-${Gn(a4)}T${Vn(s7, c7, d4, 1e6 * h7 + 1e3 * u4 + l4, n10)}${Dt(t6, r7)}`;
}
function rr(e7, t6 = "auto") {
  const { year: n10, month: r7, day: o8 } = re(e7, D2);
  let i8 = `${Gn(r7)}-${Gn(o8)}`;
  const a4 = re(e7, E2);
  "always" !== t6 && "critical" !== t6 && "iso8601" === a4 || (i8 = `${Jn(n10)}-${i8}`);
  const s7 = Dt(a4, t6);
  return s7 && (i8 += s7), i8;
}
function or(e7, t6 = "auto") {
  const { year: n10, month: r7, day: o8 } = re(e7, D2);
  let i8 = `${Jn(n10)}-${Gn(r7)}`;
  const a4 = re(e7, E2);
  "always" !== t6 && "critical" !== t6 && "iso8601" === a4 || (i8 += `-${Gn(o8)}`);
  const s7 = Dt(a4, t6);
  return s7 && (i8 += s7), i8;
}
function ir(e7, t6, n10 = "auto", r7 = "auto", o8 = "auto", i8 = void 0) {
  let a4 = re(e7, b3);
  if (i8) {
    const { unit: e8, increment: t7, roundingMode: n11 } = i8;
    a4 = Io(a4, t7, e8, n11);
  }
  const s7 = re(e7, $2), c7 = Fn(s7, a4);
  let d4 = nr(zn(s7, a4), "iso8601", t6, "never");
  return "never" !== o8 && (d4 += fr(c7)), "never" !== r7 && (d4 += `[${"critical" === r7 ? "!" : ""}${s7}]`), d4 += Dt(re(e7, E2), n10), d4;
}
function ar(e7) {
  return $t.test(e7);
}
function sr(e7) {
  const t6 = _o.exec(e7);
  if (!t6) throw new RangeError(`invalid time zone offset: ${e7}; must match \xB1HH:MM[:SS.SSSSSSSSS]`);
  return ("-" === t6[1] ? -1 : 1) * (1e9 * (60 * (60 * +t6[2] + +(t6[3] || 0)) + +(t6[4] || 0)) + +((t6[5] || 0) + "000000000").slice(0, 9));
}
function hr(e7) {
  if (void 0 === cr) {
    const e8 = Intl.supportedValuesOf?.("timeZone");
    if (e8) {
      cr = /* @__PURE__ */ new Map();
      for (let t7 = 0; t7 < e8.length; t7++) {
        const n11 = e8[t7];
        cr.set(Ao(n11), n11);
      }
    } else cr = null;
  }
  const t6 = Ao(e7);
  let n10 = cr?.get(t6);
  if (n10) return { identifier: n10, primaryIdentifier: n10 };
  try {
    n10 = ht(e7).resolvedOptions().timeZone;
  } catch {
    return;
  }
  if ("antarctica/south_pole" === t6 && (n10 = "Antarctica/McMurdo"), ze.has(e7)) throw new RangeError(`${e7} is a legacy time zone identifier from ICU. Use ${n10} instead`);
  const r7 = [...t6].map((e8, n11) => 0 === n11 || dr[t6[n11 - 1]] ? e8.toUpperCase() : e8).join("").split("/");
  if (1 === r7.length) return "gb-eire" === t6 ? { identifier: "GB-Eire", primaryIdentifier: n10 } : { identifier: t6.length <= 3 || /[-0-9]/.test(t6) ? t6.toUpperCase() : r7[0], primaryIdentifier: n10 };
  if ("Etc" === r7[0]) return { identifier: `Etc/${["Zulu", "Greenwich", "Universal"].includes(r7[1]) ? r7[1] : r7[1].toUpperCase()}`, primaryIdentifier: n10 };
  if ("Us" === r7[0]) return { identifier: `US/${r7[1]}`, primaryIdentifier: n10 };
  const o8 = /* @__PURE__ */ new Map([["Act", "ACT"], ["Lhi", "LHI"], ["Nsw", "NSW"], ["Dar_Es_Salaam", "Dar_es_Salaam"], ["Port_Of_Spain", "Port_of_Spain"], ["Port-Au-Prince", "Port-au-Prince"], ["Isle_Of_Man", "Isle_of_Man"], ["Comodrivadavia", "ComodRivadavia"], ["Knox_In", "Knox_IN"], ["Dumontdurville", "DumontDUrville"], ["Mcmurdo", "McMurdo"], ["Denoronha", "DeNoronha"], ["Easterisland", "EasterIsland"], ["Bajanorte", "BajaNorte"], ["Bajasur", "BajaSur"]]);
  return r7[1] = o8.get(r7[1]) ?? r7[1], r7.length > 2 && (r7[2] = o8.get(r7[2]) ?? r7[2]), { identifier: r7.join("/"), primaryIdentifier: n10 };
}
function ur(e7, t6) {
  const { year: n10, month: r7, day: o8, hour: i8, minute: a4, second: s7 } = br(e7, t6);
  let c7 = t6 % 1e3;
  return c7 < 0 && (c7 += 1e3), 1e6 * (yr({ isoDate: { year: n10, month: r7, day: o8 }, time: { hour: i8, minute: a4, second: s7, millisecond: c7 } }) - t6);
}
function lr(e7, t6) {
  return ur(e7, No(t6, "floor"));
}
function mr(e7) {
  const t6 = e7 < 0 ? "-" : "+", n10 = Math.abs(e7);
  return `${t6}${Vn(Math.floor(n10 / 60), n10 % 60, 0, 0, "minute")}`;
}
function fr(e7) {
  return mr(Eo(e7, je, "halfExpand") / 6e10);
}
function yr({ isoDate: { year: e7, month: t6, day: n10 }, time: { hour: r7, minute: o8, second: i8, millisecond: a4 } }) {
  const s7 = e7 % 400, c7 = (e7 - s7) / 400, d4 = /* @__PURE__ */ new Date();
  return d4.setUTCHours(r7, o8, i8, a4), d4.setUTCFullYear(s7, t6 - 1, n10), d4.getTime() + Ue * c7;
}
function pr(t6) {
  const n10 = yr(t6), r7 = 1e3 * t6.time.microsecond + t6.time.nanosecond;
  return import_jsbi.default.add(xo(n10), import_jsbi.default.BigInt(r7));
}
function gr(t6) {
  let n10 = No(t6, "trunc"), r7 = import_jsbi.default.toNumber(import_jsbi.default.remainder(t6, c6));
  r7 < 0 && (r7 += 1e6, n10 -= 1);
  const o8 = Math.floor(r7 / 1e3) % 1e3, i8 = r7 % 1e3, a4 = new Date(n10);
  return { epochMilliseconds: n10, isoDate: { year: a4.getUTCFullYear(), month: a4.getUTCMonth() + 1, day: a4.getUTCDate() }, time: { hour: a4.getUTCHours(), minute: a4.getUTCMinutes(), second: a4.getUTCSeconds(), millisecond: a4.getUTCMilliseconds(), microsecond: o8, nanosecond: i8 } };
}
function wr(e7, t6) {
  if ("UTC" === e7) return null;
  const n10 = No(t6, "floor");
  if (n10 < Fe) return wr(e7, xo(Fe));
  const r7 = Date.now(), o8 = Math.max(n10, r7) + 366 * Re * 3;
  let i8 = n10, a4 = ur(e7, i8), s7 = i8, c7 = a4;
  for (; a4 === c7 && i8 < o8; ) {
    if (s7 = i8 + 2 * Re * 7, s7 > ke) return null;
    c7 = ur(e7, s7), a4 === c7 && (i8 = s7);
  }
  return a4 === c7 ? null : xo(Jo((t7) => ur(e7, t7), i8, s7, a4, c7));
}
function vr(t6, n10) {
  if ("UTC" === t6) return null;
  const r7 = No(n10, "ceil"), o8 = Date.now(), i8 = o8 + 366 * Re * 3;
  if (r7 > i8) {
    const n11 = vr(t6, xo(i8));
    if (null === n11 || import_jsbi.default.lessThan(n11, xo(o8))) return n11;
  }
  if ("Africa/Casablanca" === t6 || "Africa/El_Aaiun" === t6) {
    const e7 = Date.UTC(2088, 0, 1);
    if (e7 < r7) return vr(t6, xo(e7));
  }
  let a4 = r7 - 1;
  if (a4 < Fe) return null;
  let s7 = ur(t6, a4), c7 = a4, d4 = s7;
  for (; s7 === d4 && a4 > Fe; ) {
    if (c7 = a4 - 2 * Re * 7, c7 < Fe) return null;
    d4 = ur(t6, c7), s7 === d4 && (a4 = c7);
  }
  return s7 === d4 ? null : xo(Jo((e7) => ur(t6, e7), c7, a4, d4, s7));
}
function br(e7, t6) {
  return function(e8) {
    const t7 = e8.split(/[^\w]+/);
    if (7 !== t7.length) throw new RangeError(`expected 7 parts in "${e8}`);
    const n10 = +t7[0], r7 = +t7[1];
    let o8 = +t7[2];
    const i8 = t7[3];
    if ("b" === i8[0] || "B" === i8[0]) o8 = 1 - o8;
    else if ("a" !== i8[0] && "A" !== i8[0]) throw new RangeError(`Unknown era ${i8} in "${e8}`);
    const a4 = "24" === t7[4] ? 0 : +t7[4], s7 = +t7[5], c7 = +t7[6];
    if (!(Number.isFinite(o8) && Number.isFinite(n10) && Number.isFinite(r7) && Number.isFinite(a4) && Number.isFinite(s7) && Number.isFinite(c7))) throw new RangeError(`Invalid number in "${e8}`);
    return { year: o8, month: n10, day: r7, hour: a4, minute: s7, second: c7 };
  }(ht(e7).format(t6));
}
function Dr(e7) {
  return void 0 !== e7 && !(e7 % 4 != 0 || e7 % 100 == 0 && e7 % 400 != 0);
}
function Tr(e7, t6) {
  return { standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] }[Dr(e7) ? "leapyear" : "standard"][t6 - 1];
}
function Mr(e7) {
  const t6 = [re(e7, Y), re(e7, R2), re(e7, S3), re(e7, j2), re(e7, k2), re(e7, N2), re(e7, x2), re(e7, L2), re(e7, P2), re(e7, U)];
  for (let e8 = 0; e8 < t6.length; e8++) {
    const n10 = t6[e8];
    if (0 !== n10) return n10 < 0 ? -1 : 1;
  }
  return 0;
}
function Er(e7) {
  const t6 = ["years", "months", "weeks", "days"];
  for (let n10 = 0; n10 < t6.length; n10++) {
    const r7 = e7[t6[n10]];
    if (0 !== r7) return r7 < 0 ? -1 : 1;
  }
  return 0;
}
function Ir(e7) {
  const t6 = Er(e7.date);
  return 0 !== t6 ? t6 : e7.time.sign();
}
function Cr(e7, t6) {
  let n10 = e7, r7 = t6;
  if (!Number.isFinite(n10) || !Number.isFinite(r7)) throw new RangeError("infinity is out of range");
  return r7 -= 1, n10 += Math.floor(r7 / 12), r7 %= 12, r7 < 0 && (r7 += 12), r7 += 1, { year: n10, month: r7 };
}
function Or(e7, t6, n10) {
  let r7 = e7, o8 = t6, i8 = n10;
  if (!Number.isFinite(i8)) throw new RangeError("infinity is out of range");
  ({ year: r7, month: o8 } = Cr(r7, o8));
  const a4 = 146097;
  if (Math.abs(i8) > a4) {
    const e8 = Math.trunc(i8 / a4);
    r7 += 400 * e8, i8 -= e8 * a4;
  }
  let s7 = 0, c7 = o8 > 2 ? r7 : r7 - 1;
  for (; s7 = Dr(c7) ? 366 : 365, i8 < -s7; ) r7 -= 1, c7 -= 1, i8 += s7;
  for (c7 += 1; s7 = Dr(c7) ? 366 : 365, i8 > s7; ) r7 += 1, c7 += 1, i8 -= s7;
  for (; i8 < 1; ) ({ year: r7, month: o8 } = Cr(r7, o8 - 1)), i8 += Tr(r7, o8);
  for (; i8 > Tr(r7, o8); ) i8 -= Tr(r7, o8), { year: r7, month: o8 } = Cr(r7, o8 + 1);
  return { year: r7, month: o8, day: i8 };
}
function $r(e7, t6, n10, r7, o8, i8, a4, s7, c7) {
  const d4 = Yr(r7, o8, i8, a4, s7, c7);
  return xt(Or(e7, t6, n10 + d4.deltaDays), d4);
}
function Yr(e7, t6, n10, r7, o8, i8) {
  let a4, s7 = e7, c7 = t6, d4 = n10, h7 = r7, u4 = o8, l4 = i8;
  ({ div: a4, mod: l4 } = de(l4, 3)), u4 += a4, l4 < 0 && (u4 -= 1, l4 += 1e3), { div: a4, mod: u4 } = de(u4, 3), h7 += a4, u4 < 0 && (h7 -= 1, u4 += 1e3), d4 += Math.trunc(h7 / 1e3), h7 %= 1e3, h7 < 0 && (d4 -= 1, h7 += 1e3), c7 += Math.trunc(d4 / 60), d4 %= 60, d4 < 0 && (c7 -= 1, d4 += 60), s7 += Math.trunc(c7 / 60), c7 %= 60, c7 < 0 && (s7 -= 1, c7 += 60);
  let m4 = Math.trunc(s7 / 24);
  return s7 %= 24, s7 < 0 && (m4 -= 1, s7 += 24), m4 += 0, s7 += 0, c7 += 0, d4 += 0, h7 += 0, u4 += 0, l4 += 0, { deltaDays: m4, hour: s7, minute: c7, second: d4, millisecond: h7, microsecond: u4, nanosecond: l4 };
}
function Rr(e7, t6) {
  const n10 = Nt(e7, 0);
  if (0 === Er(n10)) return e7.days;
  const r7 = re(t6, D2), o8 = Sn(re(t6, E2), r7, n10, "constrain"), i8 = Gr(r7.year, r7.month - 1, r7.day), a4 = Gr(o8.year, o8.month - 1, o8.day) - i8;
  return e7.days + a4;
}
function Sr(e7) {
  return new (ce("%Temporal.Duration%"))(-re(e7, Y), -re(e7, R2), -re(e7, S3), -re(e7, j2), -re(e7, k2), -re(e7, N2), -re(e7, x2), -re(e7, L2), -re(e7, P2), -re(e7, U));
}
function jr(e7, t6, n10) {
  return Math.min(n10, Math.max(t6, e7));
}
function kr(e7, t6, n10) {
  const r7 = jr(t6, 1, 12);
  return { year: e7, month: r7, day: jr(n10, 1, Tr(e7, r7)) };
}
function Nr(e7, t6, n10) {
  if (e7 < t6 || e7 > n10) throw new RangeError(`value out of range: ${t6} <= ${e7} <= ${n10}`);
}
function xr(e7, t6, n10) {
  Nr(t6, 1, 12), Nr(n10, 1, Tr(e7, t6));
}
function Lr(e7) {
  Br(xt(e7, { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }));
}
function Pr(e7, t6, n10, r7, o8, i8) {
  Nr(e7, 0, 23), Nr(t6, 0, 59), Nr(n10, 0, 59), Nr(r7, 0, 999), Nr(o8, 0, 999), Nr(i8, 0, 999);
}
function Ur(e7, t6, n10, r7, o8, i8, a4, s7, c7) {
  xr(e7, t6, n10), Pr(r7, o8, i8, a4, s7, c7);
}
function Br(t6) {
  const n10 = pr(t6);
  (import_jsbi.default.lessThan(n10, Le) || import_jsbi.default.greaterThan(n10, Pe)) && Fr(n10);
}
function Zr(e7) {
  pr(e7);
}
function Fr(t6) {
  if (import_jsbi.default.lessThan(t6, xe) || import_jsbi.default.greaterThan(t6, Ne)) throw new RangeError("date/time value is outside of supported range");
}
function Hr({ year: e7, month: t6 }) {
  Nr(e7, Be, Ze), e7 === Be ? Nr(t6, 4, 12) : e7 === Ze && Nr(t6, 1, 9);
}
function zr(e7, t6, n10, r7, o8, i8, a4, s7, c7, d4) {
  let h7 = 0;
  const u4 = [e7, t6, n10, r7, o8, i8, a4, s7, c7, d4];
  for (let e8 = 0; e8 < u4.length; e8++) {
    const t7 = u4[e8];
    if (t7 === 1 / 0 || t7 === -1 / 0) throw new RangeError("infinite values not allowed as duration fields");
    if (0 !== t7) {
      const e9 = t7 < 0 ? -1 : 1;
      if (0 !== h7 && e9 !== h7) throw new RangeError("mixed-sign values not allowed as duration fields");
      h7 = e9;
    }
  }
  if (Math.abs(e7) >= 2 ** 32 || Math.abs(t6) >= 2 ** 32 || Math.abs(n10) >= 2 ** 32) throw new RangeError("years, months, and weeks must be < 2\xB3\xB2");
  const l4 = de(s7, 3), m4 = de(c7, 6), f5 = de(d4, 9), y4 = de(1e6 * l4.mod + 1e3 * m4.mod + f5.mod, 9).div, p4 = 86400 * r7 + 3600 * o8 + 60 * i8 + a4 + l4.div + m4.div + f5.div + y4;
  if (!Number.isSafeInteger(p4)) throw new RangeError("total of duration time units cannot exceed 9007199254740991.999999999 s");
}
function Ar(e7) {
  return { date: { years: re(e7, Y), months: re(e7, R2), weeks: re(e7, S3), days: re(e7, j2) }, time: TimeDuration.fromComponents(re(e7, k2), re(e7, N2), re(e7, x2), re(e7, L2), re(e7, P2), re(e7, U)) };
}
function qr(e7) {
  const t6 = TimeDuration.fromComponents(re(e7, k2), re(e7, N2), re(e7, x2), re(e7, L2), re(e7, P2), re(e7, U)).add24HourDays(re(e7, j2));
  return { date: { years: re(e7, Y), months: re(e7, R2), weeks: re(e7, S3), days: 0 }, time: t6 };
}
function Wr(e7) {
  const t6 = qr(e7), n10 = Math.trunc(t6.time.sec / 86400);
  return zr(t6.date.years, t6.date.months, t6.date.weeks, n10, 0, 0, 0, 0, 0, 0), { ...t6.date, days: n10 };
}
function _r(e7, t6) {
  const n10 = e7.time.sign();
  let r7 = e7.time.abs().subsec, o8 = 0, i8 = 0, a4 = e7.time.abs().sec, s7 = 0, c7 = 0, d4 = 0;
  switch (t6) {
    case "year":
    case "month":
    case "week":
    case "day":
      o8 = Math.trunc(r7 / 1e3), r7 %= 1e3, i8 = Math.trunc(o8 / 1e3), o8 %= 1e3, a4 += Math.trunc(i8 / 1e3), i8 %= 1e3, s7 = Math.trunc(a4 / 60), a4 %= 60, c7 = Math.trunc(s7 / 60), s7 %= 60, d4 = Math.trunc(c7 / 24), c7 %= 24;
      break;
    case "hour":
      o8 = Math.trunc(r7 / 1e3), r7 %= 1e3, i8 = Math.trunc(o8 / 1e3), o8 %= 1e3, a4 += Math.trunc(i8 / 1e3), i8 %= 1e3, s7 = Math.trunc(a4 / 60), a4 %= 60, c7 = Math.trunc(s7 / 60), s7 %= 60;
      break;
    case "minute":
      o8 = Math.trunc(r7 / 1e3), r7 %= 1e3, i8 = Math.trunc(o8 / 1e3), o8 %= 1e3, a4 += Math.trunc(i8 / 1e3), i8 %= 1e3, s7 = Math.trunc(a4 / 60), a4 %= 60;
      break;
    case "second":
      o8 = Math.trunc(r7 / 1e3), r7 %= 1e3, i8 = Math.trunc(o8 / 1e3), o8 %= 1e3, a4 += Math.trunc(i8 / 1e3), i8 %= 1e3;
      break;
    case "millisecond":
      o8 = Math.trunc(r7 / 1e3), r7 %= 1e3, i8 = he(a4, 3, Math.trunc(o8 / 1e3)), o8 %= 1e3, a4 = 0;
      break;
    case "microsecond":
      o8 = he(a4, 6, Math.trunc(r7 / 1e3)), r7 %= 1e3, a4 = 0;
      break;
    case "nanosecond":
      r7 = he(a4, 9, r7), a4 = 0;
  }
  return new (ce("%Temporal.Duration%"))(e7.date.years, e7.date.months, e7.date.weeks, e7.date.days + n10 * d4, n10 * c7, n10 * s7, n10 * a4, n10 * i8, n10 * o8, n10 * r7);
}
function Jr(e7, t6) {
  return Er(e7), t6.sign(), { date: e7, time: t6 };
}
function Gr(e7, t6, n10) {
  return yr({ isoDate: { year: e7, month: t6 + 1, day: n10 }, time: { hour: 0, minute: 0, second: 0, millisecond: 0 } }) / Re;
}
function Kr({ year: e7, month: t6, day: n10 }) {
  if (Math.abs(Gr(e7, t6 - 1, n10)) > 1e8) throw new RangeError("date/time value is outside the supported range");
}
function Vr(e7, t6) {
  const n10 = t6.hour - e7.hour, r7 = t6.minute - e7.minute, o8 = t6.second - e7.second, i8 = t6.millisecond - e7.millisecond, a4 = t6.microsecond - e7.microsecond, s7 = t6.nanosecond - e7.nanosecond;
  return TimeDuration.fromComponents(n10, r7, o8, i8, a4, s7);
}
function Xr(e7, t6, n10, r7, o8) {
  let i8 = TimeDuration.fromEpochNsDiff(t6, e7);
  return i8 = $o(i8, n10, r7, o8), Jr({ years: 0, months: 0, weeks: 0, days: 0 }, i8);
}
function Qr(e7, t6, n10, r7) {
  Zr(e7), Zr(t6);
  let o8 = Vr(e7.time, t6.time);
  const i8 = o8.sign(), a4 = Ro(e7.isoDate, t6.isoDate);
  let s7 = t6.isoDate;
  a4 === i8 && (s7 = Or(s7.year, s7.month, s7.day + i8), o8 = o8.add24HourDays(-i8));
  const c7 = Gt("day", r7), d4 = jn(n10, e7.isoDate, s7, c7);
  return r7 !== c7 && (o8 = o8.add24HourDays(d4.days), d4.days = 0), Jr(d4, o8);
}
function eo(n10, r7, o8, i8, a4) {
  const s7 = import_jsbi.default.subtract(r7, n10);
  if (import_jsbi.default.equal(s7, t5)) return { date: { years: 0, months: 0, weeks: 0, days: 0 }, time: TimeDuration.ZERO };
  const c7 = import_jsbi.default.lessThan(s7, t5) ? -1 : 1, d4 = zn(o8, n10), h7 = zn(o8, r7);
  let u4, l4 = 0, m4 = 1 === c7 ? 2 : 1, f5 = Vr(d4.time, h7.time);
  for (f5.sign() === -c7 && l4++; l4 <= m4; l4++) {
    u4 = xt(Or(h7.isoDate.year, h7.isoDate.month, h7.isoDate.day - l4 * c7), d4.time);
    const e7 = An(o8, u4, "compatible");
    if (f5 = TimeDuration.fromEpochNsDiff(r7, e7), f5.sign() !== -c7) break;
  }
  const y4 = Gt("day", a4);
  return Jr(jn(i8, d4.isoDate, u4.isoDate, y4), f5);
}
function to(t6, n10, r7, o8, i8, a4, s7, c7, d4) {
  let h7, u4, l4, m4, f5 = n10;
  switch (c7) {
    case "year": {
      const e7 = Eo(f5.date.years, s7, "trunc");
      h7 = e7, u4 = e7 + s7 * t6, l4 = { years: h7, months: 0, weeks: 0, days: 0 }, m4 = { ...l4, years: u4 };
      break;
    }
    case "month": {
      const e7 = Eo(f5.date.months, s7, "trunc");
      h7 = e7, u4 = e7 + s7 * t6, l4 = Nt(f5.date, 0, 0, h7), m4 = Nt(f5.date, 0, 0, u4);
      break;
    }
    case "week": {
      const e7 = Nt(f5.date, 0, 0), n11 = Sn(a4, o8.isoDate, e7, "constrain"), r8 = jn(a4, n11, Or(n11.year, n11.month, n11.day + f5.date.days), "week"), i9 = Eo(f5.date.weeks + r8.weeks, s7, "trunc");
      h7 = i9, u4 = i9 + s7 * t6, l4 = Nt(f5.date, 0, h7), m4 = Nt(f5.date, 0, u4);
      break;
    }
    case "day": {
      const e7 = Eo(f5.date.days, s7, "trunc");
      h7 = e7, u4 = e7 + s7 * t6, l4 = Nt(f5.date, h7), m4 = Nt(f5.date, u4);
      break;
    }
  }
  const y4 = Sn(a4, o8.isoDate, l4, "constrain"), p4 = Sn(a4, o8.isoDate, m4, "constrain");
  let g3, w3;
  const v3 = xt(y4, o8.time), b4 = xt(p4, o8.time);
  i8 ? (g3 = An(i8, v3, "compatible"), w3 = An(i8, b4, "compatible")) : (g3 = pr(v3), w3 = pr(b4));
  const D3 = TimeDuration.fromEpochNsDiff(r7, g3), T3 = TimeDuration.fromEpochNsDiff(w3, g3), M3 = ue(d4, t6 < 0 ? "negative" : "positive"), E3 = D3.add(D3).abs().subtract(T3.abs()).sign(), I3 = Math.abs(h7) / s7 % 2 == 0, C3 = D3.isZero() ? Math.abs(h7) : D3.cmp(T3) ? le(Math.abs(h7), Math.abs(u4), E3, I3, M3) : Math.abs(u4), O2 = new TimeDuration(import_jsbi.default.add(import_jsbi.default.multiply(T3.totalNs, import_jsbi.default.BigInt(h7)), import_jsbi.default.multiply(D3.totalNs, import_jsbi.default.BigInt(s7 * t6)))).fdiv(T3.totalNs), $3 = C3 === Math.abs(u4);
  return f5 = { date: $3 ? m4 : l4, time: TimeDuration.ZERO }, { nudgeResult: { duration: f5, nudgedEpochNs: $3 ? w3 : g3, didExpandCalendarUnit: $3 }, total: O2 };
}
function no(t6, n10, r7, o8, i8, a4, s7, c7, d4) {
  let h7 = t6;
  const u4 = Kt(c7) || o8 && "day" === c7, l4 = Ir(h7) < 0 ? -1 : 1;
  let m4;
  return u4 ? { nudgeResult: m4 } = to(l4, h7, n10, r7, o8, i8, s7, c7, d4) : m4 = o8 ? function(t7, n11, r8, o9, i9, a5, s8, c8) {
    let d5 = n11;
    const h8 = Sn(i9, r8.isoDate, d5.date, "constrain"), u5 = xt(h8, r8.time), l5 = xt(Or(h8.year, h8.month, h8.day + t7), r8.time), m5 = An(o9, u5, "compatible"), f5 = An(o9, l5, "compatible"), y4 = TimeDuration.fromEpochNsDiff(f5, m5);
    if (y4.sign() !== t7) throw new RangeError("time zone returned inconsistent Instants");
    const p4 = import_jsbi.default.BigInt(at[s8] * a5);
    let g3 = d5.time.round(p4, c8);
    const w3 = g3.subtract(y4), v3 = w3.sign() !== -t7;
    let b4, D3;
    return v3 ? (b4 = t7, g3 = w3.round(p4, c8), D3 = g3.addToEpochNs(f5)) : (b4 = 0, D3 = g3.addToEpochNs(m5)), { duration: Jr(Nt(d5.date, d5.date.days + b4), g3), nudgedEpochNs: D3, didExpandCalendarUnit: v3 };
  }(l4, h7, r7, o8, i8, s7, c7, d4) : function(t7, n11, r8, o9, i9, a5) {
    let s8 = t7;
    const c8 = s8.time.add24HourDays(s8.date.days), d5 = c8.round(import_jsbi.default.BigInt(o9 * at[i9]), a5), h8 = d5.subtract(c8), { quotient: u5 } = c8.divmod(Se), { quotient: l5 } = d5.divmod(Se), m5 = Math.sign(l5 - u5) === c8.sign(), f5 = h8.addToEpochNs(n11);
    let y4 = 0, p4 = d5;
    return "date" === Vt(r8) && (y4 = l5, p4 = d5.add(TimeDuration.fromComponents(24 * -l5, 0, 0, 0, 0, 0))), { duration: { date: Nt(s8.date, y4), time: p4 }, nudgedEpochNs: f5, didExpandCalendarUnit: m5 };
  }(h7, n10, a4, s7, c7, d4), h7 = m4.duration, m4.didExpandCalendarUnit && "week" !== c7 && (h7 = function(e7, t7, n11, r8, o9, i9, a5, s8) {
    let c8 = t7;
    if (s8 === a5) return c8;
    const d5 = it.indexOf(a5);
    for (let t8 = it.indexOf(s8) - 1; t8 >= d5; t8--) {
      const s9 = it[t8];
      if ("week" === s9 && "week" !== a5) continue;
      let d6;
      switch (s9) {
        case "year":
          d6 = { years: c8.date.years + e7, months: 0, weeks: 0, days: 0 };
          break;
        case "month": {
          const t9 = c8.date.months + e7;
          d6 = Nt(c8.date, 0, 0, t9);
          break;
        }
        case "week": {
          const t9 = c8.date.weeks + e7;
          d6 = Nt(c8.date, 0, t9);
          break;
        }
      }
      const h8 = xt(Sn(i9, r8.isoDate, d6, "constrain"), r8.time);
      let u5;
      if (u5 = o9 ? An(o9, h8, "compatible") : pr(h8), p3(n11, u5) === -e7) break;
      c8 = { date: d6, time: TimeDuration.ZERO };
    }
    return c8;
  }(l4, h7, m4.nudgedEpochNs, r7, o8, i8, a4, Gt(c7, "day"))), h7;
}
function ro(e7, t6, n10, r7, o8, i8) {
  return Kt(i8) || r7 && "day" === i8 ? to(Ir(e7) < 0 ? -1 : 1, e7, t6, n10, r7, o8, 1, i8, "trunc").total : Yo(e7.time.add24HourDays(e7.date.days), i8);
}
function oo(e7, t6, n10, r7, o8, i8, a4) {
  if (0 == jo(e7, t6)) return { date: { years: 0, months: 0, weeks: 0, days: 0 }, time: TimeDuration.ZERO };
  Br(e7), Br(t6);
  const s7 = Qr(e7, t6, n10, r7);
  return "nanosecond" === i8 && 1 === o8 ? s7 : no(s7, pr(t6), e7, null, n10, r7, o8, i8, a4);
}
function io(e7, t6, n10, r7, o8, i8, a4, s7) {
  if ("time" === Vt(o8)) return Xr(e7, t6, i8, a4, s7);
  const c7 = eo(e7, t6, n10, r7, o8);
  return "nanosecond" === a4 && 1 === i8 ? c7 : no(c7, t6, zn(n10, e7), n10, r7, o8, i8, a4, s7);
}
function ao(e7, t6, n10, r7, o8, i8) {
  const a4 = nt.reduce((e8, t7) => {
    const o9 = t7[0], i9 = t7[1], a5 = t7[2];
    return "datetime" !== n10 && a5 !== n10 || r7.includes(i9) || e8.push(i9, o9), e8;
  }, []);
  let s7 = Wt(t6, "largestUnit", n10, "auto");
  if (r7.includes(s7)) throw new RangeError(`largestUnit must be one of ${a4.join(", ")}, not ${s7}`);
  const c7 = Ft(t6);
  let d4 = Ut(t6, "trunc");
  "since" === e7 && (d4 = function(e8) {
    switch (e8) {
      case "ceil":
        return "floor";
      case "floor":
        return "ceil";
      case "halfCeil":
        return "halfFloor";
      case "halfFloor":
        return "halfCeil";
      default:
        return e8;
    }
  }(d4));
  const h7 = Wt(t6, "smallestUnit", n10, o8);
  if (r7.includes(h7)) throw new RangeError(`smallestUnit must be one of ${a4.join(", ")}, not ${h7}`);
  const u4 = Gt(i8, h7);
  if ("auto" === s7 && (s7 = u4), Gt(s7, h7) !== s7) throw new RangeError(`largestUnit ${s7} cannot be smaller than smallestUnit ${h7}`);
  const l4 = { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[h7];
  return void 0 !== l4 && Ht(c7, l4, false), { largestUnit: s7, roundingIncrement: c7, roundingMode: d4, smallestUnit: h7 };
}
function so(e7, t6, n10, r7) {
  const o8 = cn(n10), i8 = ao(e7, Zo(r7), "time", [], "nanosecond", "second");
  let a4 = _r(Xr(re(t6, b3), re(o8, b3), i8.roundingIncrement, i8.smallestUnit, i8.roundingMode), i8.largestUnit);
  return "since" === e7 && (a4 = Sr(a4)), a4;
}
function co(e7, t6, n10, r7) {
  const o8 = rn(n10), i8 = re(t6, E2), a4 = re(o8, E2);
  if (!xn(i8, a4)) throw new RangeError(`cannot compute difference between dates of ${i8} and ${a4} calendars`);
  const s7 = ao(e7, Zo(r7), "date", [], "day", "day"), c7 = ce("%Temporal.Duration%"), d4 = re(t6, D2), h7 = re(o8, D2);
  if (0 === Ro(d4, h7)) return new c7();
  let u4 = { date: jn(i8, d4, h7, s7.largestUnit), time: TimeDuration.ZERO };
  if ("day" !== s7.smallestUnit || 1 !== s7.roundingIncrement) {
    const e8 = xt(d4, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    u4 = no(u4, pr(xt(h7, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 })), e8, null, i8, s7.largestUnit, s7.roundingIncrement, s7.smallestUnit, s7.roundingMode);
  }
  let l4 = _r(u4, "day");
  return "since" === e7 && (l4 = Sr(l4)), l4;
}
function ho(e7, t6, n10, r7) {
  const o8 = an(n10), i8 = re(t6, E2), a4 = re(o8, E2);
  if (!xn(i8, a4)) throw new RangeError(`cannot compute difference between dates of ${i8} and ${a4} calendars`);
  const s7 = ao(e7, Zo(r7), "datetime", [], "nanosecond", "day"), c7 = ce("%Temporal.Duration%"), d4 = re(t6, T2), h7 = re(o8, T2);
  if (0 === jo(d4, h7)) return new c7();
  let u4 = _r(oo(d4, h7, i8, s7.largestUnit, s7.roundingIncrement, s7.smallestUnit, s7.roundingMode), s7.largestUnit);
  return "since" === e7 && (u4 = Sr(u4)), u4;
}
function uo(e7, t6, n10, r7) {
  const o8 = hn(n10), i8 = ao(e7, Zo(r7), "time", [], "nanosecond", "hour");
  let a4 = Vr(re(t6, M2), re(o8, M2));
  a4 = $o(a4, i8.roundingIncrement, i8.smallestUnit, i8.roundingMode);
  let s7 = _r(Jr({ years: 0, months: 0, weeks: 0, days: 0 }, a4), i8.largestUnit);
  return "since" === e7 && (s7 = Sr(s7)), s7;
}
function lo(e7, t6, n10, r7) {
  const o8 = ln(n10), i8 = re(t6, E2), a4 = re(o8, E2);
  if (!xn(i8, a4)) throw new RangeError(`cannot compute difference between months of ${i8} and ${a4} calendars`);
  const s7 = ao(e7, Zo(r7), "date", ["week", "day"], "month", "year"), c7 = ce("%Temporal.Duration%");
  if (0 == Ro(re(t6, D2), re(o8, D2))) return new c7();
  const d4 = en(i8, re(t6, D2), "year-month");
  d4.day = 1;
  const h7 = Ln(i8, d4, "constrain"), u4 = en(i8, re(o8, D2), "year-month");
  u4.day = 1;
  const l4 = Ln(i8, u4, "constrain");
  let m4 = { date: Nt(jn(i8, h7, l4, s7.largestUnit), 0, 0), time: TimeDuration.ZERO };
  if ("month" !== s7.smallestUnit || 1 !== s7.roundingIncrement) {
    const e8 = xt(h7, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    m4 = no(m4, pr(xt(l4, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 })), e8, null, i8, s7.largestUnit, s7.roundingIncrement, s7.smallestUnit, s7.roundingMode);
  }
  let f5 = _r(m4, "day");
  return "since" === e7 && (f5 = Sr(f5)), f5;
}
function mo(t6, n10, r7, o8) {
  const i8 = fn(r7), a4 = re(n10, E2), s7 = re(i8, E2);
  if (!xn(a4, s7)) throw new RangeError(`cannot compute difference between dates of ${a4} and ${s7} calendars`);
  const c7 = ao(t6, Zo(o8), "datetime", [], "nanosecond", "hour"), d4 = re(n10, b3), h7 = re(i8, b3), u4 = ce("%Temporal.Duration%");
  let l4;
  if ("date" !== Vt(c7.largestUnit)) l4 = _r(Xr(d4, h7, c7.roundingIncrement, c7.smallestUnit, c7.roundingMode), c7.largestUnit);
  else {
    const t7 = re(n10, $2);
    if (!Zn(t7, re(i8, $2))) throw new RangeError("When calculating difference between time zones, largestUnit must be 'hours' or smaller because day lengths can vary between time zones due to DST or time zone offset changes.");
    if (import_jsbi.default.equal(d4, h7)) return new u4();
    l4 = _r(io(d4, h7, t7, a4, c7.largestUnit, c7.roundingIncrement, c7.smallestUnit, c7.roundingMode), "hour");
  }
  return "since" === t6 && (l4 = Sr(l4)), l4;
}
function fo({ hour: e7, minute: t6, second: n10, millisecond: r7, microsecond: o8, nanosecond: i8 }, a4) {
  let s7 = n10, c7 = i8;
  return s7 += a4.sec, c7 += a4.subsec, Yr(e7, t6, s7, r7, o8, c7);
}
function yo(e7, t6) {
  const n10 = t6.addToEpochNs(e7);
  return Fr(n10), n10;
}
function po(e7, t6, n10, r7, o8 = "constrain") {
  if (0 === Er(r7.date)) return yo(e7, r7.time);
  const i8 = zn(t6, e7);
  return yo(An(t6, xt(Sn(n10, i8.isoDate, r7.date, o8), i8.time), "compatible"), r7.time);
}
function go(e7, t6, n10) {
  let r7 = sn(n10);
  "subtract" === e7 && (r7 = Sr(r7));
  const o8 = Gt(Jt(t6), Jt(r7));
  if (Kt(o8)) throw new RangeError("For years, months, or weeks arithmetic, use date arithmetic relative to a starting point");
  const i8 = qr(t6), a4 = qr(r7);
  return _r(Jr({ years: 0, months: 0, weeks: 0, days: 0 }, i8.time.add(a4.time)), o8);
}
function wo(e7, t6, n10) {
  let r7 = sn(n10);
  "subtract" === e7 && (r7 = Sr(r7));
  const o8 = Jt(r7);
  if ("date" === Vt(o8)) throw new RangeError(`Duration field ${o8} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`);
  const i8 = qr(r7);
  return Cn(yo(re(t6, b3), i8.time));
}
function vo(e7, t6, n10, r7) {
  const o8 = re(t6, E2);
  let i8 = sn(n10);
  "subtract" === e7 && (i8 = Sr(i8));
  const a4 = Wr(i8), s7 = Lt(Zo(r7));
  return pn(Sn(o8, re(t6, D2), a4, s7), o8);
}
function bo(e7, t6, n10, r7) {
  let o8 = sn(n10);
  "subtract" === e7 && (o8 = Sr(o8));
  const i8 = Lt(Zo(r7)), a4 = re(t6, E2), s7 = qr(o8), c7 = re(t6, T2), d4 = fo(c7.time, s7.time), h7 = Nt(s7.date, d4.deltaDays);
  return zr(h7.years, h7.months, h7.weeks, h7.days, 0, 0, 0, 0, 0, 0), wn(xt(Sn(a4, c7.isoDate, h7, i8), d4), a4);
}
function Do(e7, t6, n10) {
  let r7 = sn(n10);
  "subtract" === e7 && (r7 = Sr(r7));
  const o8 = qr(r7), { hour: i8, minute: a4, second: s7, millisecond: c7, microsecond: d4, nanosecond: h7 } = fo(re(t6, M2), o8.time);
  return Tn(jt(i8, a4, s7, c7, d4, h7, "reject"));
}
function To(e7, t6, n10, r7) {
  let o8 = sn(n10);
  "subtract" === e7 && (o8 = Sr(o8));
  const i8 = Lt(Zo(r7)), a4 = Mr(o8), s7 = re(t6, E2), c7 = en(s7, re(t6, D2), "year-month");
  c7.day = 1;
  let d4 = Ln(s7, c7, "constrain");
  if (a4 < 0) {
    const e8 = Sn(s7, d4, { months: 1 }, "constrain");
    d4 = Or(e8.year, e8.month, e8.day - 1);
  }
  const h7 = Wr(o8);
  return Lr(d4), En(Pn(s7, en(s7, Sn(s7, d4, h7, i8), "year-month"), i8), s7);
}
function Mo(e7, t6, n10, r7) {
  let o8 = sn(n10);
  "subtract" === e7 && (o8 = Sr(o8));
  const i8 = Lt(Zo(r7)), a4 = re(t6, $2), s7 = re(t6, E2), c7 = Ar(o8);
  return $n(po(re(t6, b3), a4, s7, c7, i8), a4, s7);
}
function Eo(e7, t6, n10) {
  const r7 = Math.trunc(e7 / t6), o8 = e7 % t6, i8 = e7 < 0 ? "negative" : "positive", a4 = Math.abs(r7), s7 = a4 + 1, c7 = Bo(Math.abs(2 * o8) - t6), d4 = a4 % 2 == 0, h7 = ue(n10, i8), u4 = 0 === o8 ? a4 : le(a4, s7, c7, d4, h7);
  return t6 * ("positive" === i8 ? u4 : -u4);
}
function Io(o8, i8, a4, s7) {
  const c7 = at[a4] * i8;
  return function(o9, i9, a5) {
    const s8 = m3(o9), c8 = m3(i9), d4 = import_jsbi.default.divide(s8, c8), h7 = import_jsbi.default.remainder(s8, c8), u4 = ue(a5, "positive");
    let l4, g3;
    import_jsbi.default.lessThan(s8, t5) ? (l4 = import_jsbi.default.subtract(d4, n8), g3 = d4) : (l4 = d4, g3 = import_jsbi.default.add(d4, n8));
    const w3 = p3(y3(import_jsbi.default.multiply(h7, r6)), c8) * (import_jsbi.default.lessThan(s8, t5) ? -1 : 1) + 0, v3 = import_jsbi.default.equal(h7, t5) ? d4 : le(l4, g3, w3, f4(l4), u4);
    return import_jsbi.default.multiply(v3, c8);
  }(o8, import_jsbi.default.BigInt(c7), s7);
}
function Co(e7, t6, n10, r7) {
  Zr(e7);
  const { year: o8, month: i8, day: a4 } = e7.isoDate, s7 = Oo(e7.time, t6, n10, r7);
  return xt(Or(o8, i8, a4 + s7.deltaDays), s7);
}
function Oo({ hour: e7, minute: t6, second: n10, millisecond: r7, microsecond: o8, nanosecond: i8 }, a4, s7, c7) {
  let d4;
  switch (s7) {
    case "day":
    case "hour":
      d4 = 1e3 * (1e3 * (1e3 * (60 * (60 * e7 + t6) + n10) + r7) + o8) + i8;
      break;
    case "minute":
      d4 = 1e3 * (1e3 * (1e3 * (60 * t6 + n10) + r7) + o8) + i8;
      break;
    case "second":
      d4 = 1e3 * (1e3 * (1e3 * n10 + r7) + o8) + i8;
      break;
    case "millisecond":
      d4 = 1e3 * (1e3 * r7 + o8) + i8;
      break;
    case "microsecond":
      d4 = 1e3 * o8 + i8;
      break;
    case "nanosecond":
      d4 = i8;
  }
  const h7 = at[s7], u4 = Eo(d4, h7 * a4, c7) / h7;
  switch (s7) {
    case "day":
      return { deltaDays: u4, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
    case "hour":
      return Yr(u4, 0, 0, 0, 0, 0);
    case "minute":
      return Yr(e7, u4, 0, 0, 0, 0);
    case "second":
      return Yr(e7, t6, u4, 0, 0, 0);
    case "millisecond":
      return Yr(e7, t6, n10, u4, 0, 0);
    case "microsecond":
      return Yr(e7, t6, n10, r7, u4, 0);
    case "nanosecond":
      return Yr(e7, t6, n10, r7, o8, u4);
    default:
      throw new Error(`Invalid unit ${s7}`);
  }
}
function $o(t6, n10, r7, o8) {
  const i8 = at[r7];
  return t6.round(import_jsbi.default.BigInt(i8 * n10), o8);
}
function Yo(t6, n10) {
  const r7 = at[n10];
  return t6.fdiv(import_jsbi.default.BigInt(r7));
}
function Ro(e7, t6) {
  return e7.year !== t6.year ? Bo(e7.year - t6.year) : e7.month !== t6.month ? Bo(e7.month - t6.month) : e7.day !== t6.day ? Bo(e7.day - t6.day) : 0;
}
function So(e7, t6) {
  return e7.hour !== t6.hour ? Bo(e7.hour - t6.hour) : e7.minute !== t6.minute ? Bo(e7.minute - t6.minute) : e7.second !== t6.second ? Bo(e7.second - t6.second) : e7.millisecond !== t6.millisecond ? Bo(e7.millisecond - t6.millisecond) : e7.microsecond !== t6.microsecond ? Bo(e7.microsecond - t6.microsecond) : e7.nanosecond !== t6.nanosecond ? Bo(e7.nanosecond - t6.nanosecond) : 0;
}
function jo(e7, t6) {
  const n10 = Ro(e7.isoDate, t6.isoDate);
  return 0 !== n10 ? n10 : So(e7.time, t6.time);
}
function ko(e7) {
  const t6 = Lo(e7);
  return void 0 !== globalThis.BigInt ? globalThis.BigInt(t6.toString(10)) : t6;
}
function No(t6, n10) {
  const r7 = m3(t6), { quotient: o8, remainder: i8 } = g2(r7, c6);
  let a4 = import_jsbi.default.toNumber(o8);
  return "floor" === n10 && import_jsbi.default.toNumber(i8) < 0 && (a4 -= 1), "ceil" === n10 && import_jsbi.default.toNumber(i8) > 0 && (a4 += 1), a4;
}
function xo(t6) {
  if (!Number.isInteger(t6)) throw new RangeError("epoch milliseconds must be an integer");
  return import_jsbi.default.multiply(import_jsbi.default.BigInt(t6), c6);
}
function Lo(t6) {
  let n10 = t6;
  if ("object" == typeof t6) {
    const e7 = t6[Symbol.toPrimitive];
    e7 && "function" == typeof e7 && (n10 = e7.call(t6, "number"));
  }
  if ("number" == typeof n10) throw new TypeError("cannot convert number to bigint");
  return "bigint" == typeof n10 ? import_jsbi.default.BigInt(n10.toString(10)) : import_jsbi.default.BigInt(n10);
}
function Uo() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function Bo(e7) {
  return e7 < 0 ? -1 : e7 > 0 ? 1 : e7;
}
function Zo(e7) {
  if (void 0 === e7) return /* @__PURE__ */ Object.create(null);
  if (Ae(e7) && null !== e7) return e7;
  throw new TypeError("Options parameter must be an object, not " + (null === e7 ? "null" : typeof e7));
}
function Fo(e7, t6) {
  const n10 = /* @__PURE__ */ Object.create(null);
  return n10[e7] = t6, n10;
}
function Ho(e7, t6, n10, r7) {
  let o8 = e7[t6];
  if (void 0 !== o8) {
    if (o8 = We(o8), !n10.includes(o8)) throw new RangeError(`${t6} must be one of ${n10.join(", ")}, not ${o8}`);
    return o8;
  }
  if (r7 === qt) throw new RangeError(`${t6} option is required`);
  return r7;
}
function zo(e7) {
  const t6 = Ao(e7);
  if (!He.includes(Ao(t6))) throw new RangeError(`invalid calendar identifier ${t6}`);
  switch (t6) {
    case "ethiopic-amete-alem":
      return "ethioaa";
    case "islamicc":
      return "islamic-civil";
  }
  return t6;
}
function Ao(e7) {
  let t6 = "";
  for (let n10 = 0; n10 < e7.length; n10++) {
    const r7 = e7.charCodeAt(n10);
    t6 += r7 >= 65 && r7 <= 90 ? String.fromCharCode(r7 + 32) : String.fromCharCode(r7);
  }
  return t6;
}
function qo(e7) {
  throw new TypeError(`Do not use built-in arithmetic operators with Temporal objects. When comparing, use ${"PlainMonthDay" === e7 ? "Temporal.PlainDate.compare(obj1.toPlainDate(year), obj2.toPlainDate(year))" : `Temporal.${e7}.compare(obj1, obj2)`}, not obj1 > obj2. When coercing to strings, use \`\${obj}\` or String(obj), not '' + obj. When coercing to numbers, use properties or methods of the object, not \`+obj\`. When concatenating with strings, use \`\${str}\${obj}\` or str.concat(obj), not str + obj. In React, coerce to a string before rendering a Temporal object.`);
}
function Jo(e7, t6, n10, r7 = e7(t6), o8 = e7(n10)) {
  let i8 = t6, a4 = n10, s7 = r7, c7 = o8;
  for (; a4 - i8 > 1; ) {
    let t7 = Math.trunc((i8 + a4) / 2);
    const n11 = e7(t7);
    n11 === s7 ? (i8 = t7, s7 = n11) : n11 === c7 && (a4 = t7, c7 = n11);
  }
  return a4;
}
function Go(e7) {
  return [...e7];
}
function Ko(e7, t6) {
  if ("gregory" !== e7 && "iso8601" !== e7) return;
  const n10 = Xo[e7];
  let r7 = t6.year;
  const { dayOfWeek: o8, dayOfYear: i8, daysInYear: a4 } = n10.isoToDate(t6, { dayOfWeek: true, dayOfYear: true, daysInYear: true }), s7 = n10.getFirstDayOfWeek(), c7 = n10.getMinimalDaysInFirstWeek();
  let d4 = (o8 + 7 - s7) % 7, h7 = (o8 - i8 + 7001 - s7) % 7, u4 = Math.floor((i8 - 1 + h7) / 7);
  if (7 - h7 >= c7 && ++u4, 0 == u4) u4 = function(e8, t7, n11, r8) {
    let o9 = (r8 - e8 - n11 + 1) % 7;
    o9 < 0 && (o9 += 7);
    let i9 = Math.floor((n11 + o9 - 1) / 7);
    return 7 - o9 >= t7 && ++i9, i9;
  }(s7, c7, i8 + n10.isoToDate(n10.dateAdd(t6, { years: -1 }, "constrain"), { daysInYear: true }).daysInYear, o8), r7--;
  else if (i8 >= a4 - 5) {
    let e8 = (d4 + a4 - i8) % 7;
    e8 < 0 && (e8 += 7), 6 - e8 >= c7 && i8 + 7 - d4 > a4 && (u4 = 1, r7++);
  }
  return { week: u4, year: r7 };
}
function Vo(e7, t6, n10, r7, o8) {
  if (t6 !== o8.year) {
    if (e7 * (t6 - o8.year) > 0) return true;
  } else if (n10 !== o8.month) {
    if (e7 * (n10 - o8.month) > 0) return true;
  } else if (r7 !== o8.day && e7 * (r7 - o8.day) > 0) return true;
  return false;
}
function Qo(e7) {
  if (!e7.startsWith("M")) throw new RangeError(`Invalid month code: ${e7}.  Month codes must start with M.`);
  const t6 = +e7.slice(1);
  if (Number.isNaN(t6)) throw new RangeError(`Invalid month code: ${e7}`);
  return t6;
}
function ei(e7, t6 = false) {
  return `M${`${e7}`.padStart(2, "0")}${t6 ? "L" : ""}`;
}
function ti(e7, t6 = void 0, n10 = 12) {
  let { month: r7, monthCode: o8 } = e7;
  if (void 0 === o8) {
    if (void 0 === r7) throw new TypeError("Either month or monthCode are required");
    "reject" === t6 && Nr(r7, 1, n10), "constrain" === t6 && (r7 = jr(r7, 1, n10)), o8 = ei(r7);
  } else {
    const e8 = Qo(o8);
    if (o8 !== ei(e8)) throw new RangeError(`Invalid month code: ${o8}`);
    if (void 0 !== r7 && r7 !== e8) throw new RangeError(`monthCode ${o8} and month ${r7} must match if both are present`);
    if (r7 = e8, r7 < 1 || r7 > n10) throw new RangeError(`Invalid monthCode: ${o8}`);
  }
  return { ...e7, month: r7, monthCode: o8 };
}
function ni({ isoYear: e7, isoMonth: t6, isoDay: n10 }) {
  return `${Jn(e7)}-${Gn(t6)}-${Gn(n10)}T00:00Z`;
}
function ri(e7, t6) {
  return { years: e7.year - t6.year, months: e7.month - t6.month, days: e7.day - t6.day };
}
function oi(e7) {
  return e7 % 4 == 0 && (e7 % 100 != 0 || e7 % 400 == 0);
}
function si(e7, t6) {
  let n10 = re(e7, t6);
  return "function" == typeof n10 && (n10 = new ai(re(e7, G), n10(re(e7, K))), function(e8, t7, n11) {
    const r7 = Q(e8);
    if (void 0 === r7) throw new TypeError("Missing slots for the given container");
    if (void 0 === r7[t7]) throw new TypeError(`tried to reset ${t7} which was not set`);
    r7[t7] = n11;
  }(e7, t6, n10)), n10;
}
function ci(e7) {
  return ne(e7, q);
}
function hi() {
  const e7 = re(this, q).resolvedOptions();
  return e7.timeZone = re(this, _2), e7;
}
function ui(e7, ...t6) {
  let n10, r7, o8 = $i(e7, this);
  return o8.formatter ? (n10 = o8.formatter, r7 = [No(o8.epochNs, "floor")]) : (n10 = re(this, q), r7 = [e7, ...t6]), n10.format(...r7);
}
function li(e7, ...t6) {
  let n10, r7, o8 = $i(e7, this);
  return o8.formatter ? (n10 = o8.formatter, r7 = [No(o8.epochNs, "floor")]) : (n10 = re(this, q), r7 = [e7, ...t6]), n10.formatToParts(...r7);
}
function mi(e7, t6) {
  if (void 0 === e7 || void 0 === t6) throw new TypeError("Intl.DateTimeFormat.formatRange requires two values");
  const n10 = Ci(e7), r7 = Ci(t6);
  let o8, i8 = [n10, r7];
  if (Ii(n10) !== Ii(r7)) throw new TypeError("Intl.DateTimeFormat.formatRange accepts two values of the same type");
  if (Ii(n10)) {
    if (!Oi(n10, r7)) throw new TypeError("Intl.DateTimeFormat.formatRange accepts two values of the same type");
    const { epochNs: e8, formatter: t7 } = $i(n10, this), { epochNs: a4, formatter: s7 } = $i(r7, this);
    t7 && (o8 = t7, i8 = [No(e8, "floor"), No(a4, "floor")]);
  }
  return o8 || (o8 = re(this, q)), o8.formatRange(...i8);
}
function fi(e7, t6) {
  if (void 0 === e7 || void 0 === t6) throw new TypeError("Intl.DateTimeFormat.formatRange requires two values");
  const n10 = Ci(e7), r7 = Ci(t6);
  let o8, i8 = [n10, r7];
  if (Ii(n10) !== Ii(r7)) throw new TypeError("Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type");
  if (Ii(n10)) {
    if (!Oi(n10, r7)) throw new TypeError("Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type");
    const { epochNs: e8, formatter: t7 } = $i(n10, this), { epochNs: a4, formatter: s7 } = $i(r7, this);
    t7 && (o8 = t7, i8 = [No(e8, "floor"), No(a4, "floor")]);
  }
  return o8 || (o8 = re(this, q)), o8.formatRangeToParts(...i8);
}
function yi(e7 = {}, t6 = {}) {
  const n10 = Object.assign({}, e7), r7 = ["year", "month", "day", "hour", "minute", "second", "weekday", "dayPeriod", "timeZoneName", "dateStyle", "timeStyle"];
  for (let e8 = 0; e8 < r7.length; e8++) {
    const o8 = r7[e8];
    n10[o8] = o8 in t6 ? t6[o8] : n10[o8], false !== n10[o8] && void 0 !== n10[o8] || delete n10[o8];
  }
  return n10;
}
function pi(e7) {
  const t6 = yi(e7, { year: false, month: false, day: false, weekday: false, timeZoneName: false, dateStyle: false });
  if ("long" !== t6.timeStyle && "full" !== t6.timeStyle || (delete t6.timeStyle, Object.assign(t6, { hour: "numeric", minute: "2-digit", second: "2-digit" })), !Mi(t6)) {
    if (Ei(e7)) throw new TypeError(`cannot format Temporal.PlainTime with options [${Object.keys(e7)}]`);
    Object.assign(t6, { hour: "numeric", minute: "numeric", second: "numeric" });
  }
  return t6;
}
function gi(e7) {
  const t6 = { short: { year: "2-digit", month: "numeric" }, medium: { year: "numeric", month: "short" }, long: { year: "numeric", month: "long" }, full: { year: "numeric", month: "long" } }, n10 = yi(e7, { day: false, hour: false, minute: false, second: false, weekday: false, dayPeriod: false, timeZoneName: false, timeStyle: false });
  if ("dateStyle" in n10 && n10.dateStyle) {
    const e8 = n10.dateStyle;
    delete n10.dateStyle, Object.assign(n10, t6[e8]);
  }
  if (!("year" in n10 || "month" in n10 || "era" in n10)) {
    if (Ei(e7)) throw new TypeError(`cannot format PlainYearMonth with options [${Object.keys(e7)}]`);
    Object.assign(n10, { year: "numeric", month: "numeric" });
  }
  return n10;
}
function wi(e7) {
  const t6 = { short: { month: "numeric", day: "numeric" }, medium: { month: "short", day: "numeric" }, long: { month: "long", day: "numeric" }, full: { month: "long", day: "numeric" } }, n10 = yi(e7, { year: false, hour: false, minute: false, second: false, weekday: false, dayPeriod: false, timeZoneName: false, timeStyle: false });
  if ("dateStyle" in n10 && n10.dateStyle) {
    const e8 = n10.dateStyle;
    delete n10.dateStyle, Object.assign(n10, t6[e8]);
  }
  if (!("month" in n10) && !("day" in n10)) {
    if (Ei(e7)) throw new TypeError(`cannot format PlainMonthDay with options [${Object.keys(e7)}]`);
    Object.assign(n10, { month: "numeric", day: "numeric" });
  }
  return n10;
}
function vi(e7) {
  const t6 = yi(e7, { hour: false, minute: false, second: false, dayPeriod: false, timeZoneName: false, timeStyle: false });
  if (!Ti(t6)) {
    if (Ei(e7)) throw new TypeError(`cannot format PlainDate with options [${Object.keys(e7)}]`);
    Object.assign(t6, { year: "numeric", month: "numeric", day: "numeric" });
  }
  return t6;
}
function bi(e7) {
  const t6 = yi(e7, { timeZoneName: false });
  if (("long" === t6.timeStyle || "full" === t6.timeStyle) && (delete t6.timeStyle, Object.assign(t6, { hour: "numeric", minute: "2-digit", second: "2-digit" }), t6.dateStyle)) {
    const e8 = { short: { year: "numeric", month: "numeric", day: "numeric" }, medium: { year: "numeric", month: "short", day: "numeric" }, long: { year: "numeric", month: "long", day: "numeric" }, full: { year: "numeric", month: "long", day: "numeric", weekday: "long" } };
    Object.assign(t6, e8[t6.dateStyle]), delete t6.dateStyle;
  }
  if (!Mi(t6) && !Ti(t6)) {
    if (Ei(e7)) throw new TypeError(`cannot format PlainDateTime with options [${Object.keys(e7)}]`);
    Object.assign(t6, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
  }
  return t6;
}
function Di(e7) {
  let t6 = e7;
  return Mi(t6) || Ti(t6) || (t6 = Object.assign({}, t6, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })), t6;
}
function Ti(e7) {
  return "year" in e7 || "month" in e7 || "day" in e7 || "weekday" in e7 || "dateStyle" in e7 || "era" in e7;
}
function Mi(e7) {
  return "hour" in e7 || "minute" in e7 || "second" in e7 || "timeStyle" in e7 || "dayPeriod" in e7 || "fractionalSecondDigits" in e7;
}
function Ei(e7) {
  return Ti(e7) || Mi(e7) || "dateStyle" in e7 || "timeStyle" in e7 || "timeZoneName" in e7;
}
function Ii(e7) {
  return mt(e7) || ft(e7) || yt(e7) || wt(e7) || pt(e7) || gt(e7) || ut(e7);
}
function Ci(e7) {
  return Ii(e7) ? e7 : qe(e7);
}
function Oi(e7, t6) {
  return !(!Ii(e7) || !Ii(t6) || ft(e7) && !ft(t6) || mt(e7) && !mt(t6) || yt(e7) && !yt(t6) || wt(e7) && !wt(t6) || pt(e7) && !pt(t6) || gt(e7) && !gt(t6) || ut(e7) && !ut(t6));
}
function $i(e7, t6) {
  if (ft(e7)) {
    const n10 = { isoDate: { year: 1970, month: 1, day: 1 }, time: re(e7, M2) };
    return { epochNs: An(re(t6, W), n10, "compatible"), formatter: si(t6, H2) };
  }
  if (pt(e7)) {
    const n10 = re(e7, E2), r7 = re(t6, J);
    if (n10 !== r7) throw new RangeError(`cannot format PlainYearMonth with calendar ${n10} in locale with calendar ${r7}`);
    const o8 = xt(re(e7, D2), { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    return { epochNs: An(re(t6, W), o8, "compatible"), formatter: si(t6, Z2) };
  }
  if (gt(e7)) {
    const n10 = re(e7, E2), r7 = re(t6, J);
    if (n10 !== r7) throw new RangeError(`cannot format PlainMonthDay with calendar ${n10} in locale with calendar ${r7}`);
    const o8 = xt(re(e7, D2), { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    return { epochNs: An(re(t6, W), o8, "compatible"), formatter: si(t6, F) };
  }
  if (mt(e7)) {
    const n10 = re(e7, E2), r7 = re(t6, J);
    if ("iso8601" !== n10 && n10 !== r7) throw new RangeError(`cannot format PlainDate with calendar ${n10} in locale with calendar ${r7}`);
    const o8 = xt(re(e7, D2), { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    return { epochNs: An(re(t6, W), o8, "compatible"), formatter: si(t6, B2) };
  }
  if (yt(e7)) {
    const n10 = re(e7, E2), r7 = re(t6, J);
    if ("iso8601" !== n10 && n10 !== r7) throw new RangeError(`cannot format PlainDateTime with calendar ${n10} in locale with calendar ${r7}`);
    const o8 = re(e7, T2);
    return { epochNs: An(re(t6, W), o8, "compatible"), formatter: si(t6, z2) };
  }
  if (wt(e7)) throw new TypeError("Temporal.ZonedDateTime not supported in DateTimeFormat methods. Use toLocaleString() instead.");
  return ut(e7) ? { epochNs: re(e7, b3), formatter: si(t6, A2) } : {};
}
function Yi(e7) {
  const t6 = /* @__PURE__ */ Object.create(null);
  return t6.years = re(e7, Y), t6.months = re(e7, R2), t6.weeks = re(e7, S3), t6.days = re(e7, j2), t6.hours = re(e7, k2), t6.minutes = re(e7, N2), t6.seconds = re(e7, x2), t6.milliseconds = re(e7, L2), t6.microseconds = re(e7, P2), t6.nanoseconds = re(e7, U), t6;
}
function ji(e7) {
  Intl.DurationFormat.prototype.resolvedOptions.call(this);
  const t6 = Yi(sn(e7));
  return Ri.call(this, t6);
}
function Ni(e7, t6) {
  vt(e7, mt);
  const n10 = re(e7, D2);
  return Qt(e7).isoToDate(n10, { [t6]: true })[t6];
}
function xi(e7, t6) {
  vt(e7, yt);
  const n10 = re(e7, T2).isoDate;
  return Qt(e7).isoToDate(n10, { [t6]: true })[t6];
}
function Li(e7, t6) {
  return vt(e7, yt), re(e7, T2).time[t6];
}
function Pi(e7, t6) {
  vt(e7, gt);
  const n10 = re(e7, D2);
  return Qt(e7).isoToDate(n10, { [t6]: true })[t6];
}
function Ui(e7) {
  return zn(e7, Po());
}
function Zi(e7, t6) {
  vt(e7, pt);
  const n10 = re(e7, D2);
  return Qt(e7).isoToDate(n10, { [t6]: true })[t6];
}
function Hi(e7) {
  return zn(re(e7, $2), re(e7, b3));
}
function zi(e7, t6) {
  vt(e7, wt);
  const n10 = Hi(e7).isoDate;
  return Qt(e7).isoToDate(n10, { [t6]: true })[t6];
}
function Ai(e7, t6) {
  return vt(e7, wt), Hi(e7).time[t6];
}
var import_jsbi, t5, n8, r6, o6, i7, a3, s6, c6, d3, h5, u3, l3, w2, v2, b3, D2, T2, M2, E2, I2, C2, O, $2, Y, R2, S3, j2, k2, N2, x2, L2, P2, U, B2, Z2, F, H2, z2, A2, q, W, _2, J, G, K, V2, X, Q, ee, te, ie, TimeDuration, me, fe, ye, pe, ge, we, ve, be, De, Te, Me, Ee, Ie, Ce, Oe, $e, Ye, Re, Se, je, ke, Ne, xe, Le, Pe, Ue, Be, Ze, Fe, He, ze, Qe, et, tt, nt, rt, ot, it, at, st, ct, dt, Ot, $t, qt, cr, dr, Po, Wo, _o, Xo, OneObjectCache, HelperBase, HebrewHelper, IslamicBaseHelper, IslamicHelper, IslamicUmalquraHelper, IslamicTblaHelper, IslamicCivilHelper, IslamicRgsaHelper, IslamicCcHelper, PersianHelper, IndianHelper, GregorianBaseHelperFixedEpoch, GregorianBaseHelper, SameMonthDayAsGregorianBaseHelper, ii, OrthodoxBaseHelperFixedEpoch, OrthodoxBaseHelper, EthioaaHelper, CopticHelper, EthiopicHelper, RocHelper, BuddhistHelper, GregoryHelper, JapaneseHelper, ChineseBaseHelper, ChineseHelper, DangiHelper, NonIsoCalendar, ai, DateTimeFormatImpl, di, Ri, Si, ki, Instant, PlainDate, PlainDateTime, Duration, PlainMonthDay, Bi, PlainTime, PlainYearMonth, Fi, ZonedDateTime, qi, Wi, _i;
var init_index_esm = __esm({
  "node_modules/@js-temporal/polyfill/dist/index.esm.js"() {
    import_jsbi = __toESM(require_jsbi_umd(), 1);
    t5 = import_jsbi.default.BigInt(0);
    n8 = import_jsbi.default.BigInt(1);
    r6 = import_jsbi.default.BigInt(2);
    o6 = import_jsbi.default.BigInt(10);
    i7 = import_jsbi.default.BigInt(24);
    a3 = import_jsbi.default.BigInt(60);
    s6 = import_jsbi.default.BigInt(1e3);
    c6 = import_jsbi.default.BigInt(1e6);
    d3 = import_jsbi.default.BigInt(1e9);
    h5 = import_jsbi.default.multiply(import_jsbi.default.BigInt(3600), d3);
    u3 = import_jsbi.default.multiply(a3, d3);
    l3 = import_jsbi.default.multiply(h5, i7);
    b3 = "slot-epochNanoSeconds";
    D2 = "slot-iso-date";
    T2 = "slot-iso-date-time";
    M2 = "slot-time";
    E2 = "slot-calendar";
    I2 = "slot-date-brand";
    C2 = "slot-year-month-brand";
    O = "slot-month-day-brand";
    $2 = "slot-time-zone";
    Y = "slot-years";
    R2 = "slot-months";
    S3 = "slot-weeks";
    j2 = "slot-days";
    k2 = "slot-hours";
    N2 = "slot-minutes";
    x2 = "slot-seconds";
    L2 = "slot-milliseconds";
    P2 = "slot-microseconds";
    U = "slot-nanoseconds";
    B2 = "date";
    Z2 = "ym";
    F = "md";
    H2 = "time";
    z2 = "datetime";
    A2 = "instant";
    q = "original";
    W = "timezone-canonical";
    _2 = "timezone-original";
    J = "calendar-id";
    G = "locale";
    K = "options";
    V2 = /* @__PURE__ */ new WeakMap();
    X = Symbol.for("@@Temporal__GetSlots");
    (w2 = globalThis)[X] || (w2[X] = function(e7) {
      return V2.get(e7);
    });
    Q = globalThis[X];
    ee = Symbol.for("@@Temporal__CreateSlots");
    (v2 = globalThis)[ee] || (v2[ee] = function(e7) {
      V2.set(e7, /* @__PURE__ */ Object.create(null));
    });
    te = globalThis[ee];
    ie = {};
    TimeDuration = class _TimeDuration {
      constructor(t6) {
        this.totalNs = m3(t6), this.sec = import_jsbi.default.toNumber(import_jsbi.default.divide(this.totalNs, d3)), this.subsec = import_jsbi.default.toNumber(import_jsbi.default.remainder(this.totalNs, d3));
      }
      static validateNew(t6, n10) {
        if (import_jsbi.default.greaterThan(y3(t6), _TimeDuration.MAX)) throw new RangeError(`${n10} of duration time units cannot exceed ${_TimeDuration.MAX} s`);
        return new _TimeDuration(t6);
      }
      static fromEpochNsDiff(t6, n10) {
        const r7 = import_jsbi.default.subtract(m3(t6), m3(n10));
        return new _TimeDuration(r7);
      }
      static fromComponents(t6, n10, r7, o8, i8, a4) {
        const l4 = import_jsbi.default.add(import_jsbi.default.add(import_jsbi.default.add(import_jsbi.default.add(import_jsbi.default.add(import_jsbi.default.BigInt(a4), import_jsbi.default.multiply(import_jsbi.default.BigInt(i8), s6)), import_jsbi.default.multiply(import_jsbi.default.BigInt(o8), c6)), import_jsbi.default.multiply(import_jsbi.default.BigInt(r7), d3)), import_jsbi.default.multiply(import_jsbi.default.BigInt(n10), u3)), import_jsbi.default.multiply(import_jsbi.default.BigInt(t6), h5));
        return _TimeDuration.validateNew(l4, "total");
      }
      abs() {
        return new _TimeDuration(y3(this.totalNs));
      }
      add(t6) {
        return _TimeDuration.validateNew(import_jsbi.default.add(this.totalNs, t6.totalNs), "sum");
      }
      add24HourDays(t6) {
        return _TimeDuration.validateNew(import_jsbi.default.add(this.totalNs, import_jsbi.default.multiply(import_jsbi.default.BigInt(t6), l3)), "sum");
      }
      addToEpochNs(t6) {
        return import_jsbi.default.add(m3(t6), this.totalNs);
      }
      cmp(e7) {
        return p3(this.totalNs, e7.totalNs);
      }
      divmod(t6) {
        const { quotient: n10, remainder: r7 } = g2(this.totalNs, import_jsbi.default.BigInt(t6));
        return { quotient: import_jsbi.default.toNumber(n10), remainder: new _TimeDuration(r7) };
      }
      fdiv(n10) {
        const r7 = m3(n10), i8 = import_jsbi.default.BigInt(r7);
        let { quotient: a4, remainder: s7 } = g2(this.totalNs, i8);
        const c7 = [];
        let d4;
        const h7 = (import_jsbi.default.lessThan(this.totalNs, t5) ? -1 : 1) * Math.sign(import_jsbi.default.toNumber(r7));
        for (; !import_jsbi.default.equal(s7, t5) && c7.length < 50; ) s7 = import_jsbi.default.multiply(s7, o6), { quotient: d4, remainder: s7 } = g2(s7, i8), c7.push(Math.abs(import_jsbi.default.toNumber(d4)));
        return h7 * Number(y3(a4).toString() + "." + c7.join(""));
      }
      isZero() {
        return import_jsbi.default.equal(this.totalNs, t5);
      }
      round(o8, i8) {
        const a4 = m3(o8);
        if (import_jsbi.default.equal(a4, n8)) return this;
        const { quotient: s7, remainder: c7 } = g2(this.totalNs, a4), d4 = import_jsbi.default.lessThan(this.totalNs, t5) ? "negative" : "positive", h7 = import_jsbi.default.multiply(y3(s7), a4), u4 = import_jsbi.default.add(h7, a4), l4 = p3(y3(import_jsbi.default.multiply(c7, r6)), a4), w3 = ue(i8, d4), v3 = import_jsbi.default.equal(y3(this.totalNs), h7) ? h7 : le(h7, u4, l4, f4(s7), w3), b4 = "positive" === d4 ? v3 : import_jsbi.default.unaryMinus(v3);
        return _TimeDuration.validateNew(b4, "rounding");
      }
      sign() {
        return this.cmp(new _TimeDuration(t5));
      }
      subtract(t6) {
        return _TimeDuration.validateNew(import_jsbi.default.subtract(this.totalNs, t6.totalNs), "difference");
      }
    };
    TimeDuration.MAX = import_jsbi.default.BigInt("9007199254740991999999999"), TimeDuration.ZERO = new TimeDuration(t5);
    me = /[A-Za-z._][A-Za-z._0-9+-]*/;
    fe = new RegExp(`(?:${/(?:[+-](?:[01][0-9]|2[0-3])(?::?[0-5][0-9])?)/.source}|(?:${me.source})(?:\\/(?:${me.source}))*)`);
    ye = /(?:[+-]\d{6}|\d{4})/;
    pe = /(?:0[1-9]|1[0-2])/;
    ge = /(?:0[1-9]|[12]\d|3[01])/;
    we = new RegExp(`(${ye.source})(?:-(${pe.source})-(${ge.source})|(${pe.source})(${ge.source}))`);
    ve = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/;
    be = /((?:[+-])(?:[01][0-9]|2[0-3])(?::?(?:[0-5][0-9])(?::?(?:[0-5][0-9])(?:[.,](?:\d{1,9}))?)?)?)/;
    De = new RegExp(`([zZ])|${be.source}?`);
    Te = /\[(!)?([a-z_][a-z0-9_-]*)=([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\]/g;
    Me = new RegExp([`^${we.source}`, `(?:(?:[tT]|\\s+)${ve.source}(?:${De.source})?)?`, `(?:\\[!?(${fe.source})\\])?`, `((?:${Te.source})*)$`].join(""));
    Ee = new RegExp([`^[tT]?${ve.source}`, `(?:${De.source})?`, `(?:\\[!?${fe.source}\\])?`, `((?:${Te.source})*)$`].join(""));
    Ie = new RegExp(`^(${ye.source})-?(${pe.source})(?:\\[!?${fe.source}\\])?((?:${Te.source})*)$`);
    Ce = new RegExp(`^(?:--)?(${pe.source})-?(${ge.source})(?:\\[!?${fe.source}\\])?((?:${Te.source})*)$`);
    Oe = /(\d+)(?:[.,](\d{1,9}))?/;
    $e = new RegExp(`(?:${Oe.source}H)?(?:${Oe.source}M)?(?:${Oe.source}S)?`);
    Ye = new RegExp(`^([+-])?P${/(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/.source}(?:T(?!$)${$e.source})?$`, "i");
    Re = 864e5;
    Se = 1e6 * Re;
    je = 6e10;
    ke = 1e8 * Re;
    Ne = xo(ke);
    xe = import_jsbi.default.unaryMinus(Ne);
    Le = import_jsbi.default.add(import_jsbi.default.subtract(xe, l3), n8);
    Pe = import_jsbi.default.subtract(import_jsbi.default.add(Ne, l3), n8);
    Ue = 146097 * Re;
    Be = -271821;
    Ze = 275760;
    Fe = Date.UTC(1847, 0, 1);
    He = ["iso8601", "hebrew", "islamic", "islamic-umalqura", "islamic-tbla", "islamic-civil", "islamic-rgsa", "islamicc", "persian", "ethiopic", "ethioaa", "ethiopic-amete-alem", "coptic", "chinese", "dangi", "roc", "indian", "buddhist", "japanese", "gregory"];
    ze = /* @__PURE__ */ new Set(["ACT", "AET", "AGT", "ART", "AST", "BET", "BST", "CAT", "CNT", "CST", "CTT", "EAT", "ECT", "IET", "IST", "JST", "MIT", "NET", "NST", "PLT", "PNT", "PRT", "PST", "SST", "VST"]);
    Qe = ["era", "eraYear", "year", "month", "monthCode", "day", "hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset", "timeZone"];
    et = { era: We, eraYear: _e, year: _e, month: Je, monthCode: function(e7) {
      const t6 = Ve(Xe(e7));
      if (t6.length < 3 || t6.length > 4 || "M" !== t6[0] || -1 === "0123456789".indexOf(t6[1]) || -1 === "0123456789".indexOf(t6[2]) || t6[1] + t6[2] === "00" && "L" !== t6[3] || "L" !== t6[3] && void 0 !== t6[3]) throw new RangeError(`bad month code ${t6}; must match M01-M99 or M00L-M99L`);
      return t6;
    }, day: Je, hour: _e, minute: _e, second: _e, millisecond: _e, microsecond: _e, nanosecond: _e, offset: function(e7) {
      const t6 = Ve(Xe(e7));
      return sr(t6), t6;
    }, timeZone: Bn };
    tt = { hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
    nt = [["years", "year", "date"], ["months", "month", "date"], ["weeks", "week", "date"], ["days", "day", "date"], ["hours", "hour", "time"], ["minutes", "minute", "time"], ["seconds", "second", "time"], ["milliseconds", "millisecond", "time"], ["microseconds", "microsecond", "time"], ["nanoseconds", "nanosecond", "time"]];
    rt = Object.fromEntries(nt.map((e7) => [e7[0], e7[1]]));
    ot = Object.fromEntries(nt.map(([e7, t6]) => [t6, e7]));
    it = nt.map(([, e7]) => e7);
    at = { day: Se, hour: 36e11, minute: 6e10, second: 1e9, millisecond: 1e6, microsecond: 1e3, nanosecond: 1 };
    st = ["days", "hours", "microseconds", "milliseconds", "minutes", "months", "nanoseconds", "seconds", "weeks", "years"];
    ct = Intl.DateTimeFormat;
    dt = /* @__PURE__ */ new Map();
    Ot = new RegExp(`^${fe.source}$`, "i");
    $t = new RegExp(`^${/([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])?)?/.source}$`);
    qt = Symbol("~required~");
    dr = Object.assign(/* @__PURE__ */ Object.create(null), { "/": true, "-": true, _: true });
    Po = (() => {
      let t6 = import_jsbi.default.BigInt(Date.now() % 1e6);
      return () => {
        const n10 = Date.now(), r7 = import_jsbi.default.BigInt(n10), o8 = import_jsbi.default.add(xo(n10), t6);
        return t6 = import_jsbi.default.remainder(r7, c6), import_jsbi.default.greaterThan(o8, Ne) ? Ne : import_jsbi.default.lessThan(o8, xe) ? xe : o8;
      };
    })();
    Wo = new RegExp(`^${be.source}$`);
    _o = new RegExp(`^${/([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\d{1,9}))?)?)?/.source}$`);
    Xo = {};
    Xo.iso8601 = { resolveFields(e7, t6) {
      if (("date" === t6 || "year-month" === t6) && void 0 === e7.year) throw new TypeError("year is required");
      if (("date" === t6 || "month-day" === t6) && void 0 === e7.day) throw new TypeError("day is required");
      Object.assign(e7, ti(e7));
    }, dateToISO: (e7, t6) => St(e7.year, e7.month, e7.day, t6), monthDayToISOReferenceDate(e7, t6) {
      const { month: n10, day: r7 } = St(e7.year ?? 1972, e7.month, e7.day, t6);
      return { month: n10, day: r7, year: 1972 };
    }, extraFields: () => [], fieldKeysToIgnore(e7) {
      const t6 = /* @__PURE__ */ new Set();
      for (let n10 = 0; n10 < e7.length; n10++) {
        const r7 = e7[n10];
        t6.add(r7), "month" === r7 ? t6.add("monthCode") : "monthCode" === r7 && t6.add("month");
      }
      return Go(t6);
    }, dateAdd(e7, { years: t6 = 0, months: n10 = 0, weeks: r7 = 0, days: o8 = 0 }, i8) {
      let { year: a4, month: s7, day: c7 } = e7;
      return a4 += t6, s7 += n10, { year: a4, month: s7 } = Cr(a4, s7), { year: a4, month: s7, day: c7 } = St(a4, s7, c7, i8), c7 += o8 + 7 * r7, Or(a4, s7, c7);
    }, dateUntil(e7, t6, n10) {
      const r7 = -Ro(e7, t6);
      if (0 === r7) return { years: 0, months: 0, weeks: 0, days: 0 };
      let o8, i8 = 0, a4 = 0;
      if ("year" === n10 || "month" === n10) {
        let s8 = t6.year - e7.year;
        for (0 !== s8 && (s8 -= r7); !Vo(r7, e7.year + s8, e7.month, e7.day, t6); ) i8 = s8, s8 += r7;
        let c8 = r7;
        for (o8 = Cr(e7.year + i8, e7.month + c8); !Vo(r7, o8.year, o8.month, e7.day, t6); ) a4 = c8, c8 += r7, o8 = Cr(o8.year, o8.month + r7);
        "month" === n10 && (a4 += 12 * i8, i8 = 0);
      }
      o8 = Cr(e7.year + i8, e7.month + a4);
      const s7 = kr(o8.year, o8.month, e7.day);
      let c7 = 0, d4 = Gr(t6.year, t6.month - 1, t6.day) - Gr(s7.year, s7.month - 1, s7.day);
      return "week" === n10 && (c7 = Math.trunc(d4 / 7), d4 %= 7), { years: i8, months: a4, weeks: c7, days: d4 };
    }, isoToDate({ year: e7, month: t6, day: n10 }, r7) {
      const o8 = { era: void 0, eraYear: void 0, year: e7, month: t6, day: n10, daysInWeek: 7, monthsInYear: 12 };
      if (r7.monthCode && (o8.monthCode = ei(t6)), r7.dayOfWeek) {
        const r8 = t6 + (t6 < 3 ? 10 : -2), i8 = e7 - (t6 < 3 ? 1 : 0), a4 = Math.floor(i8 / 100), s7 = i8 - 100 * a4, c7 = (n10 + Math.floor(2.6 * r8 - 0.2) + (s7 + Math.floor(s7 / 4)) + (Math.floor(a4 / 4) - 2 * a4)) % 7;
        o8.dayOfWeek = c7 + (c7 <= 0 ? 7 : 0);
      }
      if (r7.dayOfYear) {
        let r8 = n10;
        for (let n11 = t6 - 1; n11 > 0; n11--) r8 += Tr(e7, n11);
        o8.dayOfYear = r8;
      }
      return r7.weekOfYear && (o8.weekOfYear = Ko("iso8601", { year: e7, month: t6, day: n10 })), r7.daysInMonth && (o8.daysInMonth = Tr(e7, t6)), (r7.daysInYear || r7.inLeapYear) && (o8.inLeapYear = Dr(e7), o8.daysInYear = o8.inLeapYear ? 366 : 365), o8;
    }, getFirstDayOfWeek: () => 1, getMinimalDaysInFirstWeek: () => 4 };
    OneObjectCache = class _OneObjectCache {
      constructor(e7) {
        if (this.map = /* @__PURE__ */ new Map(), this.calls = 0, this.hits = 0, this.misses = 0, void 0 !== e7) {
          let t6 = 0;
          for (const n10 of e7.map.entries()) {
            if (++t6 > _OneObjectCache.MAX_CACHE_ENTRIES) break;
            this.map.set(...n10);
          }
        }
      }
      get(e7) {
        const t6 = this.map.get(e7);
        return t6 && (this.hits++, this.report()), this.calls++, t6;
      }
      set(e7, t6) {
        this.map.set(e7, t6), this.misses++, this.report();
      }
      report() {
      }
      setObject(e7) {
        if (_OneObjectCache.objectMap.get(e7)) throw new RangeError("object already cached");
        _OneObjectCache.objectMap.set(e7, this), this.report();
      }
      static getCacheForObject(e7) {
        let t6 = _OneObjectCache.objectMap.get(e7);
        return t6 || (t6 = new _OneObjectCache(), _OneObjectCache.objectMap.set(e7, t6)), t6;
      }
    };
    OneObjectCache.objectMap = /* @__PURE__ */ new WeakMap(), OneObjectCache.MAX_CACHE_ENTRIES = 1e3;
    HelperBase = class {
      constructor() {
        this.eras = [], this.hasEra = false, this.erasBeginMidYear = false;
      }
      getFormatter() {
        return void 0 === this.formatter && (this.formatter = new Intl.DateTimeFormat(`en-US-u-ca-${this.id}`, { day: "numeric", month: "numeric", year: "numeric", era: "short", timeZone: "UTC" })), this.formatter;
      }
      getCalendarParts(e7) {
        let t6 = this.getFormatter(), n10 = new Date(e7);
        if ("-271821-04-19T00:00Z" === e7) {
          const e8 = t6.resolvedOptions();
          t6 = new Intl.DateTimeFormat(e8.locale, { ...e8, timeZone: "Etc/GMT+1" }), n10 = /* @__PURE__ */ new Date("-271821-04-20T00:00Z");
        }
        try {
          return t6.formatToParts(n10);
        } catch (t7) {
          throw new RangeError(`Invalid ISO date: ${e7}`);
        }
      }
      isoToCalendarDate(e7, t6) {
        const { year: n10, month: r7, day: o8 } = e7, i8 = JSON.stringify({ func: "isoToCalendarDate", isoYear: n10, isoMonth: r7, isoDay: o8, id: this.id }), a4 = t6.get(i8);
        if (a4) return a4;
        const s7 = ni({ isoYear: n10, isoMonth: r7, isoDay: o8 }), c7 = this.getCalendarParts(s7), d4 = {};
        for (let e8 = 0; e8 < c7.length; e8++) {
          const { type: t7, value: n11 } = c7[e8];
          if ("year" !== t7 && "relatedYear" !== t7 || (this.hasEra ? d4.eraYear = +n11 : d4.year = +n11), "month" === t7) {
            const e9 = /^([0-9]*)(.*?)$/.exec(n11);
            if (!e9 || 3 != e9.length || !e9[1] && !e9[2]) throw new RangeError(`Unexpected month: ${n11}`);
            if (d4.month = e9[1] ? +e9[1] : 1, d4.month < 1) throw new RangeError(`Invalid month ${n11} from ${s7}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10527)`);
            if (d4.month > 13) throw new RangeError(`Invalid month ${n11} from ${s7}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
            e9[2] && (d4.monthExtra = e9[2]);
          }
          "day" === t7 && (d4.day = +n11), this.hasEra && "era" === t7 && null != n11 && "" !== n11 && (d4.era = n11.split(" (")[0].normalize("NFD").replace(/[^-0-9 \p{L}]/gu, "").replace(/ /g, "-").toLowerCase());
        }
        if (this.hasEra && void 0 === d4.eraYear) throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
        if (this.hasEra) {
          const e8 = this.eras.find((e9) => d4.era === e9.genericName);
          e8 && (d4.era = e8.code);
        }
        if (this.reviseIntlEra) {
          const { era: t7, eraYear: n11 } = this.reviseIntlEra(d4, e7);
          d4.era = t7, d4.eraYear = n11;
        }
        this.checkIcuBugs && this.checkIcuBugs(e7);
        const h7 = this.adjustCalendarDate(d4, t6, "constrain", true);
        if (void 0 === h7.year) throw new RangeError(`Missing year converting ${JSON.stringify(e7)}`);
        if (void 0 === h7.month) throw new RangeError(`Missing month converting ${JSON.stringify(e7)}`);
        if (void 0 === h7.day) throw new RangeError(`Missing day converting ${JSON.stringify(e7)}`);
        return t6.set(i8, h7), ["constrain", "reject"].forEach((n11) => {
          const r8 = JSON.stringify({ func: "calendarToIsoDate", year: h7.year, month: h7.month, day: h7.day, overflow: n11, id: this.id });
          t6.set(r8, e7);
        }), h7;
      }
      validateCalendarDate(e7) {
        const { month: t6, year: n10, day: r7, eraYear: o8, monthCode: i8, monthExtra: a4 } = e7;
        if (void 0 !== a4) throw new RangeError("Unexpected `monthExtra` value");
        if (void 0 === n10 && void 0 === o8) throw new TypeError("year or eraYear is required");
        if (void 0 === t6 && void 0 === i8) throw new TypeError("month or monthCode is required");
        if (void 0 === r7) throw new RangeError("Missing day");
        if (void 0 !== i8) {
          if ("string" != typeof i8) throw new RangeError("monthCode must be a string, not " + typeof i8);
          if (!/^M([01]?\d)(L?)$/.test(i8)) throw new RangeError(`Invalid monthCode: ${i8}`);
        }
        if (this.hasEra && void 0 === e7.era != (void 0 === e7.eraYear)) throw new TypeError("properties era and eraYear must be provided together");
      }
      adjustCalendarDate(e7, t6 = void 0, n10 = "constrain", r7 = false) {
        if ("lunisolar" === this.calendarType) throw new RangeError("Override required for lunisolar calendars");
        let o8 = e7;
        this.validateCalendarDate(o8);
        const i8 = this.monthsInYear(o8, t6);
        let { month: a4, monthCode: s7 } = o8;
        return { month: a4, monthCode: s7 } = ti(o8, n10, i8), { ...o8, month: a4, monthCode: s7 };
      }
      regulateMonthDayNaive(e7, t6, n10) {
        const r7 = this.monthsInYear(e7, n10);
        let { month: o8, day: i8 } = e7;
        return "reject" === t6 ? (Nr(o8, 1, r7), Nr(i8, 1, this.maximumMonthLength(e7))) : (o8 = jr(o8, 1, r7), i8 = jr(i8, 1, this.maximumMonthLength({ ...e7, month: o8 }))), { ...e7, month: o8, day: i8 };
      }
      calendarToIsoDate(e7, t6 = "constrain", n10) {
        const r7 = e7;
        let o8 = this.adjustCalendarDate(e7, n10, t6, false);
        o8 = this.regulateMonthDayNaive(o8, t6, n10);
        const { year: i8, month: a4, day: s7 } = o8, c7 = JSON.stringify({ func: "calendarToIsoDate", year: i8, month: a4, day: s7, overflow: t6, id: this.id });
        let d4, h7 = n10.get(c7);
        if (h7) return h7;
        if (void 0 !== r7.year && void 0 !== r7.month && void 0 !== r7.day && (r7.year !== o8.year || r7.month !== o8.month || r7.day !== o8.day) && (d4 = JSON.stringify({ func: "calendarToIsoDate", year: r7.year, month: r7.month, day: r7.day, overflow: t6, id: this.id }), h7 = n10.get(d4), h7)) return h7;
        let u4 = this.estimateIsoDate({ year: i8, month: a4, day: s7 });
        const l4 = (e8) => {
          let r8 = this.addDaysIso(u4, e8);
          if (o8.day > this.minimumMonthLength(o8)) {
            let e9 = this.isoToCalendarDate(r8, n10);
            for (; e9.month !== a4 || e9.year !== i8; ) {
              if ("reject" === t6) throw new RangeError(`day ${s7} does not exist in month ${a4} of year ${i8}`);
              r8 = this.addDaysIso(r8, -1), e9 = this.isoToCalendarDate(r8, n10);
            }
          }
          return r8;
        };
        let m4 = 0, f5 = this.isoToCalendarDate(u4, n10), y4 = ri(o8, f5);
        if (0 !== y4.years || 0 !== y4.months || 0 !== y4.days) {
          const e8 = 365 * y4.years + 30 * y4.months + y4.days;
          u4 = this.addDaysIso(u4, e8), f5 = this.isoToCalendarDate(u4, n10), y4 = ri(o8, f5), 0 === y4.years && 0 === y4.months ? u4 = l4(y4.days) : m4 = this.compareCalendarDates(o8, f5);
        }
        let p4 = 8;
        for (; m4; ) {
          u4 = this.addDaysIso(u4, m4 * p4);
          const e8 = f5;
          f5 = this.isoToCalendarDate(u4, n10);
          const i9 = m4;
          if (m4 = this.compareCalendarDates(o8, f5), m4) {
            if (y4 = ri(o8, f5), 0 === y4.years && 0 === y4.months) u4 = l4(y4.days), m4 = 0;
            else if (i9 && m4 !== i9) if (p4 > 1) p4 /= 2;
            else {
              if ("reject" === t6) throw new RangeError(`Can't find ISO date from calendar date: ${JSON.stringify({ ...r7 })}`);
              this.compareCalendarDates(f5, e8) > 0 && (u4 = this.addDaysIso(u4, -1)), m4 = 0;
            }
          }
        }
        if (n10.set(c7, u4), d4 && n10.set(d4, u4), void 0 === o8.year || void 0 === o8.month || void 0 === o8.day || void 0 === o8.monthCode || this.hasEra && (void 0 === o8.era || void 0 === o8.eraYear)) throw new RangeError("Unexpected missing property");
        return u4;
      }
      compareCalendarDates(e7, t6) {
        return e7.year !== t6.year ? Bo(e7.year - t6.year) : e7.month !== t6.month ? Bo(e7.month - t6.month) : e7.day !== t6.day ? Bo(e7.day - t6.day) : 0;
      }
      regulateDate(e7, t6 = "constrain", n10) {
        const r7 = this.calendarToIsoDate(e7, t6, n10);
        return this.isoToCalendarDate(r7, n10);
      }
      addDaysIso(e7, t6) {
        return Or(e7.year, e7.month, e7.day + t6);
      }
      addDaysCalendar(e7, t6, n10) {
        const r7 = this.calendarToIsoDate(e7, "constrain", n10), o8 = this.addDaysIso(r7, t6);
        return this.isoToCalendarDate(o8, n10);
      }
      addMonthsCalendar(e7, t6, n10, r7) {
        let o8 = e7;
        const { day: i8 } = o8;
        for (let e8 = 0, n11 = Math.abs(t6); e8 < n11; e8++) {
          const { month: e9 } = o8, n12 = o8, a4 = t6 < 0 ? -Math.max(i8, this.daysInPreviousMonth(o8, r7)) : this.daysInMonth(o8, r7), s7 = this.calendarToIsoDate(o8, "constrain", r7);
          let c7 = this.addDaysIso(s7, a4);
          if (o8 = this.isoToCalendarDate(c7, r7), t6 > 0) {
            const t7 = this.monthsInYear(n12, r7);
            for (; o8.month - 1 != e9 % t7; ) c7 = this.addDaysIso(c7, -1), o8 = this.isoToCalendarDate(c7, r7);
          }
          o8.day !== i8 && (o8 = this.regulateDate({ ...o8, day: i8 }, "constrain", r7));
        }
        if ("reject" === n10 && o8.day !== i8) throw new RangeError(`Day ${i8} does not exist in resulting calendar month`);
        return o8;
      }
      addCalendar(e7, { years: t6 = 0, months: n10 = 0, weeks: r7 = 0, days: o8 = 0 }, i8, a4) {
        const { year: s7, day: c7, monthCode: d4 } = e7, h7 = this.adjustCalendarDate({ year: s7 + t6, monthCode: d4, day: c7 }, a4), u4 = this.addMonthsCalendar(h7, n10, i8, a4), l4 = o8 + 7 * r7;
        return this.addDaysCalendar(u4, l4, a4);
      }
      untilCalendar(e7, t6, n10, r7) {
        let o8 = 0, i8 = 0, a4 = 0, s7 = 0;
        switch (n10) {
          case "day":
            o8 = this.calendarDaysUntil(e7, t6, r7);
            break;
          case "week": {
            const n11 = this.calendarDaysUntil(e7, t6, r7);
            o8 = n11 % 7, i8 = (n11 - o8) / 7;
            break;
          }
          case "month":
          case "year": {
            const i9 = this.compareCalendarDates(t6, e7);
            if (!i9) return { years: 0, months: 0, weeks: 0, days: 0 };
            const c7 = t6.year - e7.year, d4 = t6.day - e7.day;
            if ("year" === n10 && c7) {
              let n11 = 0;
              t6.monthCode > e7.monthCode && (n11 = 1), t6.monthCode < e7.monthCode && (n11 = -1), n11 || (n11 = Math.sign(d4)), s7 = n11 * i9 < 0 ? c7 - i9 : c7;
            }
            let h7, u4 = s7 ? this.addCalendar(e7, { years: s7 }, "constrain", r7) : e7;
            do {
              a4 += i9, h7 = u4, u4 = this.addMonthsCalendar(h7, i9, "constrain", r7), u4.day !== e7.day && (u4 = this.regulateDate({ ...u4, day: e7.day }, "constrain", r7));
            } while (this.compareCalendarDates(t6, u4) * i9 >= 0);
            a4 -= i9, o8 = this.calendarDaysUntil(h7, t6, r7);
            break;
          }
        }
        return { years: s7, months: a4, weeks: i8, days: o8 };
      }
      daysInMonth(e7, t6) {
        const { day: n10 } = e7, r7 = this.maximumMonthLength(e7), o8 = this.minimumMonthLength(e7);
        if (o8 === r7) return o8;
        const i8 = n10 <= r7 - o8 ? r7 : o8, a4 = this.calendarToIsoDate(e7, "constrain", t6), s7 = this.addDaysIso(a4, i8), c7 = this.isoToCalendarDate(s7, t6), d4 = this.addDaysIso(s7, -c7.day);
        return this.isoToCalendarDate(d4, t6).day;
      }
      daysInPreviousMonth(e7, t6) {
        const { day: n10, month: r7, year: o8 } = e7;
        let i8 = { year: r7 > 1 ? o8 : o8 - 1, month: r7, day: 1 };
        const a4 = r7 > 1 ? r7 - 1 : this.monthsInYear(i8, t6);
        i8 = { ...i8, month: a4 };
        const s7 = this.minimumMonthLength(i8), c7 = this.maximumMonthLength(i8);
        if (s7 === c7) return c7;
        const d4 = this.calendarToIsoDate(e7, "constrain", t6), h7 = this.addDaysIso(d4, -n10);
        return this.isoToCalendarDate(h7, t6).day;
      }
      startOfCalendarYear(e7) {
        return { year: e7.year, month: 1, monthCode: "M01", day: 1 };
      }
      startOfCalendarMonth(e7) {
        return { year: e7.year, month: e7.month, day: 1 };
      }
      calendarDaysUntil(e7, t6, n10) {
        const r7 = this.calendarToIsoDate(e7, "constrain", n10), o8 = this.calendarToIsoDate(t6, "constrain", n10);
        return Gr(o8.year, o8.month - 1, o8.day) - Gr(r7.year, r7.month - 1, r7.day);
      }
      monthDaySearchStartYear(e7, t6) {
        return 1972;
      }
      monthDayFromFields(e7, t6, n10) {
        let r7, o8, i8, a4, s7, { era: c7, eraYear: d4, year: h7, month: u4, monthCode: l4, day: m4 } = e7;
        if (void 0 !== u4 && void 0 === h7 && (!this.hasEra || void 0 === c7 || void 0 === d4)) throw new TypeError("when month is present, year (or era and eraYear) are required");
        (void 0 === l4 || void 0 !== h7 || this.hasEra && void 0 !== d4) && ({ monthCode: l4, day: m4 } = this.isoToCalendarDate(this.calendarToIsoDate(e7, t6, n10), n10));
        const f5 = { year: this.monthDaySearchStartYear(l4, m4), month: 12, day: 31 }, y4 = this.isoToCalendarDate(f5, n10), p4 = y4.monthCode > l4 || y4.monthCode === l4 && y4.day >= m4 ? y4.year : y4.year - 1;
        for (let e8 = 0; e8 < 20; e8++) {
          const c8 = this.adjustCalendarDate({ day: m4, monthCode: l4, year: p4 - e8 }, n10), d5 = this.calendarToIsoDate(c8, "constrain", n10), h8 = this.isoToCalendarDate(d5, n10);
          if ({ year: r7, month: o8, day: i8 } = d5, h8.monthCode === l4 && h8.day === m4) return { month: o8, day: i8, year: r7 };
          if ("constrain" === t6) {
            const e9 = this.maxLengthOfMonthCodeInAnyYear(h8.monthCode);
            if (h8.monthCode === l4 && h8.day === e9 && m4 > e9) return { month: o8, day: i8, year: r7 };
            (void 0 === a4 || h8.monthCode === a4.monthCode && h8.day > a4.day) && (a4 = h8, s7 = d5);
          }
        }
        if ("constrain" === t6 && void 0 !== s7) return s7;
        throw new RangeError(`No recent ${this.id} year with monthCode ${l4} and day ${m4}`);
      }
      getFirstDayOfWeek() {
      }
      getMinimalDaysInFirstWeek() {
      }
    };
    HebrewHelper = class extends HelperBase {
      constructor() {
        super(...arguments), this.id = "hebrew", this.calendarType = "lunisolar", this.months = { Tishri: { leap: 1, regular: 1, monthCode: "M01", days: 30 }, Heshvan: { leap: 2, regular: 2, monthCode: "M02", days: { min: 29, max: 30 } }, Kislev: { leap: 3, regular: 3, monthCode: "M03", days: { min: 29, max: 30 } }, Tevet: { leap: 4, regular: 4, monthCode: "M04", days: 29 }, Shevat: { leap: 5, regular: 5, monthCode: "M05", days: 30 }, Adar: { leap: void 0, regular: 6, monthCode: "M06", days: 29 }, "Adar I": { leap: 6, regular: void 0, monthCode: "M05L", days: 30 }, "Adar II": { leap: 7, regular: void 0, monthCode: "M06", days: 29 }, Nisan: { leap: 8, regular: 7, monthCode: "M07", days: 30 }, Iyar: { leap: 9, regular: 8, monthCode: "M08", days: 29 }, Sivan: { leap: 10, regular: 9, monthCode: "M09", days: 30 }, Tamuz: { leap: 11, regular: 10, monthCode: "M10", days: 29 }, Av: { leap: 12, regular: 11, monthCode: "M11", days: 30 }, Elul: { leap: 13, regular: 12, monthCode: "M12", days: 29 } };
      }
      inLeapYear(e7) {
        const { year: t6 } = e7;
        return (7 * t6 + 1) % 19 < 7;
      }
      monthsInYear(e7) {
        return this.inLeapYear(e7) ? 13 : 12;
      }
      minimumMonthLength(e7) {
        return this.minMaxMonthLength(e7, "min");
      }
      maximumMonthLength(e7) {
        return this.minMaxMonthLength(e7, "max");
      }
      minMaxMonthLength(e7, t6) {
        const { month: n10, year: r7 } = e7, o8 = this.getMonthCode(r7, n10), i8 = Object.entries(this.months).find((e8) => e8[1].monthCode === o8);
        if (void 0 === i8) throw new RangeError(`unmatched Hebrew month: ${n10}`);
        const a4 = i8[1].days;
        return "number" == typeof a4 ? a4 : a4[t6];
      }
      maxLengthOfMonthCodeInAnyYear(e7) {
        return ["M04", "M06", "M08", "M10", "M12"].includes(e7) ? 29 : 30;
      }
      estimateIsoDate(e7) {
        const { year: t6 } = e7;
        return { year: t6 - 3760, month: 1, day: 1 };
      }
      getMonthCode(e7, t6) {
        return this.inLeapYear({ year: e7 }) ? 6 === t6 ? ei(5, true) : ei(t6 < 6 ? t6 : t6 - 1) : ei(t6);
      }
      adjustCalendarDate(e7, t6, n10 = "constrain", r7 = false) {
        let { year: o8, month: i8, monthCode: a4, day: s7, monthExtra: c7 } = e7;
        if (void 0 === o8) throw new TypeError("Missing property: year");
        if (r7) {
          if (c7) {
            const e8 = this.months[c7];
            if (!e8) throw new RangeError(`Unrecognized month from formatToParts: ${c7}`);
            i8 = this.inLeapYear({ year: o8 }) ? e8.leap : e8.regular;
          }
          return a4 = this.getMonthCode(o8, i8), { year: o8, month: i8, day: s7, monthCode: a4 };
        }
        if (this.validateCalendarDate(e7), void 0 === i8) if (a4.endsWith("L")) {
          if ("M05L" !== a4) throw new RangeError(`Hebrew leap month must have monthCode M05L, not ${a4}`);
          if (i8 = 6, !this.inLeapYear({ year: o8 })) {
            if ("reject" === n10) throw new RangeError(`Hebrew monthCode M05L is invalid in year ${o8} which is not a leap year`);
            i8 = 6, a4 = "M06";
          }
        } else {
          i8 = Qo(a4), this.inLeapYear({ year: o8 }) && i8 >= 6 && i8++;
          const e8 = this.monthsInYear({ year: o8 });
          if (i8 < 1 || i8 > e8) throw new RangeError(`Invalid monthCode: ${a4}`);
        }
        else if ("reject" === n10 ? (Nr(i8, 1, this.monthsInYear({ year: o8 })), Nr(s7, 1, this.maximumMonthLength({ year: o8, month: i8 }))) : (i8 = jr(i8, 1, this.monthsInYear({ year: o8 })), s7 = jr(s7, 1, this.maximumMonthLength({ year: o8, month: i8 }))), void 0 === a4) a4 = this.getMonthCode(o8, i8);
        else if (this.getMonthCode(o8, i8) !== a4) throw new RangeError(`monthCode ${a4} doesn't correspond to month ${i8} in Hebrew year ${o8}`);
        return { ...e7, day: s7, month: i8, monthCode: a4, year: o8 };
      }
    };
    IslamicBaseHelper = class extends HelperBase {
      constructor() {
        super(...arguments), this.calendarType = "lunar", this.DAYS_PER_ISLAMIC_YEAR = 354 + 11 / 30, this.DAYS_PER_ISO_YEAR = 365.2425;
      }
      inLeapYear(e7, t6) {
        const n10 = { year: e7.year, month: 1, monthCode: "M01", day: 1 }, r7 = { year: e7.year + 1, month: 1, monthCode: "M01", day: 1 };
        return 355 === this.calendarDaysUntil(n10, r7, t6);
      }
      monthsInYear() {
        return 12;
      }
      minimumMonthLength() {
        return 29;
      }
      maximumMonthLength() {
        return 30;
      }
      maxLengthOfMonthCodeInAnyYear() {
        return 30;
      }
      estimateIsoDate(e7) {
        const { year: t6 } = this.adjustCalendarDate(e7);
        return { year: Math.floor(t6 * this.DAYS_PER_ISLAMIC_YEAR / this.DAYS_PER_ISO_YEAR) + 622, month: 1, day: 1 };
      }
    };
    IslamicHelper = class extends IslamicBaseHelper {
      constructor() {
        super(...arguments), this.id = "islamic";
      }
    };
    IslamicUmalquraHelper = class extends IslamicBaseHelper {
      constructor() {
        super(...arguments), this.id = "islamic-umalqura";
      }
    };
    IslamicTblaHelper = class extends IslamicBaseHelper {
      constructor() {
        super(...arguments), this.id = "islamic-tbla";
      }
    };
    IslamicCivilHelper = class extends IslamicBaseHelper {
      constructor() {
        super(...arguments), this.id = "islamic-civil";
      }
    };
    IslamicRgsaHelper = class extends IslamicBaseHelper {
      constructor() {
        super(...arguments), this.id = "islamic-rgsa";
      }
    };
    IslamicCcHelper = class extends IslamicBaseHelper {
      constructor() {
        super(...arguments), this.id = "islamicc";
      }
    };
    PersianHelper = class extends HelperBase {
      constructor() {
        super(...arguments), this.id = "persian", this.calendarType = "solar";
      }
      inLeapYear(e7, t6) {
        return 30 === this.daysInMonth({ year: e7.year, month: 12, day: 1 }, t6);
      }
      monthsInYear() {
        return 12;
      }
      minimumMonthLength(e7) {
        const { month: t6 } = e7;
        return 12 === t6 ? 29 : t6 <= 6 ? 31 : 30;
      }
      maximumMonthLength(e7) {
        const { month: t6 } = e7;
        return 12 === t6 ? 30 : t6 <= 6 ? 31 : 30;
      }
      maxLengthOfMonthCodeInAnyYear(e7) {
        return Qo(e7) <= 6 ? 31 : 30;
      }
      estimateIsoDate(e7) {
        const { year: t6 } = this.adjustCalendarDate(e7);
        return { year: t6 + 621, month: 1, day: 1 };
      }
    };
    IndianHelper = class extends HelperBase {
      constructor() {
        super(...arguments), this.id = "indian", this.calendarType = "solar", this.months = { 1: { length: 30, month: 3, day: 22, leap: { length: 31, month: 3, day: 21 } }, 2: { length: 31, month: 4, day: 21 }, 3: { length: 31, month: 5, day: 22 }, 4: { length: 31, month: 6, day: 22 }, 5: { length: 31, month: 7, day: 23 }, 6: { length: 31, month: 8, day: 23 }, 7: { length: 30, month: 9, day: 23 }, 8: { length: 30, month: 10, day: 23 }, 9: { length: 30, month: 11, day: 22 }, 10: { length: 30, month: 12, day: 22 }, 11: { length: 30, month: 1, nextYear: true, day: 21 }, 12: { length: 30, month: 2, nextYear: true, day: 20 } }, this.vulnerableToBceBug = "10/11/-79 Saka" !== (/* @__PURE__ */ new Date("0000-01-01T00:00Z")).toLocaleDateString("en-US-u-ca-indian", { timeZone: "UTC" });
      }
      inLeapYear(e7) {
        return oi(e7.year + 78);
      }
      monthsInYear() {
        return 12;
      }
      minimumMonthLength(e7) {
        return this.getMonthInfo(e7).length;
      }
      maximumMonthLength(e7) {
        return this.getMonthInfo(e7).length;
      }
      maxLengthOfMonthCodeInAnyYear(e7) {
        const t6 = Qo(e7);
        let n10 = this.months[t6];
        return n10 = n10.leap ?? n10, n10.length;
      }
      getMonthInfo(e7) {
        const { month: t6 } = e7;
        let n10 = this.months[t6];
        if (void 0 === n10) throw new RangeError(`Invalid month: ${t6}`);
        return this.inLeapYear(e7) && n10.leap && (n10 = n10.leap), n10;
      }
      estimateIsoDate(e7) {
        const t6 = this.adjustCalendarDate(e7), n10 = this.getMonthInfo(t6);
        return Or(t6.year + 78 + (n10.nextYear ? 1 : 0), n10.month, n10.day + t6.day - 1);
      }
      checkIcuBugs(e7) {
        if (this.vulnerableToBceBug && e7.year < 1) throw new RangeError(`calendar '${this.id}' is broken for ISO dates before 0001-01-01 (see https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
      }
    };
    GregorianBaseHelperFixedEpoch = class extends HelperBase {
      constructor(e7, t6) {
        super(), this.calendarType = "solar", this.id = e7, this.isoEpoch = t6;
      }
      inLeapYear(e7) {
        const { year: t6 } = this.estimateIsoDate({ month: 1, day: 1, year: e7.year });
        return oi(t6);
      }
      monthsInYear() {
        return 12;
      }
      minimumMonthLength(e7) {
        const { month: t6 } = e7;
        return 2 === t6 ? this.inLeapYear(e7) ? 29 : 28 : [4, 6, 9, 11].indexOf(t6) >= 0 ? 30 : 31;
      }
      maximumMonthLength(e7) {
        return this.minimumMonthLength(e7);
      }
      maxLengthOfMonthCodeInAnyYear(e7) {
        return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][Qo(e7) - 1];
      }
      estimateIsoDate(e7) {
        const t6 = this.adjustCalendarDate(e7);
        return St(t6.year + this.isoEpoch.year, t6.month + this.isoEpoch.month, t6.day + this.isoEpoch.day, "constrain");
      }
    };
    GregorianBaseHelper = class extends HelperBase {
      constructor(e7, t6) {
        super(), this.hasEra = true, this.calendarType = "solar", this.id = e7;
        const { eras: n10, anchorEra: r7 } = function(e8) {
          let t7, n11 = e8;
          if (0 === n11.length) throw new RangeError("Invalid era data: eras are required");
          if (1 === n11.length && n11[0].reverseOf) throw new RangeError("Invalid era data: anchor era cannot count years backwards");
          if (1 === n11.length && !n11[0].code) throw new RangeError("Invalid era data: at least one named era is required");
          if (n11.filter((e9) => null != e9.reverseOf).length > 1) throw new RangeError("Invalid era data: only one era can count years backwards");
          n11.forEach((e9) => {
            if (e9.isAnchor || !e9.anchorEpoch && !e9.reverseOf) {
              if (t7) throw new RangeError("Invalid era data: cannot have multiple anchor eras");
              t7 = e9, e9.anchorEpoch = { year: e9.hasYearZero ? 0 : 1 };
            } else if (!e9.code) throw new RangeError("If era name is blank, it must be the anchor era");
          }), n11 = n11.filter((e9) => e9.code), n11.forEach((e9) => {
            const { reverseOf: t8 } = e9;
            if (t8) {
              const r9 = n11.find((e10) => e10.code === t8);
              if (void 0 === r9) throw new RangeError(`Invalid era data: unmatched reverseOf era: ${t8}`);
              e9.reverseOf = r9, e9.anchorEpoch = r9.anchorEpoch, e9.isoEpoch = r9.isoEpoch;
            }
            void 0 === e9.anchorEpoch.month && (e9.anchorEpoch.month = 1), void 0 === e9.anchorEpoch.day && (e9.anchorEpoch.day = 1);
          }), n11.sort((e9, t8) => {
            if (e9.reverseOf) return 1;
            if (t8.reverseOf) return -1;
            if (!e9.isoEpoch || !t8.isoEpoch) throw new RangeError("Invalid era data: missing ISO epoch");
            return t8.isoEpoch.year - e9.isoEpoch.year;
          });
          const r8 = n11[n11.length - 1].reverseOf;
          if (r8 && r8 !== n11[n11.length - 2]) throw new RangeError("Invalid era data: invalid reverse-sign era");
          return n11.forEach((e9, t8) => {
            e9.genericName = "era" + (n11.length - 1 - t8);
          }), { eras: n11, anchorEra: t7 || n11[0] };
        }(t6);
        this.anchorEra = r7, this.eras = n10;
      }
      inLeapYear(e7) {
        const { year: t6 } = this.estimateIsoDate({ month: 1, day: 1, year: e7.year });
        return oi(t6);
      }
      monthsInYear() {
        return 12;
      }
      minimumMonthLength(e7) {
        const { month: t6 } = e7;
        return 2 === t6 ? this.inLeapYear(e7) ? 29 : 28 : [4, 6, 9, 11].indexOf(t6) >= 0 ? 30 : 31;
      }
      maximumMonthLength(e7) {
        return this.minimumMonthLength(e7);
      }
      maxLengthOfMonthCodeInAnyYear(e7) {
        return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][Qo(e7) - 1];
      }
      completeEraYear(e7) {
        const t6 = (t7, n11, r8) => {
          const o9 = e7[t7];
          if (null != o9 && o9 != n11 && !(r8 || []).includes(o9)) {
            const e8 = r8?.[0];
            throw new RangeError(`Input ${t7} ${o9} doesn't match calculated value ${e8 ? `${n11} (also called ${e8})` : n11}`);
          }
        }, n10 = (t7) => {
          let n11;
          const r8 = { ...e7, year: t7 }, o9 = this.eras.find((e8, o10) => {
            if (o10 === this.eras.length - 1) {
              if (e8.reverseOf) {
                if (t7 > 0) throw new RangeError(`Signed year ${t7} is invalid for era ${e8.code}`);
                return n11 = e8.anchorEpoch.year - t7, true;
              }
              return n11 = t7 - e8.anchorEpoch.year + (e8.hasYearZero ? 0 : 1), true;
            }
            return this.compareCalendarDates(r8, e8.anchorEpoch) >= 0 && (n11 = t7 - e8.anchorEpoch.year + (e8.hasYearZero ? 0 : 1), true);
          });
          if (!o9) throw new RangeError(`Year ${t7} was not matched by any era`);
          return { eraYear: n11, era: o9.code, eraNames: o9.names };
        };
        let { year: r7, eraYear: o8, era: i8 } = e7;
        if (null != r7) {
          const e8 = n10(r7);
          ({ eraYear: o8, era: i8 } = e8), t6("era", i8, e8?.eraNames), t6("eraYear", o8);
        } else {
          if (null == o8) throw new RangeError("Either year or eraYear and era are required");
          {
            if (void 0 === i8) throw new RangeError("era and eraYear must be provided together");
            const e8 = this.eras.find(({ code: e9, names: t7 = [] }) => e9 === i8 || t7.includes(i8));
            if (!e8) throw new RangeError(`Era ${i8} (ISO year ${o8}) was not matched by any era`);
            r7 = e8.reverseOf ? e8.anchorEpoch.year - o8 : o8 + e8.anchorEpoch.year - (e8.hasYearZero ? 0 : 1), t6("year", r7), { eraYear: o8, era: i8 } = n10(r7);
          }
        }
        return { ...e7, year: r7, eraYear: o8, era: i8 };
      }
      adjustCalendarDate(e7, t6, n10 = "constrain") {
        let r7 = e7;
        const { month: o8, monthCode: i8 } = r7;
        return void 0 === o8 && (r7 = { ...r7, month: Qo(i8) }), this.validateCalendarDate(r7), r7 = this.completeEraYear(r7), super.adjustCalendarDate(r7, t6, n10);
      }
      estimateIsoDate(e7) {
        const t6 = this.adjustCalendarDate(e7), { year: n10, month: r7, day: o8 } = t6, { anchorEra: i8 } = this;
        return St(n10 + i8.isoEpoch.year - (i8.hasYearZero ? 0 : 1), r7, o8, "constrain");
      }
    };
    SameMonthDayAsGregorianBaseHelper = class extends GregorianBaseHelper {
      constructor(e7, t6) {
        super(e7, t6);
      }
      isoToCalendarDate(e7) {
        const { year: t6, month: n10, day: r7 } = e7, o8 = ei(n10), i8 = t6 - this.anchorEra.isoEpoch.year + 1;
        return this.completeEraYear({ year: i8, month: n10, monthCode: o8, day: r7 });
      }
    };
    ii = { inLeapYear(e7) {
      const { year: t6 } = e7;
      return (t6 + 1) % 4 == 0;
    }, monthsInYear: () => 13, minimumMonthLength(e7) {
      const { month: t6 } = e7;
      return 13 === t6 ? this.inLeapYear(e7) ? 6 : 5 : 30;
    }, maximumMonthLength(e7) {
      return this.minimumMonthLength(e7);
    }, maxLengthOfMonthCodeInAnyYear: (e7) => "M13" === e7 ? 6 : 30 };
    OrthodoxBaseHelperFixedEpoch = class extends GregorianBaseHelperFixedEpoch {
      constructor(e7, t6) {
        super(e7, t6), this.inLeapYear = ii.inLeapYear, this.monthsInYear = ii.monthsInYear, this.minimumMonthLength = ii.minimumMonthLength, this.maximumMonthLength = ii.maximumMonthLength, this.maxLengthOfMonthCodeInAnyYear = ii.maxLengthOfMonthCodeInAnyYear;
      }
    };
    OrthodoxBaseHelper = class extends GregorianBaseHelper {
      constructor(e7, t6) {
        super(e7, t6), this.inLeapYear = ii.inLeapYear, this.monthsInYear = ii.monthsInYear, this.minimumMonthLength = ii.minimumMonthLength, this.maximumMonthLength = ii.maximumMonthLength, this.maxLengthOfMonthCodeInAnyYear = ii.maxLengthOfMonthCodeInAnyYear;
      }
    };
    EthioaaHelper = class extends OrthodoxBaseHelperFixedEpoch {
      constructor() {
        super("ethioaa", { year: -5492, month: 7, day: 17 });
      }
    };
    CopticHelper = class extends OrthodoxBaseHelper {
      constructor() {
        super("coptic", [{ code: "coptic", isoEpoch: { year: 284, month: 8, day: 29 } }, { code: "coptic-inverse", reverseOf: "coptic" }]);
      }
    };
    EthiopicHelper = class extends OrthodoxBaseHelper {
      constructor() {
        super("ethiopic", [{ code: "ethioaa", names: ["ethiopic-amete-alem", "mundi"], isoEpoch: { year: -5492, month: 7, day: 17 } }, { code: "ethiopic", names: ["incar"], isoEpoch: { year: 8, month: 8, day: 27 }, anchorEpoch: { year: 5501 } }]);
      }
    };
    RocHelper = class extends SameMonthDayAsGregorianBaseHelper {
      constructor() {
        super("roc", [{ code: "roc", names: ["minguo"], isoEpoch: { year: 1912, month: 1, day: 1 } }, { code: "roc-inverse", names: ["before-roc"], reverseOf: "roc" }]);
      }
    };
    BuddhistHelper = class extends GregorianBaseHelperFixedEpoch {
      constructor() {
        super("buddhist", { year: -543, month: 1, day: 1 });
      }
    };
    GregoryHelper = class extends SameMonthDayAsGregorianBaseHelper {
      constructor() {
        super("gregory", [{ code: "gregory", names: ["ad", "ce"], isoEpoch: { year: 1, month: 1, day: 1 } }, { code: "gregory-inverse", names: ["be", "bce"], reverseOf: "gregory" }]);
      }
      reviseIntlEra(e7) {
        let { era: t6, eraYear: n10 } = e7;
        return "b" === t6 && (t6 = "gregory-inverse"), "a" === t6 && (t6 = "gregory"), { era: t6, eraYear: n10 };
      }
      getFirstDayOfWeek() {
        return 1;
      }
      getMinimalDaysInFirstWeek() {
        return 1;
      }
    };
    JapaneseHelper = class extends SameMonthDayAsGregorianBaseHelper {
      constructor() {
        super("japanese", [{ code: "reiwa", isoEpoch: { year: 2019, month: 5, day: 1 }, anchorEpoch: { year: 2019, month: 5, day: 1 } }, { code: "heisei", isoEpoch: { year: 1989, month: 1, day: 8 }, anchorEpoch: { year: 1989, month: 1, day: 8 } }, { code: "showa", isoEpoch: { year: 1926, month: 12, day: 25 }, anchorEpoch: { year: 1926, month: 12, day: 25 } }, { code: "taisho", isoEpoch: { year: 1912, month: 7, day: 30 }, anchorEpoch: { year: 1912, month: 7, day: 30 } }, { code: "meiji", isoEpoch: { year: 1868, month: 9, day: 8 }, anchorEpoch: { year: 1868, month: 9, day: 8 } }, { code: "japanese", names: ["japanese", "gregory", "ad", "ce"], isoEpoch: { year: 1, month: 1, day: 1 } }, { code: "japanese-inverse", names: ["japanese-inverse", "gregory-inverse", "bc", "bce"], reverseOf: "japanese" }]), this.erasBeginMidYear = true;
      }
      reviseIntlEra(e7, t6) {
        const { era: n10, eraYear: r7 } = e7, { year: o8 } = t6;
        return this.eras.find((e8) => e8.code === n10) ? { era: n10, eraYear: r7 } : o8 < 1 ? { era: "japanese-inverse", eraYear: 1 - o8 } : { era: "japanese", eraYear: o8 };
      }
    };
    ChineseBaseHelper = class extends HelperBase {
      constructor() {
        super(...arguments), this.calendarType = "lunisolar";
      }
      inLeapYear(e7, t6) {
        const n10 = this.getMonthList(e7.year, t6);
        return 13 === Object.entries(n10).length;
      }
      monthsInYear(e7, t6) {
        return this.inLeapYear(e7, t6) ? 13 : 12;
      }
      minimumMonthLength() {
        return 29;
      }
      maximumMonthLength() {
        return 30;
      }
      maxLengthOfMonthCodeInAnyYear(e7) {
        return ["M01L", "M09L", "M10L", "M11L", "M12L"].includes(e7) ? 29 : 30;
      }
      monthDaySearchStartYear(e7, t6) {
        const n10 = { M01L: [1651, 1651], M02L: [1947, 1765], M03L: [1966, 1955], M04L: [1963, 1944], M05L: [1971, 1952], M06L: [1960, 1941], M07L: [1968, 1938], M08L: [1957, 1718], M09L: [1832, 1832], M10L: [1870, 1870], M11L: [1814, 1814], M12L: [1890, 1890] }[e7] ?? [1972, 1972];
        return t6 < 30 ? n10[0] : n10[1];
      }
      getMonthList(e7, t6) {
        if (void 0 === e7) throw new TypeError("Missing year");
        const n10 = JSON.stringify({ func: "getMonthList", calendarYear: e7, id: this.id }), r7 = t6.get(n10);
        if (r7) return r7;
        const o8 = this.getFormatter(), i8 = (e8, t7) => {
          const n11 = ni({ isoYear: e8, isoMonth: 2, isoDay: 1 }), r8 = new Date(n11);
          r8.setUTCDate(t7 + 1);
          const i9 = o8.formatToParts(r8), a5 = i9.find((e9) => "month" === e9.type).value, s8 = +i9.find((e9) => "day" === e9.type).value, c8 = i9.find((e9) => "relatedYear" === e9.type);
          let d5;
          if (void 0 === c8) throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
          return d5 = +c8.value, { calendarMonthString: a5, calendarDay: s8, calendarYearToVerify: d5 };
        };
        let a4 = 17, { calendarMonthString: s7, calendarDay: c7, calendarYearToVerify: d4 } = i8(e7, a4);
        "1" !== s7 && (a4 += 29, { calendarMonthString: s7, calendarDay: c7 } = i8(e7, a4)), a4 -= c7 - 5;
        const h7 = {};
        let u4, l4, m4 = 1, f5 = false;
        do {
          ({ calendarMonthString: s7, calendarDay: c7, calendarYearToVerify: d4 } = i8(e7, a4)), u4 && (h7[l4].daysInMonth = u4 + 30 - c7), d4 !== e7 ? f5 = true : (h7[s7] = { monthIndex: m4++ }, a4 += 30), u4 = c7, l4 = s7;
        } while (!f5);
        return h7[l4].daysInMonth = u4 + 30 - c7, t6.set(n10, h7), h7;
      }
      estimateIsoDate(e7) {
        const { year: t6, month: n10 } = e7;
        return { year: t6, month: n10 >= 12 ? 12 : n10 + 1, day: 1 };
      }
      adjustCalendarDate(e7, t6, n10 = "constrain", r7 = false) {
        let { year: o8, month: i8, monthExtra: a4, day: s7, monthCode: c7 } = e7;
        if (void 0 === o8) throw new TypeError("Missing property: year");
        if (r7) {
          if (a4 && "bis" !== a4) throw new RangeError(`Unexpected leap month suffix: ${a4}`);
          const e8 = ei(i8, void 0 !== a4), n11 = `${i8}${a4 || ""}`, r8 = this.getMonthList(o8, t6)[n11];
          if (void 0 === r8) throw new RangeError(`Unmatched month ${n11} in Chinese year ${o8}`);
          return i8 = r8.monthIndex, { year: o8, month: i8, day: s7, monthCode: e8 };
        }
        if (this.validateCalendarDate(e7), void 0 === i8) {
          const e8 = this.getMonthList(o8, t6);
          let r8 = c7.replace(/^M|L$/g, (e9) => "L" === e9 ? "bis" : "");
          "0" === r8[0] && (r8 = r8.slice(1));
          let a5 = e8[r8];
          if (i8 = a5 && a5.monthIndex, void 0 === i8 && c7.endsWith("L") && "M13L" != c7 && "constrain" === n10) {
            const t7 = +c7.replace(/^M0?|L$/g, "");
            a5 = e8[t7], a5 && (i8 = a5.monthIndex, c7 = ei(t7));
          }
          if (void 0 === i8) throw new RangeError(`Unmatched month ${c7} in Chinese year ${o8}`);
        } else if (void 0 === c7) {
          const e8 = this.getMonthList(o8, t6), r8 = Object.entries(e8), a5 = r8.length;
          "reject" === n10 ? (Nr(i8, 1, a5), Nr(s7, 1, this.maximumMonthLength())) : (i8 = jr(i8, 1, a5), s7 = jr(s7, 1, this.maximumMonthLength()));
          const d4 = r8.find((e9) => e9[1].monthIndex === i8);
          if (void 0 === d4) throw new RangeError(`Invalid month ${i8} in Chinese year ${o8}`);
          c7 = ei(+d4[0].replace("bis", ""), -1 !== d4[0].indexOf("bis"));
        } else {
          const e8 = this.getMonthList(o8, t6);
          let n11 = c7.replace(/^M|L$/g, (e9) => "L" === e9 ? "bis" : "");
          "0" === n11[0] && (n11 = n11.slice(1));
          const r8 = e8[n11];
          if (!r8) throw new RangeError(`Unmatched monthCode ${c7} in Chinese year ${o8}`);
          if (i8 !== r8.monthIndex) throw new RangeError(`monthCode ${c7} doesn't correspond to month ${i8} in Chinese year ${o8}`);
        }
        return { ...e7, year: o8, month: i8, monthCode: c7, day: s7 };
      }
    };
    ChineseHelper = class extends ChineseBaseHelper {
      constructor() {
        super(...arguments), this.id = "chinese";
      }
    };
    DangiHelper = class extends ChineseBaseHelper {
      constructor() {
        super(...arguments), this.id = "dangi";
      }
    };
    NonIsoCalendar = class {
      constructor(e7) {
        this.helper = e7;
      }
      extraFields(e7) {
        return this.helper.hasEra && e7.includes("year") ? ["era", "eraYear"] : [];
      }
      resolveFields(e7) {
        if ("lunisolar" !== this.helper.calendarType) {
          const t6 = new OneObjectCache();
          ti(e7, void 0, this.helper.monthsInYear({ year: e7.year ?? 1972 }, t6));
        }
      }
      dateToISO(e7, t6) {
        const n10 = new OneObjectCache(), r7 = this.helper.calendarToIsoDate(e7, t6, n10);
        return n10.setObject(r7), r7;
      }
      monthDayToISOReferenceDate(e7, t6) {
        const n10 = new OneObjectCache(), r7 = this.helper.monthDayFromFields(e7, t6, n10);
        return n10.setObject(r7), r7;
      }
      fieldKeysToIgnore(e7) {
        const t6 = /* @__PURE__ */ new Set();
        for (let n10 = 0; n10 < e7.length; n10++) {
          const r7 = e7[n10];
          switch (t6.add(r7), r7) {
            case "era":
              t6.add("eraYear"), t6.add("year");
              break;
            case "eraYear":
              t6.add("era"), t6.add("year");
              break;
            case "year":
              t6.add("era"), t6.add("eraYear");
              break;
            case "month":
              t6.add("monthCode"), this.helper.erasBeginMidYear && (t6.add("era"), t6.add("eraYear"));
              break;
            case "monthCode":
              t6.add("month"), this.helper.erasBeginMidYear && (t6.add("era"), t6.add("eraYear"));
              break;
            case "day":
              this.helper.erasBeginMidYear && (t6.add("era"), t6.add("eraYear"));
          }
        }
        return Go(t6);
      }
      dateAdd(e7, { years: t6, months: n10, weeks: r7, days: o8 }, i8) {
        const a4 = OneObjectCache.getCacheForObject(e7), s7 = this.helper.isoToCalendarDate(e7, a4), c7 = this.helper.addCalendar(s7, { years: t6, months: n10, weeks: r7, days: o8 }, i8, a4), d4 = this.helper.calendarToIsoDate(c7, "constrain", a4);
        return OneObjectCache.getCacheForObject(d4) || new OneObjectCache(a4).setObject(d4), d4;
      }
      dateUntil(e7, t6, n10) {
        const r7 = OneObjectCache.getCacheForObject(e7), o8 = OneObjectCache.getCacheForObject(t6), i8 = this.helper.isoToCalendarDate(e7, r7), a4 = this.helper.isoToCalendarDate(t6, o8);
        return this.helper.untilCalendar(i8, a4, n10, r7);
      }
      isoToDate(e7, t6) {
        const n10 = OneObjectCache.getCacheForObject(e7), r7 = this.helper.isoToCalendarDate(e7, n10);
        if (t6.dayOfWeek && (r7.dayOfWeek = Xo.iso8601.isoToDate(e7, { dayOfWeek: true }).dayOfWeek), t6.dayOfYear) {
          const e8 = this.helper.startOfCalendarYear(r7), t7 = this.helper.calendarDaysUntil(e8, r7, n10);
          r7.dayOfYear = t7 + 1;
        }
        if (t6.weekOfYear && (r7.weekOfYear = Ko(this.helper.id, e7)), r7.daysInWeek = 7, t6.daysInMonth && (r7.daysInMonth = this.helper.daysInMonth(r7, n10)), t6.daysInYear) {
          const e8 = this.helper.startOfCalendarYear(r7), t7 = this.helper.addCalendar(e8, { years: 1 }, "constrain", n10);
          r7.daysInYear = this.helper.calendarDaysUntil(e8, t7, n10);
        }
        return t6.monthsInYear && (r7.monthsInYear = this.helper.monthsInYear(r7, n10)), t6.inLeapYear && (r7.inLeapYear = this.helper.inLeapYear(r7, n10)), r7;
      }
      getFirstDayOfWeek() {
        return this.helper.getFirstDayOfWeek();
      }
      getMinimalDaysInFirstWeek() {
        return this.helper.getMinimalDaysInFirstWeek();
      }
    };
    for (const e7 of [HebrewHelper, PersianHelper, EthiopicHelper, EthioaaHelper, CopticHelper, ChineseHelper, DangiHelper, RocHelper, IndianHelper, BuddhistHelper, GregoryHelper, JapaneseHelper, IslamicHelper, IslamicUmalquraHelper, IslamicTblaHelper, IslamicCivilHelper, IslamicRgsaHelper, IslamicCcHelper]) {
      const t6 = new e7();
      Xo[t6.id] = new NonIsoCalendar(t6);
    }
    se("calendarImpl", function(e7) {
      return Xo[e7];
    });
    ai = Intl.DateTimeFormat;
    DateTimeFormatImpl = class {
      constructor(e7 = void 0, t6 = void 0) {
        !function(e8, t7, n10) {
          const r7 = void 0 !== n10;
          let o8;
          if (r7) {
            const e9 = ["localeMatcher", "calendar", "numberingSystem", "hour12", "hourCycle", "timeZone", "weekday", "era", "year", "month", "day", "dayPeriod", "hour", "minute", "second", "fractionalSecondDigits", "timeZoneName", "formatMatcher", "dateStyle", "timeStyle"];
            o8 = function(e10) {
              if (null == e10) throw new TypeError(`Expected object not ${e10}`);
              return Object(e10);
            }(n10);
            const t8 = /* @__PURE__ */ Object.create(null);
            for (let n11 = 0; n11 < e9.length; n11++) {
              const r8 = e9[n11];
              Object.prototype.hasOwnProperty.call(o8, r8) && (t8[r8] = o8[r8]);
            }
            o8 = t8;
          } else o8 = /* @__PURE__ */ Object.create(null);
          const i8 = new ai(t7, o8), a4 = i8.resolvedOptions();
          if (te(e8), r7) {
            const t8 = Object.assign(/* @__PURE__ */ Object.create(null), a4);
            for (const e9 in t8) Object.prototype.hasOwnProperty.call(o8, e9) || delete t8[e9];
            t8.hour12 = o8.hour12, t8.hourCycle = o8.hourCycle, oe(e8, K, t8);
          } else oe(e8, K, o8);
          oe(e8, G, a4.locale), oe(e8, q, i8), oe(e8, W, a4.timeZone), oe(e8, J, a4.calendar), oe(e8, B2, vi), oe(e8, Z2, gi), oe(e8, F, wi), oe(e8, H2, pi), oe(e8, z2, bi), oe(e8, A2, Di);
          const s7 = r7 ? o8.timeZone : void 0;
          if (void 0 === s7) oe(e8, _2, a4.timeZone);
          else {
            const t8 = We(s7);
            if (t8.startsWith("\u2212")) throw new RangeError("Unicode minus (U+2212) is not supported in time zone offsets");
            oe(e8, _2, Bn(t8));
          }
        }(this, e7, t6);
      }
      get format() {
        vt(this, ci);
        const e7 = ui.bind(this);
        return Object.defineProperties(e7, { length: { value: 1, enumerable: false, writable: false, configurable: true }, name: { value: "", enumerable: false, writable: false, configurable: true } }), e7;
      }
      formatRange(e7, t6) {
        return vt(this, ci), mi.call(this, e7, t6);
      }
      formatToParts(e7, ...t6) {
        return vt(this, ci), li.call(this, e7, ...t6);
      }
      formatRangeToParts(e7, t6) {
        return vt(this, ci), fi.call(this, e7, t6);
      }
      resolvedOptions() {
        return vt(this, ci), hi.call(this);
      }
    };
    "formatToParts" in ai.prototype || delete DateTimeFormatImpl.prototype.formatToParts, "formatRangeToParts" in ai.prototype || delete DateTimeFormatImpl.prototype.formatRangeToParts;
    di = function(e7 = void 0, t6 = void 0) {
      return new DateTimeFormatImpl(e7, t6);
    };
    DateTimeFormatImpl.prototype.constructor = di, Object.defineProperty(di, "prototype", { value: DateTimeFormatImpl.prototype, writable: false, enumerable: false, configurable: false }), di.supportedLocalesOf = ai.supportedLocalesOf, ae(di, "Intl.DateTimeFormat");
    ({ format: Ri, formatToParts: Si } = Intl.DurationFormat?.prototype ?? /* @__PURE__ */ Object.create(null));
    Intl.DurationFormat?.prototype && (Intl.DurationFormat.prototype.format = ji, Intl.DurationFormat.prototype.formatToParts = function(e7) {
      Intl.DurationFormat.prototype.resolvedOptions.call(this);
      const t6 = Yi(sn(e7));
      return Si.call(this, t6);
    });
    ki = Object.freeze({ __proto__: null, DateTimeFormat: di, ModifiedIntlDurationFormatPrototypeFormat: ji });
    Instant = class {
      constructor(e7) {
        if (arguments.length < 1) throw new TypeError("missing argument: epochNanoseconds is required");
        In(this, Lo(e7));
      }
      get epochMilliseconds() {
        return vt(this, ut), No(re(this, b3), "floor");
      }
      get epochNanoseconds() {
        return vt(this, ut), ko(import_jsbi.default.BigInt(re(this, b3)));
      }
      add(e7) {
        return vt(this, ut), wo("add", this, e7);
      }
      subtract(e7) {
        return vt(this, ut), wo("subtract", this, e7);
      }
      until(e7, t6 = void 0) {
        return vt(this, ut), so("until", this, e7, t6);
      }
      since(e7, t6 = void 0) {
        return vt(this, ut), so("since", this, e7, t6);
      }
      round(e7) {
        if (vt(this, ut), void 0 === e7) throw new TypeError("options parameter is required");
        const t6 = "string" == typeof e7 ? Fo("smallestUnit", e7) : Zo(e7), n10 = Ft(t6), r7 = Ut(t6, "halfExpand"), o8 = Wt(t6, "smallestUnit", "time", qt);
        return Ht(n10, { hour: 24, minute: 1440, second: 86400, millisecond: 864e5, microsecond: 864e8, nanosecond: 864e11 }[o8], true), Cn(Io(re(this, b3), n10, o8, r7));
      }
      equals(t6) {
        vt(this, ut);
        const n10 = cn(t6), r7 = re(this, b3), o8 = re(n10, b3);
        return import_jsbi.default.equal(import_jsbi.default.BigInt(r7), import_jsbi.default.BigInt(o8));
      }
      toString(e7 = void 0) {
        vt(this, ut);
        const t6 = Zo(e7), n10 = zt(t6), r7 = Ut(t6, "trunc"), o8 = Wt(t6, "smallestUnit", "time", void 0);
        if ("hour" === o8) throw new RangeError('smallestUnit must be a time unit other than "hour"');
        let i8 = t6.timeZone;
        void 0 !== i8 && (i8 = Bn(i8));
        const { precision: a4, unit: s7, increment: c7 } = At(o8, n10);
        return Xn(Cn(Io(re(this, b3), c7, s7, r7)), i8, a4);
      }
      toJSON() {
        return vt(this, ut), Xn(this, void 0, "auto");
      }
      toLocaleString(e7 = void 0, t6 = void 0) {
        return vt(this, ut), new di(e7, t6).format(this);
      }
      valueOf() {
        qo("Instant");
      }
      toZonedDateTimeISO(e7) {
        vt(this, ut);
        const t6 = Bn(e7);
        return $n(re(this, b3), t6, "iso8601");
      }
      static fromEpochMilliseconds(e7) {
        return Cn(xo(qe(e7)));
      }
      static fromEpochNanoseconds(e7) {
        return Cn(Lo(e7));
      }
      static from(e7) {
        return cn(e7);
      }
      static compare(t6, n10) {
        const r7 = cn(t6), o8 = cn(n10), i8 = re(r7, b3), a4 = re(o8, b3);
        return import_jsbi.default.lessThan(i8, a4) ? -1 : import_jsbi.default.greaterThan(i8, a4) ? 1 : 0;
      }
    };
    ae(Instant, "Temporal.Instant");
    PlainDate = class {
      constructor(e7, t6, n10, r7 = "iso8601") {
        const o8 = _e(e7), i8 = _e(t6), a4 = _e(n10), s7 = zo(void 0 === r7 ? "iso8601" : Ve(r7));
        xr(o8, i8, a4), yn(this, { year: o8, month: i8, day: a4 }, s7);
      }
      get calendarId() {
        return vt(this, mt), re(this, E2);
      }
      get era() {
        return Ni(this, "era");
      }
      get eraYear() {
        return Ni(this, "eraYear");
      }
      get year() {
        return Ni(this, "year");
      }
      get month() {
        return Ni(this, "month");
      }
      get monthCode() {
        return Ni(this, "monthCode");
      }
      get day() {
        return Ni(this, "day");
      }
      get dayOfWeek() {
        return Ni(this, "dayOfWeek");
      }
      get dayOfYear() {
        return Ni(this, "dayOfYear");
      }
      get weekOfYear() {
        return Ni(this, "weekOfYear")?.week;
      }
      get yearOfWeek() {
        return Ni(this, "weekOfYear")?.year;
      }
      get daysInWeek() {
        return Ni(this, "daysInWeek");
      }
      get daysInMonth() {
        return Ni(this, "daysInMonth");
      }
      get daysInYear() {
        return Ni(this, "daysInYear");
      }
      get monthsInYear() {
        return Ni(this, "monthsInYear");
      }
      get inLeapYear() {
        return Ni(this, "inLeapYear");
      }
      with(e7, t6 = void 0) {
        if (vt(this, mt), !Ae(e7)) throw new TypeError("invalid argument");
        bt(e7);
        const n10 = re(this, E2);
        let r7 = en(n10, re(this, D2));
        return r7 = Rn(n10, r7, tn(n10, e7, ["year", "month", "monthCode", "day"], [], "partial")), pn(Ln(n10, r7, Lt(Zo(t6))), n10);
      }
      withCalendar(e7) {
        vt(this, mt);
        const t6 = kn(e7);
        return pn(re(this, D2), t6);
      }
      add(e7, t6 = void 0) {
        return vt(this, mt), vo("add", this, e7, t6);
      }
      subtract(e7, t6 = void 0) {
        return vt(this, mt), vo("subtract", this, e7, t6);
      }
      until(e7, t6 = void 0) {
        return vt(this, mt), co("until", this, e7, t6);
      }
      since(e7, t6 = void 0) {
        return vt(this, mt), co("since", this, e7, t6);
      }
      equals(e7) {
        vt(this, mt);
        const t6 = rn(e7);
        return 0 === Ro(re(this, D2), re(t6, D2)) && xn(re(this, E2), re(t6, E2));
      }
      toString(e7 = void 0) {
        return vt(this, mt), er(this, Zt(Zo(e7)));
      }
      toJSON() {
        return vt(this, mt), er(this);
      }
      toLocaleString(e7 = void 0, t6 = void 0) {
        return vt(this, mt), new di(e7, t6).format(this);
      }
      valueOf() {
        qo("PlainDate");
      }
      toPlainDateTime(e7 = void 0) {
        vt(this, mt);
        const t6 = un(e7);
        return wn(xt(re(this, D2), t6), re(this, E2));
      }
      toZonedDateTime(e7) {
        let t6, n10;
        if (vt(this, mt), Ae(e7)) {
          const r8 = e7.timeZone;
          void 0 === r8 ? t6 = Bn(e7) : (t6 = Bn(r8), n10 = e7.plainTime);
        } else t6 = Bn(e7);
        const r7 = re(this, D2);
        let o8;
        return void 0 === n10 ? o8 = _n(t6, r7) : (n10 = hn(n10), o8 = An(t6, xt(r7, re(n10, M2)), "compatible")), $n(o8, t6, re(this, E2));
      }
      toPlainYearMonth() {
        vt(this, mt);
        const e7 = re(this, E2);
        return En(Pn(e7, en(e7, re(this, D2)), "constrain"), e7);
      }
      toPlainMonthDay() {
        vt(this, mt);
        const e7 = re(this, E2);
        return bn(Un(e7, en(e7, re(this, D2)), "constrain"), e7);
      }
      static from(e7, t6 = void 0) {
        return rn(e7, t6);
      }
      static compare(e7, t6) {
        const n10 = rn(e7), r7 = rn(t6);
        return Ro(re(n10, D2), re(r7, D2));
      }
    };
    ae(PlainDate, "Temporal.PlainDate");
    PlainDateTime = class {
      constructor(e7, t6, n10, r7 = 0, o8 = 0, i8 = 0, a4 = 0, s7 = 0, c7 = 0, d4 = "iso8601") {
        const h7 = _e(e7), u4 = _e(t6), l4 = _e(n10), m4 = void 0 === r7 ? 0 : _e(r7), f5 = void 0 === o8 ? 0 : _e(o8), y4 = void 0 === i8 ? 0 : _e(i8), p4 = void 0 === a4 ? 0 : _e(a4), g3 = void 0 === s7 ? 0 : _e(s7), w3 = void 0 === c7 ? 0 : _e(c7), v3 = zo(void 0 === d4 ? "iso8601" : Ve(d4));
        Ur(h7, u4, l4, m4, f5, y4, p4, g3, w3), gn(this, { isoDate: { year: h7, month: u4, day: l4 }, time: { hour: m4, minute: f5, second: y4, millisecond: p4, microsecond: g3, nanosecond: w3 } }, v3);
      }
      get calendarId() {
        return vt(this, yt), re(this, E2);
      }
      get year() {
        return xi(this, "year");
      }
      get month() {
        return xi(this, "month");
      }
      get monthCode() {
        return xi(this, "monthCode");
      }
      get day() {
        return xi(this, "day");
      }
      get hour() {
        return Li(this, "hour");
      }
      get minute() {
        return Li(this, "minute");
      }
      get second() {
        return Li(this, "second");
      }
      get millisecond() {
        return Li(this, "millisecond");
      }
      get microsecond() {
        return Li(this, "microsecond");
      }
      get nanosecond() {
        return Li(this, "nanosecond");
      }
      get era() {
        return xi(this, "era");
      }
      get eraYear() {
        return xi(this, "eraYear");
      }
      get dayOfWeek() {
        return xi(this, "dayOfWeek");
      }
      get dayOfYear() {
        return xi(this, "dayOfYear");
      }
      get weekOfYear() {
        return xi(this, "weekOfYear")?.week;
      }
      get yearOfWeek() {
        return xi(this, "weekOfYear")?.year;
      }
      get daysInWeek() {
        return xi(this, "daysInWeek");
      }
      get daysInYear() {
        return xi(this, "daysInYear");
      }
      get daysInMonth() {
        return xi(this, "daysInMonth");
      }
      get monthsInYear() {
        return xi(this, "monthsInYear");
      }
      get inLeapYear() {
        return xi(this, "inLeapYear");
      }
      with(e7, t6 = void 0) {
        if (vt(this, yt), !Ae(e7)) throw new TypeError("invalid argument");
        bt(e7);
        const n10 = re(this, E2), r7 = re(this, T2);
        let o8 = { ...en(n10, r7.isoDate), ...r7.time };
        return o8 = Rn(n10, o8, tn(n10, e7, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond"], "partial")), wn(on(n10, o8, Lt(Zo(t6))), n10);
      }
      withPlainTime(e7 = void 0) {
        vt(this, yt);
        const t6 = un(e7);
        return wn(xt(re(this, T2).isoDate, t6), re(this, E2));
      }
      withCalendar(e7) {
        vt(this, yt);
        const t6 = kn(e7);
        return wn(re(this, T2), t6);
      }
      add(e7, t6 = void 0) {
        return vt(this, yt), bo("add", this, e7, t6);
      }
      subtract(e7, t6 = void 0) {
        return vt(this, yt), bo("subtract", this, e7, t6);
      }
      until(e7, t6 = void 0) {
        return vt(this, yt), ho("until", this, e7, t6);
      }
      since(e7, t6 = void 0) {
        return vt(this, yt), ho("since", this, e7, t6);
      }
      round(e7) {
        if (vt(this, yt), void 0 === e7) throw new TypeError("options parameter is required");
        const t6 = "string" == typeof e7 ? Fo("smallestUnit", e7) : Zo(e7), n10 = Ft(t6), r7 = Ut(t6, "halfExpand"), o8 = Wt(t6, "smallestUnit", "time", qt, ["day"]), i8 = { day: 1, hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[o8];
        Ht(n10, i8, 1 === i8);
        const a4 = re(this, T2);
        return wn(1 === n10 && "nanosecond" === o8 ? a4 : Co(a4, n10, o8, r7), re(this, E2));
      }
      equals(e7) {
        vt(this, yt);
        const t6 = an(e7);
        return 0 === jo(re(this, T2), re(t6, T2)) && xn(re(this, E2), re(t6, E2));
      }
      toString(e7 = void 0) {
        vt(this, yt);
        const t6 = Zo(e7), n10 = Zt(t6), r7 = zt(t6), o8 = Ut(t6, "trunc"), i8 = Wt(t6, "smallestUnit", "time", void 0);
        if ("hour" === i8) throw new RangeError('smallestUnit must be a time unit other than "hour"');
        const { precision: a4, unit: s7, increment: c7 } = At(i8, r7), d4 = Co(re(this, T2), c7, s7, o8);
        return Br(d4), nr(d4, re(this, E2), a4, n10);
      }
      toJSON() {
        return vt(this, yt), nr(re(this, T2), re(this, E2), "auto");
      }
      toLocaleString(e7 = void 0, t6 = void 0) {
        return vt(this, yt), new di(e7, t6).format(this);
      }
      valueOf() {
        qo("PlainDateTime");
      }
      toZonedDateTime(e7, t6 = void 0) {
        vt(this, yt);
        const n10 = Bn(e7), r7 = Pt(Zo(t6));
        return $n(An(n10, re(this, T2), r7), n10, re(this, E2));
      }
      toPlainDate() {
        return vt(this, yt), pn(re(this, T2).isoDate, re(this, E2));
      }
      toPlainTime() {
        return vt(this, yt), Tn(re(this, T2).time);
      }
      static from(e7, t6 = void 0) {
        return an(e7, t6);
      }
      static compare(e7, t6) {
        const n10 = an(e7), r7 = an(t6);
        return jo(re(n10, T2), re(r7, T2));
      }
    };
    ae(PlainDateTime, "Temporal.PlainDateTime");
    Duration = class _Duration {
      constructor(e7 = 0, t6 = 0, n10 = 0, r7 = 0, o8 = 0, i8 = 0, a4 = 0, s7 = 0, c7 = 0, d4 = 0) {
        const h7 = void 0 === e7 ? 0 : Ge(e7), u4 = void 0 === t6 ? 0 : Ge(t6), l4 = void 0 === n10 ? 0 : Ge(n10), m4 = void 0 === r7 ? 0 : Ge(r7), f5 = void 0 === o8 ? 0 : Ge(o8), y4 = void 0 === i8 ? 0 : Ge(i8), p4 = void 0 === a4 ? 0 : Ge(a4), g3 = void 0 === s7 ? 0 : Ge(s7), w3 = void 0 === c7 ? 0 : Ge(c7), v3 = void 0 === d4 ? 0 : Ge(d4);
        zr(h7, u4, l4, m4, f5, y4, p4, g3, w3, v3), te(this), oe(this, Y, h7), oe(this, R2, u4), oe(this, S3, l4), oe(this, j2, m4), oe(this, k2, f5), oe(this, N2, y4), oe(this, x2, p4), oe(this, L2, g3), oe(this, P2, w3), oe(this, U, v3);
      }
      get years() {
        return vt(this, lt), re(this, Y);
      }
      get months() {
        return vt(this, lt), re(this, R2);
      }
      get weeks() {
        return vt(this, lt), re(this, S3);
      }
      get days() {
        return vt(this, lt), re(this, j2);
      }
      get hours() {
        return vt(this, lt), re(this, k2);
      }
      get minutes() {
        return vt(this, lt), re(this, N2);
      }
      get seconds() {
        return vt(this, lt), re(this, x2);
      }
      get milliseconds() {
        return vt(this, lt), re(this, L2);
      }
      get microseconds() {
        return vt(this, lt), re(this, P2);
      }
      get nanoseconds() {
        return vt(this, lt), re(this, U);
      }
      get sign() {
        return vt(this, lt), Mr(this);
      }
      get blank() {
        return vt(this, lt), 0 === Mr(this);
      }
      with(e7) {
        vt(this, lt);
        const t6 = kt(e7), { years: n10 = re(this, Y), months: r7 = re(this, R2), weeks: o8 = re(this, S3), days: i8 = re(this, j2), hours: a4 = re(this, k2), minutes: s7 = re(this, N2), seconds: c7 = re(this, x2), milliseconds: d4 = re(this, L2), microseconds: h7 = re(this, P2), nanoseconds: u4 = re(this, U) } = t6;
        return new _Duration(n10, r7, o8, i8, a4, s7, c7, d4, h7, u4);
      }
      negated() {
        return vt(this, lt), Sr(this);
      }
      abs() {
        return vt(this, lt), new _Duration(Math.abs(re(this, Y)), Math.abs(re(this, R2)), Math.abs(re(this, S3)), Math.abs(re(this, j2)), Math.abs(re(this, k2)), Math.abs(re(this, N2)), Math.abs(re(this, x2)), Math.abs(re(this, L2)), Math.abs(re(this, P2)), Math.abs(re(this, U)));
      }
      add(e7) {
        return vt(this, lt), go("add", this, e7);
      }
      subtract(e7) {
        return vt(this, lt), go("subtract", this, e7);
      }
      round(e7) {
        if (vt(this, lt), void 0 === e7) throw new TypeError("options parameter is required");
        const t6 = Jt(this), n10 = "string" == typeof e7 ? Fo("smallestUnit", e7) : Zo(e7);
        let r7 = Wt(n10, "largestUnit", "datetime", void 0, ["auto"]), { plainRelativeTo: o8, zonedRelativeTo: i8 } = _t(n10);
        const a4 = Ft(n10), s7 = Ut(n10, "halfExpand");
        let c7 = Wt(n10, "smallestUnit", "datetime", void 0), d4 = true;
        c7 || (d4 = false, c7 = "nanosecond");
        const h7 = Gt(t6, c7);
        let u4 = true;
        if (r7 || (u4 = false, r7 = h7), "auto" === r7 && (r7 = h7), !d4 && !u4) throw new RangeError("at least one of smallestUnit or largestUnit is required");
        if (Gt(r7, c7) !== r7) throw new RangeError(`largestUnit ${r7} cannot be smaller than smallestUnit ${c7}`);
        const l4 = { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[c7];
        if (void 0 !== l4 && Ht(a4, l4, false), a4 > 1 && "date" === Vt(c7) && r7 !== c7) throw new RangeError("For calendar units with roundingIncrement > 1, use largestUnit = smallestUnit");
        if (i8) {
          let e8 = Ar(this);
          const t7 = re(i8, $2), n11 = re(i8, E2), o9 = re(i8, b3);
          return e8 = io(o9, po(o9, t7, n11, e8), t7, n11, r7, a4, c7, s7), "date" === Vt(r7) && (r7 = "hour"), _r(e8, r7);
        }
        if (o8) {
          let e8 = qr(this);
          const t7 = fo({ deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }, e8.time), n11 = re(o8, D2), i9 = re(o8, E2), d5 = Sn(i9, n11, Nt(e8.date, t7.deltaDays), "constrain");
          return e8 = oo(xt(n11, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), xt(d5, t7), i9, r7, a4, c7, s7), _r(e8, r7);
        }
        if (Kt(t6)) throw new RangeError(`a starting point is required for ${t6}s balancing`);
        if (Kt(r7)) throw new RangeError(`a starting point is required for ${r7}s balancing`);
        let m4 = qr(this);
        if ("day" === c7) {
          const { quotient: e8, remainder: t7 } = m4.time.divmod(Se);
          let n11 = m4.date.days + e8 + Yo(t7, "day");
          n11 = Eo(n11, a4, s7), m4 = Jr({ years: 0, months: 0, weeks: 0, days: n11 }, TimeDuration.ZERO);
        } else m4 = Jr({ years: 0, months: 0, weeks: 0, days: 0 }, $o(m4.time, a4, c7, s7));
        return _r(m4, r7);
      }
      total(t6) {
        if (vt(this, lt), void 0 === t6) throw new TypeError("options argument is required");
        const n10 = "string" == typeof t6 ? Fo("unit", t6) : Zo(t6);
        let { plainRelativeTo: r7, zonedRelativeTo: o8 } = _t(n10);
        const i8 = Wt(n10, "unit", "datetime", qt);
        if (o8) {
          const e7 = Ar(this), t7 = re(o8, $2), n11 = re(o8, E2), r8 = re(o8, b3);
          return function(e8, t8, n12, r9, o9) {
            return "time" === Vt(o9) ? Yo(TimeDuration.fromEpochNsDiff(t8, e8), o9) : ro(eo(e8, t8, n12, r9, o9), t8, zn(n12, e8), n12, r9, o9);
          }(r8, po(r8, t7, n11, e7), t7, n11, i8);
        }
        if (r7) {
          const t7 = qr(this);
          let n11 = fo({ deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }, t7.time);
          const o9 = re(r7, D2), a5 = re(r7, E2), s7 = Sn(a5, o9, Nt(t7.date, n11.deltaDays), "constrain");
          return function(t8, n12, r8, o10) {
            if (0 == jo(t8, n12)) return 0;
            Br(t8), Br(n12);
            const i9 = Qr(t8, n12, r8, o10);
            return "nanosecond" === o10 ? import_jsbi.default.toNumber(i9.time.totalNs) : ro(i9, pr(n12), t8, null, r8, o10);
          }(xt(o9, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), xt(s7, n11), a5, i8);
        }
        const a4 = Jt(this);
        if (Kt(a4)) throw new RangeError(`a starting point is required for ${a4}s total`);
        if (Kt(i8)) throw new RangeError(`a starting point is required for ${i8}s total`);
        return Yo(qr(this).time, i8);
      }
      toString(e7 = void 0) {
        vt(this, lt);
        const t6 = Zo(e7), n10 = zt(t6), r7 = Ut(t6, "trunc"), o8 = Wt(t6, "smallestUnit", "time", void 0);
        if ("hour" === o8 || "minute" === o8) throw new RangeError('smallestUnit must be a time unit other than "hours" or "minutes"');
        const { precision: i8, unit: a4, increment: s7 } = At(o8, n10);
        if ("nanosecond" === a4 && 1 === s7) return Qn(this, i8);
        const c7 = Jt(this);
        let d4 = Ar(this);
        const h7 = $o(d4.time, s7, a4, r7);
        return d4 = Jr(d4.date, h7), Qn(_r(d4, Gt(c7, "second")), i8);
      }
      toJSON() {
        return vt(this, lt), Qn(this, "auto");
      }
      toLocaleString(e7 = void 0, t6 = void 0) {
        if (vt(this, lt), "function" == typeof Intl.DurationFormat) {
          const n10 = new Intl.DurationFormat(e7, t6);
          return ji.call(n10, this);
        }
        return console.warn("Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat."), Qn(this, "auto");
      }
      valueOf() {
        qo("Duration");
      }
      static from(e7) {
        return sn(e7);
      }
      static compare(t6, n10, r7 = void 0) {
        const o8 = sn(t6), i8 = sn(n10), a4 = Zo(r7), { plainRelativeTo: s7, zonedRelativeTo: c7 } = _t(a4);
        if (re(o8, Y) === re(i8, Y) && re(o8, R2) === re(i8, R2) && re(o8, S3) === re(i8, S3) && re(o8, j2) === re(i8, j2) && re(o8, k2) === re(i8, k2) && re(o8, N2) === re(i8, N2) && re(o8, x2) === re(i8, x2) && re(o8, L2) === re(i8, L2) && re(o8, P2) === re(i8, P2) && re(o8, U) === re(i8, U)) return 0;
        const d4 = Jt(o8), h7 = Jt(i8), u4 = Ar(o8), l4 = Ar(i8);
        if (c7 && ("date" === Vt(d4) || "date" === Vt(h7))) {
          const t7 = re(c7, $2), n11 = re(c7, E2), r8 = re(c7, b3), o9 = po(r8, t7, n11, u4), i9 = po(r8, t7, n11, l4);
          return Bo(import_jsbi.default.toNumber(import_jsbi.default.subtract(o9, i9)));
        }
        let m4 = u4.date.days, f5 = l4.date.days;
        if (Kt(d4) || Kt(h7)) {
          if (!s7) throw new RangeError("A starting point is required for years, months, or weeks comparison");
          m4 = Rr(u4.date, s7), f5 = Rr(l4.date, s7);
        }
        const y4 = u4.time.add24HourDays(m4), p4 = l4.time.add24HourDays(f5);
        return y4.cmp(p4);
      }
    };
    ae(Duration, "Temporal.Duration");
    PlainMonthDay = class {
      constructor(e7, t6, n10 = "iso8601", r7 = 1972) {
        const o8 = _e(e7), i8 = _e(t6), a4 = zo(void 0 === n10 ? "iso8601" : Ve(n10)), s7 = _e(r7);
        xr(s7, o8, i8), vn(this, { year: s7, month: o8, day: i8 }, a4);
      }
      get monthCode() {
        return Pi(this, "monthCode");
      }
      get day() {
        return Pi(this, "day");
      }
      get calendarId() {
        return vt(this, gt), re(this, E2);
      }
      with(e7, t6 = void 0) {
        if (vt(this, gt), !Ae(e7)) throw new TypeError("invalid argument");
        bt(e7);
        const n10 = re(this, E2);
        let r7 = en(n10, re(this, D2), "month-day");
        return r7 = Rn(n10, r7, tn(n10, e7, ["year", "month", "monthCode", "day"], [], "partial")), bn(Un(n10, r7, Lt(Zo(t6))), n10);
      }
      equals(e7) {
        vt(this, gt);
        const t6 = dn(e7);
        return 0 === Ro(re(this, D2), re(t6, D2)) && xn(re(this, E2), re(t6, E2));
      }
      toString(e7 = void 0) {
        return vt(this, gt), rr(this, Zt(Zo(e7)));
      }
      toJSON() {
        return vt(this, gt), rr(this);
      }
      toLocaleString(e7 = void 0, t6 = void 0) {
        return vt(this, gt), new di(e7, t6).format(this);
      }
      valueOf() {
        qo("PlainMonthDay");
      }
      toPlainDate(e7) {
        if (vt(this, gt), !Ae(e7)) throw new TypeError("argument should be an object");
        const t6 = re(this, E2);
        return pn(Ln(t6, Rn(t6, en(t6, re(this, D2), "month-day"), tn(t6, e7, ["year"], [], [])), "constrain"), t6);
      }
      static from(e7, t6 = void 0) {
        return dn(e7, t6);
      }
    };
    ae(PlainMonthDay, "Temporal.PlainMonthDay");
    Bi = { instant: () => Cn(Po()), plainDateTimeISO: (e7 = Uo()) => wn(Ui(Bn(e7)), "iso8601"), plainDateISO: (e7 = Uo()) => pn(Ui(Bn(e7)).isoDate, "iso8601"), plainTimeISO: (e7 = Uo()) => Tn(Ui(Bn(e7)).time), timeZoneId: () => Uo(), zonedDateTimeISO: (e7 = Uo()) => {
      const t6 = Bn(e7);
      return $n(Po(), t6, "iso8601");
    }, [Symbol.toStringTag]: "Temporal.Now" };
    Object.defineProperty(Bi, Symbol.toStringTag, { value: "Temporal.Now", writable: false, enumerable: false, configurable: true });
    PlainTime = class _PlainTime {
      constructor(e7 = 0, t6 = 0, n10 = 0, r7 = 0, o8 = 0, i8 = 0) {
        const a4 = void 0 === e7 ? 0 : _e(e7), s7 = void 0 === t6 ? 0 : _e(t6), c7 = void 0 === n10 ? 0 : _e(n10), d4 = void 0 === r7 ? 0 : _e(r7), h7 = void 0 === o8 ? 0 : _e(o8), u4 = void 0 === i8 ? 0 : _e(i8);
        Pr(a4, s7, c7, d4, h7, u4), Dn(this, { hour: a4, minute: s7, second: c7, millisecond: d4, microsecond: h7, nanosecond: u4 });
      }
      get hour() {
        return vt(this, ft), re(this, M2).hour;
      }
      get minute() {
        return vt(this, ft), re(this, M2).minute;
      }
      get second() {
        return vt(this, ft), re(this, M2).second;
      }
      get millisecond() {
        return vt(this, ft), re(this, M2).millisecond;
      }
      get microsecond() {
        return vt(this, ft), re(this, M2).microsecond;
      }
      get nanosecond() {
        return vt(this, ft), re(this, M2).nanosecond;
      }
      with(e7, t6 = void 0) {
        if (vt(this, ft), !Ae(e7)) throw new TypeError("invalid argument");
        bt(e7);
        const n10 = nn(e7, "partial"), r7 = nn(this);
        let { hour: o8, minute: i8, second: a4, millisecond: s7, microsecond: c7, nanosecond: d4 } = Object.assign(r7, n10);
        const h7 = Lt(Zo(t6));
        return { hour: o8, minute: i8, second: a4, millisecond: s7, microsecond: c7, nanosecond: d4 } = jt(o8, i8, a4, s7, c7, d4, h7), new _PlainTime(o8, i8, a4, s7, c7, d4);
      }
      add(e7) {
        return vt(this, ft), Do("add", this, e7);
      }
      subtract(e7) {
        return vt(this, ft), Do("subtract", this, e7);
      }
      until(e7, t6 = void 0) {
        return vt(this, ft), uo("until", this, e7, t6);
      }
      since(e7, t6 = void 0) {
        return vt(this, ft), uo("since", this, e7, t6);
      }
      round(e7) {
        if (vt(this, ft), void 0 === e7) throw new TypeError("options parameter is required");
        const t6 = "string" == typeof e7 ? Fo("smallestUnit", e7) : Zo(e7), n10 = Ft(t6), r7 = Ut(t6, "halfExpand"), o8 = Wt(t6, "smallestUnit", "time", qt);
        return Ht(n10, { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[o8], false), Tn(Oo(re(this, M2), n10, o8, r7));
      }
      equals(e7) {
        vt(this, ft);
        const t6 = hn(e7);
        return 0 === So(re(this, M2), re(t6, M2));
      }
      toString(e7 = void 0) {
        vt(this, ft);
        const t6 = Zo(e7), n10 = zt(t6), r7 = Ut(t6, "trunc"), o8 = Wt(t6, "smallestUnit", "time", void 0);
        if ("hour" === o8) throw new RangeError('smallestUnit must be a time unit other than "hour"');
        const { precision: i8, unit: a4, increment: s7 } = At(o8, n10);
        return tr(Oo(re(this, M2), s7, a4, r7), i8);
      }
      toJSON() {
        return vt(this, ft), tr(re(this, M2), "auto");
      }
      toLocaleString(e7 = void 0, t6 = void 0) {
        return vt(this, ft), new di(e7, t6).format(this);
      }
      valueOf() {
        qo("PlainTime");
      }
      static from(e7, t6 = void 0) {
        return hn(e7, t6);
      }
      static compare(e7, t6) {
        const n10 = hn(e7), r7 = hn(t6);
        return So(re(n10, M2), re(r7, M2));
      }
    };
    ae(PlainTime, "Temporal.PlainTime");
    PlainYearMonth = class {
      constructor(e7, t6, n10 = "iso8601", r7 = 1) {
        const o8 = _e(e7), i8 = _e(t6), a4 = zo(void 0 === n10 ? "iso8601" : Ve(n10)), s7 = _e(r7);
        xr(o8, i8, s7), Mn(this, { year: o8, month: i8, day: s7 }, a4);
      }
      get year() {
        return Zi(this, "year");
      }
      get month() {
        return Zi(this, "month");
      }
      get monthCode() {
        return Zi(this, "monthCode");
      }
      get calendarId() {
        return vt(this, pt), re(this, E2);
      }
      get era() {
        return Zi(this, "era");
      }
      get eraYear() {
        return Zi(this, "eraYear");
      }
      get daysInMonth() {
        return Zi(this, "daysInMonth");
      }
      get daysInYear() {
        return Zi(this, "daysInYear");
      }
      get monthsInYear() {
        return Zi(this, "monthsInYear");
      }
      get inLeapYear() {
        return Zi(this, "inLeapYear");
      }
      with(e7, t6 = void 0) {
        if (vt(this, pt), !Ae(e7)) throw new TypeError("invalid argument");
        bt(e7);
        const n10 = re(this, E2);
        let r7 = en(n10, re(this, D2), "year-month");
        return r7 = Rn(n10, r7, tn(n10, e7, ["year", "month", "monthCode"], [], "partial")), En(Pn(n10, r7, Lt(Zo(t6))), n10);
      }
      add(e7, t6 = void 0) {
        return vt(this, pt), To("add", this, e7, t6);
      }
      subtract(e7, t6 = void 0) {
        return vt(this, pt), To("subtract", this, e7, t6);
      }
      until(e7, t6 = void 0) {
        return vt(this, pt), lo("until", this, e7, t6);
      }
      since(e7, t6 = void 0) {
        return vt(this, pt), lo("since", this, e7, t6);
      }
      equals(e7) {
        vt(this, pt);
        const t6 = ln(e7);
        return 0 === Ro(re(this, D2), re(t6, D2)) && xn(re(this, E2), re(t6, E2));
      }
      toString(e7 = void 0) {
        return vt(this, pt), or(this, Zt(Zo(e7)));
      }
      toJSON() {
        return vt(this, pt), or(this);
      }
      toLocaleString(e7 = void 0, t6 = void 0) {
        return vt(this, pt), new di(e7, t6).format(this);
      }
      valueOf() {
        qo("PlainYearMonth");
      }
      toPlainDate(e7) {
        if (vt(this, pt), !Ae(e7)) throw new TypeError("argument should be an object");
        const t6 = re(this, E2);
        return pn(Ln(t6, Rn(t6, en(t6, re(this, D2), "year-month"), tn(t6, e7, ["day"], [], [])), "constrain"), t6);
      }
      static from(e7, t6 = void 0) {
        return ln(e7, t6);
      }
      static compare(e7, t6) {
        const n10 = ln(e7), r7 = ln(t6);
        return Ro(re(n10, D2), re(r7, D2));
      }
    };
    ae(PlainYearMonth, "Temporal.PlainYearMonth");
    Fi = di.prototype.resolvedOptions;
    ZonedDateTime = class {
      constructor(e7, t6, n10 = "iso8601") {
        if (arguments.length < 1) throw new TypeError("missing argument: epochNanoseconds is required");
        const r7 = Lo(e7);
        let o8 = Ve(t6);
        const { tzName: i8, offsetMinutes: a4 } = Rt(o8);
        if (void 0 === a4) {
          const e8 = hr(i8);
          if (!e8) throw new RangeError(`unknown time zone ${i8}`);
          o8 = e8.identifier;
        } else o8 = mr(a4);
        On(this, r7, o8, zo(void 0 === n10 ? "iso8601" : Ve(n10)));
      }
      get calendarId() {
        return vt(this, wt), re(this, E2);
      }
      get timeZoneId() {
        return vt(this, wt), re(this, $2);
      }
      get year() {
        return zi(this, "year");
      }
      get month() {
        return zi(this, "month");
      }
      get monthCode() {
        return zi(this, "monthCode");
      }
      get day() {
        return zi(this, "day");
      }
      get hour() {
        return Ai(this, "hour");
      }
      get minute() {
        return Ai(this, "minute");
      }
      get second() {
        return Ai(this, "second");
      }
      get millisecond() {
        return Ai(this, "millisecond");
      }
      get microsecond() {
        return Ai(this, "microsecond");
      }
      get nanosecond() {
        return Ai(this, "nanosecond");
      }
      get era() {
        return zi(this, "era");
      }
      get eraYear() {
        return zi(this, "eraYear");
      }
      get epochMilliseconds() {
        return vt(this, wt), No(re(this, b3), "floor");
      }
      get epochNanoseconds() {
        return vt(this, wt), ko(re(this, b3));
      }
      get dayOfWeek() {
        return zi(this, "dayOfWeek");
      }
      get dayOfYear() {
        return zi(this, "dayOfYear");
      }
      get weekOfYear() {
        return zi(this, "weekOfYear")?.week;
      }
      get yearOfWeek() {
        return zi(this, "weekOfYear")?.year;
      }
      get hoursInDay() {
        vt(this, wt);
        const e7 = re(this, $2), t6 = Hi(this).isoDate, n10 = Or(t6.year, t6.month, t6.day + 1), r7 = _n(e7, t6), o8 = _n(e7, n10);
        return Yo(TimeDuration.fromEpochNsDiff(o8, r7), "hour");
      }
      get daysInWeek() {
        return zi(this, "daysInWeek");
      }
      get daysInMonth() {
        return zi(this, "daysInMonth");
      }
      get daysInYear() {
        return zi(this, "daysInYear");
      }
      get monthsInYear() {
        return zi(this, "monthsInYear");
      }
      get inLeapYear() {
        return zi(this, "inLeapYear");
      }
      get offset() {
        return vt(this, wt), Hn(Fn(re(this, $2), re(this, b3)));
      }
      get offsetNanoseconds() {
        return vt(this, wt), Fn(re(this, $2), re(this, b3));
      }
      with(e7, t6 = void 0) {
        if (vt(this, wt), !Ae(e7)) throw new TypeError("invalid zoned-date-time-like");
        bt(e7);
        const n10 = re(this, E2), r7 = re(this, $2), o8 = Fn(r7, re(this, b3)), i8 = Hi(this);
        let a4 = { ...en(n10, i8.isoDate), ...i8.time, offset: Hn(o8) };
        a4 = Rn(n10, a4, tn(n10, e7, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset"], "partial"));
        const s7 = Zo(t6), c7 = Pt(s7), d4 = Bt(s7, "prefer"), h7 = on(n10, a4, Lt(s7)), u4 = sr(a4.offset);
        return $n(mn(h7.isoDate, h7.time, "option", u4, r7, c7, d4, false), r7, n10);
      }
      withPlainTime(e7 = void 0) {
        vt(this, wt);
        const t6 = re(this, $2), n10 = re(this, E2), r7 = Hi(this).isoDate;
        let o8;
        return o8 = void 0 === e7 ? _n(t6, r7) : An(t6, xt(r7, re(hn(e7), M2)), "compatible"), $n(o8, t6, n10);
      }
      withTimeZone(e7) {
        vt(this, wt);
        const t6 = Bn(e7);
        return $n(re(this, b3), t6, re(this, E2));
      }
      withCalendar(e7) {
        vt(this, wt);
        const t6 = kn(e7);
        return $n(re(this, b3), re(this, $2), t6);
      }
      add(e7, t6 = void 0) {
        return vt(this, wt), Mo("add", this, e7, t6);
      }
      subtract(e7, t6 = void 0) {
        return vt(this, wt), Mo("subtract", this, e7, t6);
      }
      until(e7, t6 = void 0) {
        return vt(this, wt), mo("until", this, e7, t6);
      }
      since(e7, t6 = void 0) {
        return vt(this, wt), mo("since", this, e7, t6);
      }
      round(t6) {
        if (vt(this, wt), void 0 === t6) throw new TypeError("options parameter is required");
        const n10 = "string" == typeof t6 ? Fo("smallestUnit", t6) : Zo(t6), r7 = Ft(n10), o8 = Ut(n10, "halfExpand"), i8 = Wt(n10, "smallestUnit", "time", qt, ["day"]), a4 = { day: 1, hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[i8];
        if (Ht(r7, a4, 1 === a4), "nanosecond" === i8 && 1 === r7) return $n(re(this, b3), re(this, $2), re(this, E2));
        const s7 = re(this, $2), c7 = re(this, b3), d4 = Hi(this);
        let h7;
        if ("day" === i8) {
          const t7 = d4.isoDate, n11 = Or(t7.year, t7.month, t7.day + 1), r8 = _n(s7, t7), i9 = _n(s7, n11), a5 = import_jsbi.default.subtract(i9, r8);
          h7 = TimeDuration.fromEpochNsDiff(c7, r8).round(a5, o8).addToEpochNs(r8);
        } else {
          const e7 = Co(d4, r7, i8, o8), t7 = Fn(s7, c7);
          h7 = mn(e7.isoDate, e7.time, "option", t7, s7, "compatible", "prefer", false);
        }
        return $n(h7, s7, re(this, E2));
      }
      equals(t6) {
        vt(this, wt);
        const n10 = fn(t6), r7 = re(this, b3), o8 = re(n10, b3);
        return !!import_jsbi.default.equal(import_jsbi.default.BigInt(r7), import_jsbi.default.BigInt(o8)) && !!Zn(re(this, $2), re(n10, $2)) && xn(re(this, E2), re(n10, E2));
      }
      toString(e7 = void 0) {
        vt(this, wt);
        const t6 = Zo(e7), n10 = Zt(t6), r7 = zt(t6), o8 = function(e8) {
          return Ho(e8, "offset", ["auto", "never"], "auto");
        }(t6), i8 = Ut(t6, "trunc"), a4 = Wt(t6, "smallestUnit", "time", void 0);
        if ("hour" === a4) throw new RangeError('smallestUnit must be a time unit other than "hour"');
        const s7 = function(e8) {
          return Ho(e8, "timeZoneName", ["auto", "never", "critical"], "auto");
        }(t6), { precision: c7, unit: d4, increment: h7 } = At(a4, r7);
        return ir(this, c7, n10, s7, o8, { unit: d4, increment: h7, roundingMode: i8 });
      }
      toLocaleString(e7 = void 0, t6 = void 0) {
        vt(this, wt);
        const n10 = Zo(t6), r7 = /* @__PURE__ */ Object.create(null);
        if (function(e8, t7, n11, r8) {
          if (null == t7) return;
          const o9 = Reflect.ownKeys(t7);
          for (let i9 = 0; i9 < o9.length; i9++) {
            const a5 = o9[i9];
            if (!n11.some((e9) => Object.is(e9, a5)) && Object.prototype.propertyIsEnumerable.call(t7, a5)) {
              const n12 = t7[a5];
              r8, e8[a5] = n12;
            }
          }
        }(r7, n10, ["timeZone"]), void 0 !== n10.timeZone) throw new TypeError("ZonedDateTime toLocaleString does not accept a timeZone option");
        if (void 0 === r7.year && void 0 === r7.month && void 0 === r7.day && void 0 === r7.era && void 0 === r7.weekday && void 0 === r7.dateStyle && void 0 === r7.hour && void 0 === r7.minute && void 0 === r7.second && void 0 === r7.fractionalSecondDigits && void 0 === r7.timeStyle && void 0 === r7.dayPeriod && void 0 === r7.timeZoneName && (r7.timeZoneName = "short"), r7.timeZone = re(this, $2), ar(r7.timeZone)) throw new RangeError("toLocaleString does not currently support offset time zones");
        const o8 = new di(e7, r7), i8 = Fi.call(o8).calendar, a4 = re(this, E2);
        if ("iso8601" !== a4 && "iso8601" !== i8 && !xn(i8, a4)) throw new RangeError(`cannot format ZonedDateTime with calendar ${a4} in locale with calendar ${i8}`);
        return o8.format(Cn(re(this, b3)));
      }
      toJSON() {
        return vt(this, wt), ir(this, "auto");
      }
      valueOf() {
        qo("ZonedDateTime");
      }
      startOfDay() {
        vt(this, wt);
        const e7 = re(this, $2);
        return $n(_n(e7, Hi(this).isoDate), e7, re(this, E2));
      }
      getTimeZoneTransition(e7) {
        vt(this, wt);
        const t6 = re(this, $2);
        if (void 0 === e7) throw new TypeError("options parameter is required");
        const n10 = Ho("string" == typeof e7 ? Fo("direction", e7) : Zo(e7), "direction", ["next", "previous"], qt);
        if (void 0 === n10) throw new TypeError("direction option is required");
        if (ar(t6) || "UTC" === t6) return null;
        const r7 = re(this, b3), o8 = "next" === n10 ? wr(t6, r7) : vr(t6, r7);
        return null === o8 ? null : $n(o8, t6, re(this, E2));
      }
      toInstant() {
        return vt(this, wt), Cn(re(this, b3));
      }
      toPlainDate() {
        return vt(this, wt), pn(Hi(this).isoDate, re(this, E2));
      }
      toPlainTime() {
        return vt(this, wt), Tn(Hi(this).time);
      }
      toPlainDateTime() {
        return vt(this, wt), wn(Hi(this), re(this, E2));
      }
      static from(e7, t6 = void 0) {
        return fn(e7, t6);
      }
      static compare(t6, n10) {
        const r7 = fn(t6), o8 = fn(n10), i8 = re(r7, b3), a4 = re(o8, b3);
        return import_jsbi.default.lessThan(import_jsbi.default.BigInt(i8), import_jsbi.default.BigInt(a4)) ? -1 : import_jsbi.default.greaterThan(import_jsbi.default.BigInt(i8), import_jsbi.default.BigInt(a4)) ? 1 : 0;
      }
    };
    ae(ZonedDateTime, "Temporal.ZonedDateTime");
    qi = Object.freeze({ __proto__: null, Duration, Instant, Now: Bi, PlainDate, PlainDateTime, PlainMonthDay, PlainTime, PlainYearMonth, ZonedDateTime });
    Wi = class LegacyDateImpl {
      toTemporalInstant() {
        return Cn(xo(Date.prototype.valueOf.call(this)));
      }
    }.prototype.toTemporalInstant;
    _i = [Instant, PlainDate, PlainDateTime, Duration, PlainMonthDay, PlainTime, PlainYearMonth, ZonedDateTime];
    for (const e7 of _i) {
      const t6 = Object.getOwnPropertyDescriptor(e7, "prototype");
      (t6.configurable || t6.enumerable || t6.writable) && (t6.configurable = false, t6.enumerable = false, t6.writable = false, Object.defineProperty(e7, "prototype", t6));
    }
  }
});

// src/swipe-action.js
var SwipeAction;
var init_swipe_action = __esm({
  "src/swipe-action.js"() {
    init_lit();
    SwipeAction = class extends i4 {
      static get properties() {
        return {
          open: { type: Boolean }
        };
      }
      static get styles() {
        return i`
      :host {
        display: grid;
        width: 100%;
        height: 100%;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        container: swipe-action / size;
      }
      ::slotted(*) {
        width: 100%;
      }
      #swipe-container {
        display: grid;
        width: 140cqi;
        height: 100cqb;
        grid-template-columns: 20cqi 100cqi 20cqi;
        grid-template-rows: 100cqb;
        grid-template-areas: "left contents right";
      }
      #left-action {
        grid-area: left;
        scroll-snap-align: unset;
      }
      #contents {
        grid-area: contents;
        scroll-snap-stop: always;
        scroll-snap-align: start;
      }
      #right-action {
        grid-area: right;
        scroll-snap-align: unset;
      }
      #default-left {
        background: linear-gradient(
          90deg,
          rgba(255, 0, 0, 1) 0%,
          rgba(255, 0, 0, 0.3) 25%,
          rgba(0, 0, 0, 0) 100%
        );
        height: 100%;
        width: 100%;
      }
      #default-right {
        background: linear-gradient(
          -90deg,
          rgba(0, 0, 255, 1) 0%,
          rgba(0, 0, 255, 0.3) 25%,
          rgba(0, 0, 0, 0) 100%
        );
        height: 100%;
        width: 100%;
      }
    `;
      }
      firstUpdated() {
        super.connectedCallback();
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio >= 0.7) {
                if (entry.target.id === "left-action") {
                  this.dispatchEvent(new CustomEvent("left-action"));
                } else if (entry.target.id === "right-action") {
                  this.dispatchEvent(new CustomEvent("right-action"));
                }
              }
            });
          },
          {
            root: document.body,
            rootMargin: "5px",
            threshold: 0.7
          }
        );
        observer.observe(this.shadowRoot.querySelector("#left-action"));
        observer.observe(this.shadowRoot.querySelector("#right-action"));
      }
      render() {
        return b2`
      <div id="swipe-container">
        <div id="left-action">
          <slot name="left-action">
            <div id="default-left"></div>
          </slot>
        </div>
        <div id="contents">
          <slot></slot>
        </div>
        <div id="right-action">
          <slot name="right-action">
            <div id="default-right"></div>
          </slot>
        </div>
      </div>
    `;
      }
    };
    customElements.define("swipe-action", SwipeAction);
  }
});

// src/EpisodeCompletedEvent.js
var EpisodeCompletedEvent_exports = {};
__export(EpisodeCompletedEvent_exports, {
  EpisodeCompletedEvent: () => EpisodeCompletedEvent
});
var EpisodeCompletedEvent;
var init_EpisodeCompletedEvent = __esm({
  "src/EpisodeCompletedEvent.js"() {
    EpisodeCompletedEvent = class extends Event {
      constructor(episode) {
        super("episode-completed", {
          bubbles: true,
          composed: true
        });
        this.episode = episode;
      }
    };
  }
});

// src/pod-list.js
var pod_list_exports = {};
var PodList;
var init_pod_list = __esm({
  "src/pod-list.js"() {
    init_lit();
    init_when2();
    init_until2();
    init_EpisodeSelectEvent();
    init_play_pause_css();
    init_index_esm();
    init_swipe_action();
    PodList = class extends i4 {
      static get properties() {
        return {
          items: { type: Array },
          _lastSelected: {
            type: Boolean,
            reflect: true,
            attribute: "has-last-selected"
          },
          _selected: { type: Boolean, reflect: true, attribute: "selected" }
        };
      }
      static get styles() {
        return [
          playPauseStyles,
          i`
        * {
          box-sizing: border-box;
        }
        :host {
          display: grid;
          gap: 4px;
          grid-template-rows: repeat(var(--item-count), 3lh);
          container: list / size;
          max-width: calc(100vw - 16px);
          overflow-y: scroll;
        }
        img[selected] {
          view-transition-name: header-image;
        }
        button {
          display: grid;
          padding: 0;
          background: none;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          overflow: clip;
          grid-template-areas:
            "image title play"
            "image progress play";
          grid-template-rows: 2lh minmax(1lh, 1fr);
          grid-template-columns: 3lh minmax(0, 1fr) 3lh;
          height: 100%;
          & p {
            margin: 0;
          }
          & #image {
            grid-area: image;
            height: 100%;
            aspect-ratio: 1 / 1;
            place-self: end;
          }
          & #title {
            grid-area: title;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: clip;
            padding: 8px 16px;
            text-align: left;
          }
          & #progress {
            grid-area: progress;
            width: calc(100% - 32px);
            margin: 0 16px;
          }
          #play {
            grid-area: play;
            place-self: end;
          }
        }
      `
        ];
      }
      constructor() {
        super();
        this.items = [];
      }
      get cleanItems() {
        return this.items.map((item) => ({ ...item, progress: 0 }));
      }
      async minutesRemaining(item) {
        const duration = Math.floor(this.secondDuration(item.itunes?.duration));
        const progress = Math.floor(await item.progress ?? 0);
        const durationRemaining = qi.Duration.from({
          seconds: duration - progress
        }).round({ largestUnit: "minutes" });
        return durationRemaining.minutes;
      }
      updated(changedProperties) {
        if (changedProperties.has("items")) {
          this.style.setProperty("--item-count", this.items.length || 1);
        }
      }
      secondDuration(duration = "00:00:00") {
        duration = `00:00:00:${duration}`.slice(-8);
        const [hours, minutes, seconds] = duration.split(":");
        return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
      }
      async selectEpisode(episode) {
        this._lastSelected = void 0;
        this._selected = episode;
        const cleanedEpsiode = { ...episode, progress: await episode.progress };
        this.dispatchEvent(new EpisodeSelectEvent(cleanedEpsiode));
      }
      async deselect() {
        this._lastSelected = this._selected;
        this._selected = void 0;
        await this.updateComplete;
      }
      async reselect() {
        this._selected = this._lastSelected;
        this._lastSelected = void 0;
        await this.updateComplete;
        requestAnimationFrame(() => {
          this._selected = void 0;
        });
      }
      async delete(episode) {
        const { removeInProgressEpisode: removeInProgressEpisode2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
        await removeInProgressEpisode2(episode.id);
        this.items = this.items.filter((ep) => ep.id !== episode.id);
      }
      async complete(episode) {
        const { EpisodeCompletedEvent: EpisodeCompletedEvent2 } = await Promise.resolve().then(() => (init_EpisodeCompletedEvent(), EpisodeCompletedEvent_exports));
        this.dispatchEvent(new EpisodeCompletedEvent2(episode));
      }
      render() {
        return b2`
      ${n4(
          this.items.length,
          () => this.items.map(
            (item) => b2`
                <swipe-action
                  @left-action=${() => this.delete(item)}
                  @right-action=${() => this.delete(item)}
                >
                  <button
                    ?complete=${item.complete}
                    @click=${() => this.selectEpisode(item)}
                  >
                    <img
                      id="image"
                      ?selected=${this._selected?.title === item.title}
                      ?last-selected=${this._lastSelected === item}
                      src=${item.image?.url ?? item.itunes?.image ?? item.podcastImage}
                    />
                    <p id="title">${item.title}</p>
                    <p id="progress">
                      ${m2(this.minutesRemaining(item), 0)} minutes remaning
                    </p>

                    <svg viewBox="0 -960 960 960" id="play" play-pause play>
                      <path></path>
                    </svg>
                  </button>
                </swipe-action>
              `
          ),
          () => b2`<slot></slot>`
        )}
    `;
      }
    };
    customElements.define("pod-list", PodList);
  }
});

// src/pod-surfer.js
var pod_surfer_exports = {};
var init_pod_surfer = __esm({
  "src/pod-surfer.js"() {
    init_pod_scroller();
    init_pod_list();
  }
});

// src/podcast-page.js
var podcast_page_exports = {};
__export(podcast_page_exports, {
  PodcastPage: () => PodcastPage
});
var PodcastPage;
var init_podcast_page = __esm({
  "src/podcast-page.js"() {
    init_lit();
    init_when2();
    init_storage();
    init_api();
    PodcastPage = class extends i4 {
      static get properties() {
        return {
          podcast: { type: Object },
          _isSubscribed: { state: true }
        };
      }
      static get styles() {
        return i`
      * {
        box-sizing: border-box;
      }
      :host {
        display: contents;
      }
      header,
      main {
        background-color: white;
        z-index: 2;
      }
      :host(:not([hidden])) header {
        view-transition-name: header;
      }
      :host(:not([hidden])) header img {
        view-transition-name: header-image;
      }
      :host(:not([hidden])) main {
        view-transition-name: body;
      }
      ::view-transition-old(body) {
        opacity: 0;
      }

      header {
        grid-area: header;
        height: 40vh;
        position: relative;
        & img {
          block-size: 100vw;
          inline-size: 100vw;
        }
        & button {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          display: grid;
          place-content: center;
          height: 44px;
          width: 44px;
          z-index: 3;
          & svg {
            width: 100%;
            fill: white;
          }
        }
        & p {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 8px;
          color: white;
          margin: 0;
          background: rgba(0, 0, 0, 0.5);
          width: 100%;
          text-align: center;
          transform: translateY(0);
          transition: all 0.3s ease-in;
          transition-delay: 0.6s;
          @starting-style {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      }

      main {
        display: grid;
        gap: 8px;
        grid-template-areas: "description" "audio-controls";
        grid-template-rows: max-content minmax(0, 1fr);
        grid-area: body;
        padding: 16px;
        border-radius: 24px 24px 0 0;
        transition: all 0.5s ease-out;
        transition-delay: 0.2s;
        @starting-style {
          transform: translateY(100%);
          opacity: 0;
        }
        & pre {
          margin: 0;
          white-space: break-spaces;
        }
        & h2 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 42px;
          font-family: system-ui, sans-serif;
          padding: 0;
          margin: 0;
        }
        & #subscribe {
          background: none;
          border: none;
          margin: 0;
          padding: 0;
          & svg {
            fill: var(--primarycolor, #000);
            height: 44px;
            width: 44px;
          }
        }
      }
    `;
      }
      constructor() {
        super();
        this.podcast = {};
      }
      updated(changedProperties) {
        if (changedProperties.has("podcast")) {
          this._checkSubscription();
        }
      }
      async _checkSubscription() {
        if (!this.podcast) return;
        if (!this.registration)
          this.registration = await navigator.serviceWorker.ready;
        const subscription = await this.registration.pushManager.getSubscription();
        if (subscription !== null) {
          const localSubscription = await getSubscription();
          this._isSubscribed = localSubscription?.notifiers?.includes(this.podcast.title) || false;
        }
      }
      async subscribe() {
        if (this._isSubscribed) return;
        this._isSubscribed = true;
        try {
          const localSubscription = await getSubscription();
          let { userId, publicKey, subscription } = localSubscription || {};
          if (!localSubscription) {
            const initializeResult = await fetchWithTimeout(
              "https://oracle.mone.dev/notifications/initialize",
              {
                method: "POST",
                headers: new Headers({ "content-type": "application/json" }),
                body: JSON.stringify({
                  appId: "pod-surfer"
                })
              }
            ).then((r7) => r7.json());
            userId = initializeResult.userId;
            publicKey = initializeResult.publicKey;
            subscription = await this.registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: publicKey
            });
          }
          const notifiers = await fetchWithTimeout(
            "https://oracle.mone.dev/notifications/subscribe",
            {
              method: "POST",
              headers: new Headers({ "content-type": "application/json" }),
              body: JSON.stringify({
                appId: "pod-surfer",
                notifiers: [this.podcast.title],
                userId,
                publicKey,
                subscription: subscription.toJSON()
              })
            }
          );
          await setSubscription({
            userId,
            publicKey,
            notifiers
          });
          showToast("Subscribed to push notifications");
        } catch (error) {
          console.error(error);
          this._isSubscribed = false;
          showToast("Failed to subscribe to notifications", true);
        }
      }
      async unsubscribe() {
        if (!this._isSubscribed) return;
        this._isSubscribed = false;
        try {
          const subscription = await this.registration.pushManager.getSubscription();
          if (!subscription) return;
          await subscription.unsubscribe();
          await fetchWithTimeout("https://oracle.mone.dev/notifications/unsubscribe", {
            method: "POST",
            headers: new Headers({ "content-type": "application/json" }),
            body: JSON.stringify({
              appId: "pod-surfer",
              subscription: subscription.toJSON()
            })
          });
          await setSubscription(null);
          showToast("Unsubscribed from push notifications");
        } catch (error) {
          console.error(error);
          this._isSubscribed = true;
          showToast("Failed to unsubscribe", true);
        }
      }
      render() {
        return b2`
      <header>
        <button
          id="close"
          @click=${() => this.dispatchEvent(
          new CustomEvent("podcast-close", {
            bubbles: true,
            composed: true
          })
        )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path
              d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"
            />
          </svg>
        </button>
        <img src=${this.podcast?.image?.url ?? this.podcast.itunes?.image} />
        <p>${this.podcast.title}</p>
      </header>
      <main>
        <h2>
          <span>Episodes</span>
          <button
            id="subscribe"
            @click=${() => this._isSubscribed ? this.unsubscribe() : this.subscribe()}
          >
            ${n4(
          this._isSubscribed,
          () => b2`
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path
                    d="M80-560q0-100 44.5-183.5T244-882l47 64q-60 44-95.5 111T160-560H80Zm720 0q0-80-35.5-147T669-818l47-64q75 55 119.5 138.5T880-560h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"
                  />
                </svg>
              `,
          () => b2`
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path
                    d="M480-500Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm240-360v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q14 4 27.5 8.5T593-772q-15 14-27 30.5T545-706q-15-7-31.5-10.5T480-720q-66 0-113 47t-47 113v280h320v-112q18 11 38 18t42 11v83h80v80H160Z"
                  />
                </svg>
              `
        )}
          </button>
        </h2>
        <pod-list .items=${this.podcast.items ?? []}></pod-list>
      </main>
    `;
      }
    };
    customElements.define("podcast-page", PodcastPage);
  }
});

// src/ViewTransitionMixin.js
var ViewTransitionMixin;
var init_ViewTransitionMixin = __esm({
  "src/ViewTransitionMixin.js"() {
    ViewTransitionMixin = (superClass) => class extends superClass {
      async scheduleUpdate() {
        if (this._viewTransition !== void 0) {
          await this._viewTransition.finished;
        }
        return super.scheduleUpdate();
      }
      async performUpdate() {
        if (!document.startViewTransition) {
          return super.performUpdate();
        }
        await (this._viewTransition = document.startViewTransition(() => {
          super.performUpdate();
        }));
        this._viewTransition = void 0;
      }
    };
  }
});

// src/episode-page.js
var episode_page_exports = {};
__export(episode_page_exports, {
  EpisodePage: () => EpisodePage
});
var EpisodePage;
var init_episode_page = __esm({
  "src/episode-page.js"() {
    init_lit();
    init_when2();
    init_EpisodeSelectEvent();
    init_ViewTransitionMixin();
    EpisodePage = class extends ViewTransitionMixin(i4) {
      static get properties() {
        return {
          hidden: { state: true },
          podcast: { type: Object },
          episode: { type: Object },
          audioTime: { state: true },
          playbackRate: { state: true }
        };
      }
      static get styles() {
        return i`
      * {
        box-sizing: border-box;
      }
      :host {
        display: contents;
      }
      header,
      main {
        background-color: white;
        z-index: 3;
      }
      :host(:not([hidden])) header {
        view-transition-name: header;
      }
      :host(:not([hidden])) header img {
        view-transition-name: header-image;
      }
      :host(:not([hidden])) main {
        view-transition-name: body;
      }
      ::view-transition-old(body) {
        opacity: 0;
      }
      header {
        grid-area: header;
        height: 40vh;
        position: relative;
        & img {
          block-size: 100vw;
          inline-size: 100vw;
        }
        & button {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          display: grid;
          place-content: center;
          height: 44px;
          width: 44px;
          z-index: 3;
          & svg {
            width: 100%;
            fill: white;
          }
        }
        & p {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 8px;
          color: white;
          margin: 0;
          background: rgba(0, 0, 0, 0.5);
          width: 100%;
          text-align: center;
          transform: translateY(0);
          transition: all 0.3s ease-in;
          transition-delay: 0.6s;
          @starting-style {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      }

      main {
        display: grid;
        gap: 8px;
        grid-template-areas: "description" "audio-controls";
        grid-template-rows: max-content minmax(0, 1fr);
        grid-area: body;
        padding: 16px;
        border-radius: 24px 24px 0 0;
        transition: all 0.5s ease-out;
        transition-delay: 0.2s;
        @starting-style {
          transform: translateY(100%);
          opacity: 0;
        }
        & pre {
          margin: 0;
          white-space: break-spaces;
        }
      }
    `;
      }
      updated(changedProperties) {
        if (changedProperties.has("episode")) {
          this._imageLoaded = false;
          Promise.resolve().then(() => (init_storage(), storage_exports)).then(({ getEpisodeTime: getEpisodeTime2, getPlaybackRate: getPlaybackRate2 }) => {
            getEpisodeTime2(this.episode.title).then((time) => {
              if (!time) return;
              this.audioTime = time;
            });
            getPlaybackRate2().then((rate) => {
              if (!rate) return;
              this.playbackRate = rate;
            });
          });
        }
      }
      constructor() {
        super();
        this.episode = {};
      }
      get imageLoaded() {
        return new Promise((resolve) => {
          if (this._imageLoaded) return resolve(true);
          this.addEventListener(
            "load",
            () => {
              this._imageLoaded = true;
              resolve(true);
            },
            { once: true }
          );
        });
      }
      async handleEnded() {
        const { EpisodeCompletedEvent: EpisodeCompletedEvent2 } = await Promise.resolve().then(() => (init_EpisodeCompletedEvent(), EpisodeCompletedEvent_exports));
        this.dispatchEvent(new EpisodeCompletedEvent2(this.episode));
        this.dispatchEvent(
          new CustomEvent("episode-close", {
            bubbles: true,
            composed: true
          })
        );
      }
      async handleTimeUpdate({ detail: { time } }) {
        const { setEpisodeTime: setEpisodeTime2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
        await setEpisodeTime2(this.episode.title, time);
      }
      async handlePlaybackRateChange({ detail: { rate } }) {
        const { setPlaybackRate: setPlaybackRate2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
        await setPlaybackRate2(rate);
      }
      render() {
        return b2`<header>
        <button
          @click=${() => this.dispatchEvent(
          new CustomEvent("episode-close", {
            bubbles: true,
            composed: true
          })
        )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path
              d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"
            />
          </svg>
        </button>
        <img src=${this.episode.itunes?.image ?? this.episode.podcastImage} />
        <p>${this.episode.title}</p>
      </header>
      <main>
        <details>
          <summary>Episode Description</summary>
          <pre>
							${this.episode.contentSnippet}
						</pre
          >
        </details>
        <pod-audio
          url=${`https://oracle.mone.dev/podsurfer/audio/${this.episode.podcastId}/${this.episode.id}`}
          type=${this.episode.enclosure.type}
          length=${this.episode.enclosure.length}
          duration=${this.episode.itunes?.duration}
          podcast=${this.episode.podcastId}
          image=${this.episode.itunes?.image ?? this.episode.podcastImage}
          title=${this.episode.title}
          author=${this.episode.creator}
          .audioTime=${this.audioTime ?? 0}
          .playbackRate=${this.playbackRate ?? 1}
          @time-updated=${this.handleTimeUpdate}
          @playbackrate-changed=${this.handlePlaybackRateChange}
          @ended=${this.handleEnded}
        ></pod-audio>
      </main> `;
      }
    };
    customElements.define("episode-page", EpisodePage);
  }
});

// node_modules/lit-html/directives/ref.js
var e6, h6, o7, n9;
var init_ref = __esm({
  "node_modules/lit-html/directives/ref.js"() {
    init_lit_html();
    init_async_directive();
    init_directive();
    e6 = () => new h6();
    h6 = class {
    };
    o7 = /* @__PURE__ */ new WeakMap();
    n9 = e4(class extends f3 {
      render(i8) {
        return A;
      }
      update(i8, [s7]) {
        const e7 = s7 !== this.G;
        return e7 && this.rt(void 0), (e7 || this.lt !== this.ct) && (this.G = s7, this.ht = i8.options?.host, this.rt(this.ct = i8.element)), A;
      }
      rt(t6) {
        if (void 0 !== this.G) if (this.isConnected || (t6 = void 0), "function" == typeof this.G) {
          const i8 = this.ht ?? globalThis;
          let s7 = o7.get(i8);
          void 0 === s7 && (s7 = /* @__PURE__ */ new WeakMap(), o7.set(i8, s7)), void 0 !== s7.get(this.G) && this.G.call(this.ht, void 0), s7.set(this.G, t6), void 0 !== t6 && this.G.call(this.ht, t6);
        } else this.G.value = t6;
      }
      get lt() {
        return "function" == typeof this.G ? o7.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
      }
      disconnected() {
        this.lt === this.ct && this.rt(void 0);
      }
      reconnected() {
        this.rt(this.ct);
      }
    });
  }
});

// node_modules/lit/directives/ref.js
var init_ref2 = __esm({
  "node_modules/lit/directives/ref.js"() {
    init_ref();
  }
});

// src/pod-audio.js
var pod_audio_exports = {};
__export(pod_audio_exports, {
  PodAudio: () => PodAudio
});
var PX_BETWEEN_RECTANGLES, PodAudio;
var init_pod_audio = __esm({
  "src/pod-audio.js"() {
    init_lit();
    init_when2();
    init_ref2();
    init_index_esm();
    init_play_pause_css();
    PX_BETWEEN_RECTANGLES = 2;
    PodAudio = class extends i4 {
      static get properties() {
        return {
          url: { type: String },
          type: { type: String },
          length: { type: Number },
          duration: { type: String },
          title: { type: String },
          author: { type: String },
          image: { type: String },
          playing: { type: Boolean, reflect: true },
          maxDuration: { state: true },
          currentTime: { type: Number },
          playbackRate: { state: true },
          audioTime: { type: Number },
          audioCurrentTime: { state: true },
          audioDuration: { state: true }
        };
      }
      static get styles() {
        return [
          playPauseStyles,
          i`
        * {
          box-sizing: border-box;
        }
        :host {
          container: audio / size;
          display: grid;
          grid-template-areas:
            "title title title title title"
            "author author author author author"
            "progress progress progress progress progress"
            "currentTime currentTime duration duration duration"
            "rate back play forward .";
          grid-template-rows: max-content max-content minmax(0, 1fr) max-content;
          grid-template-columns: repeat(5, calc(20% - 8px));
          gap: 8px;
        }
        h1 {
          grid-area: title;
          margin: 0;
        }
        p {
          grid-area: author;
          margin: 0;
        }
        progress {
          padding: 1px;
        }
        progress,
        svg#progress-cover {
          grid-area: progress;
          height: 100%;
          width: 100%;
          appearance: none;
          aspect-ratio: 1 / 1;
          &::-webkit-progress-value {
            background-color: var(--primarycolor, #fff);
          }
          &::-webkit-progress-bar {
            background-color: rgba(0, 0, 0, 0.2);
          }
          & path {
            fill: #fff;
          }
        }
        svg {
          pointer-events: none;
          width: 50%;
        }
        p#currentTime {
          grid-area: currentTime;
        }
        p#duration {
          grid-area: duration;
          justify-self: end;
        }
        button {
          aspect-ratio: 1 / 1;
          background: none;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.2);
          padding: 0;
          display: grid;
          place-items: center;
        }
        button#rate {
          grid-area: rate;
        }
        button#back {
          grid-area: back;
        }
        button#play {
          grid-area: play;
        }
        button#forward {
          grid-area: forward;
        }
      `
        ];
      }
      constructor() {
        super();
        this._audioRef = e6();
        this._playRef = e6();
        this.currentTime = "00:00";
        this.maxDuration = "00:00";
        this.playbackRate = 1;
      }
      updated(changedProperties) {
        if (changedProperties.has("playbackRate") || changedProperties.has("url")) {
          this._audioRef.value.playbackRate = this.playbackRate;
        }
        if (changedProperties.has("url")) {
          let path = 'path("M 0 0 L 0 100 L 100 100 L 100 0';
          for (let rectIndex = 0; rectIndex < 100 / PX_BETWEEN_RECTANGLES; rectIndex++) {
            const amplitude = Math.floor(Math.random() * 25) + 15;
            path += ` M ${rectIndex * (PX_BETWEEN_RECTANGLES + PX_BETWEEN_RECTANGLES / 100)} ${amplitude} l ${PX_BETWEEN_RECTANGLES / 2} 0 l 0 ${100 - 2 * amplitude} l -${PX_BETWEEN_RECTANGLES / 2} 0 `;
          }
          path += 'Z")';
          this.shadowRoot.querySelector("path").setAttribute("style", `d: ${path}`);
          this._setupMediaSession();
        }
        if (changedProperties.has("audioTime")) {
          this.seekTo(this.audioTime);
        }
        if (changedProperties.has("playbackRate") || changedProperties.has("audioDuration") || changedProperties.has("audioCurrentTime")) {
          navigator.mediaSession.setPositionState({
            duration: (this.audioDuration ?? this._audioRef.value?.duration) || 100,
            playbackRate: this.playbackRate ?? this._audioRef.value.playbackRate ?? 1,
            position: this.audioCurrentTime ?? this._audioRef.value.currentTime ?? 0
          });
        }
      }
      _setupMediaSession() {
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: this.title,
            artist: this.author,
            album: this.podcast ?? this.author,
            artwork: [
              {
                src: this.image,
                sizes: "198x198",
                type: "image/png"
              }
            ]
          });
          navigator.mediaSession.setActionHandler("play", () => {
            this._audioRef.value.play();
          });
          navigator.mediaSession.setActionHandler("pause", () => {
            this._audioRef.value.pause();
          });
          navigator.mediaSession.setActionHandler("stop", () => {
            this._audioRef.value.stop();
          });
          navigator.mediaSession.setActionHandler("seekbackward", () => {
            this.seekTo(this._audioRef.value.currentTime - 10);
          });
          navigator.mediaSession.setActionHandler("seekforward", () => {
            this.seekTo(this._audioRef.value.currentTime + 10);
          });
          navigator.mediaSession.setActionHandler("seekto", () => {
          });
        }
      }
      handleDurationChange() {
        this.audioDuration = this._audioRef.value.duration;
        const maxDuration = qi.Duration.from({
          seconds: Math.floor(this._audioRef.value.duration)
        }).round({ largestUnit: "minutes" });
        this.maxDuration = `${`${maxDuration.minutes}`.padStart(2, "0").slice(-2)}:${`${maxDuration.seconds}`.padStart(2, "0").slice(-2)}`;
      }
      handleEnded() {
        this.playing = false;
        this.dispatchEvent(new Event("ended"));
      }
      handlePlay() {
        this.playing = true;
      }
      handlePause() {
        this.playing = false;
      }
      handlePlaybackRateChange() {
        this.playbackRate += 0.1;
        this.dispatchEvent(
          new CustomEvent("playbackrate-changed", {
            detail: { rate: this.playbackRate }
          })
        );
      }
      handleTimeUpdate() {
        this.audioCurrentTime = this._audioRef.value.currentTime;
        const currentTime = qi.Duration.from({
          seconds: Math.floor(this._audioRef.value.currentTime)
        }).round({ largestUnit: "minutes" });
        this.currentTime = `${`${currentTime.minutes}`.padStart(2, "0").slice(-2)}:${`${currentTime.seconds}`.padStart(2, "0").slice(-2)}`;
        this.dispatchEvent(
          new CustomEvent("time-updated", {
            detail: { time: this._audioRef.value.currentTime }
          })
        );
      }
      seekTo(time) {
        this._audioRef.value.currentTime = time;
      }
      toggleAudio() {
        if (this.playing) return this._audioRef.value.pause();
        this._audioRef.value.play();
      }
      render() {
        return b2`
      <h1>${this.title}</h1>
      <p>${this.author}</p>
      <progress
        min="0"
        max=${this._audioRef.value?.duration}
        value=${this._audioRef.value?.currentTime}
        @click=${(event) => this.seekTo(
          this._audioRef.value?.duration * event.offsetX / this.offsetWidth
        )}
      ></progress>
      <svg viewBox="0 0 100 100" id="progress-cover" preserveAspectRatio="none">
        <path></path>
      </svg>
      <p id="currentTime">${this.currentTime}</p>
      <p id="duration">${this.maxDuration}</p>
      <button id="rate" @click=${this.handlePlaybackRateChange}>
        ${`${this.playbackRate}`.slice(0, 3)}
      </button>
      <button
        id="back"
        @click=${() => this.seekTo(this._audioRef.value.currentTime - 10)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
            d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"
          />
        </svg>
      </button>
      <button id="play" @click=${this.toggleAudio}>
        <svg
          viewBox="0 -960 960 960"
          id="play"
          ${n9(this._playRef)}
          play-pause
          ?play=${!this.playing}
          ?pause=${this.playing}
        >
          <path></path>
        </svg>
      </button>
      <button
        id="forward"
        @click=${() => this.seekTo(this._audioRef.value.currentTime + 10)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
            d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"
          />
        </svg>
      </button>
      <audio
        ${n9(this._audioRef)}
        src=${this.url}
        crossorigin
        preload
        @play=${this.handlePlay}
        @pause=${this.handlePause}
        @durationchange=${this.handleDurationChange}
        @loadeddata=${this.handleDurationChange}
        @canplaythrough=${this.handleDurationChange}
        @timeupdate=${this.handleTimeUpdate}
        @ended=${this.handleEnded}
      ></audio>
    `;
      }
    };
    customElements.define("pod-audio", PodAudio);
  }
});

// src/index.js
init_api();
window.addEventListener("message", async (event) => {
  const { type } = event.data;
  if (type === "PODCAST_CACHE_UPDATE") {
    console.log("PODCAST_CACHE_UPDATE");
    const myPodcasts = document.querySelector("#my-podcasts pod-scroller");
    myPodcasts.items = podcasts;
  }
});
await navigator.serviceWorker.register("./service-worker.js", {
  type: "module"
});
var registration = await navigator.serviceWorker.ready;
await registration.update();
var firstInstall = false;
try {
  const incomingServiceWorker = registration.waiting ?? registration.installing;
  firstInstall = incomingServiceWorker && !registration.active;
  if (incomingServiceWorker) {
    incomingServiceWorker.addEventListener(
      "statechange",
      ({ target: { state } }) => {
        if (state === "installed")
          incomingServiceWorker.postMessage({ type: "SKIP_WAITING" });
      }
    );
  }
} catch (error) {
  console.warn(error);
}
registration.addEventListener("controllerchange", () => {
  if (firstInstall) return;
  window.location.reload();
});
Promise.all([
  fetchWithTimeout("https://oracle.mone.dev/podsurfer/").then((r7) => r7.json()).catch((err) => {
    console.warn("Failed fetching podcasts:", err);
    showToast("Offline mode: Using cached podcasts", true);
    return [];
  }),
  fetchWithTimeout("https://oracle.mone.dev/podsurfer/recent/").then((r7) => r7.json()).catch((err) => {
    console.warn("Failed fetching recent episodes:", err);
    return [];
  }),
  Promise.resolve().then(() => (init_storage(), storage_exports)),
  Promise.resolve().then(() => (init_pod_surfer(), pod_surfer_exports)),
  Promise.resolve().then(() => (init_pod_scroller(), pod_scroller_exports))
]).then(async ([podcasts2 = [], recents = [], { getCompleteEpisodes: getCompleteEpisodes2 }]) => {
  const completeEpisodes = await getCompleteEpisodes2();
  const myPodcasts = document.querySelector("#my-podcasts pod-scroller");
  myPodcasts.items = podcasts2;
  document.querySelector("#recently-released pod-scroller").items = recents.map(
    (recentEpisode) => ({
      ...recentEpisode,
      complete: completeEpisodes.find(
        (completeEpisode) => completeEpisode.title === recentEpisode.title
      )
    })
  );
  myPodcasts.addEventListener("podcast-select", async ({ podcast }) => {
    const [items] = await Promise.all([
      fetchWithTimeout(`https://oracle.mone.dev/podsurfer/episodes/${podcast.title}`).then((r7) => r7.json()).catch((err) => {
        console.warn("Failed fetching podcast episodes:", err);
        showToast("Offline mode: Limited episode data available", true);
        return podcast.items || [];
      }),
      Promise.resolve().then(() => (init_podcast_page(), podcast_page_exports)),
      Promise.resolve().then(() => (init_pod_list(), pod_list_exports))
    ]);
    const podcastPage = document.querySelector("podcast-page");
    podcastPage.podcast = { ...podcast, items };
    podcastPage.addEventListener(
      "podcast-close",
      () => {
        document.startViewTransition(async () => {
          const scrollerWithSelection = document.querySelector(
            "pod-list[has-last-selected], pod-scroller[has-last-selected]"
          );
          if (scrollerWithSelection) {
            await scrollerWithSelection.reselect();
          }
          document.querySelector("#body").toggleAttribute("hidden", false);
          podcastPage.toggleAttribute("hidden", true);
        });
      },
      { once: true }
    );
    document.startViewTransition(async () => {
      const scrollerWithSelection = document.querySelector(
        "pod-list[selected], pod-scroller[selected]"
      );
      if (scrollerWithSelection) {
        await scrollerWithSelection.deselect();
      }
      document.querySelector("#body").toggleAttribute("hidden", true);
      podcastPage.toggleAttribute("hidden", false);
    });
  });
});
Promise.all([Promise.resolve().then(() => (init_storage(), storage_exports)), Promise.resolve().then(() => (init_pod_list(), pod_list_exports))]).then(
  async ([{ getCompleteEpisodes: getCompleteEpisodes2, getInProgressEpisodes: getInProgressEpisodes2, setInProgressEpisodes: setInProgressEpisodes2, addCompleteEpisode: addCompleteEpisode2, getEpisodeTime: getEpisodeTime2 }]) => {
    const inProgressPodList = document.querySelector("#in-progress pod-list");
    const updateInProgress = async () => {
      const inProgressEpisodes = await getInProgressEpisodes2();
      const completeEpisodes = await getCompleteEpisodes2();
      const filteredEpisodes = inProgressEpisodes.filter((episode) => {
        return !completeEpisodes.some(
          (complete) => complete.title === episode.title
        );
      });
      inProgressPodList.items = await Promise.all(
        filteredEpisodes.map(async (episode) => ({
          ...episode,
          progress: await getEpisodeTime2(episode.title)
        }))
      );
    };
    updateInProgress();
    document.body.addEventListener("episode-select", async ({ episode }) => {
      await Promise.all([
        Promise.resolve().then(() => (init_episode_page(), episode_page_exports)),
        Promise.resolve().then(() => (init_pod_audio(), pod_audio_exports))
      ]);
      if (!inProgressPodList.items.some((ep) => ep.title === episode.title)) {
        await setInProgressEpisodes2([...inProgressPodList.cleanItems, episode]);
      }
      const episodePage = document.querySelector("episode-page");
      episodePage.episode = episode;
      await episodePage.updateComplete;
      document.startViewTransition(async () => {
        const scrollerWithSelection = document.querySelector(
          "pod-list[selected], pod-scroller[selected]"
        );
        if (scrollerWithSelection) {
          await scrollerWithSelection.deselect();
        }
        document.querySelector("#body").toggleAttribute("hidden", true);
        episodePage.toggleAttribute("hidden", false);
      });
    });
    document.body.addEventListener("episode-completed", async ({ episode }) => {
      inProgressPodList.items = inProgressPodList.items.filter(
        (ep) => ep.title !== episode.title
      );
      await setInProgressEpisodes2(inProgressPodList.items);
      await addCompleteEpisode2(episode);
      const recentlyReleasedScroller = document.querySelector(
        "#recently-released pod-scroller"
      );
      recentlyReleasedScroller.items = recentlyReleasedScroller.items.filter(
        (recentEpisode) => episode.title !== recentEpisode.title
      );
    });
    document.body.addEventListener("episode-close", () => {
      updateInProgress();
      const transition = document.startViewTransition(async () => {
        const scrollerWithSelection = document.querySelector(
          "pod-list[has-last-selected], pod-scroller[has-last-selected]"
        );
        if (scrollerWithSelection) {
          await scrollerWithSelection.reselect();
        }
        document.querySelector("#body").toggleAttribute("hidden", false);
        document.querySelector("episode-page").toggleAttribute("hidden", true);
      });
    });
  }
);
document.querySelector("#my-podcasts header button").addEventListener("click", () => {
  const dialog = document.querySelector("dialog#add-podcast");
  dialog.showModal();
  const dialogForm = dialog.querySelector("form");
  const handleSubmit = async (event) => {
    if (event.submitter && event.submitter.value === "cancel") return;
    const formData = new FormData(dialogForm);
    const url = formData.get("rss-feed");
    if (!url) return;
    try {
      await fetchWithTimeout("https://oracle.mone.dev/podsurfer/add", {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({ url })
      });
      showToast("Podcast feed added successfully!");
    } catch (err) {
      console.error("Failed adding podcast feed:", err);
      showToast("Failed to add podcast feed. Check connection.", true);
    }
  };
  dialogForm.addEventListener("submit", handleSubmit, { once: true });
});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/when.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/private-async-helpers.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/until.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
