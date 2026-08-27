const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
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
