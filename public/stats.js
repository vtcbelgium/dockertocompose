// OTHRYS optional first-party statistics — explicit opt-in, per-site.
// No visit request is sent until Accept is selected. DNT / GPC always win.
// Synced from OTHRYS workers/stats/client/stats.js (Themis).
(function () {
  "use strict";
  var KEY = "othrys-stats-consent-v1";
  var ENDPOINT = "https://stats.othrys.be/hit";
  var n = navigator;
  if (n.doNotTrack === "1" || n.globalPrivacyControl === true) return;
  if (/^(localhost|127\.)/.test(location.hostname)) return;

  var messages = {
    en: {
      heading: "Optional site statistics",
      body: "With your permission, this site counts page visits without analytics cookies. The statistics service derives a daily pseudonymous hash from IP address and browser information. A 90-day deletion schedule is configured.",
      allow: "Accept optional statistics",
      deny: "Reject optional statistics",
      settings: "Privacy choices",
      policy: "Privacy information"
    },
    nl: {
      heading: "Optionele bezoekersstatistieken",
      body: "Met je toestemming telt deze site paginabezoeken zonder analytische cookies. De statistiekendienst leidt een dagelijks pseudoniem kenmerk af van IP-adres en browsergegevens. Verwijdering na 90 dagen is geconfigureerd.",
      allow: "Optionele statistieken toestaan",
      deny: "Optionele statistieken weigeren",
      settings: "Privacykeuzes",
      policy: "Privacyinformatie"
    },
    fr: {
      heading: "Statistiques de visite facultatives",
      body: "Avec votre accord, ce site compte les visites sans cookies analytiques. Le service crée un identifiant pseudonyme quotidien à partir de l'adresse IP et des informations du navigateur. Une suppression après 90 jours est configurée.",
      allow: "Accepter les statistiques facultatives",
      deny: "Refuser les statistiques facultatives",
      settings: "Choix de confidentialité",
      policy: "Confidentialité"
    }
  };
  var locale = (document.documentElement.lang || "en").toLowerCase().slice(0, 2);
  var t = messages[locale] || messages.en;
  var choice = "";
  try {
    choice = localStorage.getItem(KEY) || "";
  } catch (_) { /* Restrictive storage settings: ask every visit. */ }

  function save(value) {
    choice = value;
    try { localStorage.setItem(KEY, value); } catch (_) { /* Session only. */ }
  }
  function ping() {
    if (choice !== "accepted") return;
    try {
      fetch(ENDPOINT, {
        method: "POST", mode: "no-cors", keepalive: true,
        body: JSON.stringify({ path: location.pathname, consent: "accepted" })
      }).catch(function () {});
    } catch (_) { /* Statistics never block tools. */ }
  }
  function mount() {
    if (!document.body || document.getElementById("othrys-stats-consent")) return;
    var host = document.createElement("div");
    host.id = "othrys-stats-consent";
    document.body.appendChild(host);
    var shadow = host.attachShadow({ mode: "open" });
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "/stats-consent.css";
    shadow.appendChild(css);
    var area = document.createElement("section");
    area.setAttribute("role", "region");
    area.setAttribute("aria-label", t.heading);
    shadow.appendChild(area);
    function button(label, callback) {
      var item = document.createElement("button");
      item.type = "button";
      item.textContent = label;
      item.addEventListener("click", callback);
      return item;
    }
    function draw(open) {
      area.textContent = "";
      area.className = "othrys-stats-panel" + (open ? "" : " othrys-stats-compact");
      if (!open) {
        area.appendChild(button(t.settings, function () { draw(true); }));
        return;
      }
      var heading = document.createElement("strong");
      heading.textContent = t.heading;
      area.appendChild(heading);
      var description = document.createElement("p");
      description.textContent = t.body;
      area.appendChild(description);
      var actions = document.createElement("div");
      actions.className = "othrys-stats-actions";
      actions.appendChild(button(t.deny, function () {
        save("rejected");
        draw(false);
      }));
      actions.appendChild(button(t.allow, function () {
        save("accepted");
        draw(false);
        ping();
      }));
      area.appendChild(actions);
      var link = document.createElement("a");
      link.href = "https://othrys.be/legal/privacy";
      link.textContent = t.policy;
      area.appendChild(link);
    }
    draw(choice !== "accepted" && choice !== "rejected");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
  if (choice === "accepted") ping();
})();
