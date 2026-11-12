(function() {
  if (window.__othrys_fleet_nav_loaded) return;
  window.__othrys_fleet_nav_loaded = true;

  var currentSite = "dockertocompose";
  var registry = [
    {"id": "cronexplainer", "name": "CronExplainer", "category": "DevOps & Time", "desc": "Translate POSIX & AWS cron expressions to plain English with next run dates", "url": "https://cronexplainer.othrys.be/"},
    {"id": "dockertocompose", "name": "DockerToCompose", "category": "Containers & Cloud", "desc": "Convert CLI docker run commands to clean compose.yaml files", "url": "https://dockertocompose.othrys.be/"},
    {"id": "jsonfix", "name": "JSONFix", "category": "Data & Code", "desc": "Format, validate, repair trailing commas and export JSON", "url": "https://jsonfix.othrys.be/"},
    {"id": "csvtojson", "name": "CSVtoJSON", "category": "Data & Code", "desc": "Convert RFC 4180 CSV, TSV and semicolon files into clean JSON arrays", "url": "https://csvtojson.othrys.be/"},
    {"id": "sqlformat", "name": "SQLFormat", "category": "Database & Query", "desc": "Format and beautify PostgreSQL, MySQL and SQLite queries locally", "url": "https://sqlformat.othrys.be/"},
    {"id": "regex", "name": "RegexTester", "category": "Text & Parsing", "desc": "Real-time regular expression debugger, capture groups and code snippets", "url": "https://regex.othrys.be/"},
    {"id": "jwt", "name": "JWTDebugger", "category": "Security & Tokens", "desc": "Offline JWT token decoder, claims inspector and expiry calculator", "url": "https://jwt.othrys.be/"},
    {"id": "base64", "name": "Base64Tool", "category": "Security & Encoding", "desc": "Encode and decode standard RFC 4648 Base64, Base64URL and Data URIs", "url": "https://base64.othrys.be/"},
    {"id": "hashchecker", "name": "HashChecker", "category": "Security & Crypto", "desc": "Hardware-accelerated WebCrypto SHA-256 and SHA-512 checksum verifier", "url": "https://hashchecker.othrys.be/"},
    {"id": "uuidgen", "name": "UUIDGen", "category": "Identifiers & Database", "desc": "Generate RFC 9562 UUIDv4, time-ordered UUIDv7 and ULID monotonic IDs", "url": "https://uuidgen.othrys.be/"},
    {"id": "webptopng", "name": "WebPtoPNG", "category": "Images & Assets", "desc": "Lossless WebP to PNG and JPG converter with zero file size limits", "url": "https://webptopng.othrys.be/"},
    {"id": "favicon", "name": "FaviconGen", "category": "Images & Assets", "desc": "Generate multi-size favicon.ico, Apple touch icons and PWA manifests", "url": "https://favicon.othrys.be/"},
    {"id": "freeqr", "name": "FreeQR", "category": "Generators & Mobile", "desc": "Generate permanent, static QR codes that never expire with zero redirects", "url": "https://freeqr.othrys.be/"},
    {"id": "shrinkmyphoto", "name": "ShrinkMyPhoto", "category": "Images & Assets", "desc": "Compress photos to exact 20KB, 50KB or 100KB limits on-device", "url": "https://shrinkmyphoto.othrys.be/"},
    {"id": "wordcounter", "name": "WordCounter", "category": "Text & Writing", "desc": "Count words, characters, sentences and calculate spoken & reading duration", "url": "https://wordcounter.othrys.be/"},
    {"id": "quickpercent", "name": "QuickPercent", "category": "Math & Finance", "desc": "Calculate percentage change, margin vs markup, VAT and discounts", "url": "https://quickpercent.othrys.be/"},
    {"id": "fillthispdf", "name": "FillThisPDF", "category": "PDF & Documents", "desc": "Fill, sign and annotate PDF forms in-browser with zero watermarks", "url": "https://fillthispdf.othrys.be/"},
    {"id": "unixtime", "name": "UnixTime", "category": "DevOps & Time", "desc": "Epoch timestamp converter, millisecond auto-detection and code snippets", "url": "https://unixtime.othrys.be/"},
    {"id": "worldtime", "name": "WorldTime", "category": "DevOps & Time", "desc": "World clock, DST-accurate time zone converter and global map", "url": "https://worldtime.othrys.be/"},
    {"id": "othrys", "name": "OTHRYS Hub", "category": "Index", "desc": "Complete directory of client-side browser utilities and local security tools", "url": "https://othrys.be/"}
  ];

  var style = document.createElement('style');
  style.textContent = [
    '.othrys-top-bar{position:sticky;top:0;z-index:99999;display:flex;align-items:center;justify-content:space-between;height:34px;padding:0 16px;font:500 12px/1 -apple-system,BlinkMacSystemFont,"Inter","Segoe UI",system-ui,sans-serif;background:rgba(9,11,16,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#939eab;border-bottom:1px solid rgba(255,255,255,0.08);}',
    '.othrys-top-brand{display:inline-flex;align-items:center;gap:8px;color:#f3f5f8;text-decoration:none;font-weight:600;font-size:11.5px;letter-spacing:0.08em;text-transform:uppercase;}',
    '.othrys-top-brand:hover{color:#ffffff;}',
    '.othrys-top-sep{color:rgba(255,255,255,0.16);margin:0 2px;}',
    '.othrys-top-note{color:#788598;font-size:11.5px;letter-spacing:-0.005em;}',
    '@media(max-width:600px){.othrys-top-note,.othrys-top-sep{display:none;}}',
    '.othrys-spotlight-btn{display:inline-flex;align-items:center;gap:7px;height:22px;padding:0 8px;background:#141a24;border:1px solid rgba(255,255,255,0.11);border-radius:5px;color:#cbd5e1;cursor:pointer;font:500 11.5px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;transition:border-color 0.14s,color 0.14s,background 0.14s;}',
    '.othrys-spotlight-btn:hover{background:#1a2230;border-color:rgba(255,255,255,0.24);color:#f3f5f8;}',
    '.othrys-spotlight-btn kbd{font:500 10px/1 ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;color:#939eab;padding:2px 4px;background:#090b10;border:1px solid rgba(255,255,255,0.09);border-radius:3px;}',
    '.othrys-modal-backdrop{display:none;position:fixed;inset:0;z-index:100000;background:rgba(4,6,10,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:flex-start;justify-content:center;padding:10vh 16px 24px;}',
    '.othrys-modal{background:#0e121a;color:#f3f5f8;width:100%;max-width:580px;border-radius:10px;border:1px solid rgba(255,255,255,0.14);box-shadow:0 24px 64px rgba(0,0,0,0.68),inset 0 1px 0 rgba(255,255,255,0.05);overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",system-ui,sans-serif;}',
    '.othrys-search-input{width:100%;box-sizing:border-box;padding:14px 18px;font:400 14.5px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;background:#090b10;border:none;border-bottom:1px solid rgba(255,255,255,0.09);color:#f3f5f8;outline:none;}',
    '.othrys-search-input::placeholder{color:#687486;}',
    '.othrys-tool-list{max-height:54vh;overflow-y:auto;margin:0;padding:6px;list-style:none;}',
    '.othrys-tool-item{padding:9px 12px;border-radius:6px;cursor:pointer;display:flex;flex-direction:column;gap:3px;border:1px solid transparent;transition:background 0.1s,border-color 0.1s;}',
    '.othrys-tool-item:hover,.othrys-tool-item.selected{background:#141a24;border-color:rgba(255,255,255,0.09);}',
    '.othrys-tool-item a{color:#f3f5f8;font-weight:600;font-size:13.5px;letter-spacing:-0.01em;text-decoration:none;display:inline-flex;align-items:center;gap:7px;}',
    '.othrys-cur-pill{font:500 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:#939eab;padding:2px 5px;border-radius:4px;background:#090b10;border:1px solid rgba(255,255,255,0.1);text-transform:uppercase;letter-spacing:0.05em;}',
    '.othrys-tool-desc{color:#939eab;font-size:12px;line-height:1.45;}',
    '.othrys-badge-cat{font:500 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase;letter-spacing:0.06em;color:#6e7b8b;}',
    '.othrys-modal-foot{padding:9px 14px;background:#090b10;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;font:500 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:#6e7b8b;}',
    '.othrys-next-recommendation{margin:28px auto !important;max-width:760px !important;padding:12px 16px !important;background:#0e121a !important;border:1px solid rgba(255,255,255,0.1) !important;border-radius:8px !important;box-shadow:inset 0 1px 0 rgba(255,255,255,0.04) !important;color:#f3f5f8 !important;}',
    '.othrys-next-recommendation span{color:#939eab !important;}',
    '.othrys-next-recommendation span:first-child{color:#cbd5e1 !important;font-family:ui-monospace,SFMono-Regular,Menlo,monospace !important;letter-spacing:0.06em !important;}',
    '.othrys-next-recommendation a{background:#f3f5f8 !important;color:#090b10 !important;border-radius:6px !important;font-weight:600 !important;padding:6px 12px !important;border:1px solid #f3f5f8 !important;}',
    '.othrys-next-recommendation a span{color:#090b10 !important;}',
    '#othrys-embed-modal > div{background:#0e121a !important;color:#f3f5f8 !important;border:1px solid rgba(255,255,255,0.14) !important;border-radius:10px !important;box-shadow:0 24px 64px rgba(0,0,0,0.68),inset 0 1px 0 rgba(255,255,255,0.05) !important;}',
    '#othrys-embed-modal h3{color:#f3f5f8 !important;letter-spacing:-0.02em !important;}',
    '#othrys-embed-modal textarea{background:#090b10 !important;border:1px solid rgba(255,255,255,0.12) !important;border-radius:6px !important;color:#cbd5e1 !important;}',
    '#othrys-embed-modal button[onclick*="clipboard"]{background:#f3f5f8 !important;color:#090b10 !important;border-radius:6px !important;font-weight:600 !important;}',
    'button[onclick*="openOthrysEmbed"]{background:#141a24 !important;color:#cbd5e1 !important;border:1px solid rgba(255,255,255,0.12) !important;border-radius:6px !important;font:500 11.5px/1 ui-monospace,SFMono-Regular,Menlo,monospace !important;padding:7px 12px !important;}'
  ].join('\n');
  document.head.appendChild(style);

  var banner = document.createElement('div');
  banner.className = 'othrys-top-bar';
  banner.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;">' +
      '<a class="othrys-top-brand" href="https://othrys.be/" title="OTHRYS utility index"><svg width="16" height="16" viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="32" r="27" stroke="#cbd5e1" stroke-width="2.4" stroke-opacity="0.88"/><path d="M25 6.5 32 2.5l7 4M25 57.5 32 61.5l7-4" stroke="#e2e8f0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 44 22 30l4 4.4L32 18.5l8.3 13.5 3.5-4 7.2 16" stroke="#f3f5f8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 18.5V29l-8 11-4 6" stroke="#38bdf8" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.2 27v7l5.4 5.4h5" stroke="#22d3ee" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="18.5" r="4" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/></svg><span>OTHRYS</span></a>' +
      '<span class="othrys-top-sep">/</span>' +
      '<span class="othrys-top-note">Client-side browser utilities · Zero cookies</span>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:8px;">' +
      '<button class="othrys-spotlight-btn" id="othrys-open-cmd" type="button" title="Jump to any utility (Cmd+K or /)">' +
        '<span>Tools</span>' +
        '<kbd>⌘K</kbd>' +
      '</button>' +
    '</div>';
  document.body.prepend(banner);

  var modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'othrys-modal-backdrop';
  modalBackdrop.innerHTML =
    '<div class="othrys-modal" role="dialog" aria-modal="true" aria-label="Switch OTHRYS utility">' +
      '<input type="text" class="othrys-search-input" placeholder="Jump to any OTHRYS utility… (Esc to close)" />' +
      '<ul class="othrys-tool-list"></ul>' +
      '<div class="othrys-modal-foot">' +
        '<span>↑↓ Navigate · Enter Open · Esc Close</span>' +
        '<span>19 utilities · local execution</span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modalBackdrop);

  var searchInput = modalBackdrop.querySelector('.othrys-search-input');
  var toolList = modalBackdrop.querySelector('.othrys-tool-list');
  var activeIdx = 0;

  function renderList(query) {
    var q = (query || '').toLowerCase().trim();
    var filtered = registry.filter(function(item) {
      return item.name.toLowerCase().includes(q) ||
             item.desc.toLowerCase().includes(q) ||
             item.category.toLowerCase().includes(q);
    });
    activeIdx = 0;
    toolList.innerHTML = filtered.map(function(item, idx) {
      var isCur = item.id === currentSite;
      return '<li class="othrys-tool-item' + (idx === 0 ? ' selected' : '') + '" data-url="' + item.url + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">' +
          '<a href="' + item.url + '">' + item.name + (isCur ? '<span class="othrys-cur-pill">Current</span>' : '') + '</a>' +
          '<span class="othrys-badge-cat">' + item.category + '</span>' +
        '</div>' +
        '<div class="othrys-tool-desc">' + item.desc + '</div>' +
      '</li>';
    }).join('');

    toolList.querySelectorAll('.othrys-tool-item').forEach(function(el) {
      el.addEventListener('click', function() {
        window.location.href = el.dataset.url;
      });
    });
  }

  function openModal() {
    modalBackdrop.style.display = 'flex';
    searchInput.value = '';
    renderList('');
    searchInput.focus();
  }

  function closeModal() {
    modalBackdrop.style.display = 'none';
  }

  document.getElementById('othrys-open-cmd').addEventListener('click', openModal);
  modalBackdrop.addEventListener('click', function(e) {
    if (e.target === modalBackdrop) closeModal();
  });

  window.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modalBackdrop.style.display === 'flex' ? closeModal() : openModal();
    } else if (e.key === 'Escape' && modalBackdrop.style.display === 'flex') {
      closeModal();
    } else if (modalBackdrop.style.display === 'flex' && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      var items = toolList.querySelectorAll('.othrys-tool-item');
      if (!items.length) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        var sel = items[activeIdx] || items[0];
        if (sel && sel.dataset.url) window.location.href = sel.dataset.url;
        return;
      }
      e.preventDefault();
      items[activeIdx] && items[activeIdx].classList.remove('selected');
      activeIdx = e.key === 'ArrowDown' ? (activeIdx + 1) % items.length : (activeIdx - 1 + items.length) % items.length;
      items[activeIdx].classList.add('selected');
      items[activeIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === '/' && document.activeElement && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && !document.activeElement.isContentEditable) {
      e.preventDefault();
      openModal();
    }
  });

  searchInput.addEventListener('input', function(e) {
    renderList(e.target.value);
  });
})();
