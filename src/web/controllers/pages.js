// Page rendering functions for the Door2Door application

// Home Page


// Service Detail Page
function renderServiceDetailPage(serviceId) {
    const service = SERVICE_DETAILS[serviceId];
    if (!service) {
        return createElement('div', 'container mx-auto px-4 py-6', 'Service not found');
    }
    
    const container = createElement('div', 'min-h-screen bg-gray-50');
    const mainContainer = createElement('div', 'container mx-auto px-4 py-6');
    
    // Back button
    const backButton = createElement('a', 'inline-flex items-center text-muted-foreground hover:text-foreground mb-6');
    backButton.href = '#/';
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
        navigateTo(`/profile/provider/${service.provider.id}`);
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
    
    REVIEWS.forEach(review => {
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
        () => navigateTo(`/calendar/${serviceId}`),
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

// Search Page
function renderSearchPage() {
    const container = createElement('div', 'min-h-screen bg-gray-50');
    const mainContainer = createElement('div', 'container mx-auto px-4 py-6');
    
    // Search header
    const searchHeader = createElement('div', 'mb-6');
    const searchRow = createElement('div', 'flex flex-col md:flex-row gap-4 mb-4');
    
    const searchContainer = createElement('div', 'flex-1 relative');
    const searchIcon = createIcon('search', 'absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4');
    const searchInput = createElement('input', 'input pl-10');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for services, providers, or locations...';
    
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    
    const sortContainer = createElement('div', 'flex gap-2');
    
    // Sort dropdown (simplified)
    const sortSelect = createElement('select', 'input w-40');
    const sortOptions = [
        { value: 'relevance', text: 'Relevance' },
        { value: 'price-low', text: 'Price: Low to High' },
        { value: 'price-high', text: 'Price: High to Low' },
        { value: 'rating', text: 'Highest Rated' },
        { value: 'distance', text: 'Nearest First' }
    ];
    
    sortOptions.forEach(option => {
        const optionElement = createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        sortSelect.appendChild(optionElement);
    });
    
    sortContainer.appendChild(sortSelect);
    
    searchRow.appendChild(searchContainer);
    searchRow.appendChild(sortContainer);
    
    const resultsCount = createElement('p', 'text-muted-foreground', `${SEARCH_SERVICES.length} services found`);
    
    searchHeader.appendChild(searchRow);
    searchHeader.appendChild(resultsCount);
    
    // Main content with filters and results
    const contentGrid = createElement('div', 'flex gap-6');
    
    // Filters sidebar (desktop only)
    const filtersCard = createCard('', '');
    filtersCard.className = 'card hidden md:block w-64 shrink-0 sticky top-6';
    
    const filtersHeader = createElement('div', 'flex items-center space-x-2 mb-4');
    const filterIcon = createIcon('filter', 'w-4 h-4');
    const filtersTitle = createElement('h2', 'font-semibold', 'Filters');
    filtersHeader.appendChild(filterIcon);
    filtersHeader.appendChild(filtersTitle);
    
    const filtersContent = createElement('div', 'space-y-6');
    
    // Categories filter
    const categoriesSection = createElement('div');
    const categoriesTitle = createElement('h3', 'font-medium mb-3', 'Categories');
    const categoriesList = createElement('div', 'space-y-2');
    
    CATEGORIES.forEach(category => {
        const categoryRow = createElement('div', 'flex items-center space-x-2');
        const checkbox = createCheckbox(false);
        const label = createElement('label', 'text-sm cursor-pointer', category);
        
        categoryRow.appendChild(checkbox);
        categoryRow.appendChild(label);
        categoriesList.appendChild(categoryRow);
    });
    
    categoriesSection.appendChild(categoriesTitle);
    categoriesSection.appendChild(categoriesList);
    
    filtersContent.appendChild(categoriesSection);
    
    const filtersCardContent = filtersCard.querySelector('.card-content');
    filtersCardContent.appendChild(filtersHeader);
    filtersCardContent.appendChild(filtersContent);
    
    // Results
    const resultsContainer = createElement('div', 'flex-1');
    const resultsGrid = createElement('div', 'space-y-4');
    
    SEARCH_SERVICES.forEach(service => {
        const resultCard = createSearchResultCard(service);
        resultsGrid.appendChild(resultCard);
    });
    
    resultsContainer.appendChild(resultsGrid);
    
    contentGrid.appendChild(filtersCard);
    contentGrid.appendChild(resultsContainer);
    
    mainContainer.appendChild(searchHeader);
    mainContainer.appendChild(contentGrid);
    container.appendChild(mainContainer);
    
    return container;
}

// Calendar Page
function renderCalendarPage(serviceId) {
    const container = createElement('div', 'min-h-screen bg-gray-50');
    const mainContainer = createElement('div', 'container mx-auto px-4 py-6');
    
    // Back button
    const backButton = createElement('a', 'inline-flex items-center text-muted-foreground hover:text-foreground mb-6');
    backButton.href = `#/service/${serviceId}`;
    backButton.innerHTML = '<i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>Back to service details';
    
    const contentGrid = createElement('div', 'grid grid-cols-1 lg:grid-cols-3 gap-8');
    
    // Main content
    const leftColumn = createElement('div', 'lg:col-span-2 space-y-6');
    
    // Calendar card
    const calendarCard = createCard('', '');
    const calendarHeader = createElement('div', 'flex items-center space-x-2 mb-4');
    const calendarIcon = createIcon('calendar', 'w-5 h-5');
    const calendarTitle = createElement('span', 'font-medium', 'Schedule Your Service');
    calendarHeader.appendChild(calendarIcon);
    calendarHeader.appendChild(calendarTitle);
    
    const calendarContent = createElement('div', 'grid grid-cols-1 md:grid-cols-2 gap-8');
    
    // Date selection
    const dateSection = createElement('div');
    const dateTitle = createElement('h3', 'font-medium mb-4', 'Select Date');
    const calendar = createElement('div', 'calendar');
    
    // Simple calendar implementation
    const calendarGrid = createElement('div', 'calendar-grid');
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), i);
        const isDisabled = date < today || date.getDay() === 0; // Disable past dates and Sundays
        
        const dayElement = createCalendarDay(date, false, isDisabled, () => {
            if (!isDisabled) {
                // Remove previous selection
                calendar.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
                // Add selection to clicked day
                dayElement.classList.add('selected');
            }
        });
        
        calendarGrid.appendChild(dayElement);
    }
    
    calendar.appendChild(calendarGrid);
    dateSection.appendChild(dateTitle);
    dateSection.appendChild(calendar);
    
    // Time slots
    const timeSection = createElement('div');
    const timeTitle = createElement('h3', 'font-medium mb-4', 'Available Times');
    const timeSlotsGrid = createElement('div', 'grid grid-cols-2 gap-2');
    
    TIME_SLOTS.forEach(time => {
        const timeSlot = createTimeSlot(time, false, () => {
            // Remove previous selection
            timeSlotsGrid.querySelectorAll('.btn-primary').forEach(btn => {
                btn.className = btn.className.replace('btn-primary', 'btn-outline');
            });
            // Add selection to clicked slot
            timeSlot.className = timeSlot.className.replace('btn-outline', 'btn-primary');
        });
        timeSlotsGrid.appendChild(timeSlot);
    });
    
    timeSection.appendChild(timeTitle);
    timeSection.appendChild(timeSlotsGrid);
    
    calendarContent.appendChild(dateSection);
    calendarContent.appendChild(timeSection);
    
    const calendarCardContent = calendarCard.querySelector('.card-content');
    calendarCardContent.appendChild(calendarHeader);
    calendarCardContent.appendChild(calendarContent);
    
    // Service type card
    const serviceCard = createCard('Service Type', '');
    const serviceOptions = createElement('div', 'space-y-4');
    
    SERVICE_OPTIONS.forEach(option => {
        const optionRow = createElement('div', 'flex items-center space-x-2');
        const radio = createElement('input');
        radio.type = 'radio';
        radio.name = 'serviceType';
        radio.value = option.id;
        radio.className = 'radio';
        
        const label = createElement('label', 'flex-1 cursor-pointer');
        const optionContent = createElement('div', 'flex items-center justify-between');
        
        const optionInfo = createElement('div');
        const optionName = createElement('div', 'font-medium', option.name);
        const optionDuration = createElement('div', 'text-sm text-muted-foreground', option.duration);
        optionInfo.appendChild(optionName);
        optionInfo.appendChild(optionDuration);
        
        const optionPrice = createElement('div', 'font-medium', `$${option.price}/hr`);
        
        optionContent.appendChild(optionInfo);
        optionContent.appendChild(optionPrice);
        label.appendChild(optionContent);
        
        optionRow.appendChild(radio);
        optionRow.appendChild(label);
        serviceOptions.appendChild(optionRow);
    });
    
    serviceCard.querySelector('.card-content').appendChild(serviceOptions);
    
    // Notes card
    const notesCard = createCard('Additional Information', '');
    const notesTextarea = createElement('textarea', 'input textarea min-h-[100px]');
    notesTextarea.placeholder = 'Please describe the issue or provide any additional details about the service needed...';
    notesCard.querySelector('.card-content').appendChild(notesTextarea);
    
    leftColumn.appendChild(calendarCard);
    leftColumn.appendChild(serviceCard);
    leftColumn.appendChild(notesCard);
    
    // Right column - booking summary
    const rightColumn = createElement('div', 'space-y-6');
    
    // Provider info card
    const providerCard = createCard('Service Provider', '');
    const providerInfo = createElement('div', 'flex items-center space-x-3 mb-4');
    const providerAvatar = createAvatar(
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        'Mike Johnson',
        'avatar'
    );
    
    const providerDetails = createElement('div');
    const providerName = createElement('h3', 'font-medium', 'Mike Johnson');
    const providerService = createElement('p', 'text-sm text-muted-foreground', 'Professional Plumbing');
    const providerRating = createElement('div', 'flex items-center space-x-1 mt-1');
    const starIcon = createIcon('star', 'w-4 h-4 fill-yellow-400 text-yellow-400');
    const rating = createElement('span', 'text-sm', '4.9');
    
    providerRating.appendChild(starIcon);
    providerRating.appendChild(rating);
    
    providerDetails.appendChild(providerName);
    providerDetails.appendChild(providerService);
    providerDetails.appendChild(providerRating);
    
    providerInfo.appendChild(providerAvatar);
    providerInfo.appendChild(providerDetails);
    
    const availabilityBadge = createBadge('Available Today', 'badge badge-outline text-green-700 border-green-700 w-full justify-center');
    
    const providerCardContent = providerCard.querySelector('.card-content');
    providerCardContent.appendChild(providerInfo);
    providerCardContent.appendChild(availabilityBadge);
    
    // Booking summary card
    const summaryCard = createCard('Booking Summary', '');
    const summaryContent = createElement('div', 'space-y-4');
    
    const summaryItems = createElement('div', 'space-y-3');
    const dateItem = createElement('div', 'flex justify-between text-sm');
    dateItem.innerHTML = '<span>Date:</span><span class="font-medium">Not selected</span>';
    
    const timeItem = createElement('div', 'flex justify-between text-sm');
    timeItem.innerHTML = '<span>Time:</span><span class="font-medium">Not selected</span>';
    
    const serviceItem = createElement('div', 'flex justify-between text-sm');
    serviceItem.innerHTML = '<span>Service:</span><span class="font-medium">Not selected</span>';
    
    summaryItems.appendChild(dateItem);
    summaryItems.appendChild(timeItem);
    summaryItems.appendChild(serviceItem);
    
    const pricing = createElement('div', 'pt-4 border-t');
    const serviceCallFee = createElement('div', 'flex justify-between mb-2');
    serviceCallFee.innerHTML = '<span>Service Call Fee:</span><span>$45</span>';
    
    const hourlyRate = createElement('div', 'flex justify-between mb-2');
    hourlyRate.innerHTML = '<span>Hourly Rate:</span><span>$75/hr</span>';
    
    const total = createElement('div', 'flex justify-between font-medium text-lg pt-2 border-t');
    total.innerHTML = '<span>Estimated Total:</span><span>$120</span>';
    
    const disclaimer = createElement('p', 'text-xs text-muted-foreground mt-2', 
        '*Final cost may vary based on actual time and materials used');
    
    pricing.appendChild(serviceCallFee);
    pricing.appendChild(hourlyRate);
    pricing.appendChild(total);
    pricing.appendChild(disclaimer);
    
    const confirmBtn = createButton('Confirm Booking', () => {
        // Show confirmation
        alert('Booking confirmed! You will receive a confirmation email shortly.');
    }, 'btn btn-primary w-full btn-lg mb-3');
    
    const guarantees = createElement('div', 'text-xs text-muted-foreground space-y-1');
    const guaranteeItems = [
        '✓ Licensed & Insured',
        '✓ 30-day warranty',
        '✓ Satisfaction guaranteed',
        '✓ Background checked'
    ];
    
    guaranteeItems.forEach(item => {
        const guarantee = createElement('p', '', item);
        guarantees.appendChild(guarantee);
    });
    
    summaryContent.appendChild(summaryItems);
    summaryContent.appendChild(pricing);
    summaryContent.appendChild(confirmBtn);
    summaryContent.appendChild(guarantees);
    
    summaryCard.querySelector('.card-content').appendChild(summaryContent);
    
    rightColumn.appendChild(providerCard);
    rightColumn.appendChild(summaryCard);
    
    contentGrid.appendChild(leftColumn);
    contentGrid.appendChild(rightColumn);
    
    mainContainer.appendChild(backButton);
    mainContainer.appendChild(contentGrid);
    container.appendChild(mainContainer);
    
    return container;
}

