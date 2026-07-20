#metadata(
  (
    title: "IMO 2026",
    description: "My attempts at some problems from the 67th International Mathematical Olympiad.",
    date: "2026-07-18",
    tags: ("math",),
    // hidden: true,
  ),
)<frontmatter>

#import "@preview/cetz:0.5.2"

#let accent-blue = rgb("#55b7ff")
#let accent-red = rgb("#ff647c")
#let accent-orange = rgb("#ffad5c")
#let accent-green = rgb("#4bd68a")
#let muted-gray = rgb("#9aabb8")
#let question-label(body) = text(fill: accent-blue, weight: "bold", body)
#let theorem-label(body) = text(
  fill: accent-red,
  weight: "bold",
  style: "italic",
  body,
)
#let section-label(body) = text(fill: accent-blue, weight: "bold", body)
#let case-label(body) = text(
  fill: accent-green,
  weight: "bold",
  style: "italic",
  body,
)
#let proof-label(body) = text(
  fill: accent-orange,
  weight: "bold",
  style: "italic",
  body,
)
#let reflection-label(body) = text(fill: muted-gray, weight: "bold", body)
#let proof-end(color) = text(fill: color)[$qed$]

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

#question-label[Question 1.] There are $2026$ integers greater than 1 written on a blackboard, not necessarily different. In a move, Confucius chooses two integers $m > 1$ and $n > 1$ from different places on the blackboard and replaces these two integers with $ gcd(m, n) #text[ and ] lcm(m, n)/gcd(m, n). $
He continues to make moves while it is possible to do so.

(a) Prove that, regardless of the choices of Confucius, after finitely many moves, exactly one integer $M$ on the blackboard is greater than 1.

(b) Prove that the value of $M$ does not depend on the choices of Confucius.

#reflection-label[My thought process for part (a).] These types of problem usually contain a creative invariant (i.e. a property that never changes throughout the course of the game).

The first idea that came to mind was considering the product of the numbers. The two new numbers' product is $lcm(m, n)$, which is at most $m n$, and equality is reached if and only if $gcd(m, n)=1$, so this might be useful.

Since the product is always positive and nonincreasing, to solve part (a), we only need need to show that Confucius can pick two coprime numbers a finite number of times. Let's see what happens when Confucius chooses two coprime numbers. Suppose $gcd(m, n)=1$. Then Confucius replaces them by $1$ and $m n$. Ah, the number of integers greater than 1 decreases by 1! Since there are only 2026 integers at the start, Confucius can only do this at most 2025 times before ending up with one integer.

Now we have all the tools to solve the problem.

#reflection-label[My thought process for part (b).] To solve (b), we just need to find another invariant on the game.

Trying out about ten examples on scratch paper, I made a few small observations. For example, any prime factor must stay, and $M$ must be between $gcd(a_1, ..., a_2026)$ and $lcm(a_1, ..., a_2026)$.

One significant observation I made was that it suffices to consider the numbers by the exponents of each prime factor. Let $p$ be a prime. Notice that $nu_p (gcd(m, n)) = min(nu_p (m), nu_p (n))$ and $nu_p (lcm(m, n)/gcd(m, n)) = max(nu_p (m), nu_p (n)) - min(nu_p (m), nu_p (n))$. This looks quite complicated. Let's replace the common parts with some variables. WLOG suppose $a=nu_p (m) <= nu_p (n)=b$. Then, we essentially replace $a$ and $b$ with $a$ and $b-a$.

Now I asked myself: what is invariant under this operation? This replacement reminds me of the Euclidean algorithm. Indeed, $gcd(a, b-a) = gcd(a, b)$. Since $gcd$ is associative and transitive, what this tells us is that, for all primes $p$, the $gcd$ of the exponents of $p$ in the prime factorizations of all the numbers on the blackboard remains the same.

With this important observation, we are ready to write up the proof.

#section-label[My Solution.]

#section-label[_Proof of part (a)._]

#theorem-label[Claim 1.] The product of the integers on the blackboard never increases after any move. Furthermore, this product decreases whenever the choices of $m$ and $n$ are not coprime.

#pad(left: 2em)[
  #proof-label[Proof of Claim 1.] Let $P$ denote the product of the integers currently on the blackboard. Suppose that Confucius chooses two integers $m > 1$ and $n > 1$ on different locations on the blackboard. Then, the product of the integers of blackboard changes from $P$ to $ P' = P dot lcm(m, n) / (m n) = P / gcd(m, n) <= P. $ Furthermore, $lcm(m, n) = m n$ if and only if $gcd(m, n) = 1$. Therefore, the product remains the same if $m$ and $n$ are coprime, and strictly decreases if they are not. #proof-end(accent-orange)
]

