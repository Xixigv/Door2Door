function getService(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/services/${id}`, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('value', id);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const service = JSON.parse(xhr.responseText);
            localStorage.setItem('providerId', service.providerId);
            renderServiceDetails(service);

            const role = localStorage.getItem('role');
            
            if (role === 'provider') {
                const clientInfo = document.getElementById('client-info');
                if (clientInfo) {
                    clientInfo.classList.remove('hidden');
                }
            }
            
            initializeIcons();
        } else {
            console.error('Request failed. Status:', xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error('Request error');
    };

    xhr.send();
}
function getBooking(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/bookings/${id}`, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('value', id);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const booking = JSON.parse(xhr.responseText);
            const role = localStorage.getItem('role');
            setupStatusSection(role, booking.status);
            setupReviewSection(role, booking.status);
            
            if (role === 'provider') {
                const clientInfo = document.getElementById('client-info');
                if (clientInfo) {
                    clientInfo.classList.remove('hidden');
                }
            }
            
            initializeIcons();
        } else {
            console.error('Request failed. Status:', xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error('Request error');
    };

    xhr.send();
}

function postReview(providerId, userId, rating, comment = '', callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/reviews', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 201) {
            const review = JSON.parse(xhr.responseText);
            if (callback) callback(null, review);
        } else if (xhr.status === 400) {
            const error = JSON.parse(xhr.responseText);
            console.error('Bad request:', error.error);
            if (callback) callback(error.error, null);
        } else if (xhr.status === 500) {
            const error = JSON.parse(xhr.responseText);
            console.error('Server error:', error.error);
            if (callback) callback(error.error, null);
        } else {
            console.error('Request failed. Status:', xhr.status);
            if (callback) callback('Request failed', null);
        }
    };

    xhr.onerror = function() {
        console.error('Request error');
        if (callback) callback('Network error', null);
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const data = {
        providerId: providerId,
        userId: userId,
        rating: Number(rating),
        comment: comment,
        date: formattedDate
    };  

    xhr.send(JSON.stringify(data));
}

function getUserDetail(userId, /*authenticateToken,*/ ) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/users/detail/${userId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                renderClientInfo(response.data);
            } else {
                console.error('Failed to get user:', response.error);
            }
        } else if (xhr.status === 404) {
            const response = JSON.parse(xhr.responseText);
            console.error('User not found:', response.error);
        } else if (xhr.status === 500) {
            const response = JSON.parse(xhr.responseText);
            console.error('Server error:', response.error);
        } else {
            console.error('Request failed. Status:', xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error('Request error');
    };

    xhr.send();
}


