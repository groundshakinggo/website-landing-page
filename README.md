# ground | shaking — homepage slider

A responsive, two-slide landing page based on the supplied two-page PDF:
- Option A — Universal Hero (Venture-Driven Founders, Bold Executives, Relentless Builders)
- Option B — Targeted Hero (Visionary Entrepreneurs, Transformative Managers, Dedicated Professionals)

## Files

- `index.html` — page content, both hero concepts, external links and slider controls
- `styles.css` — responsive layout, typography, colour, spacing and transitions
- `script.js` — 22-second carousel, manual controls, keyboard and touch navigation, reduced-motion handling

## Run locally

1. Download and unzip the project.
2. Open `index.html` in a modern browser.
3. For a local web server, run `python3 -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Sign in to GitHub and create a new repository, for example `ground-shaking-homepage`.
2. Choose **Public** (or use a plan that supports Pages for a private repository).
3. Upload `index.html`, `styles.css` and `script.js` to the repository root.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`, then save.
7. Wait for GitHub Pages to publish. The live URL will appear in the Pages settings.

## Design and behaviour

- Brand palette: `#C00000` and `#FFFFFF`.
- No conventional site header or footer. The brand welcome line is part of each hero slide; the requested copyright notice is centred at the bottom.
- Automatic slide change every 22 seconds.
- Manual previous/next arrows and slide dots.
- Pauses while the pointer is over the landing page or keyboard focus is inside it.
- Supports keyboard arrows and touch swipe.
- Respects `prefers-reduced-motion`; automatic rotation is disabled when the visitor requests reduced motion.
- External links open in a new tab with `rel="noopener noreferrer"`.

## Security and maintenance notes

This project uses plain HTML, CSS and JavaScript with no third-party runtime libraries, no `eval`, no dynamic HTML injection and no form inputs. External navigation targets are fixed in the HTML. Keep dependencies minimal and review any future third-party scripts before adding them.

No website can honestly be guaranteed “hacker-proof” or “crash-proof”. This implementation follows defensive front-end practices, but production hosting, repository access controls, domain configuration and any future integrations should also be secured.
