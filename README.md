# JIAN 间

A fictional contemporary fashion label from the space between Chinese heritage and Scandinavian clarity. Collection 01, **The Art of Between**, explores soft stand collars, asymmetric closures, architectural wraps and fluid proportions.

The website is an editorial React storefront built with Vite: a cinematic homepage, seven-piece collection, individual garment pages, campaign story, brand philosophy, search, saved pieces, a persistent shopping bag and a complete preview checkout. The visual system combines ink blue, rice-paper ivory, muted jade and a restrained vermilion seal. All campaign imagery was generated specifically for this concept; photography and fonts are served locally.

## Development

Use the existing checkout at `/workspace/Fashion-web-concept`. Cloud tasks already run in an isolated environment; there is no need to create a Git worktree.

Node.js 24 is recommended (`.nvmrc`); Vite requires Node 20.19+ or 22.12+. No API keys, database or external services are required.

```sh
cd /workspace/Fashion-web-concept
npm ci
npm run dev -- --port 5173 --strictPort
```

## Validation

```sh
npm run build
npm test
```

Playwright covers desktop and mobile browsing, collection filtering and sorting, size selection, bag persistence and quantity changes, saved pieces, search, checkout validation, newsletter and contact forms, privacy controls, keyboard focus, responsive overflow and navigation. Axe checks the main pages and search drawer for automated WCAG A/AA violations. The tests use the installed `/usr/bin/chromium`; set `CHROMIUM_PATH` to another Chromium executable when necessary. The test runner starts the development server automatically if one is not already running.

To run the compiled website locally:

```sh
npm run preview -- --port 4173 --strictPort
```

## GitHub Pages deployment

The website is a static application and can run on GitHub Pages without a server. Vite uses a relative build base, and JavaScript image URLs respect that base, so scripts, fonts, CSS backgrounds, photography and the favicon resolve beneath `/Fashion-web-concept/`. Existing hash routes work when opened directly or reloaded; no routing rewrite or design change is needed.

The manually triggered workflow in `.github/workflows/pages.yml` installs the locked dependencies, builds `dist/` and deploys that artifact with GitHub's official Pages actions. It does **not** deploy automatically on a push.

Once publication is authorized:

1. Commit and push the website and workflow to the repository's default branch. The current checkout has no commits, and all website files currently exist only in this cloud workspace.
2. In the repository's **Settings → Pages**, select **GitHub Actions** as the build and deployment source. The repository must be eligible for Pages under its visibility and GitHub plan.
3. In **Actions**, manually run **Deploy JIAN to GitHub Pages** on that branch.
4. Open the deployment URL shown by the workflow. The expected default address is `https://simone925n.github.io/Fashion-web-concept/`.

These instructions and the workflow are local preparation only. No push, deployment, Pages-setting change or public publication has been performed. The existing preview checkout and forms keep their current behavior.

## Preview boundaries

JIAN and its garments are fictional. Product images are visual concepts. The checkout validates an address and creates an in-session confirmation, but processes no payment, stores no checkout personal details and ships no order. The newsletter stores an email on the current device. The contact form demonstrates validation and confirmation without sending a message. Bags and saved pieces persist in browser local storage; the Privacy panel lets visitors clear these preferences.

Nothing is publicly deployed. A production commerce integration would need payment processing, inventory, transactional email and a newsletter/contact backend.

## Project layout

- `src/App.jsx`: page routes, collection data and storefront interactions.
- `src/styles.css`: visual system, responsive layouts, motion and reduced-motion support.
- `public/images/`: original generated campaign and lookbook images.
- `tests/storefront.spec.js`: browser acceptance tests.
- `playwright.config.js`: desktop/mobile browser configuration.

DM Sans and Manrope are self-hosted through Fontsource under the SIL Open Font License. Interface icons are from Lucide.
