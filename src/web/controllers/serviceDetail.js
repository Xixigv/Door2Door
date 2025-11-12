function renderServiceDetailPage(service) {
    if (!service) {
        return createElement('div', 'container mx-auto px-4 py-6', 'Service not found');
    }
    
    const container = createElement('div', 'min-h-screen bg-gray-50');
    const mainContainer = createElement('div', 'container mx-auto px-4 py-6');
    
    // Back button
    // ToDo: replace with navigateTo function
    const backButton = createElement('button', 'inline-flex items-center text-muted-foreground hover:text-foreground mb-6');
    backButton.addEventListener('click', () => {
        window.location.href = '/';
    });
    backButton.innerHTML = '<i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>Back to services';
    
    // Main content grid
    const contentGrid = createElement('div', 'grid grid-cols-1 lg:grid-cols-3 gap-8');
    
    // Left column
    const leftColumn = createElement('div', 'lg:col-span-2 space-y-6');
    
    // Service header card
    const headerCard = createCard(null, '');
    const headerContent = createElement('div', 'flex flex-col md:flex-row gap-6');
    
    const imageContainer = createElement('div', 'w-full md:w-1/3');
    const serviceImage = createElement('img', 'w-full h-48 object-cover rounded-lg');
    serviceImage.src = service.image;
    serviceImage.alt = service.name;
    imageContainer.appendChild(serviceImage);
    
    const serviceInfo = createElement('div', 'flex-1');
    const serviceName = createElement('h1', 'text-2xl font-bold mb-2', service.name);
    const categoryBadge = createBadge(service.category, 'badge badge-secondary mb-3');
    
    const locationInfo = createElement('div', 'flex items-center space-x-4 text-sm text-muted-foreground mb-4');
    const locationIcon = createIcon('map-pin', 'w-4 h-4 mr-1');
    const locationText = createElement('span', '', `${service.location} • ${service.distance}`);
    locationInfo.appendChild(locationIcon);
    locationInfo.appendChild(locationText);
    
    const description = createElement('p', 'text-muted-foreground mb-4', service.description);
    
    const pricingGrid = createElement('div', 'grid grid-cols-2 gap-4 text-sm');
    const hourlyRate = createElement('div', '', 
        '<span class="text-muted-foreground">Hourly Rate:</span><span class="font-semibold ml-2">$' + service.pricing.hourlyRate + '/hr</span>');
    const serviceCall = createElement('div', '', 
        '<span class="text-muted-foreground">Service Call:</span><span class="font-semibold ml-2">$' + service.pricing.serviceCall + '</span>');
    
    pricingGrid.appendChild(hourlyRate);
    pricingGrid.appendChild(serviceCall);
    
    serviceInfo.appendChild(serviceName);
    serviceInfo.appendChild(categoryBadge);
    serviceInfo.appendChild(locationInfo);
    serviceInfo.appendChild(description);
    serviceInfo.appendChild(pricingGrid);
    
    headerContent.appendChild(imageContainer);
    headerContent.appendChild(serviceInfo);
    headerCard.querySelector('.card-content').appendChild(headerContent);
    
    // Provider info card
    const providerCard = createCard('Service Provider', '');
    const providerContent = createElement('div', 'flex items-start space-x-4');
    
    const providerAvatar = createAvatar(service.provider.image, service.provider.name, 'avatar avatar-lg');
    
    const providerInfo = createElement('div', 'flex-1');
    const providerHeader = createElement('div', 'flex items-center justify-between mb-3');
    
    const providerDetails = createElement('div');
    const providerName = createElement('h3', 'font-semibold', service.provider.name);
    const providerRating = createElement('div', 'flex items-center space-x-1 mb-2');
    const starIcon = createIcon('star', 'w-4 h-4 fill-yellow-400 text-yellow-400');
    const rating = createElement('span', 'font-medium', service.provider.rating.toString());
    const reviewCount = createElement('span', 'text-muted-foreground', `(${service.provider.reviewCount} reviews)`);
    
    providerRating.appendChild(starIcon);
    providerRating.appendChild(rating);
    providerRating.appendChild(reviewCount);
    
    providerDetails.appendChild(providerName);
    providerDetails.appendChild(providerRating);
    
    const availabilityBadge = createBadge(service.provider.availability, 'badge badge-outline text-green-700 border-green-700');
    
    providerHeader.appendChild(providerDetails);
    providerHeader.appendChild(availabilityBadge);
    
    const statsGrid = createElement('div', 'grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4');
    
    const experience = createElement('div', '', 
        '<span class="text-muted-foreground block">Experience</span><span class="font-medium">' + service.provider.yearsExperience + ' years</span>');
    const jobsCompleted = createElement('div', '', 
        '<span class="text-muted-foreground block">Jobs Completed</span><span class="font-medium">' + service.provider.completedJobs + '</span>');
    const responseTime = createElement('div', '', 
        '<span class="text-muted-foreground block">Response Time</span><span class="font-medium">' + service.provider.responseTime + '</span>');
    
    statsGrid.appendChild(experience);
    statsGrid.appendChild(jobsCompleted);
    statsGrid.appendChild(responseTime);
    
    const actionButtons = createElement('div', 'flex space-x-3');
    const viewProfileBtn = createButton('View Profile', () => {
        localStorage.setItem('provider', service.provider.id);
        window.location.href = `/providerProfile`;
    }, 'btn btn-outline btn-sm');
    
    const messageBtn = createButton(
        '<i data-lucide="message-square" class="w-4 h-4 mr-2"></i>Message',
        null,
        'btn btn-outline btn-sm'
    );
    
    const callBtn = createButton(
        '<i data-lucide="phone" class="w-4 h-4 mr-2"></i>Call',
        null,
        'btn btn-outline btn-sm'
    );
    
    actionButtons.appendChild(viewProfileBtn);
    actionButtons.appendChild(messageBtn);
    actionButtons.appendChild(callBtn);
    
    providerInfo.appendChild(providerHeader);
    providerInfo.appendChild(statsGrid);
    providerInfo.appendChild(actionButtons);
    
    providerContent.appendChild(providerAvatar);
    providerContent.appendChild(providerInfo);
    providerCard.querySelector('.card-content').appendChild(providerContent);
    
    // Services offered card
    const servicesCard = createCard('Services Offered', '');
    const servicesGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 gap-3');
    
    service.services.forEach(serviceItem => {
        const serviceRow = createElement('div', 'flex items-center space-x-2');
        const dot = createElement('div', 'w-2 h-2 bg-primary rounded-full');
        const text = createElement('span', '', serviceItem);
        serviceRow.appendChild(dot);
        serviceRow.appendChild(text);
        servicesGrid.appendChild(serviceRow);
    });
    
    servicesCard.querySelector('.card-content').appendChild(servicesGrid);
    
    // ToDo add reviews ednpoint
    // Reviews card
    // const reviewsCard = createCard('Customer Reviews', '');
    // const reviewsContainer = createElement('div', 'space-y-6');
    
    // REVIEWS.forEach(review => {
    //     const reviewElement = createReviewCard(review);
    //     reviewsContainer.appendChild(reviewElement);
    // });
    
    // reviewsCard.querySelector('.card-content').appendChild(reviewsContainer);
    
    leftColumn.appendChild(headerCard);
    leftColumn.appendChild(providerCard);
    leftColumn.appendChild(servicesCard);
    // leftColumn.appendChild(reviewsCard);
    
    // Right column - Booking sidebar
    const rightColumn = createElement('div', 'lg:col-span-1');
    const bookingCard = createCard('Book This Service', '');
    
    const pricingInfo = createElement('div', 'p-4 bg-gray-50 rounded-lg mb-4');
    const startingPrice = createElement('div', 'text-sm text-muted-foreground mb-1', 'Starting at');
    const mainPrice = createElement('div', 'text-2xl font-bold', `$${service.pricing.hourlyRate}/hr`);
    const additionalFee = createElement('div', 'text-sm text-muted-foreground', `+ $${service.pricing.serviceCall} service call`);
    
    pricingInfo.appendChild(startingPrice);
    pricingInfo.appendChild(mainPrice);
    pricingInfo.appendChild(additionalFee);
    
    const features = createElement('div', 'space-y-3 mb-4');
    const availableToday = createElement('div', 'flex items-center space-x-2 text-sm');
    const clockIcon = createIcon('clock', 'w-4 h-4 text-green-600');
    const availableText = createElement('span', '', 'Available today');
    availableToday.appendChild(clockIcon);
    availableToday.appendChild(availableText);
    
    const servesArea = createElement('div', 'flex items-center space-x-2 text-sm');
    const mapIcon = createIcon('map-pin', 'w-4 h-4 text-blue-600');
    const areaText = createElement('span', '', 'Serves your area');
    servesArea.appendChild(mapIcon);
    servesArea.appendChild(areaText);
    
    features.appendChild(availableToday);
    features.appendChild(servesArea);

    const scheduleBtn = createButton(
        '<i data-lucide="calendar" class="w-4 h-4 mr-2"></i>Schedule Service',
        () => {
            window.location.href = '/booking';
            localStorage.setItem('provider', service.provider.id);
        },
        'btn btn-primary w-full btn-lg mb-3'
    );
    
    const quoteBtn = createButton(
        '<i data-lucide="message-square" class="w-4 h-4 mr-2"></i>Get Quote',
        null,
        'btn btn-outline w-full mb-4'
    );
    
    const guarantees = createElement('div', 'pt-4 border-t');
    const guaranteeTitle = createElement('h4', 'font-medium mb-2', 'Satisfaction Guaranteed');
    const guaranteeList = createElement('ul', 'text-sm text-muted-foreground space-y-1');
    
    const guaranteeItems = [
        '• Licensed & Insured',
        '• 30-day warranty',
        '• Background checked',
        '• Money-back guarantee'
    ];
    
    guaranteeItems.forEach(item => {
        const listItem = createElement('li', '', item);
        guaranteeList.appendChild(listItem);
    });
    
    guarantees.appendChild(guaranteeTitle);
    guarantees.appendChild(guaranteeList);
    
    const bookingContent = bookingCard.querySelector('.card-content');
    bookingContent.appendChild(pricingInfo);
    bookingContent.appendChild(features);
    bookingContent.appendChild(scheduleBtn);
    bookingContent.appendChild(quoteBtn);
    bookingContent.appendChild(guarantees);
    
    rightColumn.appendChild(bookingCard);
    
    contentGrid.appendChild(leftColumn);
    contentGrid.appendChild(rightColumn);
    
    mainContainer.appendChild(backButton);
    mainContainer.appendChild(contentGrid);
    container.appendChild(mainContainer);
    
    return container;
}

