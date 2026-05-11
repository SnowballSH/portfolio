#metadata(
  (
    title: "AtCoder Beginner Contest 457",
    description: "A very cute, balanced, and educational problem set.",
    date: "2026-05-11",
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

Note: this blog is still Work-In-Progress (WIP).

= Introduction

The #link("https://atcoder.jp/contests/abc457")[Polaris.AI Programming Contest 2026 (AtCoder Beginner Contest 457)] concluded this past Saturday. After taking a virtual contest, I find the problems very cute and interesting. For problems A, B, C, D, and E, I was comfortable with the ideas and solved the problems fairly quickly. Problems F and G were harder but contains some nice ideas. Here I will share some of my thought processes.

= A. Array

*Problem.* Given an array $A$ of length $N$ and integer $X$, find $A_X$.

*Analysis.* Ask a toddler on the street.

= B. Arrays

*Problem.* Given an array $A$ consisting of $N$ arrays and two integers $X$ and $Y$, output $A_(X, Y)$.

*Analysis.* Ask a Chinese kindergarten student.

= C. Long Sequence

*Problem.* You are given an array $A$ consisting of $N$ arrays, an integer array $C$ of length $N$, and an integer $K$. If $B$ is the array constructed by joining $C_i$ copies of $A_i$ for each $i=1,2,...,N$ in this order, find $B_K$.

*Constraints.* $sum_(i=1)^N |A_i| <= 2 times 10^5$, $1 <= A_(i,j) <= 10^9$, $1 <= C_i <= 10^9$.

*Analysis.* Simulating can take over $10^(14)$ steps, which is not feasible. However, we only need to find a single element, so we can use modular arithmetics to skip over almost all of the copies. Let us first find out which array contains the answer; then, we can figure out where in that array the answer lies using the remainder. For some $m$, define $ R_m = (K - 1) - sum_(i=1)^m (|A_i|C_i) $ as the number of elements remaining after skipping over $A_1, ..., A_m$. There must exist a unique $m$ such that $ R_m < |A_(m+1)|C_(m+1), $ so the answer will be an element of $A_(m+1)$. To find which one it is, we can take $i = R_m mod thick |A_(m+1)|$, and $A_(m+1, i)$ is our answer.

= D. Raise Minimum

*Problem.* You are given an array $A$ of length $N$ and an integer $K$. In one operation, you can choose some $1 <= i <= N$ and set $A_i := A_i + i$. After at most $K$ operations, what is the maximum possible value of $min_(1 <= i <= N) A_i$?

*Constraints.* $1 <= N <= 2 times 10^5$, $1 <= A_i <= 10^(18)$, $1 <= K <= 10^(18)$.

*Analysis.* This problem immediately reminded me of #link("https://usaco.guide/silver/binary-search")[the example problem about maximum median] from the binary search section on USACO Guide. The core idea in that problem was to binary search on the answer, and then count how many operations we need. The same technique applies to this problem. Suppose we fix some $L$. Then, for each $i$, we need $ C_i = max{0, ceil((L - A_i)/i)} $ operations to raise $A_i$ to at least $L$ (which should hold for all $i$). Therefore, the minimum number of operations needed is $sum_(i=1)^N C_i$, and the answer is at least $L$ if and only if this sum is at most $K$.

Increasing the minimum can only require more operations, so this subproblem is monotonic in $L$. Hence, we binary search on $L in [0, #text("Long.MAX_VALUE")]$ to find the answer.

My code:

#align(center)[
  ```kotlin
  val n = nextInt()
  val k = nextLong()
  val a = LongArray(n) { nextLong() }
  var lo = 0L
  var hi = Long.MAX_VALUE - 2  // big enough
  while (lo < hi) {
      // thanks 15-122
      val mid = lo + (hi - lo + 1) / 2
      var cost = 0L
      for (i in 0 until n) {
          val diff = mid - a[i]
          if (diff <= 0) continue
          cost += (diff + i) / (i + 1)
          if (cost > k) break
      }
      if (cost > k) hi = mid - 1
      else lo = mid
  }
  println(lo)
  ```
]

= E. Crossing Table Cloth

*Problem.* You are given $M$ segments on the cells $1,2,...,N$. For each of the $Q$ queries, given integers $S <= T$, determine whether or not there exist *exactly two* segments such that there union is exactly $[S, T]$.

*Constraints.* $1 <= N <= 2 times 10^5$, $2 <= M <= 2 times 10^5$, $1 <= Q <= 2 times 10^5$.

*Analysis.* I immediately noticed that for the answer to be "Yes," one of the two segments must have an endpoint at $S$ and extends rightwards, and one of the two segments must have an endpoint at $T$ and extends leftwards. To maximize the coverage greedily, we should make the former extend as much to the right as possible and make the latter extend as much to the left as possible. This motivates us to maintain a list of segments for each start index and each end index. Then, by sorting each of the lists, we can use binary search to efficiently compute the rightmost-extending segment that starts at $S$ and ends before $T$, and the leftmost-extending segment that starts after $S$ and ends at $T$.

There is one edge case where the two aforementioned greedily chosen segments are the same one. In that case, it must be that the segment is already exactly $[S, T]$. Hence, it suffices to check if there exists another segment lying completely inside $[S, T]$. This is the same as checking whether there are at least two different segments in $[S, T]$.

I recalled that this subproblem can be solved using a Fenwick Tree: sort the queries by descending order in $S$, and maintain a Fenwick Tree on the values of $T$.

This problem overall feels very, very natural, as the steps come out one at a time very logically, and the problem reduces to solving a few well-known subproblems one by one using standard techniques, while still having a fun and quick observation.

My code:

#align(center)[
  ```kotlin
  val n = nextInt()
  val m = nextInt()
  val start = Array(n + 1) { mutableListOf<Pair<Int, Int>>() }
  val end = Array(n + 1) { mutableListOf<Pair<Int, Int>>() }
  val intervals = Array(m) {
      val l = nextInt()
      val r = nextInt()
      start[l].add(Pair(r, it))
      end[r].add(Pair(l, it))
      Pair(l, r)
  }
  // Sort the start and end arrays
  for (i in 1..n) {
      start[i].sortWith { x, y ->
          if (x.first == y.first) x.second.compareTo(y.second)
          else x.first.compareTo(y.first)
      }
      end[i].sortWith { x, y ->
          if (x.first == y.first) x.second.compareTo(y.second)
          else x.first.compareTo(y.first)
      }
  }
  val fw = FenwickTree(n + 1)
  val q = nextInt()
  // Sort the queries by descending order in S
  val queries = Array(q) { Triple(nextInt(), nextInt(), it) }
               .sortedByDescending { it.first }
  intervals.sortByDescending { it.first }
  // Maintain a pointer to update the Fenwick Tree using the two-pointer technique
  var pt = 0
  val ans = BooleanArray(q)
  for (query in queries) {
      val (s, t, j) = query
      // Add the remaining segments that start after S
      while (pt < m && intervals[pt].first >= s)
          fw.update(intervals[pt++].second, 1)

      var a = start[s].binarySearch { if (it.first > t) 1 else -1 }
      if (a < 0) a = -a - 1
      a--
      var b = end[t].binarySearch { if (it.first >= s) 1 else -1 }
      if (b < 0) b = -b - 1

      if (a < 0 || b >= end[t].size)
          ans[j] = false
      else if (start[s][a].second == end[t][b].second)
          ans[j] = fw.query(t + 1) >= 2L
      else
          ans[j] = start[s][a].first + 1 >= end[t][b].first
  }
  for (j in 0 until q)
      println(if (ans[j]) "Yes" else "No")
  ```
]

= F. Second Gap

*Problem.* Given an integer array $D$ of length $N-1$, count the number of permutations $P$ of $1$ through $N$ such that for each $1 <= i <= N-1$, if $P_a$ and $P_b$ are the largest and second-largest values among $P_i, ..., P_N$, then $|a-b| = D_i$.

*Constraints.* $2 <= N <= 2 times 10^5$, $1 <= D_i <= N - i$.

*Analysis.* This is a DP problem with optimizations. Coming Soon.

= G. Catch All Apples

*Problem.* $N$ apples fall on a number line. Apple $i$ reaches coordinate $X_i$ at time $T_i$ and must be collected exactly at time $T_i$. Find the minimum number of robots you need to place so that if the robots have a speed of at most $1$ at each moment, there is a way for the robots to collect all $N$ apples.

*Constraints.* $1 <= N <= 3 times 10^5$, $T_i <= 3 times 10^5$, $X_i <= 3 times 10^5$.

*Analysis.* This is the most fun problem in this set with multiple clever observations. The problem statement is also very natural and "realistic." Coming Soon.
