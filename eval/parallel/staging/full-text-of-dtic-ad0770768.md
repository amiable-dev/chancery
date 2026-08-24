# Full text of "DTIC AD0770768: Secure Computer Systems: Mathematical Foundations"

**Source:** https://archive.org/stream/DTIC_AD0770768/DTIC_AD0770768_djvu.txt
**Added:** 2026-08-24
**Tags:** #unsorted

---

## [See other formats](https://archive.org/details/DTIC_AD0770768)

  

M.-T-^^jE , -JEk» 


AD-770  768 

SECURE  COMPUTER  SYSTEMS:  MATHEMATICAL 
FOUNDATIONS 

D.  Elliott  Bell,  et  al 

Mitre  Corporation 

\_ \_ \_ 


Prepared 


for: 


Electronics  Systems  Division 


November  1973 


DISTRIBUTED  BY: 


National  Technical  Information  Sonrico 
U.  S.  DEPARTMENT  OF  COMMERCE 

5285  Port  Royal  Road,  Springfield  Va.  22151 


\\ t 


ESD-TR-73-278,  Vol.  I 


MTR-2547,  Vol.  1 


i 

SECURE  COMPUTER  SYSTEMS:  MATHEMATICAL  FOUNDATIONS 


D.E.  Bell 
L.J.  I^Padula 


NOVEMBER  1973 

i 

Prepared  for 

DEPUTY  FOR  COMMAND  AND  MANAGEMENT  SYSTEMS 


ELECTRONIC  SYSTEMS  DIVISION 
AIR  FORCE  SYSTEMS  COMMAND 
UNITED  STATES  AIR  FORCE 
L.  G.  Haitscotn  Field.  Bedford,  Massachusetts 


Ptproduz\*d  by 


NATIONAL  TECHNICAL 
INFORMATION  SERVICE 

U  $  D\*ixj/trr#nt  of  Commit\*# 
Sp^figfi^ld  V\*  ?JI$1 


I  Approv'd  for  public  r»t\*#»e; 
\[  distribution  unlimited. 


Project  522B 

'Prepared  by 

THE  MITRE  CORPORATION 
Bedford,  Massachusetts 

Contract  No.  F19628-73-C-0001 


Publication  of  this  technical  report  does  not  constitute  Air  Force  approval 
of  the  report's  findings  or  conclusions.  It  is  published  only  for  the  exchange 
and  stimulation  of  ideas. 


MELVIN  B.  EMMONS,  Colonel,  USAF 
Director,  Information  Systems  Technology 
Deputy  for  Command  &  Management  Systems 


-\*rfe\*S 


SECURITY  CLASSIFICATION  OF  THIS  PAGE  QWian  Data  Snltttd) \_ 

REPORT  DOCUMENTATION  PAGE  befoIe^p^tSg  form 

•’.  "report  number  I?.  GOVS' ACCESSION  no!  3.  RECIPIENT’S  CATALOG  NUMBER 


ESD-TR-73-27S,  Vol.  I 

4.  TITLE  (and  Submit) 

SECURE  COMPUTER  SYSTEMS:  MATHEMATICAL 
FOUNDATIONS 


17.  AljTK'ORC\*J 


S.  TYPE  OP  REPORT  •  PERIOD  COVERED 


C.  PERFORMING  OEJG.  REPORT  NUMBER 

MTR-2547,  Vol.  I \_ 

4.  CONTRACT  ON  GRANT  NUMBERft) 


D.  E.  Bell,  L.J.  LaPaduIa 

9.  PERFORMINGORGANIZATION  NAME  AND  ADDRESS 

The  MITRE  Corporation 
Box  20S 

Bedford.  Mass.  01730 \_ \_ 

t».  CONTROLLING  OFFICE  NAME  AND  ADDRESS 

Deputy  for  Commend  and  Management  Systems 

Electronics  Systems  Division,  AFSC  \_ \_ 

L.  G.  Hanscom  Field.  Bedford,  Mass.  01730 \_ 

<4.  MONITORING  AGENCY  name  4  ADDRESS (II  dlllttonl  Item  Conltjlllng  Olllca) 


FI  9628-73-C-0001 


•  0.  PROGRAM  ELEMENT.  PROJECT.  TASK 
AREA  4  WORK  UNIT  NUMBERS 


•  2.  REPORT  DATE 

\_ NQV5MB.E  R..I.822 \_ 

»3.  NUMBER  OF  PAGES 

\_ 33  V/ \_ 

IS.  SECURITY  CLASS,  (ot  thlt  report) 


Unclassified 

15».  DECLASSIFICATION/ C04NGRADING 
SCHEDULE 


16.  DISTRIBUTION  STATEMENT  (ot  thlt  Report) 

Approved  for  public  release;  distribution  unlimited. 


•  7.  DISTRIBUTION  STATEMENT  (ol  iht  abetrac  I  antond  In  Bloch  20.  II  dllltrtnl  Irom  Report) 


i  10.  5UPPS.EMEN  TARY  NOTES 


•9.  KEY  WORDS  (Contlnut  on  rtrtrtt  ttdt  II  ntctttory  and  Idantlty  by  block  number) 

MATHEMATICAL  MODELS 
MULTI-LEVEL  SYSTEMS 
SECURE  COMPUTER  SYSTEMS 

2:  ABSTRACT  (Continue  on  rtvtrtt  tldt  II  necettary  and  Identity  by  block  .twit bat) 

This  paper  reports  the  first  results  of  an  investigation  into  solutions  to  problems  of 
security  in  computer  systems;  it  establishes  the  basis  for  rigorcus  investigation  by 
providing  a  general  descriptive  model  of  a  computer  system. 

Borrowing  basic  concepts  and  constructs  from  general  systems  theory,  we  present 


DO  1  ;  an\*73  1473  EDITION  OF  «  NOV  «S  IS  OBSOLETE 


SECURITY  CLASSIFICATION  OF  THIS  PAGE  (\*han  Bala  Bntarad) 


SCC..«ITV  CLASSIFICATION  OF  THI\*  FAOKfNfcW  Ba»\*  Unit  rut)  -  - 


a  basic  result  concerning  security  in  computer  systems,  using  precise  notions  of 
"security"  and  "compromise".  V»e  also  demonstrate  how  a  change  in  requirements 
can  be  reflected  in  the  resulting  mathematical  model . 

A  lengthy  introductory  section  is  included  in  order  to  bridge  the  gap  between  general 
systems  theory  and  practical  problem  solving.  t 


security  classification  of  this 


FC REWORD 


This  is  Volume  I  of  a  multi-volume  report  prepared  by  The  MITRE 
Corporation,  Bedford,  Massachusetts,  in  support  of  Project  522B  under 
Contract  No.  F19628-73-C-0001. 

The  authors  of  the  report  are  D.  Elliott  Bell  and  Leonard  J. 
LaPadula  of  the  MITRE  Corporation. 

This  report  represents  an  initial  attempt  at  specifying  require¬ 
ments  for  a  secure  ojmputer  system  based  upon  the  development  and 
verification  of  a  mathematical  model. 

The  assumptions  ana  specifications  relating  tc»  security  require¬ 
ments  as  expressed  in  the  report  are  not  necessarily  applicable  to 
any  specific  system.  The  development  presented  here  will  help  to 
reveal  and  clarify  the  basic  problems  and  issues  confronting  designers 
of  multi-level  secure  computer  systems. 


iii 


PREFACE 


-’HI  vz&yjrtttG&ZS\*\*\* 


;;.T--‘  r.?.'~?v:'i“'-' 


fThvm  ■svvrzvwzvF 


General  systems  theory  is  a  relatively  new  and  rapidly  growing 
mathematical  discipline  which  shows  great  promise  for  application 
in  the  computer  sciences.  The  discipline  includes  both  "general 
systercs-theory"  and  "general-systems  theory":  that  is,  one  may 
properly  read  the  phrase  "general  systems  tlieory"  in  both  ways. 


