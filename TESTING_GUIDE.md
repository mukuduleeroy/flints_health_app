# Flints checks

From `ui/`, run `npm ci`, then `npm run test:offline`, `npm run test:iphone`, and `npm run ios:build`.

Browser checks require installed Chrome; CI uses Playwright Chromium. No backend, provider key, PostgreSQL or Redis is used. See [iPhone setup](ui/IPHONE.md) for native installation and local-data behavior.
