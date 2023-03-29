chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('youtube.com/')) {
      if (tab.url === 'https://www.youtube.com/' || tab.url.includes('https://www.youtube.com/watch') || tab.url.includes('https://www.youtube.com/@') || tab.url.includes('https://www.youtube.com/channel') || tab.url.includes('https://www.youtube.com/feed') || tab.url.includes('https://www.youtube.com/playlist') || tab.url.includes('https://www.youtube.com/account') || tab.url.includes('https://www.youtube.com/premium') || tab.url.includes('https://www.youtube.com/report') || tab.url.includes('https://www.youtube.com/shorts') || tab.url.includes('https://www.youtube.com/paid'))
      {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['remove.js']
        });
      }
      else if(tab.url.includes('youtube.com/results')){
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['searchQuery.js','content.js']
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