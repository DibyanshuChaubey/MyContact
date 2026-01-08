// Small helpers for UX
window.showToast = function (message, type = 'info') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.className = `toast show ${type}`;
  setTimeout(() => { el.className = 'toast hidden'; }, 2500);
};

window.setLoading = function (button, loading = true, text = 'Please wait…') {
  if (!button) return;
  if (loading) {
    if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
};

// App initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('📇 Contact Manager Ready');
});
