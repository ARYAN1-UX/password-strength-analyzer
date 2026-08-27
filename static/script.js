const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const generatePasswordButton = document.getElementById("generatePassword");
const suggestPasswordButton = document.getElementById("suggestPassword");
const actionStatus = document.getElementById("actionStatus");
const strengthBar = document.getElementById("strengthBar");
const strengthLabel = document.getElementById("strengthLabel");
const scoreText = document.getElementById("scoreText");
const lengthText = document.getElementById("lengthText");

const checks = {
    length: password => password.length >= 12,
    lower: password => /[a-z]/.test(password),
    upper: password => /[A-Z]/.test(password),
    number: password => /\d/.test(password),
    symbol: password => /[^A-Za-z0-9]/.test(password)
};

const levels = [
    { name: "Very weak", color: "#d85c5c" },
    { name: "Weak", color: "#e38b52" },
    { name: "Fair", color: "#d5ad43" },
    { name: "Strong", color: "#5c9b72" },
    { name: "Excellent", color: "#267a65" }
];

const passwordCharacters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
const suggestionWords = ["amber", "canyon", "cedar", "comet", "dawn", "falcon", "harbor", "meadow", "orbit", "pebble", "raven", "silver", "summit", "tiger", "willow"];

function randomIndex(maximum) {
    if (window.crypto && window.crypto.getRandomValues) {
        const values = new Uint32Array(1);
        window.crypto.getRandomValues(values);
        return values[0] % maximum;
    }
    return Math.floor(Math.random() * maximum);
}

function createGeneratedPassword() {
    const characters = ["A", "a", "2", "!", ...Array.from({ length: 16 }, () => passwordCharacters[randomIndex(passwordCharacters.length)])];
    for (let index = characters.length - 1; index > 0; index -= 1) {
        const swapIndex = randomIndex(index + 1);
        [characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]];
    }
    return characters.join("");
}

function createSuggestedPassword() {
    const words = Array.from({ length: 4 }, () => suggestionWords[randomIndex(suggestionWords.length)]);
    words[0] = `${words[0][0].toUpperCase()}${words[0].slice(1)}`;
    return `${words.join("-")}-${randomIndex(90) + 10}!`;
}

function useNewPassword(password, message) {
    passwordInput.value = password;
    passwordInput.type = "text";
    togglePassword.textContent = "Hide";
    actionStatus.textContent = message;
    analyzePassword();
}

function analyzePassword() {
    const password = passwordInput.value;
    const passed = Object.entries(checks).filter(([, test]) => test(password)).map(([name]) => name);
    const score = password.length === 0 ? 0 : Math.min(passed.length, 5);
    const level = password.length === 0 ? { name: "Waiting", color: "#c8d0cc" } : levels[Math.max(score - 1, 0)];
    strengthBar.style.width = `${score * 20}%`;
    strengthBar.style.backgroundColor = level.color;
    strengthLabel.textContent = level.name;
    strengthLabel.style.color = level.color;
    scoreText.textContent = password.length === 0 ? "Start typing to see your score" : `${score} of 5 recommendations met`;
    lengthText.textContent = `${password.length} ${password.length === 1 ? "character" : "characters"}`;
    Object.keys(checks).forEach(name => {
        const check = document.querySelector(`[data-check="${name}"]`);
        const passedCheck = passed.includes(name);
        check.classList.toggle("passed", passedCheck);
        check.querySelector(".check-icon").textContent = passedCheck ? "OK" : "-";
    });
}

passwordInput.addEventListener("input", analyzePassword);
togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Hide" : "Show";
});

generatePasswordButton.addEventListener("click", () => {
    useNewPassword(createGeneratedPassword(), "A strong password was generated locally.");
});

suggestPasswordButton.addEventListener("click", () => {
    useNewPassword(createSuggestedPassword(), "A memorable password was suggested locally.");
});