---
title: "Snake"
shortDescription: "A Typescript to Brainf compiler."
date: "2021-05-29" # YYYY-MM-DD format
technologies: ["Rust", "Brainf", "Compilers"]
featured: false
status: "completed"
githubUrl: "https://github.com/SnowballSH/snake_bf"
category: "other"
priority: 4
---

# Snake

Snake is a typescript-like programming language that compiles to brainf\*ck, an esoteric language.

Snake current supports:

- Variable assignment
- Binary operations
- Print to console
- Types: Byte, Unit, Function
- Sum of bytes

For example, the following code

```
let thirteen = 13;
let A = thirteen + thirteen - 6;
let B = A + A;
print(sum(A, B, 2), sum(A, A, A));
```

Compiles to

```
+++++++++++++><[>+>+<<-]>>[<<+>>-]<<[>>+>+<<<-]
>>>[<<<+>>>-]<[->+<]<[->>+<<]>>><<<[-]>>[<<+>>-
]><[-]<[-]++++++><<[->>+<<]>[->-<]>><<<[-]>>[<<
+>>-]><[-]<[-]<[>+>+<<-]>>[<<+>>-]<<[>>+>+<<<-]
>>>[<<<+>>>-]<[->+<]<[->>+<<]>>><<<[-]>>[<<+>>-
]><[-]<[-]<<[>>+>+<<<-]>>>[<<<+>>>-]<<<[>>>+>+<
<<<-]>>>>[<<<<+>>>>-]<<<<[>>>>+>+<<<<<-]>>>>>[<
<<<<+>>>>>-]<[->+<]><<[->>+<<]>><<<[->>>+<<<]>>
>><<<<[-]>>>[<<<+>>>-]><[-]<[-]<[-]++><<<[>>>+>
+<<<<-]>>>>[<<<<+>>>>-]<<<<<[>>>>>+>+<<<<<<-]>>
>>>>[<<<<<<+>>>>>>-]<[->+<]><<[->>+<<]>><<<[->>
>+<<<]>>>><<<<[-]>>>[<<<+>>>-]><[-]<[-]<[-]>+++
+[<++++++++>-]<<.>.<<.>>>+++[<------->-]<-.[-]<
<[-]>>[<<+>>-]<[-]
```

which, when run, correctly outputs `> <`.
