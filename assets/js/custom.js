document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const results = document.getElementById("formResults");
  const popup = document.getElementById("popupMessage");

  if (!form) {
    console.warn("Nerastas #contactForm HTML'e");
    return;
  }

  // --- Helperiai klaidoms ---
  function showError(input, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    const errorEl = input.parentElement.querySelector(".invalid-feedback");
    if (errorEl) errorEl.textContent = message || "";
  }

  function clearError(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    const errorEl = input.parentElement.querySelector(".invalid-feedback");
    if (errorEl) errorEl.textContent = "";
  }

  // --- Vardas / pavardė (tik raidės) ---
  function validateName(id, label) {
    const input = document.getElementById(id);
    const value = input.value.trim();

    if (!value) {
      showError(input, `${label} privalomas`);
      return false;
    }

    const nameRegex = /^[A-Za-zĀČĒĖĪŪŌŠŽąčęėįųūžÀ-ž\s'-]+$/;
    if (!nameRegex.test(value)) {
      showError(input, `${label} gali būti tik raidės`);
      return false;
    }

    clearError(input);
    return true;
  }

  // --- El. paštas ---
  function validateEmail() {
    const input = document.getElementById("email");
    const value = input.value.trim();

    if (!value) {
      showError(input, "El. paštas privalomas");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showError(input, "Neteisingas el. pašto formatas");
      return false;
    }

    clearError(input);
    return true;
  }

  // --- Adresas ---
  function validateAddress() {
    const input = document.getElementById("adresas");
    const value = input.value.trim();

    if (!value) {
      showError(input, "Adresas privalomas");
      return false;
    }

    if (value.length < 3) {
      showError(input, "Adresas per trumpas");
      return false;
    }

    clearError(input);
    return true;
  }

  // --- Įvertinimai 1–10 ---
  function validateScore(id, label) {
    const input = document.getElementById(id);
    const valueStr = input.value.trim();

    if (!valueStr) {
      showError(input, `${label} privalomas`);
      return false;
    }

    const value = Number(valueStr);
    if (Number.isNaN(value) || value < 1 || value > 10) {
      showError(input, `${label} turi būti tarp 1 ir 10`);
      return false;
    }

    clearError(input);
    return true;
  }

  // --- Telefonas: formatas +370 6xx xxxxx ---
  const telInput = document.getElementById("telefonas");

  function formatPhone() {
    let digits = telInput.value.replace(/\D/g, "");

    // leidžiam 86..., 3706..., 6...
    if (digits.startsWith("86")) {
      digits = "6" + digits.slice(2);
    } else if (digits.startsWith("3706")) {
      digits = "6" + digits.slice(4);
    }

    // priverčiam pradėt 6
    if (digits && digits[0] !== "6") {
      digits = "6" + digits.slice(1);
    }

    // max 8 skaitmenys: 6 + 7 skaičiai
    digits = digits.slice(0, 8);

    if (!digits) {
      telInput.value = "";
      return;
    }

    const first = digits[0];        // 6
    const nextTwo = digits.slice(1, 3); // xx
    const rest = digits.slice(3);       // xxxxx

    let formatted = `+370 ${first}`;
    if (nextTwo) formatted += nextTwo;
    if (rest) formatted += " " + rest;

    telInput.value = formatted;
  }

  function validatePhone() {
  const value = telInput.value.trim();

  // Tikras LT mobilaus regex formatas
  const ltPhoneRegex = /^\+370 6\d{2} \d{5}$/;

  if (!ltPhoneRegex.test(value)) {
    showError(telInput, "Telefonas turi būti formatu +370 6xx xxxxx");
    return false;
  }

  clearError(telInput);
  return true;
}


  // --- Bendra formos validacija ---
  function validateAll() {
    const okVardas = validateName("vardas", "Vardas");
    const okPavarde = validateName("pavarde", "Pavardė");
    const okEmail = validateEmail();
    const okAdresas = validateAddress();
    const okTel = validatePhone();
    const okK1 = validateScore("klausimas1", "Įvertinimas 1");
    const okK2 = validateScore("klausimas2", "Įvertinimas 2");
    const okK3 = validateScore("klausimas3", "Įvertinimas 3");

    return okVardas && okPavarde && okEmail && okAdresas && okTel && okK1 && okK2 && okK3;
  }

  function updateSubmitState() {
    const isValid = validateAll();
    submitBtn.disabled = !isValid;
  }

  // --- Event listeneriai realiu laiku ---
  document.getElementById("vardas").addEventListener("input", () => {
    validateName("vardas", "Vardas");
    updateSubmitState();
  });

  document.getElementById("pavarde").addEventListener("input", () => {
    validateName("pavarde", "Pavardė");
    updateSubmitState();
  });

  document.getElementById("email").addEventListener("input", () => {
    validateEmail();
    updateSubmitState();
  });

  document.getElementById("adresas").addEventListener("input", () => {
    validateAddress();
    updateSubmitState();
  });

  ["klausimas1", "klausimas2", "klausimas3"].forEach((id, index) => {
    const label = `Įvertinimas ${index + 1}`;
    document.getElementById(id).addEventListener("input", () => {
      validateScore(id, label);
      updateSubmitState();
    });
  });

  telInput.addEventListener("input", () => {
    formatPhone();
    validatePhone();
    updateSubmitState();
  });

  // --- Submit ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    const data = {
      vardas: document.getElementById("vardas").value.trim(),
      pavarde: document.getElementById("pavarde").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefonas: document.getElementById("telefonas").value.trim(),
      adresas: document.getElementById("adresas").value.trim(),
      klausimas1: Number(document.getElementById("klausimas1").value),
      klausimas2: Number(document.getElementById("klausimas2").value),
      klausimas3: Number(document.getElementById("klausimas3").value)
    };

    const vidurkis = (
      (data.klausimas1 + data.klausimas2 + data.klausimas3) / 3
    ).toFixed(2);

    console.log("Formos duomenys:", data);

    results.innerHTML = `
      <p><strong>Vardas:</strong> ${data.vardas}</p>
      <p><strong>Pavardė:</strong> ${data.pavarde}</p>
      <p><strong>El. paštas:</strong> ${data.email}</p>
      <p><strong>Telefonas:</strong> ${data.telefonas}</p>
      <p><strong>Adresas:</strong> ${data.adresas}</p>
      <p><strong>Įvertinimai:</strong> ${data.klausimas1}, ${data.klausimas2}, ${data.klausimas3}</p>
      <p><strong>${data.vardas} ${data.pavarde}:</strong> ${vidurkis}</p>
    `;

    // popup
    popup.style.display = "block";
    setTimeout(() => {
      popup.style.display = "none";
    }, 3000);
  });
});
// ================= MEMORY GAME =================
document.addEventListener("DOMContentLoaded", function () {
  const board = document.querySelector("#game-board");
  const difficultySelect = document.querySelector("#game-difficulty");
  const movesEl = document.querySelector("#moves-count");
  const matchesEl = document.querySelector("#matches-count");
  const startBtn = document.querySelector("#game-start");
  const resetBtn = document.querySelector("#game-reset");
  const msgEl = document.querySelector("#game-message");

  const timerEl = document.querySelector("#timer-display");
  const bestEasyEl = document.querySelector("#best-easy");
  const bestMediumEl = document.querySelector("#best-medium");
  const bestHardEl = document.querySelector("#best-hard");

  if (!board) return; // jeigu puslapyje nėra žaidimo sekcijos

  const symbols = ["⚙️", "🔧", "📊", "🔌", "🤖", "📈", "🧪", "💾", "🔩", "📡", "🛠️", "💡"];

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;
  let totalPairs = 0;
  let gameStarted = false;

  // laikmatis
  let timer = 0;          // sekundėmis
  let timerInterval = null;

  // ---------- PAGALBINĖS FUNKCIJOS ----------

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

function getConfig(level) {
  switch (level) {
    case "hard":
      return { cols: 6, pairs: 12 };  // 6x4 = 24 kortelės
    default:
      return { cols: 4, pairs: 6 };   // 4x3 = 12 kortelių
  }
}


  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function startTimer() {
    stopTimer();
    timer = 0;
    timerEl.textContent = formatTime(timer);
    timerInterval = setInterval(() => {
      timer++;
      timerEl.textContent = formatTime(timer);
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // ---------- LOCALSTORAGE – REKORDAI ----------

  function lsKeyFor(level) {
    return `memoryBest_${level}`;
  }

  function loadBestScores() {
    const easy = localStorage.getItem(lsKeyFor("easy"));
    const medium = localStorage.getItem(lsKeyFor("medium"));
    const hard = localStorage.getItem(lsKeyFor("hard"));

    bestEasyEl.textContent = easy ? easy : "-";
    bestMediumEl.textContent = medium ? medium : "-";
    bestHardEl.textContent = hard ? hard : "-";
  }

  function updateBestScoreIfNeeded(level, currentMoves) {
    const key = lsKeyFor(level);
    const stored = localStorage.getItem(key);
    const best = stored ? parseInt(stored, 10) : null;

    if (best === null || currentMoves < best) {
      localStorage.setItem(key, String(currentMoves));
      loadBestScores(); // atnaujinti rodymą

      showSuccess(
        `Sveikinimai! Naujas rekordas (${level}) – ${currentMoves} ėjimai 🎉`
      );
    } else {
      showSuccess(
        `Sveikinimai! Laimėjai per ${currentMoves} ėjimų. Dabartinis rekordas (${level}) – ${best} ėjimai.`
      );
    }
  }

  // ---------- LENTOS KŪRIMAS ----------

  function buildBoard() {
    const { cols, pairs } = getConfig(difficultySelect.value);
    totalPairs = pairs;

    board.innerHTML = "";
    board.style.setProperty("--cols", cols);

    const values = shuffle(
      symbols.slice(0, pairs).flatMap((v) => [v, v])
    );

    values.forEach((val) => {
      const card = document.createElement("button");
      card.className = "memory-card";
      card.type = "button";
      card.dataset.value = val;

      const inner = document.createElement("div");
      inner.className = "memory-card-inner";

      const front = document.createElement("div");
      front.className = "memory-face front";
      front.textContent = "?";

      const back = document.createElement("div");
      back.className = "memory-face back";
      back.textContent = val;

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      card.addEventListener("click", onCardClick);
      board.appendChild(card);
    });

    resetStats();
  }

  function resetStats() {
    moves = 0;
    matches = 0;
    movesEl.textContent = moves;
    matchesEl.textContent = `${matches} / ${totalPairs}`;
    msgEl.textContent = "";
    msgEl.className = "game-message";
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    stopTimer();
    timer = 0;
    timerEl.textContent = formatTime(timer);
  }

  // ---------- ŽAIDIMO LOGIKA ----------

  function onCardClick(e) {
    if (!gameStarted) {
      showInfo("Paspausk „Start“, kad pradėtum žaidimą.");
      return;
    }

    if (lockBoard) return;

    const card = e.currentTarget;

    // jei jau apversta / sutapusi – ignoruojam
    if (card.classList.contains("is-flipped") || card.classList.contains("is-matched")) {
      return;
    }

    card.classList.add("is-flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;
    moves++;
    movesEl.textContent = moves;

    checkMatch();
  }

  function checkMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
      firstCard.classList.add("is-matched");
      secondCard.classList.add("is-matched");
      matches++;
      matchesEl.textContent = `${matches} / ${totalPairs}`;
      resetTurn();

      if (matches === totalPairs) {
        gameStarted = false;
        stopTimer();
        const level = difficultySelect.value;
        updateBestScoreIfNeeded(level, moves);
      }
    } else {
      setTimeout(() => {
        firstCard.classList.remove("is-flipped");
        secondCard.classList.remove("is-flipped");
        resetTurn();
      }, 800);
    }
  }

  function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function showSuccess(text) {
    msgEl.textContent = text;
    msgEl.className = "game-message success";
  }

  function showInfo(text) {
    msgEl.textContent = text;
    msgEl.className = "game-message info";
  }

  // ---------- MYGTUKAI ----------

  startBtn.addEventListener("click", () => {
    buildBoard();
    gameStarted = true;
    startTimer();
    showInfo("Žaidimas pradėtas. Sėkmės!");
  });

  resetBtn.addEventListener("click", () => {
    buildBoard();
    gameStarted = false;
    showInfo("Lenta atnaujinta. Paspausk „Start“, kad pradėtum.");
  });

  difficultySelect.addEventListener("change", () => {
    buildBoard();
    gameStarted = false;
    showInfo("Pasirinktas naujas lygis. Paspausk „Start“, kad pradėtum.");
  });

  // ---------- INIT ----------

  loadBestScores(); // užkraunam rekordus iš localStorage
  buildBoard();     // sugeneruojam pradinę lentą
  timerEl.textContent = formatTime(0);
});