function getService(id)
{

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/services/${id}`, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('value', id);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const serviceDetailPage = renderServiceDetailPage(response);
            let main_content = document.getElementById('main-content');
            main_content.innerHTML = '';
            main_content.appendChild(serviceDetailPage);
            lucide.createIcons();

        } else {
            console.error('Request failed. Status:', xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error('Request error');
    };

    xhr.send();
}

window.onload = function() {
    const serviceId = localStorage.getItem('service');
    getService(serviceId);
}

































function getBooking(bookingId) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/bookings/${bookingId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const booking = JSON.parse(xhr.responseText);
            renderBookingDetails(booking);
            lucide.createIcons();
        } else {
            console.error('Request failed. Status:', xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error('Request error');
    };

    xhr.send();
}

function renderBookingDetails(booking) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container mx-auto py-8 px-4">
            <button id="back-btn" class="inline-flex items-center text-gray-500 hover:text-gray-800 mb-6">
                <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>Back
            </button>

            <div class="bg-white rounded-2xl shadow p-6 mb-6">
                <h1 class="text-2xl font-bold mb-4">${booking.service}</h1>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Time:</strong> ${booking.bookingTime}</p>
                <p><strong>Duration:</strong> ${booking.serviceDuration} hrs</p>
                <p><strong>Amount:</strong> $${booking.amount}</p>
                <p><strong>Status:</strong> ${booking.status}</p>
                <p><strong>Notes:</strong> ${booking.notes}</p>
            </div>

            <div id="action-section"></div>
        </div>
    `;

    const userRole = localStorage.getItem('role'); 
    const actionSection = document.getElementById('action-section');

    if (userRole === 'provider') {
        actionSection.innerHTML = `
            <div class="bg-gray-50 p-4 rounded-lg">
                <h2 class="text-lg font-semibold mb-2">Update Service Status</h2>
                <select id="status-select" class="border rounded px-3 py-2 mb-3">
                    <option value="Booked" ${booking.status === "Booked" ? "selected" : ""}>Booked</option>
                    <option value="In Progress" ${booking.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Finalized" ${booking.status === "Finalized" ? "selected" : ""}>Finalized</option>
                </select>
                <button id="update-status" class="btn btn-primary">Update</button>
            </div>
        `;

        document.getElementById('update-status').addEventListener('click', () => {
            const newStatus = document.getElementById('status-select').value;
            updateBookingStatus(booking.id, newStatus);
        });

    } else if (userRole === 'user') {
        actionSection.innerHTML = `
            <div class="bg-gray-50 p-4 rounded-lg">
                <h2 class="text-lg font-semibold mb-2">Leave a Review</h2>
                <textarea id="review-text" rows="4" class="w-full border rounded p-2 mb-3" placeholder="Write your feedback..."></textarea>
                <button id="submit-review" class="btn btn-primary">Submit Review</button>
            </div>
        `;

        document.getElementById('submit-review').addEventListener('click', () => {
            const review = document.getElementById('review-text').value;
            if (review.trim() === "") {
                alert("Please write a review before submitting.");
                return;
            }
            submitReview(booking.id, review);
        });
    }

    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = '/';
    });
}

