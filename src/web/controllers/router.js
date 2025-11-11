// Simple client-side router for the Door2Door application

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = '';
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
    }
    
    // Add a route
    addRoute(path, handler) {
        this.routes.set(path, handler);
    }
    
    // Handle route changes
    handleRouteChange() {
        const hash = window.location.hash.slice(1) || '/';
        this.navigateToRoute(hash);
    }
    
    // Navigate to a specific route
    navigateToRoute(route) {
        this.currentRoute = route;
        
        // Clear current content
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;
        
        mainContent.innerHTML = '';
        
        // Find matching route
        let matchedRoute = null;
        let params = {};
        
        // Check for exact match first
        if (this.routes.has(route)) {
            matchedRoute = this.routes.get(route);
        } else {
            // Check for parameterized routes
            for (let [routePath, handler] of this.routes) {
                const match = this.matchRoute(routePath, route);
                if (match) {
                    matchedRoute = handler;
                    params = match.params;
                    break;
                }
            }
        }
        
        if (matchedRoute) {
            try {
                const content = matchedRoute(params);
                if (content) {
                    mainContent.appendChild(content);
                    // Initialize icons after content is added
                    setTimeout(() => initializeIcons(), 0);
                }
            } catch (error) {
                console.error('Error rendering route:', error);
                this.renderErrorPage('An error occurred while loading the page.');
            }
        } else {
            this.renderNotFoundPage();
        }
    }
    
    // Match route with parameters
    matchRoute(routePath, actualPath) {
        const routeParts = routePath.split('/');
        const actualParts = actualPath.split('/');
        
        if (routeParts.length !== actualParts.length) {
            return null;
        }
        
        const params = {};
        
        for (let i = 0; i < routeParts.length; i++) {
            const routePart = routeParts[i];
            const actualPart = actualParts[i];
            
            if (routePart.startsWith(':')) {
                // Parameter
                const paramName = routePart.slice(1);
                params[paramName] = actualPart;
            } else if (routePart !== actualPart) {
                // No match
                return null;
            }
        }
        
        return { params };
    }
    
    // Render 404 page
    renderNotFoundPage() {
        const mainContent = document.getElementById('main-content');
        const notFoundPage = createElement('div', 'min-h-screen flex items-center justify-center bg-gray-50');
        
        const container = createElement('div', 'text-center');
        const title = createElement('h1', 'text-4xl font-bold mb-4', '404');
        const subtitle = createElement('h2', 'text-xl font-semibold mb-4', 'Page Not Found');
        const description = createElement('p', 'text-muted-foreground mb-8', 
            'The page you are looking for does not exist.');
        
        const homeButton = createButton('Go Home', () => {
            window.location.hash = '/';
        }, 'btn btn-primary');
        
        container.appendChild(title);
        container.appendChild(subtitle);
        container.appendChild(description);
        container.appendChild(homeButton);
        notFoundPage.appendChild(container);
        
        mainContent.appendChild(notFoundPage);
    }
    
    // Render error page
    renderErrorPage(message) {
        const mainContent = document.getElementById('main-content');
        const errorPage = createElement('div', 'min-h-screen flex items-center justify-center bg-gray-50');
        
        const container = createElement('div', 'text-center');
        const title = createElement('h1', 'text-4xl font-bold mb-4', 'Oops!');
        const subtitle = createElement('h2', 'text-xl font-semibold mb-4', 'Something went wrong');
        const description = createElement('p', 'text-muted-foreground mb-8', message);
        
        const homeButton = createButton('Go Home', () => {
            window.location.hash = '/';
        }, 'btn btn-primary');
        
        container.appendChild(title);
        container.appendChild(subtitle);
        container.appendChild(description);
        container.appendChild(homeButton);
        errorPage.appendChild(container);
        
        mainContent.appendChild(errorPage);
    }
    
    // Navigate programmatically
    navigate(route) {
        window.location.hash = route;
    }
}

// Initialize router
const router = new Router();

// Define routes
router.addRoute('/', () => renderHomePage());
router.addRoute('/search', () => renderSearchPage());
router.addRoute('/login', () => renderLoginPage());
router.addRoute('/register', () => renderRegisterPage());
router.addRoute('/service/:id', (params) => renderServiceDetailPage(params.id));
router.addRoute('/profile/user/:id', (params) => renderUserProfile(params.id));
router.addRoute('/profile/provider/:id', (params) => renderProviderProfile(params.id));
router.addRoute('/calendar/:serviceId', (params) => renderCalendarPage(params.serviceId));
router.addRoute('/chat', () => renderChatPage());
router.addRoute('/payment', () => renderPaymentsPage());
router.addRoute('/home', () => renderHomePage());
router.addRoute('/becomeProvider', () => renderBecomeProviderPage());
router.addRoute('/providerProfileView', () => renderProviderProfileViewPage());

// Export for global use
window.router = router;