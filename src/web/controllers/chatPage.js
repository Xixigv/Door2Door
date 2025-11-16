// ==============================
// CONFIGURACIÓN Y ESTADO GLOBAL
// ==============================

let currentUser = null;
let selectedChatId = null;
let chats = [];
let chatMessages = {};

// ==============================
// WEBSOCKET
// ==============================
let socket = null;

function initWebSocket() {
    if (!currentUser || !currentUser.id) return;

    const wsUrl = `wss://p2ksoatha8.execute-api.us-east-2.amazonaws.com/production?userID=${currentUser.id}`;

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

    const apiUrl = `https://pyj8f2353b.execute-api.us-east-2.amazonaws.com/messages?userA=${currentUser.id}`;
    const response = await fetch(apiUrl, { credentials: 'include' });
    const data = await response.json();

    if (!data.conversations || Object.keys(data.conversations).length === 0) {
      console.warn("⚠️ No hay conversaciones disponibles.");
      return;
    }

    // ------------------------------------------------------
    // 🧠 Convertir conversaciones, agregando datos reales del usuario
    // ------------------------------------------------------
    chats = await Promise.all(
      Object.entries(data.conversations).map(async ([convId, messages]) => {
        const parts = convId.split('#');
        const otherUserId = parts[0] === String(currentUser.id) ? parts[1] : parts[0];
        const lastMsg = messages[messages.length - 1];

        // 👉 Cargar datos reales del otro usuario
        const otherUser = await getUserById(otherUserId);

        const avatarURL = otherUser?.avatar
          ? otherUser.avatar
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || "U" + otherUserId)}`;

        return {
          id: String(otherUserId),
          name: otherUser?.name || `Usuario ${otherUserId}`,
          avatar: `<img src="${avatarURL}" class="w-10 h-10 rounded-full"/>`,
          lastMessage: lastMsg?.message || "(sin mensajes)",
          timestamp: lastMsg
            ? new Date(parseInt(lastMsg.timestamp) * 1000).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })
            : "",
          unread: false
        };
      })
    );

    // ------------------------------------------------------
    // 🧠 Guardar mensajes normalizados
    // ------------------------------------------------------
    chatMessages = {};
    Object.entries(data.conversations).forEach(([convId, messages]) => {
      const parts = convId.split('#');
      const otherUserId = parts[0] === String(currentUser.id) ? parts[1] : parts[0];

      chatMessages[String(otherUserId)] = messages.map(m => ({
        from: String(m.from),
        to: String(m.to),
        message: m.message,
        timestamp: Number(m.timestamp)
      }));
    });

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
        <div class="grid gap-4">${messagesHTML}</div>
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
    } else {
        console.error("❌ WebSocket no disponible. Reintentando conexión...");
        initWebSocket();
    }
}

// ==============================
// INICIALIZACIÓN
// ==============================
window.onload = async () => {
    await loadCurrentUser();
    await loadChats();
    initWebSocket();
};
