(function() {
  if (window.__othrys_fleet_nav_loaded) return;
  window.__othrys_fleet_nav_loaded = true;

  const currentSite = "dockertocompose";
  const registry = [{"id": "cronexplainer", "name": "CronExplainer", "category": "DevOps & Time", "desc": "Translate POSIX & AWS cron expressions to plain English with next run dates", "url": "https://cronexplainer.othrys.be/"}, {"id": "dockertocompose", "name": "DockerToCompose", "category": "Containers & Cloud", "desc": "Convert CLI docker run commands to clean compose.yaml files", "url": "https://dockertocompose.othrys.be/"}, {"id": "jsonfix", "name": "JSONFix", "category": "Data & Code", "desc": "Format, validate, repair trailing commas and export JSON to CSV", "url": "https://jsonfix.othrys.be/"}, {"id": "csvtojson", "name": "CSVtoJSON", "category": "Data & Code", "desc": "Convert RFC 4180 CSV, TSV and semicolon files into clean JSON arrays", "url": "https://csvtojson.othrys.be/"}, {"id": "sqlformat", "name": "SQLFormat", "category": "Database & Query", "desc": "Format and beautify PostgreSQL, MySQL and SQLite queries locally", "url": "https://sqlformat.othrys.be/"}, {"id": "regex", "name": "RegexTester", "category": "Text & Parsing", "desc": "Real-time regular expression debugger, capture groups and code snippets", "url": "https://regex.othrys.be/"}, {"id": "jwt", "name": "JWTDebugger", "category": "Security & Tokens", "desc": "Offline JWT token decoder, claims inspector and expiry calculator", "url": "https://jwt.othrys.be/"}, {"id": "base64", "name": "Base64Tool", "category": "Security & Encoding", "desc": "Encode and decode standard RFC 4648 Base64, Base64URL and Data URIs", "url": "https://base64.othrys.be/"}, {"id": "hashchecker", "name": "HashChecker", "category": "Security & Crypto", "desc": "Hardware-accelerated WebCrypto SHA-256 and SHA-512 checksum verifier", "url": "https://hashchecker.othrys.be/"}, {"id": "uuidgen", "name": "UUIDGen", "category": "Identifiers & Database", "desc": "Generate RFC 9562 UUIDv4, time-ordered UUIDv7 and ULID monotonic IDs", "url": "https://uuidgen.othrys.be/"}, {"id": "webptopng", "name": "WebPtoPNG", "category": "Images & Assets", "desc": "Lossless WebP to PNG and JPG converter with zero file size limits", "url": "https://webptopng.othrys.be/"}, {"id": "favicon", "name": "FaviconGen", "category": "Images & Assets", "desc": "Generate multi-size favicon.ico, Apple touch icons and PWA manifests", "url": "https://favicon.othrys.be/"}, {"id": "freeqr", "name": "FreeQR", "category": "Generators & Mobile", "desc": "Generate permanent, static QR codes that never expire with zero redirects", "url": "https://freeqr.othrys.be/"}, {"id": "shrinkmyphoto", "name": "ShrinkMyPhoto", "category": "Images & Assets", "desc": "Compress photos to exact 20KB, 50KB or 100KB limits on-device", "url": "https://shrinkmyphoto.othrys.be/"}, {"id": "wordcounter", "name": "WordCounter", "category": "Text & Writing", "desc": "Count words, characters, sentences and calculate spoken & reading duration", "url": "https://wordcounter.othrys.be/"}, {"id": "quickpercent", "name": "QuickPercent", "category": "Math & Finance", "desc": "Calculate percentage change, margin vs markup, VAT and discounts", "url": "https://quickpercent.othrys.be/"}, {"id": "fillthispdf", "name": "FillThisPDF", "category": "PDF & Documents", "desc": "Fill, sign and annotate PDF forms with WebAssembly and zero watermarks", "url": "https://fillthispdf.othrys.be/"}, {"id": "unixtime", "name": "UnixTime", "category": "DevOps & Time", "desc": "Epoch timestamp converter, millisecond auto-detection and code snippets", "url": "https://unixtime.othrys.be/"}, {"id": "worldtime", "name": "WorldTime", "category": "DevOps & Time", "desc": "World clock, DST-accurate time zone converter and global meeting planner", "url": "https://worldtime.othrys.be/"}, {"id": "vtc", "name": "VintageToyCollector", "category": "Collectibles & Database", "desc": "Vintage action figure archives, condition grading and price guides", "url": "https://vintagetoycollector.com/"}];

  // 1. Inject Styles
  const style = document.createElement('style');
  style.textContent = `
    .othrys-top-bar {
      position: sticky;
      top: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 14px;
      font: 13px/1.4 system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #94a3b8;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .othrys-top-bar a {
      color: #cbd5e1;
      text-decoration: none;
      font-weight: 500;
    }
    .othrys-top-bar a:hover {
      color: #38bdf8;
    }
    .othrys-spotlight-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 6px;
      color: #e2e8f0;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: background 0.15s;
    }
    .othrys-spotlight-btn:hover {
      background: rgba(255,255,255,0.16);
    }
    .othrys-modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 100000;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      align-items: flex-start;
      justify-content: center;
      padding-top: 10vh;
    }
    .othrys-modal {
      background: #0f172a;
      color: #f1f5f9;
      width: 90%;
      max-width: 620px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.15);
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      overflow: hidden;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .othrys-search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 16px 20px;
      font-size: 16px;
      background: #1e293b;
      border: none;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      color: #fff;
      outline: none;
    }
    .othrys-tool-list {
      max-height: 55vh;
      overflow-y: auto;
      margin: 0;
      padding: 8px;
      list-style: none;
    }
    .othrys-tool-item {
      padding: 10px 14px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 3px;
      transition: background 0.1s;
    }
    .othrys-tool-item:hover, .othrys-tool-item.selected {
      background: #334155;
    }
    .othrys-tool-item a {
      color: #38bdf8;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
    }
    .othrys-tool-desc {
      color: #94a3b8;
      font-size: 12px;
    }
    .othrys-badge-cat {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
    }
  `;
  document.head.appendChild(style);

  // 2. Inject Top Banner
  const banner = document.createElement('div');
  banner.className = 'othrys-top-bar';
  banner.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="font-weight:700;letter-spacing:0.5px;color:#f8fafc;">OTHRYS FLEET</span>
      <span style="color:#475569;">|</span>
      <span>100% Private Client-Side Micro-Utilities</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;">
      <button class="othrys-spotlight-btn" id="othrys-open-cmd" title="Jump to any tool (⌘K or /)">
        <span>⌘K Spotlight</span>
        <kbd style="font-size:10px;padding:2px 4px;background:rgba(0,0,0,0.3);border-radius:3px;">Cmd+K</kbd>
      </button>
    </div>
  `;
  document.body.prepend(banner);

  // 3. Inject Modal
  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'othrys-modal-backdrop';
  modalBackdrop.innerHTML = `
    <div class="othrys-modal" role="dialog" aria-modal="true">
      <input type="text" class="othrys-search-input" placeholder="Type to search 20 sovereign tools... (Esc to close)" autofocus />
      <ul class="othrys-tool-list"></ul>
      <div style="padding:10px 16px;background:#1e293b;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;font-size:11px;color:#64748b;">
        <span>↑↓ Navigate • Enter Open • Esc Close</span>
        <span>Zero Server Telemetry</span>
      </div>
    </div>
  `;
  document.body.appendChild(modalBackdrop);

  const searchInput = modalBackdrop.querySelector('.othrys-search-input');
  const toolList = modalBackdrop.querySelector('.othrys-tool-list');

  function renderList(query) {
    const q = (query || '').toLowerCase().trim();
    const filtered = registry.filter(function(item) {
      return item.name.toLowerCase().includes(q) ||
             item.desc.toLowerCase().includes(q) ||
             item.category.toLowerCase().includes(q);
    });

    toolList.innerHTML = filtered.map(function(item) {
      var isCur = item.id === currentSite;
      return '<li class="othrys-tool-item" data-url="' + item.url + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<a href="' + item.url + '">' + item.name + (isCur ? ' <span style="color:#a855f7;font-size:11px;">(Current)</span>' : '') + '</a>' +
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
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openModal();
    }
  });

  searchInput.addEventListener('input', function(e) {
    renderList(e.target.value);
  });
})();
