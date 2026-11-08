// src/main.ts
import { processInput } from './tool';
import { initTheme } from './theme';
import { initModals } from './modals';
import { showToast } from './toast';
import { auditCookies } from './cookies';
import { auditVault } from './vault';

// UI Elements
const inputEl = document.getElementById('app-input') as HTMLTextAreaElement;
const outputEl = document.getElementById('output-region') as HTMLElement;
const processBtn = document.getElementById('action-process') as HTMLButtonElement;
const clearBtn = document.getElementById('action-clear') as HTMLButtonElement;
const copyBtn = document.getElementById('action-copy') as HTMLButtonElement;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderOutput(content: string, isError = false, warnings?: string[]) {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = content;
  pre.appendChild(code);
  if (warnings && warnings.length > 0) {
    const warnDiv = document.createElement('div');
    warnDiv.className = 'warnings';
    warnDiv.innerHTML = '<strong>Warnings:</strong><ul>' + warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('') + '</ul>';
    pre.insertAdjacentElement('beforebegin', warnDiv);
  }
  outputEl.innerHTML = '';
  outputEl.appendChild(pre);
  if (isError) outputEl.classList.add('error');
  else outputEl.classList.remove('error');
}

function clearAll() {
  inputEl.value = '';
  outputEl.innerHTML = '<p class="placeholder">Output will appear here…</p>';
  outputEl.classList.remove('error');
}

async function copyOutput() {
  const text = outputEl.textContent || '';
  if (!text.trim() || text.startsWith('Output will appear')) {
    showToast('Nothing to copy');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  } catch {
    showToast('Copy failed');
  }
}

function handleProcess() {
  const input = inputEl.value.trim();
  if (!input) {
    showToast('Please enter a docker run command');
    return;
  }
  const res = processInput(input);
  if (res.success) {
    renderOutput(res.data, false, res.warnings);
    showToast('Completed successfully!');
  } else {
    renderOutput(res.error || 'Unknown error', true);
    showToast('Error: ' + (res.error || 'Processing failed'));
  }
}

// Event listeners
processBtn.addEventListener('click', handleProcess);
clearBtn.addEventListener('click', clearAll);
copyBtn.addEventListener('click', copyOutput);

// Allow Ctrl+Enter to process
inputEl.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    handleProcess();
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initModals();
  auditCookies();
  auditVault();
  // Set placeholder
  inputEl.placeholder = 'docker run -d -p 80:80 --name web -v /host:/container -e VAR=value nginx';
  clearAll();

  // Auto-hydrate from URL query parameters (?q=, ?cron=, ?preset=, ?input=, etc.) & Share button
  try {
    const params = new URLSearchParams(window.location.search);
    const queryVal = params.get('q') || params.get('cron') || params.get('preset') || params.get('input') || params.get('pattern') || params.get('dialect') || params.get('mode');
    if (queryVal && input) {
      input.value = queryVal;
      processBtn.click();
    }
  } catch (e) {
    // ignore
  }

  // Inject 🔗 Share Permalink button next to action buttons if not present
  try {
    const actionsContainer = processBtn.parentElement;
    if (actionsContainer && !document.getElementById('action-share')) {
      const shareBtn = document.createElement('button');
      shareBtn.id = 'action-share';
      shareBtn.type = 'button';
      shareBtn.className = copyBtn.className || 'btn';
      shareBtn.textContent = '🔗 Share Link';
      shareBtn.style.marginLeft = '8px';
      shareBtn.addEventListener('click', async () => {
        const val = input.value.trim();
        const url = new URL(window.location.origin + window.location.pathname);
        if (val) {
          url.searchParams.set('q', val);
        }
        try {
          await navigator.clipboard.writeText(url.toString());
          showToast('Shareable permalink copied to clipboard!');
        } catch {
          showToast('Failed to copy permalink');
        }
      });
      actionsContainer.appendChild(shareBtn);
    }
  } catch (e) {
    // ignore
  }
});

