function closeTab(tabId) {
  chrome.tabs.remove(tabId)
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg) {
    case 'closeTab': {
      closeTab(sender.tab.id)
      break
    }
  }
})