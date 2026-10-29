# PrivateX Desktop (Windows)

`dist/PrivateX_<version>_x64-setup.exe` is a Tauri installer that embeds the built web app, so it works without hosting. On the first launch, PrivateX asks for an API ID and API hash from [my.telegram.org](https://my.telegram.org/apps) and stores them only on the device. Builds made with `TELEGRAM_API_ID` and `TELEGRAM_API_HASH` in the environment skip that screen.

## Rebuilding the installer

1. Build the web app into `dist/` and drop files that should not be embedded:

   ```bash
   npm ci
   npm run build:production
   find dist -name '*.map' -delete && rm -f dist/statoscope-report.html dist/build-stats.json
   ```

2. Package it:

   - On Windows (Rust 1.97+, Microsoft C++ Build Tools):

     ```bash
     npm run tauri build -- --bundles nsis
     ```

   - On Linux (Ubuntu), cross-compiling with `cargo-xwin`:

     ```bash
     sudo apt install nsis lld llvm clang
     sudo ln -sf "$(command -v clang)" /usr/local/bin/clang-cl
     rustup target add x86_64-pc-windows-msvc
     pip install cargo-xwin
     npx tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc --bundles nsis
     ```

3. Copy the installer from `tauri/target/**/release/bundle/nsis/` into `dist/`. `npm run build:production` empties `dist/`, so copy the installer last.

The installer is not code-signed, so Windows SmartScreen asks for confirmation (**More info** → **Run anyway**).
