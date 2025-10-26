const quizTitle = document.getElementById('quiz-title');
const progress = document.getElementById('progress');
const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers-container');
const nextButton = document.getElementById('next-button');
const submitButton = document.getElementById('submit-button');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackElement = document.getElementById('feedback');
const explanationElement = document.getElementById('explanation');
const sourceElement = document.getElementById('source');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const questionContainer = document.getElementById('question-container');
const buttonContainer = document.getElementById('button-container');
const scoreContainer = document.getElementById('score-container');

let currentQuestionIndex = 0;
let score = 0;

// Original HTML-Template für den Button-Container speichern
const originalButtonContainerHTML = buttonContainer.innerHTML;

// Original HTML-Template für den Score-Container speichern
const originalScoreContainerHTML = scoreContainer.innerHTML;

// Fragen in veränderter Reihenfolge
let questions = [];

let json_obj = null;

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

// Füge den Abbrechen-Button hinzu
function addQuitButton() {
    const quitButton = document.createElement('button');
    quitButton.id = 'quit-button';
    quitButton.innerText = 'Quiz abbrechen';
    quitButton.addEventListener('click', quitQuiz);
    buttonContainer.appendChild(quitButton);
}

// Frage laden
function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    answersContainer.innerHTML = '';

    for (const key in currentQuestion.answers) {
        if (currentQuestion.answers.hasOwnProperty(key)) {
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer');

            const input = document.createElement('input');
            input.type = currentQuestion.correctAnswers.length > 1 ? 'checkbox' : 'radio';
            input.id = key;
            input.name = 'answer';
            input.value = key;
            answerDiv.appendChild(input);

            const label = document.createElement('label');
            label.htmlFor = key;
            label.innerText = currentQuestion.answers[key];
            answerDiv.appendChild(label);

            answersContainer.appendChild(answerDiv);
        }
    }

    progress.innerText = `Frage ${currentQuestionIndex + 1} von ${questions.length}`;
    scoreElement.innerText = score;
    totalQuestionsElement.innerText = questions.length;

    feedbackContainer.style.display = 'none';
    nextButton.style.display = 'none';
    submitButton.style.display = 'block';

    // Stelle sicher, dass der Abbrechen-Button existiert (für den Fall eines Neustarts)
    if (!document.getElementById('quit-button')) {
        addQuitButton();
    }
}

// Source: https://stackoverflow.com/a/285565
function findLableForControl(el) {
   var idVal = el.id;
   labels = document.getElementsByTagName('label');
   for( var i = 0; i < labels.length; i++ ) {
      if (labels[i].htmlFor == idVal)
           return labels[i];
   }
}

// Antwort prüfen
function checkAnswer() {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswers = [];
    const answerElements = document.querySelectorAll('input[name="answer"]');
    const correctAnswers = [...currentQuestion.correctAnswers].sort();

    answerElements.forEach(answer => {
        if (answer.checked) {
            selectedAnswers.push(answer.value);
        }

        if(correctAnswers.includes(answer.value)){
            findLableForControl(answer).classList.add("correct");
        }else{
            findLableForControl(answer).classList.add("incorrect");
        }
    });

    if (selectedAnswers.length === 0) {
        feedbackElement.innerText = 'Bitte wähle mindestens eine Antwort aus.';
        feedbackElement.style.color = '#FF4444';
        feedbackContainer.style.display = 'block';
        return;
    }

    let isCorrect = false;
    let isPartiallyCorrect = false;

    if (selectedAnswers.length > 0) {
        
        const sortedSelectedAnswers = [...selectedAnswers].sort();

        if (sortedSelectedAnswers.every(answer => correctAnswers.includes(answer))) {
            if (sortedSelectedAnswers.length === correctAnswers.length) {
                isCorrect = true;
            } else {
                isPartiallyCorrect = true;
            }
        }
    }

    if (isCorrect) {
        feedbackElement.innerText = 'Richtig!';
        feedbackElement.style.color = '#00BB00';
        score++;
    } else if (isPartiallyCorrect) {
        feedbackElement.innerText = 'Teilweise richtig!';
        feedbackElement.style.color = '#FFA500'; // Orange
    } else {
        feedbackElement.innerText = 'Falsch!';
        feedbackElement.style.color = '#FF4444';
    }

    explanationElement.innerText = currentQuestion.explanation;
    feedbackContainer.style.display = 'block';
    submitButton.style.display = 'none';
    nextButton.style.display = 'block';
    scoreElement.innerText = score;
}

