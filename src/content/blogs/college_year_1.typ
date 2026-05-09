#metadata(
  (
    title: "Trying to be a Fun Person: My First Year at CMU",
    description: "Things I'm proud of and things I need to work on.",
    date: "2026-05-09",
    tags: ("personal", "reflection"),
    hidden: false,
  ),
)<frontmatter>


#set page(height: auto, margin: 0.7em)
#set par(first-line-indent: (amount: 1em, all: true))
#show link: set text(fill: rgb("#3eff54"))
#show link: underline

#set quote(block: true)
#show quote: set align(center)
#show heading: set block(below: 1em)

#quote(
  attribution: [Confucius, _The Analects_],
)[
  #block[
    #set text(
      font: ("Kaiti SC", "KaiTi", "Libertinus Serif"),
      fallback: true,
    )
    子曰：学而时习之，不亦说乎。有朋自远方来，不亦乐乎。人不知而不愠，不亦君子乎。
  ]
  The Master said, "To learn and at due times to repeat what one has learnt, is that not after all a pleasure? That friends should come to one from afar, is this not after all delightful? To remain unsoured even though one's merits are unrecognized by others, is that not after all what is expected of a gentleman?"
]

= Introduction

As my first year of college comes to an end, I thought it would be nice to #link("https://arxiv.org/abs/2312.10997")[recall], #link("https://arxiv.org/abs/2601.07190")[compact], and #link("https://pokemondb.net/move/reflect")[reflect] on everything I've learned throughout this eventful year.

This year, I've made countless mistakes and wrong decisions, but also some pretty good ones. But it doesn't matter. As many have told me, when you're young, make as many mistakes and have as many successes as you'd like, but the only thing that matters in the end is what you get out of your experiences.

