# Caching · Cloudflare AI Gateway docs

**Source:** https://developers.cloudflare.com/ai-gateway/features/caching/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Override caching settings on a per-request basis.

---

AI Gateway can cache responses from your AI model providers, serving them directly from Cloudflare's cache for identical requests.

-   **Reduced Latency:** Serve responses faster to your users by avoiding a round trip to the origin AI provider for repeated requests.
-   **Cost Savings:** Minimize the number of paid requests made to your AI provider, especially for frequently accessed or non-dynamic content.
-   **Increased Throughput:** Offload repetitive requests from your AI provider, allowing it to handle unique requests more efficiently.

To set the default caching configuration in the dashboard:

1.  Log into the [Cloudflare dashboard ↗](https://dash.cloudflare.com/) and select your account.
2.  Select **AI** > **AI Gateway**.
3.  Select **Settings**.
4.  Enable **Cache Responses**.
5.  Change the default caching to whatever value you prefer.

To set the default caching configuration using the API:

1.  [Create an API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) with the following permissions:

-   `AI Gateway - Read`
-   `AI Gateway - Edit`

2.  Get your [Account ID](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/).
3.  Using that API token and Account ID, send a [`POST` request](https://developers.cloudflare.com/api/resources/ai_gateway/methods/create/) to create a new Gateway and include a value for the `cache_ttl`.

This caching behavior will be uniformly applied to all requests that support caching. If you need to modify the cache settings for specific requests, you have the flexibility to override this setting on a per-request basis.

To check whether a response comes from cache or not, **cf-aig-cache-status** will be designated as `HIT` or `MISS`.

By default, AI Gateway constructs the cache key by concatenating the following and hashing the result with SHA-256:

-   **Provider** (for example, `openai`, `anthropic`)
-   **Endpoint** (the API path)
-   **Model** (for example, `gpt-4o`)
-   **Provider authentication header** (for example, the `Authorization` bearer token)
-   **Full request body**

This means caching is based on **exact match** of the entire request. Any difference in the body — including messages, tools, or model parameters — will result in a separate cache entry. To override this behavior, use the [custom cache key header](#custom-cache-key-cf-aig-cache-key).

While your gateway's default cache settings provide a good baseline, you might need more granular control. These situations could include data freshness, content with varying lifespans, or dynamic or personalized responses.

To address these needs, AI Gateway allows you to override default cache behaviors on a per-request basis using specific HTTP headers. This gives you the precision to optimize caching for individual API calls.

The following headers allow you to define this per-request cache behavior:

Skip cache refers to bypassing the cache and fetching the request directly from the original provider, without utilizing any cached copy.

You can use the header **cf-aig-skip-cache** to bypass the cached version of the request.

As an example, when submitting a request to OpenAI, include the header in the following manner:

Request skipping the cachebash

```
# Run `wrangler whoami` to get your account ID to replace $CLOUDFLARE_ACCOUNT_ID,
# and `wrangler auth token` to get an auth token to replace $CLOUDFLARE_API_TOKEN.
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/v1/chat/completions" \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --header "Content-Type: application/json" \
  --header "cf-aig-skip-cache: true" \
  --data '{
    "model": "openai/gpt-4.1-mini",
    "messages": [
      {
        "role": "user",
        "content": "how to build a wooden spoon in 3 short steps? give as short as answer as possible"
      }
    ]
  }'
```

Cache TTL, or Time To Live, is the duration a cached request remains valid before it expires and is refreshed from the original source. You can use **cf-aig-cache-ttl** to set the desired caching duration in seconds. The minimum TTL is 60 seconds and the maximum TTL is one month.

For example, if you set a TTL of one hour, it means that a request is kept in the cache for an hour. Within that hour, an identical request will be served from the cache instead of the original API. After an hour, the cache expires and the request will go to the original API for a fresh response, and that response will repopulate the cache for the next hour.

As an example, when submitting a request to OpenAI, include the header in the following manner:

Request to be cached for an hourbash

```
# Run `wrangler whoami` to get your account ID to replace $CLOUDFLARE_ACCOUNT_ID,
# and `wrangler auth token` to get an auth token to replace $CLOUDFLARE_API_TOKEN.
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/v1/chat/completions" \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --header "Content-Type: application/json" \
  --header "cf-aig-cache-ttl: 3600" \
  --data '{
    "model": "openai/gpt-4.1-mini",
    "messages": [
      {
        "role": "user",
        "content": "how to build a wooden spoon in 3 short steps? give as short as answer as possible"
      }
    ]
  }'
```

Custom cache keys let you override the default cache key in order to precisely set the cacheability setting for any resource. To override the default cache key, you can use the header **cf-aig-cache-key**.

When you use the **cf-aig-cache-key** header for the first time, you will receive a response from the provider. Subsequent requests with the same header will return the cached response. If the **cf-aig-cache-ttl** header is used, responses will be cached according to the specified Cache Time To Live. Otherwise, responses will be cached according to the cache settings in the dashboard. If caching is not enabled for the gateway, responses will be cached for 5 minutes by default.

As an example, when submitting a request to OpenAI, include the header in the following manner:

Request with custom cache keybash

```
# Run `wrangler whoami` to get your account ID to replace $CLOUDFLARE_ACCOUNT_ID,
# and `wrangler auth token` to get an auth token to replace $CLOUDFLARE_API_TOKEN.
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/v1/chat/completions" \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --header "Content-Type: application/json" \
  --header "cf-aig-cache-key: responseA" \
  --data '{
    "model": "openai/gpt-4.1-mini",
    "messages": [
      {
        "role": "user",
        "content": "how to build a wooden spoon in 3 short steps? give as short as answer as possible"
      }
    ]
  }'
```
