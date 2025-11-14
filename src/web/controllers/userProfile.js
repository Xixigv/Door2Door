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

    // AGREGAR TAB SI ES PROVIDER
    if (currUserRole && currUserRole.isProvider === true) {
        tabs.push({ id: 'booked-services', label: 'Booked services' });
    }

    // Tabs
    const tabsContainer = createElement('div', 'mt-6');
    const tabsList = createElement('div', 'tabs-list');

    // FOREACH DE TABS
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
          const tabContent = document.getElementById(`tab-${tab.id}`);
          tabContent.classList.add('active');
        });
        
        tabsList.appendChild(tabTrigger);
    });


    // Tab content - Bookings
    const bookingsContent = createElement('div', 'tabs-content active');
    bookingsContent.id = 'tab-bookings';
    const bookingsGrid = createElement('div', 'grid grid-cols-1 lg:grid-cols-2 gap-6');

    const recentBookingsCard = createCard('Your Bookings', '');
    const bookingsContainer = createElement('div', 'space-y-4');
    bookingsContainer.id = 'bookings-list';

    const loadingMsg = createElement('p', 'text-muted-foreground text-center py-8', 'Loading bookings...');
    bookingsContainer.appendChild(loadingMsg);

    recentBookingsCard.querySelector('.card-content').appendChild(bookingsContainer);

    const quickActionsCard = createCard('Quick Actions', '');
    const actionsContainer = createElement('div', 'space-y-3');

    const action = { icon: 'calendar', text: 'Book New Service', href: '/search' };
    

    const actionBtn = createButton(
        `<i data-lucide="${action.icon}" class="w-4 h-4 mr-2"></i>${action.text}`,
        () => {
            if (action.href !== '#') {
                window.location.href = action.href;
            }
        },
        'btn btn-outline w-full justify-start'
    );
    actionsContainer.appendChild(actionBtn);

    quickActionsCard.querySelector('.card-content').appendChild(actionsContainer);

    bookingsGrid.appendChild(recentBookingsCard);
    bookingsGrid.appendChild(quickActionsCard);
    bookingsContent.appendChild(bookingsGrid);

    // Tab content - Booked Services (AQUÍ, FUERA DEL FOREACH)
    const bookedServicesContent = createElement('div', 'tabs-content');
    bookedServicesContent.id = 'tab-booked-services';

    const bookedServicesCard = createCard('Services That Booked You', '');
    const bookedServicesContainer = createElement('div', 'space-y-4');
    bookedServicesContainer.id = 'booked-services-list';

    const loadingMsg2 = createElement('p', 'text-muted-foreground text-center py-8', 'Loading booked services...');
    bookedServicesContainer.appendChild(loadingMsg2);

    bookedServicesCard.querySelector('.card-content').appendChild(bookedServicesContainer);
    bookedServicesContent.appendChild(bookedServicesCard);

    // APPEND EVERYTHING
    tabsContainer.appendChild(tabsList);
    tabsContainer.appendChild(bookingsContent);

    if (currUserRole && currUserRole.isProvider === true) {
        tabsContainer.appendChild(bookedServicesContent);
    }

    mainContainer.appendChild(profileCard);
    mainContainer.appendChild(tabsContainer);
    container.appendChild(mainContainer);
  
  return container;
}

