/**
 * User Profile Controller
 * Carga la información del usuario loggeado en la página de perfil
 */

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
      populateUserProfile(userData);
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
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, inicializando perfil de usuario...');
  loadUserProfile();

  // Agregar evento para actualizar el email en settings si cambia de tab
  const settingsTab = document.getElementById('tab-settings');
  if (settingsTab) {
    settingsTab.addEventListener('click', () => {
      // El email ya se habrá cargado cuando se populate el perfil
      console.log('Tab de settings abierto');
    });
  }
});
