#metadata(
  (
    title: "IMO 2026",
    description: "My attempts at some problems from the 67th International Mathematical Olympiad.",
    date: "2026-07-18",
    tags: ("math",),
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

As part of my journey to catch up with proof-based contest experience I missed during high school, I am attempting some problems from the 67th International Mathematical Olympiad (IMO). Unfortunately, life has not been permitting me to sit down for 4.5 hours a day to do math problems, so I've just been solving problems one by one casually. Here, I will document some of my thought processes and solutions to some of the problems from the IMO this year.

= Confucius and His Number Theory Game

*Question 1.* There are $2026$ integers greater than 1 written on a blackboard, not necessarily different. In a move, Confucius chooses two integers $m > 1$ and $n > 1$ from different places on the blackboard and replaces these two integers with $ gcd(m, n) #text[ and ] lcm(m, n)/gcd(m, n). $
He continues to make moves while it is possible to do so.

(a) Prove that, regardless of the choices of Confucius, after finitely many moves, exactly one integer $M$ on the blackboard is greater than 1.

(b) Prove that the value of $M$ does not depend on the choices of Confucius.

*My thought process for part (a).* These types of problem usually contain a creative invariant (i.e. a property that never changes throughout the course of the game).

The first idea that came to mind was considering the product of the numbers. The two new numbers' product is $lcm(m, n)$, which is at most $m n$, and equality is reached if and only if $gcd(m, n)=1$, so this might be useful.

Since the product is always positive and nonincreasing, to solve part (a), we only need need to show that Confucius can pick two coprime numbers a finite number of times. Let's see what happens when Confucius chooses two coprime numbers. Suppose $gcd(m, n)=1$. Then Confucius replaces them by $1$ and $m n$. Ah, the number of integers greater than 1 decreases by 1! Since there are only 2026 integers at the start, Confucius can only do this at most 2025 times before ending up with one integer.

Now we have all the tools to solve the problem.

*My thought process for part (b).* To solve (b), we just need to find another invariant on the game.

Trying out about ten examples on scratch paper, I made a few small observations. For example, any prime factor must stay, and $M$ must be between $gcd(a_1, ..., a_2026)$ and $lcm(a_1, ..., a_2026)$.

One significant observation I made was that it suffices to consider the numbers by the exponents of each prime factor. Let $p$ be a prime. Notice that $nu_p (gcd(m, n)) = min(nu_p (m), nu_p (n))$ and $nu_p (lcm(m, n)/gcd(m, n)) = max(nu_p (m), nu_p (n)) - min(nu_p (m), nu_p (n))$. This looks quite complicated. Let's replace the common parts with some variables. WLOG suppose $a=nu_p (m) <= nu_p (n)=b$. Then, we essentially replace $a$ and $b$ with $a$ and $b-a$.

Now I asked myself: what is invariant under this operation? This replacement reminds me of the Euclidean algorithm. Indeed, $gcd(a, b-a) = gcd(a, b)$. Since $gcd$ is associative and transitive, what this tells us is that, for all primes $p$, the $gcd$ of the exponents of $p$ in the prime factorizations of all the numbers on the blackboard remains the same.

With this important observation, we are ready to write up the proof.

*My Solution.*

*_Proof of part (a)._*

*_Claim 1._* The product of the integers on the blackboard never increases after any move. Furthermore, this product decreases whenever the choices of $m$ and $n$ are not coprime.

#pad(left: 2em)[
  _Proof of Claim 1._ Let $P$ denote the product of the integers currently on the blackboard. Suppose that Confucius chooses two integers $m > 1$ and $n > 1$ on different locations on the blackboard. Then, the product of the integers of blackboard changes from $P$ to $ P' = P dot lcm(m, n) / (m n) = P / gcd(m, n) <= P. $ Furthermore, $lcm(m, n) = m n$ if and only if $gcd(m, n) = 1$. Therefore, the product remains the same if $m$ and $n$ are coprime, and strictly decreases if they are not. $qed$
]

*_Corollary 2._* Confucius can make a move with two non-coprime numbers a finite number of times.

#pad(left: 2em)[
  _Proof of Corollary 2._ Let $P$ be the product of the $2026$ integers initially written on the blackboard. Note that $P > 1$ and $P$ is a positive integer. By Claim 1, each move with non-coprime numbers decreases this product by at least 1, so such a move can be made at most $P-1$ times.
]

*_Claim 3._* The number of integers greater than 1 on the blackboard never increases after any move. Furthermore, this number decreases by exactly 1 whenever the choices of $m$ and $n$ are coprime.

#pad(left: 2em)[
  _Proof of Claim 3._ A move removes two entries greater than 1 and inserts two positive integers, at most two of which can be greater than 1. Hence the number of entries greater than 1 cannot increase.
  Furthermore, suppose that Confucius chooses $m>1$ and $n>1$, where $gcd(m, n)=1$. Note that $lcm(m, n) = (m n) / gcd(m, n) = m n$. Therefore, with this move, $m$ and $n$ are replaced with $1$ and $m n$. Since $m$, $n$, and $m n$ are each greater than 1, but $1$ isn't, the total number of integers greater than 1 on the blackboard decreases by 1 after this move. $qed$
]

