# Flints

Flints is an iPhone wellbeing and faith companion with the original sage-and-stone UI, mood check-ins, private journaling, guided paths, topic circles, a safety plan, and on-device management tools.

This version has **no backend and no LLM connection**. The previous server, database/migration code, cloud deployment configuration, and model integration have been removed. The companion screen remains visible, with Listen / Reflect / Ground modes and a clear disconnected state for a future AI connection.

## Current app documentation

See [Flints: current app inventory](docs/CURRENT_APP.md) for the screen-by-screen feature list, implemented behavior, disconnected services, known gaps, storage model and verified delivery status.

## Run

```sh
cd ui
npm ci
npm run dev
```

Open `/` for the app and `/design-system` for the UI reference.

## iPhone

```sh
cd ui
npm run ios:sync
npm run ios:open
```

The native project is `ui/ios/App/App.xcodeproj`, named **Flints**, with bundle ID `com.flints.companion`. Select a signing team and a connected iPhone in Xcode to install. See [iPhone setup](ui/IPHONE.md).

## Data behavior

- Profiles, mood entries, journal notes, safety plans, circle posts/replies, reactions, and path progress are saved on this device.
- A device profile is not a cloud account. Existing cloud credentials and server data are not imported.
- Device passwords are stored as salted PBKDF2 hashes, never as plaintext. They select a local profile; they do not encrypt all stored content or replace the iPhone passcode.
- Circles are private topic spaces on this device. There are no remote members, shared posts, cloud moderation, risk assessment, or escalation services.
- AI chat and the microphone are disconnected. No scripted assistant replies are presented as AI responses.
- Clearing app storage or uninstalling can remove the local data. There is no cloud backup/sync in this version.

The `app/` directory is the separately maintained earlier Flutter prototype; it is not the shipped iPhone target. The complete iPhone app is built from `ui/`.

## Checks

```sh
cd ui
npm run test:offline
npm run test:iphone
npm run ios:build
```

No provider key, server, database, Redis, or external account is required to run Flints.
