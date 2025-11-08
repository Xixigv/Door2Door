// : Global state for filtering**
const searchState = {
    allServices: [],
    selectedCategories: new Set(),
    allCategories: [],
    searchQuery: ''
};

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
    
    // : Real-time search event listener**
    searchInput.addEventListener('input', (e) => {
        searchState.searchQuery = e.target.value.toLowerCase();
        filterAndDisplayServices();
    });
    
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
    
    // : Sort event listener**
    sortSelect.addEventListener('change', () => {
        filterAndDisplayServices();
    });
    
    sortContainer.appendChild(sortSelect);
    
    searchRow.appendChild(searchContainer);
    searchRow.appendChild(sortContainer);
    
    // : Results count display**
    const resultsCount = createElement('p', 'text-muted-foreground');
    resultsCount.id = 'results-count';
    resultsCount.textContent = 'Loading services...';
    
    searchHeader.appendChild(searchRow);
    searchHeader.appendChild(resultsCount);
    
    // Main content with filters and results
    const contentGrid = createElement('div', 'flex gap-6');
    
    // Filters sidebar (desktop only)
    const filtersCard = createCard('', '');
    filtersCard.className = 'card hidden md:block w-64 shrink-0 sticky top-6';
    
    const filtersHeader = createElement('div', 'flex items-center justify-between mb-4');
    const filterTitleContainer = createElement('div', 'flex items-center space-x-2');
    const filterIcon = createIcon('filter', 'w-4 h-4');
    const filtersTitle = createElement('h2', 'font-semibold', 'Filters');
    filterTitleContainer.appendChild(filterIcon);
    filterTitleContainer.appendChild(filtersTitle);
    
    // : Clear all filters button**
    const clearAllBtn = createElement('button', 'text-xs text-primary hover:underline');
    clearAllBtn.textContent = 'Clear All';
    clearAllBtn.style.display = 'none';
    clearAllBtn.addEventListener('click', () => {
        searchState.selectedCategories.clear();
        updateCategoryCheckboxes();
        filterAndDisplayServices();
        clearAllBtn.style.display = 'none';
    });
    
    filtersHeader.appendChild(filterTitleContainer);
    filtersHeader.appendChild(clearAllBtn);
    
    const filtersContent = createElement('div', 'space-y-6');
    
    // : Categories filter implementation**
    const categoriesSection = createElement('div');
    const categoriesHeader = createElement('div', 'flex justify-between items-center mb-3');
    const categoriesTitle = createElement('h3', 'font-medium', 'Categories');
    categoriesHeader.appendChild(categoriesTitle);
    
    const categoriesList = createElement('div', 'space-y-2 max-h-80 overflow-y-auto');
    categoriesList.id = 'categories-list';
    
    categoriesSection.appendChild(categoriesHeader);
    categoriesSection.appendChild(categoriesList);
    filtersContent.appendChild(categoriesSection);
    
    // : Active filters display**
    const activeFiltersSection = createElement('div', 'pt-4 border-t');
    const activeFiltersTitle = createElement('h3', 'font-medium mb-3', 'Active Filters');
    const activeFiltersList = createElement('div', 'space-y-2');
    activeFiltersList.id = 'active-filters-list';
    
    activeFiltersSection.appendChild(activeFiltersTitle);
    activeFiltersSection.appendChild(activeFiltersList);
    activeFiltersSection.style.display = 'none';
    activeFiltersSection.id = 'active-filters-section';
    
    filtersContent.appendChild(activeFiltersSection);
    
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
    
    function updateCategoryCheckboxes() {
        searchState.allCategories.forEach(category => {
            const checkbox = document.getElementById(`cat-${category}`);
            if (checkbox) {
                checkbox.checked = searchState.selectedCategories.has(category);
            }
        });
        updateActiveFilters();
    }
    
    function updateActiveFilters() {
        const activeFiltersList = document.getElementById('active-filters-list');
        const activeFiltersSection = document.getElementById('active-filters-section');
        const clearAllBtn = filtersHeader.querySelector('button');
        
        activeFiltersList.innerHTML = '';
        
        if (searchState.selectedCategories.size > 0) {
            activeFiltersSection.style.display = 'block';
            clearAllBtn.style.display = 'block';
            
            searchState.selectedCategories.forEach(category => {
                const filterTag = createElement('div', 'flex items-center justify-between bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm');
                const tagText = createElement('span', '', category);
                const removeBtn = createElement('button', 'ml-2 hover:text-primary-dark');
                removeBtn.innerHTML = '×';
                removeBtn.addEventListener('click', () => {
                    searchState.selectedCategories.delete(category);
                    updateCategoryCheckboxes();
                    filterAndDisplayServices();
                });
                
                filterTag.appendChild(tagText);
                filterTag.appendChild(removeBtn);
                activeFiltersList.appendChild(filterTag);
            });
        } else {
            activeFiltersSection.style.display = 'none';
            clearAllBtn.style.display = 'none';
        }
    }
    
    // Store sort select reference
    window.sortSelectElement = sortSelect;
    
    return container;
}

