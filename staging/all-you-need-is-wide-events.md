# All you need is Wide Events, not “Metrics, Logs and Traces”

**Source:** https://isburmistrov.substack.com/p/all-you-need-is-wide-events-not-metrics
**Added:** 2026-08-24
**Tags:** #unsorted

---

> This quote from Charity Majors is probably the best summary of the current state of observability in the tech industry - a total, mass confusion.

---

[

![](https://substackcdn.com/image/fetch/$s_!rTJp!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F09c4740a-18a4-4553-8a72-b27a090b6699_2454x628.png)

](https://substackcdn.com/image/fetch/$s_!rTJp!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F09c4740a-18a4-4553-8a72-b27a090b6699_2454x628.png)

This quote from Charity Majors is probably the best summary of the current state of observability in the tech industry - a total, mass confusion. Everyone is confused. What is a trace? What is a span? Is log line a span? Do I need traces if I have logs? Why I need traces if I have great metrics? The list of questions like these goes on. Charity - together with other great folks from observability system called [Honeycomb](https://www.honeycomb.io/) - have been doing a great job shedding light on these questions. Yet, per my own experience it’s still extremely hard to explain what does Charity meant by “logs are thrash”, let alone the fact that logs and traces are essentially the same things. Why is everyone so confused?

With the risk of being spicy a little, I’m going to blame Open Telemetry. Yes, it’s powering the modern observability stack and yet I blame it for the mass confusion. Not because it’s a bad solution - it’s great! But the presentation and the whole approach of explaining what Open Telemetry is and what it does makes the observability look tricky and complex.

First, Open Telemetry from the very beginning makes a clear distinctions between traces, metrics and logs:

> OpenTelemetry is a collection of APIs, SDKs, and tools. Use it to instrument, generate, collect, and export telemetry data (metrics, logs, and traces) to help you analyze your software’s performance and behavior.

Then it goes deeper in explaining each of these 3.

[

![](https://substackcdn.com/image/fetch/$s_!pEtN!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F66bae5d5-989e-4064-a2ab-4b946c67fa49_3428x2472.png)

](https://substackcdn.com/image/fetch/$s_!pEtN!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F66bae5d5-989e-4064-a2ab-4b946c67fa49_3428x2472.png)

This is screenshot from the part of open telemetry website introducing traces. Based on my experience talking to people who work with OpenTelemetry, this presentation has indeed become one of the main pictures being associated with observability. For some, this IS the observability. And it also sets traces apart from anything else. This is clear not a log, is it? This also doesn’t look like a metric, right? It’s something _special,_ probably a bit _sacred,_ and requiring learning investment. Per my experience, once people learned about traces, they only think about them in the context of this picture and the whole set of terms like spans, root spans, nested spans and the rest. OpenTelemetry site has a [glossary](https://opentelemetry.io/docs/concepts/glossary/) page with more than 60 terms! This all is insanely complex!

But what’s more important - does this focus on “logs, metrics and traces” represent the true power of observability? It does cover some scenarios that’s true, but when it comes to the distributed systems at scale what’s more important is an ability to “dig” into data - “slice and dice” it, build and analyse various views, correlate, search for anomalies… And systems that offer all of this do exist.

When I was working at Meta, I wasn’t aware that I was privileged to be using the best observability system ever. This system is called Scuba and it’s the top 1 thing by a large margin that people miss when they leave Meta.

The basic idea of Scuba is extremely simple and doesn’t require a glossary page for people to grasp. It operates with Wide Events. Wide Event is just a collection of fields with names and values, pretty much like a json document. If you need to record some information - whether it’s the current state of the system, or an event caused by an API call, background job or whatever - you can just write some Wide Event to Scuba. For instance, if a system serves ads, the natural desire would be to record Ad Impressions - the facts that a certain ad has been seen by a user. The corresponding Wide Event might be looking like this:

```
{
    "Timestamp": "1707951423",
    "AdId": "542508c92f6f47c2916691d6e8551279”,
    "UserCountry": "US",
    "Placement": "mobile_feed",
    "CampaingType": "direct_ads",
    "UserOS": "Android",
    "OSVersion": "14",
    "AppVersion": "798de3c28b074df9a24a479ce98302b6",
    ...
}
```

Such events called wide, because it’s encouraged to dump to them all the information one can think of. Anything that might be relevant in the context of a certain data - just put it there, it might be useful later. This approach is laying the groundwork for dealing with _unknown unknowns_ - something you can’t think of now that may be revealed later during an incident investigation.

Dealing with unknown unknowns can be better demonstrated on an example. Scuba has a nice intuitive interface which is easy to explore and play with. It has a section where one can pick a metric to look at, as well as sections for filters and groupings - and Scuba would draw a nice time series chart. Firs look for Ad Impressions dataset would simply draw a chart with impressions count:

[

![](https://substackcdn.com/image/fetch/$s_!8V2m!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc2b8e77d-5800-46b9-acf7-42eed73cdfa3_4466x1926.png)

](https://substackcdn.com/image/fetch/$s_!8V2m!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc2b8e77d-5800-46b9-acf7-42eed73cdfa3_4466x1926.png)

If we express what’s exactly is selected here in terms of SQL, then this is something like

```
SELECT COUNT(*) FROM AdImpressions
WHERE IsTest = False
```

Well, it’s actually not exactly like that. Scuba also has a concept of _native sampling._ When a certain event is written to Scuba, it also must write a field called **samplingRate** - the rate this particular event is being sampled with. Scuba uses this information to properly “upscale” results shown on the charts, so there is no need to do this upscaling in the head. This is a really great concept because it allows a dynamic sampling - e.g. some type of impressions may be sampled more than another, while preserving the “real” values in the UI. So, the actual query under the hood is

```
SELECT SUM(samplingRate) FROM AdImpressions
WHERE IsTest = False
```

Note that this whole “upscaling” is done transparently by the UI and users don’t think about it during querying.

And so assume some alert happened and indicated that our precious Ad Impression chart is looking weird:

[

![](https://substackcdn.com/image/fetch/$s_!_0Lm!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fba9830b4-b4c8-4ce4-99ff-5c15c03101a2_4478x2284.png)

](https://substackcdn.com/image/fetch/$s_!_0Lm!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fba9830b4-b4c8-4ce4-99ff-5c15c03101a2_4478x2284.png)

The first instinct of everyone who’re using Scuba for investigation is to “slice and dice”, i.e. filter or group by, to see if we can learn _something_. We don’t know what we’re looking for, but we believe that we’ll find it. So we would group by say impression type, or user country, or the placement, until we would find something suspicious. Let’s assume it’s CampaignType grouping:

[

![](https://substackcdn.com/image/fetch/$s_!4kRe!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F058f8dc3-c1a1-4724-a4cc-c769fcce528a_4448x1912.png)

](https://substackcdn.com/image/fetch/$s_!4kRe!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F058f8dc3-c1a1-4724-a4cc-c769fcce528a_4448x1912.png)

We see that some campaign type called **in\_app\_purchases** (just in case want to note that this type name is completely made-up by me) seems to look differently than others. We don’t really know that does it mean - we don’t need to! - to continue our digging. Okay, now we can filter these campaigns only, and continue grouping by something else we can think of. For instance, User OS makes sense.

[

![](https://substackcdn.com/image/fetch/$s_!AytP!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffe79fa2c-1d06-4f9c-b295-7aa1b05bfa5b_4452x1916.png)

](https://substackcdn.com/image/fetch/$s_!AytP!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffe79fa2c-1d06-4f9c-b295-7aa1b05bfa5b_4452x1916.png)

Hmmm, Android seems to be in trouble. iOS is OK, which suggests that the problem is on the client side - a broken app version maybe?

[

![](https://substackcdn.com/image/fetch/$s_!YU30!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd2546f00-e979-45bb-8251-add07e00de41_4454x1924.png)

](https://substackcdn.com/image/fetch/$s_!YU30!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd2546f00-e979-45bb-8251-add07e00de41_4454x1924.png)

Weird. Some are suffering, some others don’t. Check OS Version maybe?

[

![](https://substackcdn.com/image/fetch/$s_!9_3Q!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0068b568-bf44-4718-b95f-9cae5a8cf9d8_4450x1922.png)

](https://substackcdn.com/image/fetch/$s_!9_3Q!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0068b568-bf44-4718-b95f-9cae5a8cf9d8_4450x1922.png)

Ha! It’s the newest version of the OS, and looks like some of the app versions are not doing well on this OS version for this type of campaign. The dedicated teams may look deeper now, given this information.

What happened? Without any knowledge of the system we’ve narrowed down the scope of the issue, and identified the teams to take a lead for further investigation. Could we know in advance that this weird combination of OS, OS Version, Campaign Type and App Version might lead to some issue, to have a dedicated metric prepared? Of course no. This is an example of dealing with _unknown unknowns_. We’ve just dropped all the relevant context into Wide Events, and used it later when needed. Scuba made it simple to do the exploration because it’s fast and has a really nice easy-to-use UI. Also note that we have never mentioned anything about cardinality. Because it doesn’t matter - any field can be of any cardinality. Scuba works with raw events and doesn’t pre-aggregate anything, and so cardinality is not an issue.

Sometimes UI / Visualisation aspect doesn’t get enough attention, and observability systems offer some query language - either a proprietary (bad-bad-bad), or SQL (slightly better, but still bad). Such an interface makes it close to impossible to conduct similar investigations. One important aspect of Scuba that all the fields - function, filter, grouping, etc. - are _explorable._ Meaning that there is an easy way to see what kind of values we can pick. When the owners of a certain field are not lazy, they even included a detailed description for the given field with relevant links etc. This is huge. I have successfully investigated a lot of incidents myself, without full understanding of either the whole system, or the data available in this dataset. And boy I did learn a lot about the system during these investigations, simply via playing around with Scuba! This was amazing. This was observability paradise.

Now imagine my level of confusion and disbelief when I left Meta and got to know the state of observability systems outside.

[

![](https://substackcdn.com/image/fetch/$s_!ziBm!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F949fb3f4-e47c-4630-8dc9-8fab4c8376c2_2418x2418.png)

](https://substackcdn.com/image/fetch/$s_!ziBm!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F949fb3f4-e47c-4630-8dc9-8fab4c8376c2_2418x2418.png)

Logs? Traces? Metrics? What the hell? Wide Events, anyone? Can I please not learn that 60 terms from the Glossary and just … explore stuff?

It took me quite a while to map my Scuba-based mental model to Open Telemetry mental model. I realised that Open Telemetry’s Span is, in fact, the Wide Event. Actually, I’m still not quite sure I got it right:

[

![](https://substackcdn.com/image/fetch/$s_!RnpA!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3e6d61c9-25a3-49e8-a70d-94e8aa715061_1710x342.png)

](https://substackcdn.com/image/fetch/$s_!RnpA!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3e6d61c9-25a3-49e8-a70d-94e8aa715061_1710x342.png)

If we take AdImpression example, this impression is not really an operation, it’s just some fact we want to record… To be fair, there is some notion of Event in Open Telemetry:

[

![](https://substackcdn.com/image/fetch/$s_!GQ1c!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd315dea4-ff72-45d5-9e33-5edd56c61073_3016x318.png)

](https://substackcdn.com/image/fetch/$s_!GQ1c!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd315dea4-ff72-45d5-9e33-5edd56c61073_3016x318.png)

But if we follow the links to dig deeper, we again find out that Event is in fact one of Traces, Metrics or Logs 🤷

[

![](https://substackcdn.com/image/fetch/$s_!RbTf!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0a096676-d54d-4f66-8677-453c999a54ce_1732x336.png)

](https://substackcdn.com/image/fetch/$s_!RbTf!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0a096676-d54d-4f66-8677-453c999a54ce_1732x336.png)

But anyway, Span is the closest concept to Wide Event. The thing is - it’s extremely hard to advocate for this mental model when the one suggested by Open Telemetry is already learned. Which is really upsetting, because Traces, Metrics and Logs are all just special cases of Wide Events really:

-   **Traces and Spans:** These are just wide events having **SpanId, TraceId and ParentSpanId** fields. So we can filter all spans with a given TraceId, topologically sort them using SpanId → ParentSpanId relation, and draw that distributed tracing view everyone loves.
    
-   **Logs:** Honestly, I’m really confused what Open Telemetry means by Logs. Looks like [a lot of things](https://opentelemetry.io/docs/specs/otel/glossary/#logs), and one of them is Structured Log which is pretty much the Wide Event. Great! The problem, however, that “a log” is quite a defined concept, and usually people mean by it is what is produced by those `logger.info(…)` calls. Anyway, whatever is meant, logs can be easily mapped to wide events, of course. In the simplest case we can just get the log message, put it to the “log\_message” field, add a bunch of metadata, and be happy. In a more complex case, we can try to automatically extract a template from a log message via removing tokens that looks like IDs, and get a hash of this template. This can allow to quickly get the most frequent error, for instance, via grouping by this hash. Meta has such a system, and it’s pretty cool.
    
-   **Metrics:** Metrics can be easily mapped, too. We just need to emit a Wide Event once per some interval containing the state of the system (system metrics like cpu, various counters,…). Prometheus, by the way, does exactly that with the scraping approach - takes a snapshot of the system once in a while. Unlike with prometheus, however, with Wide Events approach we don’t need to worry about cardinality.
    

But Wide Events can offer much much more than these “3 pillars”. The aforementioned debugging session is already a case which is not really covered by Traces, Logs and Metrics - not naturally, at least. There could be other use cases, too - for instance, continuous profiling data can be easily represented as a Wide Event, and queried to build a [Flame Graph](https://www.brendangregg.com/flamegraphs.html). No need to have a separate system for this - a single system working with Wide Events can do it all. Imagine the possibilities for cross-correlation & root cause analysis when everything in one place, stored together. Especially now, in the era of raise of AI-based tools that are pretty good in finding correlations in data.

I don’t know… I just wanted to express my frustration with the level of confusion and this focus on “3 pillars”.

I just wish that observability vendors took a stand against confusion, and offered a simple and natural way to interact with the system. [Honeycomb](https://www.honeycomb.io/) seems is [doing that](https://x.com/mipsytipsy/status/1738048200630792245?s=20), as well as some other systems like [Axiom](https://axiom.co/). This is great! And hope the others will follow.
