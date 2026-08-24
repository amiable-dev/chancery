# Open Policy Agent (OPA) | Open Policy Agent

**Source:** https://www.openpolicyagent.org/docs
**Added:** 2026-08-24
**Tags:** #unsorted

---

> The Open Policy Agent (OPA, pronounced "oh-pa") is an open source,

---

The Open Policy Agent (OPA, pronounced "oh-pa") is an open source, general-purpose policy engine that unifies policy enforcement across the stack. OPA provides a high-level declarative language that lets you specify policy as code and simple APIs to offload policy decision-making from your software. You can use OPA to enforce policies in microservices, Kubernetes, CI/CD pipelines, API gateways, and more. OPA is proud to be a graduated [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/announcements/2021/02/04/cloud-native-computing-foundation-announces-open-policy-agent-graduation/) project.

> **Prefer to get hands on?** Checkout the [online playground](https://play.openpolicyagent.org/) or the [CLI examples](#2-try-opa-eval) below.

OPA [decouples](https://www.openpolicyagent.org/docs/philosophy#policy-decoupling) policy decision-making from policy enforcement. When your software needs to make policy decisions it **queries** OPA and supplies structured data (e.g., JSON) as input. OPA accepts arbitrary structured data as input.

OPA generates policy decisions by evaluating the query input against policies and data. OPA and Rego are domain-agnostic so you can describe almost any kind of rule in your policies. For example:

-   What roles must a user have to access a particular resource
-   Which network ranges egress traffic is allowed to
-   Allowed registries to source container images
-   When during the day the system can be accessed
-   The System Calls a binary in a container can make

Policy decisions are not limited to simple yes/no or allow/deny answers. Like query inputs, your policies can generate arbitrary structured data as output.

The following example illustrates this. Imagine you work for an organization with a number of servers connected to managed networks via ports:

Servers communicate using protocols (such as `http`, `ssh`, etc.) over ports, which attach them to public or private networks. This infrastructure is provisioned as code, represented in JSON:

```
{  "servers": [    { "id": "app", "protocols": ["https", "ssh"], "ports": ["p1", "p2", "p3"] },    { "id": "db", "protocols": ["mysql"], "ports": ["p3"] },    { "id": "cache", "protocols": ["memcache"], "ports": ["p3"] },    { "id": "ci", "protocols": ["http"], "ports": ["p1", "p2"] },    { "id": "busybox", "protocols": ["telnet"], "ports": ["p1"] }  ],  "networks": [    { "id": "net1", "public": false },    { "id": "net2", "public": false },    { "id": "net3", "public": true }  ],  "ports": [    { "id": "p1", "network": "net1" },    { "id": "p2", "network": "net3" },    { "id": "p3", "network": "net2" }  ]}
```

Your organization has established the following security policy that must be implemented:

> 1.  Servers reachable from the Internet must not expose the insecure 'http' protocol.
> 2.  Servers are not allowed to expose the 'telnet' protocol.

The policy needs to be enforced when servers, networks, and ports are provisioned and the compliance team wants to periodically audit the system to find servers that violate the policy.

The following section explores how OPA can help implement this policy.

## Writing Policies with Rego[​](#writing-policies-with-rego "Direct link to Writing Policies with Rego")

OPA policies are expressed in a high-level declarative language called Rego. Rego (pronounced "ray-go") is purpose-built for expressing policies over complex hierarchical data structures. For detailed information on Rego see the [Policy Language](https://www.openpolicyagent.org/docs/policy-language) documentation.

tip

The examples below are interactive! If you edit the input data above containing servers, networks, and ports, the output will change below. Similarly, if you edit the queries or rules in the examples below the output will change. As you read through this section, try changing the input, queries, and rules and observe the difference in output.

They can also be run locally on your machine using the [`opa eval` command, here are setup instructions.](#install-and-run-opa)

note

This section covers the building blocks of writing policies in Rego. You can see how these concepts come together to solve the network security policy in the [Complete Example](#complete-example).

### Basic Syntax[​](#basic-syntax "Direct link to Basic Syntax")

To implement the security policy, the first step is to access and examine the infrastructure data. When OPA evaluates policies, it binds data provided in the query to a global variable called `input`. You can refer to specific parts of the input data using the `.` (dot) operator.

```
package serversoutput := input.servers
```

Loading...

To refer to array elements you can use the familiar square-bracket syntax:

```
package serversoutput := input.servers[0].protocols[0]
```

Loading...

tip

You can use the same square bracket syntax if keys contain other than `[a-zA-Z0-9_]`. E.g., `input["foo~bar"]`.

If you refer to a value that does not exist, OPA returns _undefined_. Undefined means that OPA was not able to find any results.

```
package serversoutput := input.foobar
```

Loading...

The most simple policy decisions are made by writing expressions that perform logical operations on the input data. For example, to check if a server has a specific ID, use an equality check with `==`.

```
package serversoutput := input.servers[0].id == "app"
```

Loading...

OPA includes a set of [built-in functions](https://www.openpolicyagent.org/docs/policy-reference/builtins) you can use to perform common operations like string manipulation, regular expression matching, arithmetic, aggregation, and more.

```
package serversoutput := count(input.servers[0].protocols) >= 1
```

Loading...

For queries to produce results, all of the expressions in the query must be true or defined. You can separate expressions across multiple lines (or optionally join them with `;` - meaning AND, on a single line):

```
package serversoutput if {    input.servers[0].id == "app"    input.servers[0].protocols[0] == "https"}
```

Loading...

If any of the expressions in the query are not true (or defined) the result is undefined. In the example below, the second expression is false:

```
package serversoutput if {    input.servers[0].id == "app"    input.servers[0].protocols[0] == "telnet"}
```

Loading...

note

Expressions are joined together with AND only when they are in the same rule body. In this example, the checks against `input.servers` are OR'd since they are in different rule bodies. See [Logical OR](#logical-or) in the Rules section below for more detail.

```
output if {    input.servers[0].id == "app"}output if {    input.servers[0].protocols[0] == "telnet"}
```

You can store values in intermediate variables using the `:=` (assignment) operator to help make more complex rules easier to read. Variables can be referenced just like `input` and are, like `input`, immutable.

```
package serversoutput if {    s := input.servers[0]    s.id == "app"    p := s.protocols[0]    p == "https"}
```

Loading...

When OPA evaluates expressions, it finds values for the variables that make all of the expressions true. If there are no variable assignments that make all of the expressions true, the result is undefined.

```
package serversoutput if {    s := input.servers[0]    s.id == "app"    s.protocols[1] == "telnet"}
```

Loading...

Imagine you need to check if any networks are public. Recall that the networks are supplied inside an array:

`[{"id": "net1", "public": false}, {"id": "net2", "public": false}, ...]`

To solve this problem, you might naively first think to test each network individually by checking specific array indices like this:

```
package servers# if any are true, the result of the exists_public_network is true.exists_public_network if input.networks[0].public == true# orexists_public_network if input.networks[1].public == true# orexists_public_network if input.networks[2].public == true# orexists_public_network if input.networks[3].public == true# ...
```

Loading...

This approach is problematic, there may be too many networks to list statically, the number of networks may not be known in advance.

Like other declarative languages (e.g., SQL), iteration in Rego happens implicitly. The solution for this case is to use `some ... in ...` to iterate over the collection:

```
package serversexists_public_network if {    some network in input.networks    network.public == true}
```

Loading...

OPA evaluates the rule body for each element bound to `network`. If any element satisfies all expressions in the body, the rule is defined.

For example, to find out if any servers expose the insecure `"http"` protocol you could write:

```
package servershttp_server if {    some server in input.servers    "http" in server.protocols}
```

Loading...

Or perhaps to find the IDs of ports connected to public networks:

```
package serversexposed_ports contains port.id if {    some port in input.ports    some network in input.networks    port.network == network.id    network.public == true}
```

Loading...

Just like references that refer to non-existent fields or expressions that fail to match, if OPA is unable to find matches that satisfy all of the expressions, the result is undefined.

```
package serversemail_server if {    some server in input.servers    # no servers have this protocol    "imap" in server.protocols}
```

Loading...

#### FOR SOME and FOR ALL[​](#for-some-and-for-all "Direct link to FOR SOME and FOR ALL")

While plain iteration is a fundamental building block, Rego also features ways to express _FOR SOME_ and _FOR ALL_ more explicitly.

##### FOR SOME (`some`)[​](#for-some-some "Direct link to for-some-some")

`some ... in ...` is used to iterate over the collection (its last argument), and will bind its variables (key, value position) to the collection items. It introduces new bindings to the evaluation of the rest of the rule body.

Using `some`, the iteration patterns introduced above can be used to build named rules:

```
package serverspublic_network contains net.id if {    some net in input.networks # some network exists and..    net.public                 # it is public.}shell_accessible contains server.id if {    some server in input.servers    "telnet" in server.protocols}shell_accessible contains server.id if {    some server in input.servers    "ssh" in server.protocols}
```

Loading...

For details on `some ... in ...`, see [the documentation of the `in` operator](https://www.openpolicyagent.org/docs/policy-language#membership-and-iteration-in).

##### FOR ALL (`every`)[​](#for-all-every "Direct link to for-all-every")

Expanding on the examples above, `every` allows us to succinctly express that a condition holds for all elements of a domain.

Edit the input to add a 'telnet' protocol to a server

```
{  "servers": [    {      "id": "busybox",      "protocols": ["http", "ftp"]    },    {      "id": "db",      "protocols": ["mysql", "ssh"]    },    {      "id": "web",      "protocols": ["https"]    }  ]}
```

```
package serversno_telnet_exposed if {    every server in input.servers {        not "telnet" in server.protocols    }}
```

Loading...

Learn more about the [Every Keyword](https://www.openpolicyagent.org/docs/policy-language#every-keyword).

### Policy Rules[​](#policy-rules "Direct link to Policy Rules")

Rego lets you encapsulate and re-use logic with rules. Rules are just if-then logic statements. Rules can either be "complete" or "partial".

#### Complete Rules[​](#complete-rules "Direct link to Complete Rules")

Complete rules are if-then statements that assign a single value to a variable. Every rule consists of a head and a body. In Rego, the rule head is true _if_ the rule body is true for some set of variable assignments.

```
package rules# headexists_public_network := true if {    # body    some network in input.networks # some network exists and..    network.public == true         # it is public.}
```

Loading...

You can query for the value generated by rules just like any other value (such as `input` or your own variables):

```
package rulesexists_public_network := true if {    some network in input.networks # some network exists and..    network.public == true         # it is public.}another_rule := {    "public_networks": exists_public_network,}
```

Loading...

All values generated by rules can be queried via the global `data` variable from other packages loaded into OPA.

```
package another_packageyet_another_rule := {    "public_networks": data.rules.exists_public_network,}
```

Loading...

tip

You can query the value of any rule loaded into OPA by referring to it with an absolute path. The path of a rule is always: `data.<package-path>.<rule-name>`.

If you omit the `= <value>` part of the rule head the value defaults to `true`. You could rewrite the example above as follows without changing the meaning:

```
exists_public_network if {    some network in input.networks    network.public == true}
```

To define constants, omit the rule body. When you omit the rule body it defaults to `true`. Since the rule body is true, the rule head is always true/defined.

```
package serversmax_allowed_protocols := 5
```

Loading...

Constants defined like this can be queried just like any other values:

```
count(input.servers[0].protocols) < max_allowed_protocols
```

If OPA cannot find variable assignments that satisfy the rule body, the rule is undefined. For example, if the `input` provided to OPA does not include a public network then `exists_public_network` will be undefined (which is not the same as false.) Below, OPA is given a different set of input networks (none of which are public):

```
{  "networks": [    { "id": "n1", "public": false },    { "id": "n2", "public": false }  ]}
```

```
package rulesexists_public_network if {    some network in input.networks    network.public == true}
```

Loading...

#### Partial Rules[​](#partial-rules "Direct link to Partial Rules")

Partial rules are if-then statements that generate a set of values and assign that set to a variable. In the example below `public_network contains net.id` is the rule head and `some net in input.networks; net.public` is the rule body. You can query for the entire set of values just like any other value.

```
package example# headpublic_network contains net.id if {    # body    some net in input.networks # some network exists and..    net.public                 # it is public.}
```

Loading...

Using the `in` keyword, this list can be used to test if some other value is in the set defined by `public_network`:

```
package exampleallow if "net3" in public_network
```

Loading...

You can also iterate over the set of values by referencing the set elements with a variable:

```
package exampleallow if {    some net in public_network    net == "net3"}
```

Loading...

In addition to partially defining sets, You can also partially define key/value pairs (aka objects). See [Rules](https://www.openpolicyagent.org/docs/latest/policy-language/#rules) in the language guide for more information.

#### Logical OR[​](#logical-or "Direct link to Logical OR")

When you join multiple expressions together in a query you are expressing logical AND. To express logical OR in Rego you define multiple rules with the same name. The following example illustrates this.

Imagine you wanted to know if any servers expose protocols that give clients shell access. To determine this you could define a complete rule that declares `shell_accessible` to be `true` if any servers expose the `"telnet"` or `"ssh"` protocols:

Input with telnet and ssh

```
{  "servers": [    {      "id": "busybox",      "protocols": ["http", "telnet"]    },    {      "id": "db",      "protocols": ["mysql", "ssh"]    },    {      "id": "web",      "protocols": ["https"]    }  ]}
```

```
package example.logical_ordefault shell_accessible := falseshell_accessible if {    some server in input.servers    "telnet" in server.protocols}shell_accessible if {    some server in input.servers    "ssh" in server.protocols}
```

Loading...

tip

The `default` keyword tells OPA to assign a value to the variable if all of the other rules with the same name are undefined.

When you use logical OR with partial rules, each rule definition contributes to the set of values assigned to the variable. For example, the example above could be modified to generate a set of servers that expose `"telnet"` or `"ssh"`.

```
package example.logical_orshell_accessible contains server.id if {    some server in input.servers    "telnet" in server.protocols}shell_accessible contains server.id if {    some server in input.servers    "ssh" in server.protocols}
```

Loading...

tip

Check out this [blog post](https://web.archive.org/web/https://www.styra.com/blog/how-to-express-or-in-rego/) that goes into much more detail on this topic showing different methods to express OR in idiomatic Rego for different use cases.

### Complete Example[​](#complete-example "Direct link to Complete Example")

The sections above explain the core concepts in Rego. To put it all together, review the desired policy in natural language:

> 1.  Servers reachable from the Internet must not expose the insecure 'http' protocol.
> 2.  Servers are not allowed to expose the 'telnet' protocol.

At a high-level the policy needs to identify servers that violate some conditions. To implement this policy, define rules called `violation` that generate a set of servers that are in violation. For example:

```
package exampleviolation contains message if {   # a server is in the violation set if...    some server in public_servers # it exists in the 'public_servers' set and...    "http" in server.protocols    # it contains the insecure "http" protocol.    message := sprintf("server %s exposes http", [server.id])}violation contains message if {  # a server is in the violation set if...    some server in input.servers # it exists in the input.servers collection and...    "telnet" in server.protocols # it contains the "telnet" protocol.    message := sprintf("server %s exposes telnet", [server.id])}public_servers contains server if { # a server exists in the public_servers set if...    some server in input.servers    # it exists in the input.servers collection and...    some port in server.ports       # it has a port...    some input_port in input.ports    port == input_port.id           # which is referenced in the list of ports     # the port references a network in the input.networks collection and...    some input_network in input.networks    input_port.network == input_network.id    # the network is public.    input_network.public}
```

Loading...

This example demonstrates how Rego can create a clear list of policy violations that can be handed back to the infrastructure as code system to present to the user, making it easy for them to see what's gone wrong.

## Install and Run OPA[​](#install-and-run-opa "Direct link to Install and Run OPA")

This section explains how you can query OPA directly and interact with it on your own machine. If you just want to quickly get a feel for the language without installing anything, check out the [OPA Playground](https://play.openpolicyagent.org/).

### 1\. Download OPA[​](#1-download-opa "Direct link to 1. Download OPA")

-   macOS
-   Linux/Unix
-   Windows
-   Docker

OPA binaries can be installed on macOS using Homebrew. The formula can be reviewed on [brew.sh](https://formulae.brew.sh/formula/opa). This method supports both ARM64 and AMD64 architectures.

```
brew install opa
```

It's also possible to download the OPA binary directly:

-   arm64 (Apple Silicon)
-   amd64 (Older Intel Macs)

```
curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_darwin_arm64
```

After downloading the OPA binary, you must ensure it's executable:

```
chmod 755 ./opa
```

It's also recommended to move the OPA binary into a directory in your `PATH` so you can run OPA commands in different directories.

You can verify the installation by running:

```
opa version
```

See all available binaries on the [GitHub releases](https://github.com/open-policy-agent/opa/releases). Checksums for all binaries are available in the download path by appending `.sha256` to the binary filename.

For example, verify the macOS arm64 binary checksum:

```
BINARY_NAME=opa_darwin_arm64curl -L -O https://openpolicyagent.org/downloads/latest/$BINARY_NAMEcurl -L -O https://openpolicyagent.org/downloads/latest/$BINARY_NAME.sha256shasum -c $BINARY_NAME.sha256
```

### 2\. Try `opa eval`[​](#2-try-opa-eval "Direct link to 2-try-opa-eval")

A simple way to interact with OPA is via the command-line using the [`opa eval` sub-command](https://www.openpolicyagent.org/docs/cli#eval). It can be used to evaluate arbitrary Rego expressions and policies. `opa eval` supports a large number of options for controlling evaluation. Commonly used flags include:

Flag

Short

Description

`--bundle`

`-b`

Load a [bundle file](https://www.openpolicyagent.org/docs/management-bundles#bundle-file-format) or directory into OPA. This flag can be repeated.

`--data`

`-d`

Load policy or data files into OPA. This flag can be repeated.

`--input`

`-i`

Load a data file and use it as `input`. This flag cannot be repeated.

`--format`

`-f`

Set the output format to use. The default is `json` and is intended for programmatic use. The `pretty` format emits more human-readable output.

`--fail`

n/a

Exit with a non-zero exit code if the query is undefined.

`--fail-defined`

n/a

Exit with a non-zero exit code if the query is not undefined.

For example:

input.json

```
{  "servers": [    { "id": "app", "protocols": ["https", "ssh"], "ports": ["p1", "p2", "p3"] },    { "id": "db", "protocols": ["mysql"], "ports": ["p3"] },    { "id": "cache", "protocols": ["memcache"], "ports": ["p3"] },    { "id": "ci", "protocols": ["http"], "ports": ["p1", "p2"] },    { "id": "busybox", "protocols": ["telnet"], "ports": ["p1"] }  ],  "networks": [    { "id": "net1", "public": false },    { "id": "net2", "public": false },    { "id": "net3", "public": true }  ],  "ports": [    { "id": "p1", "network": "net1" },    { "id": "p2", "network": "net3" },    { "id": "p3", "network": "net2" }  ]}
```

example.rego

```
package exampledefault allow := false                              # unless otherwise defined, allow is falseallow if {                                          # allow is true if...    count(violation) == 0                           # there are zero violations.}violation contains server.id if {                   # a server is in the violation set if...    some server in public_servers                    # it exists in the 'public_servers' set and...    "http" in server.protocols                      # it contains the insecure "http" protocol.}violation contains server.id if {                   # a server is in the violation set if...    some server in input.servers                    # it exists in the input.servers collection and...    "telnet" in server.protocols                    # it contains the "telnet" protocol.}public_servers contains server if {                  # a server exists in the 'public_servers' set if...    some server in input.servers                    # it exists in the input.servers collection and...    some port in server.ports                       # it references a port in the input.ports collection and...    some input_port in input.ports    port == input_port.id    some input_network in input.networks            # the port references a network in the input.networks collection and...    input_port.network == input_network.id          # the network is public.    input_network.public}
```

```
# Evaluate a trivial expression../opa eval "1*2+3"# Evaluate a policy on the command line../opa eval -i input.json -d example.rego "data.example.violation[x]"# Evaluate a policy on the command line and use the exit code../opa eval --fail-defined -i input.json -d example.rego "data.example.violation[x]"echo $?
```

tip

Looking for the IDE experience? Rego and OPA have mature developer tooling with support for live evaluation and debugging in [editors and IDEs](https://www.openpolicyagent.org/docs/editor-and-ide-support)

### 3\. Try `opa run` (interactive)[​](#3-try-opa-run-interactive "Direct link to 3-try-opa-run-interactive")

OPA includes an interactive shell or REPL (Read-Eval-Print-Loop) accessible via the [`opa run` sub-command](https://www.openpolicyagent.org/docs/cli#run). You can use the REPL to experiment with policies and prototype new ones.

To start the REPL just:

```
./opa run
```

When you enter statements in the REPL, OPA evaluates them and prints the result.

```
> truetrue> 3.143.14> ["hello", "world"][  "hello",  "world"]
```

Most REPLs let you define variables that you can reference later on. OPA allows you to do something similar. For example, you can define a `pi` constant as follows:

```
> pi := 3.14
```

Once `pi` is defined, you query for the value and write expressions in terms of it:

```
> pi3.14> pi > 3true
```

Quit out of the REPL by pressing Control-D or typing `exit`:

```
> exit
```

You can load policy and data files into the REPL by passing them on the command line. By default, JSON and YAML files are rooted under `data`.

```
opa run input.json
```

Run a few queries to poke around the data:

```
> data.servers[0].protocols[1]
```

```
> data.servers[i].protocols[j]
```

```
> net := data.networks[_]; net.public
```

To set a data file as the `input` document in the REPL prefix the file path:

```
opa run example.rego repl.input:input.json
```

```
> data.example.public_servers[s]
```

info

Prefixing file paths with a reference controls where file is loaded under `data`. By convention, the REPL sets the `input` document that queries see by reading `data.repl.input` each time a statement is evaluated. See `help input` for details in the REPL.

Quit out of the REPL by pressing Control-D or typing `exit`:

```
> exit
```

### 4\. Try `opa run` (server)[​](#4-try-opa-run-server "Direct link to 4-try-opa-run-server")

To integrate with OPA you can run it as a server and execute queries over HTTP. You can start OPA as a server with `-s` or `--server`:

```
./opa run --server ./example.rego
```

By default OPA listens for HTTP connections on `localhost:8181`. See `opa run --help` for a list of options to change the listening address, enable TLS, and more.

Inside of another terminal use `curl` (or a similar tool) to access OPA's HTTP API. When you query the `/v1/data` HTTP API you must wrap input data inside of a JSON object:

```
{    "input": <value>}
```

Create a copy the input file for sending via `curl`:

```
cat <<EOF > v1-data-input.json{    "input": $(cat input.json)}EOF
```

Execute a few `curl` requests and inspect the output:

```
curl localhost:8181/v1/data/example/violation -d @v1-data-input.json -H 'Content-Type: application/json'curl localhost:8181/v1/data/example/allow -d @v1-data-input.json -H 'Content-Type: application/json'
```

By default `data.system.main` is used to serve policy queries without a path. When you execute queries without providing a path, you do not have to wrap the input. If the `data.system.main` decision is undefined it is treated as an error:

```
curl localhost:8181 -i -d @input.json -H 'Content-Type: application/json'
```

You can restart OPA and configure to use any decision as the default decision:

```
./opa run --server --set=default_decision=example/allow ./example.rego
```

Re-run the last `curl` command from above:

```
curl localhost:8181 -i -d @input.json -H 'Content-Type: application/json'
```

### 5\. Try OPA as a Go library[​](#5-try-opa-as-a-go-library "Direct link to 5. Try OPA as a Go library")

OPA can be embedded inside Go programs as a library. The simplest way to embed OPA as a library is to import the `github.com/open-policy-agent/opa/rego` package.

```
import "github.com/open-policy-agent/opa/rego"
```

Call the `rego.New` function to create an object that can be prepared or evaluated:

```
r := rego.New(    rego.Query("x = data.example.allow"),    rego.Load([]string{"./example.rego"}, nil))
```

The `rego.Rego` supports several options that let you customize evaluation. See the [GoDoc](https://godoc.org/github.com/open-policy-agent/opa/rego) page for details. After constructing a new `rego.Rego` object you can call `PrepareForEval()` to obtain an executable query. If `PrepareForEval()` fails it indicates one of the options passed to the `rego.New()` call was invalid (e.g., parse error, compile error, etc.)

```
ctx := context.Background()query, err := r.PrepareForEval(ctx)if err != nil {    // handle error}
```

The prepared query object can be cached in-memory, shared across multiple goroutines, and invoked repeatedly with different inputs. Call `Eval()` to execute the prepared query.

```
bs, err := ioutil.ReadFile("./input.json")if err != nil {    // handle error}var input anyif err := json.Unmarshal(bs, &input); err != nil {    // handle error}rs, err := query.Eval(ctx, rego.EvalInput(input))if err != nil {    // handle error}
```

The policy decision is contained in the results returned by the `Eval()` call. You can inspect the decision and handle it accordingly:

```
// In this example we expect a single result (stored in the variable 'x').fmt.Println("Result:", rs[0].Bindings["x"])
```

You can combine the steps above into a simple command-line program that evaluates policies and outputs the result:

main.go

```
package mainimport (    "context"    "encoding/json"    "fmt"    "log"    "os"    "github.com/open-policy-agent/opa/v1/rego")func main() {    ctx := context.Background()    // Construct a Rego object that can be prepared or evaluated.    r := rego.New(        rego.Query(os.Args[2]),        rego.Load([]string{os.Args[1]}, nil))    // Create a prepared query that can be evaluated.    query, err := r.PrepareForEval(ctx)    if err != nil {        log.Fatal(err)    }    // Load the input document from stdin.    var input any    dec := json.NewDecoder(os.Stdin)    dec.UseNumber()    if err := dec.Decode(&input); err != nil {        log.Fatal(err)    }    // Execute the prepared query.    rs, err := query.Eval(ctx, rego.EvalInput(input))    if err != nil {        log.Fatal(err)    }    // Do something with the result.    fmt.Println(rs)}
```

Run the code above as follows:

```
go run main.go example.rego 'data.example.violation' < input.json
```

## Next Steps[​](#next-steps "Direct link to Next Steps")

If you have more questions about how to write policies in Rego check out:

-   The [Policy Reference](https://www.openpolicyagent.org/docs/policy-reference) page for reference documentation on built-in functions.
-   The [Policy Language](https://www.openpolicyagent.org/docs/policy-language) page for complete descriptions of all language features.

If you want to try OPA for a specific use case check out:

-   The [Ecosystem](https://www.openpolicyagent.org/ecosystem) page which showcases various of OPA integrations.

Some popular tutorials include:

-   The [Kubernetes](https://www.openpolicyagent.org/docs/kubernetes) page for how to use OPA as an admission controller in Kubernetes.
-   The [Envoy](https://www.openpolicyagent.org/docs/envoy) page for how to use OPA as an external authorizer with Envoy.
-   The [Terraform](https://www.openpolicyagent.org/docs/terraform) page for how to use OPA to validate Terraform plans.

Don't forget to install the OPA (Rego) Plugin for your favorite [IDE or Text Editor](https://www.openpolicyagent.org/docs/editor-and-ide-support).