function updateBookingStatus(bookingId, status, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `/bookings/${bookingId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            const booking = JSON.parse(xhr.responseText);
            console.log('Booking status updated successfully:', booking);
            if (callback) callback(null, booking);
        } else if (xhr.status === 400) {
            const error = JSON.parse(xhr.responseText);
            console.error('Bad request:', error.error);
            if (callback) callback(error.error, null);
        } else if (xhr.status === 500) {
            const error = JSON.parse(xhr.responseText);
            console.error('Server error:', error.error);
            if (callback) callback(error.error, null);
        } else {
            console.error('Request failed. Status:', xhr.status);
            if (callback) callback('Request failed', null);
        }
    };

    xhr.onerror = function() {
        console.error('Request error');
        if (callback) callback('Network error', null);
    };

    const data = {
        status: status
    };

    xhr.send(JSON.stringify(data));
}

function renderClientInfo(client) {
    const container = document.getElementById("client-info");
    if (!container) return;

    container.innerHTML = '';

    // Create wrapper div for flex layout
    const wrapper = createElement('div', 'flex items-start space-x-4');

    // Client image
    const img = createElement('img', 'rounded-lg w-20 h-20 object-cover');
    img.id = 'client-img';
    img.src = client.avatar;
    img.alt = 'Client';
    wrapper.appendChild(img);

    // Client details container
    const detailsContainer = createElement('div');

    // Client name
    const nameHeading = createElement('h3', 'text-lg font-medium');
    nameHeading.innerHTML = 'Client: ';
    const nameSpan = createElement('span', '', client.name);
    nameSpan.id = 'client-name';
    nameHeading.appendChild(nameSpan);
    detailsContainer.appendChild(nameHeading);

    // Client address
    const addressPara = createElement('p', 'text-sm text-gray-500');
    addressPara.innerHTML = 'Address: ';
    const addressSpan = createElement('span', '', client.location);
    addressSpan.id = 'client-address';
    addressPara.appendChild(addressSpan);
    detailsContainer.appendChild(addressPara);

    // Client phone
    const phonePara = createElement('p', 'text-sm text-gray-500');
    phonePara.innerHTML = 'Telephone: ';
    const phoneSpan = createElement('span', '', client.phone);
    phoneSpan.id = 'client-phone';
    phonePara.appendChild(phoneSpan);
    detailsContainer.appendChild(phonePara);

    wrapper.appendChild(detailsContainer);
    container.appendChild(wrapper);
}

function renderServiceDetails(service) {
    const container = document.getElementById("service-details");
    if (!container) return;
    
    container.innerHTML = '';

    // Service header with image and basic info
    const header = createElement('div', 'flex items-center space-x-4 mb-6');
    
    const img = createElement('img', 'w-24 h-24 rounded-lg object-cover');
    img.src = service.image;
    img.alt = service.name;
    
    const infoContainer = createElement('div');
    const name = createElement('h3', 'text-xl font-semibold', service.name);
    const category = createElement('p', 'text-sm text-gray-500', service.category);
    const location = createElement('p', 'text-sm text-gray-500', 
        `${service.location} • ${service.distance}`);
    
    infoContainer.appendChild(name);
    infoContainer.appendChild(category);
    infoContainer.appendChild(location);
    
    header.appendChild(img);
    header.appendChild(infoContainer);
    container.appendChild(header);

    // Description section
    const descSection = createElement('div', 'mb-6');
    const descTitle = createElement('h4', 'font-medium mb-2', 'Description:');
    const descText = createElement('p', 'text-sm text-gray-700', service.description);
    descSection.appendChild(descTitle);
    descSection.appendChild(descText);
    container.appendChild(descSection);

    // Services included section
    const servicesSection = createElement('div', 'mb-6');
    const servicesTitle = createElement('h4', 'font-medium mb-2', 'Services Included:');
    const servicesList = createElement('ul', 'list-disc list-inside text-sm text-gray-700');
    
    service.services.forEach(item => {
        const li = createElement('li', '', item);
        servicesList.appendChild(li);
    });
    
    servicesSection.appendChild(servicesTitle);
    servicesSection.appendChild(servicesList);
    container.appendChild(servicesSection);

    // Pricing section
    const pricingSection = createElement('div');
    const pricingTitle = createElement('h4', 'font-medium mb-2', 'Pricing:');
    const pricingText = createElement('p', 'text-sm text-gray-700', 
        `${formatPrice(service.pricing.hourlyRate)}/hr + ${formatPrice(service.pricing.serviceCall)} Service Call`);
    
    pricingSection.appendChild(pricingTitle);
    pricingSection.appendChild(pricingText);
    container.appendChild(pricingSection);
}

function setupStatusSection(role, status) {
    const section = document.getElementById("status-section");
    if (!section || role !== "provider") return;

    section.innerHTML = '';

    // Status display
    const statusText = createElement('p', 'text-sm mb-2');
    statusText.innerHTML = 'Status: ';
    const statusLabel = createElement('span', 'font-medium', status);
    statusLabel.id = 'current-status-label';
    statusText.appendChild(statusLabel);
    section.appendChild(statusText);

    // Status button
    const statusBtn = createButton('Start Service', null, 'btn btn-primary w-full');
    statusBtn.id = 'status-btn';
    section.appendChild(statusBtn);

    updateStatusButton(statusBtn, status);

    // Update status on click
    let currentStatus = status;
    statusBtn.addEventListener("click", () => {
        const bookingId = localStorage.getItem('booking');

        if (currentStatus === "Booked") {
            nextStatus = "In Progress";
        } else if (currentStatus === "In Progress") {
            nextStatus = "Completed";
        }

        updateBookingStatus(bookingId, nextStatus, (error, booking) => {
            if (error) {
                alert(`Failed to update status: ${error}`);
                statusBtn.disabled = false;
                statusBtn.textContent = originalText;
            } else {
                // Update UI with new status
                currentStatus = nextStatus;
                saveToStorage("serviceStatus", currentStatus);
                
                const label = document.getElementById("current-status-label");
                if (label) {
                    label.textContent = currentStatus;
                }
                
                updateStatusButton(statusBtn, currentStatus);
            }
        });;
        
        const label = document.getElementById("current-status-label");
        if (label) {
            label.textContent = currentStatus;
        }
        
        updateStatusButton(statusBtn, currentStatus);
    });
}

function updateStatusButton(btn, status) {
    const statusConfig = {
        "Booked": {
            text: "Start Service",
            className: "btn btn-primary w-full",
            disabled: false
        },
        "In Progress": {
            text: "Mark as Completed",
            className: "btn bg-yellow-500 text-white w-full",
            disabled: false
        },
        "Completed": {
            text: "Service Completed",
            className: "btn bg-green-600 text-white w-full",
            disabled: true
        }
    };

    const config = statusConfig[status];
    if (config) {
        btn.textContent = config.text;
        btn.className = config.className;
        btn.disabled = config.disabled;
    }
}

function setupReviewSection(role, status) {
    if (role !== "client") return;

    const reviewSection = document.getElementById("review-section");
    if (!reviewSection || status !== "Completed") return;

    reviewSection.classList.remove("hidden");

    const submitBtn = document.getElementById("submit-review");
    const confirmation = document.getElementById("review-confirmation");

    if (!submitBtn) return;

    submitBtn.addEventListener("click", () => {
        const ratingEl = document.getElementById("review-rating");
        const commentEl = document.getElementById("review-comment");

        if (!ratingEl || !commentEl) return;

        const rating = ratingEl.value;
        const comment = commentEl.value.trim();

        if (!rating || !comment) {
            alert("Please provide both a rating and a comment.");
            return;
        }

        // Get provider and user IDs from storage
        const providerId = localStorage.getItem('provider');
        const userId = localStorage.getItem('userId');

        if (!providerId || !userId) {
            alert("Missing user information. Please try again.");
            return;
        }

        // Disable button while submitting
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Post the review
        postReview(providerId, userId, rating, comment, (error, review) => {
            if (error) {
                alert(`Failed to submit review: ${error}`);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
            } else {
                // Save review locally for reference
                saveToStorage("clientReview", {
                    rating,
                    comment,
                    date: formatDate(new Date())
                });

                if (confirmation) {
                    confirmation.classList.remove("hidden");
                }
                
                // Keep button disabled after successful submission
                submitBtn.textContent = 'Review Submitted';
            }
        });
    });
}

window.onload = function() {
    const serviceId = localStorage.getItem('service');
    const bookingId = localStorage.getItem('booking');
    const userId = localStorage.getItem('userId');
    
    
    if (serviceId) {
        getService(serviceId);
    } else {
        console.error('No service ID found in storage');
    }

    if (bookingId) {
        getBooking(bookingId);
    } else {
        console.error('No booking ID found in storage');
    }

    if (userId) {
        getUserDetail(userId);
    } else {
        console.error('No user ID found in storage');
    }
};