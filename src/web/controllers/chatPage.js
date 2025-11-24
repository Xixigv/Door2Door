// ==============================
// CONFIGURACIÓN Y ESTADO GLOBAL
// ==============================

let currentUser = null;
let selectedChatId = null;
let chats = [];
let chatMessages = {};
let wsUrl = null;

// ==============================
// WEBSOCKET
// ==============================
let socket = null;

function initWebSocket() {
    if (!currentUser || !currentUser.id) return;

    console.log("Iniciando WebSocket con URL:", wsUrl);
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("🔌 WebSocket conectado como usuario:", currentUser.id);
    };

    socket.onmessage = (event) => {
        console.log("📩 Mensaje recibido raw:", event.data);

        let msg;
        try {
            msg = JSON.parse(event.data);
        } catch (e) {
            console.warn("No se pudo parsear el mensaje:", e);
            return;
        }

        console.log("Mensaje recibido parseado:", msg, "Current user:", currentUser.id);

        if (String(msg.from) === String(currentUser.id)) {
            return;
        }

        // Normaliza tipos a string
        const from = String(msg.from);
        const to = msg.to !== undefined ? String(msg.to) : String(currentUser.id);
        const message = msg.message;
        const timestamp = msg.timestamp || Math.floor(Date.now() / 1000);

        const chatId = from === String(currentUser.id) ? to : from; // conversación con el otro

        // crea array si no existe
        if (!chatMessages[chatId]) chatMessages[chatId] = [];

        // empujar mensaje con estructura consistente
        chatMessages[chatId].push({
            from,
            to,
            message,
            timestamp: Number(timestamp)
        });

        // actualizar lista/ventana
        if (selectedChatId !== chatId) {
            chats = chats.map(c =>
                c.id === chatId ? { ...c, unread: true, lastMessage: message } : c
            );
            renderChatList();
        } else {
            renderChatWindow();
        }
    };

    socket.onclose = () => {
        console.warn("⚠️ WebSocket desconectado. Reintentando en 3s...");
        setTimeout(initWebSocket, 3000);
    };

    socket.onerror = (err) => {
        console.error("❌ Error en WebSocket:", err);
    };
}

// Function to get WebSocket URL
async function getSocketUrl() {
    try {
        const response = await fetch('/chat/socket');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.wsUrl;
    } catch (error) {
        console.error('Error fetching socket URL:', error);
        throw error;
    }
}

// Function to get messages/Lambda URL
async function getMessagesUrl() {
    try {
        const response = await fetch('/chat/messages');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data.apiUrl);
        return data.apiUrl;
    } catch (error) {
        console.error('Error fetching messages URL:', error);
        throw error;
    }
}

