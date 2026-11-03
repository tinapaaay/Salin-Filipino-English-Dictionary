# Development and maintenance

## Run locally

From the repository root, run `python3 -m http.server 5500`, then open [localhost:5500](http://localhost:5500). Python 3 is only a development-server option; VS Code Live Server also works. Stop the server with Ctrl+C. No package installation or build is required to serve this checkout.

## Implementation and boundaries

`script.js` contains a 12-entry glossary. Search matches word, English meaning, and related terms and combines with the active category. Favorites are word strings stored under `salin-favorites`. Word of the Day is chosen from local date/month at page load; it is not fetched from a service. Pronunciation guides are text, without audio. This small learning glossary is not a full translation engine.

## Make changes

Extend the `words` array in `script.js` using word, pronunciation, meaning, category, example, and related fields. Keep category values consistent with filter buttons in `index.html`.

## Source map

- [`index.html`](../index.html)
- [`script.js`](../script.js)
- [`styles.css`](../styles.css)

## Verification

No automated test command is provided by this repository. The following manual checks are a checklist, not a claim that browser QA has been completed.

1. Search a Filipino word, English meaning, related word, and unknown term; check counts and the no-results state.
2. Combine search with every category, then clear search and check focus.
3. Save/remove favorites, refresh, and confirm the saved list and heart labels agree.
4. Inspect the browser console and Network panel for missing assets or script errors; check keyboard access, phone width, and 200% zoom.

## Deployment

Serve the tracked HTML, CSS, JavaScript, and required assets from a static host, preserving relative paths and filename case. There is no application server or environment-variable configuration in this checkout. Verify the actual deployment URL, external resources, and the checks below after publishing. A repository existing on GitHub does not by itself prove Pages is enabled.

## Keep documentation current

Update the README and this guide when entry points, dependencies, behavior, or deployment steps change. Record commands actually run and distinguish them from pending manual checks.
