
/////////////////////// Intro ////////////////////////
var isIntro = true;

// Call Intro section
function callIntro() {
    isIntro = true;
    quizTimeLeft = 75;
    quizTimer.textContent = quizTimeLeft;

    document.getElementById("#intro").style.display = "contents";
}

// View Highscores Button
var viewHighscores = document.getElementById("#viewHighscores");
viewHighscores.addEventListener("click", function(event) {
    event.preventDefault();

    if (isQuiz) {
        clearTimeout(quizCountdown);
        quizTimeLeft -= 5;
        document.getElementById("#quiz").style.display = "none";
    } else if (isResult) {
        document.getElementById("#result").style.display = "none";
    } else if (isIntro) {
        document.getElementById("#intro").style.display = "none";   
    }

    callHighscores();
});

// Start Quiz Button
var startQuiz = document.getElementById("#startQuiz");
startQuiz.addEventListener("click", function(event) {
    event.preventDefault();

    isIntro = false;
    document.getElementById("#intro").style.display = "none";

    tempQuestionsAndAnswers = questionsAndAnswers;
    quizQuestionsCompleted = 0;
    callQuiz();
});


/////////////////////// Highscores ////////////////////////
var refreshScoreboard = true;
var initialsAndScores = [];       // { initials: "", score: 25 }
var header = document.querySelector("header");    // header visibility controlled exclusively by highscores section
var scoreboard = document.getElementById("#scoreboard");

// Call Highscores section
function callHighscores() {
    header.style.visibility = "hidden";

    if (refreshScoreboard) {
        var initialsAndScores = JSON.parse(localStorage.getItem("highscores"));
        if (initialsAndScores !== "null") {
            for (var i = 0; i < initialsAndScores.length; i++) {
                var initialsToAdd = document.createElement("p");
                initialsToAdd.className = "mb-1 mb-sm-1 mb-md-1 w-100 bg-light text-dark";
                initialsToAdd.style.height = "25px";
                initialsToAdd.textContent = (i + 1) + ". " + initialsAndScores[i].initials;
                document.getElementById("#scoreboard").appendChild(initialsToAdd);

                var scoreToAdd = document.createElement("span");
                scoreToAdd.style.textAlign = "right";
                scoreToAdd.textContent = initialsAndScores[i].score;
                initialsToAdd.appendChild(scoreToAdd);
            }
        }

        refreshScoreboard = false;
    }

    document.getElementById("#highscores").style.display = "contents";
}

// Go Back Button
var goBack = document.getElementById("#highscores");
goBack.addEventListener("click", function(event) {
    event.preventDefault();

    if (event.target.getAttribute("data-action") == "back") {
        header.style.visibility = "visible";
        document.getElementById("#highscores").style.display = "none";

        if (isResult) {
            callResult();
        } else if (isQuiz) {
            callQuiz();
        } else {
            callIntro();
        }
    } else if (event.target.getAttribute("data-action") == "clear") {
        refreshScoreboard = true;
        initialsAndScores = [];
        localStorage.setItem("highscores", JSON.stringify(initialsAndScores));
        callHighscores();
    }
});


/////////////////////// Result ////////////////////////
var isResult = false;

// Call Result
function callResult() {
    isResult = true;
    document.getElementById("#score").textContent = quizTimeLeft;
    document.getElementById("#result").style.display = "contents";
}

// Submit Initials & Score Button
var submit = document.getElementById("#submit");
submit.addEventListener("click", function(event) {
    var initialsToAdd = document.getElementById("#initials").value;
    if (initialsToAdd.length > 10) {
        initialsToAdd = initialsToAdd.substring(0, 10);
    }

    initialsAndScores = JSON.parse(localStorage.getItem("highscores"));
    initialsAndScores.push({ initials: initialsToAdd, score: quizTimeLeft });

    initialsAndScores.sort(function(a, b) {   // sort by initials first
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
    initialsAndScores.sort(function (a, b) {   // then sort by score
        return a.score - b.score;
    });
    localStorage.setItem("highscores", JSON.stringify(initialsAndScores));

    isResult = false;
    refreshScoreboard = true;
    document.getElementById("#result").style.display = "none";
    
    callHighscores();
});


/////////////////////// Timer /////////////////////////
var quizCountdown;

/////////////////////// Quiz ////////////////////////
var isQuiz = false;
var quizTimeLeft = 75;     // initially 75
var quizTimer = document.getElementById("#timer");  // quiz timer

// Exit Quiz
function exitQuiz() {
    isQuiz = false;
    document.getElementById("#quiz").style.display = "none";
    callResult();
}

// Call Quiz section
function callQuiz() {
    isQuiz = true;
    if (quizTimeLeft <= 0) {
        exitQuiz();
        return;
    }

    quizCountdown = setTimeout(       
        function() {
            if (quizTimeLeft <= 0) {
                exitQuiz();
                clearTimeout(quizCountdown);
            }
            
            quizTimeLeft--;
            quizTimer.textContent = quizTimeLeft;
        },
        1000
    );

    displayQuestionAndAnswers();

    document.getElementById("#quiz").style.display = "contents";
}

// Questions & Answers
var quizQuestion = document.getElementById("#question");
var answerChoices = document.querySelectorAll('[data-answer-Index]');
var quizQuestionsCompleted = 0;
var questionsAndAnswers = [{ question: "Dog", answer: "yes" }];    // { question: "", answer: "" }
var wrongAnswers = ["no", "no", "no", "no"];
var tempQuestionsAndAnswers;    // reset to questionsAndAnswer at callIntro()
var currentQuestionAndAnswer;   // currently chosen question and answer
var currentRightAnswerIndex;     // current right answer index

// Display Question & Answer Choices
function displayQuestionAndAnswers() {
    var tempWrongAnswers = wrongAnswers;
    for(var i = 0; i < 4; i++) {
        var randomWrongAnswerIndex = Math.floor(Math.random() * tempWrongAnswers.length);
        answerChoices[i].textContent = (i + 1) + ". " + tempWrongAnswers.splice(randomWrongAnswerIndex, 1);
    }

    var randomQAIndex = Math.floor(Math.random() * tempQuestionsAndAnswers.length);
    currentQuestionAndAnswer = tempQuestionsAndAnswers.splice(randomQAIndex, 1);
    quizQuestion.textContent = currentQuestionAndAnswer.question;

    currentRightAnswerIndex = Math.floor(Math.random() * answerChoices.length);
    answerChoices[currentRightAnswerIndex].textContent = (i + 1) + ". " + currentQuestionAndAnswer.answer;
}

// Answer Choices Buttons
var quiz = document.getElementById("#quiz");
quiz.addEventListener("click", function(event) {
    event.preventDefault();

    quizQuestionsCompleted++;
    var answerConfirm = document.getElementById("#answerConfirm");
    if (event.target.getAttribute("data-answer-Index") == currentRightAnswerIndex) {
        answerConfirm.textContent = "Correct!";
    } else {
        answerConfirm.textContent = "Incorrect!";
        quizTimeLeft -= 10;
    }
    answerConfirm.parentElement.style.visibility = "visible";

    var answerConfirmTime = 1;   // initially 1
    var answerConfirmCountdown = setTimeout(       
        function() {
            if (answerConfirmTime <= 0) {
                answerConfirm.parentElement.style.visibility = "hidden";
                clearTimeout(answerConfirmCountdown);
            }

            answerConfirmTime--;
        },
        1000
    );

    if (quizTimeLeft <= 0 || quizQuestionsCompleted == 10) {
        clearTimeout(quizCountdown);
        exitQuiz();
    } else {
        displayQuestionAndAnswers();
    }
});