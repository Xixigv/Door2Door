function renderHomePage() {
    const container = document.createElement('div');
    container.className = 'min-h-screen';

    // Hero Section
    const hero = renderTitle();
    
    // Services Grid
    const servicesSection = renderServices();
    
    // Featured Providers
    // const providersSection = createElement('section', 'py-16');
    // const providersContainer = createElement('div', 'container mx-auto px-4');
    // const providersTitle = createElement('h2', 'text-3xl font-bold text-center mb-12', 'Top Rated Providers');
    
    // const providersGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6');
    
    // FEATURED_PROVIDERS.forEach(provider => {
    //     const providerCard = createProviderCard(provider);
    //     providersGrid.appendChild(providerCard);
    // });
    
    // providersContainer.appendChild(providersTitle);
    // providersContainer.appendChild(providersGrid);
    // providersSection.appendChild(providersContainer);
    
    // // How it Works
    // const howItWorksSection = createElement('section', 'py-16 bg-gray-50');
    // const howItWorksContainer = createElement('div', 'container mx-auto px-4');
    // const howItWorksTitle = createElement('h2', 'text-3xl font-bold text-center mb-12', 'How Door2Door Works');
    
    // const stepsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto');
    
    // const steps = [
    //     {
    //         icon: 'search',
    //         title: '1. Search Services',
    //         description: 'Browse our categories or search for the specific service you need.'
    //     },
    //     {
    //         icon: 'clock',
    //         title: '2. Book & Schedule',
    //         description: 'Choose your preferred provider and schedule a convenient time.'
    //     },
    //     {
    //         icon: 'star',
    //         title: '3. Get Quality Service',
    //         description: 'Enjoy professional service and leave a review for others.'
    //     }
    // ];
    
    // steps.forEach(step => {
    //     const stepContainer = createElement('div', 'text-center');
    //     const iconContainer = createElement('div', 'bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4');
    //     const icon = createIcon(step.icon, 'w-8 h-8');
    //     iconContainer.appendChild(icon);
        
    //     const stepTitle = createElement('h3', 'font-semibold mb-3', step.title);
    //     const stepDescription = createElement('p', 'text-muted-foreground', step.description);
        
    //     stepContainer.appendChild(iconContainer);
    //     stepContainer.appendChild(stepTitle);
    //     stepContainer.appendChild(stepDescription);
    //     stepsGrid.appendChild(stepContainer);
    // });
    
    // howItWorksContainer.appendChild(howItWorksTitle);
    // howItWorksContainer.appendChild(stepsGrid);
    // howItWorksSection.appendChild(howItWorksContainer);
    
    container.appendChild(hero);
    container.appendChild(servicesSection);
    // container.appendChild(providersSection);
    // container.appendChild(howItWorksSection);
    
    let main_content = document.getElementById('main-content');
    main_content.children[0].prepend(container);

}

function renderTitle(){

    const hero = document.createElement('section');
    hero.className = 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20';
    const heroContainer = document.createElement('div');
    heroContainer.className = 'container mx-auto px-4 text-center';
    
    const title = document.createElement('h1');
    title.className = 'text-4xl md:text-6xl font-bold mb-6';
    title.textContent = 'Professional Services at Your Door';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-xl mb-8 opacity-90 max-w-2xl mx-auto';
    subtitle.textContent = 'Connect with trusted local professionals for all your home service needs. From plumbing to painting, we\'ve got you covered.';
    
    const ctaButton = document.createElement('button');
    ctaButton.className = 'btn btn-secondary btn-lg text-lg px-8 py-3';
    ctaButton.innerHTML = '<i data-lucide="arrow-right" class="ml-2 w-5 h-5"></i>Find Services Now';
    ctaButton.addEventListener('click', () => navigateTo('/search'));
    
    heroContainer.appendChild(title);
    heroContainer.appendChild(subtitle);
    heroContainer.appendChild(ctaButton);
    hero.appendChild(heroContainer);

    return hero;

}

function renderServices()
{
    const servicesSection = document.createElement('section');
    servicesSection.className = 'py-16 bg-gray-50';
    const servicesContainer = document.createElement('div');
    servicesContainer.className = 'container mx-auto px-4';
    const servicesTitle = document.createElement('h2');
    servicesTitle.className = 'text-3xl font-bold text-center mb-12';
    servicesTitle.textContent = 'Popular Services';

    const servicesGrid = document.createElement('div');
    servicesGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6';
    servicesGrid.id = 'servicesGrid';

    servicesContainer.appendChild(servicesTitle);
    servicesContainer.appendChild(servicesGrid);
    servicesSection.appendChild(servicesContainer);
    
    return servicesSection;
}

function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'card hover:shadow-lg transition-shadow cursor-pointer';

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content p-0';

    // Image
    const imageContainer = document.createElement('div');
    imageContainer.className = 'relative h-48 overflow-hidden rounded-t-lg';
    const image = document.createElement('img');
    image.className = 'w-full h-full object-cover';
    image.src = service.image;
    image.alt = service.name;
    imageContainer.appendChild(image);
    
    // Content
    const content = document.createElement('div');
    content.className = 'p-4';
    const title = document.createElement('h3');
    title.className = 'font-semibold mb-2';
    title.textContent = service.name;
    const description = document.createElement('p');
    description.className = 'text-sm text-muted-foreground mb-3';
    description.textContent = service.description;

    const footer = document.createElement('div');
    footer.className = 'flex items-center justify-between';
    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'flex items-center space-x-1';
    const starIcon = document.createElement('i');
    starIcon.dataset.lucide = 'star';
    starIcon.className = 'w-4 h-4 fill-yellow-400 text-yellow-400';
    const rating = document.createElement('span');
    rating.className = 'text-sm';
    rating.textContent = service.rating.toString();

    ratingContainer.appendChild(starIcon);
    ratingContainer.appendChild(rating);

    const providerCount = document.createElement('span');
    providerCount.className = 'text-sm text-muted-foreground';
    providerCount.textContent = `${service.providers} providers`;

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

function getPopularProviders(){



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

window.onload = function() {
    renderHomePage();
    getPopularServices();
    
    // getPopularProviders();
}

document.addEventListener('DOMContentLoaded', function() {
    
});