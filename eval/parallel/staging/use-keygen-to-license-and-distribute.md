# Use Keygen to License and Distribute Tauri Applications

**Source:** https://keygen.sh/for-tauri-apps/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> License and distribute desktop apps built with Tauri using Keygen's software licensing and distribution API.

---

Securely license and distribute cross-platform _Tauri_ apps with a single API.

_Free during development, no upfront commitment_

[

5 stars

](https://www.capterra.com/p/168916/Keygen/reviews/)

## Ready, set, license

From license activation to auto-upgrades, we can help. Dive in with Keygen Cloud, or explore our self-hosted options.

-   Use our [software distribution API](https://keygen.sh/docs/api/releases/) to securely deliver your app to licensed users. Integrate directly with Tauri's native updater for dead-simple automatic updates.
-   Protect your code with our flagship [software licensing API](https://keygen.sh/docs/api/). Add feature entitlements, limit upgrades to specific version ranges, enforce activation limits, and more.

[Learn more](https://keygen.sh/docs/api/engines/#engines-tauri)

```
tauri::Builder::default()  .setup(|app| {    let handle = app.handle();    tauri::async_runtime::spawn(async move {      match handle        .updater()        .header("Authorization", "License C1B6DE-39A6E3-DE1529-8559A0-4AF593-V3")        .unwrap()        .check()        .await      {        Ok(update) => {          if update.is_update_available() {            update.download_and_install().await.unwrap();          }        }        Err(e) => {          println!("failed to update: {}", e);        }      }    });    Ok(())  })
```

![Runsafe Security](https://keygen.sh/images/logo-runsafe.png)

![Spotify](https://keygen.sh/images/logo-spotify.png)

![Sennheiser](https://keygen.sh/images/logo-sennheiser.png)

![Google](https://keygen.sh/images/logo-google.png)

![Ranorex](https://keygen.sh/images/logo-ranorex.png)

![Synopsys](https://keygen.sh/images/logo-synopsys.png)

![Itential](https://keygen.sh/images/logo-itential.png)

![GoodData](https://keygen.sh/images/logo-gooddata.png)

![Traefik](https://keygen.sh/images/logo-traefik.png)

## Solutions for **licensing & distribution**

* * *

-   #### _dns_ Choice
    
    Managed Keygen Cloud, or explore self-hosting.
    
    [View Options](https://keygen.sh/docs/self-hosting/)
    
-   #### _library\_books_ Quickstarts
    
    Guides and API references for developers of all skill levels.
    
    [View Docs](https://keygen.sh/docs/api/)
    
-   #### _insert\_chart_ Dashboard
    
    Manage your products from an intuitive dashboard.
    
    [View Dashboard](https://app.keygen.sh/)
    
-   #### _business_ Pricing
    
    From indie to enterprise, we have options for everyone.
    
    [View Pricing](https://keygen.sh/pricing/)