// ==============================
// CARGAR USUARIO AUTENTICADO
// ==============================
async function loadCurrentUser() {
    try {
        const res = await fetch('/users/profile/me', {
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success && data.data) {
            currentUser = data.data;
            console.log("👤 Usuario autenticado:", currentUser);
        } else {
            console.warn("No se pudo cargar el usuario autenticado.");
        }
    } catch (err) {
        console.error("Error al obtener usuario:", err);
    }
}

// ==============================
// CARGAR DATOS DE USUARIOS
// ==============================
async function getUserById(userId) {
  try {
    const response = await fetch(`/users/basic/${userId}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.success ? result.data : null;

  } catch (e) {
    console.error("Error cargando usuario:", e);
    return null;
  }
}

// ==============================
// CARGAR CHATS REALES
// ==============================
async function loadChats() {
  try {
    if (!currentUser || !currentUser.id) return;

    apiUrl = await getMessagesUrl();
    apiUrl = apiUrl + `/messages?userA=${currentUser.id}`;
    const response = await fetch(apiUrl, { credentials: 'include' });
    const data = await response.json();

    if (!data.conversations || Object.keys(data.conversations).length === 0) {
      console.warn("No hay conversaciones disponibles.");
      return;
    }

    const convArray = Object.entries(data.conversations);

    // Obtener IDs de usuarios
    const userIds = convArray.map(([convId]) => {
      const parts = convId.split('#');
      return parts[0] === String(currentUser.id) ? parts[1] : parts[0];
    });

    // Obtener datos reales en paralelo
    const userResults = await Promise.all(
      userIds.map(uid => getUserById(uid))
    );

    // Diccionario rápido
    const userMap = {};
    userIds.forEach((id, i) => {
      userMap[id] = userResults[i];
    });

    // Crear las cards de chat
    chats = convArray.map(([convId, messages], index) => {
        const otherUserId = userIds[index];
        const otherUser = userMap[otherUserId];
        const lastMsg = messages[messages.length - 1];

        const rawTimestamp = lastMsg ? Number(lastMsg.timestamp) : 0;

        const avatarURL = otherUser?.avatar;

        return {
        id: String(otherUserId),
        name: otherUser?.name || `Usuario ${otherUserId}`,
        avatar: `<img src="${avatarURL}" class="w-10 h-10 rounded-full"/>`,
        lastMessage: lastMsg?.message || "(sin mensajes)",
        timestamp: rawTimestamp
            ? new Date(rawTimestamp * 1000).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit"
            })
            : "",
        _rawTimestamp: rawTimestamp,
        unread: false
        };
    });

    chatMessages = {};
    convArray.forEach(([convId, messages], index) => {
        const otherUserId = userIds[index];
        chatMessages[String(otherUserId)] = messages.map(msg => ({
            from: String(msg.from),
            to: String(msg.to),
            message: msg.message,
            timestamp: Number(msg.timestamp)
        }));
    });
    // ORDENAR POR MÁS RECIENTE
    chats.sort((a, b) => (b._rawTimestamp || 0) - (a._rawTimestamp || 0));

    // Render
    renderChatList();
    renderChatWindow();

    } catch (error) {
    console.error("Error cargando chats:", error);
    }
}


// ==============================
// RENDERIZADO DEL LISTADO DE CHATS
// ==============================
function renderChatList() {
    const chatListEl = document.getElementById('chatList');
    if (!chatListEl) return;

    chatListEl.innerHTML = chats.map(chat => `
    <div class="mb-3 pr-1">
        <div class="chat-card ${chat.id === selectedChatId ? 'selected' : ''} ${chat.unread ? 'unread' : ''}" onclick="selectChat('${chat.id}')">
        <div class="flex items-start gap-3">
            <div class="avatar">${chat.avatar}</div>
            <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
                <p class="font-medium">${chat.name}</p>
                <span class="text-gray-500 text-sm">${chat.timestamp}</span>
            </div>
            <p class="text-sm truncate ${chat.unread ? 'text-black' : 'text-gray-500'}">
                ${chat.lastMessage}
            </p>
            </div>
            ${chat.unread ? '<div class="unread-dot mt-2"></div>' : ''}
        </div>
        </div>
    </div>
    `).join('');
}

// ==============================
// RENDERIZADO DEL CHAT SELECCIONADO
// ==============================
function renderChatWindow() {
    const container = document.getElementById('chatWindowContainer');
    if (!container) return;

    if (!selectedChatId) {
        container.innerHTML = `
        <div class="h-full flex items-center justify-center bg-white rounded-lg">
            <p class="text-gray-500">Selecciona un chat para comenzar</p>
        </div>
        `;
        return;
    }

    const messages = chatMessages[selectedChatId] || [];
    const selectedChat = chats.find(c => c.id === selectedChatId);

    const messagesHTML = messages.map(msg => `
    <div class="flex ${msg.from == String(currentUser.id) ? 'justify-end' : 'justify-start'}">
        <div class="message-card ${msg.from == String(currentUser.id) ? 'me' : ''}">
        <p>${msg.message}</p>
        <span class="text-xs mt-1 block ${msg.from == String(currentUser.id) ? 'text-gray-300' : 'text-gray-500'}">
            ${new Date(Number(msg.timestamp) * 1000).toLocaleTimeString('es-ES', {
                hour: '2-digit', minute: '2-digit'
            })}
        </span>
        </div>
    </div>
    `).join('');

    container.innerHTML = `
    <div class="chat-window-card">
        <div class="p-4 border-b border-gray-200 flex items-center gap-3">
        <div class="avatar">${selectedChat?.avatar || ''}</div>
        <h2>${selectedChat?.name || ''}</h2>
        </div>
        
        <div id="messagesContainer" class="custom-scrollbar overflow-y-auto p-6">
        <div class="flex flex-col gap-4">${messagesHTML}</div>
        </div>
        
        <div class="p-4 border-t border-gray-200">
        <div class="flex gap-2">
            <input type="text" id="messageInput" class="input-field flex-1" placeholder="Escribe un mensaje..." onkeypress="handleKeyPress(event)" />
            <button class="btn-send" onclick="sendMessage()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            </button>
        </div>
        </div>
    </div>
    `;

    // Auto scroll
    setTimeout(() => {
        const msgContainer = document.getElementById('messagesContainer');
        if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 50);
}

// ==============================
// ACTUALIZAR CARD DE CHAT DESPUÉS DE ENVIAR MENSAJE
// ==============================

function updateChatCardAfterSend(toUserId, messageText) {
  const now = Math.floor(Date.now() / 1000);

  // 1. Actualizar la card correspondiente
  let existing = chats.find(c => c.id === String(toUserId));

  if (existing) {
    existing.lastMessage = messageText;
    existing._rawTimestamp = now;
    existing.timestamp = new Date(now * 1000).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    });
  } else {
    // Crear card si no existe (primer mensaje)
    existing = {
      id: String(toUserId),
      name: "Usuario " + toUserId,
      avatar: "",
      lastMessage: messageText,
      timestamp: new Date(now * 1000).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      _rawTimestamp: now,
      unread: false
    };
    chats.push(existing);
  }

  // 2. Reordenar chats: más recientes arriba
  chats.sort((a, b) => (b._rawTimestamp || 0) - (a._rawTimestamp || 0));

  // 3. Volver a renderizar la lista
  renderChatList();
}


// ==============================
// INTERACCIÓN DE USUARIO
// ==============================
function selectChat(chatId) {
    selectedChatId = chatId;
    chats = chats.map(chat => chat.id === chatId ? { ...chat, unread: false } : chat);
    renderChatList();
    renderChatWindow();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text || !selectedChatId || !currentUser) return;

    // Aseguramos strings para from/to
    const payload = {
        action: 'sendMessage',
        from: String(currentUser.id),
        to: String(selectedChatId),
        message: text
    };

    // Mostrar instantáneamente en la UI con timestamp
    if (!chatMessages[selectedChatId]) chatMessages[selectedChatId] = [];
    const localMsg = {
        from: String(currentUser.id),
        to: String(selectedChatId),
        message: text,
        timestamp: Math.floor(Date.now() / 1000)
    };
    chatMessages[selectedChatId].push(localMsg);
    renderChatWindow();

    input.value = '';

    // Enviar al backend vía WebSocket
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
        updateChatCardAfterSend(selectedChatId, text);
    } else {
        console.error("WebSocket no disponible. Reintentando conexión...");
        initWebSocket();
    }
}

// ==============================
// BUSCADOR DE NUEVAS PERSONAS / PROVEEDORES
// ==============================

const searchInput = document.getElementById("searchInput");
const searchBox = document.getElementById("searchResultsBox");

searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();

    // Cuando se borre → ocultar resultsBox COMPLETAMENTE
    if (query.length === 0) {
        searchBox.classList.add("hidden");
        searchBox.innerHTML = "";   // Limpia contenido (evita que quede el texto “sin resultados”)
        return;
    }

    // Cuando hay texto → buscar proveedores
    const results = await searchProviders(query);
    renderSearchResults(results);
});

// ==============================
//  Llamada al backend
// ==============================
async function searchProviders(query) {
    try {
        const res = await fetch(`/users/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        console.log("Respuesta backend:", data);

        return data.results || []; 
    } catch (e) {
        console.error("Error buscando proveedores:", e);
        return [];
    }
}

// ==============================
//  Render de resultados
// ==============================
function renderSearchResults(list) {
    const box = document.getElementById("searchResultsBox");

    if (!box) return;

    // Si no hay búsqueda → ocultar box por completo
    if (!list || list.length === 0) {
        if (searchInput.value.trim().length === 0) {
            box.classList.add("hidden");
            box.innerHTML = "";
            return;
        }

        box.classList.remove("hidden");
        box.innerHTML = box.innerHTML = `<p class="text-gray-400 px-3 py-2">Sin resultados</p>`;
        return;
    }

    box.classList.remove("hidden");

    box.innerHTML = list.map(u => `
        <div 
            class="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            onclick="selectFromSearch('${u.id}', '${u.name}', '${u.avatar}')"
        >
            <img src="${u.avatar}" class="w-8 h-8 rounded-full">
            <span>${u.name}</span>
        </div>
    `).join('');
}

// ==============================
// CREAR / ABRIR CHAT DESDE BUSCADOR
// ==============================
async function selectFromSearch(userId, name, avatarUrl) {
    // 1. Aseguramos que avatar sea HTML consistente
    const avatarHTML = `
        <img src="${avatarUrl}" class="w-10 h-10 rounded-full"/>
    `;

    // 2. Ver si el chat ya existe
    let existingChat = chats.find(c => c.id === String(userId));

    if (!existingChat) {
        console.log("🆕 Creando nuevo chat local con", userId);

        // Crear un chat vacío para este proveedor
        existingChat = {
            id: String(userId),
            name,
            avatar: avatarHTML,
            lastMessage: "(nuevo chat)",
            timestamp: "",
            unread: false
        };

        chats.unshift(existingChat); // lo ponemos arriba de la lista
        chatMessages[userId] = [];   // chat nuevo → sin mensajes
    }

    // 3. Seleccionarlo
    selectedChatId = String(userId);

    // 4. Actualizar UI
    renderChatList();
    renderChatWindow();

    // 5. Ocultar resultados y limpiar input
    const box = document.getElementById("searchResultsBox");
    const input = document.getElementById("searchInput");

    if (box) {
        box.classList.add("hidden");
        box.innerHTML = "";
    }

    if (input) {
        input.value = "";
    }
}

// ==============================
// FUTURO: crear nuevo chat
// (por ahora solo imprime en consola)
// ==============================
function startNewChat(userId) {
    console.log("Abrir chat con:", userId);

    // TODO: aquí después conectamos "abrir chat"
    
    searchResultsEl.classList.add("hidden");
    searchInput.value = "";
}

// ==============================
// INICIALIZACIÓN
// ==============================
window.onload = async () => {
    await loadCurrentUser();
    await loadChats();
    wsUrl = await getSocketUrl();
    wsUrl = wsUrl + `?userID=${currentUser.id}`;
    initWebSocket();
};
