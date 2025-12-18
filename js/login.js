/*
 * Login Authentication with Base64 Encoding (Academic Demo Only)
 * NOT for production use - server-side authentication required
 */

// Base64 encoded credentials (admin/admin123)
const ENCODED_USERNAME = "YWRtaW4=";
const ENCODED_PASSWORD = "YWRtaW4xMjM=";

// Session validation
if (sessionStorage.getItem("isAuthenticated") === "true") {
  const sessionToken = sessionStorage.getItem("sessionToken");
  if (sessionToken && validateSession(sessionToken)) {
    window.location.href = "dashboard.html";
  } else {
    clearSession();
  }
}

function validateSession(token) {
  try {
    const decoded = atob(token);
    const parts = decoded.split("|");
    if (parts.length !== 2) return false;

    const timestamp = parseInt(parts[1]);
    const now = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

    return now - timestamp < sessionDuration;
  } catch (e) {
    return false;
  }
}

function clearSession() {
  sessionStorage.removeItem("isAuthenticated");
  sessionStorage.removeItem("sessionToken");
  sessionStorage.removeItem("username");
}

function generateSessionToken(username) {
  const timestamp = Date.now();
  const tokenData = `${username}|${timestamp}`;
  return btoa(tokenData);
}

function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>'"&]/g, "")
    .substring(0, 50);
}

// DOM elements
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const loginButton = document.querySelector(".login-button");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// Brute force protection
let loginAttempts = 0;
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 30000; // 30 seconds
let isLockedOut = false;

// Form submission
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (isLockedOut) {
    showError("⏳ Too many attempts. Please wait before trying again.");
    return;
  }

  const username = sanitizeInput(usernameInput.value);
  const password = sanitizeInput(passwordInput.value);

  if (!username || !password) {
    showError("⚠️ Please enter both username and password.");
    return;
  }

  hideError();
  loginButton.classList.add("loading");

  setTimeout(() => {
    const encodedUserInput = btoa(username);
    const encodedPassInput = btoa(password);

    if (
      encodedUserInput === ENCODED_USERNAME &&
      encodedPassInput === ENCODED_PASSWORD
    ) {
      handleLoginSuccess(username);
    } else {
      handleLoginFailure();
    }
  }, 800);
});

function handleLoginSuccess(username) {
  loginAttempts = 0;

  sessionStorage.setItem("isAuthenticated", "true");
  sessionStorage.setItem("sessionToken", generateSessionToken(username));
  sessionStorage.setItem("username", btoa(username));

  loginButton.style.background =
    "linear-gradient(135deg, #10b981 0%, #059669 100%)";
  loginButton.classList.remove("loading");

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 400);
}

function handleLoginFailure() {
  loginAttempts++;
  loginButton.classList.remove("loading");

  if (loginAttempts >= MAX_ATTEMPTS) {
    isLockedOut = true;
    showError(`🔒 Account locked. Please wait 30 seconds.`);

    setTimeout(() => {
      isLockedOut = false;
      loginAttempts = 0;
      hideError();
    }, LOCKOUT_TIME);

    return;
  }

  const remaining = MAX_ATTEMPTS - loginAttempts;
  showError(
    `❌ Invalid credentials. ${remaining} attempt${
      remaining !== 1 ? "s" : ""
    } remaining.`
  );
  shakeInputs();
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
}

function hideError() {
  errorMessage.classList.remove("show");
}

function shakeInputs() {
  usernameInput.style.animation = "shake 0.4s ease";
  passwordInput.style.animation = "shake 0.4s ease";

  setTimeout(() => {
    usernameInput.style.animation = "";
    passwordInput.style.animation = "";
  }, 400);
}

// Clear error on input
usernameInput.addEventListener("input", hideError);
passwordInput.addEventListener("input", hideError);

// Security warning in console
console.log(
  "%c⚠️ Security Warning",
  "color: red; font-size: 20px; font-weight: bold;"
);
console.log(
  "%cThis is a demo application. Never enter real credentials.",
  "color: orange; font-size: 14px;"
);
console.log(
  "%cFor educational purposes only.",
  "color: gray; font-size: 12px;"
);
