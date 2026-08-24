# Vocabulary mismatch

**Source:** https://en.wikipedia.org/wiki/Vocabulary_mismatch
**Added:** 2026-08-24
**Tags:** #unsorted

---

> From Wikipedia, the free encyclopedia

---

From Wikipedia, the free encyclopedia

**Vocabulary mismatch** is a common phenomenon in the usage of natural languages, occurring when different people name the same thing or concept differently. It is also known as the **vocabulary problem, vocabulary gap, term mismatch,** or **semantic gap.**[\[1\]](#cite_note-:1-1)

Furnas et al. (1987) were perhaps the first to quantitatively study the vocabulary mismatch problem.[\[2\]](#cite_note-2) Their results show that on average 80% of [The Times](https://en.wikipedia.org/wiki/The_Times "The Times") different people (experts in the same field) will name the same thing differently. There are usually tens of possible names that can be attributed to the same thing. This research motivated the work on [latent semantic indexing](https://en.wikipedia.org/wiki/Latent_semantic_indexing "Latent semantic indexing").

One source of vocabulary mismatch is _inflectional form_ differences, such as using a female word instead of a male word, or a plural form instead of a singular form.[\[3\]](#cite_note-:0-3) [Stemming](https://en.wikipedia.org/wiki/Stemming "Stemming") and [lemmatization](https://en.wikipedia.org/wiki/Lemmatization "Lemmatization") are two different methods of addressing this source by converting all variations of a word to one form.[\[3\]](#cite_note-:0-3)

Vocabulary mismatch also occurs when language changes over time. For example, a doctor may search for papers about "[type 1 diabetes](https://en.wikipedia.org/wiki/Type_1_diabetes "Type 1 diabetes") mellitus" and not find papers about "juvenile diabetes" due to a change in terminology.[\[1\]](#cite_note-:1-1)

The vocabulary mismatch between user created queries and relevant documents in a corpus causes the term mismatch problem in [information retrieval](https://en.wikipedia.org/wiki/Information_retrieval "Information retrieval"). Zhao and Callan (2010)[\[4\]](#cite_note-4) were perhaps the first to quantitatively study the vocabulary mismatch problem in a retrieval setting. Their results show that an average query term fails to appear in 30-40% of the documents that are relevant to the user query. They also showed that this probability of mismatch is a central probability in one of the fundamental probabilistic retrieval models, the [Binary Independence Model](https://en.wikipedia.org/wiki/Binary_Independence_Model "Binary Independence Model"). They developed novel term weight prediction methods that can lead to potentially 50-80% accuracy gains in retrieval over strong keyword retrieval models. Further research along the line shows that expert users can use Boolean Conjunctive Normal Form expansion to improve retrieval performance by 50-300% over unexpanded keyword queries.[\[5\]](#cite_note-cnf-5)

-   [Full-text indexing](https://en.wikipedia.org/wiki/Full-text_indexing?action=edit&redlink=1 "Full-text indexing (page does not exist)") instead of only indexing keywords or abstracts \[_[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed "Wikipedia:Citation needed")_\]
-   Use of [controlled vocabularies](https://en.wikipedia.org/wiki/Controlled_vocabulary "Controlled vocabulary") in both indexing and retrieval, such as [taxonomies](https://en.wikipedia.org/wiki/Taxonomy "Taxonomy") or [ontologies](https://en.wikipedia.org/wiki/Ontology "Ontology")[\[6\]](#cite_note-6)
-   Indexing text on inbound links from other documents (or other [social tagging](https://en.wikipedia.org/wiki/Folksonomy "Folksonomy")) \[_[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed "Wikipedia:Citation needed")_\]
-   [Query expansion](https://en.wikipedia.org/wiki/Query_expansion "Query expansion"). Query expansion might be interactive, meaning the user can choose related words, or automatic, meaning the retrieval system adds extra words to the query without user input.[\[3\]](#cite_note-:0-3) A 2012 study by Zhao and Callan[\[5\]](#cite_note-cnf-5) using expert created manual [conjunctive normal form](https://en.wikipedia.org/wiki/Conjunctive_normal_form "Conjunctive normal form") queries has shown that searchonym expansion in the Boolean conjunctive normal form is much more effective than the traditional bag of word expansion e.g. [Rocchio expansion](https://en.wikipedia.org/wiki/Rocchio_algorithm "Rocchio algorithm").
-   Translation-based models \[_[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed "Wikipedia:Citation needed")_\]

In [software engineering](https://en.wikipedia.org/wiki/Software_engineering "Software engineering"), vocabulary mismatch has been described as a barrier to duplicate issue detection.[\[7\]](#cite_note-7)

1.  [1](#cite_ref-:1_1-0) [2](#cite_ref-:1_1-1) Fitzgerald, Kyle Andrew; de la Harpe, Andre Charles; Uys, Corrie Susanna; Bytheway, Andrew John (9 December 2021). ["Information retrieval: Solving mismatching vocabulary in closed document collections"](https://www.scielo.org.za/pdf/sajlis/v87n2/06.pdf) (PDF). _South African Journal of Libraries and Information Science_. **87** (2).
2.  [↑](#cite_ref-2) Furnas, G., et al, The Vocabulary Problem in Human-System Communication, Communications of the ACM, 1987, 30(11), pp. 964-971.
3.  [1](#cite_ref-:0_3-0) [2](#cite_ref-:0_3-1) [3](#cite_ref-:0_3-2) Shekarpour, Saeedeh; Marx, Edgard; Auer, Sören; Sheth, Amit (2017). [_RQUERY: Rewriting Natural Language Queries on Knowledge Graphs to Alleviate the Vocabulary Mismatch Problem_](https://disi.unitn.it/~pavel/OM/articles/Shekarpour_aaai17.pdf) (PDF). Thirty-First AAAI Conference on Artificial Intelligence (AAAI-17). p. 1.
4.  [↑](#cite_ref-4) Zhao, L. and Callan, J., Term Necessity Prediction, Proceedings of the 19th ACM Conference on Information and Knowledge Management (CIKM 2010). Toronto, Canada, 2010.
5.  [1](#cite_ref-cnf_5-0) [2](#cite_ref-cnf_5-1) Zhao, L. and Callan, J., Automatic term mismatch diagnosis for selective query expansion, SIGIR 2012.
6.  [↑](#cite_ref-6) M. N. Asim, M. Wasim, M. U. Ghani Khan, N. Mahmood and W. Mahmood, The Use of Ontology in Retrieval: A Study on Textual, Multilingual, and Multimedia Retrieval, IEEE Access, vol. 7, pp. 21662-21686, 2019, doi: 10.1109/ACCESS.2019.2897849.
7.  [↑](#cite_ref-7) Chaparro, Oscar; Florez, Juan Manuel; Marcus, Andrian (2016). [_On the vocabulary agreement in software issue descriptions_](https://ojcchar.github.io/files/6-icsme16.pdf) (PDF). 2016 IEEE International Conference on Software Maintenance and Evolution (ICSME). IEEE.
