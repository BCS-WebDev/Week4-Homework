
/////////////////////// HUD ////////////////////////
var viewHighscores = document.getElementById("#viewHighscores");    // View Highscores Button

viewHighscores.addEventListener("click", function(event) {    // add click event to view highscores
    event.preventDefault();    // prevent default click functionality

    if (isQuiz) {      // if called from quiz section
        clearInterval(quizCountdown);     // stop timer
        quizTimeLeft -= 7;               // subtract from time for penalty
        quizTimer.textContent = quizTimeLeft;     // update timer
        document.getElementById("#quiz").style.display = "none";    // remove quiz section
    } else if (isResult) {     // if called from result section
        document.getElementById("#result").style.display = "none";  // remove result section
    } else if (isIntro) {      // if called from intro section
        document.getElementById("#intro").style.display = "none";     // remove intro section
    }

    callHighscores();    // call highscores section
});

/////////////////////// Intro ////////////////////////
var isIntro = true;

// Call Intro section
function callIntro() {
    isIntro = true;    // isIntro needed for view highscores case from intro 
    quizTimeLeft = 75;    // reset timer whenever intro called
    quizTimer.textContent = quizTimeLeft;    // update timer

    document.getElementById("#intro").style.display = "contents";    // display intro section
}

// Start Quiz Button
var startQuiz = document.getElementById("#startQuiz");    // get start quiz button
startQuiz.addEventListener("click", function(event) {    // add click event to start quiz button
    event.preventDefault();   // prevent default click functionality

    isIntro = false;       // set from intro section to false
    document.getElementById("#intro").style.display = "none";   // remove intro section

    tempQuestionsAndAnswers = questionsAndAnswers.slice(0);     // make temporary copy of questions and answers array
    quizQuestionsCompleted = 0;     // reset quiz questions completed count
    callQuiz();     // call quiz section
});


/////////////////////// Highscores ////////////////////////
var refreshScoreboard = true;      // to determine if scoreboard needs to be refreshed
var initialsAndScores = [];       // { initials: "", score: 25 }
var header = document.querySelector("header");    // header visibility controlled exclusively by highscores section
var scoreboard = document.getElementById("#scoreboard");     // get scoreboard

// Call Highscores section
function callHighscores() {       
    header.style.visibility = "hidden";    // when highscores is displayed hide header 

    if (refreshScoreboard) {         // scoreboard needs to be refreshed
        while (scoreboard.firstChild) {       
            scoreboard.removeChild(scoreboard.lastChild);       // remove scores from scoreboard
        }
        
        var tempInitialsAndScores = JSON.parse(localStorage.getItem("highscores"));   // get highscore item from localstorage 
        if (tempInitialsAndScores !== null) {      // if item exists
            initialsAndScores = tempInitialsAndScores;     // set initials and scores array to item
            for (var i = 0; i < initialsAndScores.length; i++) {     // for all elements
                var initialsToAdd = document.createElement("p");     // create paragraph element
                initialsToAdd.className = "mb-1 mb-sm-1 mb-md-1 w-100 bg-light text-dark";    // add classes
                initialsToAdd.style.height = "25px";    // set style
                initialsToAdd.textContent = (i + 1) + ". " + initialsAndScores[i].initials
                                                     + "  :  " + initialsAndScores[i].score; // add text content
                document.getElementById("#scoreboard").appendChild(initialsToAdd);   // append to scoreboard
            }
        }

        refreshScoreboard = false;    // no need to refresh scoreboard for now
    }

    document.getElementById("#highscores").style.display = "contents";   // display highscores section
}

// Go Back & Clear Highscores Button
var highscores = document.getElementById("#highscores");     // get highscores section
highscores.addEventListener("click", function(event) {      // add click event for event bubbling
    event.preventDefault();   // prevent default click functionality

    if (event.target.getAttribute("data-action") == "back") {    // if event target is go back button
        header.style.visibility = "visible";     // make header visible
        document.getElementById("#highscores").style.display = "none";   // remove highscores section

        if (isResult) {       // if accessed from result section
            callResult();  // go back to result
        } else if (isQuiz) {  // if accessed from result section
            callQuiz();    // go back to quiz
        } else {              // if accessed from intro or via submit button from result section
            callIntro();   // go back to intro
        }
    } else if (event.target.getAttribute("data-action") == "clear") {   // if event target is clear highscores button
        refreshScoreboard = true;    // scoreboard needs to be refreshed
        initialsAndScores = [];     // empty highscores array
        localStorage.setItem("highscores", JSON.stringify(initialsAndScores));    // store empty array in local storage

        callHighscores();     // call highscores section to refresh scoreboard
    }
});


/////////////////////// Timer /////////////////////////
var quizCountdown;   // global scope to clear interval from different functions
                    // cases & subsequent action delegated due to delay in main timer detecting changes
                   // delay may allow more problems 

