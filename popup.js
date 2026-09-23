let problemData = null;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];

  if (!tab.url.includes("leetcode.com/problems")) {
    document.getElementById("problemTitle").textContent = "Open a LeetCode problem first!";
    return;
  }

  // Run extraction directly on the page — no messaging needed
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const title = document.title.replace(' - LeetCode', '').trim();
        const description = document.querySelector('[data-track-load="description_content"]')?.innerText || "No description found";
        return { title, description };
      }
    },
    (results) => {
      if (chrome.runtime.lastError || !results || !results[0]) {
        document.getElementById("problemTitle").textContent = "Refresh the LeetCode page and try again.";
        return;
      }
      problemData = results[0].result;
      document.getElementById("problemTitle").textContent = problemData.title;
      document.getElementById("problemSnippet").textContent =
        problemData.description.slice(0, 80) + "...";
    }
  );
});

function askGemini(mode) {
  if (!problemData) {
    showResult("Could not detect the problem. Refresh the page and try again.");
    return;
  }

  const problem = `Title: ${problemData.title}\n\n${problemData.description}`;

  document.getElementById("loader").style.display = "block";
  document.getElementById("resultBox").style.display = "none";

  chrome.runtime.sendMessage({ action: "askGemini", problem, mode }, (response) => {
    document.getElementById("loader").style.display = "none";

    if (response.error) {
      showResult("Error: " + response.error);
    } else {
      showResult(response.result);
    }
  });
}

function showResult(text) {
  const box = document.getElementById("resultBox");
  box.style.display = "block";
  box.innerHTML = marked.parse(text);
}

document.getElementById("hintBtn").addEventListener("click", () => askGemini("hint"));
document.getElementById("solutionBtn").addEventListener("click", () => askGemini("solution"));
document.getElementById("complexityBtn").addEventListener("click", () => askGemini("complexity"));

document.getElementById("settingsLink").addEventListener("click", () => {
  const key = prompt("Paste your Gemini API key:");
  if (key) {
    chrome.storage.sync.set({ geminiApiKey: key }, () => {
      alert("API key saved!");
    });
  }
});