In  this  paper,  we  have  borrowed  from  the  works  of  general 

/ 

systems  theorists,  principally  from  the  basic  work  of  Masarovic, 
to  formulate  a  mathematical  framework  within  which  to  deal  with  the 
problems  of  secure  computer  systems.  At  the  present  time  we  feel 
that  the  mathematical  representation  developed  herein  is  adequate 
to  deal  with  most  if  not  all  of  the  security  problems  one  may  wish 
to  pose.  In  Section  III  we  have  given  a  result  which  deals  with  the 
most  trivial  of  the  secure  computer  systems  one  might  find  viable 
in  actual  use.  In  the  concluding  section  we  review  the  application 
of  our  mathematical  methodology  and  suggest  major  areas  of  concern 
in  the  design  of  a  secure  system. 

The  results  reported  in  this  paper  lay  the  groundwork  for  further, 
mo,\*e  specific  investigation  into  secure  jmputer  systems.  The  investi¬ 
gation  will  proceed  by  specializing  the  elements  of  the  model  to 
^present  particular  aspects  of  system  design  and  operation.  Such  an 
investigation  will  be  reported  in  the  second  volume  of  this  series 
where  we  assume  a  system  with  centralized  access  control.  A  preliminary 
investigation  of  distributed  access  is  just  beginning;  the  results  of 
that  investigation  would  be  reported  in  a  third  volume  of  the  series. 


iv 


6 


i 


w&a-WSKJ'JR! 


TABLE  OF  CONTENTS 


LIST  OF  TABLES 


SECTION  I  INTRODUCTION 

GENERAL  SYSTEMS 
SYSTEM  MODELING 
SECURE  COMPUTER  SYSTEMS 
PROBLEMS  OF  SECURITY 
SUMMARY  AND  REFERENCES 

SECTION  II  FOUNDATIONS  OF  A  MATHEMATICAL  MODEL 

ELEMENTS  OF  THE  MODEL 
STATES  OF  THE  SYSTEM 
STATE-TRANSITION  RELATION 
SUMMARY  AND  REFERENCES 


SECTION  III  A  FUNDAMENTAL  RESULT 

COMPROMISE  AND  SECURITY 
ASSUMPTIONS 

BASIC  SECURITY  THEOREM 
SUMMARY 


SECTION  IV  CONCLUSION 

INTRODUCTION 
PROBLEM  REFORMULATION 

Basic  Security  Theorem  (revised) 
ACCESS  CONTROL 
DATA  BASE  SHARING 
SUMMARY  AND  REFERENCES 


BIBLIOGRAPHY 


\*  n 
4  >. 


I 


v 


fVt  m  i  j  ri 


LIST  OF  TABLES 


Table  Number 


I 

State-Transition  Table 

II 

Elements  of  the  Model 

III 

Initial  Requirements 

IV 

Modified  Requirements 

vi 


,  SECTION  I 

INTRODUCTION 

GENERAL  SYSTEMS 

We  shall  begin  by  presenting  a  brief  description  of  general 
systems  theory  as  we  shall  use  it  in  this  paper.  We  consider  a 
systen  in  its  oust  general  form  to  be  a  relation  on  abstract  sets. 

We  express  this  mathematically  by  the  expression 

S  i  X  x  y 

where  the  system  S  is  a  relation  on  the  abstract  sets  X  and 
Y.  If  S  is  a  function  from  X  to  Y  (S;  X  Y),  then  it  is 

natural  to  consider  S  to  be  a  functional  system.  In  this  case,  it 

is  convenient  to  consider  the  elements  of  X  to  be  Inputs  and  the 
elements  of  Y  to  be  outputs  so  that  S  expresses  a  functional 
input-output  relationship.  By  appropriate  choice  of  the  sets  X 
and  Y  (and  a  set  Z  to  represent  states  when  necessary),  one  can 

closely  represent  some  situation  of  particular  interest  and  reach 

\*  significant  conclusions  about  that  situation. 

This  very  general  definition  of  a  system  provides  a  framework 
of  investigation  which  has  very  wide  applicability  and,  as  we  shall 
see  in  Section  III,  unexpected  power.  We  shall  illustrate  the 
concept's  applicability  with  three  examples. 

Example  1;  Consider  a  savings  account  in  a  bank  which  compounds 
interest  quarterly.  The  general  situation  of  varying  payments, 
withdrawals,  and  interest  rates  can  be  described  by  &  difference 


equation  as  follows: 


bk  "  (bk-l  +  \*v)  \*  (1  +  V  (1\*1) 

where  b^  represents  the  balance  after  the  computation  of  interest 
at  the  and  of  the  k-th  quarter,  p^.  represents  the  net  transaction 
(that  is,  the  net  of  deposits  and  withdrawals)  in  the  account  during 
the  k~th  quarter,\*  and  i^  represents  the  quarterly  Interest  rate  at 
the  end  of  the  k-th  quarter.  A  seven-year  history  of  such  a  savings 
account  (seven  years  for  tax  purposes)  is  represented  by  a  system 

S(bQ)  C  P  x  i  x  s 

where 

bn  represents  the  initial  balance  in  the  account; 

^  28+ 

P  «  R  represents  the  twenty-eight  transactions; 

28 

I  «  R  represents  the  twenty-eight  quarterly  interest  rates 
28 

and  B  \*  R  represents  the  twenty-eight  successive  balances 


and  (p,i,b)  z  S(by)  if  and  only  if  equation  (1,1)  holds  for  every 
k  from  i  to  28  inclusive,  where  p  -  (p^,  •  •  •,  p2g); 


i  -  (i^,  •  •  ♦  ,  i2g);  and  b  -  (b^,  •  •  •  ,  b2g).  The  system  S(bQ) 
describes  in  full  generality  the  seven-year  savings-account  history 
in  any  circumstance.  Certain  results  in  econometrics  are  equivalent 


to  determining  b2g  under  further  specific  assumptions.  For  example, 
the  determination  of  b2g  for  (p,i,b)  e  S(0)  where  p2  \*  \*  \*  \*  \* 
P2g  »  0  and  i^  -  i2  \*  •  •  »  \*  i2g  >  0  is  accomplished  using  the 


\*Ve  assume  for  simplicity  that  interest  is  paid  on  the  amount  in  the 
account  at  the  end  of  the  quarter. 

tThe  set  of  28-tuples  of  real  numbers. 


2\* 


-■SS^S^5\* 


coopound  interest  formula 


b28  -  »j.  \*  <1  +  ix>  • 


A  number  of  remarks  concerning  this  example  are  in  order.  It 
is  certainly  true  that  the  use  of  an  econometric  table  prepared  for 
a  specific  situation  is  easier  than  the  direct  use  of  the  difference 
equation  (1.1).  On  the  other  hand,  small  changes  in  a  situation  can 
moke  the  use  of  tables  cumbersome.  For  example,  suppose  that  the 
p^  in  the  sequence  (p^,  p2,  \*  \*  \*  ,  P2g)  are  positive  and  distinct 
and  that  i.  «  ij  \*  \*  \*  \*  \*  i2g  >  0.  Then  by  use  of  econometric 
tables,  we  compute  b2g  by  the  formula 


\*  P4  \*  <F/P,  i.,  29  -  j).’ 
\*1  -1 


IhiB  means  that  the  compound  amount  factor  (F/P,  i^,  29  -  j)  must 
be  looked  up  28  times  in  the  coopound  interest  factors  table  one  is 
using.  If  we  further  complicate  the  problem  by  having  the  i^  in 
(i  ,  i2,  •  •  •  ,  i2g)  distinct  and  positive,  then  we  could  compute 
b28  ky  the  iterative  method: 

b28  ■  <b27  +  >>28>  ’  (F/P>  \*28\*  « 
b27  \*  ^b26  +  p27^  \*  127’  lj> 


bi  "  (bo  \*  pl}  \*  (F/P\*  il»  1); 


or  we  could  use  the  single  formula  obtainable  by  straightforward 
algebraic  restitution  in  the  equations  above.  So,  to  find  b2g, 

\*See  15\],  page  594. 


