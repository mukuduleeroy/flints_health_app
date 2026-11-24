# Flints UI

React + TypeScript + Vite + Tailwind, packaged for iPhone using Capacitor.

- `npm run dev`: local development.
- `npm run build`: bundled UI and local fonts.
- `npm run ios:sync`: build and copy assets into the iPhone project.
- `npm run ios:open`: open the project in Xcode.
- `npm run ios:build`: unsigned native device build.
- `npm run test:offline`: on-device data and disconnected-AI checks.
- `npm run test:iphone`: responsive layout checks with real local profiles.

Visit `/design-system` for the source-based component library. The app uses `src/data/local-store.ts` for local persistence through the existing API facade. There is no remote API or LLM client. See [IPHONE.md](IPHONE.md).
