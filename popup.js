// popup.js
document.addEventListener("DOMContentLoaded", () => {
  chrome.action.setBadgeText({ text: "" });
  chrome.storage.sync.get("trackedListings", (data) => {
    const listingsContainer = document.getElementById("listings");
    const noListingsMessage = document.getElementById("noListings");
    const listings = data.trackedListings || [];

    if (listings.length === 0) {
      noListingsMessage.style.display = "block";
    } else {
      noListingsMessage.style.display = "none";
      listings.forEach((listing, index) => {
        const title = formatTitle(listing.title);

        const row = document.createElement("tr");
        row.innerHTML = `
          <th scope="row">${index + 1}</th>
          <td><a href="${listing.url}" target="_blank">${title}</a></td>
          <td>€${listing.price}</td>
          <td><i class="fas fa-trash remove-icon" data-index="${index}" title="Remove"></i></td>
        `;
        listingsContainer.appendChild(row);
      });

      listingsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-icon")) {
          const index = event.target.getAttribute("data-index");
          listings.splice(index, 1);
          chrome.storage.sync.set({ trackedListings: listings }, () => {
            location.reload();
          });
        }
      });
    }
  });
});

// Helper function to format title
function formatTitle(title) {
  return title.trim().replace(/\s+/g, " ");
}

document.addEventListener("DOMContentLoaded", () => {
  const showLogin = true;
  const loginButton = document.getElementById("loginButton");

  if (showLogin) {
    loginButton.style.display = "block"; // Show the button
  } else {
      loginButton.style.display = "none"; // Hide the button
  }

  loginButton.addEventListener("click", () => {
      window.open('auth.html', '_blank');
  });
});