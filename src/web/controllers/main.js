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































window.onload = async function() {
    const response = await fetch('/checkSession');
    const data = await response.json();

    if (data.loggedIn) {
        if (data.role === 'provider') {
            window.location.href = '/providerProfile.html';
        } else {
            window.location.href = '/userProfile.html';
        }
    }
};