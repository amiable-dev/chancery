# Building an AI Agent to Detect and Handle Anomalies in Time-Series Data

**Source:** https://towardsdatascience.com/building-an-ai-agent-to-detect-and-handle-anomalies-in-time-series-data/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Combining statistical detection with agentic decision-making

---

As a data scientist working on time-series forecasting, I have run into anomalies and outliers more than I can count. Across demand forecasting, finance, traffic, and sales data, I keep running into spikes and dips that are hard to interpret.

Anomaly handling is usually a gray area, rarely black or white, but indicators of deeper issues. Some anomalies are real signals like holidays, weather events, promotions, or viral moments; others are just data glitches, but both look the same at first glance. The faster we detect anomalies in data, the faster action can be taken to prevent poor performance and damage.

We are dealing with critical time-series data, and detecting anomalies is crucial. If you remove a true event, a valuable signal data point is removed, and if you keep a false alarm signal, the training data contains noise.

Most ML-based detectors flag spikes based on Z-scores, IQR thresholds, or other static methods without any context. With recent advancements in AI, we have a better option to design an anomaly-handling agent that reasons about each case. An agent that detects unusual behavior, checks context, and decides whether to fix the data, keep it as a real signal, or flag it for review.

In this article, we build such an agent step by step that combines simple statistical detection with an AI agent that acts as a first line of defense for time-series data, reducing manual intervention while preserving the signals that matter most. We will detect and handle anomalies in COVID-19 data by autonomous decision-making based on the severity of the anomaly, using:

1.  Live epidemiological data from the disease.sh API.
2.  Statistical anomaly detection.
3.  Severity classification.
4.  A GroqCloud-powered AI agent that takes autonomous decisions whether to:
    -   Fix the anomaly
    -   Keep the anomaly
    -   Flag anomaly for human review

This is agentic decision intelligence, not merely anomaly detection.  

