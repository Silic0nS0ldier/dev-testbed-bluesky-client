While the Android platform is a lot more open, it is also a lot more complicated. Fortunately Bazel
has first class support, unfortunately there are a lot of system dependencies which I am trying to
avoid here.

Projects such as https://github.com/cnlohr/rawdrawandroid may offer valuable insight.

Android is pushing hard for Kotlin as the primary language, the new UI toolkit "jetpack" only
works with it. It would be nice to use it however it relies heavily on compiler plugins. Too
much complexity at this stage.

...

Metadata: https://dl.google.com/android/repository/repository2-1.xml

Will need to handle agreeing to license somehow.

## Repositories Layout

- `android_build_tools_vX` (module extension, for toolchains definition)
  - `~linux_amd64` (toolchain implementation)
  - (etc)
- `android_cmdline_tools_vX` (module extension, for toolchains definition)
  - `~linux_amd64` (toolchain implementations)
  - (etc)
- `android_platform_vX` (module extension, for toolchain definition)
  - `~anyos_anyarch` (toolchain implementation)

## Constraints

- `target_sdk` (new), determines which platform should be used.
- Java language version (e.g. 17). Already part of Bazel and has a weird API.
  https://github.com/Silic0nS0ldier/java-language-server/blob/master/.bazelrc might help

Later on would be handy to have `min_sdk` for linting usage of unimplemented functions
and to enable desugaring (which may be unnecessary or possibly already covered by standard
Java toolchain).

## Toolchains

...

## Compile Plan

Bulk of this based off https://authmane512.medium.com/how-to-build-an-apk-from-command-line-without-ide-7260e1e22676

1. Generate `R.java` file via
   ```sh
   $SDK/aapt package -f -m \
     -J $PROJ/src \
     -M $PROJ/AndroidManifest.xml \
     -S $PROJ/res \
     -I $SDK/android.jar
   ```
2. Compile using `java_library` with;
   - `android.jar` (`java_import` with `neverlink = True`)
3. Translate `.class` outputs into `classes.dex` with `dx` (`d8`).
   ```sh
   $SDK/dx --dex --output=$PROJ/bin/classes.dex $PROJ/obj
   ```
   Can optimise this with `--file-per-class` and/or `--file-per-class-file` for non-prod builds.
   It can also reuse output from `--intermediate` runs in `--release`, so we could have a "merge" step.
   https://developer.android.com/tools/d8#incremental
4. Assemble APK with `aapt`;
   ```sh
   $SDK/aapt package -f -m \
     -F $PROJ/bin/__.unaligned.apk \
     -M $PROJ/AndroidManifest.xml \
     -S $PROJ/res \
     -I $SDK/android.jar \
   # put classes.dex into the root
   cp $PROJ/bin/classes.dex .
   $SDK/aapt add $PROJ/bin/__.unaligned.apk classes.dex
   ```
5. Sign with `apksigner`
6. Align with `zipalign`;
   ```sh
   $SDK/zipalign -f 4 $PROJ/bin/__.unaligned.apk $PROJ/__.apk
   ```
