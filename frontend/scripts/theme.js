/* Runs in <head> so the page never flashes the wrong theme. */
try {
  document.documentElement.dataset.theme = localStorage.getItem('verity.theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
} catch { document.documentElement.dataset.theme = 'light'; }
