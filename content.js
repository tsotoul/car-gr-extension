// content.js

if (!document.querySelector('#font-awesome-css')) {
  const fontAwesomeLink = document.createElement('link');
  fontAwesomeLink.id = 'font-awesome-css';
  fontAwesomeLink.rel = 'stylesheet';
  fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
  document.head.appendChild(fontAwesomeLink);
}


function injectTrackButton() {
  const titleElement = document.querySelector(".price-text");
  if (titleElement && !titleElement.querySelector(".track-price-icon")) { // Prevent duplicate buttons
    const trackIcon = document.createElement("i");
    trackIcon.classList.add("fas", "fa-share-from-square", "track-price-icon");
    trackIcon.style.marginLeft = "10px";
    trackIcon.style.cursor = "pointer";
    trackIcon.title = "Track Price";

    trackIcon.onclick = () => {
      const listingUrl = window.location.href;
      chrome.storage.sync.get("trackedListings", (data) => {
        const listings = data.trackedListings || [];
        listings.push({ url: listingUrl, price: getCurrentPrice(), title: getListingTitle() });
        chrome.storage.sync.set({ trackedListings: listings });
        alert("Listing added to track!");
      });
    }

    titleElement.appendChild(trackIcon);
  }
}

function getCurrentPrice() {
  const priceElement = document.querySelector(".price-text");
  return priceElement ? parseFloat(priceElement.textContent.replace(/\./g, "")) : 0;
}

function getListingTitle() {
  const titleElement = document.querySelector(".classified-title").textContent.trim().replace(/\s+/g, " ");;
  return titleElement;
}

// Observe DOM changes to handle dynamic content
const observer = new MutationObserver(injectTrackButton);
observer.observe(document.body, { childList: true, subtree: true });

// Initial call in case content is already loaded
injectTrackButton();
