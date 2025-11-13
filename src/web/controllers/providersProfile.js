function renderProviderProfile(provider) {
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
    
    // Pending set id for booking page
    const bookBtn = createButton(
        '<i data-lucide="calendar" class="w-4 h-4 mr-2"></i>Book Service',
        () => {
            window.location.href = `/booking`;
            localStorage.setItem('provider', provider.id);
        },
        'btn btn-primary btn-lg'
    );
    
    const messageBtn = createButton(
        '<i data-lucide="message-square" class="w-4 h-4 mr-2"></i>Message',
        () => {
            window.location.href = '/chatPage';
        },
        'btn btn-outline btn-sm'
    );
    
    const user = { phone: provider.phone };
    const callBtn = createButton(
        '<i data-lucide="phone" class="w-4 h-4 mr-2"></i>Call',
        () => {
            if (!user.phone) {
            alert('Phone number not available.');
            return;
            }

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'bg-white rounded-lg shadow-lg p-6 w-80 text-center';
            modal.innerHTML = `
            <h2 class="text-lg font-semibold mb-2">Call this number</h2>
            <p class="text-xl font-bold mb-4">${user.phone}</p>
            <div class="flex justify-center space-x-3">
                <button id="cancelCall" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button id="confirmCall" class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Call</button>
            </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Handle buttons
            document.getElementById('cancelCall').onclick = () => overlay.remove();
            document.getElementById('confirmCall').onclick = () => {
            window.location.href = `tel:${user.phone}`;
            overlay.remove();
            };
        },
        'btn btn-outline btn-sm'
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

function getProviders(id)
{

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/providers/${id}`, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('value', id);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const providerProfile = renderProviderProfile(response);
            let main_content = document.getElementById('main-content');
            main_content.innerHTML = '';
            main_content.appendChild(providerProfile);
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
    const providerId = localStorage.getItem('provider');
    getProviders(providerId);
}