// User Profile Page
function renderUserProfile() {
    const container = createElement('div', 'min-h-screen bg-gray-50');
    const mainContainer = createElement('div', 'container mx-auto px-4 py-6');
    
    // Profile header
    const profileCard = createCard('', '');
    const profileContent = createElement('div', 'flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6');
    
    const avatar = createAvatar(USER_DATA.avatar, USER_DATA.name, 'avatar avatar-xl');
    
    const userInfo = createElement('div', 'flex-1');
    const userName = createElement('h1', 'text-2xl font-bold mb-2', USER_DATA.name);
    const userDetails = createElement('div', 'space-y-1 text-muted-foreground mb-4');
    
    const locationInfo = createElement('div', 'flex items-center space-x-2');
    const locationIcon = createIcon('map-pin', 'w-4 h-4');
    const location = createElement('span', '', USER_DATA.location);
    locationInfo.appendChild(locationIcon);
    locationInfo.appendChild(location);
    
    const memberSince = createElement('div', '', `Member since ${USER_DATA.memberSince}`);
    
    userDetails.appendChild(locationInfo);
    userDetails.appendChild(memberSince);
    
    const userStats = createElement('div', 'flex flex-wrap gap-4 text-sm');
    const bookingsStats = createElement('div', 'bg-primary/10 px-3 py-1 rounded-full');
    bookingsStats.innerHTML = `<span class="font-medium">${USER_DATA.totalBookings}</span> bookings completed`;
    
    const spentStats = createElement('div', 'bg-green-100 px-3 py-1 rounded-full');
    spentStats.innerHTML = `<span class="font-medium">$${USER_DATA.totalSpent}</span> total spent`;
    
    userStats.appendChild(bookingsStats);
    userStats.appendChild(spentStats);
    
    userInfo.appendChild(userName);
    userInfo.appendChild(userDetails);
    userInfo.appendChild(userStats);
    
    const editBtn = createButton(
        '<i data-lucide="settings" class="w-4 h-4 mr-2"></i>Edit Profile',
        null,
        'btn btn-outline'
    );
    
    profileContent.appendChild(avatar);
    profileContent.appendChild(userInfo);
    profileContent.appendChild(editBtn);
    
    profileCard.querySelector('.card-content').appendChild(profileContent);
    
    // Tabs
    const tabsContainer = createElement('div', 'mt-6');
    const tabsList = createElement('div', 'tabs-list');
    
    const tabs = [
        { id: 'bookings', label: 'Bookings' },
        { id: 'favorites', label: 'Favorites' },
        { id: 'payments', label: 'Payments' },
        { id: 'settings', label: 'Settings' }
    ];
    
    tabs.forEach((tab, index) => {
        const tabTrigger = createElement('button', 
            `tabs-trigger ${index === 0 ? 'active' : ''}`, 
            tab.label
        );
        
        tabTrigger.addEventListener('click', () => {
            // Switch tabs
            tabsList.querySelectorAll('.tabs-trigger').forEach(t => t.classList.remove('active'));
            tabTrigger.classList.add('active');
            
            // Switch content
            document.querySelectorAll('.tabs-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`tab-${tab.id}`).classList.add('active');
        });
        
        tabsList.appendChild(tabTrigger);
    });
    
    // Tab content
    const bookingsContent = createElement('div', 'tabs-content active grid grid-cols-1 lg:grid-cols-2 gap-6');
    bookingsContent.id = 'tab-bookings';
    
    const recentBookingsCard = createCard('Recent Bookings', '');
    const bookingsContainer = createElement('div', 'space-y-4');
    
    BOOKING_HISTORY.forEach(booking => {
        const bookingItem = createBookingHistoryItem(booking);
        bookingsContainer.appendChild(bookingItem);
    });
    
    recentBookingsCard.querySelector('.card-content').appendChild(bookingsContainer);
    
    const quickActionsCard = createCard('Quick Actions', '');
    const actionsContainer = createElement('div', 'space-y-3');
    
    const actions = [
        { icon: 'calendar', text: 'Book New Service', href: '#/search' },
        { icon: 'star', text: 'Leave Reviews', href: '#' },
        { icon: 'credit-card', text: 'Payment History', href: '#' },
        { icon: 'bell', text: 'Notification Settings', href: '#' }
    ];
    
    actions.forEach(action => {
        const actionBtn = createButton(
            `<i data-lucide="${action.icon}" class="w-4 h-4 mr-2"></i>${action.text}`,
            () => {
                if (action.href !== '#') {
                    window.location.hash = action.href;
                }
            },
            'btn btn-outline w-full justify-start'
        );
        actionsContainer.appendChild(actionBtn);
    });
    
    quickActionsCard.querySelector('.card-content').appendChild(actionsContainer);
    
    bookingsContent.appendChild(recentBookingsCard);
    bookingsContent.appendChild(quickActionsCard);
    
    // Other tab contents (simplified)
    const favoritesContent = createElement('div', 'tabs-content', '<p>Favorites content would go here...</p>');
    favoritesContent.id = 'tab-favorites';
    
    const paymentsContent = createElement('div', 'tabs-content', '<p>Payments content would go here...</p>');
    paymentsContent.id = 'tab-payments';
    
    const settingsContent = createElement('div', 'tabs-content', '<p>Settings content would go here...</p>');
    settingsContent.id = 'tab-settings';
    
    tabsContainer.appendChild(tabsList);
    tabsContainer.appendChild(bookingsContent);
    tabsContainer.appendChild(favoritesContent);
    tabsContainer.appendChild(paymentsContent);
    tabsContainer.appendChild(settingsContent);
    
    mainContainer.appendChild(profileCard);
    mainContainer.appendChild(tabsContainer);
    container.appendChild(mainContainer);
    
    return container;
}

// Provider Profile Page
function renderProviderProfile(providerId) {
    const provider = PROVIDER_DATA[providerId];
    if (!provider) {
        return createElement('div', 'container mx-auto px-4 py-6', 'Provider not found');
    }
    
    const container = createElement('div', 'min-h-screen bg-gray-50');
    
    // Cover image
    const coverSection = createElement('div', 'relative h-64 bg-gradient-to-r from-primary to-primary/80');
    const coverImage = createElement('img', 'w-full h-full object-cover opacity-30');
    coverImage.src = provider.coverImage;
    coverSection.appendChild(coverImage);
    
    const mainContainer = createElement('div', 'container mx-auto px-4 -mt-32 relative z-10');
    
    // Profile header
    const profileCard = createCard('', '');
    const profileContent = createElement('div', 'flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6');
    
    const avatar = createAvatar(provider.avatar, provider.name, 'avatar avatar-xl border-4 border-white shadow-lg');
    
    const providerInfo = createElement('div', 'flex-1');
    const providerName = createElement('h1', 'text-3xl font-bold mb-2', provider.name);
    const providerTitle = createElement('p', 'text-xl text-muted-foreground mb-3', provider.title);
    
    const ratingRow = createElement('div', 'flex items-center space-x-4 mb-3');
    const ratingContainer = createElement('div', 'flex items-center space-x-1');
    const starIcon = createIcon('star', 'w-5 h-5 fill-yellow-400 text-yellow-400');
    const rating = createElement('span', 'font-semibold', provider.rating.toString());
    const reviewCount = createElement('span', 'text-muted-foreground', `(${provider.reviewCount} reviews)`);
    
    ratingContainer.appendChild(starIcon);
    ratingContainer.appendChild(rating);
    ratingContainer.appendChild(reviewCount);
    
    const availabilityBadge = createBadge(provider.availability, 'badge badge-outline text-green-700 border-green-700');
    
    ratingRow.appendChild(ratingContainer);
    ratingRow.appendChild(availabilityBadge);
    
    const locationRow = createElement('div', 'flex items-center space-x-4 text-sm text-muted-foreground');
    const locationInfo = createElement('div', 'flex items-center');
    const locationIcon = createIcon('map-pin', 'w-4 h-4 mr-1');
    const location = createElement('span', '', provider.location);
    locationInfo.appendChild(locationIcon);
    locationInfo.appendChild(location);
    
    const memberSince = createElement('div', '', `Member since ${provider.joinDate}`);
    
    locationRow.appendChild(locationInfo);
    locationRow.appendChild(memberSince);
    
    providerInfo.appendChild(providerName);
    providerInfo.appendChild(providerTitle);
    providerInfo.appendChild(ratingRow);
    providerInfo.appendChild(locationRow);
    
    const actionButtons = createElement('div', 'flex flex-wrap gap-3 mt-4 md:mt-0');
    
    const bookBtn = createButton(
        '<i data-lucide="calendar" class="w-4 h-4 mr-2"></i>Book Service',
        () => navigateTo('/calendar/1'),
        'btn btn-primary btn-lg'
    );
    
    const messageBtn = createButton(
        '<i data-lucide="message-square" class="w-4 h-4 mr-2"></i>Message',
        null,
        'btn btn-outline btn-lg'
    );
    
    const callBtn = createButton(
        '<i data-lucide="phone" class="w-4 h-4 mr-2"></i>Call',
        null,
        'btn btn-outline btn-lg'
    );
    
    actionButtons.appendChild(bookBtn);
    actionButtons.appendChild(messageBtn);
    actionButtons.appendChild(callBtn);
    
    profileContent.appendChild(avatar);
    profileContent.appendChild(providerInfo);
    profileContent.appendChild(actionButtons);
    
    profileCard.querySelector('.card-content').appendChild(profileContent);
    
    const contentGrid = createElement('div', 'grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6');
    
    // Main content
    const leftColumn = createElement('div', 'lg:col-span-2 space-y-6');
    
    // About card
    const aboutCard = createCard('About', provider.bio);
    
    // Services card
    const servicesCard = createCard('Services Offered', '');
    const servicesGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 gap-3');
    
    provider.services.forEach(service => {
        const serviceRow = createElement('div', 'flex items-center space-x-2 p-3 bg-gray-50 rounded-lg');
        const checkIcon = createIcon('check-circle', 'w-4 h-4 text-green-600');
        const serviceText = createElement('span', '', service);
        serviceRow.appendChild(checkIcon);
        serviceRow.appendChild(serviceText);
        servicesGrid.appendChild(serviceRow);
    });
    
    servicesCard.querySelector('.card-content').appendChild(servicesGrid);
    
    leftColumn.appendChild(aboutCard);
    leftColumn.appendChild(servicesCard);
    
    // Sidebar
    const rightColumn = createElement('div', 'space-y-6');
    
    // Stats card
    const statsCard = createCard('Statistics', '');
    const statsContent = createElement('div', 'space-y-4');
    
    const stats = [
        { icon: 'award', label: 'Jobs Completed', value: provider.completedJobs, color: 'text-blue-600' },
        { icon: 'clock', label: 'Response Time', value: provider.responseTime, color: 'text-green-600' },
        { icon: 'calendar', label: 'Experience', value: `${provider.yearsExperience} years`, color: 'text-purple-600' },
        { icon: 'star', label: 'Rating', value: `${provider.rating}/5.0`, color: 'text-yellow-600' }
    ];
    
    stats.forEach(stat => {
        const statRow = createElement('div', 'flex items-center justify-between');
        const leftSide = createElement('div', 'flex items-center space-x-2');
        const icon = createIcon(stat.icon, `w-4 h-4 ${stat.color}`);
        const label = createElement('span', 'text-sm', stat.label);
        leftSide.appendChild(icon);
        leftSide.appendChild(label);
        
        const value = createElement('span', 'font-semibold', stat.value.toString());
        
        statRow.appendChild(leftSide);
        statRow.appendChild(value);
        statsContent.appendChild(statRow);
    });
    
    statsCard.querySelector('.card-content').appendChild(statsContent);
    
    // Pricing card
    const pricingCard = createCard('Pricing', '');
    const pricingContent = createElement('div', 'text-center mb-4');
    const mainPrice = createElement('div', 'text-3xl font-bold', `$${provider.hourlyRate}/hr`);
    const priceLabel = createElement('p', 'text-sm text-muted-foreground', 'Starting rate');
    
    pricingContent.appendChild(mainPrice);
    pricingContent.appendChild(priceLabel);
    
    const pricingDetails = createElement('div', 'space-y-2 text-sm');
    const serviceCallFee = createElement('div', 'flex justify-between');
    serviceCallFee.innerHTML = '<span>Service Call Fee</span><span>$45</span>';
    
    const emergencyRate = createElement('div', 'flex justify-between');
    emergencyRate.innerHTML = '<span>Emergency Rate</span><span>$125/hr</span>';
    
    pricingDetails.appendChild(serviceCallFee);
    pricingDetails.appendChild(emergencyRate);
    
    const pricingCardContent = pricingCard.querySelector('.card-content');
    pricingCardContent.appendChild(pricingContent);
    pricingCardContent.appendChild(pricingDetails);
    
    rightColumn.appendChild(statsCard);
    rightColumn.appendChild(pricingCard);
    
    contentGrid.appendChild(leftColumn);
    contentGrid.appendChild(rightColumn);
    
    mainContainer.appendChild(profileCard);
    mainContainer.appendChild(contentGrid);
    container.appendChild(coverSection);
    container.appendChild(mainContainer);
    
    return container;
}

// Chat Page
function renderChatPage() {
    const container = createElement('div', 'h-[calc(100vh-80px)] bg-gray-50');
    const chatContainer = createElement('div', 'h-full flex');
    
    // Conversations list
    const conversationsList = createElement('div', 'w-1/3 bg-white border-r flex flex-col');
    
    const conversationsHeader = createElement('div', 'p-4 border-b');
    const headerRow = createElement('div', 'flex items-center justify-between');
    const title = createElement('h2', 'text-xl font-bold', 'Messages');
    const backBtn = createButton(
        '<i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>Back',
        () => navigateTo('/'),
        'btn btn-ghost btn-sm'
    );
    
    headerRow.appendChild(title);
    headerRow.appendChild(backBtn);
    conversationsHeader.appendChild(headerRow);
    
    const conversationsContent = createElement('div', 'flex-1 overflow-y-auto p-2');
    
    CHAT_CONVERSATIONS.forEach((conversation, index) => {
        const conversationItem = createElement('div', 
            `p-3 rounded-lg cursor-pointer transition-colors ${
                index === 0 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50'
            }`
        );
        
        const conversationContent = createElement('div', 'flex items-start space-x-3');
        
        const avatarContainer = createElement('div', 'relative');
        const avatar = createAvatar(conversation.avatar, conversation.name, 'avatar');
        avatarContainer.appendChild(avatar);
        
        if (conversation.online) {
            const onlineIndicator = createElement('div', 'absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white');
            avatarContainer.appendChild(onlineIndicator);
        }
        
        const textContent = createElement('div', 'flex-1 min-w-0');
        const headerRow = createElement('div', 'flex items-center justify-between mb-1');
        const name = createElement('h3', 'font-medium truncate', conversation.name);
        
        const rightSide = createElement('div', 'flex items-center space-x-2');
        const timestamp = createElement('span', 'text-xs text-muted-foreground', conversation.timestamp);
        rightSide.appendChild(timestamp);
        
        if (conversation.unread > 0) {
            const unreadBadge = createBadge(conversation.unread.toString(), 'badge badge-destructive h-5 min-w-5 text-xs');
            rightSide.appendChild(unreadBadge);
        }
        
        headerRow.appendChild(name);
        headerRow.appendChild(rightSide);
        
        const service = createElement('p', 'text-sm text-muted-foreground mb-1', conversation.service);
        const lastMessage = createElement('p', 'text-sm text-muted-foreground truncate', conversation.lastMessage);
        
        textContent.appendChild(headerRow);
        textContent.appendChild(service);
        textContent.appendChild(lastMessage);
        
        conversationContent.appendChild(avatarContainer);
        conversationContent.appendChild(textContent);
        conversationItem.appendChild(conversationContent);
        
        conversationsContent.appendChild(conversationItem);
    });
    
    conversationsList.appendChild(conversationsHeader);
    conversationsList.appendChild(conversationsContent);
    
    // Chat area
    const chatArea = createElement('div', 'flex-1 flex flex-col bg-white');
    
    // Chat header
    const chatHeader = createElement('div', 'p-4 border-b');
    const chatHeaderContent = createElement('div', 'flex items-center justify-between');
    
    const activeConversation = CHAT_CONVERSATIONS[0];
    const chatHeaderLeft = createElement('div', 'flex items-center space-x-3');
    const chatAvatar = createAvatar(activeConversation.avatar, activeConversation.name, 'avatar');
    
    const chatUserInfo = createElement('div');
    const chatUserName = createElement('h3', 'font-medium', activeConversation.name);
    const chatUserStatus = createElement('p', 'text-sm text-muted-foreground', 
        `${activeConversation.service} • ${activeConversation.online ? 'Online' : 'Offline'}`);
    
    chatUserInfo.appendChild(chatUserName);
    chatUserInfo.appendChild(chatUserStatus);
    
    chatHeaderLeft.appendChild(chatAvatar);
    chatHeaderLeft.appendChild(chatUserInfo);
    
    const chatActions = createElement('div', 'flex items-center space-x-2');
    const phoneBtn = createButton('<i data-lucide="phone" class="w-4 h-4"></i>', null, 'btn btn-ghost btn-sm');
    const videoBtn = createButton('<i data-lucide="video" class="w-4 h-4"></i>', null, 'btn btn-ghost btn-sm');
    const moreBtn = createButton('<i data-lucide="more-vertical" class="w-4 h-4"></i>', null, 'btn btn-ghost btn-sm');
    
    chatActions.appendChild(phoneBtn);
    chatActions.appendChild(videoBtn);
    chatActions.appendChild(moreBtn);
    
    chatHeaderContent.appendChild(chatHeaderLeft);
    chatHeaderContent.appendChild(chatActions);
    chatHeader.appendChild(chatHeaderContent);
    
    // Messages
    const messagesArea = createElement('div', 'flex-1 overflow-y-auto p-4');
    const messagesContainer = createElement('div', 'space-y-4');
    
    CHAT_MESSAGES.forEach(message => {
        const messageElement = createChatMessage(message);
        messagesContainer.appendChild(messageElement);
    });
    
    messagesArea.appendChild(messagesContainer);
    
    // Message input
    const messageInput = createElement('div', 'p-4 border-t');
    const inputForm = createElement('form', 'flex space-x-2');
    
    const textInput = createElement('input', 'input flex-1');
    textInput.type = 'text';
    textInput.placeholder = 'Type a message...';
    
    const sendBtn = createButton('<i data-lucide="send" class="w-4 h-4"></i>', null, 'btn btn-primary');
    
    inputForm.appendChild(textInput);
    inputForm.appendChild(sendBtn);
    messageInput.appendChild(inputForm);
    
    chatArea.appendChild(chatHeader);
    chatArea.appendChild(messagesArea);
    chatArea.appendChild(messageInput);
    
    chatContainer.appendChild(conversationsList);
    chatContainer.appendChild(chatArea);
    container.appendChild(chatContainer);
    
    return container;
}