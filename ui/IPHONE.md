# Flints for iPhone

Flints preserves the existing UI in a native Capacitor shell. The app display name, wordmarks, icon and bundle ID are now Flints / `com.flints.companion`.

For the complete feature inventory and known limitations, see [Current app inventory](../docs/CURRENT_APP.md).

## Build and run

```sh
cd ui
npm ci
npm run ios:sync
npm run ios:open
```

Select **App**, choose your iPhone and signing team, then Run in Xcode. iPhone only, iOS 15+, portrait and landscape. Swift Package Manager resolves native dependencies; CocoaPods is not required. `npm run ios:build` produces an unsigned compile for verification, not a directly installable phone package.

## Offline version

The previous backend and cloud deployment code have been deleted. No server URL, provider key or account is needed. `src/api/client.ts` preserves the screen-facing interface and delegates to `src/data/local-store.ts`, which stores each local profile's data separately.

Profiles, mood history, journals, verses, safety plans, topic circles, posts/replies, reactions, path enrollment/progress, and device management use local data. Device passwords use salted PBKDF2-SHA256 hashes. This is local profile access, not a cloud account or full database encryption. The iPhone passcode remains important for protecting device data. Uninstalling or clearing storage may remove data; no cloud backup/sync is provided.

The companion screen retains its original modes and appearance but explicitly reports **AI disconnected**. Sending and microphone controls are disabled; there are no model requests or fake AI replies. The LLM can be connected in a later task. Shared community, remote role management, automated safety monitoring, and escalations are disconnected. Device tools describe this scope in the UI.

Existing server data/accounts are not migrated. Original unfinished utility actions remain unchanged where unrelated to this conversion. The older Flutter prototype under `app/` is not the iPhone shipping target.

## Verification

```sh
npm run test:offline
npm run test:iphone
npm run ios:build
```

Tests use a local browser only, with no API fixtures or backend. The iPhone suite checks narrow and large screens, landscape, safe-area spacing and reduced-height viewports. Install/run verification on a paired phone additionally requires valid signing and Developer Mode on that phone.

## Current verification

- 22 local-data checks pass, including profile separation, salted password verification, mood/journal persistence, safety-plan saving, posts/replies/reactions, and journey progress.
- 105 responsive iPhone checks pass using actual local profiles, with no API fixtures or browser runtime errors.
- No backend or provider requests are made by the offline version.
- Production assets, native sync, unsigned iPhone build and iPhone simulator build pass. Strict TypeScript comparison adds no diagnostics to the original repository's existing errors.
- Physical iPhone build and installation now succeed. The signature verifies and the provisioning profile includes the paired iPhone. First launch is blocked by the phone’s security/trust check; the developer profile needs to be trusted on the iPhone before retrying launch.
- The old root `.env.production` file was preserved unused after automatic approval review rejected deletion because it might contain deployment secrets. No application code reads it.