// Nächste Frage laden
function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else if (currentQuestionIndex === questions.length) {
        setTimeout(showQuizSummary, 0);
    }
}

// Quiz-Zusammenfassung anzeigen
function showQuizSummary() {
    quizTitle.innerText = 'Quiz Zusammenfassung';

    // Berechne die Bewertung basierend auf dem Score
    const percentage = (score / questions.length) * 100;

    let elem;
    if (percentage >= 90) {
        elem = json_obj.results[0];
    } else if (percentage >= 70) {
        elem = json_obj.results[1];
    } else if (percentage >= 50) {
        elem = json_obj.results[2];
    } else {
        elem = json_obj.results[3];
    }
    let message = elem.t;
    let emoji = elem.e;

    // Quiz-Zusammenfassung mit Grafik-Elementen
    questionContainer.innerHTML = `
                <div class="quiz-summary">
                    <div class="summary-emoji">${emoji}</div>
                    <h2>Quiz abgeschlossen!</h2>
                    <p class="summary-message">${message}</p>
                    <div class="score-display">
                        <p>Deine Punktzahl: <span class="final-score">${score}</span> von <span class="total-questions">${questions.length}</span></p>
                        <div class="score-bar-container">
                            <div class="score-bar" style="width: ${percentage}%"></div>
                        </div>
                        <p class="score-percentage">${percentage.toFixed(1)}%</p>
                    </div>
                    <p class="congratulations">Herzlichen Glückwunsch zum Abschluss des Quizzes!</p>
                </div>
            `;

    // Vereinfachte Button-Anzeige - nur Neustart-Button 
    buttonContainer.innerHTML = '<button id="restart-button" onclick="window.location.reload()">Quiz neu starten</button>';

    // Feedback und Score-Container ausblenden
    feedbackContainer.innerHTML = '';
    scoreContainer.innerHTML = '';

    // Konfetti-Effekt hinzufügen, wenn der Score gut ist
    if (percentage >= 70) {
        createConfetti();
    }
}

// Konfetti-Effekt erstellen
function createConfetti() {
    // Eine einfache Konfetti-Animation mit CSS
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';

    // 50 Konfetti-Stücke erstellen
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confettiContainer.appendChild(confetti);
    }

    document.body.appendChild(confettiContainer);

    // Nach 5 Sekunden entfernen
    setTimeout(() => {
        if (document.body.contains(confettiContainer)) {
            document.body.removeChild(confettiContainer);
        }
    }, 5000);
}

// Zufällige Farbe für Konfetti bekommen
function getRandomColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Quiz abbrechen
function quitQuiz() {
    // Quiz abbrechen und zur Zusammenfassung springen
    showQuizSummary();
}

// Quiz neustarten - einfachste Methode: Seite neu laden
function restartQuiz() {
    // Entferne alle Konfetti-Elemente, falls vorhanden
    const confetti = document.querySelector('.confetti-container');
    if (confetti && document.body.contains(confetti)) {
        document.body.removeChild(confetti);
    }

    // Die einfachste und zuverlässigste Methode: Die Seite neu laden
    window.location.reload();
}

function decodeQuestions() {
    try {
        const decodedBytes = Uint8Array.from(atob(document.getElementById("qb64").innerHTML), c => c.charCodeAt(0));
        // Decode bytes using TextDecoder (UTF-8)
        const decodedText = new TextDecoder("utf-8").decode(decodedBytes);
        json_obj = JSON.parse(decodedText);
        questions = json_obj.questions;
        shuffle(questions);
    } catch (error) {
        console.log("Error decoding embedded questions. Error: " + error);
    }

}



// Event-Listener für Buttons hinzufügen
submitButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', loadNextQuestion);

decodeQuestions();

// Abbrechen-Button hinzufügen
addQuitButton();

// Quiz starten
loadQuestion();