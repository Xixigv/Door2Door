// Page rendering functions for the Door2Door application

// Home Page


// Service Detail Page

// Search Page


// Calendar Page


// User Profile Page
function renderUserProfile() {
    const container = createElement('div', 'min-h-screen bg-gray-50');
    const mainContainer = createElement('div', 'container mx-auto px-4 py-6');
    
    // Profile header
    const profileCard = createCard('', '');
    const profileContent = createElement('div', 'flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6');
    
    const avatar = createAvatar(USER_DATA.avatar, USER_DATA.name, 'avatar avatar-xl');
    
    const userInfo = createElement('div', 'flex-1');
    const userName = createElement('h1', 'text-2xl font-bold mb-2', USER_DATA.name);
    const userDetails = createElement('div', 'space-y-1 text-muted-foreground mb-4');
    
    const locationInfo = createElement('div', 'flex items-center space-x-2');
    const locationIcon = createIcon('map-pin', 'w-4 h-4');
    const location = createElement('span', '', USER_DATA.location);
    locationInfo.appendChild(locationIcon);
    locationInfo.appendChild(location);
    
    const memberSince = createElement('div', '', `Member since ${USER_DATA.memberSince}`);
    
    userDetails.appendChild(locationInfo);
    userDetails.appendChild(memberSince);
    
    const userStats = createElement('div', 'flex flex-wrap gap-4 text-sm');
    const bookingsStats = createElement('div', 'bg-primary/10 px-3 py-1 rounded-full');
    bookingsStats.innerHTML = `<span class="font-medium">${USER_DATA.totalBookings}</span> bookings completed`;
    
    const spentStats = createElement('div', 'bg-green-100 px-3 py-1 rounded-full');
    spentStats.innerHTML = `<span class="font-medium">$${USER_DATA.totalSpent}</span> total spent`;
    
    userStats.appendChild(bookingsStats);
    userStats.appendChild(spentStats);
    
    userInfo.appendChild(userName);
    userInfo.appendChild(userDetails);
    userInfo.appendChild(userStats);
    
    const editBtn = createButton(
        '<i data-lucide="settings" class="w-4 h-4 mr-2"></i>Edit Profile',
        null,
        'btn btn-outline'
    );
    
    profileContent.appendChild(avatar);
    profileContent.appendChild(userInfo);
    profileContent.appendChild(editBtn);
    
    profileCard.querySelector('.card-content').appendChild(profileContent);
    
    // Tabs
    const tabsContainer = createElement('div', 'mt-6');
    const tabsList = createElement('div', 'tabs-list');
    
    const tabs = [
        { id: 'bookings', label: 'Bookings' },
        { id: 'favorites', label: 'Favorites' },
        { id: 'payments', label: 'Payments' },
        { id: 'settings', label: 'Settings' }
    ];
    
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
    
    BOOKING_HISTORY.forEach(booking => {
        const bookingItem = createBookingHistoryItem(booking);
        bookingsContainer.appendChild(bookingItem);
    });
    
    recentBookingsCard.querySelector('.card-content').appendChild(bookingsContainer);
    
    const quickActionsCard = createCard('Quick Actions', '');
    const actionsContainer = createElement('div', 'space-y-3');
    
    const actions = [
        { icon: 'calendar', text: 'Book New Service', href: '#/search' },
        { icon: 'star', text: 'Leave Reviews', href: '#' },
        { icon: 'credit-card', text: 'Payment History', href: '#' },
        { icon: 'bell', text: 'Notification Settings', href: '#' }
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

// Provider Profile Page

// Chat Page
function renderChatPage() {
    const container = createElement('div', 'h-[calc(100vh-80px)] bg-gray-50');
    const chatContainer = createElement('div', 'h-full flex');
    
    // Conversations list
    const conversationsList = createElement('div', 'w-1/3 bg-white border-r flex flex-col');
    
    const conversationsHeader = createElement('div', 'p-4 border-b');
    const headerRow = createElement('div', 'flex items-center justify-between');
    const title = createElement('h2', 'text-xl font-bold', 'Messages');
    const backBtn = createButton(
        '<i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>Back',
        () => navigateTo('/'),
        'btn btn-ghost btn-sm'
    );
    
    headerRow.appendChild(title);
    headerRow.appendChild(backBtn);
    conversationsHeader.appendChild(headerRow);
    
    const conversationsContent = createElement('div', 'flex-1 overflow-y-auto p-2');
    
    CHAT_CONVERSATIONS.forEach((conversation, index) => {
        const conversationItem = createElement('div', 
            `p-3 rounded-lg cursor-pointer transition-colors ${
                index === 0 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50'
            }`
        );
        
        const conversationContent = createElement('div', 'flex items-start space-x-3');
        
        const avatarContainer = createElement('div', 'relative');
        const avatar = createAvatar(conversation.avatar, conversation.name, 'avatar');
        avatarContainer.appendChild(avatar);
        
        if (conversation.online) {
            const onlineIndicator = createElement('div', 'absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white');
            avatarContainer.appendChild(onlineIndicator);
        }
        
        const textContent = createElement('div', 'flex-1 min-w-0');
        const headerRow = createElement('div', 'flex items-center justify-between mb-1');
        const name = createElement('h3', 'font-medium truncate', conversation.name);
        
        const rightSide = createElement('div', 'flex items-center space-x-2');
        const timestamp = createElement('span', 'text-xs text-muted-foreground', conversation.timestamp);
        rightSide.appendChild(timestamp);
        
        if (conversation.unread > 0) {
            const unreadBadge = createBadge(conversation.unread.toString(), 'badge badge-destructive h-5 min-w-5 text-xs');
            rightSide.appendChild(unreadBadge);
        }
        
        headerRow.appendChild(name);
        headerRow.appendChild(rightSide);
        
        const service = createElement('p', 'text-sm text-muted-foreground mb-1', conversation.service);
        const lastMessage = createElement('p', 'text-sm text-muted-foreground truncate', conversation.lastMessage);
        
        textContent.appendChild(headerRow);
        textContent.appendChild(service);
        textContent.appendChild(lastMessage);
        
        conversationContent.appendChild(avatarContainer);
        conversationContent.appendChild(textContent);
        conversationItem.appendChild(conversationContent);
        
        conversationsContent.appendChild(conversationItem);
    });
    
    conversationsList.appendChild(conversationsHeader);
    conversationsList.appendChild(conversationsContent);
    
    // Chat area
    const chatArea = createElement('div', 'flex-1 flex flex-col bg-white');
    
    // Chat header
    const chatHeader = createElement('div', 'p-4 border-b');
    const chatHeaderContent = createElement('div', 'flex items-center justify-between');
    
    const activeConversation = CHAT_CONVERSATIONS[0];
    const chatHeaderLeft = createElement('div', 'flex items-center space-x-3');
    const chatAvatar = createAvatar(activeConversation.avatar, activeConversation.name, 'avatar');
    
    const chatUserInfo = createElement('div');
    const chatUserName = createElement('h3', 'font-medium', activeConversation.name);
    const chatUserStatus = createElement('p', 'text-sm text-muted-foreground', 
        `${activeConversation.service} • ${activeConversation.online ? 'Online' : 'Offline'}`);
    
    chatUserInfo.appendChild(chatUserName);
    chatUserInfo.appendChild(chatUserStatus);
    
    chatHeaderLeft.appendChild(chatAvatar);
    chatHeaderLeft.appendChild(chatUserInfo);
    
    const chatActions = createElement('div', 'flex items-center space-x-2');
    const phoneBtn = createButton('<i data-lucide="phone" class="w-4 h-4"></i>', null, 'btn btn-ghost btn-sm');
    const videoBtn = createButton('<i data-lucide="video" class="w-4 h-4"></i>', null, 'btn btn-ghost btn-sm');
    const moreBtn = createButton('<i data-lucide="more-vertical" class="w-4 h-4"></i>', null, 'btn btn-ghost btn-sm');
    
    chatActions.appendChild(phoneBtn);
    chatActions.appendChild(videoBtn);
    chatActions.appendChild(moreBtn);
    
    chatHeaderContent.appendChild(chatHeaderLeft);
    chatHeaderContent.appendChild(chatActions);
    chatHeader.appendChild(chatHeaderContent);
    
    // Messages
    const messagesArea = createElement('div', 'flex-1 overflow-y-auto p-4');
    const messagesContainer = createElement('div', 'space-y-4');
    
    CHAT_MESSAGES.forEach(message => {
        const messageElement = createChatMessage(message);
        messagesContainer.appendChild(messageElement);
    });
    
    messagesArea.appendChild(messagesContainer);
    
    // Message input
    const messageInput = createElement('div', 'p-4 border-t');
    const inputForm = createElement('form', 'flex space-x-2');
    
    const textInput = createElement('input', 'input flex-1');
    textInput.type = 'text';
    textInput.placeholder = 'Type a message...';
    
    const sendBtn = createButton('<i data-lucide="send" class="w-4 h-4"></i>', null, 'btn btn-primary');
    
    inputForm.appendChild(textInput);
    inputForm.appendChild(sendBtn);
    messageInput.appendChild(inputForm);
    
    chatArea.appendChild(chatHeader);
    chatArea.appendChild(messagesArea);
    chatArea.appendChild(messageInput);
    
    chatContainer.appendChild(conversationsList);
    chatContainer.appendChild(chatArea);
    container.appendChild(chatContainer);
    
    return container;
}