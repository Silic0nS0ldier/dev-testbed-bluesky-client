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
