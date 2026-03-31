const subjectTitles = {
    dbms: "Database Management Systems",
    oops: "Object Oriented Programming",
    os: "Operating Systems",
    cn: "Computer Networks",
    dsa: "Data Structures & Algorithms"
};

const welcomeScreen = document.getElementById('welcome-screen');
const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const userNameInput = document.getElementById('user-name-input');
const startBtn = document.getElementById('start-btn');
const displayName = document.getElementById('display-name');

const quizSubjectTitle = document.getElementById('quiz-subject-title');
const timeLeftEl = document.getElementById('time-left');
const timerBadge = document.querySelector('.timer-badge');
const quitBtn = document.getElementById('quit-btn');

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');

const scoreText = document.getElementById('score-text');
const performanceMessage = document.getElementById('performance-message');
const scoreCircle = document.querySelector('.score-circle');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');

let userName = 'User';
let currentSubject = '';
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
const TIME_LIMIT = 15;
let timeLeft = TIME_LIMIT;
let selectedOptionIndex = null;

function playSound(isCorrect) {
    try {
        const osc = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = osc.createOscillator();
        const gainNode = osc.createGain();
        
        oscillator.type = isCorrect ? 'sine' : 'sawtooth';
        oscillator.frequency.value = isCorrect ? 800 : 200;
        
        gainNode.gain.setValueAtTime(0.1, osc.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, osc.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(osc.destination);
        
        oscillator.start();
        oscillator.stop(osc.currentTime + 0.3);
    } catch(e) {
        console.log("Audio play failed");
    }
}

startBtn.addEventListener('click', () => {
    const name = userNameInput.value.trim();
    if (name) {
        userName = name;
        displayName.textContent = userName;
        switchScreen(homeScreen);
    } else {
        userNameInput.style.borderColor = 'var(--error)';
        setTimeout(() => userNameInput.style.borderColor = 'transparent', 1000);
    }
});

userNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startBtn.click();
});

document.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
        const subject = card.getAttribute('data-subject');
        startQuiz(subject);
    });
});

quitBtn.addEventListener('click', showHomeScreen);
homeBtn.addEventListener('click', showHomeScreen);

restartBtn.addEventListener('click', () => {
    startQuiz(currentSubject);
});

nextBtn.addEventListener('click', () => {
    if (selectedOptionIndex !== null || timeLeft === 0) {
        if (selectedOptionIndex === questions[currentQuestionIndex].answer) {
            score++;
        }
        
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResultScreen();
        }
    }
});

function startQuiz(subject) {
    currentSubject = subject;
    questions = questionBank[subject];
    currentQuestionIndex = 0;
    score = 0;

    quizSubjectTitle.textContent = subjectTitles[subject];
    
    switchScreen(quizScreen);
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    selectedOptionIndex = null;
    timeLeft = TIME_LIMIT;
    updateTimerDisplay();
    timerBadge.classList.remove('warning');
    
    nextBtn.disabled = true;
    nextBtn.textContent = 'Next Question ❯';

    const currentQuestion = questions[currentQuestionIndex];
    
    progressText.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;

    questionText.textContent = currentQuestion.q;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerHTML = `<span>${String.fromCharCode(65 + idx)}. ${opt}</span>`;
        btn.onclick = () => selectOption(idx, btn);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function selectOption(index, btnElement) {
    if (selectedOptionIndex !== null) return;
    
    clearInterval(timer);
    selectedOptionIndex = index;
    nextBtn.disabled = false;

    const isCorrect = index === questions[currentQuestionIndex].answer;
    playSound(isCorrect);
    
    const allOptions = optionsContainer.children;
    for (let i = 0; i < allOptions.length; i++) {
        allOptions[i].disabled = true;
        
        if (i === questions[currentQuestionIndex].answer) {
            allOptions[i].classList.add('correct');
            allOptions[i].innerHTML += ' <span>✅</span>';
        } else if (i === index && !isCorrect) {
            allOptions[i].classList.add('incorrect');
            allOptions[i].innerHTML += ' <span>❌</span>';
        }
    }
    
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = 'Show Results ★';
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 5) {
            timerBadge.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeOut();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timeLeftEl.textContent = timeLeft;
}

function handleTimeOut() {
    selectedOptionIndex = -1;
    nextBtn.disabled = false;
    
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = 'Show Results ★';
    }
    
    const allOptions = optionsContainer.children;
    for (let i = 0; i < allOptions.length; i++) {
        allOptions[i].disabled = true;
        if (i === questions[currentQuestionIndex].answer) {
            allOptions[i].classList.add('correct');
            allOptions[i].innerHTML += ' <span>✅</span>';
        }
    }
    
    playSound(false);
}

function showResultScreen() {
    progressBar.style.width = `100%`;
    
    setTimeout(() => {
        switchScreen(resultScreen);
        
        scoreText.textContent = `${score}/${questions.length}`;
        
        const percentage = (score / questions.length) * 100;
        let ringColor = 'var(--error)';
        
        if (percentage >= 80) {
            performanceMessage.textContent = `Excellent Job, ${userName}! You are ready for the interview! 🎉`;
            ringColor = 'var(--success)';
            triggerConfetti();
        } else if (percentage >= 50) {
            performanceMessage.textContent = `Good Effort, ${userName}! Review some concepts and you'll be great. 👍`;
            ringColor = 'var(--warning)';
        } else {
            performanceMessage.textContent = `Needs Improvement, ${userName}! Keep practicing those fundamentals. 📚`;
            ringColor = 'var(--error)';
        }
        
        scoreCircle.style.borderColor = ringColor;
        scoreCircle.style.color = ringColor;
    }, 500);
}

function showHomeScreen() {
    clearInterval(timer);
    switchScreen(homeScreen);
}

function switchScreen(activeScreen) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hide');
    });
    
    activeScreen.classList.remove('hide');
    activeScreen.classList.add('active');
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366F1', '#8B5CF6', '#10B981']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366F1', '#8B5CF6', '#10B981']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
}
