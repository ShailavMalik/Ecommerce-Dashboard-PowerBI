/**
 * ============================================================
 * DASHBOARD AUTHENTICATION CHECK
 * ============================================================
 * Validates user session before allowing access to dashboard.
 * Uses sessionStorage for session management.
 * ============================================================
 */

// Check authentication on page load
if (sessionStorage.getItem("isAuthenticated") !== "true") {
  // Not authenticated - redirect to login page
  window.location.href = "index.html";
} else {
  // Validate session token hasn't expired
  const sessionToken = sessionStorage.getItem("sessionToken");
  if (sessionToken) {
    try {
      const decoded = atob(sessionToken);
      const parts = decoded.split("|");
      if (parts.length === 2) {
        const timestamp = parseInt(parts[1]);
        const now = Date.now();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

        if (now - timestamp >= sessionDuration) {
          // Session expired - clear and redirect
          sessionStorage.clear();
          window.location.href = "index.html";
        }
      }
    } catch (e) {
      // Invalid token - clear and redirect
      sessionStorage.clear();
      window.location.href = "index.html";
    }
  }
}

// Array of data-related quotes
const dataQuotes = [
  {
    text: "Without data, you're just another person with an opinion.",
    author: "W. Edwards Deming",
  },
  {
    text: "In God we trust, all others must bring data.",
    author: "W. Edwards Deming",
  },
  {
    text: "Data is the new oil. It's valuable, but if unrefined it cannot really be used.",
    author: "Clive Humby",
  },
  {
    text: "The goal is to turn data into information, and information into insight.",
    author: "Carly Fiorina",
  },
  {
    text: "Information is the oil of the 21st century, and analytics is the combustion engine.",
    author: "Peter Sondergaard",
  },
  {
    text: "Data really powers everything that we do.",
    author: "Jeff Weiner",
  },
  {
    text: "The world is one big data problem.",
    author: "Andrew McAfee",
  },
  {
    text: "Data beats emotions.",
    author: "Sean Rad",
  },
];

// Select random quote and display it
const quoteLoader = document.getElementById("quoteLoader");
if (quoteLoader) {
  const randomQuote = dataQuotes[Math.floor(Math.random() * dataQuotes.length)];
  const quoteText = quoteLoader.querySelector(".quote-text");
  const quoteAuthor = quoteLoader.querySelector(".quote-author");

  if (quoteText && quoteAuthor) {
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `— ${randomQuote.author}`;
  }

  // Hide quote loader after 3 seconds
  setTimeout(() => {
    quoteLoader.style.opacity = "0";
    setTimeout(() => {
      quoteLoader.classList.add("hide");
    }, 500);
  }, 3000);
}

// About Button - Open Modal
const aboutButton = document.getElementById("aboutButton");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");

aboutButton.addEventListener("click", () => {
  modalOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
});

// Close Modal - Click Close Button
closeModal.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
  document.body.style.overflow = "auto";
});

// Close Modal - Click Outside
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove("show");
    document.body.style.overflow = "auto";
  }
});

// Close Modal - Press Escape Key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("show")) {
    modalOverlay.classList.remove("show");
    document.body.style.overflow = "auto";
  }
});

// Logout Button
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
  // Confirm logout
  if (confirm("Are you sure you want to logout?")) {
    // Clear session storage
    sessionStorage.clear();

    // Add fade out animation
    document.body.style.animation = "fadeOut 0.3s ease forwards";

    // Redirect to login after animation
    setTimeout(() => {
      window.location.href = "index.html";
    }, 300);
  }
});

// Hide loading spinner when iframe loads
const iframe = document.querySelector(".dashboard-iframe");
const loadingSpinner = document.querySelector(".loading-spinner");

iframe.addEventListener("load", () => {
  setTimeout(() => {
    loadingSpinner.style.display = "none";
  }, 500);
});

// Error handling for iframe
iframe.addEventListener("error", () => {
  loadingSpinner.innerHTML =
    '<p style="color: #dc2626; font-size: 14px;">Failed to load dashboard. Please check your connection.</p>';
});