function updateBookingStatus(bookingId, newStatus) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `/bookings/${bookingId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Status updated successfully!');
            window.location.reload();
        } else {
            alert('Error updating status.');
        }
    };
    xhr.send(JSON.stringify({ status: newStatus }));
}

function submitReview(bookingId, review) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/reviews`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 201) {
            alert('Review submitted!');
            window.location.reload();
        } else {
            alert('Error submitting review.');
        }
    };
    xhr.send(JSON.stringify({ bookingId, review }));
}

window.onload = function () {
    const bookingId = localStorage.getItem('booking');
    getBooking(bookingId);
};




















document.addEventListener("DOMContentLoaded", () => {
  // --- Datos de ejemplo ---
  const services = [
    {
      id: 1,
      name: "Premium Plumbing Services",
      category: "Plumbing",
      shortDescription: "Professional plumbing services",
      image:
        "https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      pricing: { hourlyRate: 75, serviceCall: 45 },
      description:
        "Professional plumbing services including leak repairs, pipe installation, drain cleaning, and emergency services. Licensed and insured with 8+ years of experience.",
      services: [
        "Leak Detection & Repair",
        "Pipe Installation",
        "Drain Cleaning",
        "Water Heater Service",
        "Emergency Plumbing",
        "Fixture Installation",
      ],
      location: "Downtown Area",
      distance: "2.3 miles away",
    },
    {
      id: 2,
      name: "Expert Carpentry Solutions",
      category: "Carpentry",
      shortDescription: "Custom woodwork and repairs",
      image:
        "https://images.unsplash.com/photo-1638718260002-18bdc8082608?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      pricing: { hourlyRate: 85, serviceCall: 60 },
      description:
        "Custom carpentry and woodworking services for residential and commercial projects. Specializing in cabinetry, trim work, and furniture restoration with 12+ years of master craftsmanship.",
      services: [
        "Custom Cabinetry",
        "Trim & Molding",
        "Door Installation",
        "Deck Building",
        "Furniture Repair",
        "Built-in Shelving",
      ],
      location: "Westside",
      distance: "3.7 miles away",
    },
  ];

  // --- Simulación del rol y servicio ---
  const role = localStorage.getItem("role") || "provider"; // "provider" o "client"
  const serviceId = parseInt(localStorage.getItem("service")) || 1;
  const currentStatus = localStorage.getItem("serviceStatus") || "Booked";
  const service = services.find((s) => s.id === serviceId);

  if (!service) return;

  renderServiceDetails(service);
  setupStatusSection(role, currentStatus);
  setupReviewSection(role, currentStatus);

  if (role === "provider") document.getElementById("client-info").classList.remove("hidden");

  lucide.createIcons();
});