// Función para cargar datos del perfil del usuario
async function loadUserProfile() {
  try {
    // Hacer fetch al endpoint /users/profile/me
    const response = await fetch('/users/profile/me', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Error al obtener perfil:', response.status);
      if (response.status === 401) {
        window.location.href = '/login';
      }
      return;
    }

    const result = await response.json();

    if (result.success) {
      const userData = result.data;
      console.log(userData);
      
      const userProfilePage = renderUserProfile(userData);
      let main_content = document.getElementById('main-content');
      main_content.innerHTML = '';
      main_content.appendChild(userProfilePage);
      loadBookingsTab(getCurrentUser().id, getCurrentUser().isProvider);
      if(getCurrentUser().isProvider)
      {
        loadBookedServicesTab(getCurrentUser().id);
      }

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


// Función para cargar bookings del usuario
async function loadBookingsTab(userId, isProvider) {
    const container = document.getElementById('bookings-list');
    container.innerHTML = '<p class="text-muted-foreground text-center py-8">Loading...</p>';
    
    try {
        let endpoint;
        endpoint = `/bookings/user/${userId}`;

        // Cargar bookings desde el backend usando XHR
        const bookings = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', endpoint, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(new Error('Invalid JSON response'));
                    }
                } else {
                    reject(new Error('Error loading bookings'));
                }
            };
            
            xhr.onerror = function() {
                reject(new Error('Network error'));
            };
            
            xhr.send();
        });
        
        container.innerHTML = '';
        
        if (bookings.length === 0) {
            const emptyMsg = createElement('p', 'text-muted-foreground text-center py-8', 
                isProvider ? 'No bookings from clients yet.' : 'No bookings yet.');
            container.appendChild(emptyMsg);
            return;
        }
        
        // Ordenar por fecha (más recientes primero)
        bookings.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Crear las tarjetas de booking
        bookings.forEach(async booking =>  {
          let serviceData = await fetchServiceDetails(booking.providerId);
          const card = createBookingCardSync(booking, isProvider, serviceData, userId);
          container.appendChild(card);
        });
        
        initializeIcons();
    } catch (error) {
        console.error('Error loading bookings:', error);
        container.innerHTML = '<p class="text-red-500 text-center py-8">Error loading bookings</p>';
    }
}

async function fetchServiceDetails(providerId) {
  let endpointService = '/services/provider/' + providerId;
  const serviceData = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', endpointService, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
              try {
                  const data = JSON.parse(xhr.responseText);
                  resolve(data[0]);
              } catch (e) {
                  reject(new Error('Invalid JSON response'));
              }
          } else {

              reject(new Error('Error loading providers'));
          }
      };
      xhr.onerror = function() {

          reject(new Error('Network error'));
      };
      xhr.send();
  });
  return serviceData;
}

// ToDo
// Función para cargar servicios reservados por el provider (cuando él es proveedor)
async function loadBookedServicesTab(userId) {
    const container = document.getElementById('booked-services-list');
    container.innerHTML = '<p class="text-muted-foreground text-center py-8">Loading...</p>';
    
    try {        
        // Cargar bookings donde el usuario es el PROVEEDOR
        const endpoint = `/bookings/provider/${userId}`;
        
        const bookings = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', endpoint, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(new Error('Invalid JSON response'));
                    }
                } else {
                    reject(new Error('Error loading booked services'));
                }
            };
            
            xhr.onerror = function() {
                reject(new Error('Network error'));
            };
            
            xhr.send();
        });
        
        container.innerHTML = '';
        
        if (bookings.length === 0) {
            const emptyMsg = createElement('p', 'text-muted-foreground text-center py-8', 
                'No services booked by clients yet.');
            container.appendChild(emptyMsg);
            return;
        }
        
        // Ordenar por fecha (más recientes primero)
        bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Crear las tarjetas de booking
        bookings.forEach(async booking => {
            // Cargar detalles del servicio del proveedor (que es el userId actual)
            let serviceData = await fetchServiceDetails(userId);
            // TRUE porque es vista de provider (servicios que otros reservaron con él)
            const card = createBookingCardSync(booking, true, serviceData, userId);
            container.appendChild(card);
        });
        
        initializeIcons();
    } catch (error) {
        console.error('Error loading booked services:', error);
        container.innerHTML = '<p class="text-red-500 text-center py-8">Error loading booked services</p>';
    }
}

