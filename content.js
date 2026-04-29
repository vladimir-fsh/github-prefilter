(() => {
  const STORAGE_KEY = "prTabOverrides";
  const LOG_PREFIX = "[GitHub PR Tab Rewriter]";
  const ANCHOR_SELECTOR = 'a[data-tab-item="pull-requests"]';
  const MISSING_CHECK_DELAY_MS = 3000;

  let overrides = {};
  const erroredFor = new Set();
  let pendingCheck = null;

  const PULLS_PATH_RE = /^\/([^/]+)\/([^/]+)\/pulls\/?$/;
  const REPO_PATH_RE = /^\/([^/]+)\/([^/]+)(\/|$)/;

  function repoKeyFromPullsPath(pathname) {
    const m = PULLS_PATH_RE.exec(pathname);
    return m ? `${m[1]}/${m[2]}` : null;
  }

  function repoKeyFromCurrentPath() {
    const m = REPO_PATH_RE.exec(location.pathname);
    if (!m) return null;
    const reserved = new Set([
      "settings", "notifications", "pulls", "issues",
      "marketplace", "explore", "topics", "trending",
      "new", "login", "logout", "signup", "search",
      "orgs", "organizations", "sponsors",
    ]);
    if (reserved.has(m[1])) return null;
    return `${m[1]}/${m[2]}`;
  }

  function applyOverrides() {
    if (!overrides || Object.keys(overrides).length === 0) return;
    const anchors = document.querySelectorAll(ANCHOR_SELECTOR);
    for (const a of anchors) {
      let url;
      try {
        url = new URL(a.href, location.origin);
      } catch {
        continue;
      }
      if (url.host !== "github.com") continue;
      const key = repoKeyFromPullsPath(url.pathname);
      if (!key) continue;
      const target = overrides[key];
      if (!target) continue;
      if (a.href === target) continue;
      a.href = target;
      a.dataset.prTabRewritten = "1";
    }
  }

  function scheduleMissingCheck() {
    if (pendingCheck) clearTimeout(pendingCheck);
    pendingCheck = setTimeout(() => {
      pendingCheck = null;
      const repoKey = repoKeyFromCurrentPath();
      if (!repoKey) return;
      if (!overrides[repoKey]) return;
      const errKey = `${location.pathname}::${repoKey}`;
      if (erroredFor.has(errKey)) return;
      const found = document.querySelector(ANCHOR_SELECTOR);
      if (!found) {
        erroredFor.add(errKey);
        console.error(
          `${LOG_PREFIX} no anchor matching ${ANCHOR_SELECTOR} found on ${location.pathname} (override saved for ${repoKey}).`
        );
      }
    }, MISSING_CHECK_DELAY_MS);
  }

  function onNavigate() {
    erroredFor.clear();
    applyOverrides();
    scheduleMissingCheck();
  }

  function loadAndApply() {
    chrome.storage.sync.get([STORAGE_KEY], (res) => {
      overrides = res[STORAGE_KEY] || {};
      applyOverrides();
      scheduleMissingCheck();
    });
  }

  loadAndApply();

  const observer = new MutationObserver(() => applyOverrides());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  document.addEventListener("turbo:load", onNavigate);
  document.addEventListener("turbo:render", onNavigate);
  document.addEventListener("pjax:end", onNavigate);
  document.addEventListener("DOMContentLoaded", onNavigate);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[STORAGE_KEY]) {
      overrides = changes[STORAGE_KEY].newValue || {};
      erroredFor.clear();
      applyOverrides();
      scheduleMissingCheck();
    }
  });
})();