/////////////////////// Quiz ////////////////////////
var isQuiz = false;     // isIntro needed for view highscores case from intro 
var quizTimeLeft = 75;     // initially 75
var quizTimer = document.getElementById("#timer");  // quiz timer

// Exit Quiz
function exitQuiz() {  
    isQuiz = false;   // exiting quiz section so set to false
    document.getElementById("#quiz").style.display = "none";   // remove quiz section
    callResult();    // call result (only one exit from quiz)
}

// Call Quiz section
function callQuiz() {
    isQuiz = true;     // isQuiz needed for view highscores case from intro 
    if (quizTimeLeft <= 0) {     // for case when returning from view highscore (timer may be negative due to -5 penalty)
        clearInterval(quizCountdown);   // stop timer
        exitQuiz();    // exit quiz
        return;
    }

    quizCountdown = setInterval(     // start timer
        function() {
            if (quizTimeLeft == 0) {    // if timer reaches 0
                clearInterval(quizCountdown);   // stop timer
                exitQuiz();   // exit quiz
                return;
            }
            
            quizTimeLeft--;   // subtract 1 from timer every second
            quizTimer.textContent = quizTimeLeft;    // update timer
        },
        1000   // every 1000 milliseconds second
    );

    displayQuestionAndAnswers();   // display new question at start and when returning from view highscores

    document.getElementById("#quiz").style.display = "contents";   // display quiz section
}

// Questions & Answers
var quizQuestion = document.getElementById("#question");   // get question element
var answerChoices = document.querySelectorAll('[data-answer-Index]');   // get all elements with data-answer-Index property
var quizQuestionsCompleted = 0;         // one of quiz end conditions (== 10), initially 0
var questionsAndAnswers = [              // questions & answers
    { question: "Badger:", answer: "Growl!" },   // { question: "", answer: "" }
    { question: "Bat:", answer: "Screech!" },
    { question: "Crow:", answer: "Caw caw!" },
    { question: "Cat:", answer: "Meow!" },
    { question: "Fox:", answer: "Ring-ding-ding-ding-dingeringeding!" },
    { question: "Cat:", answer: "Purr!" },
    { question: "Horse:", answer: "Neigh!" },
    { question: "Duck:", answer: "Quack!" },
    { question: "Fox:", answer: "Jacha-chacha-chacha-chow!" },
    { question: "Frog:", answer: "Ribbit!" },
    { question: "Dog:", answer: "Woof!" },
    { question: "Wolf:", answer: "Awoo!" },
    { question: "Fox:", answer: "Wa-pa-pa-pa-pa-pa-pow!" },
    { question: "Birds:", answer: "Chirp!" },
    { question: "Cow:", answer: "Moo!" },
    { question: "Human:", answer: "Hey, what's up?" },
    { question: "Fox:", answer: "Fraka-kaka-kaka-kaka-kow!" },
    { question: "Turkey:", answer: "Gobble gobble!" },
    { question: "Pidgeon:", answer: "Coo!" },
    { question: "Snake:", answer: "Hiss!" },
    { question: "Fox:", answer: "Hatee-hatee-hatee-ho!" },
    { question: "Pig:", answer: "Oink!" },
    { question: "Hen:", answer: "Bah-gawk!" },
    { question: "Rooster:", answer: "Cock-a-doodle-doo!" },
    { question: "Fox:", answer: "A-hee-ahee ha-hee!" },
    { question: "Sheep:", answer: "Baa!" },
    { question: "Parrot:", answer: "Polly want a cracker!" },
    { question: "Seal:", answer: "Arf!" },
    { question: "Owl:", answer: "Hoot!" },
    { question: "Fox:", answer: "Joff-tchoff-tchoffo-tchoffo-tchoff!" }
];   
var wrongAnswers = ["Bellow!", "Trill!", "Squeal!", "Squeak!", "Buzz!", "Nicker!", "Dook!", "Bleat!",    // wrong answers array
                        "Bugle!", "Hee haw!", "Snort!", "Growl!", "Roar!", "Snarl!", "Low!", "Pipe!",
                        "Click!", "Bray!", "Trumpet!", "Honk!", "Chatter!", "Cough!", "Scream!", "Grunt!",
                        "Munch!", "Crunch!", "Sing!", "Groan!", "Grumble!"];
var tempQuestionsAndAnswers;    // reset to questionsAndAnswer at callIntro()
var currentQuestionAndAnswer;   // currently chosen question and answer
var currentRightAnswerIndex;     // current right answer index

