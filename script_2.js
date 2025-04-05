const quizTitle = document.getElementById('quiz-title');
const progress = document.getElementById('progress');
const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers-container');
const nextButton = document.getElementById('next-button');
const submitButton = document.getElementById('submit-button');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackElement = document.getElementById('feedback');
const explanationElement = document.getElementById('explanation');
// Removing the sourceElement reference
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const questionContainer = document.getElementById('question-container');
const buttonContainer = document.getElementById('button-container');
const scoreContainer = document.getElementById('score-container');

let currentQuestionIndex = 0;
let score = 0;
let askedQuestions = [];

// Überprüfen, ob es bereits einen gespeicherten Fragenstatus gibt
if (localStorage.getItem('askedQuestions')) {
    try {
        askedQuestions = JSON.parse(localStorage.getItem('askedQuestions'));
    } catch (e) {
        console.error("Fehler beim Laden der gestellten Fragen:", e);
        askedQuestions = [];
    }
}

// Original HTML-Template für den Button-Container speichern
const originalButtonContainerHTML = buttonContainer.innerHTML;

// Original HTML-Template für den Score-Container speichern
const originalScoreContainerHTML = scoreContainer.innerHTML;

// Alle verfügbaren Fragen
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
        explanation: 'KI-Systeme zur Personalauswahl gelten als Hochrisiko-KI-Systeme, da sie wesentlichen Einfluss auf den Zugang zu Beschäftigung haben können.'
        // Removed the source property
    },
    {
        question: 'Was versteht man unter "Prompt Engineering" im Zusammenhang mit generativer KI?',
        answers: {
            a: 'Die technische Überprüfung von KI-Systemen',
            b: 'Die Kunst, effektive Anweisungen zu formulieren, um gewünschte Ergebnisse von KI-Systemen zu erhalten',
            c: 'Die Programmierung von KI-Algorithmen',
            d: 'Die Erstellung von Trainingsdaten für KI-Systeme'
        },
        correctAnswers: ['b'],
        explanation: 'Prompt Engineering bezeichnet die Entwicklung und Optimierung von Anweisungen (Prompts), um bessere Ergebnisse von generativen KI-Modellen zu erhalten.'
        // Removed the source property
    },
    {
        question: 'Welche Rechte haben Arbeitnehmende bei automatisierten Entscheidungen gemäß DSGVO?',
        answers: {
            a: 'Recht auf Information über die Logik',
            b: 'Recht auf menschliche Überprüfung',
            c: 'Recht auf Löschung der Entscheidung',
            d: 'Recht auf Mitbestimmung bei der Programmierung'
        },
        correctAnswers: ['a', 'b'],
        explanation: 'Gemäß DSGVO haben Personen bei automatisierten Entscheidungen das Recht auf Information über die involvierte Logik sowie das Recht auf menschliche Überprüfung der Entscheidung.'
        // Removed the source property
    },
    {
        question: 'Was ist das "Black Box"-Problem bei KI-Systemen?',
        answers: {
            a: 'KI-Systeme können nicht in hellen Räumen betrieben werden',
            b: 'Die mangelnde Möglichkeit, Entscheidungsprozesse von KI-Systemen nachzuvollziehen',
            c: 'Sicherheitsprobleme bei der Hardware-Umgebung',
            d: 'Farbliche Gestaltung von KI-Interfaces'
        },
        correctAnswers: ['b'],
        explanation: 'Das "Black Box"-Problem bezieht sich auf die Schwierigkeit, die internen Entscheidungsprozesse komplexer KI-Systeme zu verstehen und nachzuvollziehen.'
        // Removed the source property
    },
    {
        question: 'Welche Maßnahmen können algorithmische Diskriminierung reduzieren?',
        answers: {
            a: 'Einsatz von diverseren Trainingsdaten',
            b: 'Transparente Dokumentation der Entwicklung',
            c: 'Regelmäßige Überprüfung auf diskriminierende Auswirkungen',
            d: 'Komplette Vermeidung von KI-Systemen'
        },
        correctAnswers: ['a', 'b', 'c'],
        explanation: 'Maßnahmen zur Reduzierung algorithmischer Diskriminierung umfassen diversere Trainingsdaten, Transparenz und regelmäßige Überprüfungen.'
        // Removed the source property
    },
    {
        question: 'Was ist der Unterschied zwischen "Supervised Learning" und "Unsupervised Learning"?',
        answers: {
            a: 'Supervised Learning benötigt gekennzeichnete Trainingsdaten',
            b: 'Unsupervised Learning findet selbstständig Muster in Daten',
            c: 'Supervised Learning wird von Menschen überwacht',
            d: 'Unsupervised Learning ist weniger rechenintensiv'
        },
        correctAnswers: ['a', 'b'],
        explanation: 'Supervised Learning verwendet gekennzeichnete Trainingsdaten mit Lösungen, während Unsupervised Learning selbstständig Muster in nicht gekennzeichneten Daten erkennt.'
        // Removed the source property
    },
    {
        question: 'Welche Rolle spielt der Betriebsrat bei der Einführung von KI-Systemen am Arbeitsplatz?',
        answers: {
            a: 'Der Betriebsrat hat kein Mitbestimmungsrecht bei KI-Systemen',
            b: 'Der Betriebsrat hat Mitbestimmungsrechte bei technischen Einrichtungen zur Leistungs- oder Verhaltenskontrolle',
            c: 'Der Betriebsrat kann KI-Systeme eigenständig programmieren',
            d: 'Der Betriebsrat muss über die Einführung informiert werden'
        },
        correctAnswers: ['b', 'd'],
        explanation: 'Der Betriebsrat hat Mitbestimmungsrechte bei technischen Einrichtungen zur Leistungs- oder Verhaltenskontrolle und muss über die Einführung von KI-Systemen informiert werden.'
        // Removed the source property
    },
    {
        question: 'Was ist "überwachtes maschinelles Lernen" (supervised learning)?',
        answers: {
            a: 'Lernen durch menschliche Aufsicht während des Betriebs',
            b: 'Lernen aus gekennzeichneten Trainingsdaten',
            c: 'Lernen durch Überwachungskameras',
            d: 'Lernen durch ständige Leistungskontrolle'
        },
        correctAnswers: ['b'],
        explanation: 'Beim überwachten maschinellen Lernen wird das System mit gekennzeichneten Trainingsdaten trainiert, bei denen die gewünschten Ausgaben bereits bekannt sind.'
        // Removed the source property
    },
    {
        question: 'Was versteht man unter "Explainable AI" (XAI)?',
        answers: {
            a: 'Eine KI, die sich selbst erklären kann',
            b: 'Ansätze zur besseren Nachvollziehbarkeit von KI-Entscheidungen',
            c: 'Eine besonders schnelle Form von KI',
            d: 'Verfahren zur Verschlüsselung von KI-Algorithmen'
        },
        correctAnswers: ['b'],
        explanation: 'Explainable AI (XAI) umfasst Methoden und Techniken, die darauf abzielen, die Entscheidungen und Ergebnisse von KI-Systemen für Menschen verständlich und nachvollziehbar zu machen.'
        // Removed the source property
    },
    {
        question: 'Welche der folgenden Aussagen zum Thema "KI am Arbeitsplatz" ist korrekt?',
        answers: {
            a: 'Arbeitgeber dürfen KI-Systeme ohne Einschränkungen zur Überwachung einsetzen',
            b: 'KI-Systeme können arbeitsrechtliche Entscheidungen vollständig automatisieren',
            c: 'KI-Systeme zur Leistungsüberwachung unterliegen der Mitbestimmung des Betriebsrats',
            d: 'Mitarbeitende haben kein Recht auf Informationen über eingesetzte KI-Systeme'
        },
        correctAnswers: ['c'],
        explanation: 'KI-Systeme zur Leistungsüberwachung unterliegen als technische Einrichtungen zur Leistungs- oder Verhaltenskontrolle der Mitbestimmung des Betriebsrats.'
        // Removed the source property
    },
    {
        question: 'Was sind "Large Language Models" (LLMs)?',
        answers: {
            a: 'Sehr große physische Modelle von Sprachproduktionssystemen',
            b: 'Umfangreiche Wörterbücher für die maschinelle Übersetzung',
            c: 'KI-Modelle, die auf großen Textkorpora trainiert wurden und natürliche Sprache verarbeiten können',
            d: 'Sprachschulungsunterlagen für internationale Unternehmen'
        },
        correctAnswers: ['c'],
        explanation: 'Large Language Models sind KI-Systeme, die auf umfangreichen Textdaten trainiert wurden und verschiedene sprachbezogene Aufgaben wie Textgenerierung, Übersetzung oder Frage-Antwort durchführen können.'
        // Removed the source property
    },
    {
        question: 'Was bezeichnet man als "Artificial General Intelligence" (AGI)?',
        answers: {
            a: 'Jede Form künstlicher Intelligenz',
            b: 'Eine hypothetische KI mit menschenähnlichen kognitiven Fähigkeiten',
            c: 'KI-Systeme, die nur allgemeine Antworten geben können',
            d: 'Eine KI, die ausschließlich für militärische Zwecke eingesetzt wird'
        },
        correctAnswers: ['b'],
        explanation: 'Als Artificial General Intelligence bezeichnet man eine hypothetische Form der KI, die menschenähnliche allgemeine kognitive Fähigkeiten besitzt und verschiedenste Aufgaben lösen kann.'
        // Removed the source property
    },
    {
        question: 'Welche der folgenden Aussagen zur Datenqualität bei KI-Systemen ist richtig?',
        answers: {
            a: 'Die Qualität der Trainingsdaten hat keinen Einfluss auf die Ergebnisse',
            b: 'Mehr Daten führen automatisch zu besseren Ergebnissen',
            c: 'Die Qualität und Repräsentativität der Trainingsdaten beeinflusst direkt die Qualität und Fairness der Ergebnisse',
            d: 'Hochrisiko-KI-Systeme benötigen laut KI-VO keine Anforderungen an die Datenqualität'
        },
        correctAnswers: ['c'],
        explanation: 'Die Qualität und Repräsentativität der Trainingsdaten hat direkten Einfluss auf die Qualität und Fairness der Ergebnisse von KI-Systemen.'
        // Removed the source property
    },
    {
        question: 'Was bedeutet der Begriff "Feedforward Neural Network"?',
        answers: {
            a: 'Ein neuronales Netz, das Feedback von Nutzern verarbeitet',
            b: 'Ein neuronales Netz, bei dem Informationen nur in eine Richtung fließen',
            c: 'Ein neuronales Netz zur Vorhersage von Fütterungszeiten in der Landwirtschaft',
            d: 'Ein Netzwerk zur Übermittlung von Nutzerfeedback'
        },
        correctAnswers: ['b'],
        explanation: 'Ein Feedforward Neural Network ist ein künstliches neuronales Netz, bei dem Informationen nur in eine Richtung fließen - vom Eingang durch versteckte Schichten zum Ausgang, ohne Rückkopplungsschleifen.'
        // Removed the source property
    },
    {
        question: 'Welche Maßnahmen fordert die KI-VO zur Transparenz von KI-Systemen?',
        answers: {
            a: 'Offenlegung des vollständigen Quellcodes',
            b: 'Kennzeichnungspflicht für KI-generierte Inhalte',
            c: 'Informationspflichten über die Verwendung von KI-Systemen',
            d: 'Veröffentlichung aller Trainingsdaten'
        },
        correctAnswers: ['b', 'c'],
        explanation: 'Die KI-VO fordert unter anderem Transparenzmaßnahmen wie die Kennzeichnung KI-generierter Inhalte und Informationspflichten über den Einsatz von KI-Systemen.'
        // Removed the source property
    },
    {
        question: 'Was versteht man unter dem "Recht auf Vergessen" im Kontext der DSGVO?',
        answers: {
            a: 'Das Recht, bestimmte Erinnerungen zu vergessen',
            b: 'Das Recht auf Löschung personenbezogener Daten',
            c: 'Das Recht, von KI-Systemen vergessen zu werden',
            d: 'Das Recht, frühere Fehler nicht mehr erwähnen zu müssen'
        },
        correctAnswers: ['b'],
        explanation: 'Das "Recht auf Vergessen" (Art. 17 DSGVO) bezeichnet das Recht betroffener Personen, die Löschung ihrer personenbezogenen Daten zu verlangen, wenn bestimmte Voraussetzungen erfüllt sind.'
        // Removed the source property
    },
    {
        question: 'Welche der folgenden Datenschutzgrundsätze sind bei KI-Systemen besonders relevant?',
        answers: {
            a: 'Datenminimierung',
            b: 'Zweckbindung',
            c: 'Datensicherheit',
            d: 'Transparenz'
        },
        correctAnswers: ['a', 'b', 'c', 'd'],
        explanation: 'Bei KI-Systemen sind alle genannten Datenschutzgrundsätze besonders relevant: Datenminimierung, Zweckbindung, Datensicherheit und Transparenz.'
        // Removed the source property
    },
    {
        question: 'Was ist ein "Genauigkeits-Fairness-Tradeoff" bei KI-Systemen?',
        answers: {
            a: 'Der Konflikt zwischen Genauigkeit und Fairness eines KI-Systems',
            b: 'Eine Methode zur gleichzeitigen Optimierung von Genauigkeit und Fairness',
            c: 'Ein Vertrag zwischen Entwicklern und Nutzern',
            d: 'Eine spezielle Form der Qualitätskontrolle'
        },
        correctAnswers: ['a'],
        explanation: 'Der Genauigkeits-Fairness-Tradeoff beschreibt das Phänomen, dass Maßnahmen zur Erhöhung der Fairness eines KI-Systems oft zu einer Verringerung der Genauigkeit führen können und umgekehrt.'
        // Removed the source property
    },
    {
        question: 'Die KI-VO zielt darauf ab, einen einheitlichen Rechtsrahmen zu schaffen und die Einführung von vertrauenswürdiger KI zu fördern.',
        answers: {
            a: 'risikobasierten Ansatz',
            b: 'pauschalen Ansatz',
            c: 'vorsorgenden Ansatz',
            d: 'innovationsfreundlichen Ansatz'
        },
        correctAnswers: ['a'],
        explanation: 'Die KI-VO verfolgt einen risikobasierten Ansatz.'
        // Removed the source property
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
        explanation: 'Ein Algorithmus ist eine eindeutig definierte Folge von Anweisungen, um ein bestimmtes Problem zu lösen.'
        // Removed the source property
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
        explanation: 'Historischer Bias bezieht sich auf Verzerrungen in Daten, die Ungleichheiten aus der Vergangenheit widerspiegeln.'
        // Removed the source property
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
        explanation: 'Die KI-VO verbietet bestimmte Praktiken wie die biometrische Kategorisierung zur Feststellung der ethnischen Zugehörigkeit und "predictive policing".'
        // Removed the source property
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
        explanation: 'AES können die Effizienz steigern und zu objektiveren Entscheidungen beitragen.'
        // Removed the source property
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
        explanation: 'Algorithmen sind im Kontext von KI-Systemen typischerweise in Software integriert, um automatisierte Aufgaben auszuführen. Die manuelle Sortierung von Briefen ist kein automatisierter Prozess.'
        // Removed the source property
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
        explanation: 'Algorithmische Diskriminierung bezieht sich auf die ungerechtfertigte Benachteiligung von Personen aufgrund des Einsatzes von Algorithmen.'
        // Removed the source property
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
        explanation: 'AES erfassen, analysieren und interpretieren Daten und leiten daraus Entscheidungen oder Empfehlungen ab.'
        // Removed the source property
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
        explanation: 'Die Auswahl der Zielvariablen und mangelnde Repräsentativität der Trainingsdaten können zu algorithmischer Diskriminierung führen.'
        // Removed the source property
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

// Wählt 10 Fragen aus, die noch nicht gestellt wurden
function selectQuestions() {
    // Kopie aller Fragen erstellen
    let availableQuestions = [...allQuestions];
    
    // Bereits gestellte Fragen filtern
    if (askedQuestions.length > 0) {
        availableQuestions = availableQuestions.filter(
            (_, index) => !askedQuestions.includes(index)
        );
    }
    
    // Wenn nicht genügend neue Fragen verfügbar sind, alle Fragen zurücksetzen
    if (availableQuestions.length < 10) {
        console.log("Nicht genügend neue Fragen, alle Fragen werden zurückgesetzt");
        askedQuestions = [];
        availableQuestions = [...allQuestions];
    }
    
    // Zufällig 10 Fragen auswählen
    const selectedQuestions = [];
    const indices = [];
    
    while (selectedQuestions.length < 10 && availableQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const originalIndex = allQuestions.indexOf(availableQuestions[randomIndex]);
        
        selectedQuestions.push(availableQuestions[randomIndex]);
        indices.push(originalIndex);
        
        // Aus den verfügbaren Fragen entfernen
        availableQuestions.splice(randomIndex, 1);
    }
    
    // Indizes zu askedQuestions hinzufügen
    askedQuestions = [...askedQuestions, ...indices];
    
    return selectedQuestions;
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
    // Removed the line that sets the sourceElement text
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
        message = 'Hervorragend! Du bist ein/eine Experte/Expertin für KI und Recht!';
        emoji = '🏆';
    } else if (percentage >= 70) {
        message = 'Sehr gut! Du kennst dich mit KI und Recht gut aus!';
        emoji = '🎓';
    } else if (percentage >= 50) {
        message = 'Gut gemacht! Aber es gibt noch Luft nach oben.';
        emoji = '👍';
    } else {
        message = 'Du solltest noch etwas mehr über KI und Recht lernen. 😉';
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

// Quiz neustarten mit neuen Fragen
function restartQuiz() {
    // Entferne alle Konfetti-Elemente, falls vorhanden
    const confetti = document.querySelector('.confetti-container');
    if (confetti && document.body.contains(confetti)) {
        document.body.removeChild(confetti);
    }
    
    // Speichere die bisher gestellten Fragen im localStorage
    localStorage.setItem('askedQuestions', JSON.stringify(askedQuestions));
    
    // Die Seite neu laden
    window.location.reload();
}

// Event-Listener für Buttons hinzufügen
submitButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', loadNextQuestion);

// Abbrechen-Button hinzufügen
addQuitButton();

// 10 Fragen auswählen und Quiz starten
const questions = selectQuestions();
loadQuestion();