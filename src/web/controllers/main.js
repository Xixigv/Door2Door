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

// Setup chat popup functionality
function setupChatPopup() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatPopup = document.getElementById('chat-popup');
    
    if (!chatToggle || !chatPopup) return;
    
    chatToggle.addEventListener('click', () => {
        AppState.chatOpen = !AppState.chatOpen;
        
        if (AppState.chatOpen) {
            showChatPopup();
        } else {
            hideChatPopup();
        }
    });
    
    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (AppState.chatOpen && 
            !chatPopup.contains(e.target) && 
            !chatToggle.contains(e.target)) {
            AppState.chatOpen = false;
            hideChatPopup();
        }
    });
}

// Show chat popup
function showChatPopup() {
    const chatPopup = document.getElementById('chat-popup');
    if (!chatPopup) return;
    
    chatPopup.className = chatPopup.className.replace('hidden', '');
    
    // Render chat popup content
    renderChatPopupContent();
    
    // Initialize icons
    setTimeout(() => initializeIcons(), 0);
}

// Hide chat popup
function hideChatPopup() {
    const chatPopup = document.getElementById('chat-popup');
    if (!chatPopup) return;
    
    if (!chatPopup.className.includes('hidden')) {
        chatPopup.className += ' hidden';
    }
}

// Render chat popup content
function renderChatPopupContent() {
    const chatPopup = document.getElementById('chat-popup');
    if (!chatPopup) return;
    
    const activeConversation = CHAT_CONVERSATIONS[0];
    
    chatPopup.innerHTML = `
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div class="flex items-center space-x-2">
                <div class="avatar avatar-sm">
                    <img src="${activeConversation.avatar}" alt="${activeConversation.name}" />
                </div>
                <div>
                    <h3 class="font-medium text-sm">${activeConversation.name}</h3>
                    <p class="text-xs opacity-90">${activeConversation.online ? 'Online' : 'Offline'}</p>
                </div>
            </div>
            <div class="flex items-center space-x-1">
                <button id="chat-minimize" class="btn-ghost h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20 rounded">
                    <i data-lucide="minimize-2" class="w-3 h-3"></i>
                </button>
                <button id="chat-close" class="btn-ghost h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20 rounded">
                    <i data-lucide="x" class="w-3 h-3"></i>
                </button>
            </div>
        </div>
        
        <!-- Messages -->
        <div id="chat-messages" class="h-64 overflow-y-auto p-4">
            <div class="space-y-4">
                ${AppState.chatMessages.map(message => createChatMessageHTML(message)).join('')}
            </div>
        </div>
        
        <!-- Input -->
        <div class="p-4 border-t">
            <form id="chat-form" class="flex space-x-2">
                <input 
                    id="chat-input" 
                    type="text" 
                    placeholder="Type a message..." 
                    class="input flex-1"
                />
                <button type="submit" class="btn btn-primary btn-sm">
                    <i data-lucide="send" class="w-4 h-4"></i>
                </button>
            </form>
        </div>
    `;
    
    // Setup chat popup event listeners
    setupChatPopupEvents();
}

// Create chat message HTML
function createChatMessageHTML(message) {
    return `
        <div class="flex ${message.isProvider ? 'justify-start' : 'justify-end'}">
            <div class="flex items-start space-x-2 max-w-[80%] ${
                message.isProvider ? 'flex-row' : 'flex-row-reverse space-x-reverse'
            }">
                ${message.isProvider && message.avatar ? `
                    <div class="avatar avatar-sm">
                        <img src="${message.avatar}" alt="${message.sender}" />
                    </div>
                ` : ''}
                <div class="rounded-lg p-3 ${
                    message.isProvider
                        ? 'bg-gray-100'
                        : 'bg-primary text-primary-foreground'
                }">
                    <p class="text-sm">${message.message}</p>
                    <p class="text-xs mt-1 ${
                        message.isProvider ? 'text-gray-500' : 'text-primary-foreground/70'
                    }">
                        ${message.timestamp}
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Setup chat popup event listeners
function setupChatPopupEvents() {
    // Close button
    const closeBtn = document.getElementById('chat-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            AppState.chatOpen = false;
            hideChatPopup();
        });
    }
    
    // Minimize button (for future implementation)
    const minimizeBtn = document.getElementById('chat-minimize');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            // Toggle height or implement minimize functionality
            console.log('Minimize chat popup');
        });
    }
    
    // Chat form
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    
    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const messageText = chatInput.value.trim();
            if (!messageText) return;
            
            // Add user message
            const userMessage = {
                id: AppState.chatMessages.length + 1,
                sender: "You",
                message: messageText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isProvider: false
            };
            
            AppState.chatMessages.push(userMessage);
            chatInput.value = '';
            
            // Re-render messages
            renderChatMessages();
            
            // Simulate provider response
            setTimeout(() => {
                const providerMessage = {
                    id: AppState.chatMessages.length + 1,
                    sender: "Mike Johnson",
                    avatar: CHAT_CONVERSATIONS[0].avatar,
                    message: "Thanks for the message! I'll get back to you shortly.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isProvider: true
                };
                
                AppState.chatMessages.push(providerMessage);
                renderChatMessages();
            }, 1500);
        });
    }
}

// Render chat messages in popup
function renderChatMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = `
        <div class="space-y-4">
            ${AppState.chatMessages.map(message => createChatMessageHTML(message)).join('')}
        </div>
    `;
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Initialize icons
    setTimeout(() => initializeIcons(), 0);
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

// Utility function to handle navigation
function navigateToRoute(route) {
    if (router) {
        router.navigate(route);
    } else {
        window.location.hash = route;
    }
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