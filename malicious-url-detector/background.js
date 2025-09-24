const SUSPICIOUS_KEYWORDS = [
  "login", "secure-login", "verify", "bank", "account", "update", "confirm",
  "signin", "password", "free-gift", "claim", "verify-account"
];

function reasonForSuspicion(url) {
  // 1) multiple protocols concatenated -> very suspicious
  const protoCount = (url.match(/https?:\/\//g) || []).length;
  if (protoCount > 1) return "Multiple protocols / concatenated URLs detected";

  // 2) raw ip
  if (/(\d{1,3}\.){3}\d{1,3}/.test(url)) return "Raw IP address in URL";

  // 3) contains @ (username@host manipulation)
  if (url.includes("@")) return "Contains '@' — possible credential-stuffing/phishing trick";

  // 4) punycode
  if (url.includes("xn--")) return "Punycode (xn--) detected — possible homograph attack";

  // 5) extremely long
  if (url.length > 200) return "Extremely long URL — obfuscation possible";

  // 6) suspicious keywords in hostname or path
  try {
    // Try to parse as URL normally
    const parsed = new URL(url);
    const hostAndPath = (parsed.hostname + parsed.pathname + parsed.search).toLowerCase();
    for (const kw of SUSPICIOUS_KEYWORDS) {
      if (hostAndPath.includes(kw)) return `Contains suspicious token: '${kw}'`;
    }
  } catch (e) {
    // If parsing fails, try to split by protocol and examine parts
    const parts = url.split(/https?:\/\//i).filter(p => p.trim().length);
    if (parts.length > 1) {
      // There were multiple protocol sections (concatenation or malformed)
      return "Malformed/concatenated URL detected";
    }
    // fallback: mark as suspicious because we could not parse URL
    return "Malformed URL (unparseable)";
  }

  // No reason found
  return null;
}

function isSuspicious(url) {
  // Basic sanity: small trim
  url = (url || "").trim();

  // If the string contains multiple 'http' occurrences or 'https', mark suspicious
  if ((url.match(/https?:\/\//g) || []).length > 1) {
    return { suspicious: true, reason: "Multiple URLs concatenated" };
  }

  // Evaluate reasons
  const reason = reasonForSuspicion(url);
  if (reason) return { suspicious: true, reason };

  // Default safe
  return { suspicious: false, reason: "No heuristics matched" };
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const result = isSuspicious(tab.url);
    chrome.storage.local.set({
      currentURL: tab.url,
      suspicious: result.suspicious,
      reason: result.reason
    });
  }
});

// Also update when tab activated (user switches tabs)
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError || !tab) return;
    const result = isSuspicious(tab.url || "");
    chrome.storage.local.set({
      currentURL: tab.url || "",
      suspicious: result.suspicious,
      reason: result.reason
    });
  });
});
