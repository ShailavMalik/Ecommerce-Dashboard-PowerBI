/**
 * ============================================================
 * SALES STORE DASHBOARD - Login Authentication Script
 * ============================================================
 *
 * SECURITY NOTICE:
 * This is BASIC OBFUSCATION for ACADEMIC/DEMO purposes only.
 * Base64 encoding is NOT encryption - it can be easily decoded.
 *
 * For production applications, always use:
 * - Server-side authentication
 * - Proper password hashing (bcrypt, argon2)
 * - HTTPS connections
 * - JWT or session tokens
 * - Rate limiting and brute force protection
 *
 * This implementation demonstrates basic client-side security
 * concepts without using any external libraries or backend.
 * ============================================================
 */

// ============================================================
// ENCODED CREDENTIALS (Base64 obfuscation - NOT secure storage)
// ============================================================
// Original: username = "admin", password = "admin123"
// These are Base64 encoded to avoid plain text storage
const ENCODED_USERNAME = "YWRtaW4="; // btoa("admin")
const ENCODED_PASSWORD = "YWRtaW4xMjM="; // btoa("admin123")

// ============================================================
// SESSION MANAGEMENT
// ============================================================
// Check if user is already logged in via sessionStorage
// sessionStorage is cleared when browser tab is closed (more secure than localStorage)
if (sessionStorage.getItem("isAuthenticated") === "true") {
  // Validate session hasn't been tampered with
  const sessionToken = sessionStorage.getItem("sessionToken");
  if (sessionToken && validateSession(sessionToken)) {
    window.location.href = "dashboard.html";
  } else {
    // Invalid session - clear and stay on login
    clearSession();
  }
}

/**
 * Validates the session token (basic check)
 * In production, this would verify against a server
 */
function validateSession(token) {
  // Basic validation - check token format and timestamp
  try {
    const decoded = atob(token);
    const parts = decoded.split("|");
    if (parts.length !== 2) return false;

    const timestamp = parseInt(parts[1]);
    const now = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

    // Check if session is still valid
    return now - timestamp < sessionDuration;
  } catch (e) {
    return false;
  }
}

/**
 * Clears all session data
 */
function clearSession() {
  sessionStorage.removeItem("isAuthenticated");
  sessionStorage.removeItem("sessionToken");
  sessionStorage.removeItem("username");
}

/**
 * Generates a simple session token
 * NOTE: This is NOT cryptographically secure
 */
function generateSessionToken(username) {
  const timestamp = Date.now();
  const tokenData = `${username}|${timestamp}`;
  return btoa(tokenData);
}

/**
 * Sanitizes user input to prevent basic XSS
 * Removes potentially dangerous characters
 */
function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>'"&]/g, "") // Remove dangerous characters
    .substring(0, 50); // Limit length
}

// ============================================================
// DOM ELEMENTS
// ============================================================
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const loginButton = document.querySelector(".login-button");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// ============================================================
// LOGIN ATTEMPT TRACKING (Basic brute force protection)
// ============================================================
let loginAttempts = 0;
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 30000; // 30 seconds
let isLockedOut = false;

// ============================================================
// FORM SUBMISSION HANDLER
// ============================================================
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Check for lockout
  if (isLockedOut) {
    showError("⏳ Too many attempts. Please wait before trying again.");
    return;
  }

  // Sanitize and get input values
  const username = sanitizeInput(usernameInput.value);
  const password = sanitizeInput(passwordInput.value);

  // Basic validation
  if (!username || !password) {
    showError("⚠️ Please enter both username and password.");
    return;
  }

  // Hide previous error
  hideError();

  // Add loading animation
  loginButton.classList.add("loading");

  // Simulate network delay (UX improvement)
  setTimeout(() => {
    // Encode user input for comparison
    const encodedUserInput = btoa(username);
    const encodedPassInput = btoa(password);

    // Compare encoded values (not plain text)
    if (
      encodedUserInput === ENCODED_USERNAME &&
      encodedPassInput === ENCODED_PASSWORD
    ) {
      // ✅ SUCCESS - Authentication passed
      handleLoginSuccess(username);
    } else {
      // ❌ FAILURE - Invalid credentials
      handleLoginFailure();
    }
  }, 800);
});

/**
 * Handles successful login
 */
function handleLoginSuccess(username) {
  // Reset attempt counter
  loginAttempts = 0;

  // Create session with token
  sessionStorage.setItem("isAuthenticated", "true");
  sessionStorage.setItem("sessionToken", generateSessionToken(username));
  sessionStorage.setItem("username", btoa(username)); // Store encoded

  // Visual success feedback
  loginButton.style.background =
    "linear-gradient(135deg, #10b981 0%, #059669 100%)";
  loginButton.classList.remove("loading");

  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 400);
}

/**
 * Handles failed login attempt
 */
function handleLoginFailure() {
  loginAttempts++;
  loginButton.classList.remove("loading");

  // Check for lockout
  if (loginAttempts >= MAX_ATTEMPTS) {
    isLockedOut = true;
    showError(`🔒 Account locked. Please wait 30 seconds.`);

    // Auto unlock after timeout
    setTimeout(() => {
      isLockedOut = false;
      loginAttempts = 0;
      hideError();
    }, LOCKOUT_TIME);

    return;
  }

  // Show error with remaining attempts
  const remaining = MAX_ATTEMPTS - loginAttempts;
  showError(
    `❌ Invalid credentials. ${remaining} attempt${
      remaining !== 1 ? "s" : ""
    } remaining.`
  );

  // Shake animation on inputs
  shakeInputs();
}

/**
 * Shows error message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
}

/**
 * Hides error message
 */
function hideError() {
  errorMessage.classList.remove("show");
}

/**
 * Applies shake animation to inputs
 */
function shakeInputs() {
  usernameInput.style.animation = "shake 0.4s ease";
  passwordInput.style.animation = "shake 0.4s ease";

  setTimeout(() => {
    usernameInput.style.animation = "";
    passwordInput.style.animation = "";
  }, 400);
}

// ============================================================
// INPUT EVENT LISTENERS
// ============================================================
// Clear error when user starts typing
usernameInput.addEventListener("input", hideError);
passwordInput.addEventListener("input", hideError);

// Prevent paste into password field (optional security measure)
// Uncomment if you want to enforce manual password entry
// passwordInput.addEventListener("paste", (e) => e.preventDefault());

// ============================================================
// CONSOLE SECURITY WARNING
// ============================================================
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
