# Quiz Development
BootCampSpot Web Development - Week 4 Homework

![Preview](https://github.com/BCS-WebDev/Week4-Homework/blob/master/Assets/Quiz-min.gif)

## Notes on Quiz Development
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; A Quiz is a game of sorts. A simple game but
one that requires a cyclical pathway nonetheless. Every game needs a starting point,
which could be an introductory page, the game itself, to which an intro has access,
and an ending point, to which the game itself has access and also has access back
to the starting point. This allows for a simple loop that can be executed for as 
long as the player wants to play. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; It seems simple enough. Have objects that
represent each stage of the loop: intro, the game, and the ending, and have each
section activate the next. But when other actions, such as viewing the highscore,
that aren't a part of the main loop become available, different paths around the
game need to be accounted for. Furthermore, when considering more features can be
added, the actions that create the main loop have to be delegated systematically
so as to facilitate the process and minimize overlap.

## Motive & Action
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; In this particular case, the quiz is divided
into five sections: a persistent HUD, an intro, the quiz, the result page, and the
highscores page. The HUD displays a timer and a button to view the highscores while
remaining at the top of the page unless the highscores are displayed. And since the
HUD remains at the top of the page, the regular "intro to quiz to result to highscores
and back to intro" loop can be interrupted by viewing the highscores at any part of
the loop besides the highscores page itself.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; For this reason, we will make our quiz and its
code modular, in terms of breaking it down into manageable sections and grouping tasks
that pertains to those sections as much as possible. 

* HUD:
    - Displays Timer
    - View Highscores button
        - Has access to pause quiz timer when viewing highscore during quiz
        - Checks from where it is clicked - intro, quiz, or result
        - Hides display of section accordingly & calls highscores section

* Intro:
    - Resets & updates quiz timer, displays Intro
        - So that timer always shows 75 at intro
    - Start Quiz button
        - Resets questions and completed questions count
        - Calls quiz section

* Quiz:
    - Check if time left is negative due to penalty from viewing highscores section during quiz
        - Clear timer and end game without to prevent delay of waiting from quiz timer
    - Start Quiz timer
        - Subtract from time left every 1000 milliseconds (1 second)
    - Display question
        - Questions and Answers display randomly without repeating
    - Answer Choices
        - If 10 questions completed or time left is negative due to incorrect answer penalty
            - Clear timer and end game without to prevent delay of waiting from quiz timer
            - Call result section
        - Else display question

* Result:
    - Display time left as score
    - Submit button
        - Get highscores from storage
        - Push initials input value & score object to highscores
        - Sort by Name (alphabetical), then sort by score (highest to lowest)
        - Store highscores
        - Call highscores & refresh scoreboard

* Highscores:
    - Hide HUD visibility
    - If scoreboard needs to be refreshed, refresh scoreboard
    - Go Back button
        - Hide display & go back to previous section
        - If entry by submit button from result section, go to intro
    - Clear Highscore button
        - Remove scoreboard children & store empty highscores
        - Call highscores section