*_Corollary 4._* Confucius can make a move with two coprime numbers a finite number of times.

#pad(left: 2em)[
  _Proof of Corollary 4._ By Claim 3, after $2025$ moves using two coprime numbers, at most one integer greater than one remains on the blackboard, so it is impossible to make more than $2025$ such moves. $qed$
]

For each move, $m$ and $n$ are either coprime or not coprime. By Corollary 2, there can only be a finite number of moves with non-coprime numbers; by Corollary 4, there can only be a finite number of moves with coprime numbers. Therefore, there can only be a finite number of moves throughout any game.

Furthermore, the game ends if and only if there are no two integers both greater than 1 on the blackboard. Also, $lcm(m, n) > 1$ for any two $m > 1$ and $n > 1$, so at least one of the two replacement integers for a given move is greater than 1. Initially, all $2026$ entries are greater than 1. At termination, the number of integers greater than 1 on the blackboard is less than two, so there is exactly one. Hence exactly one integer greater than one remains on the blackboard at the end of the game. $qed$

\

*_Proof of part (b)._* At any point in time, let the numbers written on the blackboard be $a_1, a_2, ..., a_2026$. Let $cal(P)$ denote the set of all prime numbers that divide at least one of these $a_i$. Define $nu_p (n)$ as the nonnegative integer $k$ such that $p^k divides n$ (in particular, $nu_p (1) = 0$). Let $ e(p) = gcd(nu_p (a_1), nu_p (a_2), ..., nu_p (a_2026)). $ Consider $ Q = product_(p in cal(P)) p^e(p) $

Let $Q_0$ be this quantity for the numbers initially on the blackboard.

I claim that $M = Q_0$ regardless of Confucius' choices.

To show this, I will show that this quantity $Q$ does not change over any move.

*_Claim 5._* The set $cal(P)$ does not change after a move.

#pad(left: 2em)[
  _Proof of Claim 5._ Before any move with $m$ and $n$, let $cal(P)$ be the set of all primes that divide at least one number on the blackboard. Let $p$ be any prime number.

  If $p divides.not m$ and $p divides.not n$, then $p divides.not gcd(m, n)$ and $p divides.not lcm(m, n)/gcd(m, n)$. Therefore, if this $p$ divides some other integer on the blackboard, it remains in $cal(P)$, and if it doesn't, then it is not added to $cal(P)$.

  Otherwise, $p divides m$ or $p divides n$. Then $p in cal(P)$. If both of these hold, $p divides gcd(m, n)$. Otherwise, since $p divides lcm(m, n)$ but $p divides.not gcd(m, n)$, we have $p divides lcm(m, n)/gcd(m, n)$. In either case, $p$ still divides at least one number on the blackboard. $qed$
]

Suppose that Confucius chooses two integers $m$ and $n$ from different places on the blackboard, where $m > 1$ and $n > 1$. Let $p$ be any prime number that divides at least one number currently on the blackboard. Without loss of generality, suppose $nu_p (m) <= nu_p (n)$. Notice that $ nu_p (gcd(m, n)) = min(nu_p (m), nu_p (n)) = nu_p (m) $ and $ nu_p (lcm(m, n)/gcd(m, n)) = max(nu_p (m), nu_p (n)) - min(nu_p (m), nu_p (n)) = nu_p (n) - nu_p (m). $

Let $c_1, ..., c_2024$ be the $p$-adic valuations of the $2024$ entries not changed by the move.

Before the move, $ e(p) = gcd(c_1, ..., c_2024, nu_p (m), nu_p (n)), $ and after the move, $ e'(p) & = gcd(c_1, ..., c_2024, nu_p (gcd(m, n)), nu_p (lcm(m, n)/gcd(m, n))) \
      & = gcd(c_1, ..., c_2024, nu_p (m), nu_p (n) - nu_p (m)) \
      & = gcd(c_1, ..., c_2024, nu_p (m), nu_p (n)) \
      & = e(p), $
where in the second-to-last step we use the equality $gcd(a, b-a) = gcd(a, b)$ by the Euclidean algorithm.

Since the set of prime numbers on the blackboard remains the same after each move by Claim 5, and $e(p)$ remains the same for each such prime $p$, the expression $Q = product_(p in cal(P)) p^e(p)$ remains the same after a move.

By part (a), the game terminates after a finite number of moves, and $M$ is the only integer greater than 1 on the blackboard. Thus $cal(P)$ becomes exactly the prime factors of $M$, and $e(p) = gcd(nu_p (1), nu_p (1), ..., nu_p (1), nu_p (M)) = gcd(0, 0, ..., 0, nu_p (M)) = nu_p (M)$, we have $ Q_0 = Q_(#text[final]) = product_(p in cal(P)) p^(nu_p (M)) = M. $ Therefore, the value of $M$ does not depend on the choices of Confucius. $qed$