function renderServiceDetails(service) {
  const container = document.getElementById("service-details");
  container.innerHTML = `
    <div class="flex items-center space-x-4">
      <img src="${service.image}" alt="${service.name}" class="w-24 h-24 rounded-lg object-cover">
      <div>
        <h3 class="text-xl font-semibold">${service.name}</h3>
        <p class="text-sm text-gray-500">${service.category}</p>
        <p class="text-sm text-gray-500">${service.location} • ${service.distance}</p>
      </div>
    </div>

    <div>
      <h4 class="font-medium">Description:</h4>
      <p class="text-sm text-gray-700">${service.description}</p>
    </div>

    <div>
      <h4 class="font-medium">Services Included:</h4>
      <ul class="list-disc list-inside text-sm text-gray-700">
        ${service.services.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>

    <div>
      <h4 class="font-medium">Pricing:</h4>
      <p class="text-sm text-gray-700">$${service.pricing.hourlyRate}/hr + $${service.pricing.serviceCall} Service Call</p>
    </div>
  `;
}

// --------- SECCIÓN DE ESTADO (PROVEEDOR) ---------
function setupStatusSection(role, status) {
  const section = document.getElementById("status-section");

  if (role !== "provider") return;

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

// --------- SECCIÓN DE REVIEW (CLIENTE) ---------
function setupReviewSection(role, status) {
  if (role !== "client") return;

  const reviewSection = document.getElementById("review-section");
  if (status !== "Finalized") return;

  reviewSection.classList.remove("hidden");

  const submitBtn = document.getElementById("submit-review");
  const confirmation = document.getElementById("review-confirmation");

  submitBtn.addEventListener("click", () => {
    const rating = document.getElementById("review-rating").value;
    const comment = document.getElementById("review-comment").value.trim();

    if (!rating || !comment) {
      alert("Please provide both a rating and a comment.");
      return;
    }

    const review = { rating, comment, date: new Date().toLocaleDateString() };
    localStorage.setItem("clientReview", JSON.stringify(review));

    confirmation.classList.remove("hidden");
    submitBtn.disabled = true;
  });
}
