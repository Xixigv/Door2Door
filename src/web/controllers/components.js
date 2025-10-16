// Reusable component functions for the Door2Door application

// Service Card Component


// Provider Card Component


// Review Component
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

// Booking History Item Component
function createBookingHistoryItem(booking) {
    const container = createElement('div', 'flex items-center space-x-4 p-4 border rounded-lg');
    
    const image = createElement('img', 'w-12 h-12 rounded-lg object-cover');
    image.src = booking.image;
    image.alt = booking.service;
    
    const content = createElement('div', 'flex-1');
    
    const header = createElement('div', 'flex items-center justify-between mb-1');
    const serviceName = createElement('h4', 'font-medium', booking.service);
    const badge = createBadge(
        booking.status,
        booking.status === 'Completed' ? 'badge badge-default' : 'badge badge-secondary'
    );
    
    header.appendChild(serviceName);
    header.appendChild(badge);
    
    const providerName = createElement('p', 'text-sm text-muted-foreground', booking.provider);
    
    const footer = createElement('div', 'flex items-center justify-between mt-2');
    const date = createElement('span', 'text-sm text-muted-foreground', booking.date);
    
    const rightSide = createElement('div', 'flex items-center space-x-2');
    const amount = createElement('span', 'font-medium', `$${booking.amount}`);
    rightSide.appendChild(amount);
    
    if (booking.rating) {
        const ratingContainer = createElement('div', 'flex items-center space-x-1');
        const starIcon = createIcon('star', 'w-4 h-4 fill-yellow-400 text-yellow-400');
        const rating = createElement('span', 'text-sm', booking.rating.toString());
        ratingContainer.appendChild(starIcon);
        ratingContainer.appendChild(rating);
        rightSide.appendChild(ratingContainer);
    }
    
    footer.appendChild(date);
    footer.appendChild(rightSide);
    
    content.appendChild(header);
    content.appendChild(providerName);
    content.appendChild(footer);
    
    container.appendChild(image);
    container.appendChild(content);
    
    return container;
}

// Chat Message Component
function createChatMessage(message) {
    const container = createElement('div', 
        `flex ${message.isProvider ? 'justify-start' : 'justify-end'}`
    );
    
    const messageContainer = createElement('div', 
        `flex items-start space-x-2 max-w-[70%] ${
            message.isProvider ? 'flex-row' : 'flex-row-reverse space-x-reverse'
        }`
    );
    
    if (message.isProvider && message.avatar) {
        const avatar = createAvatar(message.avatar, message.sender, 'avatar avatar-sm');
        messageContainer.appendChild(avatar);
    }
    
    const bubble = createElement('div', 
        `rounded-lg p-3 ${
            message.isProvider
                ? 'bg-gray-100'
                : 'bg-primary text-primary-foreground'
        }`
    );
    
    const text = createElement('p', 'text-sm', message.message);
    const timestamp = createElement('p', 
        `text-xs mt-1 ${
            message.isProvider ? 'text-gray-500' : 'text-primary-foreground/70'
        }`,
        message.timestamp
    );
    
    bubble.appendChild(text);
    bubble.appendChild(timestamp);
    messageContainer.appendChild(bubble);
    
    container.appendChild(messageContainer);
    
    return container;
}

// Calendar Day Component
function createCalendarDay(date, isSelected = false, isDisabled = false, onClick = null) {
    const day = createElement('div', 
        `calendar-day ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`,
        date.getDate().toString()
    );
    
    if (onClick && !isDisabled) {
        day.addEventListener('click', onClick);
    }
    
    return day;
}

// Time Slot Component
function createTimeSlot(time, isSelected = false, onClick = null) {
    const slot = createButton(
        `<i data-lucide="clock" class="w-4 h-4 mr-2"></i>${time}`,
        onClick,
        `btn ${isSelected ? 'btn-primary' : 'btn-outline'} btn-sm justify-start`
    );
    
    return slot;
}

// Progress Bar Component
function createProgressBar(percentage) {
    const container = createElement('div', 'progress');
    const bar = createElement('div', 'progress-bar');
    bar.style.width = `${percentage}%`;
    container.appendChild(bar);
    return container;
}

