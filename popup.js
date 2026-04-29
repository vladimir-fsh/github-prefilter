const STORAGE_KEY = "prTabOverrides";

const repoEl = document.getElementById("repo");
const urlEl = document.getElementById("url");
const msgEl = document.getElementById("msg");
const saveBtn = document.getElementById("save");
const removeBtn = document.getElementById("remove");
const optionsBtn = document.getElementById("options");

const PULLS_RE = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pulls(\/|\?|$)/;
const REPO_PATH_RE = /^\/([^/]+)\/([^/]+)(\/|$)/;

function setMsg(text, kind = "") {
  msgEl.textContent = text;
  msgEl.className = "msg " + kind;
}

function parseRepoFromTabUrl(href) {
  try {
    const u = new URL(href);
    if (u.host !== "github.com") return null;
    const m = REPO_PATH_RE.exec(u.pathname);
    if (!m) return null;
    const reserved = new Set([
      "settings", "notifications", "pulls", "issues",
      "marketplace", "explore", "topics", "trending",
      "new", "login", "logout", "signup", "search",
      "orgs", "organizations", "sponsors",
    ]);
    if (reserved.has(m[1])) return null;
    return `${m[1]}/${m[2]}`;
  } catch {
    return null;
  }
}

function validatePastedUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "URL is empty." };
  let u;
  try {
    u = new URL(trimmed);
  } catch {
    return { ok: false, error: "Not a valid URL." };
  }
  if (u.host !== "github.com") return { ok: false, error: "Must be a github.com URL." };
  const m = PULLS_RE.exec(trimmed);
  if (!m) return { ok: false, error: "Must be https://github.com/{owner}/{repo}/pulls..." };
  return { ok: true, owner: m[1], repo: m[2], normalized: trimmed };
}

function getActiveTabUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs && tabs[0] && tabs[0].url);
    });
  });
}

async function prefill() {
  const tabUrl = await getActiveTabUrl();
  if (!tabUrl) return;
  const repoKey = parseRepoFromTabUrl(tabUrl);
  if (repoKey) repoEl.value = repoKey;

  chrome.storage.sync.get([STORAGE_KEY], (res) => {
    const all = res[STORAGE_KEY] || {};
    if (repoKey && all[repoKey]) {
      urlEl.value = all[repoKey];
      setMsg("Override exists for this repo.", "muted");
    }
  });
}

saveBtn.addEventListener("click", () => {
  const repoKey = repoEl.value.trim();
  if (!/^[^/]+\/[^/]+$/.test(repoKey)) {
    setMsg("Repo must be owner/repo.", "error");
    return;
  }
  const v = validatePastedUrl(urlEl.value);
  if (!v.ok) {
    setMsg(v.error, "error");
    return;
  }
  const expected = `${v.owner}/${v.repo}`;
  if (expected !== repoKey) {
    setMsg(`URL is for ${expected}, not ${repoKey}.`, "error");
    return;
  }
  chrome.storage.sync.get([STORAGE_KEY], (res) => {
    const all = res[STORAGE_KEY] || {};
    all[repoKey] = v.normalized;
    chrome.storage.sync.set({ [STORAGE_KEY]: all }, () => {
      setMsg("Saved.", "ok");
    });
  });
});

removeBtn.addEventListener("click", () => {
  const repoKey = repoEl.value.trim();
  if (!repoKey) {
    setMsg("Repo is empty.", "error");
    return;
  }
  chrome.storage.sync.get([STORAGE_KEY], (res) => {
    const all = res[STORAGE_KEY] || {};
    if (!all[repoKey]) {
      setMsg("No override for that repo.", "error");
      return;
    }
    delete all[repoKey];
    chrome.storage.sync.set({ [STORAGE_KEY]: all }, () => {
      urlEl.value = "";
      setMsg("Removed.", "ok");
    });
  });
});

optionsBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

prefill();
