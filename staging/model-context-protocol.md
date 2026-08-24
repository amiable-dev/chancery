# Tools - Model Context Protocol

**Source:** https://modelcontextprotocol.io/specification/2026-07-28/server/tools
**Added:** 2026-08-24
**Tags:** #unsorted

---

> The Model Context Protocol (MCP) allows servers to expose tools that can be invoked by
language models. Tools enable models to interact with external systems, such as querying
databases, calling APIs, or performing computations. Each tool is uniquely identified by
a name and includes metadata describing its schema.

---

The Model Context Protocol (MCP) allows servers to expose tools that can be invoked by language models. Tools enable models to interact with external systems, such as querying databases, calling APIs, or performing computations. Each tool is uniquely identified by a name and includes metadata describing its schema.

## User Interaction Model

Tools in MCP are designed to be **model-controlled**, meaning that the language model can discover and invoke tools automatically based on its contextual understanding and the user’s prompts. However, implementations are free to expose tools through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.

## Capabilities

Servers that support tools **MUST** declare the `tools` capability:

`listChanged` indicates whether the server will emit notifications when the list of available tools changes. Servers that declare the `tools` capability **MUST** respond to `tools/list` requests with the set of tools currently available to the requesting client. This set **MAY** be empty and **MAY** change over time (see [List Changed Notification](#list-changed-notification)), but **MUST NOT** vary per-connection or as a side effect of other requests on the connection. The set **MAY** vary by the authorization presented on the request — for example, returning only the tools the caller’s granted scopes permit — since credentials are per-request input, not connection state. Servers **SHOULD** return tools in a deterministic order (i.e., the same ordering across requests when the underlying set of tools has not changed). Deterministic ordering enables clients to reliably cache the tool list and improves LLM prompt cache hit rates when tools are included in model context.

## Protocol Messages

### Listing Tools

To discover available tools, clients send a `tools/list` request. This operation supports [pagination](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/pagination) and [caching](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/caching). **Request:**

**Response:**

### Calling Tools

To invoke a tool, clients send a `tools/call` request: **Request:**

**Response:**

### Input Required Tool Results

Servers **MAY** respond to `tools/call` with an [`InputRequiredResult`](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr#inputrequiredresult) to indicate that additional input is needed before the tool call can be completed. This follows the [multi round-trip requests](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr#multi-round-trip-requests) mechanism. When retrying the request with input responses, clients include `inputResponses` and, if provided by the server, `requestState` in the request parameters: **Input Required Response:**

**Retry with Input Responses:**

Note that the JSON-RPC `id` **MUST** be different between the initial request and the retry.

### List Changed Notification

When the list of available tools changes, servers that declared the `listChanged` capability **SHOULD** send a notification to clients that have opened a [`subscriptions/listen`](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/subscriptions) stream with `toolsListChanged: true`:

## Message Flow

## Data Types

### Tool

A tool definition includes:

-   `name`: Unique identifier for the tool
-   `title`: Optional human-readable name of the tool for display purposes.
-   `description`: Human-readable description of functionality
-   `icons`: Optional array of icons for display in user interfaces
-   `inputSchema`: JSON Schema defining expected parameters
    -   Follows the [JSON Schema usage guidelines](https://modelcontextprotocol.io/specification/2026-07-28/basic#json-schema-usage)
    -   Defaults to 2020-12 if no `$schema` field is present
    -   **MUST** be a valid JSON Schema object (not `null`)
    -   For tools with no parameters, use one of these valid approaches:
        -   `{ "type": "object", "additionalProperties": false }` - **Recommended**: explicitly accepts only empty objects
        -   `{ "type": "object" }` - accepts any object (including with properties)
    -   Properties **MAY** include an [`x-mcp-header`](#x-mcp-header) annotation to expose parameter values as HTTP headers
-   `outputSchema`: Optional JSON Schema defining expected output structure
    -   Follows the [JSON Schema usage guidelines](https://modelcontextprotocol.io/specification/2026-07-28/basic#json-schema-usage)
    -   Defaults to 2020-12 if no `$schema` field is present
-   `annotations`: Optional properties describing tool behavior

#### Tool Names

-   Tool names **SHOULD** be between 1 and 128 characters in length (inclusive).
-   Tool names **SHOULD** be considered case-sensitive.
-   The following **SHOULD** be the only allowed characters: uppercase and lowercase ASCII letters (A-Z, a-z), digits (0-9), underscore (\_), hyphen (-), and dot (.)
-   Tool names **SHOULD NOT** contain spaces, commas, or other special characters.
-   Tool names **SHOULD** be unique within a server.
-   Example valid tool names:
    -   `getUser`
    -   `DATA_EXPORT_v2`
    -   `admin.tools.list`

The `x-mcp-header` extension property allows servers to designate specific tool parameters to be mirrored into HTTP headers when using the [Streamable HTTP transport](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http#custom-headers-from-tool-parameters). This enables network intermediaries (load balancers, proxies, WAFs) to route and process requests based on parameter values without parsing the request body. The `x-mcp-header` property is placed directly within the JSON Schema of the property to be mirrored. Its value specifies the name portion of the resulting `Mcp-Param-{name}` HTTP header. **Constraints on `x-mcp-header` values:**

-   **MUST NOT** be empty
-   **MUST** match HTTP field-name token syntax (`1*tchar`, [RFC 9110 Section 5.1](https://datatracker.ietf.org/doc/html/rfc9110#section-5.1))
-   **MUST NOT** contain control characters, including carriage return (CR, `\r`) or line feed (LF, `\n`)
-   **MUST** be case-insensitively unique among all `x-mcp-header` values in the `inputSchema`
-   **MUST** only be applied to parameters with primitive types (integer, string, boolean). Parameters with type `number` are not permitted. Integer values **MUST** be within the safe range for integers represented using IEEE754 double-precision floating point numbers (−253+1 to 253−1)
-   **MUST** only be applied to properties that are _statically reachable_ from the schema root, as defined in [Custom Headers from Tool Parameters](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http#custom-headers-from-tool-parameters), which also defines how header values are extracted from call arguments

Clients using the Streamable HTTP transport **MUST** reject tool definitions where any `x-mcp-header` value violates these constraints. Rejection means the client **MUST** exclude the invalid tool from the result of `tools/list`. Clients **SHOULD** log a warning when rejecting a tool definition, including the tool name and the reason for rejection. This ensures that a single malformed tool definition does not prevent other valid tools from being used. Clients using other transports (e.g., stdio) **MAY** ignore `x-mcp-header` annotations entirely. **Example tool definition with `x-mcp-header`:**

In this example, when the tool is called with `"region": "us-west1"`, the client adds the header `Mcp-Param-Region: us-west1` to the HTTP request.

### Tool Result

Tool results may contain [**structured**](#structured-content) or **unstructured** content. **Unstructured** content is returned in the `content` field of a result, and can contain multiple content items of different types:

#### Text Content

#### Image Content

#### Audio Content

#### Resource Links

A tool **MAY** return links to [Resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources), to provide additional context or data. In this case, the tool will return a URI that can be subscribed to or fetched by the client:

Resource links support the same [Resource annotations](https://modelcontextprotocol.io/specification/2026-07-28/server/resources#annotations) as regular resources to help clients understand how to use them.

#### Embedded Resources

[Resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources) **MAY** be embedded to provide additional context or data using a suitable [URI scheme](https://modelcontextprotocol.io/specification/2026-07-28/server/resources#common-uri-schemes). Servers that use embedded resources **SHOULD** implement the `resources` capability:

Embedded resources support the same [Resource annotations](https://modelcontextprotocol.io/specification/2026-07-28/server/resources#annotations) as regular resources to help clients understand how to use them.

#### Structured Content

**Structured** content is returned as a JSON value in the `structuredContent` field of a result. This can be any JSON value (object, array, string, number, boolean, or null) that conforms to the tool’s `outputSchema` if one is defined. For backwards compatibility, a tool that returns structured content SHOULD also return the serialized JSON in a TextContent block.

#### Output Schema

Tools may also provide an output schema for validation of structured results. If an output schema is provided:

-   Servers **MUST** provide structured results that conform to this schema.
-   Clients **SHOULD** validate structured results against this schema.

Example tool with output schema:

Example valid response for this tool:

Example tool with array output schema:

Example valid response for a tool with array output:

Providing an output schema helps clients and LLMs understand and properly handle structured tool outputs by:

-   Enabling strict schema validation of responses
-   Providing type information for better integration with programming languages
-   Guiding clients and LLMs to properly parse and utilize the returned data
-   Supporting better documentation and developer experience

### Schema Examples

#### Tool with default 2020-12 schema:

#### Tool with explicit draft-07 schema:

#### Tool with no parameters:

## Stateful Tools

MCP has no protocol-level session, so a server cannot rely on implicit per-connection state to relate one tool call to the next. Servers that need to maintain state across calls — a shopping cart, an open browser context, a database transaction — should do so by returning an explicit handle from a creation tool and accepting that handle as an argument on subsequent calls. For example, a server that manages a shopping cart might expose:

The model is responsible for carrying `basket_id` forward; the server stores the cart contents under that key and looks them up on each call. When designing handles, servers should consider:

-   **Authorization.** For authenticated servers, a handle is a name, not a capability. The server should validate the caller’s authorization against the handle on every call. For unauthenticated servers, where the handle is necessarily a bearer token, it should be generated with sufficient entropy (e.g., a UUIDv4) and given a bounded lifetime.
-   **Opacity.** Handles that encode internal structure invite parsing or guessing; opaque identifiers do not.
-   **Lifetime.** Because handles outlive any single connection, the server’s retention policy should be stated in the creation tool’s description (e.g., “baskets expire after 24 hours of inactivity”) so the model can see it when deciding to create state.
-   **Expiry errors.** A call against an expired or unknown handle should return a tool execution error that says so, so the model can recover by creating a new one.

## Error Handling

Tools use two error reporting mechanisms:

1.  **Protocol Errors** indicate issues with the request structure itself that models are less likely to be able to fix:
    
    -   Unknown tool
    -   Malformed requests (requests that fail to satisfy [CallToolRequest schema](https://modelcontextprotocol.io/specification/2026-07-28/schema#calltoolrequest))
    -   Server errors
    
    They are returned as standard JSON-RPC errors:
2.  **Tool Execution Errors** contain actionable feedback that language models can use to self-correct and retry with adjusted parameters:
    
    -   API failures
    -   Input validation errors (e.g., date in wrong format, value out of range)
    -   Business logic errors
    
    They are reported in tool results with `isError: true`:

Clients **MAY** provide protocol errors to language models, though these are less likely to result in successful recovery. Clients **SHOULD** provide tool execution errors to language models to enable self-correction.

## Security Considerations

1.  Servers **MUST**:
    -   Validate all tool inputs
    -   Implement proper access controls
    -   Rate limit tool invocations
    -   Sanitize tool outputs
2.  Clients **SHOULD**:
    -   Prompt for user confirmation on sensitive operations
    -   Show tool inputs to the user before calling the server, to avoid malicious or accidental data exfiltration
    -   Validate tool results before passing to LLM
    -   Follow the [`$ref` resolution requirements](https://modelcontextprotocol.io/specification/2026-07-28/basic/index#ref-resolution) when validating tool inputs and outputs against `inputSchema` and `outputSchema`
    -   Implement timeouts for tool calls
    -   Log tool usage for audit purposes
