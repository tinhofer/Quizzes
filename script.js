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
const questions = [
    {
        question: 'Was sind die Hauptziele der KI-VO?',
        answers: {
            a: 'Die Entwicklung von KI zu verhindern',
            b: 'Einen einheitlichen Rechtsrahmen für KI-Systeme in der EU zu schaffen',
            c: 'Die Einführung von vertrauenswürdiger KI zu fördern',
            d: 'Nur Hochrisiko-KI-Systeme zu regulieren'
        },
        correctAnswers: ['b', 'c'],
        explanation: 'Die KI-VO zielt darauf ab, einen einheitlichen Rechtsrahmen zu schaffen und die Einführung von vertrauenswürdiger KI zu fördern.',
        source: 'Abschnitt V, Rz. 3.115, 3.116, 3.117, 3.118, 3.119'
    },
    {
        question: 'Die KI-VO verfolgt einen...',
        answers: {
            a: 'risikobasierten Ansatz',
            b: 'pauschalen Ansatz',
            c: 'vorsorgenden Ansatz',
            d: 'innovationsfreundlichen Ansatz'
        },
        correctAnswers: ['a'],
        explanation: 'Die KI-VO verfolgt einen risikobasierten Ansatz.',
        source: 'Abschnitt V, Rz. 3.128, 3.129'
    },
    {
        question: 'Was ist ein Algorithmus?',
        answers: {
            a: 'Eine Sammlung von Daten',
            b: 'Ein Computerprogramm',
            c: 'Eine Folge von Anweisungen zur Lösung eines Problems',
            d: 'Eine Hardwarekomponente'
        },
        correctAnswers: ['c'],
        explanation: 'Ein Algorithmus ist eine eindeutig definierte Folge von Anweisungen, um ein bestimmtes Problem zu lösen.',
        source: 'Abschnitt II, Rz. 3.23'
    },
    {
        question: 'Was bedeutet der Begriff "historischer Bias" im Zusammenhang mit algorithmischer Diskriminierung?',
        answers: {
            a: 'Eine Verzerrung in Algorithmen aufgrund von Fehlern in der Programmierung',
            b: 'Systematische Verzerrungen in Daten, die aus historischen Bedingungen resultieren',
            c: 'Eine Vorliebe von Algorithmen für historische Daten',
            d: 'Eine Verzerrung, die nur in historischen Archiven auftritt'
        },
        correctAnswers: ['b'],
        explanation: 'Historischer Bias bezieht sich auf Verzerrungen in Daten, die Ungleichheiten aus der Vergangenheit widerspiegeln.',
        source: 'Abschnitt IV, Rz. 3.55'
    },
    {
        question: 'Welche der folgenden KI-Praktiken ist laut KI-VO verboten?',
        answers: {
            a: 'Emotionserkennung am Arbeitsplatz zu Sicherheitszwecken',
            b: 'Biometrische Kategorisierung zur Feststellung der ethnischen Zugehörigkeit',
            c: 'Risikobewertung von Menschen iZm einer künftigen Straftat (predictive policing)',
            d: 'Verwendung von KI zur Unterstützung bei der Personalauswahl'
        },
        correctAnswers: ['b', 'c'],
        explanation: 'Die KI-VO verbietet bestimmte Praktiken wie die biometrische Kategorisierung zur Feststellung der ethnischen Zugehörigkeit und "predictive policing".',
        source: 'Abschnitt V, Rz. 3.132, 3.133'
    },
    {
        question: 'Welche Vorteile können mit dem Einsatz von AES verbunden sein?',
        answers: {
            a: 'Höhere Fehleranfälligkeit',
            b: 'Höhere Effizienz des Entscheidungsprozesses',
            c: 'Objektivere Entscheidungen durch Ausschaltung menschlicher Vorurteile',
            d: 'Mangelnde Transparenz'
        },
        correctAnswers: ['b', 'c'],
        explanation: 'AES können die Effizienz steigern und zu objektiveren Entscheidungen beitragen.',
        source: 'Abschnitt III, Rz. 3.41'
    },
    {
        question: 'Welches der folgenden Beispiele ist KEIN typischer Anwendungsbereich für Algorithmen im Kontext von KI-Systemen?',
        answers: {
            a: 'Spamfilter in E-Mail-Programmen',
            b: 'Empfehlungssysteme von Streaming-Diensten',
            c: 'Manuelle Sortierung von Briefen im Postamt',
            d: 'Navigations-Apps auf Smartphones'
        },
        correctAnswers: ['c'],
        explanation: 'Algorithmen sind im Kontext von KI-Systemen typischerweise in Software integriert, um automatisierte Aufgaben auszuführen. Die manuelle Sortierung von Briefen ist kein automatisierter Prozess.',
        source: 'Abschnitt I, Rz. 3.2, 3.89'
    },
    {
        question: 'Was ist algorithmische Diskriminierung?',
        answers: {
            a: 'Diskriminierung durch Menschen',
            b: 'Ungerechtfertigte Benachteiligung von Personen durch Algorithmen',
            c: 'Bevorzugung bestimmter Algorithmen',
            d: 'Das Fehlen von Algorithmen'
        },
        correctAnswers: ['b'],
        explanation: 'Algorithmische Diskriminierung bezieht sich auf die ungerechtfertigte Benachteiligung von Personen aufgrund des Einsatzes von Algorithmen.',
        source: 'Abschnitt IV, Rz. 3.44'
    },
    {
        question: 'Was sind Algorithmische Entscheidungssysteme (AES)?',
        answers: {
            a: 'Systeme, die ausschließlich Daten speichern',
            b: 'Systeme, die menschliche Entscheidungen immer ersetzen',
            c: 'Systeme, die Daten analysieren und Entscheidungen oder Empfehlungen ableiten',
            d: 'Systeme, die nur in der Finanzbranche eingesetzt werden'
        },
        correctAnswers: ['c'],
        explanation: 'AES erfassen, analysieren und interpretieren Daten und leiten daraus Entscheidungen oder Empfehlungen ab.',
        source: 'Abschnitt III, Rz. 3.37'
    },
    {
        question: 'Welche der folgenden Beispiele können Ursachen für algorithmische Diskriminierung sein?',
        answers: {
            a: 'Auswahl der Zielvariablen (zB Mitarbeitende mit geringen Fehlzeiten)',
            b: 'Objektivität der Trainingsdaten',
            c: 'Mangelnde Repräsentativität der Trainingsdaten',
            d: 'Hohe Transparenz von Algorithmen'
        },
        correctAnswers: ['a', 'c'],
        explanation: 'Die Auswahl der Zielvariablen und mangelnde Repräsentativität der Trainingsdaten können zu algorithmischer Diskriminierung führen.',
        source: 'Abschnitt IV, Rz. 3.50, 3.65'
    }
];

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

// Antwort prüfen
function checkAnswer() {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswers = [];
    const answerElements = document.querySelectorAll('input[name="answer"]');
    
    answerElements.forEach(answer => {
        if (answer.checked) {
            selectedAnswers.push(answer.value);
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
        const correctAnswers = [...currentQuestion.correctAnswers].sort();
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
    sourceElement.innerText = `Quelle: ${currentQuestion.source}`;
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
    let message, emoji;
    
    if (percentage >= 90) {
        message = 'Hervorragend! Du bist ein KI-Rechtsexpert!';
        emoji = '🏆';
    } else if (percentage >= 70) {
        message = 'Sehr gut! Du kennst dich mit KI und Recht gut aus!';
        emoji = '🎓';
    } else if (percentage >= 50) {
        message = 'Gut gemacht! Aber es gibt noch Raum für Verbesserung.';
        emoji = '👍';
    } else {
        message = 'Du solltest noch etwas mehr über KI und Recht lernen.';
        emoji = '📚';
    }
    
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

// Event-Listener für Buttons hinzufügen
submitButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', loadNextQuestion);

// Abbrechen-Button hinzufügen
addQuitButton();

// Quiz starten
loadQuestion();