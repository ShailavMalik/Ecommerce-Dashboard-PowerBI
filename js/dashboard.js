/* Authentication check with session validation */
if (sessionStorage.getItem("isAuthenticated") !== "true") {
  window.location.href = "index.html";
} else {
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
          sessionStorage.clear();
          window.location.href = "index.html";
        }
      }
    } catch (e) {
      sessionStorage.clear();
      window.location.href = "index.html";
    }
  }
}

// Data quotes for loading screen
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
  {
    text: "Data will talk to you if you're willing to listen.",
    author: "Jim Bergeson",
  },
  {
    text: "Without big data, you are blind and deaf and in the middle of a freeway.",
    author: "Geoffrey Moore",
  },
  {
    text: "Data are just summaries of thousands of stories – tell a few of those stories.",
    author: "Chip & Dan Heath",
  },
  {
    text: "Errors using inadequate data are much less than those using no data at all.",
    author: "Charles Babbage",
  },
  {
    text: "The most valuable commodity I know of is information.",
    author: "Gordon Gekko",
  },
  {
    text: "Data scientists are involved with gathering data, massaging it into a tractable form.",
    author: "Mike Loukides",
  },
  {
    text: "Big data is at the foundation of all the megatrends that are happening.",
    author: "Chris Lynch",
  },
  {
    text: "Every company has big data in its future, and every company will eventually be in the data business.",
    author: "Thomas H. Davenport",
  },
  {
    text: "You can have data without information, but you cannot have information without data.",
    author: "Daniel Keys Moran",
  },
  {
    text: "Numbers have an important story to tell. They rely on you to give them a voice.",
    author: "Stephen Few",
  },
];

// Display random quote
const quoteLoader = document.getElementById("quoteLoader");
if (quoteLoader) {
  const randomQuote = dataQuotes[Math.floor(Math.random() * dataQuotes.length)];
  const quoteText = quoteLoader.querySelector(".quote-text");
  const quoteAuthor = quoteLoader.querySelector(".quote-author");

  if (quoteText && quoteAuthor) {
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `— ${randomQuote.author}`;
  }

  // Hide after 5 seconds
  setTimeout(() => {
    quoteLoader.style.opacity = "0";
    setTimeout(() => {
      quoteLoader.classList.add("hide");
    }, 500);
  }, 5000);
}

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const currentTheme = localStorage.getItem("theme") || "dark";

if (currentTheme === "light") {
  document.body.classList.add("light-theme");
  themeIcon.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  themeIcon.textContent = isLight ? "🌙" : "☀️";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// Modal functionality
const aboutButton = document.getElementById("aboutButton");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");

aboutButton.addEventListener("click", () => {
  modalOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
});

closeModal.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
  document.body.style.overflow = "auto";
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove("show");
    document.body.style.overflow = "auto";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("show")) {
    modalOverlay.classList.remove("show");
    document.body.style.overflow = "auto";
  }
});

// Logout
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.clear();
    document.body.style.animation = "fadeOut 0.3s ease forwards";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 300);
  }
});

// iframe loading
const iframe = document.querySelector(".dashboard-iframe");
const loadingSpinner = document.querySelector(".loading-spinner");

iframe.addEventListener("load", () => {
  setTimeout(() => {
    loadingSpinner.style.display = "none";
  }, 500);
});

iframe.addEventListener("error", () => {
  loadingSpinner.innerHTML =
    '<p style="color: #dc2626; font-size: 14px;">Failed to load dashboard. Please check your connection.</p>';
});
