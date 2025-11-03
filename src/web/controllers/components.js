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



// Progress Bar Component
function createProgressBar(percentage) {
    const container = createElement('div', 'progress');
    const bar = createElement('div', 'progress-bar');
    bar.style.width = `${percentage}%`;
    container.appendChild(bar);
    return container;
}

// Search Result Card Component


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