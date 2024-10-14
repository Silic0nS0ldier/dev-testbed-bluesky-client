# Bluesky Alt Client

An alternate client for Bluesky created to serve as a test bed for web tooling.

Currently;
- End-to-end ES modules support.
  - Caveat: Third party packages are tricky.
    e.g. `@atproto/api` ships as CJS and has a dependency which uses `node:crypto`.
    This complexity is contained within a separately built vendor bundle.
  - Only the TypeScript compiler touches `.ts` sources.
- Bazel-backed devserver using `ibazel`.
- `node_modules` is fully managed by Bazel (generated by `reveal-node-modules.sh`).
  This way types are available to editors for local packages without exposing implementation details.

## Architectural Notes

### Preact

- Prefer `useSignal` over `useState`.

## Plans

### Progressive Web App

Evolve the core web app into a progressive web app. This will act as the core for all native apps
(native apps are more for tighter integrations).

Work on this will begin once the build logic for the current simple web app is finalised.

### iOS App

- [ ] Swift toolchain with no dependency on the host system (toolchain downloaded).
- [ ] Build without XCode.
      In theory all that is needed is;
      - A mach-o executable binary
      - `Info.plist` with relevent metadata
      - Relevent resources
      - Any support files
      - Folder ending in `.app`
      
      See https://lcsmarcalblog.wordpress.com/2022/04/07/building-ios-app-without-xcode/
- [ ] Potentially certain standard libraries from XCode.
- [ ] Some path towards running in a simulator and/or device.
  
### Android App

While the Android platform is a lot more open, it is also a lot more complicated. Fortunately Bazel
has first class support, unfortunately there are a lot of system dependencies which I am trying to
avoid here.

Projects such as https://github.com/cnlohr/rawdrawandroid may offer valuable insight.

Android is pushing hard for Kotlin as the primary language, the new UI toolkit "jetpack" only
works with it. It would be nice to use it however it relies heavily on compiler plugins. Too
much complexity at this stage.

### Desktop (Windows, macOS, maybe Linux) App

Plenty of choice, just need to do it.
