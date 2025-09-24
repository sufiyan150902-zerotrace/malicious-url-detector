document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["currentURL", "suspicious", "reason"], (data) => {
        const urlEl = document.getElementById("url");
        const statusEl = document.getElementById("status");
        const reasonEl = document.getElementById("reason");

        urlEl.innerText = data.currentURL || "No URL found";

        if (data.suspicious) {
            statusEl.innerText = "⚠️ Suspicious URL detected!";
            statusEl.style.color = "red";
            reasonEl.innerText = data.reason || "Unknown reason";
            reasonEl.style.color = "#b22222";
        } else {
            statusEl.innerText = "✅ Safe (no issues found)";
            statusEl.style.color = "green";
            reasonEl.innerText = data.reason || "";
            reasonEl.style.color = "#2e8b57";
        }
    });
});

