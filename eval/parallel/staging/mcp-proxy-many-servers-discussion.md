# Guidance for building servers that act as proxy clients to many servers · modelcontextprotocol/modelcontextprotocol · Discussion #94

**Source:** https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/94
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Pre-submission Checklist I have verified this would not be more appropriate as a feature request in a specific repository I have searched existing discussions to avoid duplicates Your Idea I think ...

---

Thanks for flagging this! These are great points to think about.

Regarding your specific list:

> 1.  Server [InitializeResult](https://github.com/modelcontextprotocol/specification/blob/bb5fdd282a4d0793822a569f573ebc36804d38f8/schema/schema.ts#L160-L176) -- This assumes that: 1) the Server is a single, homogenous entity; 2) that a single set of instructions can govern the entire server; and 3) that a single version of the protocol is adequate. Of these, I think (2) is the thing that is most likely going to be problematic. The server could act as a homogenous veneer over a heterogeneous set of other servers and could expose a single protocol version to its clients.

Can you share more about the concern you think exists with (2)? If "instructions" refer to "how to use all the tools that the server provides" (for example), a server-of-servers seems like it could get most of the way by just naively concatenating the instructions from all its child servers. I'm curious if that seems inadequate, though!

> 2.  Named entities such as [Prompt](https://github.com/modelcontextprotocol/specification/blob/bb5fdd282a4d0793822a569f573ebc36804d38f8/schema/schema.ts#L554-L570) -- The protocol assumes that named entities live in a collision-free namespace. In an MCP proxy world, Tools, Prompts, and any other 'named' entities could have conflicting names between servers. This is also true today where multiple servers are free to declare the same tool. It's not clear how a client would resolve ambiguity in such a situation. A server could transparently add some namespacing or the protocol could be extended with some form of support.

I think it's _probably_ reasonable for clients to automatically namespace everything per-server (and this could apply to the server-of-servers with its children servers as well). There might be problems with this I'm not seeing, though. We certainly need to give more thought here.

> 3.  list\_changed [notifications](https://github.com/modelcontextprotocol/specification/blob/bb5fdd282a4d0793822a569f573ebc36804d38f8/schema/schema.ts#L673-L678) -- These notifications would invalidate the whole namespace when finer-grained invalidation might be more efficient. If a namespacing concept were to be introduced, these notifications could be augmented to limit their applicability to zero or more namespaces.

We probably want to extend these notifications to support delta updates regardless ("these things were added, these were deleted"), which might solve this problem too.

1 reply

[![@richardkmichael](https://avatars.githubusercontent.com/u/364390?s=60&v=4)](https://github.com/richardkmichael)

With respect to `instructions` and concatenation, perhaps it could change to being an object (instead of a string), and then it could gain `listChanged`? Using objects seems to have nicely provided a point for future extensions. FWIW, I have tried to use `instructions` in my MCP servers, with limited success due to lack of client awareness (I think); hopefully this improves.

> Can you share more about the concern you think exists with (2)? If "instructions" refer to "how to use all the tools that the server provides" (for example), a server-of-servers seems like it could get most of the way by just naively concatenating the instructions from all its child servers. I'm curious if that seems inadequate, though!

[@jspahrsummers](https://github.com/jspahrsummers), I think it's not adequate because I envision the set of configured servers changing over time. Even within the life-cycle of a single session. Maybe the tool allows servers to be _dynamically installed_? In this case, the instructions will be invalidated and the server will have no mechanism to inform clients.

0 replies

Servers acting as aggregators can work with the existing protocol by implementing their own namespacing. Some aggregators may not even want to expose their child servers directly; they can combine multiple low-level servers (e.g., filesystem, database) into a high-level, domain-specific API. The idea of having a server with the main purpose of reducing repeated logic in client applications is interesting, but I'd argue that libraries/SDKs are the ones that should take care of that. Very possible I'm missing something.

That said, building tree-like MCP applications does raise many questions. For example, imagine a leaf server requesting sampling from a root LLM through a few middle layers. It might help to have standard guidelines for forwarding requests and handling notifications, so each node doesn’t need to invent its own pass-through logic. Same goes for the other direction, i.e. notifying a downstream branch.

It's hard to speculate at this stage, we'll know more in a month or two when different patterns emerge.

0 replies

This sounds to me like a problem to solve at the discovery level. That is, say you have an server that exports a discovery endpoint like [https://github.com/orgs/modelcontextprotocol/discussions/84](https://github.com/orgs/modelcontextprotocol/discussions/84) you can define separate MCP server endpoints for serving. That is, you can use http urls as the namespace.

I think you'll continue to run into a set of things that break when trying to treat separate MCP servers as a single server (e.g. oauth with a proxy of numerous MCP subservers with their own oauth endpoints for each subset of the server sounds complicated). This may be fine for aggregating simple public servers -- but when trying to generalize further there will probably continue to be a number of things like this where trying to add more isolation within the MCP protocol will be complex for clients to adopt.

0 replies

[@ggoodman](https://github.com/ggoodman) I'm working on a similar problem, I think you're spot on with how you're thinking about the general flow here.

One question - could this all be as simple as introducing the notion of hierarchy to the various name fields?

So, a prompt name like "code\_review" becomes "@my-code-reviewer/code\_review" or "my-code-reviewer.com/code\_review"  
and a tool call follows a similar pattern?  
Then, for actual namespace scoping for general calls like tools/list, you could namespace before that:  
"my-code-review.com/tools/list"  
OR  
add a scoping property:

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {
    "namespace": "my-code-reviewer.com",
    "cursor": "optional-cursor-value"
  }
}
```

Myself and [@justinwilaby](https://github.com/justinwilaby) are working on a standardized search capability for servers with high volumes of tools and resources, and I think this fits in nicely with what we're working on:  
[#204](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/204)

We're specifically thinking about the enterprise use case of a proxy that proxies to numerous servers downstream from it and might have thousands or tens of thousands of tools exposed, way too many to simply list, and where you absolutely will have name collisions.

0 replies

Hey [@ggoodman](https://github.com/ggoodman) ,

I had similar feelings and built something you might find helpful. It sort of takes the approach [@jspahrsummers](https://github.com/jspahrsummers) mentioned, where it acts as a server of servers.

It's essentially a central ingress/load balancer that can route traffic to different mcp servers based on things like tool call names. [link](https://github.com/mclenhard/catie-mcp) if you are curious. It's completely open-source; hope it helps with your use case.

0 replies

[@mclenhard](https://github.com/mclenhard) just to confirm. Lets say you have many MCP servers (with different urls).  
You also have many different clients which could access those servers. Can all clients be routed through some sort of gateway proxy rather than accessing each MCP server directly?

This proxy gateway would:

-   handle auth, does the client have access to the MCP servers
-   limit scope, clients should only 'see' the MCP servers that they have access to (maybe based on token claims?)
-   be registry of all available MCP Servers and tools
-   act as a proxy to MCP server calls, so clients only ever call one endpoint for tool usage

Does that make sense? Has anyone built anything like this>?

5 replies

[![@mclenhard](https://avatars.githubusercontent.com/u/8460714?s=60&v=4)](https://github.com/mclenhard)

> You also have many different clients which could access those servers. Can all clients be routed through some sort of gateway proxy rather than accessing each MCP server directly?

That is correct. As for your other points, three and four are fully handled. For OAuth, right now, it just forwards the request. It does maintain a cache of sessions to ensure that requests get forwarded to whatever server was previously responsible for that session, but there's definitely more work to be done here.

Limiting scope is a good idea, and I've been thinking about it myself. I just haven't settled on the proper way to handle this yet. How much should go into my gateway vs. the application itself? I would love your thoughts if you have any here. Ideas and PR's are always welcome!

[![@mquadrat](https://avatars.githubusercontent.com/u/4668900?s=60&v=4)](https://github.com/mquadrat)

What you are describing is essentially an API gateway.

Always keep in mind that we have two identities on the client side. The identity of the actual client application and the one of the user on whose behalf the calls are made.

[![@mclenhard](https://avatars.githubusercontent.com/u/8460714?s=60&v=4)](https://github.com/mclenhard)

Yeah, it's an API gateway. Good call out. I didn't even think about the identity of the client itself, just the user. Probably some interesting tooling to be built there as well.

[![@mquadrat](https://avatars.githubusercontent.com/u/4668900?s=60&v=4)](https://github.com/mquadrat)

It's the same set of problems like in API management. Seems natural that we use the same or at least similar solutions. Of course my opinion might be biased coming from the APIM side of things :D

[![@chhamilton](https://avatars.githubusercontent.com/u/5147656?s=60&v=4)](https://github.com/chhamilton)

Regarding client (not user) identity: there are many use cases that are enabled by this, including anti-abuse mechanisms, quality of service mechanisms, "peering" agreements, auditability, etc.

There's already significant momentum behind using [HTTP Message Signatures](https://www.rfc-editor.org/rfc/rfc9421.html) to identify Agents on the web, as well as other non-AI use cases (crawlers, aggregators, proxy operators). See this [recent blogpost by CloudFlare](https://blog.cloudflare.com/en-us/web-bot-auth/), which mentions OpenAI's adoption of this standard. I know similar conversations have been happening across other anti-abuse vendors and agent operators. There's also [some conversation](https://github.com/jhoyla/draft-jhoyla-bot-auth-use-cases/pull/1/commits/bab4879613452d17b72ba63ce3a4127d6e40ded5) around using "optiona mTLS" as an alternative mechanism (one is much more "web developer persona" friendly, the other is more "network admin persona" friendly).

Since MCP servers may be proxies or aggregators of traffic themselves, I think it's going to be important for the MCP protocol to add identity mechanisms internally. Both when initialization a connection (for receiving and validating the identity of the entity making the inbound request), and also for outbound requests. I can also imagine wanting to chain these identities such that downstream entities would be able to say "I'm receiving this request from MCP client X who received a request from Agent Y". Making the chain of operators verifiable would enable many downstream use cases.

It's probably in the interest of MCP folks to participate in these conversations, and also to adopt these standards. For this to work well I also think we're going to want any A2A protocols to participate as well.

I'm currently solving the issue of namespacing by using slash separation.

For context, I'm building a [MCP registry+Proxy](https://github.com/duaraghav8/MCPJungle) (exactly what [@sterankin](https://github.com/sterankin) describes above) focused on enterprises.

Every MCP server registered in my proxy is its own namespace. Tools can only be called by using the format `<server>/<tool name>`.  
This allows different tools to have same name and still not cause a conflict.  
eg- `github/git_commit` and `github2/git_commit` - same tools from 2 different MCP servers in my registry.

But I've already run into several issues here:

1.  Claude outright [rejects](https://github.com/anthropics/claude-code/issues/985#issuecomment-2973621122) the tools from my proxy because of the `/` (its regexp doesn't allow slash in tool name)
2.  Tool names get distorted in Cursor because it removes the `/` and it ends up showing names like `githubgit_commit`).

So it seems like currently Anthropic is very restrictive on the whole namespacing concept.

The only good solution I found is to use double underscore `__` as the separator instead of `/`.  
But this seems too restrictive and unfriendly for developers.

Do people here have opinions on this? Would be great to have some guidance on how this should be handled properly

2 replies

[![@LucaButBoring](https://avatars.githubusercontent.com/u/131398524?s=60&v=4)](https://github.com/LucaButBoring)

It looks like [a lot](https://github.com/search?q=repo%3Aanthropics%2Fclaude-code+%22%5E%5Ba-zA-Z0-9_-%5D%7B1%2C64%7D%24%22&type=issues) of people are running into issues with that regex. Having no spec-defined limitations on tool names (beyond "a string") means strict validations are entirely left up to client application implementers when limitations of some sort are needed for security or other reasons. Claude Code requiring alphanumeric+dash+underscore tool names is much more restrictive than the spec allows for, though.

Might be worth having a spec-defined limitation here for clients to use where necessary.

[![@duaraghav8](https://avatars.githubusercontent.com/u/12758282?s=60&v=4)](https://github.com/duaraghav8)

I agree. Tool naming format should be defined as part of MCP spec.  
I also just found [this issue](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/277) that asks for it.

Hi, sharing some related notes that seem relevant here from the Technical Steering Committee meeting at the MCP Dev Summit on 5/23/25:

## More context from the discussion:

The suggestion below emerged during discussions about:

-   MCP proxy servers that aggregate multiple upstream servers
-   Security concerns about malicious servers duplicating tool names
-   The need for logical grouping without breaking existing implementations

The committee consensus was that namespacing should be:

-   A documented best practice, especially for proxy servers
-   Not a mandatory protocol requirement
-   Implementable without spec changes using current constraints

## Plan 9-inspired examples:

In [Plan 9](https://9p.io/plan9/), everything is a file and namespaces are per-process.

You can "mount" remote resources into your local namespace at any path, creating a unified hierarchical view.

How this concept could be applied to MCP Servers and Tools:

**Hierarchical Organization**

Just like Plan 9's file system, tools would have full paths:

```
/github/repos/search
/github/repos/create
/github/issues/list
/slack/channels/post
/slack/users/lookup
```

**Remote Server Mounting**

A proxy server could dynamically mount remote MCP servers, eg:

\# Conceptual example
proxy.mount("https://api.github.com/mcp", "/github/")
proxy.mount("https://slack-mcp.com", "/slack/")
proxy.mount("local-file-server", "/files/")

## Advantages mentioned at the meeting:

-   **"achieving backward compatibility without reserving characters"** - Existing tools keep their names; the path prefix is added by the mounting layer
-   **"can incorporate URLs of remote MCP servers"** - The mount point could be derived from or include the server's URL
-   **"uses a string prefix, which is easier to enforce"** - Simple string concatenation rather than complex escaping rules

## Current allowed character limitations

As noted in the meeting (and by [@duaraghav8](https://github.com/duaraghav8) above), MCP tool names must match `^[a-zA-Z0-9_-]{1,64}$`, so actual forward slashes can't be used. Implementations would need to encode the hierarchy, eg:

```
/web1/search_web → web1_search_web
/github/repos/create → github_repos_create
```

## Other approaches discussed for avoiding Tool name collisions and naming:

-   Simple server-based prefixing (e.g., `web1_search_web`) -> Covered in [this PR](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/701)
-   Generated/random prefixes (e.g., `jrwxs_search_web`) -> Covered in [this PR](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/701)
-   Future additions like display names and labels/tags -> Covered in [this PR](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/663/files) and future proposals

2 replies

[![@patwhite](https://avatars.githubusercontent.com/u/5015863?s=60&v=4)](https://github.com/patwhite)

[@olaservo](https://github.com/olaservo) Thanks for writing this up - the main thing that this misses vs [this PR](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/334) is the ability to scope down tool lists by namespace. So, while this handle the naming collision issue, it does NOT handle namespaces as a way to implement interfaces or "workspaces" where a small set of tools are composed for better grokability by agents (ie smaller sets of tools to select from rather than huge lists).

[@evalstate](https://github.com/evalstate) did some tests that current LLM context max out remarkably early with tools, something in the range of 100 tools I believe (please correct me if I'm wrong). So, a major component of [#334](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/334) is ways to scope the tool sets down. That DOES require a small protocol change, and I think is an incredibly important because it allows scoping down of lists. So, a client could conceivably get or search namespaces, or present namespaces to the user to select, then have a constrained set of tools.

A bit of information that I found really good - this isn't JUST for proxying, it's important for companies with large api surface areas. Microsoft's office api (Graph) has 26,000 endpoints - if 100 tool is the max, that's 260 servers they have to maintain, expose, and teach the models how to orchestrate across (I have no idea how they do that tbh), or teach their business analyst users how to connect to different servers. This is as opposed to, with namespaces, where you could namespace by feature area, then expose some targeted namespaces like "send email" that expose tools draft email, send email, spell check.

[@cliffhall](https://github.com/cliffhall) ^ you might like this use case too for similar reasons.

So, without a protocol change, you are still limited in the number of tools on a server because you can't list tools from just a single namespace, so we haven't really accomplished anything with "guidance."

[![@olaservo](https://avatars.githubusercontent.com/u/16480113?s=60&v=4)](https://github.com/olaservo)

Thanks [@patwhite](https://github.com/patwhite), you're absolutely right that the mounting approach I described from the Dev Summit doesn't by itself address the tool discovery/listing problem for large servers. Apologies for maybe combining topics too much here.

To clarify a little more: I think the 'guidance vs prescriptive' comment was specifically focused on the name collision aspect, not so much the scale/filtering challenge.

(Edited)

My only small reservation here would be that the function names can impact LLM behavior, so a system where the function names can change easily might impact re-use of prompts or agent reliability. If user A mounts Slack endpoints at "slack/" and user B mounts them at "comms/" then you could get pretty divergent behavior. I suspect people end up promoting a "recommended" prefix anyway...

2 replies

[![@LucaButBoring](https://avatars.githubusercontent.com/u/131398524?s=60&v=4)](https://github.com/LucaButBoring)

Part of this also comes down to having high-quality tool descriptions - if I mount Slack tools at `comms/` and the tool descriptions don't specify that those are Slack tools, the model probably won't know what I want if I ask it to post in a Slack channel, as opposed to if I mount those tools at `slack/` instead. But if the tool description does have that information, it shouldn't matter either way. There may be some divergence but I'd expect (hope?) it'd be negligible.

That puts the onus strongly on server authors to write good tool descriptions, which isn't always the case, however.

[![@richardkmichael](https://avatars.githubusercontent.com/u/364390?s=60&v=4)](https://github.com/richardkmichael)

I think this will also be less of an issue as clients hopefully gain more awareness of the server [`instructions`](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle) property in the [InitializeResult](https://github.com/modelcontextprotocol/typescript-sdk/blob/c40193933a43b61d40e616b7ab513e87b3d978de/src/types.ts#L348-L361). The server can tell the client about itself, providing more context to the client.

I have tried to use this in my own MCP servers, but unfortunately, at least Claude seems unaware of it. I haven't used other clients.

Sharing my project MetaMCP, a MCP proxy + aggregator. You can group MCP servers into namespaces then assign endpoints to them. You can also filter tools out, search feature WIP. [https://github.com/metatool-ai/metamcp](https://github.com/metatool-ai/metamcp)

Btw I think there are 2 dimensions logical group may consider: like typical blog posts, there are categories and tags concepts, where a blog can only fall into one category, but can have many tags, and the filter by tag can be both "AND" or "OR" logic.

Similarly from a tool search perspective, a category is a elasticsearch like "index", then within the index you can filter by tags, apply search dsls, or have vector search combined in hybrid mode to take in user intent from natural language.

1 reply

[![@patwhite](https://avatars.githubusercontent.com/u/5015863?s=60&v=4)](https://github.com/patwhite)

Ya, you and I are working on similar projects - if you check out [#322](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/322) you'll see a full proposal around search, I'm 100% in agreement we need a protocol level mechanism for search

I don't see this explicitly mentioned here but In an MCP gateway, the tool, prompt, resource names are used for routing to the right MCP server implementing that specific resource. It seems unlikely to happen, but implementations should consider that a tool name may include the used separator string (like \_\_\_). MCP gateways can't just assume that the last part of the tool name after splitting using the separator is the actual resource name and anything else is the server name.

1 reply

[![@duaraghav8](https://avatars.githubusercontent.com/u/12758282?s=60&v=4)](https://github.com/duaraghav8)

I actually thought about this a lot. As of today, given the lack of naming convention in MCP spec and the strict RegExp in Claude code & desktop, the double/triple underscore is the best way to create separation between tool name & server name within a Gateway for routing.  
The compromise here is then that such a Gateway should reject any tool name that itself contains `___`. IMO this is not a big issue because mostly nobody uses it in tool names, from what I've seen.

But I would definitely love to see:

1.  Claude makes its tool naming RegExp a lot more permissive
2.  MCP spec contains the regexp on tool naming (also permissive)

### 

This comment was marked as spam.

### 

This comment was marked as spam.

### 

This comment was marked as spam.

Maintainer disclosure: I build [Better Agent](https://github.com/ofekron/better-agent), which syncs MCP configuration across Claude, Codex, and Gemini and detects drift between a conversation’s start-time capabilities and the desired current set.

A proxy-of-servers is more than a naming layer; it becomes a **session and authority boundary**. A few constraints I would make explicit:

-   Keep an immutable internal upstream ID separate from the model-facing tool name. Prefixes can satisfy current client regexes, but routing should resolve to (upstream\_id, entity\_id, schema\_hash), not parse a separator back out of a display name.
-   Record that resolved tuple when accepting a call. If configuration changes before execution/retry, the call must not silently route to a different server or changed schema.
-   Do not share one upstream session across tenants or callers when roots, auth, sampling, elicitation, environment, or stateful tools differ. Session affinity must include the effective principal and capability context.
-   Treat reverse-direction requests—sampling, elicitation, roots, logging—as independently authorized hops. A trusted leaf must not inherit a root client’s permissions merely because the proxy can forward the method.
-   Keep credentials owned by scope and upstream; never concatenate them into a shared child environment or expose them through aggregated instructions.
-   Version the proxy manifest. list\_changed can refresh tools/prompts/resources, but changes to initialize-time capabilities or trust policy should require a new negotiated session rather than pretending the existing session always had them.
-   When an upstream disappears, report unavailable vs unknown vs unauthorized distinctly. Automatic fallback is safe only for explicitly equivalent, idempotent operations.

For dynamic configuration, the practical rule we use is: native start-time integration remains authoritative; if a resumed provider conversation lacks newly desired tools, add only the missing capability for that turn when the provider supports it. Do not replace a working native integration or mutate the whole tool universe invisibly.

That gives the proxy one source of truth for configuration while preserving each client session’s negotiated reality.

License note for the implementation reference: Better Agent is source-available and free for non-commercial use; commercial use requires separate permission.

0 replies
