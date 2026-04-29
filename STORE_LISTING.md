# Chrome Web Store listing copy

## Name
GitHub PR Tab Rewriter

## Short description (≤132 chars)
Make a repo's "Pull requests" tab open your saved filtered query — hide dependabot, drafts, "do not merge", whatever you want.

## Detailed description
GitHub's "Pull requests" tab always opens the unfiltered list. If your team uses labels like `dependencies`, `do not merge`, or `do not review yet`, the default view buries the PRs you actually need to look at.

This extension lets you save a filtered Pull Requests URL per repository. Whenever you visit that repo, the "Pull requests" tab link is rewritten to your saved URL — one click takes you straight to the filtered view.

Features
• Per-repository overrides — each repo can have its own filter
• Auto-detects the current repo from the active tab
• Validates pasted URLs (must be `https://github.com/{owner}/{repo}/pulls...`)
• Survives GitHub's client-side navigation (Turbo / PJAX)
• Options page to view, edit, or remove all saved overrides
• Settings sync across your Chrome profile via `chrome.storage.sync`

How to use
1. Build a filter on GitHub's Pull requests page (e.g. `is:open is:pr -label:dependencies -label:"do not merge"`).
2. Copy the URL from the address bar.
3. Click the extension icon on the repo page.
4. Paste the URL → Save.
5. The "Pull requests" tab now points to your filter.

Privacy
• No analytics, no tracking, no remote servers.
• No data leaves your browser. Saved URLs live in `chrome.storage.sync`, which Chrome syncs between your own signed-in browsers.
• No remote code execution.

Permissions
• `storage` — to save your overrides.
• `activeTab` — to read the current tab's URL when you open the popup, so it can prefill the repo field.
• Host access to `https://github.com/*` — required to rewrite the link on GitHub pages.

Open source. Issues and PRs welcome.

## Category
Productivity

## Single-purpose statement
Rewrites the "Pull requests" tab link on a GitHub repository to a user-saved filtered URL.

## Permission justifications
- `storage`: persists per-repo URL overrides so the user does not have to re-enter them.
- `activeTab`: reads the active tab's URL inside the popup to detect the current repo and prefill the form.
- Host permission `https://github.com/*`: the content script must run on GitHub pages to find and rewrite the Pull requests tab anchor.

## Data usage disclosures
- Does NOT collect personally identifiable information.
- Does NOT collect health, financial, authentication, personal communications, location, web history, or user activity data.
- Does NOT sell or transfer user data to third parties.
- Does NOT use data for purposes unrelated to the single purpose.
- Does NOT use data to determine creditworthiness or for lending.

## Listing assets checklist
- [x] 128×128 icon → `icons/128.png`
- [x] At least one 1280×800 screenshot → `store-screenshot-1280x800.png`
- [ ] Optional: small promo tile 440×280
- [ ] Optional: marquee promo tile 1400×560
