chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('youtube.com/')) {
      if (!tab.url.includes('youtube.com/results'))
      {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['remove.js']
        });
        // Get the global window object of the background page
      }
      else if(tab.url.includes('youtube.com/results')){
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['searchQuery.js','content.js','remove2.js']
        }, () => {
          console.log('Content script executed');
        });
        chrome.scripting.insertCSS({
          target: { tabId: tabId },
          files: ['styles.css']
        });

        //extracting videoIDs
        
      } 
    }
  });