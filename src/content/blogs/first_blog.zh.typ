#metadata(
  (
    title: "Typst 博客",
    description: "用 Typst 编写和发布博客",
    date: "2026-02-08",
    tags: ("typst", "astro", "blog"),
    hidden: true,
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

#link("https://typst.app")[Typst] 从我第一次听说它开始就让我非常惊艳。它是由 Rust 编写的、对 LaTeX 的一种极快且简洁的替代方案。

它对数学公式的支持也非常好（例如 `integral_0^(2 pi) sin(x) dif x`）:

$ integral_0^(2 pi) sin(x) dif x. $

我相信它会成为排版技术的未来。
