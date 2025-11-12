<script src="/web/controllers/serviceDetail.js"></script>

document.addEventListener("DOMContentLoaded", () => {
  fetch('/serviceDetails.json')
    .then(res => res.json())
    .then(services => {
      const serviceId = parseInt(localStorage.getItem("service")) || 1;
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      renderServiceDetails(service);   
      setupStatusSection(localStorage.getItem("role"), localStorage.getItem("serviceStatus"));
      setupReviewSection(localStorage.getItem("role"), localStorage.getItem("serviceStatus"));
      lucide.createIcons();
    })
    .catch(err => console.error("Failed to load services JSON", err));
});



function renderServiceDetails(service) {
    const container = document.getElementById("service-details");
    if (!container) return;

    container.innerHTML = `
        <div class="flex items-center space-x-4 mb-4">
            <img src="${service.image}" alt="${service.name}" class="w-24 h-24 rounded-lg object-cover">
            <div>
                <h3 class="text-xl font-semibold">${service.name}</h3>
                <p class="text-sm text-gray-500">${service.category}</p>
                <p class="text-sm text-gray-500">${service.location} • ${service.distance}</p>
            </div>
        </div>

        <div class="mb-4">
            <h4 class="font-medium">Description:</h4>
            <p class="text-sm text-gray-700">${service.description}</p>
        </div>

        <div class="mb-4">
            <h4 class="font-medium">Services Included:</h4>
            <ul class="list-disc list-inside text-sm text-gray-700">
                ${service.services.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>

        <div class="mb-4">
            <h4 class="font-medium">Pricing:</h4>
            <p class="text-sm text-gray-700">$${service.pricing.hourlyRate}/hr + $${service.pricing.serviceCall} Service Call</p>
        </div>
    `;
}

function setupStatusSection(role, status) {
    if (role !== "provider") return;
    const section = document.getElementById("status-section");
    if (!section) return;

    section.innerHTML = `
        <p class="text-sm mb-2">Status: <span id="current-status-label" class="font-medium">${status}</span></p>
        <button id="status-btn" class="btn btn-primary w-full">Start Service</button>
    `;

    const statusLabel = document.getElementById("current-status-label");
    const statusBtn = document.getElementById("status-btn");

    updateStatusButton(statusBtn, status);

    statusBtn.addEventListener("click", () => {
        if (status === "Booked") status = "In Progress";
        else if (status === "In Progress") status = "Finalized";

        localStorage.setItem("serviceStatus", status);
        statusLabel.textContent = status;
        updateStatusButton(statusBtn, status);
    });
}

function updateStatusButton(btn, status) {
    switch (status) {
        case "Booked":
            btn.textContent = "Start Service";
            btn.className = "btn btn-primary w-full";
            btn.disabled = false;
            break;
        case "In Progress":
            btn.textContent = "Mark as Finalized";
            btn.className = "btn bg-yellow-500 text-white w-full";
            btn.disabled = false;
            break;
        case "Finalized":
            btn.textContent = "Service Completed";
            btn.className = "btn bg-green-600 text-white w-full";
            btn.disabled = true;
            break;
    }
}

function setupReviewSection(role, status) {
    if (role !== "client" || status !== "Finalized") return;

    const reviewSection = document.getElementById("review-section");
    if (!reviewSection) return;
    reviewSection.classList.remove("hidden");

    const submitBtn = document.getElementById("submit-review");
    const confirmation = document.getElementById("review-confirmation");

    if (!submitBtn) return;

    submitBtn.addEventListener("click", () => {
        const rating = document.getElementById("review-rating")?.value;
        const comment = document.getElementById("review-comment")?.value.trim();

        if (!rating || !comment) {
            alert("Please provide both a rating and a comment.");
            return;
        }

        const review = { rating, comment, date: new Date().toLocaleDateString() };
        localStorage.setItem("clientReview", JSON.stringify(review));

        if (confirmation) confirmation.classList.remove("hidden");
        submitBtn.disabled = true;
        alert("Review submitted!");
    });
}
