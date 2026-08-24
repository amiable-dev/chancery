# How to add license keys to a Tauri app

**Source:** https://keyforge.dev/guides/how-to-license-tauri-app
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Implement license keys in a Tauri app, with JavaScript and Rust code examples. Walks through payments, offline verification, and the customer portal.

---

Tauri makes it easy to build lightweight, universal desktop apps with web technologies, but protecting your paid app from unauthorized use requires a proper licensing system.

With Keyforge, you can secure your Tauri apps with licenses, including offline verifications, using simple REST API calls. This guide has both JavaScript and Rust examples to help you get started.

Make sure you've created the basics inside your Keyforge account:

-   A product in the [dashboard](https://keyforge.dev/dashboard/products)
-   One or more licenses in the [licenses page](https://keyforge.dev/dashboard/licenses)

When a user opens your app for the first time, prompt them to enter their license key. Then, call the Keyforge activation endpoint to link that license to the user's device.

```
const res = await fetch(
  'https://keyforge.dev/api/v1/public/licenses/activate',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      licenseKey: 'ABCDE-ABCDE-ABCDE-ABCDE-ABCDE',
      deviceIdentifier: 'unique_device_id',
      deviceName: 'My computer',
      productId: 'p_123456',
    }),
  }
);

const data = await res.json();
console.log('License activated:', data);
```

Getting a device identifier

Use any stable unique identifier, such as a hardware ID, or a persistently stored UUID.

After activation, store the license key securely (for example, using [tauri-plugin-stronghold](https://github.com/tauri-apps/tauri-plugin-stronghold) or macOS Keychain). This allows your app to re-validate it later without asking the user again.

Each time your app launches, verify the stored license to ensure it's still active and valid. You can do this on startup or at scheduled intervals.

```
const res = await fetch(
  'https://keyforge.dev/api/v1/public/licenses/validate',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      licenseKey: savedLicenseKey,
      deviceIdentifier: 'unique_device_id',
      productId: 'p_123456',
    }),
  }
);

const data = await res.json();
if (data.isValid) {
  console.log('License is valid');
} else {
  console.log('License invalid');
}
```

If Keyforge returns `"isValid": true`, your app can safely unlock the licensed features.

* * *

If users need to use your app without an active internet connection, Keyforge supports offline license validations using signed JWT tokens. Each license can be represented as a signed token that your app verifies locally, with no network call required.

When license tokens are enabled for a product, the activation response includes a `token` field. Use `activateLicense` from the SDK (JavaScript) or extract it from the response directly (Rust), then store it for offline use.

```
import { activateLicense } from '@keyforge/client';

const { token } = await activateLicense({
  licenseKey: 'ABCDE-ABCDE-ABCDE-ABCDE-ABCDE',
  deviceIdentifier: 'unique_device_id',
  deviceName: 'My computer',
  productId: 'p_123456',
});

storeToken(token); // persist for offline use
```

On each app launch, use `validateAndRefreshToken` (JavaScript) to verify the token. When online, it refreshes the token from the server. When offline, it verifies the stored token locally using the public key.

```
import { validateAndRefreshToken } from '@keyforge/client/token';

const { isValid, token, data } = await validateAndRefreshToken({
  token: getStoredToken(),
  publicKeyJwk: '...',
  deviceIdentifier: 'unique_device_id',
  productId: 'p_123456',
});

if (isValid) {
  storeToken(token); // update the stored token when refreshed
  console.log('License token is valid!', data.license.key);
}
```

For the full offline verification implementation in Rust, see the [offline licensing guide](https://docs.keyforge.dev/addons/license-token-no-sdk).

* * *

Connect a payment provider to automatically generate and deliver a license key by email when someone purchases your app, with no backend or webhooks needed. Keyforge supports **Stripe**, **Lemon Squeezy**, and **Polar** for both one-time purchases and subscriptions.

For subscriptions, license expiration dates update automatically on each renewal, and the license is deactivated if a subscription is cancelled. Follow the [payments setup guide](https://docs.keyforge.dev/addons/payment/setup/one-time) to connect your product. Customers can manage their licenses, devices, and billing through the [customer portal](https://keyforge.dev/portal/request).

### [License upgrades and renewals](#license-upgrades-and-renewals)

You can offer customers the option to upgrade their license to a higher tier or extend the expiration date of a timed license, directly from the customer portal with no code required. Configure up to 3 upgrade or renewal options per product in the dashboard.

### [Perpetual fallback](#perpetual-fallback)

Perpetual fallback lets customers continue using your app with limited functionality after their license expires, instead of losing access entirely. When enabled on a product, the validate endpoint returns `status: "fallbacked"` for expired licenses.

```
const data = await res.json();

if (data.status === 'active') {
  // Full access
} else if (data.status === 'fallbacked') {
  // License expired - grant limited access based on your product's logic
  console.log('Running in limited mode');
} else {
  // Invalid - prompt the user to re-enter their license key
}
```

For a deeper look at patterns and real-world examples, see [perpetual fallback access for desktop apps](https://keyforge.dev/blog/perpetual-fallback-desktop-apps).

* * *

With Keyforge, you can easily add secure license protection to your Tauri app in just a few lines of code, helping you monetize and distribute your software.

Use the REST API to activate and validate licenses, give users offline access when needed, and connect Stripe, Lemon Squeezy, or Polar to automate licenses, all without maintaining your own backend.
