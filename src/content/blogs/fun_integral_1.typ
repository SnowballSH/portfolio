#metadata(
  (
    title: "A Fun Integral, Part 1",
    description: "A fun double integral with a nice solution.",
    date: "2026-02-25",
    tags: ("math", "calculus"),
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

== Problem

Evaluate $ integral_0^1 integral_0^1 1/(1-x y) dif x dif y. $

== Solution

$
    & integral_0^1 integral_0^1 1/(1-x y) dif x dif y \
  = & integral_0^1 integral_0^1 sum_(k=0)^infinity (x y)^k dif x dif y \
  = & sum_(k=0)^infinity integral_0^1 integral_0^1 x^k y^k dif x dif y \
  = & sum_(k=0)^infinity (integral_0^1 x^k dif x)(integral_0^1 y^k dif y) \
  = & sum_(k=0)^infinity (1/(k+1))^2 \
  = & sum_(k=1)^infinity 1/k^2
      = zeta(2) = pi^2/6.
$

