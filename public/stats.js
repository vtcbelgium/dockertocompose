// OTHRYS cookieless page-view ping; server retains a daily pseudonymous visitor hash.
// No URL fragments or query strings are transmitted. No utility inputs are sent by this script.
// Respects Do Not Track / Global Privacy Control. Source: github.com/vtcbelgium/OTHRYS workers/stats
(function () {
  try {
    var n = navigator;
    if (n.doNotTrack === "1" || n.globalPrivacyControl === true) return;
    if (/^(localhost|127\.)/.test(location.hostname)) return;
    function ping() {
      fetch("https://stats.othrys.be/hit", {
        method: "POST", mode: "no-cors", keepalive: true,
        body: JSON.stringify({ path: location.pathname })
      }).catch(function () {});
    }
    ping();
  } catch (e) { /* analytics must never break the page */ }
})();
