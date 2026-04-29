# Privacy Policy — GitHub PR Tab Rewriter

_Last updated: 2026-04-29_

This Chrome extension ("the extension") does not collect, transmit, sell, or share any personal data.

## Data the extension handles

The extension stores the following locally on your device, using the standard `chrome.storage.sync` API:

- A list of per-repository overrides you create yourself, in the form `"owner/repo": "https://github.com/owner/repo/pulls?q=..."`.

That data is synchronized between your own Chrome browsers when you are signed in to Chrome with sync enabled. It is handled by Google Chrome's sync infrastructure under Google's privacy policy. The extension itself never sends this data to any third party.

## Data the extension does NOT collect

- No personally identifiable information (name, email, address, phone, etc.).
- No authentication credentials, tokens, or cookies.
- No browsing history.
- No analytics, telemetry, or crash reports.
- No financial, health, or location data.
- No content of any web page is read, copied, or transmitted.

## Permissions

- `storage` — to persist your per-repo URL overrides on your device.
- `activeTab` — to read the URL of the active tab when you open the popup, so the popup can prefill the repo field. The URL is used in-memory only and is not stored or transmitted.
- Host permission `https://github.com/*` — required to run the content script that rewrites the "Pull requests" tab link on GitHub pages.

## Remote code

The extension does not load or execute any remote code. All logic ships in the published package.

## Third parties

The extension does not communicate with any third-party server.

## Changes to this policy

If this policy changes, the updated version will be posted at this same URL with a new "Last updated" date.

## Contact

Questions or issues: https://github.com/vladimir-fsh/github-prefilter/issues