we  start  with  b^  and  work  backwards;  in  using  the  compound  Interest 
factors  tables  we  should  have  to  do  28  look-ups,  each  on  a  different 
page  since  in  each  quarter  the  interest  is  different  from  that  in 
any  other  quarter.  If  it  happens  that  each  1^  <  kS,  where  k 1  is 
the  lowest  interest  for  which  we  have  a  table,  our  problem  has  become 
even  more  severe.  It  is  much  easier  in  these  sases,  especially  on 
a  digital  computer,  simply  to  use  the  difference  equation  (1,1). 

The  preceding  remarks  should  illustrate  that  the  most  important 
characteristics  of  the  system  (that  is,  the  difference  equation)  are 
its  appropriateness  to  the  situation  modeled  and  its  general  applica¬ 
bility. 

Example  2:  Consider  the  motion  of  a  body  B  suspended  on  an 
ideal  spring.  The  motion  is  governed  by  the  differential  equation 

m  \*  s"(t)  +  k  •  s(t)  »  x(t)  (1.2) 

where  m  is  the  mass  of  B,  s(t)  is  the  position  of  B  at  time 
t,  k  is  a  constant  of  the  spring,  and  x(t)  is  an  external  force 
acting  on  B  at  time  t.  If  C  is  the  set  of  all  analytic  functions 
on  \[0,®),  then  the  differential  equation  (1.2)  with  initial  condi¬ 
tions  s(0)  »  a  and  s'(0)  \*  b  is  represented  by  the  system  S(a,b) 
defined  as  follows: 

S(a,b)  9  C  x  C 

where  (x(t),  s(t))  e  S(a,b)  if  and  only  if  s(0)  »  a,  s’  (0)  -  b, 
and  the  functions  x  and  s  satisfy  (1.2)  for  all  t  e  \[0,®). 

Hence  the  familiar  analytical  tool  of  differential  equations  is  a 


4 


system  under  our  very  broad  definition.  Our  third  example.  Kill  show 
that  finite-state  machines  are  also  encompassed  in  our  concept  of 
system. 


Example  3;  Consider  a  vending  machine  which  accepts  nickels, 
dimes,  and  quarters  for  a  ten-cent  cup  of  coffee  and  gives  change 
if  any  is  due.  Let  A  \*  {5,10,25}  represent  the  coins  acceptable' 
to  the  machine.  Let  ■>  {\*,£!•}  where  means  “no  coffee"  and  "C" 
means  "coffee\*\*.  Let  B2  «  {0,5,10,25}  represent  the  coins  the 
machine  can  return.  The  set  B  \*  x  x  specifies  the  set 
of  outputs  that  can  occur  at  any  time.  Now  let  the  set  Q  \*  {q^q^} 
represent  the  states  of  the  machine.  We  give  a  state  transition 
function  f:  A  \*  Q  +  Q  and  an  output  function  g:  A  \*  Q  -\*  B  by 
the  ..ollcviag  table: 

Table  I 

State-  Transit  1r\*n 


flB 

a  -  10 

a  -  25 

a  \*  5 

a  ■  10 

a  \*  25 

f(a»q0) 

uja  ■ 

m 

g(a,q0) 

($.0,0) 

(C,0,0) 

(C,5,10) 

% 

i 

1  % 

m 

gCa.qj^) 

(C,0,0) 

(C,5,0) 

We  have  now  modeled  the  vending  machine  as  a  finite-state  machine 
in  the  usual  manner. 

Now  suppose  that  we  observe  u  trials.  Let  An  and  Bn  be, 
respectively,  the  sets  of  all  n-tuples  from  the  sets  A  and  B. 

Then  for  a  given  initial  state  q  -  q.,  i  e  {0,1},  there  corresponds 


ft 

♦ 


to  any  input  tape  x  in  An  a  unique  output  tape  y  in  £n.  We 
have  defined  a  mapping 

S  :  An  -\*■  Bn 

q 

such  that  for  each  x  in  An  the  image  y,<=  S^(x)  is  the  unique 

oucput  sequence  corresponding  to  the  input  sequence  x  and  the 

initial  state  q  \*  q^.  We  say  that  the  vending  machine  is 

represented  by  the  svstem  SC  An  \*  B31  where  S  \*  S  US  . 

%  \*1 

Considering  that  in  normal  operation  of  the  machine  the  initial 
state  is  q^,  we  can  consider  the  vending  machine  to  be  the  functional 

system  . 

\*0 

The  examples  we  have  presented  are  Intended  to  enhance  the 
intelligibility  of  the  discussion  of  system  modeling  in  the  next 
section.  Additionally,  the  enrichment  of  one's  intuitive  notions 
through  the  use  of  examples  will,  hopefully,  serve  a  similar  purpose 
in  the  next  section. 

SYSTEM  MODELING 

The  mathematics  of  relations  among  objects  with  which  we  deal 
is  designed  to  provide  a  useful  model  for  our  investigation  of  secure 
computer  systems.  Three  desirable  properties  of  such  a  model  suggested 
by  the  examples  of  the  previous  section  are  generality,  a  predictive 
ability,  and  appropriateness.  In  this  section,  we  shall  discuss  each 
of  these  properties  in  turn,  commenting  on  its  relation  to  a  "useful" 
model  of  a  particular  situation. 

Differential  equations  are  systems  that  frequently  display 
great  generality.  Equation  (1.2)  illustrates  this  point  clearly. 

6 


sT-»^.6\*r?u53?J 


-  wylfwaww^ 