![Figure 1: AI Agent Implementation for Anomaly Detection — Image by author.](https://contributor.insightmediagroup.io/wp-content/uploads/2026/02/image-41.png)

Figure 1: AI Agent Implementation for Anomaly Detection  
Image by author.

## Why is traditional anomaly detection alone not enough?

There are traditional ML methods like isolation forests designed for anomaly detection, but they lack end-to-end decision orchestration. They are unable to act on them quickly enough in production environments. We are implementing an AI agent to fill this gap by turning raw anomaly scores into autonomous, end-to-end decisions dynamically on live data.  

### Traditional Anomaly Detection

The traditional anomaly detection follows the pipeline approach as drawn below:

![](https://contributor.insightmediagroup.io/wp-content/uploads/2026/02/Screenshot-2026-02-10-at-5.25.32-PM-1024x90.png)

Image by author

#### Limitations of Traditional Anomaly Detection

-   Works on static rules and manually sets thresholds.
-   It is single-dimensional and handles simple data.
-   No contextual reasoning.
-   Human-driven decision making.
-   Manual-driven action.

### Anomaly Detection and Handling with an AI Agent 

The AI Agent anomaly detection follows the pipeline approach as drawn below:

![](https://contributor.insightmediagroup.io/wp-content/uploads/2026/02/Screenshot-2026-02-10-at-5.31.12-PM-1024x89.png)

Image by author

#### Why does this work better in practice?

-   Works on real-time data.
-   It’s multidimensional and can handle complex data.
-   Works on contextual reasoning.
-   Adaptive & self-learning decision making.
-   Take autonomous action.

## Choosing a realistic dataset for our example

We are using real-world COVID-19 data to detect anomalies, as it is noisy, shows spikes, and the results help in the improvement of public health.

### What do we want the AI Agent to decide?

The goal is to continuously monitor COVID-19 data, find anomalies, define their severity, and take autonomous decisions and decide action to be taken:

-   Flag anomaly for human review
-   Fix the anomaly
-   Keep the anomaly

### Data Source

For the data, we are using free, live [disease.sh](http://disease.sh/) data via API. This API provides data on daily confirmed cases, deaths and recoveries. For the AI Agent implementation, we are focusing on daily case counts, which are ideal for anomaly detection.

_Data license: This tutorial uses COVID-19 historical case counts retrieved via the disease.sh API. The underlying dataset (JHU CSSE COVID-19 Data Repository) is licensed under CC BY 4.0, which permits commercial use with attribution. (Accessed on January 22, 2026)_  

### How do the pieces fit together?

High-Level system architecture of the anomaly detection on COVID-19 data using an AI Agent is as follows:

![](https://contributor.insightmediagroup.io/wp-content/uploads/2026/02/image-1-792x1024.jpeg)

Figure 2: AI agent sits between anomaly detection and downstream action, deciding whether to fix, keep, or escalate anomalies  
Image by author  

### Building the AI Agent Step-by-Step 

Let’s go step by step to understand how to load data using [disease.sh](http://disease.sh/), detect anomalies, classify them, and implement an AI agent that reasons and takes appropriate action as per the severity of the anomalies.

#### Step 1: Install Required Libraries

The first step is to install required libraries like phidata, groq, python-dotenv, tabulate, and streamlit.

```
pip install phidata
pip install groq
pip install python-dotenv #library to load .env file
pip install tabulate
pip install streamlit
```

#### Step 2: Environment File Set-up

Open your IDE and create a project folder, and under that folder, create an environmental file “.env” to store GROQ\_API\_KEY.

```
GROQ_API_KEY="your_groq_api_key_here"
```

#### Step 3: Data Ingestion

Before building any agent, we need a data source that is noisy enough to surface real anomalies, but structured enough to reason about. COVID-19 daily case counts are a good fit as they contain reporting delays, sudden spikes, and regime changes. For simplicity, we deliberately restrict ourselves to a single univariate time series.

Load data from the [disease.sh](http://disease.sh/) using request URL and extract the date and daily case count based on the selected country and the number of days for which you want to extract data. The data is converted into a structured dataframe by parsing json, formatting date and sorting chronologically.

```
# ---------------------------------------
# DATA INGESTION (disease.sh)
# ---------------------------------------

def load_live_covid_data(country: str , days:int):
    url = f"https://disease.sh/v3/covid-19/historical/{country}?lastdays={days}"
    response = requests.get(url)
    data = response.json()["timeline"]["cases"]

    df = (
        pd.DataFrame(list(data.items()), columns=["Date", "Cases"])
        .assign(Date=lambda d: pd.to_datetime(d["Date"], format="%m/%d/%y"))
        .sort_values("Date")
        .reset_index(drop=True)
    )
    return df
```

#### Step 4: Anomalies Detection

We will now detect abnormal behavior in COVID-19 time-series data by detecting sudden spikes and rapid growth trends. Case counts are generally stable, and large deviations or sharp increases indicate meaningful anomalies. We will now detect anomalies using statistical methods and binary labeling for deterministic and reproducible anomaly detection. Two parameters are calculated to detect anomalies.

1.  Spike Detection
    -   A sudden spike in data is detected using the Z-score; if any data point falls outside the Z-score range, it must be an anomaly.
2.  Growth Rate Detection
    -   The day-over-day growth rate is calculated; if it exceeds 40%, it is flagged.

```
# ---------------------------------------
# ANOMALY DETECTION
# ---------------------------------------
def detect_anomalies(df):
   values = df["Cases"].values
   mean, std = values.mean(), values.std()

   spike_idx = [
       i for i, v in enumerate(values)
       if abs(v - mean) > 3 * std
   ]

   growth = np.diff(values) / np.maximum(values[:-1], 1)
   growth_idx = [i + 1 for i, g in enumerate(growth) if g > 0.4]

   anomalies = set(spike_idx + growth_idx)
   df["Anomaly"] = ["YES" if i in anomalies else "NO" for i in range(len(df))]

   return df
```

If there is an anomaly according to either spike or growth or with both parameters, the “Anomaly” is set to “YES”; otherwise set to “NO”.

#### Step 5: Severity Classification

All anomalies are not equal; we will classify them as ‘**CRITICAL**’, ‘**WARNING**’, or ‘**MINOR**’ to guide AI Agent decisions. Fixed rolling windows and rule-based thresholds are used to classify severity. Severity is classified only when an anomaly exists; otherwise, Severity, Agent Decision, and Action parameters in the dataframe are set to ‘blank’.

```
# ---------------------------------------
# CONFIG
# ---------------------------------------
ROLLING_WINDOW = 7
MIN_ABS_INCREASE = 500

# ---------------------------------------
# SEVERITY CLASSIFICATION
# ---------------------------------------
def compute_severity(df):
    df = df.sort_values("Date").reset_index(drop=True)
    df["Severity"] = ""
    df["Agent Decision"] = ""
    df["Action"] = ""
    for i in range(len(df)):
        if df.loc[i, "Anomaly"] == "YES":
            if i < ROLLING_WINDOW:
                df.loc[i, "Severity"] = ""

            curr = df.loc[i, "Cases"]
            baseline = df.loc[i - ROLLING_WINDOW:i- 1, "Cases"].mean()

            abs_inc = curr - baseline
            growth = abs_inc / max(baseline, 1)

            if abs_inc < MIN_ABS_INCREASE:
                df.loc[i, "Severity"] = ""
            if growth >= 1.0:
                df.loc[i, "Severity"] = "CRITICAL"
            elif growth >= 0.4:
                df.loc[i, "Severity"] = "WARNING"
            else:
                df.loc[i, "Severity"] = "MINOR"
    return df
```

In the above code, to classify the anomaly severity, each anomaly is compared with 7-day historical data (**ROLLING\_WINDOW** = 7), and absolute and relative growth are calculated.

1.  Absolute Growth

A **MIN\_ABS\_INCREASE** \= 500 is defined as a config parameter where changes below this value are considered very small, a negligible change. If the absolute growth is less than MIN\_ABS\_INCREASE, then ignore it and keep the severity blank. Absolute growth detects meaningful real-world impact, does not react to noise or minor fluctuations, and prevents false alarms when growth percentage is high.

2.  Relative Growth:

Relative growth helps in detecting explosive trends. If growth is greater than or equal to 100% increase over baseline, it means a sudden outbreak, and it is assigned as ‘**CRITICAL**’; if growth is greater than 40%, it means sustained acceleration and needs monitoring, and it is assigned as ‘**WARNING**’; otherwise assigned as ‘**MINOR**’. 

After severity classification, it is ready for the AI Agent to make an autonomous decision and action.

#### Step 6: Build Prompt for AI Agent

Below is the prompt that defines how the AI agent reasons and makes decisions based on structured context and predefined severity when an anomaly is detected.  The agent is restricted to three explicit actions and must return a single, deterministic response for safe automation.

```
def build_agent_prompt(obs):
    return f"""
You are an AI monitoring agent for COVID-19 data.

Observed anomaly:
Date: {obs['date']}
Cases: {obs['cases']}
Severity: {obs['severity']}

Decision rules:
- FIX_ANOMALY: noise, reporting fluctuation
- KEEP_ANOMALY: real outbreak signal
- FLAG_FOR_REVIEW: severe or ambiguous anomaly

Respond with ONLY one of:
FIX_ANOMALY
KEEP_ANOMALY
FLAG_FOR_REVIEW
"""
```

Three data points, i.e., date, number of cases reported, and severity, are provided to the prompt explicitly, which helps the AI Agent to make a decision autonomously.

#### Step 7: Create your Agent with GroqCloud

We are now creating an autonomous AI agent using GroqCloud that makes intelligent contextual decisions on detected anomalies and their severities and takes appropriate actions. Three predefined actions for the AI Agent enforce validated outputs only.

```
# ---------------------------------------
# BUILDING AI AGENT
# ---------------------------------------
agent = Agent(
    name="CovidAnomalyAgent",
    model=Groq(id="openai/gpt-oss-120b"),
    instructions="""
You are an AI agent monitoring live COVID-19 time-series data.
Detect anomalies, decide according to the anomaly:
"FIX_ANOMALY", "KEEP_ANOMALY", "FLAG_FOR_REVIEW"."""
)
for i in range(len(df)):
    if df.loc[i, "Anomaly"] == "YES":
        obs = build_observation(df, i)
        prompt = build_agent_prompt(obs)
        response = agent.run(prompt)

        decision = response.messages[-1].content.strip()
        decision = decision if decision in VALID_ACTIONS else "FLAG_FOR_REVIEW"
        df = agent_action(df, i, decision)
```

An AI agent named “**CovidAnomalyAgent**” is created, which uses an LLM model hosted by GroqCloud for fast and low-latency reasoning. AI Agent runs a well-defined prompt, observes data, contextual reasoning, makes an autonomous decision, and takes actions within safe constraints.

An AI Agent is not handling anomalies but making intelligent decisions for each detected anomaly. The agent’s decision accurately reflects anomaly severity and required action.

```
# ---------------------------------------
# Agent ACTION DECIDER
# ---------------------------------------
def agent_action(df, idx,action):
    df.loc[idx, "Agent Decision"] = action

    if action == "FIX_ANOMALY":
        fix_anomaly(df, idx)

    elif action == "KEEP_ANOMALY":
        df.loc[idx, "Action"] = "Accepted as a real outbreak signal"

    elif action == "FLAG_FOR_REVIEW":
        df.loc[idx, "Action"] = "Flagged for human review"
    return df
```

AI Agent ignores normal data points with no anomaly and considers only data points with “**ANOMALY= YES**”. The AI agent is constrained to return only three valid decisions: “**FIX\_ANOMALY**“, “**KEEP\_ANOMALY**“, and “**FLAG\_FOR\_REVIEW**“, and accordingly, action is taken as defined in the table below:

**Agent Decision**

**Action**

FIX\_ANOMALY

Auto-corrected by an AI agent

KEEP\_ANOMALY

Accepted as a real outbreak signal

FLAG\_FOR\_REVIEW

Flagged for human review

For minor anomalies, the AI agent automatically fixes the data, preserves valid anomalies as-is, and flags critical cases for human review.

#### Step 8: Fix Anomaly

Minor anomalies are caused by reporting noise and are corrected using local rolling mean smoothing over recent historical values.

```
# ---------------------------------------
# FIX ANOMALY
# ---------------------------------------

def fix_anomaly(df, idx):
    window = df.loc[max(0, idx - 3):idx - 1, "Cases"]
    if len(window) > 0:
        df.loc[idx, "Cases"] = int(window.mean())

    df.loc[idx, "Severity"] = ""
    df.loc[idx, "Action"] = "Auto-corrected by an AI agent"
```

It takes the immediate 3 days of past data, calculates its mean, and smooths the anomaly by replacing its value with this average. By the local rolling mean smoothing approach, temporary spikes and data glitches can be handled. 

Once an anomaly is fixed, the data point is no longer considered risky, and severity is intentionally removed to avoid confusion. “Action” is updated to “Auto-corrected by an AI agent”.

### Complete Code

Kindly go through the complete code for the statistical anomaly detection and AI Agent implementation for anomaly handling.

[https://github.com/rautmadhura4/anomaly\_detection\_agent/tree/main](https://github.com/rautmadhura4/anomaly_detection_agent/tree/main)

### Results

Let’s compare the results for the country, “India,” with different types of severity detected and how the AI Agent handles them.

#### Scenario 1: A Native Implementation

The first attempt is a native implementation where we detect minor anomalies and the AI Agent fixes them automatically. Below is the snapshot of the COVID data table of India with severity.

![](https://contributor.insightmediagroup.io/wp-content/uploads/2026/02/image-42-1024x617.png)

Image by author

We have also implemented a Streamlit dashboard to review the AI Agent’s decisions and actions. In the below result snapshot, you can see that various minor anomalies are fixed by the AI Agent.

![](https://contributor.insightmediagroup.io/wp-content/uploads/2026/02/image-43-1024x617.png)

Image by author

This works best when anomalies are localized noise rather than regime changes.

#### Scenario 2: A Boundary Condition

Here, critical anomalies are detected, and the AI Agent raises a flag for review as shown in the snapshot of the COVID data table of India with severity.

![](https://contributor.insightmediagroup.io/wp-content/uploads/2026/02/image-44-1024x375.png)

Image by author

On the Streamlit dashboard AI Agent’s decisions and actions are shown in the result snapshot. You can see that all the critical anomalies were flagged for human review by the AI Agent.  

![](https://contributor.insightmediagroup.io/wp-content/uploads/2026/02/image-45-1024x376.png)

Image by author

Severity gating prevents destructive auto-corrections in high-impact anomalies.

#### Scenario 3: A Limitation 

For the limitation scenario, warning and critical anomalies are detected as shown in the snapshot of the COVID data table of India with severity.

![](https://contributor.insightmediagroup.io/wp-content/uploads/2026/02/image-46-1024x293.png)

Image by author

On the Streamlit dashboard AI Agent’s decisions and actions are shown below in the result snapshot. You can see that the critical anomaly is flagged for human review by AI Agent, but the WARNING anomaly is automatically fixed. In many real settings, a WARNING-level anomaly should be preserved and monitored rather than corrected.

![](https://contributor.insightmediagroup.io/wp-content/uploads/2026/02/image-47-1024x347.png)

Image by author

This failure highlights why WARNING thresholds should be tuned and why human review remains essential.

Use the complete code and try anomaly detection for the COVID-19 dataset, with different parameters.

## Future Scope and Enhancements

We have used a very limited dataset and implemented rule-based anomaly detection, but in the future, some enhancements can be done in the AI Agent implementation:

1.  In our implementation, an anomaly is detected, and a decision is made based on case count only. In the future, data can be more elaborate with features like hospitalization records, vaccination data, and others.

2.  Anomaly detection is done here using statistical methods, which can also be ML-driven in the future to identify more complex patterns.

3.  Now, we have implemented a single-agent architecture; in the future multi-agent architecture can be implemented to improve scalability, clarity, and resilience.
4.  In the future human feedback loop should also take care to make improved decisions.

## Final Takeaways

Smarter AI agents enable operational AI that makes decisions using contextual reasoning, takes action to fix anomalies, and escalates to humans when needed. There are some practical takeaways to keep in mind while building an AI Agent for anomaly detection:

-   To detect anomalies, use statistical methods and implement AI agents for contextual decision-making.

-   Minor anomalies are safe to be autocorrected as they are generally reported as noise. Critical should never be autocorrected and flagged for review by domain experts so that real-world signals do not get suppressed.

-   This AI agent must not be used in situations where anomalies directly trigger irreversible actions.

When statistical methods and an AI agent approach are combined properly, they transform anomaly detection from just an alerting system into a controlled, decision-driven system without compromising safety.
