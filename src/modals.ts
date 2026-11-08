// Focus-trapped Dialog Management
export function initModals(): void {
  const dialogTriggers: Record<string, string> = {
    'open-about': 'about-dialog',
    'open-settings': 'settings-dialog',
    'open-vault': 'vault-dialog',
    'open-cookies': 'cookie-dialog',
  };

  Object.entries(dialogTriggers).forEach(([btnId, dialogId]) => {
    const btn = document.getElementById(btnId);
    const dialog = document.getElementById(dialogId) as HTMLDialogElement | null;
    if (btn && dialog) {
      btn.addEventListener('click', () => dialog.showModal());
    }
  });

  // Handle close buttons and backdrop clicks
  document.querySelectorAll('dialog.sovereign-dialog').forEach((diag) => {
    const dialog = diag as HTMLDialogElement;
    dialog.querySelectorAll('.dialog-close').forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => dialog.close());
    });

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inDialog) {
        dialog.close();
      }
    });
  });
}
