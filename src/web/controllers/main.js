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
    console.log('Door2Door app initialized');
}

// Check session and update header
async function checkAndRestoreSession() {
    try {
        const session = await auth.checkSession();
        if (session && session.loggedIn && session.user) {
            AppState.currentUser = session.user;
            updateHeaderWithUserInfo(session.user);
        } else {
            updateHeaderLoggedOut();
        }
    } catch (err) {
        console.warn('Session check failed:', err);
        updateHeaderLoggedOut();
    }
}

function updateHeaderWithUserInfo(user) {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Buscar el botón de Login actual
    const loginBtn = header.querySelector('button[onclick*="/login"]');
    if (!loginBtn) return;
    
    // Crear container para user info
    const userNav = document.createElement('div');
    userNav.className = 'user-nav flex items-center space-x-3';
    
    // Avatar con inicial
    // const avatarBtn = document.createElement('button');
    // avatarBtn.className = 'flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent';
    // avatarBtn.innerHTML = `
    //   <div class="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
    //     ${user.email ? user.email.charAt(0).toUpperCase() : 'U'}
    //   </div>
    //   <span class="hidden md:block text-sm font-medium">${user.email || 'User'}</span>
    // `;
    // avatarBtn.addEventListener('click', () => window.location.href = '/userProfile');
    
    // Botón Profile
    const profileBtn = document.createElement('button');
    profileBtn.className = 'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground';
    profileBtn.innerHTML = '<i data-lucide="user" class="w-4 h-4 md:mr-2"></i><span class="hidden md:block">Profile</span>';
    profileBtn.addEventListener('click', () => window.location.href = '/userProfile');
    
    // Botón Logout
    // const logoutBtn = document.createElement('button');
    // logoutBtn.className = 'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700';
    // logoutBtn.innerHTML = '<i data-lucide="log-out" class="w-4 h-4 md:mr-2"></i><span class="hidden md:block">Logout</span>';
    // logoutBtn.addEventListener('click', () => auth.logout());
    
    // userNav.appendChild(avatarBtn);
    userNav.appendChild(profileBtn);
    // userNav.appendChild(logoutBtn);
    
    // Reemplazar el botón de Login con los nuevos botones
    loginBtn.replaceWith(userNav);
    
    // Recrear iconos de Lucide
    lucide.createIcons();
}

function updateHeaderLoggedOut() {
    const header = document.querySelector('header');
    if (!header) return;
    const userNav = header.querySelector('.user-nav');
    if (userNav) {
        // Recrear el botón de Login original
        const loginBtn = document.createElement('button');
        loginBtn.onclick = function() { window.location.href='/login'; };
        loginBtn.className = 'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground';
        loginBtn.innerHTML = '<i data-lucide="user" class="w-4 h-4 md:mr-2"></i><span class="hidden md:block">Login</span>';
        
        userNav.replaceWith(loginBtn);
        lucide.createIcons();
    }
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // initializeApp();
    await checkAndRestoreSession();
});

// // Export global functions
// window.AppState = AppState;
// window.navigateToRoute = navigateToRoute;
// window.searchServices = searchServices;
// window.sortSearchResults = sortSearchResults;

// window.onload = async function() {
//     const response = await fetch('/users/checkSession');
//     const data = await response.json();

//     if (data.loggedIn) {
//         if (data.role === 'provider') {
//             window.location.href = '/providerProfile.html';
//         } else {
//             window.location.href = '/userProfile.html';
//         }
//     }
// };