// Search Result Card Component
function createSearchResultCard(service) {
    const card = createElement('div', 'card hover:shadow-md transition-shadow');
    
    const cardContent = createElement('div', 'card-content p-6');
    
    const container = createElement('div', 'flex flex-col md:flex-row gap-6');
    
    // Image
    const imageContainer = createElement('div', 'w-full md:w-48 h-32 md:h-24 relative');
    const image = createElement('img', 'w-full h-full object-cover rounded-lg');
    image.src = service.image;
    image.alt = service.name;
    imageContainer.appendChild(image);
    
    if (service.availableToday) {
        const badge = createBadge('Available Today', 'badge bg-green-600 text-white absolute top-2 left-2');
        imageContainer.appendChild(badge);
    }
    
    // Content
    const content = createElement('div', 'flex-1');
    
    const header = createElement('div', 'flex flex-col md:flex-row md:items-start md:justify-between mb-3');
    
    const leftSide = createElement('div');
    const title = createElement('h3', 'text-lg font-semibold mb-2', service.name);
    
    const providerRow = createElement('div', 'flex items-center space-x-4 mb-2');
    const providerInfo = createElement('div', 'flex items-center space-x-2');
    const avatar = createAvatar(service.provider.avatar, service.provider.name, 'avatar avatar-sm');
    const providerName = createElement('span', 'text-sm', service.provider.name);
    
    providerInfo.appendChild(avatar);
    providerInfo.appendChild(providerName);
    
    if (service.provider.verified) {
        const verifiedBadge = createBadge('Verified', 'badge badge-secondary text-xs');
        providerInfo.appendChild(verifiedBadge);
    }
    
    providerRow.appendChild(providerInfo);
    
    const detailsRow = createElement('div', 'flex items-center space-x-4 text-sm text-muted-foreground');
    
    const ratingContainer = createElement('div', 'flex items-center space-x-1');
    const starIcon = createIcon('star', 'w-4 h-4 fill-yellow-400 text-yellow-400');
    const rating = createElement('span', service.provider.rating.toString());
    const reviewCount = createElement('span', `(${service.provider.reviews} reviews)`);
    
    ratingContainer.appendChild(starIcon);
    ratingContainer.appendChild(rating);
    ratingContainer.appendChild(reviewCount);
    
    const locationContainer = createElement('div', 'flex items-center space-x-1');
    const locationIcon = createIcon('map-pin', 'w-4 h-4');
    const location = createElement('span', `${service.location} • ${service.distance} mi`);
    
    locationContainer.appendChild(locationIcon);
    locationContainer.appendChild(location);
    
    const responseContainer = createElement('div', 'flex items-center space-x-1');
    const clockIcon = createIcon('clock', 'w-4 h-4');
    const responseTime = createElement('span', `Responds in ${service.responseTime}`);
    
    responseContainer.appendChild(clockIcon);
    responseContainer.appendChild(responseTime);
    
    detailsRow.appendChild(ratingContainer);
    detailsRow.appendChild(locationContainer);
    detailsRow.appendChild(responseContainer);
    
    leftSide.appendChild(title);
    leftSide.appendChild(providerRow);
    leftSide.appendChild(detailsRow);
    
    // Right side - pricing and actions
    const rightSide = createElement('div', 'text-right mt-4 md:mt-0');
    const price = createElement('div', 'text-2xl font-bold mb-2', `$${service.price}/hr`);
    
    const actions = createElement('div', 'space-y-2');
    const viewDetailsBtn = createButton('View Details', () => {
        navigateTo(`/service/${service.id}`);
    }, 'btn btn-primary w-full md:w-auto');
    
    const bookBtn = createButton('Book Now', () => {
        navigateTo(`/calendar/${service.id}`);
    }, 'btn btn-outline w-full md:w-auto');
    
    actions.appendChild(viewDetailsBtn);
    actions.appendChild(bookBtn);
    
    rightSide.appendChild(price);
    rightSide.appendChild(actions);
    
    header.appendChild(leftSide);
    header.appendChild(rightSide);
    
    content.appendChild(header);
    container.appendChild(imageContainer);
    container.appendChild(content);
    cardContent.appendChild(container);
    card.appendChild(cardContent);
    
    return card;
}

// Slider Component
function createSlider(min, max, value, onChange, step = 1) {
    const container = createElement('div', 'slider');
    const track = createElement('div', 'slider-track');
    const range = createElement('div', 'slider-range');
    const thumb = createElement('div', 'slider-thumb');
    
    function updateSlider(newValue) {
        const percentage = ((newValue - min) / (max - min)) * 100;
        range.style.width = `${percentage}%`;
        thumb.style.left = `${percentage}%`;
    }
    
    updateSlider(value);
    
    let isDragging = false;
    
    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const rect = track.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const newValue = Math.round(min + (percentage / 100) * (max - min));
        
        updateSlider(newValue);
        if (onChange) onChange(newValue);
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    track.appendChild(range);
    container.appendChild(track);
    container.appendChild(thumb);
    
    return container;
}

// Checkbox Component
function createCheckbox(checked = false, onChange = null) {
    const container = createElement('div', 'checkbox');
    const icon = createIcon('check', 'checkbox-icon');
    
    if (checked) {
        container.classList.add('checked');
    }
    
    container.appendChild(icon);
    
    container.addEventListener('click', () => {
        const isChecked = container.classList.toggle('checked');
        if (onChange) onChange(isChecked);
    });
    
    return container;
}