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
    
    // const resultsCount = createElement('p', 'text-muted-foreground', `${SEARCH_SERVICES.length} services found`);
    
    searchHeader.appendChild(searchRow);
    // searchHeader.appendChild(resultsCount);
    
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
    // TODO: Implement categories filter
    // const categoriesSection = createElement('div');
    // const categoriesTitle = createElement('h3', 'font-medium mb-3', 'Categories');
    // const categoriesList = createElement('div', 'space-y-2');
    
    // CATEGORIES.forEach(category => {
    //     const categoryRow = createElement('div', 'flex items-center space-x-2');
    //     const checkbox = createCheckbox(false);
    //     const label = createElement('label', 'text-sm cursor-pointer', category);
        
    //     categoryRow.appendChild(checkbox);
    //     categoryRow.appendChild(label);
    //     categoriesList.appendChild(categoryRow);
    // });
    
    // categoriesSection.appendChild(categoriesTitle);
    // categoriesSection.appendChild(categoriesList);
    
    // filtersContent.appendChild(categoriesSection);
    
    const filtersCardContent = filtersCard.querySelector('.card-content');
    filtersCardContent.appendChild(filtersHeader);
    filtersCardContent.appendChild(filtersContent);
    
    // Results
    const resultsContainer = createElement('div', 'flex-1');
    const resultsGrid = createElement('div', 'space-y-4');
    resultsGrid.id = 'resultsGrid';
    
    resultsContainer.appendChild(resultsGrid);
    
    contentGrid.appendChild(filtersCard);
    contentGrid.appendChild(resultsContainer);
    
    mainContainer.appendChild(searchHeader);
    mainContainer.appendChild(contentGrid);
    container.appendChild(mainContainer);
    
    return container;
}

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
    const avatar = createAvatar(service.provider.image, service.provider.name, 'avatar avatar-sm');
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
    const rating = createElement('span', null, service.provider.rating.toString());
    const reviewCount = createElement('span', null, `(${service.provider.reviewCount} reviews)`);
    
    ratingContainer.appendChild(starIcon);
    ratingContainer.appendChild(rating);
    ratingContainer.appendChild(reviewCount);
    
    const locationContainer = createElement('div', 'flex items-center space-x-1');
    const locationIcon = createIcon('map-pin', 'w-4 h-4');
    const location = createElement('span', null, `${service.location} • ${service.distance} mi`);
    
    locationContainer.appendChild(locationIcon);
    locationContainer.appendChild(location);
    
    const responseContainer = createElement('div', 'flex items-center space-x-1');
    const clockIcon = createIcon('clock', 'w-4 h-4');
    const responseTime = createElement('span', null, `${service.provider.responseTime}`);
    
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
    const price = createElement('div', 'text-2xl font-bold mb-2', `$${service.pricing.hourlyRate}/hr`);
    
    const actions = createElement('div', 'space-y-2');
    const viewDetailsBtn = createButton('View Details', () => {
        localStorage.setItem('service', service.id);
        window.location.href = `/serviceDetail`;
    }, 'btn btn-primary w-full md:w-auto');
    
    // ToDo : implement booking flow
    const bookBtn = createButton('Book Now', () => {
        localStorage.setItem('service', service.id);
        window.location.href = `/calendar/${service.id}`;
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

function getServices(){

    const xhr = new XMLHttpRequest();
    // Link
    xhr.open('GET', 'http://localhost:3000/services/all', true);
    
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            response.forEach(service => {
                const resultCard = createSearchResultCard(service);
                let resultsGrid = document.getElementById('resultsGrid');
                resultsGrid.append(resultCard);
            });
    
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
    const searchPage = renderSearchPage();
    let main_content = document.getElementById('main-content');
    main_content.innerHTML = '';
    main_content.appendChild(searchPage);
    getServices();
}