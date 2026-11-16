/* iletisim-kartlari-2 — İletişim Karoları (Bento) (1 Kas 2026, T1-B varyant).
   Yer tutucular: ik2head ik2tiles ik2empty ik2adresvar. phone/email boşsa webmakerdata.setting.phone/email; adres varsa mapsUrl yoksa Google Maps arama bağlantısı üretilir (gömme yok).
   Ortak yardımcılar: esc t guvenliHref gorselYol evet sayi metinleriYaz (desing metinleri kaçışlı). */
var D = json.desing || {};
var L = json.lang || "tr";

/* HTML kaçışı — html'e giden her değer bundan geçer */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* Dil seçimi: aktif dil → tr → en → ilk anahtar (motorun wmPickLang'i) */
function t(v) { return wmPickLang(v, L); }
/* Bağlantı: dış/mailto/tel/# aynen; iç sayfa adı → dil önekli yol; javascript: vb. reddedilir */
function guvenliHref(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|file|data):/i.test(s)) { return ""; }
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s) || s.charAt(0) === "/") { return s; }
  return wxLangInternalHref(s);
}
/* Görsel yolu: "/" ve http(s) aynen; yalın ad → /img/<ad>; tehlikeli şema → "" */
function gorselYol(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|file|data):/i.test(s)) { return ""; }
  if (s.charAt(0) === "/" || /^https?:\/\//i.test(s)) { return s; }
  return "/img/" + s;
}
function evet(v, d) {
  if (v === undefined || v === null || v === "") { return d; }
  return !(v === false || v === "false" || v === 0 || v === "0");
}
function sayi(v, d, mn, mx) {
  var n = parseInt(v, 10);
  if (!isFinite(n)) { n = d; }
  return Math.min(mx, Math.max(mn, n));
}
/* desing'deki düz metin / {tr,en,ar} değerlerini {{anahtar}} yerine KAÇIŞLI yazar.
   Motor aynı yer tutucuyu ham yazardı; back.js önce davrandığı için kaçışsız değer html'e ulaşmaz. */
function metinleriYaz() {
  var k;
  for (k in D) {
    if (!Object.prototype.hasOwnProperty.call(D, k)) { continue; }
    var v = D[k];
    if (v == null) { continue; }
    var dilli = typeof v === "object" && !Array.isArray(v) && (typeof v.tr === "string" || typeof v.en === "string");
    if (typeof v === "object" && !dilli) { continue; }
    var deger = esc(t(v));
    var desen = new RegExp("\\{\\{" + String(k).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\}\\}", "g");
    html = html.replace(desen, function () { return deger; });
  }
}

var ik2Set = (webmakerdata && webmakerdata.setting) || {};
var ik2Phone = t(D.phone).trim() || (typeof ik2Set.phone === "string" ? ik2Set.phone.trim() : "");
var ik2Email = t(D.email).trim() || (typeof ik2Set.email === "string" ? ik2Set.email.trim() : "");
var ik2Wa = String(D.whatsapp || "").replace(/\D/g, "");
var ik2Adres = t(D.address).trim();
var ik2Saat = t(D.hours).trim();
var ik2Maps = guvenliHref(D.mapsUrl);
if (!ik2Maps && ik2Adres) { ik2Maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ik2Adres); }
var ik2Yeni = t(D.newTab);

function ik2Ikon(ad) { return '<span class="modulex-ik2-ikon" aria-hidden="true"><span class="material-symbols-outlined">' + ad + "</span></span>"; }

var ik2Tiles = "";
if (ik2Adres) {
  ik2Tiles += '<li class="modulex-ik2-tile modulex-ik2-adres">' + ik2Ikon("location_on") +
    '<h3 class="modulex-ik2-h">' + esc(t(D.addressTitle)) + "</h3>" +
    '<p class="modulex-ik2-adresmetin">' + esc(ik2Adres) + "</p>" +
    (ik2Maps ? '<a class="modulex-ik2-btn" href="' + esc(ik2Maps) + '" target="_blank" rel="noopener noreferrer">' + esc(t(D.mapBtn)) +
      '<span class="modulex-ik2-sr"> (' + esc(ik2Yeni) + ')</span><span class="material-symbols-outlined" aria-hidden="true">north_east</span></a>' : "") + "</li>";
}
if (ik2Phone) {
  ik2Tiles += '<li class="modulex-ik2-tile modulex-ik2-tel">' + ik2Ikon("call") +
    '<h3 class="modulex-ik2-h">' + esc(t(D.callTitle)) + "</h3>" +
    '<a class="modulex-ik2-deger" dir="ltr" href="tel:' + esc(ik2Phone.replace(/[^+\d]/g, "")) + '">' + esc(ik2Phone) + "</a></li>";
}
if (ik2Email) {
  ik2Tiles += '<li class="modulex-ik2-tile modulex-ik2-mail">' + ik2Ikon("mail") +
    '<h3 class="modulex-ik2-h">' + esc(t(D.mailTitle)) + "</h3>" +
    '<a class="modulex-ik2-deger modulex-ik2-kirp" dir="ltr" href="mailto:' + esc(ik2Email) + '">' + esc(ik2Email) + "</a></li>";
}
if (ik2Wa) {
  ik2Tiles += '<li class="modulex-ik2-tile modulex-ik2-wa">' + ik2Ikon("chat") +
    '<h3 class="modulex-ik2-h">' + esc(t(D.waTitle)) + "</h3>" +
    '<a class="modulex-ik2-deger" href="https://wa.me/' + esc(ik2Wa) + '" target="_blank" rel="noopener noreferrer">' + esc(t(D.waBtn)) +
    '<span class="modulex-ik2-sr"> (' + esc(ik2Yeni) + ")</span></a></li>";
}
if (ik2Saat) {
  ik2Tiles += '<li class="modulex-ik2-tile modulex-ik2-saat">' + ik2Ikon("schedule") +
    '<h3 class="modulex-ik2-h">' + esc(t(D.hoursTitle)) + "</h3>" +
    '<p class="modulex-ik2-saatmetin">' + esc(ik2Saat) + "</p></li>";
}
var ik2Empty = ik2Tiles ? "" : '<p class="modulex-ik2-bos">' + esc(t(D.emptyText)) + "</p>";

var ik2Head = (t(D.title) || t(D.description))
  ? '<header class="modulex-ik2-head">' + (t(D.title) ? '<h2 class="modulex-ik2-title">' + esc(t(D.title)) + "</h2>" : "") +
    (t(D.description) ? '<p class="modulex-ik2-desc">' + esc(t(D.description)) + "</p>" : "") + "</header>"
  : "";

html = html.replace(/\{\{ik2head\}\}/g, function () { return ik2Head; });
html = html.replace(/\{\{ik2tiles\}\}/g, function () { return ik2Tiles; });
html = html.replace(/\{\{ik2empty\}\}/g, function () { return ik2Empty; });
html = html.replace(/\{\{ik2adresvar\}\}/g, function () { return ik2Adres ? " modulex-ik2-adresli" : ""; });
metinleriYaz();
