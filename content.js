function extractProblem() {
  const title = document.title.replace(' - LeetCode', '').trim();

  const description = document.querySelector('[data-track-load="description_content"]')?.innerText
    || "No description found";

  return { title, description };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getProblem") {
    const problem = extractProblem();
    sendResponse(problem);
  }
});