// Display Question & Answer Choices
function displayQuestionAndAnswers() {     // choose & display questions & answers
    var tempWrongAnswers = wrongAnswers.slice(0);   // make copy of wrong answers array
    for(var i = 0; i < 4; i++) {                    // to remove chosen elements and prevent repeat wrong answers
        var randomWrongAnswerIndex = Math.floor(Math.random() * tempWrongAnswers.length);   // choose random index
        answerChoices[i].textContent = (i + 1) + ".  " + tempWrongAnswers.splice(randomWrongAnswerIndex, 1);   // pop element & set
    }

    var randomQAIndex = Math.floor(Math.random() * tempQuestionsAndAnswers.length);  // pick random index for question & answer
    currentQuestionAndAnswer = tempQuestionsAndAnswers.splice(randomQAIndex, 1);  // pop question & answer pair
    quizQuestion.textContent = currentQuestionAndAnswer[0].question;   // set question

    currentRightAnswerIndex = Math.floor(Math.random() * answerChoices.length);    // choose random wrong answer to replace
    answerChoices[currentRightAnswerIndex].textContent = (currentRightAnswerIndex + 1) + ".  "   // replace with right answer
                                                                    + currentQuestionAndAnswer[0].answer;
}

// Answer Choices Buttons
var quiz = document.getElementById("#quiz");   // get quiz section
var answerConfirmCountdown;   // answer confirm timer global early timer clear
var answerConfirm = document.getElementById("#answerConfirm");   // get answer confirm div

quiz.addEventListener("click", function(event) {    // quiz event bubbling
    event.preventDefault();    // prevent default click functionality
    clearInterval(answerConfirmCountdown);       // clear answer confirm counter

    quizQuestionsCompleted++;   // tally questions completed
    if (event.target.getAttribute("data-answer-Index") == currentRightAnswerIndex) { // if answer index matches current answer index
        answerConfirm.textContent = "Correct!";   // change tex to correct
    } else {                                           // if not
        answerConfirm.textContent = "Incorrect!";       // change tex to incorrect
        quizTimeLeft -= 10;     // subtract 10 seconds from timer for penalty
        quizTimer.textContent = quizTimeLeft;       // update timer
    }
    answerConfirm.parentElement.style.visibility = "visible";   // make answer confirm message visible

    var answerConfirmTime = 1;   // initially 1 & reset to 1
    answerConfirmCountdown = setInterval(     // set interval to make answer confirm message hidden
        function() {
            if (answerConfirmTime <= 0) {     // if time hits 0
                answerConfirm.parentElement.style.visibility = "hidden";   // make answer confirm message hidden
                clearInterval(answerConfirmCountdown);   // stop timer

                return;
            }

            answerConfirmTime--;  // subtract from answer confirm timer
        },
        1000   // every 1000 milliseconds (1 second)
    );

    // if quiz timer negative due to incorrect answer or 10 questions completed
    if (quizTimeLeft <= 0 || quizQuestionsCompleted == 10) {   
        clearInterval(quizCountdown);    // stop quiz timer
        exitQuiz();    // exit quiz
    } else {
        displayQuestionAndAnswers();    // if not, display next question
    }
});


/////////////////////// Result ////////////////////////
var isResult = false;     // initially false

// Call Result
function callResult() {
    isResult = true;    // isIntro needed for view highscores case from intro 
    document.getElementById("#score").textContent = quizTimeLeft;    // set score to time left on timer
    document.getElementById("#result").style.display = "contents";   // display result section
}

// Submit Initials & Score Button
var submit = document.getElementById("#submit");   // get submit button
submit.addEventListener("click", function(event) {    // add click event
    var initialsToAdd = document.getElementById("#initials").value;     // get input value from initials input field
    if (initialsToAdd.length > 10) {
        initialsToAdd = initialsToAdd.substring(0, 10);    // if input value longer than 10, take first 10 characters
    } else if (initialsToAdd.length == 0) {
        initialsToAdd = "Anon";       // if input value empty, set to anonymous
    }

    var tempInitialsAndScores = JSON.parse(localStorage.getItem("highscores"));   // get highscores array item from local storage
    if (tempInitialsAndScores !== null) {   
        initialsAndScores = tempInitialsAndScores;   // if item exists, set to initials and scores array
    }
    initialsAndScores.push({ initials: initialsToAdd, score: quizTimeLeft });   // push object with initials & score

    initialsAndScores.sort(function(a, b) {   // sort array alphabetically by initials first
        var nameA = a.initials.toLowerCase(); 
        var nameB = b.initials.toLowerCase(); 

        if (nameA < nameB) {
            return -1;
        } else if (nameA > nameB) {
            return 1;
        } else {
            return 0;
        }
    });
    initialsAndScores.sort(function (a, b) {   // then sort by score (highest to lowest)
        return b.score - a.score;
    });
    localStorage.setItem("highscores", JSON.stringify(initialsAndScores));   // store highscores array in localstorage

    isResult = false;    // exiting result section so set to false
    refreshScoreboard = true;   // scoreboard needs refreshing
    document.getElementById("#initials").value = "";
    document.getElementById("#result").style.display = "none";   // remove result section
    
    callHighscores();   // call highscores
});