function createSearchResultCard(service) {
    const card = createElement('div', 'card hover:shadow-md transition-shadow');
    
    const cardContent = createElement('div', 'card-content p-6');
    
    const container = createElement('div', 'flex flex-col md:flex-row gap-6');
    
    // Image
    const imageContainer = createElement('div', 'w-full md:w-48 h-32 md:h-24 relative');
    const image = createElement('img', 'w-full h-full object-cover rounded-lg');
    image.src = service.image || 'https://via.placeholder.com/300x200';
    image.alt = service.category || service.name;
    imageContainer.appendChild(image);
    
    if (service.availableToday) {
        const badge = createBadge('Available Today', 'badge bg-green-600 text-white absolute top-2 left-2');
        imageContainer.appendChild(badge);
    }
    
    // Content
    const content = createElement('div', 'flex-1');
    
    const header = createElement('div', 'flex flex-col md:flex-row md:items-start md:justify-between mb-3');
    
    const leftSide = createElement('div');
    const title = createElement('h3', 'text-lg font-semibold mb-2', service.category || service.name);
    
    const providerRow = createElement('div', 'flex items-center space-x-4 mb-2');
    const providerInfo = createElement('div', 'flex items-center space-x-2');
    
    const providerName = service.provider?.name || 'Service Provider';
    const providerImage = service.provider?.image || '';
    const avatar = createAvatar(providerImage, providerName, 'avatar avatar-sm');
    const providerNameSpan = createElement('span', 'text-sm', providerName);
    
    providerInfo.appendChild(avatar);
    providerInfo.appendChild(providerNameSpan);
    
    if (service.provider?.verified) {
        const verifiedBadge = createBadge('Verified', 'badge badge-secondary text-xs');
        providerInfo.appendChild(verifiedBadge);
    }
    
    providerRow.appendChild(providerInfo);
    
    const detailsRow = createElement('div', 'flex items-center space-x-4 text-sm text-muted-foreground');
    
    if (service.provider?.rating) {
        const ratingContainer = createElement('div', 'flex items-center space-x-1');
        const starIcon = createIcon('star', 'w-4 h-4 fill-yellow-400 text-yellow-400');
        const rating = createElement('span', null, service.provider.rating.toString());
        const reviewCount = createElement('span', null, `(${service.provider.reviewCount || 0} reviews)`);
        
        ratingContainer.appendChild(starIcon);
        ratingContainer.appendChild(rating);
        ratingContainer.appendChild(reviewCount);
        detailsRow.appendChild(ratingContainer);
    }
    
    if (service.location) {
        const locationContainer = createElement('div', 'flex items-center space-x-1');
        const locationIcon = createIcon('map-pin', 'w-4 h-4');
        const location = createElement('span', null, `${service.location}${service.distance ? ' • ' + service.distance + ' mi' : ''}`);
        
        locationContainer.appendChild(locationIcon);
        locationContainer.appendChild(location);
        detailsRow.appendChild(locationContainer);
    }
    
    if (service.provider?.responseTime) {
        const responseContainer = createElement('div', 'flex items-center space-x-1');
        const clockIcon = createIcon('clock', 'w-4 h-4');
        const responseTime = createElement('span', null, service.provider.responseTime);
        
        responseContainer.appendChild(clockIcon);
        responseContainer.appendChild(responseTime);
        detailsRow.appendChild(responseContainer);
    }
    
    leftSide.appendChild(title);
    leftSide.appendChild(providerRow);
    leftSide.appendChild(detailsRow);
    
    // Right side - pricing and actions
    const rightSide = createElement('div', 'text-right mt-4 md:mt-0');
    const hourlyRate = service.pricing?.hourlyRate || service.hourlyRate || 0;
    const price = createElement('div', 'text-2xl font-bold mb-2', `$${hourlyRate}/hr`);
    
    const actions = createElement('div', 'space-y-2');
    const viewDetailsBtn = createButton('View Details', () => {
        localStorage.setItem('service', service.id);
        window.location.href = `/serviceDetail`;
    }, 'btn btn-primary w-full md:w-auto');
    
    const bookBtn = createButton('Book Now', () => {
        localStorage.setItem('service', service.id);
        window.location.href = `/booking`;
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

function getCategories() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/services/categories', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            searchState.allCategories = JSON.parse(xhr.responseText);
            renderCategories();
        } else {
            console.error('Failed to fetch categories. Status:', xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error('Request error while fetching categories');
    };

    xhr.send();
}

function renderCategories() {
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;
    
    categoriesList.innerHTML = '';
    
    searchState.allCategories.forEach(category => {
        const categoryRow = createElement('div', 'flex items-center space-x-2');
        
        const checkbox = createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `cat-${category}`;
        checkbox.className = 'checkbox';
        checkbox.value = category;
        
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                searchState.selectedCategories.add(category);
            } else {
                searchState.selectedCategories.delete(category);
            }
            filterAndDisplayServices();
            updateActiveFilters();
        });
        
        const label = createElement('label', 'text-sm cursor-pointer flex-1');
        label.htmlFor = `cat-${category}`;
        label.textContent = category;
        
        label.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        });
        
        categoryRow.appendChild(checkbox);
        categoryRow.appendChild(label);
        categoriesList.appendChild(categoryRow);
    });
}

