/**
 * User Profile Controller
 * Carga la información del usuario loggeado en la página de perfil
 */

function renderUserProfile(user) {
    const container = createElement('div', 'min-h-screen bg-gray-50');
    const mainContainer = createElement('div', 'container mx-auto px-4 py-6');
    
    // Profile header
    const profileCard = createCard('', '');
    const profileContent = createElement('div', 'flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6');
    
    const avatar = createAvatar(user.avatar, user.name, 'avatar avatar-xl');
    
    const userInfo = createElement('div', 'flex-1');
    const userName = createElement('h1', 'text-2xl font-bold mb-2', user.name);
    const userDetails = createElement('div', 'space-y-1 text-muted-foreground mb-4');
    
    const locationInfo = createElement('div', 'flex items-center space-x-2');
    const locationIcon = createIcon('map-pin', 'w-4 h-4');
    const location = createElement('span', '', user.location);
    locationInfo.appendChild(locationIcon);
    locationInfo.appendChild(location);
    
    const memberSince = createElement('div', '', `Member since ${user.memberSince}`);
    
    userDetails.appendChild(locationInfo);
    userDetails.appendChild(memberSince);
    
    const userStats = createElement('div', 'flex flex-wrap gap-4 text-sm');
    const bookingsStats = createElement('div', 'bg-primary/10 px-3 py-1 rounded-full');
    bookingsStats.innerHTML = `<span class="font-medium">${user.totalBookings}</span> bookings completed`;
    
    const spentStats = createElement('div', 'bg-green-100 px-3 py-1 rounded-full');
    spentStats.innerHTML = `<span class="font-medium">$${user.totalSpent}</span> total spent`;
    
    userStats.appendChild(bookingsStats);
    userStats.appendChild(spentStats);
    
    userInfo.appendChild(userName);
    userInfo.appendChild(userDetails);
    userInfo.appendChild(userStats);
    

    
    profileContent.appendChild(avatar);
    profileContent.appendChild(userInfo);
    
    profileCard.querySelector('.card-content').appendChild(profileContent);
    
    const currUserRole = getCurrentUser();
    const tabs = [
        { id: 'bookings', label: 'Bookings' }
      ];
    if (currUserRole && currUserRole.role === 'provider') {
        tabs.push({ id: 'Booked services', label: 'Booked services' });
    }
    // Tabs

    const tabsContainer = createElement('div', 'mt-6');
    const tabsList = createElement('div', 'tabs-list');
    

    
    tabs.forEach((tab, index) => {
        const tabTrigger = createElement('button', 
            `tabs-trigger ${index === 0 ? 'active' : ''}`, 
            tab.label
        );
        
        tabTrigger.addEventListener('click', () => {
            // Switch tabs
            tabsList.querySelectorAll('.tabs-trigger').forEach(t => t.classList.remove('active'));
            tabTrigger.classList.add('active');
            
            // Switch content
            document.querySelectorAll('.tabs-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`tab-${tab.id}`).classList.add('active');
        });
        
        tabsList.appendChild(tabTrigger);
    });
    
    // Tab content
    const bookingsContent = createElement('div', 'tabs-content active grid grid-cols-1 lg:grid-cols-2 gap-6');
    bookingsContent.id = 'tab-bookings';
    
    const recentBookingsCard = createCard('Recent Bookings', '');
    const bookingsContainer = createElement('div', 'space-y-4');
    
    // BOOKING_HISTORY.forEach(booking => {
    //     const bookingItem = createBookingHistoryItem(booking);
    //      bookingsContainer.appendChild(bookingItem);
    //  });
    
    recentBookingsCard.querySelector('.card-content').appendChild(bookingsContainer);
    
    const quickActionsCard = createCard('Quick Actions', '');
    const actionsContainer = createElement('div', 'space-y-3');
    
    const actions = [
        { icon: 'calendar', text: 'Book New Service', href: '#/search' }
    ];
    
    actions.forEach(action => {
        const actionBtn = createButton(
            `<i data-lucide="${action.icon}" class="w-4 h-4 mr-2"></i>${action.text}`,
            () => {
                if (action.href !== '#') {
                    window.location.hash = action.href;
                }
            },
            'btn btn-outline w-full justify-start'
        );
        actionsContainer.appendChild(actionBtn);
    });
    
    quickActionsCard.querySelector('.card-content').appendChild(actionsContainer);
    
    bookingsContent.appendChild(recentBookingsCard);
    bookingsContent.appendChild(quickActionsCard);
    
    // Other tab contents (simplified)
    const favoritesContent = createElement('div', 'tabs-content', '<p>Favorites content would go here...</p>');
    favoritesContent.id = 'tab-favorites';
    
    const paymentsContent = createElement('div', 'tabs-content', '<p>Payments content would go here...</p>');
    paymentsContent.id = 'tab-payments';
    
    const settingsContent = createElement('div', 'tabs-content', '<p>Settings content would go here...</p>');
    settingsContent.id = 'tab-settings';
    
    tabsContainer.appendChild(tabsList);
    tabsContainer.appendChild(bookingsContent);
    tabsContainer.appendChild(favoritesContent);
    tabsContainer.appendChild(paymentsContent);
    tabsContainer.appendChild(settingsContent);
    
    mainContainer.appendChild(profileCard);
    mainContainer.appendChild(tabsContainer);
    container.appendChild(mainContainer);
    
    return container;
}

// Función para cargar datos del perfil del usuario
async function loadUserProfile() {
  try {
    console.log('Cargando perfil del usuario...');

    // Hacer fetch al endpoint /users/profile/me
    const response = await fetch('/users/profile/me', {
      method: 'GET',
      credentials: 'include', // Enviar cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Error al obtener perfil:', response.status);
      // Si no está autenticado, redirigir a login
      if (response.status === 401) {
        window.location.href = '/login';
      }
      return;
    }

    const result = await response.json();
    console.log('Datos del perfil:', result);

    if (result.success) {
      const userData = result.data;
      const userProfilePage = renderUserProfile(userData);
      let main_content = document.getElementById('main-content');
      main_content.innerHTML = '';
      main_content.appendChild(userProfilePage);
      // localStorage.setItem('provider', response.provider.id);
      initializeIcons();

    }
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
  }
}

// Función para llenar los datos en la página
function populateUserProfile(userData) {
  // Actualizar avatar - crear avatar dinámico o usar imagen
  const avatarImg = document.querySelector('.card-content .avatar img');
  if (avatarImg && userData.avatar) {
    avatarImg.src = userData.avatar;
    avatarImg.alt = userData.name;
  }

  // Actualizar nombre
  const nameElement = document.querySelector('.card-content h1');
  if (nameElement) {
    nameElement.textContent = userData.name || 'User';
  }

  // Actualizar ubicación
  const locationSpan = document.querySelectorAll('.card-content span');
  if (locationSpan.length > 0) {
    const locationElement = Array.from(locationSpan).find(el => el.textContent.includes('San Francisco'));
    if (locationElement) {
      locationElement.textContent = userData.location || 'Not specified';
    }
  }

  // Actualizar "Member since"
  const memberSinceElement = document.querySelector('.card-content .space-y-1 > div:last-child');
  if (memberSinceElement) {
    const memberDate = new Date(userData.memberSince).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
    memberSinceElement.textContent = `Member since ${memberDate}`;
  }

  // Actualizar número de bookings
  const bookingsElement = document.querySelector('.card-content .bg-primary\\/10');
  if (bookingsElement) {
    const bookingsSpan = bookingsElement.querySelector('span.font-medium');
    if (bookingsSpan) {
      bookingsSpan.textContent = userData.totalBookings || 0;
    }
  }

  // Actualizar total spent
  const spentElement = document.querySelector('.card-content .bg-green-100');
  if (spentElement) {
    const spentSpan = spentElement.querySelector('span.font-medium');
    if (spentSpan) {
      spentSpan.textContent = `$${userData.totalSpent || 0}`;
    }
  }

  // Actualizar stats de bookings en la sección de contenido
  updateBookingsStats(userData);

  // Re-renderizar iconos de Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Función para actualizar estadísticas de bookings
function updateBookingsStats(userData) {
  // Total Bookings
  const totalBookingsCard = document.querySelectorAll('.grid.grid-cols-1')[0];
  if (totalBookingsCard) {
    const cards = totalBookingsCard.querySelectorAll('.bg-white.p-6');
    if (cards[0]) {
      const totalBoldText = cards[0].querySelector('p.text-2xl');
      if (totalBoldText) {
        totalBoldText.textContent = userData.totalBookings || 0;
      }
    }

    // Total Spent (usually the 4th card)
    if (cards[3]) {
      const spentBoldText = cards[3].querySelector('p.text-2xl');
      if (spentBoldText) {
        spentBoldText.textContent = `$${userData.totalSpent || 0}`;
      }
    }
  }
}

// Función para actualizar email en la sección de settings (si existe)
function updateSettingsEmail(userData) {
  // Buscar campo de email en settings
  const settingsTab = document.getElementById('content-settings');
  if (settingsTab) {
    const emailInputs = settingsTab.querySelectorAll('input[type="email"]');
    if (emailInputs.length > 0) {
      emailInputs[0].value = userData.email;
    }
  }
}

// Cargar el perfil cuando el DOM esté listo
// document.addEventListener('DOMContentLoaded', () => {
//   console.log('DOM cargado, inicializando perfil de usuario...');
//   loadUserProfile();

//   // Agregar evento para actualizar el email en settings si cambia de tab
//   const settingsTab = document.getElementById('tab-settings');
//   if (settingsTab) {
//     settingsTab.addEventListener('click', () => {
//       // El email ya se habrá cargado cuando se populate el perfil
//       console.log('Tab de settings abierto');
//     });
//   }
// });

window.onload = function() {
    loadUserProfile();
}