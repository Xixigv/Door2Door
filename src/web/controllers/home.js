function renderHomePage() {
    const container = createElement('div', 'min-h-screen');

    // Hero Section
    const hero = renderTitle();
    
    // Services Grid
    const servicesSection = renderServices();
    
    // Featured Providers
    const providersSection = renderProviders();
    
    container.appendChild(hero);
    container.appendChild(servicesSection);
    container.appendChild(providersSection);
    
    let main_content = document.getElementById('main-content');
    main_content.children[0].prepend(container);

}

function renderTitle(){

    const hero = createElement('section', 'bg-gradient-to-r from-primary to-primary/80 text-secondary-foreground py-20');
    const heroContainer = createElement('div', 'container mx-auto px-4 text-center');
    
    const title = createElement('h1', 'text-4xl md:text-6xl font-bold mb-6', 
        'Professional Services at Your Door');
    const subtitle = createElement('p', 'text-xl mb-8 opacity-90 max-w-2xl mx-auto', 
        'Connect with trusted local professionals for all your home service needs. From plumbing to painting, we\'ve got you covered.');
    
    const ctaButton = createButton(
        '<i data-lucide="arrow-right" class="ml-2 w-5 h-5"></i>Find Services Now',
        () => navigateTo('/search'),
        'btn btn-secondary btn-lg text-lg px-8 py-3'
    );
    
    heroContainer.appendChild(title);
    heroContainer.appendChild(subtitle);
    heroContainer.appendChild(ctaButton);
    hero.appendChild(heroContainer);

    return hero;

}

function renderServices()
{

    const servicesSection = createElement('section', 'py-16 bg-gray-50');
    const servicesContainer = createElement('div', 'container mx-auto px-4');
    const servicesTitle = createElement('h2', 'text-3xl font-bold text-center mb-12', 'Popular Services');
    
    const servicesGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6');
    servicesGrid.id = 'servicesGrid';

    servicesContainer.appendChild(servicesTitle);
    servicesContainer.appendChild(servicesGrid);
    servicesSection.appendChild(servicesContainer);
    
    return servicesSection;
}

function createServiceCard(service) {
    const card = createElement('div', 'card hover:shadow-lg transition-shadow cursor-pointer');
    
    const cardContent = createElement('div', 'card-content p-0');
    
    // Image
    const imageContainer = createElement('div', 'relative h-48 overflow-hidden rounded-t-lg');
    const image = createElement('img', 'w-full h-full object-cover');
    image.src = service.image;
    image.alt = service.name;
    imageContainer.appendChild(image);
    
    // Content
    const content = createElement('div', 'p-4');
    const title = createElement('h3', 'font-semibold mb-2', service.name);
    const description = createElement('p', 'text-sm text-muted-foreground mb-3', service.description);
    
    const footer = createElement('div', 'flex items-center justify-between');
    const ratingContainer = createElement('div', 'flex items-center space-x-1');
    const starIcon = createIcon('star', 'w-4 h-4 fill-yellow-400 text-yellow-400');
    const rating = createElement('span', 'text-sm', service.rating.toString());
    
    ratingContainer.appendChild(starIcon);
    ratingContainer.appendChild(rating);
    
    const providerCount = createElement('span', 'text-sm text-muted-foreground', `${service.providers} providers`);
    
    footer.appendChild(ratingContainer);
    footer.appendChild(providerCount);
    
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(footer);
    
    cardContent.appendChild(imageContainer);
    cardContent.appendChild(content);
    card.appendChild(cardContent);
    
    // Add click handler
    card.addEventListener('click', () => {
        window.location.href = `/serviceDetail`;
        localStorage.setItem('service', service.id);
    });

    let servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.append(card);
}

function renderProviders(){
    const providersSection = createElement('section', 'py-16');
    const providersContainer = createElement('div', 'container mx-auto px-4');
    const providersTitle = createElement('h2', 'text-3xl font-bold text-center mb-12', 'Top Rated Providers');
    
    const providersGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6');
    providersGrid.id = 'providersGrid';

    providersContainer.appendChild(providersTitle);
    providersContainer.appendChild(providersGrid);
    providersSection.appendChild(providersContainer);

    return providersSection;
}

function createProviderCard(provider) {
const card = createElement('div', 'card hover:shadow-lg transition-shadow cursor-pointer');
    
    const cardContent = createElement('div', 'card-content p-6');
    
    const container = createElement('div', 'flex items-start space-x-4');
    
    // Avatar with availability indicator
    const avatarContainer = createElement('div', 'relative');
    const avatar = createAvatar(provider.image, provider.name, 'avatar');
    avatarContainer.appendChild(avatar);
    
    if (provider.available) {
        const indicator = createElement('div', 'absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white');
        avatarContainer.appendChild(indicator);
    }
    
    // Content
    const content = createElement('div', 'flex-1');
    const name = createElement('h3', 'font-semibold mb-1', provider.name);
    const serviceType = createElement('p', 'text-sm text-muted-foreground mb-2', provider.service);
    
    const ratingRow = createElement('div', 'flex items-center space-x-4 mb-2');
    const ratingContainer = createElement('div', 'flex items-center space-x-1');
    const starIcon = createIcon('star', 'w-4 h-4 fill-yellow-400 text-yellow-400');
    const rating = createElement('span', 'text-sm', provider.rating.toString());
    const reviewCount = createElement('span', 'text-sm text-muted-foreground', `(${provider.reviews})`);
    
    ratingContainer.appendChild(starIcon);
    ratingContainer.appendChild(rating);
    ratingContainer.appendChild(reviewCount);
    ratingRow.appendChild(ratingContainer);
    
    const bottomRow = createElement('div', 'flex items-center justify-between');
    const price = createElement('span', 'font-semibold text-primary', `$${provider.price}/hr`);
    
    const badge = createBadge(
        provider.available ? 'Available' : 'Busy',
        provider.available ? 'badge badge-secondary text-green-700 bg-green-100' : 'badge badge-secondary'
    );
    
    bottomRow.appendChild(price);
    bottomRow.appendChild(badge);
    
    content.appendChild(name);
    content.appendChild(serviceType);
    content.appendChild(ratingRow);
    content.appendChild(bottomRow);
    
    container.appendChild(avatarContainer);
    container.appendChild(content);
    cardContent.appendChild(container);
    card.appendChild(cardContent);
    
    // Add click handler
    card.addEventListener('click', () => {
        window.location.href = `/providerProfile`;
        localStorage.setItem('provider', provider.id);
        
    });
    
    let providersGrid = document.getElementById('providersGrid');
    providersGrid.append(card);
}

function getPopularServices(){

    const xhr = new XMLHttpRequest();
    // Link
    xhr.open('GET', 'http://localhost:3000/services', true);
    
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            const popularServices = JSON.parse(xhr.responseText);
            popularServices.forEach(service => {
                createServiceCard(service);
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

function getPopularProviders(){

    
    const xhr = new XMLHttpRequest();
    // Link
    const limit = 3; // cantidad de servicios que quieres obtener

    xhr.open("GET", `/providers?limit=${limit}`, true);
    
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            const popularProviders = JSON.parse(xhr.responseText);
            popularProviders.forEach(provider => {
                createProviderCard(provider);
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
    renderHomePage();
    getPopularServices();
    getPopularProviders();
}

document.addEventListener('DOMContentLoaded', function() {
    
});