let data = [];
let current = 0;
let showAnswer = false;

let timeLeft = 10;
let timerInterval = null;
let timeUp = false;

let score = 0;

const rootStyles = getComputedStyle(document.documentElement);
const negativeColor = rootStyles.getPropertyValue('--negative-color');

// wczytanie JSON
window.onload = () => {
  fetch('literal.json')
    .then(res => res.json())
    .then(json => {
      data = json;
      loadQuestion();
    })
    .catch(err => {
      console.error("Błąd wczytywania JSON:", err);
    });
};

// ⏱️ TIMER
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 10;
  timeUp = false;

  const timerEl = document.getElementById("question-timer");


  function updateTimer() {
    if (!timerEl) return;

    timerEl.textContent = timeLeft + "s";

    if (timeLeft <= 3) {
  timerEl.style.color = negativeColor;
} else {
  timerEl.style.color = "";
}
  }

  updateTimer();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp = true;

      // 👉 ZAMIANA NA "Sprawdź odpowiedź"
      showCheckAnswerScreen();
    }
  }, 1000);
}

// 🟡 ekran po czasie
function showCheckAnswerScreen() {
  document.getElementById('literal').innerHTML = `
    <h1 class="ibm-plex-mono-medium reveal-text">
      ⏳ Czas minął
    </h1>
    <p class="reveal-text-delayed ibm-plex-mono-medium">
      Sprawdź odpowiedź
    </p>
  `;

  document.querySelector('footer').innerHTML = `
    <div class="round-btn" id="question-timer"></div>
    <div id="question-counter">Pytanie ${current + 1} / ${data.length}</div>
    <div class="round-btn" onclick="showSolution()">Odpowiedź</div>
  `;

  // pokazujemy timer (zamrożony lub restart opcjonalny)
  document.getElementById("question-timer").textContent = "0s";
}

// 📌 pytanie
function loadQuestion() {
  showAnswer = false;

  const item = data[current];

  document.getElementById('literal').innerHTML = `
    <h1 class="ibm-plex-mono-medium reveal-text">
      ${item.literal} <span class="emoji">${String.fromCodePoint(item["emoji-dec"])}</span>
    </h1>
  `;

  document.querySelector('footer').innerHTML = `
    <div class="round-btn" id="question-timer"></div>
    <div id="question-counter">Pytanie ${current + 1} / ${data.length}</div>
    <div class="round-btn" onclick="showSolution()">Odpowiedź</div>
  `;

  startTimer();
}

// 📖 pokazanie odpowiedzi
function showSolution() {
  clearInterval(timerInterval);

  const item = data[current];

  document.getElementById('literal').innerHTML = `
    <h1 class="ibm-plex-mono-medium reveal-text">
      ${item.original}
    </h1>
    <p id="explanation" class="reveal-text-delayed ibm-plex-mono-medium">
      ${item.explanation_en}
    </p>
  `;

  document.querySelector('footer').innerHTML = `
    <div class="round-btn negative" onclick="nextQuestion()">Źle</div>
    <div id="question-counter">Pytanie ${current + 1} / ${data.length}</div>
    <div class="round-btn positive" onclick="addPointAndNext()">Dobrze</div>
  `;
}

function addPointAndNext() {
  score++;
  nextQuestion();
}

// ➡️ następne pytanie
function nextQuestion() {
  clearInterval(timerInterval);

  current++;

  if (current >= data.length) {
    showFinalScore();
    return;
  }

  loadQuestion();
}
function showFinalScore() {
  document.getElementById('literal').innerHTML = `
    <h1 class="ibm-plex-mono-medium reveal-text">
      🎉 Koniec quizu
    </h1>
    <p class="ibm-plex-mono-medium">
      Twój wynik: <strong>${score} / ${data.length}</strong>
    </p>
  `;

  document.querySelector('footer').innerHTML = `
    <div class="round-btn" onclick="restartQuiz()">Zagraj ponownie</div>
  `;
}
function restartQuiz() {
  current = 0;
  score = 0;
  loadQuestion();
}