#theorem-label[Corollary 2.] Confucius can make a move with two non-coprime numbers a finite number of times.

#pad(left: 2em)[
  #proof-label[Proof of Corollary 2.] Let $P$ be the product of the $2026$ integers initially written on the blackboard. Note that $P > 1$ and $P$ is a positive integer. By Claim 1, each move with non-coprime numbers decreases this product by at least 1, so such a move can be made at most $P-1$ times. #proof-end(accent-orange)
]

#theorem-label[Claim 3.] The number of integers greater than 1 on the blackboard never increases after any move. Furthermore, this number decreases by exactly 1 whenever the choices of $m$ and $n$ are coprime.

#pad(left: 2em)[
  #proof-label[Proof of Claim 3.] A move removes two entries greater than 1 and inserts two positive integers, at most two of which can be greater than 1. Hence the number of entries greater than 1 cannot increase.
  Furthermore, suppose that Confucius chooses $m>1$ and $n>1$, where $gcd(m, n)=1$. Note that $lcm(m, n) = (m n) / gcd(m, n) = m n$. Therefore, with this move, $m$ and $n$ are replaced with $1$ and $m n$. Since $m$, $n$, and $m n$ are each greater than 1, but $1$ isn't, the total number of integers greater than 1 on the blackboard decreases by 1 after this move. #proof-end(accent-orange)
]

#theorem-label[Corollary 4.] Confucius can make a move with two coprime numbers a finite number of times.

#pad(left: 2em)[
  #proof-label[Proof of Corollary 4.] By Claim 3, after $2025$ moves using two coprime numbers, at most one integer greater than one remains on the blackboard, so it is impossible to make more than $2025$ such moves. #proof-end(accent-orange)
]

For each move, $m$ and $n$ are either coprime or not coprime. By Corollary 2, there can only be a finite number of moves with non-coprime numbers; by Corollary 4, there can only be a finite number of moves with coprime numbers. Therefore, there can only be a finite number of moves throughout any game.

Furthermore, the game ends if and only if there are no two integers both greater than 1 on the blackboard. Also, $lcm(m, n) > 1$ for any two $m > 1$ and $n > 1$, so at least one of the two replacement integers for a given move is greater than 1. Initially, all $2026$ entries are greater than 1. At termination, the number of integers greater than 1 on the blackboard is less than two, so there is exactly one. Hence exactly one integer greater than one remains on the blackboard at the end of the game. #proof-end(accent-blue)

\

#section-label[_Proof of part (b)._] At any point in time, let the numbers written on the blackboard be $a_1, a_2, ..., a_2026$. Let $cal(P)$ denote the set of all prime numbers that divide at least one of these $a_i$. Define $nu_p (n)$ as the nonnegative integer $k$ such that $p^k divides n$ (in particular, $nu_p (1) = 0$). Let $ e(p) = gcd(nu_p (a_1), nu_p (a_2), ..., nu_p (a_2026)). $ Consider $ Q = product_(p in cal(P)) p^e(p) $

Let $Q_0$ be this quantity for the numbers initially on the blackboard.

I claim that $M = Q_0$ regardless of Confucius' choices.

To show this, I will show that this quantity $Q$ does not change over any move.

#theorem-label[Claim 5.] The set $cal(P)$ does not change after a move.

#pad(left: 2em)[
  #proof-label[Proof of Claim 5.] Before any move with $m$ and $n$, let $cal(P)$ be the set of all primes that divide at least one number on the blackboard. Let $p$ be any prime number.

  If $p divides.not m$ and $p divides.not n$, then $p divides.not gcd(m, n)$ and $p divides.not lcm(m, n)/gcd(m, n)$. Therefore, if this $p$ divides some other integer on the blackboard, it remains in $cal(P)$, and if it doesn't, then it is not added to $cal(P)$.

  Otherwise, $p divides m$ or $p divides n$. Then $p in cal(P)$. If both of these hold, $p divides gcd(m, n)$. Otherwise, since $p divides lcm(m, n)$ but $p divides.not gcd(m, n)$, we have $p divides lcm(m, n)/gcd(m, n)$. In either case, $p$ still divides at least one number on the blackboard. #proof-end(accent-orange)
]

