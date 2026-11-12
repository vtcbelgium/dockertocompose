// OTHRYS anonymous, cookieless page-view ping. No cookies, no storage, no IP stored.
// Respects Do Not Track / Global Privacy Control. Source: github.com/vtcbelgium/OTHRYS workers/stats
(function () {
  try {
    var n = navigator;
    if (n.doNotTrack === "1" || n.globalPrivacyControl === true) return;
    if (/^(localhost|127\.)/.test(location.hostname)) return;
    function ping() {
      fetch("https://stats.othrys.be/hit", {
        method: "POST", mode: "no-cors", keepalive: true,
        body: JSON.stringify({ path: location.pathname + location.hash })
      }).catch(function () {});
    }
    ping();
    addEventListener("hashchange", ping);
  } catch (e) { /* analytics must never break the page */ }
})();
