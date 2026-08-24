# tauri_plugin_updater - Rust

**Source:** https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> In-app updates for Tauri applications.

---

## Crate tauri\_plugin\_updater 

[Source](https://docs.rs/tauri-plugin-updater/latest/src/tauri_plugin_updater/lib.rs.html#5-240)

Expand description

In-app updates for Tauri applications.

-   Supported platforms: Windows, Linux and macOS.crypted database and secure runtime.

## Structs[§](#structs)

[Builder](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/struct.Builder.html "struct tauri_plugin_updater::Builder")

[Config](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/struct.Config.html "struct tauri_plugin_updater::Config")

Updater configuration.

[ReleaseManifestPlatform](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/struct.ReleaseManifestPlatform.html "struct tauri_plugin_updater::ReleaseManifestPlatform")

[RemoteRelease](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/struct.RemoteRelease.html "struct tauri_plugin_updater::RemoteRelease")

Information about a release returned by the remote update server.

[Update](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/struct.Update.html "struct tauri_plugin_updater::Update")

[Updater](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/struct.Updater.html "struct tauri_plugin_updater::Updater")

[UpdaterBuilder](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/struct.UpdaterBuilder.html "struct tauri_plugin_updater::UpdaterBuilder")

## Enums[§](#enums)

[Error](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/enum.Error.html "enum tauri_plugin_updater::Error")

All errors that can occur while running the updater.

[Installer](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/enum.Installer.html "enum tauri_plugin_updater::Installer")

[RemoteReleaseInner](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/enum.RemoteReleaseInner.html "enum tauri_plugin_updater::RemoteReleaseInner")

## Traits[§](#traits)

[UpdaterExt](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/trait.UpdaterExt.html "trait tauri_plugin_updater::UpdaterExt")

Extensions to [`tauri::App`](https://docs.rs/tauri/2.11.5/x86_64-unknown-linux-gnu/tauri/app/struct.App.html "struct tauri::app::App"), [`tauri::AppHandle`](https://docs.rs/tauri/2.11.5/x86_64-unknown-linux-gnu/tauri/app/struct.AppHandle.html "struct tauri::app::AppHandle"), [`tauri::WebviewWindow`](https://docs.rs/tauri/2.11.5/x86_64-unknown-linux-gnu/tauri/webview/webview_window/struct.WebviewWindow.html "struct tauri::webview::webview_window::WebviewWindow"), [`tauri::Webview`](https://docs.rs/tauri/2.11.5/x86_64-unknown-linux-gnu/tauri/webview/struct.Webview.html "struct tauri::webview::Webview") and [`tauri::Window`](https://docs.rs/tauri/2.11.5/x86_64-unknown-linux-gnu/tauri/window/struct.Window.html "struct tauri::window::Window") to access the updater APIs.

## Functions[§](#functions)

[extract\_path\_from\_executable](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/fn.extract_path_from_executable.html "fn tauri_plugin_updater::extract_path_from_executable")

[target](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/fn.target.html "fn tauri_plugin_updater::target")

Gets the base target string used by the updater. If bundle type is available it will be added to this string when selecting the download URL and signature. `tauri::utils::platform::bundle_type` method is used to obtain current bundle type.

## Type Aliases[§](#types)

[OnBeforeExit](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/type.OnBeforeExit.html "type tauri_plugin_updater::OnBeforeExit")

[OnBeforeRequest](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/type.OnBeforeRequest.html "type tauri_plugin_updater::OnBeforeRequest")

[Result](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/type.Result.html "type tauri_plugin_updater::Result")

[VersionComparator](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/type.VersionComparator.html "type tauri_plugin_updater::VersionComparator")
