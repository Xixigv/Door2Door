// ==============================
// CONFIGURACIÓN Y ESTADO GLOBAL
// ==============================
let currentUser = null;
let selectedChatId = null;
let chats = [];
let chatMessages = {};

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
// CARGAR CHATS REALES
// ==============================
async function loadChats() {
    try {
    if (!currentUser || !currentUser.id) return;

    const apiUrl = `https://pyj8f2353b.execute-api.us-east-2.amazonaws.com/messages?userA=${currentUser.id}`;
    const response = await fetch(apiUrl, { credentials: 'include' });
    const data = await response.json();

    console.log("📦 Datos cargados del backend:", data);

    if (!data.conversations || Object.keys(data.conversations).length === 0) {
        console.warn("⚠️ No hay conversaciones disponibles.");
        return;
    }

    // Transformar datos del backend al formato visual
    chats = Object.entries(data.conversations).map(([otherUserId, messages]) => {
        const lastMsg = messages[messages.length - 1];
        return {
        id: otherUserId,
        name: `Usuario ${otherUserId}`,
        avatar: `<img src="https://ui-avatars.com/api/?name=U${otherUserId}" class="w-10 h-10 rounded-full"/>`,
        lastMessage: lastMsg?.message || "(sin mensajes)",
        timestamp: new Date(parseInt(lastMsg?.timestamp) * 1000).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        unread: false
        };
    });

    chatMessages = data.conversations;
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
    <div class="flex ${msg.from == currentUser.id ? 'justify-end' : 'justify-start'}">
        <div class="message-card ${msg.from == currentUser.id ? 'me' : ''}">
        <p>${msg.message}</p>
        <span class="text-xs mt-1 block ${msg.from == currentUser.id ? 'text-gray-300' : 'text-gray-500'}">
            ${new Date(parseInt(msg.timestamp) * 1000).toLocaleTimeString('es-ES', {
            hour: '2-digit', minute: '2-digit'
            })}
        </span>
        </div>
    </div>
    `).join('');

    container.innerHTML = `
    <div class="chat-window-card">
        <div class="p-4 border-b border-gray-200 flex items-center gap-3">
        <div class="avatar">${selectedChat.avatar}</div>
        <h2>${selectedChat.name}</h2>
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

    const newMsg = {
    from: currentUser.id,
    to: selectedChatId,
    message: text,
    timestamp: Math.floor(Date.now() / 1000)
    };

    // Mostrar instantáneamente
    if (!chatMessages[selectedChatId]) chatMessages[selectedChatId] = [];
    chatMessages[selectedChatId].push(newMsg);
    renderChatWindow();

    input.value = '';

    // Enviar al backend vía WebSocket
    if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(newMsg));
    }
}

// ==============================
// INICIALIZACIÓN
// ==============================
window.onload = async () => {
    await loadCurrentUser();
    await loadChats();
    console.log("✅ Chats cargados correctamente");
};