Suppose that Confucius chooses two integers $m$ and $n$ from different places on the blackboard, where $m > 1$ and $n > 1$. Let $p$ be any prime number that divides at least one number currently on the blackboard. Without loss of generality, suppose $nu_p (m) <= nu_p (n)$. Notice that $ nu_p (gcd(m, n)) = min(nu_p (m), nu_p (n)) = nu_p (m) $ and $ nu_p (lcm(m, n)/gcd(m, n)) = max(nu_p (m), nu_p (n)) - min(nu_p (m), nu_p (n)) = nu_p (n) - nu_p (m). $

Let $c_1, ..., c_2024$ be the $p$-adic valuations of the $2024$ entries not changed by the move.

Before the move, $ e(p) = gcd(c_1, ..., c_2024, nu_p (m), nu_p (n)), $ and after the move, $ e'(p) & = gcd(c_1, ..., c_2024, nu_p (gcd(m, n)), nu_p (lcm(m, n)/gcd(m, n))) \
      & = gcd(c_1, ..., c_2024, nu_p (m), nu_p (n) - nu_p (m)) \
      & = gcd(c_1, ..., c_2024, nu_p (m), nu_p (n)) \
      & = e(p), $
where in the second-to-last step we use the equality $gcd(a, b-a) = gcd(a, b)$ by the Euclidean algorithm.

Since the set of prime numbers on the blackboard remains the same after each move by Claim 5, and $e(p)$ remains the same for each such prime $p$, the expression $Q = product_(p in cal(P)) p^e(p)$ remains the same after a move.

By part (a), the game terminates after a finite number of moves, and $M$ is the only integer greater than 1 on the blackboard. Thus $cal(P)$ becomes exactly the prime factors of $M$, and $e(p) = gcd(nu_p (1), nu_p (1), ..., nu_p (1), nu_p (M)) = gcd(0, 0, ..., 0, nu_p (M)) = nu_p (M)$, we have $ Q_0 = Q_(#text[final]) = product_(p in cal(P)) p^(nu_p (M)) = M. $ Therefore, the value of $M$ does not depend on the choices of Confucius. #proof-end(accent-blue)

#reflection-label[Remark.] I really enjoyed this problem! I spent about 15 minutes on part (a). I was stuck on part (b) for the next 15 minutes, so I decided to take a shower, during which I made an important observation, and the problem took me a total of about an hour.

= Shan-Yu, Mulan, and Triangles

#question-label[Question 4.] Shan-Yu and Mulan are playing a game. Let $theta$ be an angle with $0^degree < theta < 180^degree$ known to both players. Initially, Shan-Yu makes a paper triangle $cal(T)$ with measurements of his choice. They repeatedly form the following steps.

If $cal(T)$ has at least one angle measuring exactly $theta$, then the game stops and Mulan wins.

Otherwise, Mulan chooses a point $P$ on the perimeter of $cal(T)$, different from its three vertices. She then makes a straight cut from $P$ to the opposite vertex of $cal(T)$.

Shan-Yu discards one of the two triangles. The remaining triangle becomes the new $cal(T)$.

For which real values of $theta$ can Mulan guarantee her victory in finitely many steps, no matter how Shan-Yu plays?

#section-label[My Solution.] I claim the answer is $ theta in {180^degree / n : n #text[is an integer greater than or equal to 2]}. $

#theorem-label[Lemma 1.] If before Mulan's move, one of the three angles has measure $k theta$ for some positive integer $k$, then Mulan wins after a finite number of moves.

#pad(left: 2em)[
  #proof-label[Proof of Lemma 1.] We will prove this by induction.

  For the base case, consider when $k=1$. Then, there is an angle with measure $theta$, so Mulan wins immediately.

  For the inductive step, let $k >= 2$, and assume for our inductive hypothesis that, if before Mulan's move, one of the three angles has measure $(k-1) theta$, then Mulan wins after a finite number of moves. Suppose that one of the three angles has measure $k theta$. Mulan will divide the angle into one angle with measure $theta$ and another with measure $(k-1) theta$, creating two triangles. If Shan-Yu keeps the triangle with the angle of measure $theta$, then Mulan wins immediately. Otherwise, if Shan-Yu keeps the triangle with the angle of measure $(k-1) theta$, then Mulan wins after a finite number of moves by our inductive hypothesis.

  By the principle of mathematical induction, for all positive integers $k$, if before Mulan's move, one of the three angles has measure $k theta$, then Mulan wins after a finite number of moves. #proof-end(accent-orange)
]