In this very long and boring blog (I hope the headings and #link("https://en.wikipedia.org/wiki/Green%27s_theorem")[green] links are somewhat entertaining), I'll share some of my takeaways from my experiences over the past 9 months.


= Sidequesting: You Don't Often Get to Walk 100 Blocks in NYC

This past year, I learned to find fun, meaningful opportunities, and to make the most of them.

In college, one major observation I had is that companies are competing to throw infinite money at students and programs, hoping to #link("https://youtu.be/dQw4w9WgXcQ")[gain attention] or to recruit talent. They do so in many different ways: sponsoring hackathons, courses, and clubs; sending recruiters to campus to talk with students; organizing career development events and paying all travel costs.

I can list many, many examples from this year. ICPC, CMIMC, ICMT, various hackathons, 15-122 Staff merch, Jane Street FTTP, Discover Citadel, ... Even 8 hours before my flight home, I was still at a "recruiting" (read: free food) event with Citadel Securities about their Quantitative Trading internship program. These sponsorship programs are all very different in many ways, but what holds for all of them is that they allow me to connect closely with recruiting teams at all kinds of companies and learn about each company's unique recruiting processes and work cultures. This helps me form an opinion on what I desire in my future career.

I call the act of attending these events "sidequesting." I was never required to participate in those activities, and yet I've decided to leave campus for over half of my weekends and give up my free time. While I probably could have done something fun at home during the weekends, I don't regret sidequesting with my friends at all. I meet amazing new and old friends from all around the world. I get to travel to NYC three times and walk 100 blocks at midnight in dress shoes. I visit various college campuses. All for free. I don't think these opportunities will be here after I graduate. I'm really, really lucky to get them, so I'll take them while I can.

#align(
  center,
)[#image("./assets/nyc_times_square.jpg", width: 50%) (Me and my friends at Times Square right before the 100-block walk north in NYC)]

Of course, none of this would be at all possible without support from my friends around the country. I am very, very grateful to Amie (MIT) and William (Columbia) for hosting me, and to Molly, Frank (Columbia), Racheal, and Renz (UIUC) for taking time out of their days to show me around their beautiful campuses. I know that there are a thousand times more reasons for going to NYC than for coming to Pittsburgh, but if anyone happens to be #link("https://maps.app.goo.gl/pRwcTwWFVnrQMixu7")[visiting Pittsburgh], I'll be more than happy to meet and help.

// Very often I wonder, and I still do, whether the ROI for these events is actually high enough for them to devote so many resources to college students. For many startups without a stable recruitment process, it's hard for me to believe these money-burning activities actually achieve much. In an ocean of 40 different startups sponsoring a hackathon, it is nearly impossible to expect that contestants will actually remember any one of them --- especially when they spent money to fly to a random city to #link("https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents")["Context Engineer"] with Claude Code in the hope of winning 5,000 dollars of AWS credits (in case you can't tell, I'm teasing here). But for the larger companies, maybe it is worth it. Or well, the companies are probably way smarter than me and probably already calculated that the #link("https://en.wikipedia.org/wiki/Electric_vehicle")[EV] is positive. I used to think that, since everyone knows the existence of Jane Street, why do they still advertise so much and sponsor almost every single math-related activity across the world? But it is only through the massive investment into sponsoring high school STEM competitions that Jane Street earned its fame among Olympiad students. And as these students step into college, by giving so much money to college clubs that run these very math competitions for a Logo + Shoutout during the contest, they make sure these STEM students are constantly reminded that "Jane Street gives us free food," thereby forming an extremely positive opinion on Jane Street and hence becoming willing to give Jane Street their talent.

Recently, I also think that, while enjoying sponsors' money and free food, it is important to think about _why_ they are willing to spend so much on you, _what_ *they* want to get out of you with this money, and _how_ *you* can take advantage of it. Honestly, I don't think I have anywhere close to a full answer to these questions, but only some guesses. While I try to figure them out, why not try to get as many of these opportunities as possible?

= Don't Be Afraid of Sending More #link("https://codeforces.com/contest/2220/problem/D2")[Queries]

I'm mostly an introvert, and sometimes it's not a good trait. Part of me is really scared of asking for exceptions or requesting extra work from other people, especially those higher up.

Jane Street FTTP happened to fall on CMU's midterm week. Initially, I was debating whether I should even go. According to some of my courses' websites, I would fail the courses if I intentionally missed a midterm, and no make-ups would be offered.

Without my friends, I would probably have played safe, stayed on campus, and missed the opportunities. However, some of my extrovert friends going to FTTP decided to draft an email to the professor to ask for a make-up. After the request was denied, they followed up with a second argument using logos, pathos, and many other rhetorical strategies, and eventually convinced the professors to offer make-up exams. I learned that (at least in the West) rules are somewhat malleable. With good rhetorical techniques and courage, it is possible to change people's minds. Next time, I'll try to do this for myself rather than waiting for help. I thank my friends for their courage and for leading the way.

= Making the Most out of Professors' Yapping Sessions

If I'm allowed to give one piece of advice to future college students, it would be that if you go to a lecture, sit in the front row.

I won't hide the fact that the extra legroom is the real reason the front row is better. But also, doing so forces me to interact with the professor every five minutes and not do anything other than pay attention.

Presenting to a dead crowd is boring, and communicating with people sitting in the middle of the room is difficult. As a result, professors tend to prefer interactions with people sitting closer to them as well. Being the largest face they see and the most active question answerer is the best way to get the professor to recognize your existence.

Sitting in the front row also helped me meet like-minded friends. In fact, I'm friends with everyone sitting in the front row, and one of the main reasons we became friends in the first place is our shared passion for learning and knowledge. I think this part is self-explanatory, so I'll stop yapping.

But yeah. Sit in the front if you go to lecture. Otherwise, I think I might be more productive by staying home and working alone.

= Math Is Hard, and #link("https://www.anilada.com/")[Anıl Ada] Lied to You, because You Actually Have to Do It Alone on Your Exams.

#align(
  center,
)[#image("./assets/mathishard.png", width: 40%, alt: "A Giraffe Teaching 15-251 Great Ideas in Theoretical CS, with subtitle \"math is hard, but you don't have to do it alone!\"") (Image source: #link("https://www.cs251.com/")[CS251])]

Math is #link("https://en.wikipedia.org/wiki/NP-hardness")[hard]. From 21-242 Matrix Theory & 21-269 Vector Analysis to 15-251 Theoretical CS & 21-373 Algebraic Structures, math became hard in college.

Hard, but also fun. Interesting. Mind-blowing. It felt as if, while the concepts were all new, they were all aiming to answer a familiar, intuitive question that we had been motivating throughout the course (ok, maybe except for that #link("https://www.cs.cmu.edu/~sutner/papers/MoritaFest.pdf")[Invertible Mealy Automata] from 251).

During the first semester, I tried to work in large groups as much as possible. Unfortunately, that did not work quite effectively for me. Many group study sessions felt like generic overviews of the course content, because with large groups, it is difficult to both narrow down the content and accommodate the skill sets of every person.

I also felt that I was #link("https://en.wikipedia.org/wiki/Dependency_graph")[depending] too much on other people's brains while solving a problem. On an exam, I'm all by myself, and I have to do it alone. There are times on exams when I've thought, "wait, I remember this, XYZ told me the idea, but I forgot it."

As a result, I think while group work can be helpful, it is ultimately still important to sit down by yourself and suffer through difficult problems alone. Math is hard, and you don't have to do it alone, but I think you should _also_ do it alone as a habit.

= Time Unmanagement

I still suck at planning my days, scheduling events, and creating reminders. This year, whenever I needed to remind myself of something, I scheduled an email to myself at a time when I knew I would read the notification. This sounds like a really stupid method, but because I somehow have the habit of always emptying my email inbox, I know I won't miss the notification. But also yes, it is really stupid, because there are so many more alternatives. For example, there is probably literally a built-in app on every mobile device called "reminders" or something similar.

While in the first semester, I forced myself to complete every assignment within 24 hours of release, as I stepped into the second semester, I realized this was definitely not a sustainable or healthy time management technique. It does not give me more free time until the last week of school (if you think about it, I'm just shifting my schedule forward by 6 days for not much reason), and it puts extra pressure on me. Hence, in the second semester, I stopped trying to manage my time. I just did whichever homework I felt like doing at a given time. Of course, this led to some pretty terrible behaviors such as doing homework using a #link("https://en.wikipedia.org/wiki/Priority_queue")[priority queue] (where the priority function is "how much do I like this assignment?"), resulting in me prioritizing a functional programming homework assignment not even due in 2 weeks over an English essay due in 2 days...

So yeah, I have a lot to learn and practice in time management.

= Writing Practice Exams

... helps a lot. See #link("https://www.andrew.cmu.edu/user/yinuohua/mocks.html")[my academic website]. Placing myself in the test writers' shoes is a great way for me to prepare for exams.

= All Friendships, No Fiendships

Contrary to the experiences of many people I've talked to, I think I've made more friends this year than in all four years of high school combined. Perhaps in high school, I'm really only exposed to a small set of "STEM people" with whom I take most of my classes. At CMU, I get to meet people from so many different majors and activities. Plus, being in a dorm helps too.

People here are really, really cool in so many different ways. There are people like Sid and my roommate Etash who scavenge broken electronic devices, bring back 100 different cables, and then somehow magically fix all of them perfectly. I have absolutely zero clue how they can (1) find new parts in the Wean basement every other day and (2) fix them on the same day and then use the fixed devices in their daily lives. There are people who can spawn ten sketches of anime girls in ten minutes. There are people like Vidur and Cole who enjoy producing and listening to EDM just like me. Everyone is also so funny always. I cannot recall a day when I haven't laughed during a conversation with my friends.

Speaking of my roommate, I'm very grateful that I met Etash online over the summer and that he has been such a cool, great, and fun roommate for the past year. While I've heard so many people crash out about their roommates both at CMU and at other universities, I'm glad I've had the complete opposite experience. You're obligated to check out #link("https://etashj.github.io/blog/")[his blog].

That said, maintaining healthy friendships is still not easy. Although I still stand by my motto of not hating on or blocking any person (I also try not to ghost people, though I do apologize if I do sometimes), it has become increasingly difficult to live in a chaotic world with kindness to all when not all are kind to me. In addition, I've sometimes struggled to deal with natural romantic feelings this past year. I still have a lot to learn about managing interpersonal relationships.

= LeetCode for #link("https://archive.org/details/geometryforenjoy00geor")[Enjoyment and Challenge]

#align(center)[
  #image("./assets/doleetcodedaily.png", width: 40%)
  (15-122 Staff Slack after I accidentally leaked my Google Calendar with LeetCode reminders)
]

Yes, this is the first daily hobby habit I've ever kept. Solving the daily LeetCode questions every day.

While many people view LeetCode as a burden, or as a boring, useless, and tedious training step for SWE interviews, I view it as the complete opposite. In fact, I started doing LeetCode only after getting my SWE internship.

Because I didn't have any courses this semester with a significant number of programming assignments, I realized that I would become very rusty at programming and less prepared for future semesters if I didn't write code for four months. What else do I enjoy? Algorithms and Data Structures! While #link("https://news.icpc.global/reactionsAE/2025/shanghai/?team=F73")[I love Competitive Programming], I somewhat enjoy the implementation ("writing good code") aspects of it more than reducing a problem to a math problem, proving a clever observation, and then submitting a smart solution. Hence, LeetCode felt like a perfect platform for my leisure time.

This section is probably very controversial, but I'm really just glad I was able to keep up a daily streak and a productive habit. If you view LeetCode as a leisure activity like video games, I hope it will no longer be tedious or boring.

= Some Other Regrets

I have not made a single post on #link("https://www.linkedin.com/in/yinuo-huang-sh/")[LinkedIn]. (Should I?)

I wish I had more time to practice competitive programming and participate in contests outside of LeetCode.

I planned to run for 30 minutes every morning, but the plan did not go past day 2.

I wish I had played more Competitive Pokemon VGC. Maybe next year?

= Epilogue

By some miracle, I still maintain a 4.0 QPA. For the first semester, I scraped the A cutoff for linguistics by one question on the final. For the second semester, after ending up with two Bs (both in math courses...) in my mid-sem grades, I decided to hang up the 21-269 midterm that I failed on my wall to remind me every day that I need to work harder. I have never spent so much time and energy on final exams in my life, but I suppose my efforts were worth it. And I'm just really, really lucky this time.

My friends, advisors, and professors have all told me that the sooner I get my first B, the better my mental health will be. And while I truly agree with this, I still don't know how much I can accept a bad grade deep in my heart, or how long it will take for me to accept it. I'm sure this will eventually happen, but I'm still scared to face it.

I thank my parents as always for their unwavering support for and belief in what I want to do.

I will challenge myself even more next semester. More stories to come.
