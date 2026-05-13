#metadata(
  (
    title: "Solving a Short but Nontrivial Introductory Olympiad Problem from China",
    description: "A rigorous solution to my fifth grade neighbor's insanely difficult math homework.",
    date: "2026-05-12",
    tags: ("math", "algebra"),
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

= Introduction

Apparently, my new neighbor from Shanghai is a genius fifth grader who is enrolled in a high school curriculum right now and is on track to join Tsinghua by the age of 15. It should not be too surprising to say that he is preparing for the China Mathematical Olympiad (CMO). Today, he showed me one of his homework problems from his olympiad training class, and I was stumped.

The topic was "Set Theory." I thought that, surely as a college student, a fifth grader's set theory problem cannot be difficult?

He pointed at problem 3 on his homework, telling me that this is the first problem he could not solve. He also reminded me that problems 4 through 6 are from the CMO and the IMO, so he also did not solve them (since when are 5th graders solving IMO problems now?).

After staring at the problem for ten minutes, I could not solve the second part of the problem. As a redemption after the embarrassment, I will write up my solution here. Because this problem has so many edge cases and places for mistakes, I will write a *fully-rigorous solution*.

Oh yeah, this problem reminds me of exactly why I did *not* do olympiad math in China. If you do enough Gaolian problems, you'll see some sort of pattern among them... Note that I am not sure about the source of this problem --- it looks like the style of a past Gaolian round 2 (China's equivalent of AIME) exam. Please let me know if you find the source of this problem.

1% Set Theory, 99% Algebra.

= Problem

For a given $a in RR$, define $f(x) = a x^2 - 1$. Define sets $A = {x in RR | f(x) = x}$ and $B = {x in RR | f(f(x)) = x}$.

(a) Prove that $A subset.eq B$.

(b) Determine, with proof, all possible values of $a$ for which $A = B != emptyset$.

= Remark

Part (a) is trivial --- it simply tests whether the contestant knows what a subset is.

Part (b)... no idea why this is on the set theory homework. My only bottleneck was the algebra observations.

= My Solution

(a) _Proof._ Let $x in A$. Then, $f(x) = x$, so $f(f(x)) = f(x) = x$, which means $x in B$. Therefore, $A subset.eq B$. $qed$

(b) I claim that the set of all possible values of $a$ is $[-1/4, 3/4]$.

_Proof._ We break the proof down into two claims.

*Claim 1:* $A != emptyset$ if and only if $a >= -1/4$.

_Proof of claim 1._

$(=>)$ #text(red)[First note that if $a = 0$], the claim trivially holds because $0 >= -1/4$.

#text(yellow)[For the case where $a != 0$], if $A != emptyset$, then $f(x)-x=a x^2-x-1$ has a root. Therefore, $Delta = (-1)^2 - 4(a)(-1) >= 0$, so $a >= -1/4$.

$(arrow.l.double)$ #text(red)[First note that if $a = 0$], then $f(x) = -1$, so $f(-1)=-1$ is a fixed point, hence $-1 in A$, so $A != emptyset$.

#text(yellow)[For the case where $a != 0$], if $a >= -1/4$, then $Delta>=0$, so $f(x)-x$ has at least one real root, which means there exists some $x in RR$ for which $x in A$. $qed$

*Claim 2:* $A = B$ if and only if $a <= 3/4$.

_Proof of claim 2._ We have that $-1 = f(x) - a x^2$. Therefore,
$ f(f(x))-x & = a (f(x))^2 - 1 - x \
          & = a (f(x))^2 + f(x) - a x^2 - x \
          & = a (f(x)-x)(f(x)+x) + (f(x) - x) \
          & = (a(f(x)+x) + 1)(f(x)-x) $ holds for all $x in RR$.

For convenience, denote $g(x) = a^2 x^2 + a x + (1-a)$. Then $f(f(x))-x=g(x)(f(x)-x)$.

#text(red)[First note that if $a = 0$], then we get $f(f(x)) - x = (0+1)(f(x)-x) = f(x)-x$ for all $x in RR$, so $A = B$.

Then, we will prove claim 2 for #text(yellow)[the case where $a != 0$].

#text(yellow)[$(=>)$] Since $A = B$, it must be that $B subset.eq A$. Hence any root of $f(f(x))-x$ is also a root of $f(x)-x$. Therefore, either $g(x)$ has no real roots, or the roots of $g(x)$ is a subset of the roots of $f(x)-x$.

Case 1: $g(x)$ has no real roots. Then, $Delta = a^2 - 4 a^2 (1-a) < 0$, so $a^2 (4a-3) < 0$, and #text(yellow)[since $a != 0$], this gives $a < 3/4$.

Case 2: $g(x)$ has at least one real root, and all roots of $g(x)$ is also a root of $f(x)-x$.

In this case, $forall r in RR$, $g(r)=0 ==> f(r)-r=0$.

Let $r$ be a root of $g(x)$. Then, both $a^2 r^2 + a r + (1 - a) = 0$ and $a r^2 - r - 1 = 0$. Substitution gives $a(r+1) + a r + (1-a) = 0$, so $2a r + 1 = 0$, and #text(yellow)[since $a != 0$], this gives $r = -1/(2a)$. Therefore, $g(x)$ must have exactly one real root, and it must be $-1/(2a)$. In this case, $Delta = 0$, so $a^2 (4a-3) = 0$, and #text(yellow)[since $a != 0$], we have $a = 3/4$.

That concludes all cases. In all cases, $a <= 3/4$.

#text(yellow)[$(arrow.l.double)$] As above, if $a < 3/4$, then $g(x)$ has no real roots, so $f(f(x))-x=0 ==> f(x)-x = 0$, so $B subset.eq A$.

If $a = 3/4$, then $g(x)$ has exactly one root $-1/(2a) = -2/3$, and in this case, $f(-2/3)-(-2/3)=(3/4)(-2/3)^2 - 1 + 2/3 = 0$, so $f(f(x))-x=0 ==> f(x)-x = 0$, which means $B subset.eq A$.

Hence if $a <= 3/4$ and #text(yellow)[$a != 0$], then $B subset.eq A$. Furthermore, in part (a), we deduced that $A subset.eq B$. Therefore, we have $a <= 3/4 and a != 0 ==> A = B$.

Therefore, #text(yellow)[both directions] are proven, and in the case where $a != 0$, we have $a <= 3/4$ if and only if $A = B$.

Combining this with #text(red)[the $a=0$ case], we have proven claim 2. $qed$

By claim 1 and claim 2, $A = B$ and $A != emptyset$ if and only if $a >= -1/4$ and $a <= 3/4$, so the set of all possible values of $a$ is $[-1/4, 3/4]$. $qed$