#theorem-label[Claim 2.] If there exists an integer $n >= 2$ such that $theta = 180^degree / n$, then Mulan wins after a finite number of moves.

#pad(left: 2em)[
  #proof-label[Proof of Claim 2.] Firstly, no matter what triangle Shan-Yu chooses, Mulan can always force Shan-Yu to reduce the triangle to a right triangle by choosing $P$ as the foot of the altitude from the vertex with the largest angle ($P$ lies on the opposite side because the other two angles must both be acute). Then, both of the triangles Shan-Yu could choose are right triangles, so after Shan-Yu's move, the paper triangle must be a right triangle.

  #align(center)[
    #context cetz.canvas({
      import cetz.draw: *
      scale(0.6)
      set-style(stroke: text.fill)

      line((-10, 0), (4, 6), (10, 0), close: true)

      set-style(stroke: red)
      line((4, 6), (4, 0))

      set-style(stroke: text.fill)
      cetz.angle.right-angle(
        (4, 0),
        (-10, 0),
        (4, 6),
        radius: 0.5,
        label: "",
      )
      content((4, -1), [$P$])
      circle((4, 0), radius: 0.1, fill: red, stroke: none)
    })
  ]

  If $n = 2$ ($theta = 90^degree$), Mulan wins. Now suppose $n >= 3$, so $theta < 90^degree$.

  Let $O$ be the vertex with the right angle. Let the other two vertices $A$ and $B$ have $angle A = alpha$ and $angle B = beta$, and without loss of generality suppose $alpha <= beta$.

  If $theta in {alpha, beta}$, then Mulan wins. Otherwise, there are two exhaustive cases:

  #case-label[Case 1.] Suppose $alpha < theta < 90^degree$. Then, Mulan picks the vertex $B$ with angle $beta$, and picks the point $P$ on the opposite side such that $angle B P O = theta$. This is possible because $alpha < theta < 90^degree$.

  #align(center)[
    #context cetz.canvas({
      import cetz.draw: *

      let a = (4, 8)
      let b = (-2, 0)
      let o = (4, 0)
      let theta-angle = 50deg
      let p = (4, 6 / calc.tan(theta-angle))

      set-style(stroke: text.fill)
      line(b, a, o, close: true)

      cetz.angle.angle(
        a,
        b,
        o,
        direction: "near",
        radius: 0.8,
        label-radius: 1.2,
        label: $alpha$,
      )
      cetz.angle.angle(
        b,
        o,
        a,
        direction: "near",
        radius: 0.9,
        label-radius: 1.3,
        label: $beta$,
      )
      cetz.angle.right-angle(o, b, a, radius: 0.45, label: "")

      set-style(stroke: red)
      line(b, p)
      circle(p, radius: 0.08, fill: red, stroke: none)
      cetz.angle.angle(
        p,
        b,
        o,
        direction: "near",
        radius: 0.8,
        label-radius: 1.25,
        label: $theta$,
      )

      content((-2.35, -0.35), [$B$])
      content((4.35, -0.35), [$O$])
      content((4.35, 8.25), [$A$])
      content((4.35, p.at(1)), [$P$])
    })
  ]

  Since $angle B P O = theta$, Mulan wins if Shan-Yu keeps triangle $B P O$. Suppose otherwise that Shan-Yu keeps triangle $A P B$.

  Now, $angle A P B = 180^degree - theta = 180^degree dot (n-1)/n = (n-1) theta$. Note that $n-1$ is a positive integer, so by Lemma 1, Mulan wins in a finite number of moves.

  #case-label[Case 2.] Suppose $0 < theta < alpha$. Let $k$ be the greatest positive integer such that $k theta <= alpha$. If $k theta = alpha$, then Mulan wins in a finite number of moves by Lemma 1. Otherwise, Mulan picks a point $P$ on side $B O$ such that $angle B A P = k theta$, and makes this move (which is legal since $k theta < alpha$, so $P$ does not coincide with $O$).

  #align(center)[
    #context cetz.canvas({
      import cetz.draw: *

      let a = (4, 8)
      let b = (-2, 0)
      let o = (4, 0)
      let theta-angle = 15deg
      let k = 2
      let remainder = calc.atan(3 / 4) - k * theta-angle
      let p = (4 - 8 * calc.tan(remainder), 0)

      set-style(stroke: text.fill)
      line(b, a, o, close: true)
      cetz.angle.angle(
        b,
        o,
        a,
        direction: "near",
        radius: 0.9,
        label-radius: 1.3,
        label: $beta$,
      )
      cetz.angle.right-angle(o, b, a, radius: 0.45, label: "")

      set-style(stroke: red)
      line(a, p)
      circle(p, radius: 0.08, fill: red, stroke: none)
      cetz.angle.angle(
        a,
        b,
        p,
        direction: "near",
        radius: 0.9,
        label-radius: 1.25,
        label: $k theta$,
      )

      content((-2.35, -0.35), [$B$])
      content((4.35, -0.35), [$O$])
      content((4.35, 8.25), [$A$])
      content((p.at(0), -0.35), [$P$])
    })
  ]

  If Shan-Yu keeps triangle $A B P$, then since $angle B A P = k theta$, Mulan wins in a finite number of moves by Lemma 1. Suppose otherwise that Shan-Yu keeps triangle $A O P$. By maximality of $k$, we have $angle O A P < theta$ and $angle O P A > beta$, so we are now back in case 1, for which we showed Mulan wins in a finite number of moves.

  That concludes all cases. Therefore, if there exists an integer $n >= 2$ such that $theta = 180^degree / n$, then Mulan wins in a finite number of moves. #proof-end(accent-orange)
]

