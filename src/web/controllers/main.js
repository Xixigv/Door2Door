// Main application initialization and global functionality

// Application state
const AppState = {
    currentUser: null,
    chatOpen: false,
    // chatMessages: [...CHAT_MESSAGES],
    filters: {
        search: '',
        category: 'All',
        priceRange: [0, 150],
        distance: 10,
        availableToday: false,
        verifiedOnly: false
    }
};

// Initialize application
function initializeApp() {
    initializeIcons();
    // setupChatPopup();
    // setupHeaderSearch();
    
    // // Load user data from localStorage if available
    // const savedUser = loadFromStorage('currentUser');
    // if (savedUser) {
    //     AppState.currentUser = savedUser;
    // }
    
    // console.log('Door2Door app initialized');
}

// Setup header search functionality
function setupHeaderSearch() {
    const headerSearch = document.querySelector('header input[type="text"]');
    if (!headerSearch) return;
    
    headerSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchQuery = headerSearch.value.trim();
            if (searchQuery) {
                AppState.filters.search = searchQuery;
                router.navigate('/search');
            }
        }
    });
    
    // Debounced search
    const debouncedSearch = debounce((query) => {
        if (query.length > 2) {
            AppState.filters.search = query;
            // If we're on the search page, trigger a re-render
            if (router.currentRoute === '/search') {
                renderSearchResults();
            }
        }
    }, 300);
    
    headerSearch.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
}

// Search functionality
function searchServices(query, filters = {}) {
    let results = [...SEARCH_SERVICES];
    
    // Text search
    if (query) {
        results = results.filter(service => 
            service.name.toLowerCase().includes(query.toLowerCase()) ||
            service.provider.name.toLowerCase().includes(query.toLowerCase()) ||
            service.category.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    // Category filter
    if (filters.category && filters.category !== 'All') {
        results = results.filter(service => service.category === filters.category);
    }
    
    // Price range filter
    if (filters.priceRange) {
        results = results.filter(service => 
            service.price >= filters.priceRange[0] && 
            service.price <= filters.priceRange[1]
        );
    }
    
    // Availability filter
    if (filters.availableToday) {
        results = results.filter(service => service.availableToday);
    }
    
    // Verified filter
    if (filters.verifiedOnly) {
        results = results.filter(service => service.provider.verified);
    }
    
    // Distance filter
    if (filters.distance) {
        results = results.filter(service => service.distance <= filters.distance);
    }
    
    return results;
}

// Sort search results
function sortSearchResults(results, sortBy) {
    const sortedResults = [...results];
    
    switch (sortBy) {
        case 'price-low':
            return sortedResults.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedResults.sort((a, b) => b.price - a.price);
        case 'rating':
            return sortedResults.sort((a, b) => b.provider.rating - a.provider.rating);
        case 'distance':
            return sortedResults.sort((a, b) => a.distance - b.distance);
        default:
            return sortedResults;
    }
}

// Re-render search results (for when filters change)
function renderSearchResults() {
    // This would be called when filters change on the search page
    // Implementation would depend on the current search page setup
    console.log('Re-rendering search results with filters:', AppState.filters);
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

lucide.createIcons();

// // Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// // Export global functions
// window.AppState = AppState;
// window.navigateToRoute = navigateToRoute;
// window.searchServices = searchServices;
// window.sortSearchResults = sortSearchResults;