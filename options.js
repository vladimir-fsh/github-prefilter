const STORAGE_KEY = "prTabOverrides";
const PULLS_RE = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pulls(\/|\?|$)/;

const rowsEl = document.getElementById("rows");
const emptyEl = document.getElementById("empty");

function render(all) {
  rowsEl.innerHTML = "";
  const keys = Object.keys(all).sort();
  emptyEl.hidden = keys.length > 0;
  for (const key of keys) {
    const tr = document.createElement("tr");

    const tdRepo = document.createElement("td");
    tdRepo.textContent = key;

    const tdUrl = document.createElement("td");
    tdUrl.className = "url";
    const input = document.createElement("input");
    input.className = "urlEdit";
    input.value = all[key];
    tdUrl.appendChild(input);

    const tdActions = document.createElement("td");
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "primary";
    saveBtn.addEventListener("click", () => {
      const v = input.value.trim();
      const m = PULLS_RE.exec(v);
      if (!m) {
        alert("URL must match https://github.com/{owner}/{repo}/pulls...");
        return;
      }
      const expected = `${m[1]}/${m[2]}`;
      if (expected !== key) {
        alert(`URL is for ${expected}, not ${key}.`);
        return;
      }
      chrome.storage.sync.get([STORAGE_KEY], (res) => {
        const next = res[STORAGE_KEY] || {};
        next[key] = v;
        chrome.storage.sync.set({ [STORAGE_KEY]: next });
      });
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "danger";
    removeBtn.addEventListener("click", () => {
      chrome.storage.sync.get([STORAGE_KEY], (res) => {
        const next = res[STORAGE_KEY] || {};
        delete next[key];
        chrome.storage.sync.set({ [STORAGE_KEY]: next });
      });
    });

    tdActions.appendChild(saveBtn);
    tdActions.appendChild(removeBtn);

    tr.appendChild(tdRepo);
    tr.appendChild(tdUrl);
    tr.appendChild(tdActions);
    rowsEl.appendChild(tr);
  }
}

function load() {
  chrome.storage.sync.get([STORAGE_KEY], (res) => {
    render(res[STORAGE_KEY] || {});
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes[STORAGE_KEY]) {
    render(changes[STORAGE_KEY].newValue || {});
  }
});

load();
