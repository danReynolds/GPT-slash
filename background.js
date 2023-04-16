chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.active && tab.url) {
    const url = new URL(tab.url);

    if (url.hostname === 'chat.openai.com') {
      chrome.tabs.sendMessage(tabId, { action: "initialize" });
    }
  }
});