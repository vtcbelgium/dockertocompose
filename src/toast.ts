// Zero-dependency Toast Notifier
export function showToast(message: string, durationOrVariant: number | string = 2800): void {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const durationMs = typeof durationOrVariant === 'number' ? durationOrVariant : 2800;
  const variant = typeof durationOrVariant === 'string' ? durationOrVariant : 'info';

  const toast = document.createElement('div');
  toast.className = `toast toast-${variant}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.2s ease-out';
    setTimeout(() => toast.remove(), 200);
  }, durationMs);
}
