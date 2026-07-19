#metadata(
  (
    title: "AtCoder Regular Contest 224",
    description: "First time AKing an ARC.",
    date: "2026-07-12",
    tags: ("competitive programming", "atcoder"),
    // hidden: true,
  ),
)<frontmatter>

#set page(height: auto, margin: 0.7em)
#set par(first-line-indent: (amount: 1em, all: true))
#show link: set text(fill: rgb("#3eff54"))
#show link: underline

#set quote(block: true)
#show quote: set align(center)
#show heading: set block(below: 1em)

#show raw.where(block: true): it => block(
  fill: rgb("#282c34"),
  inset: 16pt,
  radius: 4pt,
  it,
)

= Introduction

I participated in the #link("https://atcoder.jp/contests/arc224")[AtCoder Regular Contest-- 224] this past Sunday. This was my first full-solving an ARC live, and I felt the problems were very educational.

= A. Attach 00

*Problem.* Given a positive integer $K$ ($1 <= K <= 10^9$), find the smallest positive integer $n$ such that $n$ is a multiple of $K$, and the base-ten representation of $n$ contains the substring `00`.

*Analysis.* At first glance, there doesn't seem any clear path towards computing the answer. I thought that instead of trying to guess constructions, I should try to prove some results.

First, I need to show that such an $n$ even exists. In fact, $100K$ always ends in `00`, so such an $n$ exists, and the upperbound is $100K$.

Now I see that there are only $100$ candidates to test: $K, 2K, 3K, ..., 100K$, so each test case can be solved in at most $log_10(K) + log_10(2K) + ... + log_10(100K) = log_10(100!) + 100 log_10(K) <= 200 + 900 = 1100$ operations, so the brute-force algorithm is fast enough even over $T=10^5$ testcases.

Note that if we keep track of the current length of the base-ten representation, we can avoiding the log factor for every integer and achieve a solution with about $110$ operations per testcase, but this is not necessary for this problem.

= B. Adjacent Tiles

*Problem.* Place $N$ ($1 <= N <= 10^18$) unit squares on a plane so that they do not overlap. What is the maximum possible number of pairs of different tiles that share one full side?

*Analysis.* Since $N$ can be up to $10^18$, the solution is likely a simple math formula.

Indeed, with some greedy guessing and contradiction logic, it is possible to prove with #link("https://atcoder.jp/contests/arc224/editorial/22643")[a lemma] that the answer is $ 2N - sqrt(2N). $

= C. Ascending Labels

*Problem.* Given a connected simple undirected graph with $N$ vertices and $M$ edges ($1 <= N <= 3 times 10^5$, $N-1 <= M <= 3 times 10^5$). Assign an integer $A_v$ ($0 <= A_i <= N$) to every vertex $v$ such that $A_1 = 0$ and for all vertices $v != 1$, there is exactly one vertex $w$ adjacent to $v$ satisfying $A_w = A_v - 1$.

*Analysis.* We first think about the following question: "what kind of structure has the required property?" By thinking about this question, we recall that a tree has the property that each vertex besides the root has exactly one parent, and if we can assign $A_v$ to the depth of some tree describing the edges, we are done.

What is a tree we can make from a graph? A DFS tree! It is not hard to show that a DFS tree satisfies the given properties. Therefore, for each vertex $v$, we output the depth of $v$ in the DFS tree rooted at $0$ for the given graph. The time complexity is $O(N + M)$.

= D. Angst for All Pairs

*Problem.* There are $N$ ($1 <= N <= 10^6$) cards, numbered $1$ through $N$. Initially nothing is written on any of the cards. Writing a number $k$ on a card incurs a cost equal to the number of digits in the decimal representation of $k$. Find the minimum cost required to make sure that for every integer pair $(x, y)$ with $1 <= x < y <= K$ ($2 <= K <= 10^6$), there exists a card containing exactly one of $x$ and $y$. If this is impossible, output $-1$.

*Analysis.* In my opinion, this problem is quite difficult to solve purely by staring at it and trying to prove a magical answer. It is more intuitive to play around with some examples.

After playing around with various examples for a while, I discovered that we can skip one of the numbers. Then, we should put one number on each card first. If there are more, put a number on two cards such that this pair has not been selected for a "two-card" level. Then do the same for three, four, ... until we have no numbers left. The game is impossible if we still have numbers left after exhausting the level of "write to every card."

For level $m=0,1,2,...,N$, there are $binom(N, m)$ spots to put a number. Therefore, we can put at most $ sum_(m=0)^N binom(N, m) = 2^N $ numbers in total. The answer is $-1$ if and only if $K > 2^N$.

Now suppose $K <= 2^N$. We will execute the greedy algorithm described above for $x=K,K-1,...,1$ (place the larger numbers first).

The time complexity for this simulation is in $O(K log K + (log k)^2)$, but it is a bit hard to show.

= E. ABC|AB|A

*Problem.* Given a string $S$ ($1 <= |S| <= 10^6$) consisting of `A`, `B`, and `C`, you can perform the following oepration zero or more times: "Choose a substring of $S$ that is either `A`, `AB`, or `ABC`, and delete it." Find the minimum possible length of $S$ in the end.

*Analysis.* I was surprised that I solved this problem in five minutes. The problem reminded me of ideas in DFAs (Deterministic Finite Automations).

The idea is to keep track of "how close we are to being able to delete a substring." We can do this by defining a DFA with states being the suffixes of the deletable substrings.

We will process the characters of $S$ in reverse order. We will define a DFA with the following states: $q_0, q_#text[B], q_#text[C], q_#text[BC]$, representing the current suffix we see. The transitions are straightforward: $(q_0, #text[C]) -> q_#text[C]$, $(q_#text[C], #text[B]) -> q_#text[BC]$, $(q_0, #text[B]) -> q_#text[B]$. Let `ans` be $|S|$ initially. Whenever we reach one of the deletable substring, we move back to $q_0$ and add subtract the length from `ans`, and whenever we reach a string that can never be extended leftwards to match a deletable substring (i.e. not part of the transitions), we go back to $q_0$. We can show this greedy algorithm is correct by induction on the suffix of $S$. The time complexity is $O(|S|)$.

= F. AND/OR

*Problem.* See #link("https://atcoder.jp/contests/arc224/tasks/arc224_f")[official statement].

*Analysis.* This problem has some nice ideas about the prefix sums of binomial coefficients.

This will take a while to explain, sorry. See #link("https://atcoder.jp/contests/arc224/editorial/22648")[official editorial] for their solution, which was the same as mine.