// : Update active filters display**
function updateActiveFilters() {
    const activeFiltersList = document.getElementById('active-filters-list');
    const activeFiltersSection = document.getElementById('active-filters-section');
    
    if (!activeFiltersList || !activeFiltersSection) return;
    
    activeFiltersList.innerHTML = '';
    
    if (searchState.selectedCategories.size > 0) {
        activeFiltersSection.style.display = 'block';
        
        searchState.selectedCategories.forEach(category => {
            const filterTag = createElement('div', 'flex items-center justify-between bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm');
            const tagText = createElement('span', '', category);
            const removeBtn = createElement('button', 'ml-2 hover:text-primary-dark text-lg font-bold');
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', () => {
                searchState.selectedCategories.delete(category);
                const checkbox = document.getElementById(`cat-${category}`);
                if (checkbox) checkbox.checked = false;
                filterAndDisplayServices();
                updateActiveFilters();
            });
            
            filterTag.appendChild(tagText);
            filterTag.appendChild(removeBtn);
            activeFiltersList.appendChild(filterTag);
        });
    } else {
        activeFiltersSection.style.display = 'none';
    }
}

// : Filter and sort services**
function filterAndDisplayServices() {
    let filteredServices = [...searchState.allServices];
    
    // Apply category filter
    if (searchState.selectedCategories.size > 0) {
        filteredServices = filteredServices.filter(service => 
            searchState.selectedCategories.has(service.category)
        );
    }
    
    // Apply search query filter
    if (searchState.searchQuery) {
        filteredServices = filteredServices.filter(service => {
            const searchLower = searchState.searchQuery;
            return (
                service.category?.toLowerCase().includes(searchLower) ||
                service.shortDescription?.toLowerCase().includes(searchLower) ||
                service.provider?.name?.toLowerCase().includes(searchLower)
            );
        });
    }
    
    // Apply sorting
    const sortValue = window.sortSelectElement?.value || 'relevance';
    
    switch (sortValue) {
        case 'price-low':
            filteredServices.sort((a, b) => {
                const priceA = a.pricing?.hourlyRate || a.hourlyRate || 0;
                const priceB = b.pricing?.hourlyRate || b.hourlyRate || 0;
                return priceA - priceB;
            });
            break;
        case 'price-high':
            filteredServices.sort((a, b) => {
                const priceA = a.pricing?.hourlyRate || a.hourlyRate || 0;
                const priceB = b.pricing?.hourlyRate || b.hourlyRate || 0;
                return priceB - priceA;
            });
            break;
        case 'rating':
            filteredServices.sort((a, b) => {
                const ratingA = a.provider?.rating || 0;
                const ratingB = b.provider?.rating || 0;
                return ratingB - ratingA;
            });
            break;
        case 'distance':
            filteredServices.sort((a, b) => {
                const distA = a.distance || Infinity;
                const distB = b.distance || Infinity;
                return distA - distB;
            });
            break;
    }
    
    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        const totalCount = searchState.allServices.length;
        const filteredCount = filteredServices.length;
        
        if (searchState.selectedCategories.size > 0 || searchState.searchQuery) {
            resultsCount.textContent = `Showing ${filteredCount} of ${totalCount} services`;
        } else {
            resultsCount.textContent = `${totalCount} services found`;
        }
    }
    
    // Display results
    displayServices(filteredServices);
}

// : Display services in grid**
function displayServices(services) {
    const resultsGrid = document.getElementById('resultsGrid');
    if (!resultsGrid) return;
    
    resultsGrid.innerHTML = '';
    
    if (services.length === 0) {
        const noResults = createElement('div', 'text-center py-12');
        const noResultsIcon = createIcon('search-x', 'w-16 h-16 mx-auto text-gray-400 mb-4');
        const noResultsText = createElement('p', 'text-gray-500 text-lg font-medium', 'No services found');
        const noResultsSubtext = createElement('p', 'text-gray-400 text-sm mt-2', 'Try adjusting your filters or search query');
        
        noResults.appendChild(noResultsIcon);
        noResults.appendChild(noResultsText);
        noResults.appendChild(noResultsSubtext);
        resultsGrid.appendChild(noResults);
    } else {
        services.forEach(service => {
            const resultCard = createSearchResultCard(service);
            resultsGrid.appendChild(resultCard);
        });
    }
    
    lucide.createIcons();
}

function getServices(){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/services/all', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            searchState.allServices = JSON.parse(xhr.responseText);
            filterAndDisplayServices();
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
    
    // : Load categories and services**
    getCategories();
    getServices();
}