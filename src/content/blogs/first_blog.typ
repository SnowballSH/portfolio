#metadata(
  (
    title: "Typst-powered Blogs",
    description: "The SnowballSH Portfolio now supports blog posts written in Typst.",
    date: "2026-02-08",
    tags: ("typst", "astro", "blog"),
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

#link("https://typst.app")[Typst] has amazed me since I first heard about it. Blazing fast and simple alternative to LaTeX written in Rust.

It even has great math support (`integral_0^(2 pi) sin(x) dif x`):

$ integral_0^(2 pi) sin(x) dif x. $

I truly believe it is the future of typsetting technologies.

This is why I decided to write my blogs and future short documents in Typst.

I hope you find joy in reading my yapping sessions. See you in the other blogs.
