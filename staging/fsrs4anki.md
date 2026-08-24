# GitHub - open-spaced-repetition/fsrs4anki: A modern Anki custom scheduling based on Free Spaced Repetition Scheduler algorithm

**Source:** https://github.com/open-spaced-repetition/fsrs4anki
**Added:** 2026-08-24
**Tags:** #unsorted

---

> A modern Anki custom scheduling based on Free Spaced Repetition Scheduler algorithm - open-spaced-repetition/fsrs4anki

---

[![FSRS4Anki](https://private-user-images.githubusercontent.com/32575846/276902307-9efb2ca5-51bd-411d-9694-a77b09f51fa7.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODc1NjM2MjMsIm5iZiI6MTc4NzU2MzMyMywicGF0aCI6Ii8zMjU3NTg0Ni8yNzY5MDIzMDctOWVmYjJjYTUtNTFiZC00MTFkLTk2OTQtYTc3YjA5ZjUxZmE3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA4MjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwODI0VDA5MjIwM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWNiZmVlNzYxNDg3YjhkNDFjM2RkNmQyODY2NWQxMzY5MDkxMmE3ZWJmZWQ3NzdlYTg5ODBhOGJkMGFmNjkyYzQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.VLoDRtxu0ZMGfPKbE7xu84cHy1Iwvu0-NFytpsoELrs)](https://github.com/open-spaced-repetition/fsrs4anki/wiki)

 [![license](https://camo.githubusercontent.com/4843b7811c183106f94932273122d886c489bf277ebb5abc7c3fb95127d23658/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f6f70656e2d7370616365642d72657065746974696f6e2f6673727334616e6b69)](https://raw.githubusercontent.com/open-spaced-repetition/fsrs4anki/main/LICENSE)[![release](https://camo.githubusercontent.com/1fddb554295b5d9d62000377f0e4db3ee6288c7cd0013bd4536c8467c1d89c6d/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f762f72656c656173652f6f70656e2d7370616365642d72657065746974696f6e2f6673727334616e6b693f636f6c6f723d626c756576696f6c6574)](https://github.com/open-spaced-repetition/fsrs4anki/releases/latest)

## Table of contents

[](#table-of-contents)

-   [Introduction](#introduction)
-   [How to Get Started?](#how-to-get-started)
-   [Add-on Compatibility](#add-on-compatibility)
-   [Contribute](#contribute)
    -   [Contributors](#contributors)
-   [Developer Resources](#developer-resources)
-   [Stargazers Over Time](#stargazers-over-time)
-   [Acknowledgements](#acknowledgements)

## Introduction

[](#introduction)

FSRS4Anki (Free Spaced Repetition Scheduler for Anki) consists of two main parts: the scheduler and the optimizer.

-   The scheduler replaces Anki's built-in scheduler and schedules the cards according to the FSRS algorithm.
-   The optimizer uses machine learning to learn your memory patterns and finds parameters that best fit your review history. For details about the working of the optimizer, please read [the mechanism of optimization](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-mechanism-of-optimization).

Research on [the FSRS algorithm](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm) follows the path pioneered by Maimemo: data-driven, balancing interpretability and verifiability. See also:

-   [Maimemo: A Stochastic Shortest Path Algorithm for Optimizing Spaced Repetition Scheduling](https://dl.acm.org/doi/10.1145/3534678.3539081?cid=99660547150) (free access) \[[中文版](https://memodocs.maimemo.com/docs/2022_KDD)\], and
-   [Maimemo: Optimizing Spaced Repetition Schedule by Capturing the Dynamics of Memory](https://drive.google.com/file/u/0/d/1riJbkH39JB71Wj0AzESTngUM0LaeoD2l/view) (Google Scholar) \[[中文版](https://memodocs.maimemo.com/docs/2023_TKDE)\].

FSRS Helper is an Anki add-on that complements the FSRS4Anki Scheduler. You can read about it here: [https://github.com/open-spaced-repetition/fsrs4anki-helper](https://github.com/open-spaced-repetition/fsrs4anki-helper)

## How to Get Started?

[](#how-to-get-started)

If you are using Anki 23.10 or newer, refer to this section of [the Anki manual](https://docs.ankiweb.net/deck-options.html#fsrs).

If you are using an older version of Anki, refer to [this tutorial](https://github.com/open-spaced-repetition/fsrs4anki/blob/main/docs/tutorial2.md).

Note that setting up FSRS is much easier in Anki 23.10 or newer.

## Add-on Compatibility

[](#add-on-compatibility)

Some add-ons can cause conflicts with FSRS. As a general rule of thumb, if an add-on affects a card's intervals, it shouldn't be used with FSRS.

Add-on

Compatible?

Comment

[Review Heatmap](https://ankiweb.net/shared/info/1771074083)

Yes ✅

Doesn't affect anything FSRS-related.

[Advanced Browser](https://ankiweb.net/shared/info/874215009)

Yes ✅

Please use the latest version.

[Advanced Review Bottom Bar](https://ankiweb.net/shared/info/1136455830)

Yes ✅

Please use the latest version.

[The KING of Button Add-ons](https://ankiweb.net/shared/info/374005964)

Yes ✅

Please use the latest version.

[Pass/Fail](https://ankiweb.net/shared/info/876946123)

Yes ✅

`Pass` is the equivalent of `Good`, `Fail` is the equivalent of `Again.`

[AJT Card Management](https://ankiweb.net/shared/info/1021636467)

Yes ✅

Compatible with Anki 23.12 and newer.

[Incremental Reading v4.11.3 (unofficial clone)](https://ankiweb.net/shared/info/999215520)

Unsure ❓

If you are using the standalone version of FSRS, it shows the interval given by Anki's built-in scheduler, not the custom scheduler. This add-on is technically compatible with built-in FSRS, but FSRS was not designed for incremental reading, and FSRS settings do not apply to IR cards because they work in a different way compared to other card types.

[Delay siblings](https://ankiweb.net/shared/info/1369579727)

No ❌

Delay siblings will modify the intervals given by FSRS. However, the FSRS Helper add-on has a similar feature that works better with FSRS. Please use the FSRS Helper add-on instead.

[Auto Ease Factor](https://ankiweb.net/shared/info/1672712021)

No ❌

The Ease Factor is no longer relevant when FSRS is enabled, therefore you won't benefit from using this add-on.

[autoLapseNewInterval](https://ankiweb.net/shared/info/372281481)

No ❌

The `New Interval` setting is no longer relevant when FSRS is enabled, therefore you won't benefit from using this add-on.

[Straight Reward](https://ankiweb.net/shared/info/957961234)

No ❌

The Ease Factor is no longer relevant when FSRS is enabled, therefore you won't benefit from using this add-on.

Let me know via [issues](https://github.com/open-spaced-repetition/fsrs4anki/issues) if you want me to check compatibility between FSRS and some add-on.

## Contribute

[](#contribute)

You can contribute to FSRS4Anki by beta testing, submitting code, or sharing your data. If you want to share your data with me, please fill out this form: [https://forms.gle/KaojsBbhMCytaA7h8](https://forms.gle/KaojsBbhMCytaA7h8)

## Contributors

[](#contributors)

[![All Contributors](https://camo.githubusercontent.com/d8d8b1dddb6c7bdd752cfb1d77530beeaff02399e39b8c9e4923ec62fd38aba6/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f616c6c5f636f6e7472696275746f72732d332d6f72616e67652e7376673f7374796c653d666c61742d737175617265)](#contributors-)

## Developer Resources

[](#developer-resources)

If you're a developer considering using the FSRS algorithm in your own projects, we've curated some valuable resources for you. Check out the [Awesome FSRS](https://github.com/open-spaced-repetition/awesome-fsrs) repository, where you'll find:

-   FSRS implementations in various programming languages
-   Related papers and research
-   Example applications using FSRS
-   Other algorithms and resources related to spaced repetition systems

This carefully curated list will help you better understand FSRS and choose the right implementation for your project. We encourage you to explore these resources and consider contributing to the FSRS ecosystem.

## Research Resources

[](#research-resources)

For those new to spaced repetition algorithms, we recommend starting with our comprehensive guide: [Spaced Repetition Algorithm: A Three-Day Journey from Novice to Expert](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/Spaced-Repetition-Algorithm:-A-Three%E2%80%90Day-Journey-from-Novice-to-Expert)

Dive deeper into the academic foundations of FSRS and spaced repetition through our curated collection of [Datasets, Code & Research Papers](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/Research-resources)

Explore our extensive collection of [Research Notebooks](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/Notebooks) documenting detailed analyses and experiments with FSRS and spaced repetition algorithms

## Stargazers Over Time

[](#stargazers-over-time)

  [![Star History Chart](https://camo.githubusercontent.com/fc58f016d9ebc15efa91ae61143ec65a63cd0f7ae902d03e7763c0319eb29aeb/68747470733a2f2f737461722d686973746f72792e646572612e706167652f7376673f7265706f733d6f70656e2d7370616365642d72657065746974696f6e2f6673727334616e6b6926747970653d44617465)](https://star-history.dera.page/#open-spaced-repetition/fsrs4anki&Date)

## Acknowledgements

[](#acknowledgements)

A special thanks to [墨墨背单词 (MaiMemo)](https://www.maimemo.com/) for their support of FSRS development by allowing its research engineer, [Jarrett Ye](https://github.com/L-M-Sherlock), to dedicate part of his working hours to this open-source project. This greatly helps in the continuous improvement and maintenance of FSRS for the benefit of the entire community.

We would also like to extend our sincere gratitude to [Damien Elmes](https://github.com/dae) of [Ankitects](https://github.com/ankitects) for his invaluable technical support, and to the AnkiWeb users for the review history dataset. Without their collective contribution, FSRS would not have achieved its current level of popularity and influence.