Without  knowing  the  mass  of  B  ana  without  specifying  the  spring 
constant  k,  we  can  nevertheless  analyze  the  general  system.  In 
fast,  for  x.(t;  t  0,  (1.2)  has  the  closed  form  solution 


s(t)  \*  A  \*  sin(nt  +  C), 


(1.3) 


where  n\*  (k/nj  x  and  A  and  C  are  constants  determined  by  the 
initial  conditions  e  and  b.  Moreover,  equation  (1.2)  is  a  special 
case  of  the  more  general  form 

s"(t)  +  2k  \*  s'(t)  +  n2  \*  s (t )  -  x(t) 

which  models  a  vast  number  of  elastic  vibrations  including  electrical 
oscillations  (as  It\*  a  capacitor)  and  the  vibrations  in  pipe  organs  \[2\]. 

A  model  too  closely  tied  to  a  specific  application  loses  the 
possiblity  of  more  general  applicability.  On  the  other  hand,  a  model, 
insufficiently  rooted  in  the  problem  at  hand  will  not  allow  accurate 
prediction  of  the  behavior  of  the  physical  system  being  modeled. 

For  example,  knowing  the  initial  conditions  of  the  suspended  weight 
B,  the  mass  of  B,  and  the  sprint  constant  d,  we  can  predict 
precisely  where  B  will  be  5.83337  seconds  from  "let-g^. ”  The 
same  sort  of  precise  predictive  power  is  desirable  in  modeling  discrete 
computer  systems.  Moreover,  in  modeling  secure  computer  systems  we 
must  deny  ourselves  the  luxury  of  accepting  approximate  answers  and 
Insist  on  absolute  rather  than  probabilistic  determinacy. 


The  last  important  feature  of  a  model  is  its  appropriateness 
to  the  situation  of  interest.  In  each  of  the  three  examples  of 
Section  I,  the  type  of  system  used  appropriately  described  the 
important  properties  of  the  situation  being  modeled.  One  parciu’tlar 


advantage  of  an  appropriate  model  can  be  illustrated  by  the  third 
example,  while  the  severe  problems  which  an  inappropriate  model  can 
cause  can  be  demonstrated  by  a  discussion  of  the  second  example. 

The  vending  machine  modeled  in  Example  3  illustrates  that  problems 
other  than  correctness  con  be  detected  in  a  model  appropriate  to  a 
given  situation.  In  particular,  the  machine  we  have  defined  has  this 
interesting  characteristic:  if  in  state  one  continually  Inserts 

quarters  into  the  machine,  the  machine  monotonously  returns  a 
quarter  and  gives  no  coffee.  This  is  a  behavioral  characteristic 
which  the  vending  machine  company  might  consider  undersirable.  We 
have  purposely  constructed  our  sample  machine  in  thi3  way  in  order  to 
show  that  while  the  machine  is  "correct"  in  its  operation,  we  may 
consider  it  to  be  non-viable  as  a  profit-making  item.\* 

Mow  consider  the  situation  modeled  in  Example  2.  If  a  discrete 
model  had  been  chosen  ever  a  continuous  one,  the  model  might  have 
been  represented  by  discrete  observations  of  toe  spring-weight  tandem 

u£  •  s(t),  t  «  0,  1,  2,  3,  •  •  •  (1.4) 

where  s(t)  is  the  same  position  function  appearing  in  (1.2). 

Suppose  B  has  mass  ■  1  gram,  the  time  Interval  is  1  second,  and 

2 

the  spring  constant  is  k  •>  39.478  g/sec  .  In  this  special  case, 
the  motion  of  B  indicates  no  apparent  movement — the  body  B 
is  always  the  same  position  (s (0) )  at  each  observation  time.  The 


\*Thi8  characteristic  (i.e. t  returning  quarters  inserted  after  a  single 
nickel  has  been  put  into  the  machine)  is  one  which  might  irritate 
customers  and  not  sell  coffee  in  the  process.  An  alternative  approach 
which,  although  not  correct,  might  be  more  acceptable  to  a  vending 
machine  company  would  be  to  set  i'(25,  q^)  »  qQ  and  g(25,  q^) 
(C,5,10):  that  Is,  make  change  for  the  quarter,  supply  coffee,  and 
ignore  the  nickel.  Purposefully  or  inadvertently,  this  may  well  be 
the  course  chosen  by  some  vending  machine  companies. 


8 


periodicity  of  B's  morion  is  precisely  vhat  makes  a  continuous 
differential-equation  model  more  appropriate  than  a  discrete  model 
of  the  type  described  (in  addition  to  the  more  accurate  predictive 
power).  The  point  is  that  an  inappropriate  model  of  a  problem  situa¬ 
tion  can  obfuscate  the  essential  issues  involved,  thus  complicating 
the  problem. 

The  major  task  in  system  modeling  is  to  provide  a  useful  model 
of  the  situation  under  scrutiny,  a  model  which  exhibits  generality, 
a  predictive  ability,  and  appropriateness  to  the  problem  at  hand. 

SECURE  COMPUTER  SYSTEMS 

A  number  of  systems  have  been  built  and  designed  which  attack 
the  general  problem  of  security  in  some  form  and  to  some  extent. 

In  some  cases,  privacy  of  data  is  the  principal  objective;  in  others, 
the  prime  objective  is  access  control.  Por  the  security  criteria 
which  we  shall  establish,  however,  no  existing  system  of  which  we  are 
aware  is  adequate.  \* 

When  we  speak  of  a  secure  computer  system,  we  mean  one  which 
satisfies  some  definition  of  "security”.  Our  interest  is  security 
In  the  usual  military  and  governmental  senses  —  that  is,  security 
involving  classifications  and  ne^is-to-know. 

We  shall  investigate  a  bounded  form  of  the  general  problem  of 
security.  Our  interest  shall  be  to  certify  that  within  the  digital 
computer,  which  is  only  part  of  a  total  system,  no  security  compro¬ 
mise  will  occur.  The  elements  with  which  we  shall  deal,  then,  are 
processes  (programs  in  execution),  data,  access  control  algorithms, 
classifications  of  data  and  processes,  and  the  needs-to-knov  of 
elements  within  the  digital  computer. 

./  t  0  r  • 

\*See  reference  \[13\]  at  the  end  of  this  section. 


9 


PROBLEMS  OF  SECURITY 


Let  us  consider  a  security  compromise  to  be  unauthorized  access 
to  information,  where  unauthorized  means  that  an  inappropriate  clear¬ 
ance  or  a  lack  of  need-to-know  is  involved  in  the  access  to  the 
information.  Then  a  central  problem  to  be  solved  within  the  comput¬ 
ing  system  is  how  to  guarantee  that  unauthorized  access  (by  a  process) 
to  information  (file,  program,  date)  does  not  occur. 

If  we  can  certify  that  unauthorized  access  cannot  occur  within 
the  system,  then  we  must  next  consider  the  secondary  effects  of  the 
method  by  which  security  has  been  achieved.  Principally  we  shall  have 
to  address  ourselves  to  the  general  question  of  the  viability  of  the 
resultant  system  in  terms  of  economic  and  technological  feasibility 
and  in  terms  of  usefulness  to  the  user. 

SUMMARY  AND  REFERENCES 

In  this  chapter  we  have  introduced  general  systems  theory  very 
briefly  and  have  shown  examples  or  its  application.  Together  with 
the  short  discussion  on  system  modeling,  the  general  systems  theory 
and  examples  should  provide  an  adequate  basis  for  reading  the  rest 
of  this  paper. 

The  reader  who  may  wish  to  investigate  systems  theory  for  himself 
is  referred  first  to  the  book  edited  by  Klir  \[9\] ,  which  can  profitably 
be  read  with  or  without  any  background  in  mathematics.  The  reader 
will  find  further  examples  of  systems  in  the  book  \[14\]  by  Mesarovic, 
Macko,  and  Takahara.  In  particular,  beginning  on  page  89  of  \[14\] 
the  reader  will  find  the  basic  mathematical  concept  of  a  system  which 
we  have  borrowed.  Ocher  books  which  should  be  of  interest  are  those 
by  Klir  \[8\],  Hammer  \[6\].  von  Bertalanffy  \[1\],  and  Zadeh  and  Polak  \[15\]. 


10 


r-..  iS -iTl mr  i -- 


In  the  section  entitled  SECURE  COMPUTES  SYSTEMS  we  defined  in 
broad  terms  what  we  mean  by  a  secure  computer  system.  Our  general 
action  of  a  secure  system  is  derived  in  large  measure  from  essentials 
of  a  secure  system  abstracted  from  the  Multics  system,  as  an  archetype 
of  multi-user  systems,  and  from  a  knowledge  of  security  problems. 

The  reader  can  find  numerous  articles  i->  the  literature  which  touch 
on  the  area  of  a  secure  computer  system;  ve  list  \[3,4,10,11,12\]  as 
representative  of  what  is  available.  As  we  pointed  out,  however, 
none  of  the  generally  available  literature  deals  specifically  with 
the  problem  we  address  in  this  paper. 

Finally,  we  have  indicated  in  this  chapter  what  we  consider  to  be 
the  general  problems  we  shall  encounter  in  investigating  secure  com¬ 
puter  systems. 


1.  von  Bertalanffy,  Ludwig.,  General  System  Theory,  George 

3raziller,  Inc.,  New  York,  1968. 

2.  Ford,  Lester  R. ,  Differential  Equations,  McGraw-Hill  Book 

Company,  New  York,  1955. 

3.  Graham,  G.  Scott,  and  Peter  J.  Denning,  "Protection  - 
Principles  and  practice  (sic),"  AFIPS  Conf.  Proc.  40 
Spring  Joint  Computer  Conference  1972,  pp.  417-429. 

Graham,  R.M.  "Protection  in  an  information  processing 
utility,"  Comm  ACM,  15  May  1968,  pp.  365-369. 


4. 


-;j.A  .'s'«c=v\*-\\r«;  '\*■\*"  '■\*\* 


5.  Grant,  E,  L.,  and  W.  G.  Iveson,  Principles  of  Engineering 

Economy.  The  Ronald  Press  Company,  New  York,  1970. 

6.  Hammer,  Preston  C.,  ed..  Advances  in  Mathematical  Systems 

Theory.  Pennsylvania  State  University  Press, 

University  Park,  Pennsylvania,  1969. 

7.  Hoffman,  L.  J,,  "Computers  ana  privacy:  a  survey,"  Computing 

Surveys,  1,  2  June.,  1969,  pp.  85-104. 

8.  Klir,  George  J.,  An  Approach  to  General  Systems  Theory. 

van  Nostrand  Reinhold  Company,  1969. 


9.  Klir,  George  J.,  ed..  Trends  in  General  Systems  Theory. 

Wiley-Interscience,  New  York,  1972. 

10.  Lamp son,  B.  W,.,  "Dynamic  protection  structures,"  AFIPS  Conf. 

Proc.  35,  Fall  Joint  Computer  Conference  1969,  pp.  27-38. 

11.  Lamp son,  B.  W.,  "On  reliable  and  expendable  operating  systems," 

Techniques  in  software  engineering,  NATO  Science  Committee 
Working  Material  Vol.  II,  September,  1969. 

12.  Laxqtson,  B.  W.,  "Protection,"  Proc.  Fifth  Annual  Princeton 

Conf.  on  Inf.  Sciences  and  Systems,  Dept,  of  E.  E., 
Princeton  University,  Princeton,  N.  J.,  March,  1971, 
pp.  437-443. 


SECTION  II 

FOUNDATIONS  OF  A  MATHEMATICAL  MODEL 

ELEMENTS  OF  THE  MODEL 

We  begin  by  identifying  elements  of  the  model  vhich  correspond 
to  parts  of  the  reel  system  to  be  modeled.  We  assume  the  real 
system  to  have  multiple  users  operating  concurrently  on  a  common 
data  base  wit'i  multi-level  classification  for  both  users  and  data 
and  need- to- know  categories  associated  with  fco fa  users  and  data. 
In  our  model  we  deal  with  subjects  (processes) ,  which  one  should 
consider  surrogates  for  the  users. 


We  show  the  elements  of  our  model  in  Table  II,  wherein  we 
identify  sets,  elements  of  the  sets,  and  an  interpretation  of  the 
elements  of  the  sets. 

Table  II 

Elements  of  the  Model 


Elements 


s 

{S.,S  ,  •  •  \*  ,S  } 

1  r  n 

0 

{0\\,0o,  •  •  •  ,0  } 
i  i  m 

c 

{crc2,  •  •  •  ,Cq} 

ci  >  C2  >  •  •  \*  >  Cq 

K 

•  •  •  •  v 

Semantics 


subjects;  processes,  programs  in  execution 


objects;  data,  files, programs,  subjects 


classifications ;  clearance  level  of 
a  subject,  classification  of  an 
object 


needs-to-knov  categories;  project 


numbers,  access  privileges 


Table  II  (Continued) 


Set 

Eleasants 

Semantics 

A 

{Ai,A2 \*  \*  \*  \*  ,Ap^ 

access  attributes;  read,  write,  copy. 

append,  owner,  control 

R 

{RrR2,  \*  ‘  ,  Ru) 

requests;  inputs,  commands,  requests 

for  access  to  objects  by  subjects 

D 

(DrD2,  •  •  \*  ,DvJ 

decisions;  outputs,  answers,  "yes", 
"no",  "error" 

T 

{1,2,  •  \*  \*  ,t,  \*  \*  \*} 

indices;  elements  of  the  time  set; 

identification  of  discrete 

moments;  an  element  t  is  an 

irdsx  to  request  and  decision 

sequences 

Pa 

all  subsets  of  a 

power  set  of  a 

0 

a 

all  fun-  .ions  front  the 

set  8  to  the  set  a 

— 

a  x  0 

Ka,b):  a  e  a,  b  e  0} 

Cartesian  product  of  the  sets  a 

and  6 

F 

0s  x  (P  x  ( PK)S  x  ( PK)° 

an  arbitrary  element  of 

F  is  written 

1  ”  (\*^»\*2\*\*3\*\*4^ 

classif ication/need-to-know  vectors ; 

f^:  subject-classification  function 
f2:  object-classification  function 
!  f^s  subject-need-to-know  function 

|  f^:  obj ect-need-to-know  function 

Table  II  (Concluded) 

Elements 

Semantics 

an  arbitrary  element  of 
X  is  written  x 


request  sequences 


decision  sequences 


an  arbitrary  element  of 
Y  is  written  y 


{M  ,M  ,  •  •  •  ,M  } 
nm2F 

an  element  M.  of  M 

N 

is  an  n  \*  m  matrix  with 
entries  from  PA;  the 
(i,j)-entry  of  shows 
S^'s  access  attributes 
relative  to  0. 


I  access  matrices 


P(S  x  0)  x  M  x  f 


states 


an  arbitrary  element  of 
Z  is  written  z;  c  z 
is  the  t-th  state  in  the 
state  sequence  z 


state  sequences 


\*\*iy^  »Vi»  >- ?■&,%\*&+&?£\*■$\*?\* 


\*  J£k«\*a  ^rfw^w-'-  \*\*  \* 


STATES  OF  THE  SYSTEM! 

We  have  defined  Che  s Cates  of  the  system  In  such  a  way  as  to 
embody  all  the  information  which  we  consider  pertinent  to  security 
cons iderations . 

A  state  v  e  V  is  a  3-tuple  (b,M,f)  where 


b  e  P(S\*0). 


M  e  M, 


£  e  F, 


indicating  which  subjects  have  access  to  which  objects 
in  the  state  v; 

indicating  the  entries  of  the  access  matrix  in  the 
state  v;  and 

indicating  the  clearance  level  of  all  subjects,  the 
classification  level  of  all  objects,  and  the 
needs-to-know  associated  with  all  subjects,  and 
objects  in  the  state  v. 


STATE-TRANSITION  RELATION 

Let  WCRxDxVxy.  The  system  L‘(R,D,W,Zq)  C  X  \*  Y  x  z 
is  defined  by 

(x,y,z)  e  £(R,D,W,Zq)  if  and  only  if  (x^y^z^t,.^)  s  V 
for  each  t  e  T,  where  Zq  is  a  specified  initial  state 
usually  of  the  form  ($,M,f),  where  <J>  denotes  the  empty 


W  has  been  defined  as  a  relation.  It  can  be  specialized  to  be 
5  function,  although  this  is  not  necessary  for  the  development  herein. 
When  considering  design  questions,  however,  W  will  be  a  function, 
specifying  next-state  and  next-output.  W  should  be  considered 


intuitively  as  embodying  the  rules  of  operation  by  which  the  system 
in  ar.y  given  state  determines  its  decision  for  a  given  request  and 
moves  into  a  next  state. 

SUMMARY  AND  REFERENCES 

In  this  section  ve  have  established  elements  of  a  mathematical 
model  of  a  system;  these  elements  were  chosen  to  represent  as  nearly 
as  possible  the  realities  of  the  problem  situation  and  to  enable  as 
easy  a  transition  as  possible  from  mathematical  model  to  design 
specifications. 

Tiie  states  of  the  system  have  been  defined  in  such  a  way  as  to 
incorporate  all  information  which  seems  pertinent  to  correct  operation 
of  a  secure  system  ("secure  system"  to  be  defined  precisely  in  the 
next  section). 

Finally,  we  have  included  in  the  model  a  state-transition  rela¬ 
tion  W  which  is  the  key  to  modeling:  given  W  one  may 
predict  the  behavior  of  the  system  for  a  given  set  of  initial 
conditions  and  a  given  request  sequence. 


18 


SECTION  III 


A  FUNDAMENTAL  RESULT 

COMPROMISE  AND  SECURITY 

We  define  a  compromise  state  as  fellows:  v  \*  (b,M,f)  e  V  is  a 
compromise  state  (compromise)  if  there  is  an  ordered  pair  (S,0)e  b 
such  that 

(i)  fx(S)  <  f2(0)  or 

(ii)  f3(S)  ;£  f4(0). 

In  other  words,  v  is  a  compromise  if  the  current  allocation  of 

objects  to  subjects  (b)  includes  an  assignment  ((S,0))  with  at 
least  one  of  two  undesirable  characteristics: 

(l(iii) (iv) v)  S's  clearance  is  lower  chan  0's  classification; 
(ii\*)  S  does  not  have  some  need-to-know  category  that 
is  assigned  to  0. 

In  order  to  make  later  discussions  and  arguments  a  little  more 
succinct,  we  shall  define  a  security  condition.  (S,0)  e  S  \*  0 
satisfies  the  security  condit4.  ~>n  relative  to  f  (SC  rel  f)  if 

(iii)  fx(S)  >  f2(0)  and 

(iv)  f3(S)  ?f4(0). 

A  state  v  \*  (b,M,f)  e  V  is  a  secure  state  if  each  (S,0)  e  b 
satisfies  SC  rel  f.  The  definitions  of  secure  states  and  compromise 
states  indicate  the  validity  of  the  following  improved  proposition. 


\*3 


Proposition:  v  e  V  is  not  a  secure  state  iff  v  is  a  compromise. 

A  state  sequence  z  e  Z  has  a  compromise  if  2^  is  a  compromise 
for  some  t  e  T.  2  is  a  secure  state  sequence  if  z is  a  secure 
state  for  each  t  e  T.  We  shall  call  (x,y,2)  e  I(R,D,W,zq)  an 
appearance  of  the  system.  (x,y,2)  e  Z(R,D,W,Z(;)  is  a  secure  appear¬ 
ance  if  z  is  a  secure  state  sequence.  The  appearance  (x,y,z‘) 
has  a  compromise  if  z  has  a  compromise. 

£(R,D,Wtz0)  is  a  secure  system  if  evv»y  appearance  of  I(R,D,W,zo) 
is  secure.  E(R,D,W,zo)  has  a  compromise  if  any  appearance  of 
£(R,D,W,zq)  has  a  compromise. 

Proposition :  2  e  Z  is  not  secure  iff  2  has  a  compromise. 

Proposition:  £(R,D,W,zo)  is  not  secure  iff  Z(R,D,W,z0)  has  a 
compromise. 


ASSUMPTIONS 

We  make  assumptions,  as  shown  in  Table  III,  which  reflect  a  subset 
of  requirements  (or  lack  of  requirements)  to  be  imposed  on  the  system. 
In  Section  XV  we  shall  change  some  of  these  assumptions  and  observe 
the  effect  on  the  system. 

Table  III 

Initial  Requirements 

!  REQUIREMENTS  I 


RAISE? 

LOWER? 

SUBJECT  CLEARANCE 

NO 

NO 

OBJECT  CLASSIFICATION 

NO 

NO 

INCREASE? 

DECREASE? 

SUBJECT  NEEDS-TO-XNOW 

NO 

NO 

OBJECT  NEEDS-TO-KNOW 

NO 

NC 

20 


Tab l\*  III,  in  effect,  says  that  "no"  is  the  answer  to  each  of 
the  questions 

f 

raise 

"Is  there  a  requirement  to  •  \*ower  ,  a 

Increase 

decrease, 

| subject's 
|  object's 

BASIC  SECURITY  THEOREM 

Basic  Security  Theorem:  Let  WCRxDxVxV  be  any  relation 
such  that  (R^,U^ , (b-,M\*,f\*) , (b,M,f)  £  W  implies 

(i)  f  \*  f\*  and 

(\*i)  every  (S,0)  e  b\*  -  b  satisfies  SC  rel  f\*. 

£(R,D,W,z  )  is  a  secure  system  for  any  secure  state  z  . 

Proof :  Let  zq  \*  (b,M,f)  be  secure.  Pick  (x,y,z)  e  z(R,D,W,z  ) 
and  write  zfc  -  (b^  ,M^  ,f  for  each  t  e  T. 

is  a  secure  state.  (x^,y^,z^,z  )  e  W.  Thus  by  (i),  f^  \*  f. 
By  (ii),  every  (S,0)  in  b^  -  b  satisfies  SC  rel  f^K  Since 
z  is  secure,  every  (S,0)  e  b  satisfies  SC  rel  f.  Since  f  \*  f^, 
every  <S,0)  e  b^  satisfies  SC  rel  f^.  That  is,  z ^  is  secure. 

If  z^\_^  is  secure,  z^  is  secure.  e  \*\*\* 


classification/clearance  ) 

! 

needs- to-know 


21 


Thu\*  by  (i),  f(t)  -  f(t\_1\\  By  (ii),  every  (S,0)  in  b(t\*  -  b(t-1) 
satisfies  SC  rel  f^ .  Since  .  is  secure,  every  (S,0)  e  b^  ^ 
satisfies  SC  rel  f^t”\*/.  Since  f^'  «  every  (S,0)  e  b^ 

satisfies  SC  rel  f^\\  That  is,  z£  is  secure.  By  induction,  z 
is  secure  so  that  {x.y ,z)  is  a  secure  appearance.  (x,y,z)  being 
arbitrary,  Z(R,D,W,zo)  is  secure. 

SUMMARY 

In  this  chapter  ve  have  applied  the  matemat-Lcal  model  of  Section  II 
to  the  modeling  of  a  secure  computer  system.  We  have  defined  a  secure 
system  precisely,  through  the  definitions  of  security  and  compromise, 
and  have  given  a  rule  of  operation,  W,  which  we  have  shown  guaran¬ 
tees  that  the  system  is  secure  in  its  operation. 


22 


SECTION  IV 
CONCLUSION 


INTRODUCTION 

We  attempted  to  provide  In  Section  I  a  motivation  and  basis  for 
the  remainder  of  this  paper.  We  pointed  out  three  desirable  properties 
of  a  model  —  generality,  predictive  ability,  and  appropriateness  — 
and  these  were  illustrated  by  example.  Also,  ve  discussed  the  general 
principle  that  the  specificity  of  prediction  is  roughly  proportional 
to  the  amount  and  level  of  detail  of  information  available  about  the 
system  being  modeled;  this  was  illustrated  by  the  discussion  of  the 
spring-mass  system. 

Subsequently,  v;e  developed  a  mathematical  model  of  general 
applicability  to  the  study  of  secure  computer  systems,  abstracting 
the  elements  of  the  model  from  our  own  and  others’  notions  of  what 
the  real  system  may  be  like. 

We  then  applied  the  model,  under  a  given  set  of  assumptions ,  to 
the  question  of  security  (compromise).  We  gave  a  rule  by  which,  for 
the  assumptions  given,  the  system  would  remain  secure  in  its  operation; 
we  also  gave  a  proof  of  the  last  assertion. 

Notice  this  important  point:  our  proof  did  not  depend  on  the 
choice  of  elements  for  the  set  A  (access  attributes).  This  means 
that  any  set  is  acceptable  and  any  access  matrix  is  acceptable. 

Stated  differently,  we  have  shown  that  under  the  given  assumptions 
security  of  the  system  is  independent  of  the  access  matrix  and  the 
rules  (if  any)  by  which  the  access  matrix  is  changed. 


23 


"“\*  '  -  —  w^\_^s\*\*«e^\_.  ’> 


Thus,  we  have  modeled  the  system  in  such  generality  that  ve  are 
not  in  a  position  to  investigate  its  viability.  For,  clearly,  one 
may  arbitrarily  choose  rules  of  access  matrix  control  while  retaining 
the  property  cf  security.  Therefore,  one  may  choose  the  rules  in 
such  a  way  as  to  prevent  users  from  ever  acquiring  access  to  infor- 
nation;  the  severe  danger  is  that  a  set  of  rules  might  he  chosen  which 
has  an  intuitive  sense  of  correctness  but  which  may  lead  the  system 
into  undesirable  states. 

t.'e  shall  address  ourselves  in  this  section  to  some  of  the  specific 
questions  to  be  considered  if  a  viable  system  is  to  be  c eveloped  from 
our  model. 

PROBLEM  REFORMULATION 

One  may  change  the  system  problem  to  be  attacked  in  a  variety  of 
ways.  In  general  one  states  a  set  of  requirements  and  a  set  of 
criteria  to  be  met.  The  requirements  and  criteria  may  be  very  general 
or  ver.  specific:  the  more  specific  these  are,  the  more  specific  can 
be  the  behavior  predicted  by  modeling  and  the  greater  the  probability 
that  a  viable  system  will  result  from  the  design  into  which  the  model 
is  transformed. 

In  our  situation  we  can  immediately  recognize  two  areas  of  pro- 
blem  reformulation.  First,  one  may  change  the  requirements  of  the 
type  we  assumed  in  Section  III.  We  shall,  in  fact,  do  so  anti  derive 
a  result  from  the  changed  assumptions.  Second,  one  may  impose 
criteria  to  be  met  by  the  access  control  mechanisms  of  the  system. 

We  shall  Investigate  this  briefly  in  the  next  two  sections. 


24 


■rr  iv  dd ^  •  -  • 


We  change  the  assumptions  we  made  in  Section  III,  as  shown  in 


Table  IV. 


Table  IV 

Modified  Requirements 


REQUIREMENTS 

RAISE? 

LOWER? 

SUBJECT  CLEARANCE 

YES 

NO 

OBJECT  CLASSIFICATION 

NO 

YES 

INCREASE? 

DECREASE? 

SUBJECT  NEEDS-TO-KNOW 

YES 

NO 

OBJECT  NEEDS-TO-KNOW 

NO 

YES 

Basic  Security  Theorem  (revised) : 

Let  WQrxDxVxV  be  any  relation  such  that 

(Ri»D^»(b\*»M\*,f\*),(b,M,f)>  e  W  implies 

(i)  f\*^(S)  >  f^(S)  for  each  S  e  S, 

^\*2^°)  5  f 2 ^  f°r  each  0  e 

f  ^(S)  -  for  each  S  e  S, 

f  ^(O)  C  f^(0)  for  each  0  e  0,  and 
(ii)  every  (S,0)  e  b  -  b  satisfies  SC  rel  f\*. 

Thee  E(R,D,W,z0)  is  a  secure  system  for  any  secure  state  zq. 
Proof:  Let  zq  =\*  (b,M,f)  be  secure. 

Tick  (x,y,z)  e  E(R,D,W,z  )  and  write  z£  «  (b^,M^ 
for  eact  t  e  T. 


is  a  secure  state,  (x, ,y, ,z. ,z0)  e  W. 


mm  ii  mi  n  ii'-t-  - - T" . 


By  (ii),  every  (S,Q)  in  b^^  “  b  satisfies 
SC  rel  Since  z  is  secure,  every  (S,0)  in  b 

satisfies  SC  rel  f;  that  is,  f^S)  >  f2(0)  and 
f3(S)  5f^(0)  .  By  (i),  we  have,  for  each 
(S,0)  in  b(1)  -  (b(1)  -  b), 
f<l}  (S)  >fx(S)  >f2(0)  >f(»(0)  and 
f(^(S)  D  f3(S)  D  f4(0)  D  f4(0),  so  that 
each  (S,0)  in  b^  satisfies  SC  rel  f^\\ 

That  is,  Zj,  is  secure. 

If  z.  .  is  secure,  then  z.  is  secure. 

- 1-1 - -  T.l - t - 

(xt.yt»2t»\*t^l>G  W\*  By  (ii),  every  (S,0)  in 

b^  -  b^  ^  satisfies  ^.C  rel  f^.  Since 

zfc\_3  is  secure,  every  (S,0)  in  b^C  ^ 

satisfies  SC  rel  f^fc  that  is, 

f^^S)  ^  ^“^(O)  and  ^“^(S)  2  f^1J<0) 

By  (i),  we  have  for  each  (S,0)  in  b^  -  (b^  ~  b^C  \*^), 

f^S)  >  f(t"X)(S)  l  f^^O)  £  f(^(0)  and 

f(5J(S)  Df^^S)  2  f  (t’41)  (0)  2  (0),  so  that 

each  (S,0)  in  satisfies  SC  rel  f^.  That 

is,  z„  is  secure, 
t 

By  induction,  z  is  secure  sc-  that  (x,y,z) 
is  a  secure  appearance.  (x,y,z)  being  arbitrary, 
£(R,D,W,zo)  is  secure. 


26 


The  revised  theorem  just  proved  indicates  that  dynamic 

(i)  raising  of  subject  clearance; 

(ii)  lowering  of  object  classification; 

(iii)  increasing  of  subject  n.;eds-to-know;  and 

(iv)  decreasing  of  object  ne  ?id8-to~know 

can  be  provided  in  the  system  witnout  security  compromise.  Again,, 
however,  the  proof  is  independent  of  what  is  happening  in  the  access 
matrix,  the  subject  of  the  next  section. 

We  note  here  that  our  investigations  into  the  security  of  a  system 
in  the  cases  that  a  subject's  clearance  may  be  lowered  dynamically, 
an  object's  classification  may  be  increased  dynamically,  and  similar 
changes  in  needs-to-know  are  as  yet  undocumented.  Those  investigations 
lead  us  to  believe  that  severe  questions  of  the  viability  of  the 
resulting  system  are  raised  by  the  options  listed  above. 

ACCESS  CONTROL 

In  a  real  sense,  the  relation  W  we  have  specified  provides  a 
rule  of  access  control  which  governs  security  as  we  have  defined  it. 

We  have  also  provided  in  the  model  for  access  control  to  govern 
protection,  privilege,  and  mode  of  use  through  the  access  matrix  we 
have  defined. 

Two  problems  are  immediately  evident.  First,  unless  the  system 
guarantees  the  inviolability  of  rule  W  our  security  theorem  does 
net  apply.  Second,  unless  ws  deal  with  soma  specific  criteria  and 
rules  relating  to  the  access  matrix,  we  can  say  little  if  anything 
concerning  viability  of  the  system;  again,  if  access  matrix  controls 
are  provided,  the  system  must  be  structured  so  as  to  guarantee  their 
inviolability  else  our  modeling  will  not  apply. 


27 


-r  -  ~  aaa  - » 


Let  us  consider  a  situation  in  which  the  Interaction  of 
security  control  and  access  control  can  cause  a  compromise.  Specif¬ 
ically,  if  a  subject  S^.  is  allowed  "append"  access  to  an  object 
0^,  a  file  or  segment,  then  guaranteeing  inviolability  of 
rule  W  means  the  system  must  prevent  from  appending  information 

of  a  classification  higher  than  that  of  0^:  otherwise  we  risk  having 
(Si,0k)  in  b,  where  has  "read"  access  to  0^,  while 

fj(S^)  <  resulting  in  compromise.  This  example  shows  that 

inadequate  access  controls  (over  the  ‘‘append"  access  of  to  0^) 

can  cause  a  violation  of  W  (by  raising  ^^k^'  contrary  to  our 
assumption  up  to  this  point) ,  resulting  in  a  compromise  state. 

DATA  BASE  SHARING 

We  have  assumed  a  shared  data  base  for  the  multi-user  system  but 
have  stated  no  requirements  nor  criteria  for  "correct"  sharing. 

The  concluding  remark  of  the  preceding  section  suggests  that  we 
must  do  so.  At  least,  we  must  specifically  prevent  the  situation 
we  discussed;  alternatively,  one  might  choose  to  change  our  definition 
of  compromise.  Unfortunately,  a  change  in  the  definition  of  compromise 
in  this  situation  would  be  in  the  direction  of  weakening  rule  W  with 
the  result  that  the  model  will  reflect  the  real  problem  less  accurately 
than  we  have  succeeded  in  doing  thus  far. 

In  addition,  one  may  impose  additional  criteria  relating  to 
sharing  of  the  data  base,  such  as  prevention  of  deadlock,  preserva¬ 
tion  of  integrity  of  the  information,  and  prevention  of  permanent 
blocking — such  criteria  have  to  do  with  reliability  of  the  system 
and  therefore  relate  to  its  usefulness. 


28 


\\ 


SUMMARY  AND  REFERENCES 

In  this  chapter  we  have  discussed  the  generalities  of  changing 
the  definition  of  the  problem  to  be  solved.  We  showed  an  example 
by  stating  and  proving  the  security  theorem  for  a  new  set  of  assump- 
tions  relating  to  changes  in  classifications  and  needs- to-know. 

We  pointed  out  briefly  that  the  system  which  one  might  develop 
from  our  model  would  have  to  guarantee  inviolability  of  the  rule  of 
operation  W.  Techniques  have  been  documented  which  use  hardware, 
software,  or  combinations  of  these  for  protection  of  privileged 
algorithms;  references  \[1,2,3,4,5,6,8,9,10\]  are  relevant. 

We  discussed  briefly  the  question  of  a  shared  data  base.  For  a 
discussion  of  problems  and  a  solution  see  \[7\]. 

In  summary,  we  have  attempted  to  show  in  this  section  that  the 
model  can  be  used  to  answer  questions  posed  with  a  given  set  of 
requirements  and  criteria  and  to  indicate  that  a  central  problem  in 
the  design  of  a  secure  system  will  be  to  certify  that  the  access 
controls  are  inviolable. 

1.  Conway,  R. ,  W.  Maxwell,  and  H.  Morgan,  "Selective  security 

capabilities  in  ASAP  — A  file  management  system,"  AFIPS 

Conf.  Proc.  40,  SJCC  1972. 

2.  Emerson,  K. ,  "An  Approach  to  Handling  Multi-7-evel  Data 

Element  Security  Within  a  File,"  Proceedings  Invitational 

Workshop  on  Networks  of  Computers,  AD  860  776,  October  1968. 

3.  Graham,  R.  M. ,  "Protection  in  an  information  processing 

utility,"  Comm  ACM.  15  May  1963,  pp.  365-369. 

29 


4.  Hoffman,  L.  J.,  “The  Formuiary  Model  for  Access  Control  and 

Privacy  in  Computer  Systems,"  Stanford  University, 
S1AC-117,  UC-32,  May  1970. 

5.  Iuorno,  R.  F.,  et  al.,  RADC/MULTICS  Evaluation, 

RADC-TR-7 1-121,  November  1971. 

6.  Lampson,  B.  W. ,  "Dynamic  protection  structures,"  AFIPS 

Conf.  Proc.  35,  F.TCC  1969,  pp.  27-38. 

7.  La  Padula,  L.  J.,  and  D.  Elliott  Bell,  "Harmonious  Cooperation 

of  Processes  Operating  on  a  Common  Set  of  Data,"  Volumes 
1,  2,  and  3,  ESD-IR-72-147,  1972. 

8.  Liskov,  B.  H.,  "The  Design  of  the  Venus  Multiprogramming 

System,"  Conm  ACM,  15,  3,  March  1972,  pp.  144-149. 

9.  Schroeder,  M.  D.,  and  Jerome  H.  Saltzer,  "A  Hardware 

Architecture  for  Implementing  Protection  Rings," 

Comm  ACM.  15,  3,  March  1972. 

10.  Weissman,  C,  "Security  Controls  in  the  ADEPT-50  Time-sharing 

System,"  AFIPS  Conf.  Proc.  35,  FJCC,  1969,  pp.  119-133. 


30 


-^•z  ^»y>i  ^ 


BIBLIOGRAPHY 

1.  von  Bertalanffy,  Ludwig,  General  System  Theory,  George 

Braziller,  Inc.,  New  YorK,  1568. 

2.  Browne,  P.  S.t  and  D.  D.  Stemauer,  "A  Model  for  Access 

Control, ”  Proc.  of  1971  ACM-SIGFIDET  Workshop,  Data 
Description,  Access  and  Control.  1971. 

3.  Conway,  R. ,  W.  Maxwell,  and  H.  Morgan,  "Selective  security 

capabilities  in  ASAP — A  file  management  system," 

AFIPS  Conf.  Proc.  40,  SJCC  1972. 

4.  Emerson,  H. ,  "An  Approach  to  Handling  Multi-Level  Data 

Element  Security  Within  a  File,"  Proc.  Invitational 
Workshop  on  Networks  of  Computers,  Ad  860  776, 

October,  1968. 

5.  Friedman,  T.D.,  "The  authorization  problem  in  shared  files," 

IBM  Sys.  J.,  No.  4,  1970,  pp.  258-280. 

6.  Graha\_,  G.  Scott,  and  Peter  J.  Denning,  "Protection-Principles 

and  practice  (sic),"  AFIPS  Conf.  Proc.  40,  SJCC  1^72, 
pp.  417-429. 


7.  Graham,  R.M.  "Protection  in  an  information  processing 
utility,"  Comm  ACM,  15  May,  1968,  pp.  365-369. 


31 


BIBLIOGRAPHY  (Continued) 


8.  Hammer,  Preston  C.,  dd.,  Advances  in  Mathematical  Systems 
Theory,  Pennsylvania  State  University  Press, 

University  Park,  Pennsylvania,  1969. 

9.  Hoffman,  L,  J.,  ''Computers  and  privacy:  a  survey,"  Computing 

Surveys,  1,  2,  June,  1969,  pp.  85-104. 

10.  Hoffman,  L.  J.,  "The  Formulary  Model  for  Access  Control  and 

Privacy  in  Computer  System,"  Stanford  University,  SLAC-117, 
UC-32,  May  1970. 

11.  Iuorno,  R.  F.,  et.  al.,  RADC/MULTICS  Evaluation,  RADC-TR-7 1-121, 

November,  1971. 

12.  Klir,  George  J,,  An  Approach  to  General  Systems  Theory,  Van 

Nootrand  Reinhold  Company,  1969. 

13.  Klir,  George  J.,  ed..  Trends  in  General  Systems  Theory, 

Wiley-Interscience,  New  York,  1972. 


14.  Lampson,  B.  W. ,  "Dynamic  protection  structures,"  AFIPS  Conf. 
Proc.  35,  FJCC  1969,  pp.  27-.'8. 


15.  Lampson,  B.  W.,  "On  reliable  and  extendable  operating  systems," 
Techniques  in  software  engineering,  NATO  Science 
Committee  Working  Material  Vcl.  II,  September,  1969. 


32 


BIBLIOGRAPHY  (Concluded) 


16.  Lampson,  B.  K.,  "Protection,"  Proc.  Fifth  Annual  Princeton 

Conf.  on  Inf.  Sciences  and  Systems,  Dept,  of  E.  E., 
Princeton  University,  Princeton,  N.  J.,  March,  1971, 
pp.  437-463,. 

17.  La  Padula,  L.  J.,  and  D.  Elliott  Bell,  "Harmonious  Cooperation 

of  Processes  Operating  on  a  Common  Set  of  Data,"  Volumes 
1,  2,  and  3,  ESD-TR-72-147,  1972. 

18.  Liskov,  B.  H.,  "The  Design  of  the  Venus  Multiprogramming 

System,"  Comm  ACM.  15,  3,  March,  1972,  pp.  144-149. 

19.  Mesarovi<f,  M.  D.,  D.  Macko;  and  Y.  Takahara,  Theory  of 

Hierarchical.  Multilevel.  Systems.  Academic  Press, 

New  York,  1970. 

20.  Schroeder,  M.  D. ,  and  Jerome  H.  Saltzer,  "A  Hardware 

Architecture  for  Itqjlementing  Protection  Rings," 

Comm  ACM,  15,  3,  March,  1972. 

21.  Weissman,  C.,  "Security  Controls  in  the  ADEPT-50 

Time-Sharing  System,"  AFIPS  Conf.  Proc.  35,  FJCC  1969, 
pp.  119-133, 

22.  Zadeh,  L.  A.,  and  E.  Polak,  System  Theory,  McGraw-Hill  Book 

Company,  New  York,  1969. 


33
