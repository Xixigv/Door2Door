// Utility functions for the Door2Door application

// DOM utilities
function createElement(tag, className = '', content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
}

function createIcon(iconName, className = 'w-4 h-4') {
    const icon = createElement('i');
    icon.setAttribute('data-lucide', iconName);
    if (className) icon.className = className;
    return icon;
}

function createStarRating(rating, className = 'w-4 h-4') {
    const container = createElement('div', 'flex items-center space-x-1');
    for (let i = 1; i <= 5; i++) {
        const star = createIcon('star', `${className} ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`);
        container.appendChild(star);
    }
    return container;
}

function createAvatar(src, alt, className = 'avatar') {
    const avatar = createElement('div', className);
    const img = createElement('img');
    img.src = src;
    img.alt = alt;
    img.onerror = function() {
        // Fallback to initials
        const initials = alt.split(' ').map(n => n[0]).join('');
        avatar.innerHTML = `<div class="avatar-fallback">${initials}</div>`;
    };
    avatar.appendChild(img);
    return avatar;
}

function createCard(title, content, className = 'card') {
    const card = createElement('div', className);
    
    if (title) {
        const header = createElement('div', 'card-header');
        const titleElement = createElement('h3', 'card-title', title);
        header.appendChild(titleElement);
        card.appendChild(header);
    }
    
    const cardContent = createElement('div', 'card-content');
    if (typeof content === 'string') {
        cardContent.innerHTML = content;
    } else {
        cardContent.appendChild(content);
    }
    card.appendChild(cardContent);
    
    return card;
}

function createButton(text, onClick, className = 'btn btn-primary btn-md') {
    const button = createElement('button', className, text);
    if (onClick) button.addEventListener('click', onClick);
    return button;
}

function createBadge(text, className = 'badge badge-default') {
    return createElement('span', className, text);
}

// Date utilities
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// String utilities
function truncate(str, length = 100) {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Number utilities
function formatPrice(price) {
    return `$${price}`;
}

function formatDistance(distance) {
    return `${distance} mi`;
}

// URL utilities
function getHashRoute() {
    return window.location.hash.slice(1) || '/';
}

function navigateTo(route) {
    window.location.hash = route;
}

function getRouteParams(route) {
    const parts = route.split('/');
    const params = {};
    
    // Simple parameter extraction (e.g., /service/:id -> /service/1)
    if (parts[1] === 'service' && parts[2]) {
        params.id = parts[2];
    }
    if (parts[1] === 'profile' && parts[2] && parts[3]) {
        params.type = parts[2];
        params.id = parts[3];
    }
    if (parts[1] === 'calendar' && parts[2]) {
        params.serviceId = parts[2];
    }
    
    return params;
}

// Event utilities
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage utilities
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
        return defaultValue;
    }
}

// Animation utilities
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    requestAnimationFrame(() => {
        element.style.opacity = '1';
    });
}

function fadeOut(element, duration = 300) {
    element.style.opacity = '1';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    requestAnimationFrame(() => {
        element.style.opacity = '0';
    });
    
    setTimeout(() => {
        element.style.display = 'none';
    }, duration);
}

function slideToggle(element, duration = 300) {
    if (element.style.display === 'none' || !element.style.display) {
        element.style.display = 'block';
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease-in-out`;
        
        requestAnimationFrame(() => {
            element.style.height = element.scrollHeight + 'px';
        });
        
        setTimeout(() => {
            element.style.height = 'auto';
            element.style.overflow = 'visible';
        }, duration);
    } else {
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease-in-out`;
        
        requestAnimationFrame(() => {
            element.style.height = '0';
        });
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
}

// Initialize Lucide icons
function initializeIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeHeaderSearch();
});

function initializeHeaderSearch() {
    // Get the search input in the header
    const headerSearchInput = document.querySelector('header input[type="text"]');
    
    if (!headerSearchInput) {
        // console.warn('Header search input not found');
        return;
    }
    
    // Add event listener for Enter key
    headerSearchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if inside a form
            
            const searchQuery = headerSearchInput.value.trim();
            
            if (searchQuery) {
                // Store the search query in localStorage
                localStorage.setItem('searchQuery', searchQuery);
                
                // Redirect to search page
                window.location.href = '/search';
            } else {
                // If empty, just go to search page without query
                window.location.href = '/search';
            }
        }
    });

}