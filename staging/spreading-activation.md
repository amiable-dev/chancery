# Spreading activation

**Source:** https://en.wikipedia.org/wiki/Spreading_activation
**Added:** 2026-08-24
**Tags:** #unsorted

---

> From Wikipedia, the free encyclopedia

---

From Wikipedia, the free encyclopedia

**Spreading activation** is a method for searching associative networks, [biological](https://en.wikipedia.org/wiki/Neural_network_\(biology\) "Neural network (biology)") and [artificial neural networks](https://en.wikipedia.org/wiki/Neural_network_\(machine_learning\) "Neural network (machine learning)"), or [semantic networks](https://en.wikipedia.org/wiki/Semantic_network "Semantic network").[\[1\]](#cite_note-faehndrich-1) The search process is initiated by labeling a set of source nodes (e.g. concepts in a semantic network) with weights or "activation" and then iteratively propagating or "spreading" that activation out to other nodes linked to the source nodes. Most often these "weights" are real values that decay as activation propagates through the network. When the weights are discrete this process is often referred to as marker passing. Activation may originate from alternate paths, identified by distinct markers, and terminate when two alternate paths reach the same node. However brain studies show that several different brain areas play an important role in [semantic processing](https://en.wikipedia.org/wiki/Semantic_processing "Semantic processing").[\[2\]](#cite_note-patterson-2)

Spreading activation in semantic networks as a model were invented in [cognitive psychology](https://en.wikipedia.org/wiki/Cognitive_psychology "Cognitive psychology")[\[3\]](#cite_note-CollinsLoftus1975-3)[\[4\]](#cite_note-Anderson1983-4) to model the fan out effect.\[_[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed "Wikipedia:Citation needed")_\]

Spreading activation can also be applied in [information retrieval](https://en.wikipedia.org/wiki/Information_retrieval "Information retrieval"),[\[5\]](#cite_note-preece-5)[\[6\]](#cite_note-crestani-6) by means of a network of nodes representing documents and terms contained in those documents.

## Cognitive psychology

\[[edit](https://en.wikipedia.org/w/index.php?title=Spreading_activation&action=edit&section=1 "Edit section: Cognitive psychology")\]

As it relates to [cognitive psychology](https://en.wikipedia.org/wiki/Cognitive_psychology "Cognitive psychology"), spreading activation is the theory of how the brain iterates through a network of associated ideas to retrieve specific information. The spreading activation theory presents the array of concepts within our memory as cognitive units, each consisting of a node and its associated elements or characteristics, all connected together by edges.[\[4\]](#cite_note-Anderson1983-4) A spreading activation network can be represented schematically, in a sort of web diagram with shorter lines between two nodes meaning the ideas are more closely related and will typically be associated more quickly to the original concept. In memory psychology, the spreading activation model holds that people organize their knowledge of the world based on their personal experiences, which in turn form the network of ideas that is the person's knowledge of the world.[\[3\]](#cite_note-CollinsLoftus1975-3)

When a word (the target) is preceded by an associated word (the prime) in [word recognition](https://en.wikipedia.org/wiki/Word_recognition "Word recognition") tasks, participants seem to perform better in the amount of time that it takes them to respond. For instance, subjects respond faster to the word "doctor" when it is preceded by "nurse" than when it is preceded by an unrelated word like "carrot". This semantic priming effect with words that are close in meaning within the cognitive network has been seen in a wide range of tasks given by experimenters, ranging from sentence verification to lexical decision and naming.[\[7\]](#cite_note-chwilla-7)

As another example, if the original concept is "red" and the concept "vehicles" is primed, they are much more likely to say "fire engine" instead of something unrelated to vehicles, such as "cherries". If instead "fruits" was primed, they would likely name "cherries" and continue on from there. The activation of pathways in the network has everything to do with how closely linked two concepts are by meaning, as well as how a subject is primed.

A [directed graph](https://en.wikipedia.org/wiki/Directed_graph "Directed graph") is populated by Nodes\[ 1...N \] each having an associated activation value A \[ i \] which is a [real number](https://en.wikipedia.org/wiki/Real_number "Real number") in the range \[0.0 ... 1.0\]. A Link\[ i, j \] connects source node\[ i \] with target node\[ j \]. Each edge has an associated weight W \[ i, j \] usually a real number in the range \[0.0 ... 1.0\].[\[8\]](#cite_note-8)

Parameters:

-   Firing threshold F, a real number in the range \[0.0 ... 1.0\]
-   Decay factor D, a real number in the range \[0.0 ... 1.0\]

Steps:

1.  Initialize the graph setting all activation values A \[ i \] to zero. Set one or more origin nodes to an initial activation value greater than the firing threshold F. A typical initial value is 1.0.
2.  For each unfired node \[ i \] in the graph having an activation value A \[ i \] greater than the node firing threshold F:
3.  For each Link \[ i, j \] connecting the source node \[ i \] with target node \[ j \], adjust A \[ j \] = A \[ j \] + (A \[ i \] \* W \[ i, j \] \* D) where D is the decay factor.
4.  If a target node receives an adjustment to its activation value so that it would exceed 1.0, then set its new activation value to 1.0. Likewise maintain 0.0 as a lower bound on the target node's activation value should it receive an adjustment to below 0.0.
5.  Once a node has fired it may not fire again, although variations of the basic algorithm permit repeated firings and loops through the graph.
6.  Nodes receiving a new activation value that exceeds the firing threshold F are marked for firing on the next spreading activation cycle.
7.  If activation originates from more than one node, a variation of the algorithm permits marker passing to distinguish the paths by which activation is spread over the graph
8.  The procedure terminates when either there are no more nodes to fire or in the case of marker passing from multiple origins, when a node is reached from more than one path. Variations of the algorithm that permit repeated node firings and activation loops in the graph, terminate after a steady activation state, with respect to some delta, is reached, or when a maximum number of iterations is exceeded.

[![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Spreading-activation-graph-1.png/500px-Spreading-activation-graph-1.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail)](https://en.wikipedia.org/wiki/File:Spreading-activation-graph-1.png)

In this example, spreading activation originated at node 1 which has an initial activation value of 1.0 (100%). Each link has the same weight value of 0.9. The decay factor was 0.85. Four cycles of spreading activation have occurred. Color hue and saturation indicate different activation values.

-   [Connectionism](https://en.wikipedia.org/wiki/Connectionism "Connectionism")

1.  [↑](#cite_ref-faehndrich_1-0) Fähndrich, J. (2018). Semantic decomposition and marker passing in an artificial representation of meaning. Technische Universitaet Berlin (Germany).[](https://depositonce.tu-berlin.de/bitstreams/27b7d018-fb95-4053-a509-338e33c0dd7b/download)
2.  [↑](#cite_ref-patterson_2-0) Karalyn Patterson, Peter J. Nestor & Timothy T. Rogers: "Where do you know what you know? The representation of semantic knowledge in the human brain"[](http://www.nature.com/nrn/journal/v8/n12/full/nrn2277.html)
3.  [1](#cite_ref-CollinsLoftus1975_3-0) [2](#cite_ref-CollinsLoftus1975_3-1) Collins, Allan M.; Loftus, Elizabeth F. (1975). "A spreading-activation theory of semantic processing". _Psychological Review_. **82** (6): 407–428\. [doi](https://en.wikipedia.org/wiki/Doi_\(identifier\) "Doi (identifier)"):[10.1037/0033-295X.82.6.407](https://doi.org/10.1037%2F0033-295X.82.6.407). [ISSN](https://en.wikipedia.org/wiki/ISSN_\(identifier\) "ISSN (identifier)") [0033-295X](https://search.worldcat.org/issn/0033-295X). [S2CID](https://en.wikipedia.org/wiki/S2CID_\(identifier\) "S2CID (identifier)") [14217893](https://api.semanticscholar.org/CorpusID:14217893).
4.  [1](#cite_ref-Anderson1983_4-0) [2](#cite_ref-Anderson1983_4-1) Anderson, John R. (1983). "A spreading activation theory of memory". _Journal of Verbal Learning and Verbal Behavior_. **22** (3): 261–295\. [doi](https://en.wikipedia.org/wiki/Doi_\(identifier\) "Doi (identifier)"):[10.1016/S0022-5371(83)90201-3](https://doi.org/10.1016%2FS0022-5371%2883%2990201-3). [ISSN](https://en.wikipedia.org/wiki/ISSN_\(identifier\) "ISSN (identifier)") [0022-5371](https://search.worldcat.org/issn/0022-5371).
5.  [↑](#cite_ref-preece_5-0) S. Preece, A spreading activation network model for information retrieval. PhD thesis, University of Illinois, Urbana-Champaign, 1981.
6.  [↑](#cite_ref-crestani_6-0) Fabio Crestani. "Application of Spreading Activation Techniques in Information Retrieval". _Artificial Intelligence Review_, 1997
7.  [↑](#cite_ref-chwilla_7-0) Chwilla, Dorothee J.; Hagoort, Peter; Brown, C. M., "The mechanism underlying backward priming in a lexical decision task: spreading activation versus semantic matching", The Quarterly Journal of Experimental Psychology, 1998, 51A (3), 531–560[](https://www.socsci.ru.nl/~dorothec/downloads/Quarterly_Journal_Experimental_Psychology_Chwilla,Hagoort%26Brown.pdf)
8.  [↑](#cite_ref-8) [Boosting item keyword search with spreading activation](http://www.public.asu.edu/~hdavulcu/SA-ACMWI05.pdf) Aswath, D.; Ahmed, S.T.; Dapos;cunha, J.; Davulcu, H., Web Intelligence, 2005. Proceedings. The 2005 IEEE/WIC/ACM International Conference on Volume, Issue, 19–22 Sept. 2005 Pages: 704–707

-   Nils J. Nilsson. "Artificial Intelligence: A New Synthesis". Morgan Kaufmann Publishers, Inc., San Francisco, California, 1998, pages 121–122
-   Rodriguez, M.A., [" Grammar-Based Random Walkers in Semantic Networks"](https://arxiv.org/abs/0803.4355), _Knowledge-Based Systems_, 21(7), 727–739, [doi](https://en.wikipedia.org/wiki/Doi_\(identifier\) "Doi (identifier)"):[10.1016/j.knosys.2008.03.030](https://doi.org/10.1016%2Fj.knosys.2008.03.030), 2008.
-   Karalyn Patterson, Peter J. Nestor & Timothy T. Rogers "Where do you know what you know? The representation of semantic knowledge in the human brain", Nature Reviews Neuroscience 8, 976–987 (December 2007)