#theorem-label[Claim 3.] If there does not exist an integer $n >= 2$ such that $theta = 180^degree / n$, then Shan-Yu can prevent Mulan from winning indefinitely.

#pad(left: 2em)[
  #proof-label[Proof of Claim 3.] Shan-Yu chooses an initial triangle with angles $theta/2$, $theta/2$, and $180^degree - theta$. Note that none of the three angles is equal to an integer multiple of $theta$.

  Firstly, if none of the three angles is equal to an integer multiple of $theta$, then none of the angles is $theta$, so Mulan does not immediately win.

  Next, I can show that Shan-Yu can always maintain this invariant. Let the triangle be $A B C$ and without loss of generality Mulan picked a point $P$ on side $B C$.

  #align(center)[
    #context cetz.canvas({
      import cetz.draw: *

      let a = (1, 6)
      let b = (-5, 0)
      let c = (7, 0)
      let p = (2, 0)

      set-style(stroke: text.fill)
      line(b, a, c, close: true)

      set-style(stroke: red)
      line(a, p)
      circle(p, radius: 0.08, fill: red, stroke: none)

      content((1, 6.35), [$A$])
      content((-5.35, -0.35), [$B$])
      content((7.35, -0.35), [$C$])
      content((2, -0.35), [$P$])
    })
  ]

  If neither $angle B A P$ nor $angle B P A$ is equal to an integer multiple of $theta$, or neither $angle P A C$ nor $angle C P A$ is equal to an integer multiple of $theta$, then Shan-Yu can keep a triangle in which neither of these two angles is equal to an integer multiple of $theta$, ensuring that the resulting triangle satisfies the invariant.

  Furthermore, since neither $angle B A C$ nor $180^degree$ is equal to an integer multiple of $theta$, at most one of ($angle B A P$, $angle P A C$) can be equal to an integer multiple of $theta$, and at most one of ($angle B P A$, $angle C P A$) can be equal to an integer multiple of $theta$.

  The only possible remaining case at this point is where $angle B A P$ and $angle C P A$ are each equal to an integer multiple of $theta$, or $angle B P A$ and $angle P A C$ are each equal to an integer multiple of $theta$. However, these cases are impossible. If $angle B A P$ and $angle C P A$ are each equal to an integer multiple of $theta$, then $angle B = angle C P A - angle B A P$ would also be equal to an integer multiple of $theta$, a contradiction. A similar argument holds for the other symmetric case.

  Therefore, there must be one triangle in which no angle is equal to an integer multiple of $theta$, so Shan-Yu can keep that triangle. The invariant can be maintained indefinitely, so Shan-Yu can prevent Mulan from winning indefinitely. #proof-end(accent-orange)
]

By Claim 2 and Claim 3, we have proven our answer. #proof-end(accent-blue)

#reflection-label[Remark.] This problem took me about 40 minutes to solve, but there were some minor construction details I had to reconsider while writing this solution up. Overall, I had lots of fun trying different constructions for this problem.
