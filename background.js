chrome.alarms.create("priceCheck", { periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "priceCheck") {
    chrome.storage.sync.get("trackedListings", (data) => {
      const listings = data.trackedListings || [];
      let notificationCount = 0;
      listings.forEach((listing, index) => {
        chrome.tabs.create({ url: listing.url, active: false }, (tab) => {
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: () => {
                var result = document.querySelector(".price-text").textContent.replace(/\./g, "");
                return result;
              },
            },
            (results) => {
              const newPrice = parseFloat(results[0].result);

              if (newPrice == listing.price) {
                notificationCount++;
                console.log("Price checked.")
                chrome.action.setBadgeText({ text: notificationCount.toString() });
                chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
                if(newPrice) {
                    listings[index].price = newPrice;
                }
              }
              chrome.storage.sync.set({ trackedListings: listings });
              chrome.tabs.remove(tab.id);
            }
          );
        });
      });
    });
  }
});

function testNotification() {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "images/icon48.png", // Ensure the path to your icon is correct
      title: "Test Notification",
      message: "This is a test notification for your extension.",
    });
    chrome.action.setBadgeText({ text: "1" });
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
  }
  
  
  
  
  

  