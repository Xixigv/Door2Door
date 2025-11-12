function renderServiceDetailPage(service, reviews) {
    console.log(reviews);
    if (!service) {
        return createElement('div', 'container mx-auto px-4 py-6', 'Service not found');
    }
    
    const container = createElement('div', 'min-h-screen bg-gray-50');
    const mainContainer = createElement('div', 'container mx-auto px-4 py-6');
    
    // Back button
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
    
    // Reviews card
    const reviewsCard = createCard('Customer Reviews', '');
    const reviewsContainer = createElement('div', 'space-y-6');
    
    reviews.forEach(review => {
        const reviewElement = createReviewCard(review);
        reviewsContainer.appendChild(reviewElement);
    });
    
    reviewsCard.querySelector('.card-content').appendChild(reviewsContainer);
    
    leftColumn.appendChild(headerCard);
    leftColumn.appendChild(providerCard);
    leftColumn.appendChild(servicesCard);
    leftColumn.appendChild(reviewsCard);
    
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

function createReviewCard(review) {
    const container = createElement('div', 'flex space-x-4');
    
    const avatar = createAvatar(review.avatar, review.user, 'avatar');
    
    const content = createElement('div', 'flex-1');
    
    const header = createElement('div', 'flex items-center space-x-2 mb-2');
    const userName = createElement('span', 'font-medium', review.user);
    const ratingContainer = createElement('div', 'flex items-center');
    
    for (let i = 1; i <= 5; i++) {
        const star = createIcon('star', 
            `w-4 h-4 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`
        );
        ratingContainer.appendChild(star);
    }
    
    const date = createElement('span', 'text-sm text-muted-foreground', review.date);
    
    header.appendChild(userName);
    header.appendChild(ratingContainer);
    header.appendChild(date);
    
    const comment = createElement('p', 'text-muted-foreground', review.comment);
    
    content.appendChild(header);
    content.appendChild(comment);
    
    container.appendChild(avatar);
    container.appendChild(content);
    
    return container;
}

function getService(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/services/${id}`, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('value', id);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            // Load reviews for this provider
            if (response.provider && response.provider.id) {
                getReviews({ providerId: response.provider.id, limit: 5 }, (error, reviews) => {
                    if (error) {
                        console.error('Failed to load reviews:', error);
                    } else {
                        console.log("test");
                        const serviceDetailPage = renderServiceDetailPage(response, reviews);
                        let main_content = document.getElementById('main-content');
                        main_content.innerHTML = '';
                        main_content.appendChild(serviceDetailPage);
                        initializeIcons();
                    }
                });
            }
            
        } else {
            console.error('Request failed. Status:', xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error('Request error');
    };

    xhr.send();
}

function getReviews(params = {}, callback) {
    const xhr = new XMLHttpRequest();
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (params.providerId) queryParams.append('providerId', params.providerId);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.minRating) queryParams.append('minRating', params.minRating);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `/reviews${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            const reviews = JSON.parse(xhr.responseText);

            // Enrich reviews with user data
            let completed = 0;
            const enrichedReviews = [];
            console.log(reviews);
            if (reviews.length === 0) return callback(null, []);
            return callback(null, reviews);
            // TODO: enable user data fetching
            // reviews.forEach((review, index) => {
            //     getUserDetail(review.userId, (err, user) => {
            //         if (err) {
            //             enrichedReviews[index] = review; // Use review as is if user fetch fails
            //         } else {
            //             enrichedReviews[index] = {
            //                 ...review,
            //                 user: user.name,
            //                 avatar: user.avatar
            //             };
            //         }
            //         completed++;
            //         if (completed === reviews.length) {
            //             callback(null, enrichedReviews);
            //         }
            //     });
            // });
        } else if (xhr.status === 500) {
            const error = JSON.parse(xhr.responseText);
            callback(error.error, null);
        } else {
            callback('Request failed', null);
        }
    };

    xhr.onerror = function() {
        callback('Network error', null);
    };

    xhr.send();
}


function getUserDetail(userId, /*authenticateToken,*/ ) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/users/detail/${userId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                return response.data;
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

window.onload = function() {
    const serviceId = localStorage.getItem('service');
    getService(serviceId);
}