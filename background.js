self.addEventListener('activate', event => console.log('Service worker active'));

const callGemini = async (apiKey, prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const json = await response.json();

    if (json.error?.code === 503 || json.error?.code === 429) {
      const wait = (i + 1) * 3000;
      await new Promise(resolve => setTimeout(resolve, wait));
      continue;
    }

    return json;
  }
  return { error: { message: "Gemini is busy. Try again in a minute." } };
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "askGemini") {
    const { problem, mode } = request;

    let prompt = "";
    if (mode === "hint") {
      prompt = `Give me 3 step-by-step hints (no full solution) for this LeetCode problem. Help me think, don't solve it for me:\n\n${problem}`;
    } else if (mode === "solution") {
      prompt = `Give a full solution for this LeetCode problem with a clear explanation of the approach. Use C++:\n\n${problem}`;
    } else if (mode === "complexity") {
      prompt = `For this LeetCode problem, provide only the Time Complexity and Space Complexity analysis with explanation:\n\n${problem}`;
    }

    chrome.storage.sync.get("geminiApiKey", async (data) => {
      const apiKey = data.geminiApiKey;
      if (!apiKey) {
        sendResponse({ error: "No API key found. Please set it in settings." });
        return;
      }

      try {
        const json = await callGemini(apiKey, prompt);
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        sendResponse({ result: text || json.error?.message || "No response from Gemini." });
      } catch (error) {
        sendResponse({ error: "API call failed: " + error.message });
      }
    });

    return true;
  }
});