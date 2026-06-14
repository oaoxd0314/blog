// Client runtime: dark-mode toggle + share button. Vanilla JS, no framework.

const root = document.documentElement;

function currentTheme() {
  return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  const icon = document.querySelector("[data-theme-icon]");
  if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
}

function initThemeToggle() {
  applyTheme(currentTheme());
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  });
}

function initShare() {
  const button = document.querySelector("[data-share]");
  if (!button) return;
  button.addEventListener("click", async () => {
    const url = button.getAttribute("data-url") || location.href;
    const title = button.getAttribute("data-title") || document.title;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        const original = button.textContent;
        button.textContent = "Link copied!";
        setTimeout(() => (button.textContent = original), 1500);
      } catch {}
    }
  });
}

initThemeToggle();
initShare();
