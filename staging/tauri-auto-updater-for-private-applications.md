# Tauri auto-updater for private applications

**Source:** https://anystack.sh/docs/integrations/tauri
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Learn how to distribute your commercial Tauri application.

---

Learn how to distribute your commercial Tauri application.

### Requirements

When you create a release on GitHub you will need to upload the build artifacts (binaries). In order for Unlock to distribute updates to the correct operating system you need to make sure to include the OS and architecture in the filename: `app-name.{platform}-{arch}.tar.gz` Tauri requires a valid signature as well, make sure you include the signature file as well. For example, the following filenames are valid:

-   anystack.app.darwin-aarch64.tar.gz
-   anystack.app.darwin-aarch64.tar.gz.sig
-   anystack.app.windows-x86\_64.zip
-   anystack.app.windows-x86\_64.zip.sig
-   anystack.app.linux-armv7.tar.gz
-   anystack.app.linux-armv7.tar.gz.sig

The following operating systems are valid:

-   darwin
-   windows
-   linux

The following architectures are valid:

-   x86\_64
-   aarch64
-   i686
-   armv7

### Updater configuration

To enable Tauri's auto-updater feature you will need to add the following updater config to `src-tauri/tauri.conf.json`. You will need to sign your updates and include your public key in your config. You can learn more about [signing updates](https://tauri.app/v1/guides/distribution/updater#signing-updates) on Tauri's website.

```
 1{ 2  "$schema": "../node_modules/@tauri-apps/cli/schema.json", 3  "build": {}, //... 4  "package": { 5    "productName": "anystack", 6    "version": "1.0.0" 7  }, 8  "tauri": { 9    "allowlist": {}, //...10    "bundle": {}, //...11    "security": {}, //...12    "updater": {13      "active": true,14      "endpoints": [15          "https://dist.anystack.sh/v1/tauri/PRODUCT-ID/{{current_version}}"16      ],17      "dialog": true,18      "pubkey": "<YOUR-PUBLIC-KEY>"19    },20    "windows": //...21  }22}
```

### License key verification

If you enable the "Public distribution requires license" option, you must sent along the user license key in order for Tauri to download any new updates. This requires some additional changes to your Tauri application.

First, you must disable the default dialog in your config file:

```
 1{ 2  "tauri": { 3    "updater": { 4      "active": true, 5      "endpoints": [ 6          "https://dist.anystack.sh/v1/tauri/PRODUCT-ID/{{current_version}}" 7      ], 8      "dialog": false,  9      "pubkey": "<YOUR-PUBLIC-KEY>"10    }11  }12}
```

Next, you will need to check for updates manually and include the license key in the header:

```
 1{ 2 fn main() { 3  let context = tauri::generate_context!(); 4  tauri::Builder::default() 5    .setup(|app| { 6  7        let handle = app.handle(); 8  9        tauri::async_runtime::spawn(async move {10              match handle11                .updater()12                .header("Authorization", "Bearer <CUSTOMER-LICENSE-KEY>") 13                .unwrap()14                .check()15                .await16              {17                Ok(update) => {18                  update.download_and_install().await;19                }20                Err(e) => {21                  println!("ERROR: {}", e);22                }23              }24            });25 26        Ok(())27    })28    .run(context)29    .expect("error while running tauri application");30}
```
