# GitHub PR Tab Rewriter

Chrome extension that rewrites a repo's **Pull requests** tab to open your saved filtered query.

GitHub's "Pull requests" tab always opens the unfiltered list. If your team uses labels like `dependencies`, `do not merge`, or `do not review yet`, the default view buries the PRs you actually need to look at. This extension fixes that — per repository.

![icon](icons/128.png)

## Features

- Per-repo overrides — each repo can have its own filter URL.
- Auto-detects the current repo from the active tab.
- Validates pasted URLs (must be `https://github.com/{owner}/{repo}/pulls...`).
- Survives GitHub's client-side navigation (Turbo / PJAX).
- Options page to view, edit, or remove all saved overrides.
- Settings sync across your Chrome profile via `chrome.storage.sync`.
- No analytics, no tracking, no remote servers.

## Install (load unpacked)

1. Clone this repo.
2. Open `chrome://extensions`.
3. Toggle **Developer mode** on (top right).
4. Click **Load unpacked** and pick the repo directory.

## Usage

1. Build a filter on GitHub's Pull requests page, e.g. `is:open is:pr -label:dependencies -label:"do not merge"`.
2. Copy the URL from the address bar.
3. Visit the repo and click the extension icon.
4. The popup prefills `owner/repo`. Paste the URL → **Save**.
5. The "Pull requests" tab now points to your filter. One click takes you to the filtered view.

To manage saved overrides: click **All overrides** in the popup, or open the extension's options page from `chrome://extensions`.

## How it works

- `content.js` runs on every `github.com` page, reads `prTabOverrides` from `chrome.storage.sync`, and rewrites the `a[data-tab-item="pull-requests"]` anchor to the saved URL.
- A `MutationObserver` plus `turbo:load` / `turbo:render` / `pjax:end` listeners cover GitHub's client-side navigation.
- If a saved override exists for a repo but the tab anchor cannot be found within 3 seconds, an error is logged to the page console.

Storage shape:

```json
{
  "prTabOverrides": {
    "owner/repo": "https://github.com/owner/repo/pulls?q=..."
  }
}
```

## Permissions

| Permission | Why |
|---|---|
| `storage` | Persist your per-repo URL overrides. |
| `activeTab` | Read the current tab's URL inside the popup so it can prefill the repo field. |
| `host_permissions: https://github.com/*` | The content script must run on GitHub pages to rewrite the link. |

No data leaves your browser.

## Develop

```
.
├── manifest.json     # MV3 manifest
├── content.js        # DOM rewriter
├── popup.html/.js    # quick-save UI
├── options.html/.js  # full list editor
├── icons/            # 16/48/128 PNG icons
└── scripts/
    └── pack.sh       # build .zip for Chrome Web Store
```

Pack for Web Store: `./scripts/pack.sh`

## License

MIT
