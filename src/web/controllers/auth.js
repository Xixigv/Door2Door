// Auth helper for frontend — usa cookies httpOnly para token

async function loginUser(email, password) {
  const res = await fetch('/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include' // importante: envía/recibe cookies
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data && data.error ? data.error : 'Login failed';
    throw new Error(msg);
  }

  if (!data.success || !data.user) throw new Error('User data not received');

  // Guardar user info en localStorage (pero NO el token, que está en cookie httpOnly)
  try { localStorage.setItem('currentUser', JSON.stringify(data.user)); } catch(e) {}

  return data;
}

async function checkSession() {
  try {
    const res = await fetch('/users/checkSession', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include' // envía cookies
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      // Sesión inválida
      clearSession();
      return null;
    }

    // Guardar datos del usuario
    if (data.user) {
      try { localStorage.setItem('currentUser', JSON.stringify(data.user)); } catch(e) {}
    }

    return data;
  } catch (err) {
    console.warn('Error checking session:', err);
    return null;
  }
}

function isAuthenticated() {
  // Simplemente confía en que si hay currentUser, está autenticado
  // (el servidor valida la cookie en cada petición protegida)
  return !!localStorage.getItem('currentUser');
}

function getCurrentUser() {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

function logout() {
  // Llamar al logout en el backend si existe, para borrar la cookie
  fetch('/users/logout', {
    method: 'POST',
    credentials: 'include'
  }).catch(() => {});

  localStorage.removeItem('currentUser');
  window.location.href = '/login';
}

async function fetchWithAuth(url, opts = {}) {
  const headers = Object.assign({}, opts.headers || {});
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  
  const response = await fetch(url, Object.assign({}, opts, { 
    headers,
    credentials: 'include' // envía cookies
  }));
  
  // Si obtenemos 401, la sesión expiró
  if (response.status === 401) {
    clearSession();
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
  }
  
  return response;
}

function clearSession() {
  localStorage.removeItem('currentUser');
}

// Expose globally
window.auth = {
  loginUser,
  checkSession,
  isAuthenticated,
  getCurrentUser,
  logout,
  fetchWithAuth,
  clearSession
};