// Función para crear tarjeta de booking (versión síncrona con datos precargados)
function createBookingCardSync(booking, isProviderView, serviceDetails, currentUserId) {
    const card = createElement('div', 'bg-white rounded-lg border p-4 hover:shadow-md transition-shadow');
    
    const content = createElement('div', 'flex gap-4');

    // Imagen del servicio
    if (serviceDetails && serviceDetails.image) {
        const img = createElement('img', 'w-20 h-20 rounded-lg object-cover');
        img.src = serviceDetails.image;
        img.alt = serviceDetails.name;
        content.appendChild(img);
    } else {
        // Placeholder si no hay imagen
        const placeholder = createElement('div', 'w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center');
        placeholder.innerHTML = '<i data-lucide="briefcase" class="w-8 h-8 text-gray-400"></i>';
        content.appendChild(placeholder);
    }
    
    const info = createElement('div', 'flex-1');
    
    // Usar el nombre del servicio del booking si no hay serviceDetails
    const serviceName = createElement('h3', 'font-semibold text-lg', 
        serviceDetails ? serviceDetails.name : (booking.service || 'Service'));
    
    const details = createElement('div', 'space-y-1 text-sm text-muted-foreground mt-2');
    
    if (isProviderView) {
        // MOSTRAR INFO DEL CLIENTE que hizo el booking
        const clientInfo = createElement('div', 'flex items-center gap-2');
        clientInfo.innerHTML = `<i data-lucide="user" class="w-4 h-4"></i><span>Booking from client (ID: ${booking.userId})</span>`;
        details.appendChild(clientInfo);
    } else {
        // MOSTRAR INFO DEL PROVEEDOR del servicio
        if (serviceDetails && serviceDetails.provider) {
            const providerInfo = createElement('div', 'flex items-center gap-2');
            providerInfo.innerHTML = `<i data-lucide="user" class="w-4 h-4"></i><span>Provider: ${serviceDetails.provider.name} (ID: ${serviceDetails.provider.id})</span>`;
            details.appendChild(providerInfo);
        } else if (booking.providerId) {
            const providerInfo = createElement('div', 'flex items-center gap-2');
            providerInfo.innerHTML = `<i data-lucide="user" class="w-4 h-4"></i><span>Provider ID: ${booking.providerId}</span>`;
            details.appendChild(providerInfo);
        }
    }
    
    const dateInfo = createElement('div', 'flex items-center gap-2');
    dateInfo.innerHTML = `<i data-lucide="calendar" class="w-4 h-4"></i><span>${booking.date}${booking.bookingTime ? ' at ' + booking.bookingTime : ''}</span>`;
    details.appendChild(dateInfo);
    
    if (booking.serviceDuration) {
        const durationInfo = createElement('div', 'flex items-center gap-2');
        durationInfo.innerHTML = `<i data-lucide="clock" class="w-4 h-4"></i><span>${booking.serviceDuration} hours${booking.serviceType ? ' - ' + booking.serviceType : ''}</span>`;
        details.appendChild(durationInfo);
    }
    
    if (serviceDetails && serviceDetails.location) {
        const locationInfo = createElement('div', 'flex items-center gap-2');
        locationInfo.innerHTML = `<i data-lucide="map-pin" class="w-4 h-4"></i><span>${serviceDetails.location}</span>`;
        details.appendChild(locationInfo);
    }
    
    info.appendChild(serviceName);
    info.appendChild(details);
    
    const rightSection = createElement('div', 'text-right');
    
    const statusBadge = createElement('span', 
        `inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`
    );
    statusBadge.textContent = booking.status || 'Pending';
    
    const price = createElement('p', 'text-lg font-bold mt-2', `$${booking.amount || 0}`);
    
    rightSection.appendChild(statusBadge);
    rightSection.appendChild(price);
    
    content.appendChild(info);
    content.appendChild(rightSection);
    
    card.appendChild(content);
    
    return card;
}

// Función auxiliar para obtener color según estado
function getStatusColor(status) {
    const colors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-blue-100 text-blue-800',
        'in-progress': 'bg-purple-100 text-purple-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

window.onload = function() {
    loadUserProfile();
}