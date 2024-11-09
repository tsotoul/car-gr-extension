chrome.alarms.create("priceCheck", { periodInMinutes: 720 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "priceCheck") {
    chrome.storage.sync.get("trackedListings", (data) => {
      const listings = data.trackedListings || [];
      let notificationCount = 0;
      let processedCount = 0;

      listings.forEach((listing, index) => {
        setTimeout(() => { // Add delay with setTimeout
          chrome.tabs.create({ url: listing.url, active: false }, (tab) => {
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                func: () => {
                  const priceElement = document.querySelector(".price-text");
                  return priceElement ? priceElement.textContent.replace(/\./g, "") : null;
                },
              },
              (results) => {
                if (results[0] && results[0].result) {
                  const newPrice = parseFloat(results[0].result);

                  // Check if the price has changed
                  if (newPrice !== listing.price) {
                    notificationCount++;
                    chrome.action.setBadgeText({ text: notificationCount.toString() });
                    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
                    
                    // Update the listing with the new price
                    listings[index].price = newPrice;
                    listings[index].priceChanged = true;
                    listings[index].priceDirection = newPrice > listing.price ? 'up' : 'down';
                    chrome.storage.sync.set({ trackedListings: listings });
                  } else {
                    listings[index].priceChanged = false;
                    chrome.storage.sync.set({trackedListings: listings});
                  }
                  console.log("Price checked for listing:", listing.url);
                }
                chrome.tabs.remove(tab.id);
                processedCount++;

                if(processedCount === listings.length && notificationCount === 0){
                    chrome.action.setBadgeText({ text: '✔️' });
                    chrome.action.setBadgeBackgroundColor({ color: '#00FF00' }); // Set the badge background color to green
                }
              }
            );
          });
        }, index * 10000); // Delay each request by 10 seconds * index
      });
    });
  }
});