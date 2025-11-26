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
