# License tokens | Keyforge Docs

**Source:** https://docs.keyforge.dev/addons/license-token-no-sdk
**Added:** 2026-08-24
**Tags:** #unsorted

---

> It's common to have apps that need to work even without an internet connection. Keyforge makes it easy to validate licenses oflline.

---

It's common to have apps that need to work even without an internet connection. Keyforge makes it easy to validate licenses oflline.

To make this possible, Keyforge issues a signed license token that is verified on the client. The token is a **JWT** and contains information about the license.

An internet connection is only required to activate the license and to occasionally refresh the license token.

License tokens can be used in any programming language that supports JWTs, but there is a client SDK available for JavaScript.

### [Configure license tokens for a product](#configure-license-tokens-for-a-product)

Go to [license tokens](https://keyforge.dev/dashboard/addons/license-token) and add a new product. You can edit how much time a token will be valid for, and other options after creating the new configuration.

For setups with more than one product, duplicate the signing key pair from another product inside the **edit** menu. You can also import an external key pair.

### [Retrieve initial token](#retrieve-initial-token)

The simplest way to get and store the first license token on a device is after activating a license. You should use the [activate license](https://docs.keyforge.dev/api-reference/public/public-activate-license) API endpoint.

```
curl -X POST https://keyforge.dev/api/v1/public/licenses/activate \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "ABCDE-ABCDE-ABCDE-ABCDE-ABCDE",
    "deviceIdentifier": "some_device_id",
    "deviceName": "My device",
    "productId": "p_123456"
  }'
```

A `token` property will be returned in the response. Store this token in the device's storage.

### [Verify the token](#verify-the-token)

To verify the token, use any [JWT library](https://jwt.io/libraries) available in your programming language. Here are some tips you should follow:

-   The token is signed using an **ES256** key pair. The public key is in the [dashboard](https://keyforge.dev/dashboard/addons/license-token).
-   Check the `exp` claim to see if the token is still valid.
-   Check `productId` and `deviceIdentifier` to make sure the token is valid for the current product and device.
-   Do not ask the user to activate a license if the token is expired but was valid at some point. Try to refresh it first, and if it fails, then ask the user to activate a license.

The token should be verified when the app starts, but it can also be verified periodically.

### [Refresh the token](#refresh-the-token)

The token needs to be refreshed periodically to ensure it remains valid. Use the [license token](https://docs.keyforge.dev/api-reference/public/public-license-token) API endpoint.

You should refresh the token some time before it expires, for example, 3 days before the expiration date.

```
curl -X POST https://keyforge.dev/api/v1/public/licenses/token \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "ABCDE-ABCDE-ABCDE-ABCDE-ABCDE",
    "deviceIdentifier": "some_device_id",
    "productId": "p_123456"
  }'
```

A `token` property will be returned in the response. Store this token in the device's storage.

Here is an example of how the license token verification workflow could look like in an application:

### [Token payload](#token-payload)

A signed license token contains the following data:

```
{
  "status": "active",
  "license": {
    "key": "ABCDE-ABCDE-ABCDE-ABCDE-ABCDE",
    "productId": "p_123456",
    "type": "perpetual",
    "expiresAt": null,
    "createdAt": 1684521573, // Unix timestamp in seconds
    "maxDevices": 5,
    "email": null
  },
  "device": {
    "identifier": "some_device_id",
    "name": "My device",
    "activationDate": 1684521573 // Unix timestamp in seconds
  }
}
```

There are also some additional claims in the token, such as `exp` (expiration time) and `iat` (issued at time). It is signed using the **ES256** algorithm.

### [API Reference](#api-reference)
