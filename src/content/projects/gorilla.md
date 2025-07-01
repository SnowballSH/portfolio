---
title: "The Gorilla Programming Language"
shortDescription: "A Tiny, Dynamically Typed, Flexible Programming Language."
date: "2021-02-26" # YYYY-MM-DD format
technologies: ["Golang", "Compilers"]
featured: true
status: "completed"
image: "/gorilla.webp"
imageAlt: "A Black Gorilla and the text 'Gorilla'"
githubUrl: "https://github.com/SnowballSH/Gorilla/tree/0.x"
links:
  - label: "Documentation"
    url: "https://snowballsh.github.io/Gorilla/"
    type: "docs"
category: "other"
priority: 2
---

# The Gorilla Programming Language

Gorilla is a tiny, dynamically typed, flexible programming language, written in Golang. Gorilla is built to make simple, flexible, well-understood programs in a relatively fast way.

Here are some examples of applications written in Gorilla:

Random Number Guessing Game:

```
use "random"

number = random.intRange(100) + 1

run = true
while run {
    guess = input("Guess a number between 1 and 100: ")

    if !guess.isInt() {
        println("Your input is not an integer!")
        next
    }

    guess = guess.toInt()

    if guess > number
        println("Guess smaller!")
    else if guess < number
        println("Guess larger!")
    else {
        println("You guess the correct number!")
        run = false
    }
}
```

and an HTTP server:

```
use "http"

http.get(
    "/",
    fn(writer, request) writer.write("Hello, world!")
)

let gorillaString = `<div style="text-align: center"><button onclick="alert('You clicked me!')"><h1>
Hello, Gorilla!</h1></button></div>`

http.get(
    "/gorilla",
    fn(writer, request) writer.write(gorillaString)
)

http.get(
    "/headers",
    fn(writer, request)
        request.header.each do(key, value)
            writer.write("$ " + key + " = " + value + "\n")
)

println("Listening on http://localhost:3000/")

http.serve(":3000")
```
