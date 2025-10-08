# Door2Door - Service Marketplace

A professional service marketplace application built with vanilla HTML, CSS, and JavaScript. Connect with trusted local professionals for home services like plumbing, carpentry, painting, electrical work, and cleaning.

## Features

### 🏠 Complete Service Marketplace
- Browse services by category
- Search and filter providers  
- View detailed service information
- Book appointments with calendar scheduling
- Chat with service providers
- User and provider profiles
- Booking history and reviews

### 📱 Responsive Design
- Mobile-first responsive design
- Works seamlessly on desktop and mobile
- Professional, modern UI with smooth animations

### 💬 Real-time Communication
- Chat popup for quick messages
- Full-page chat interface
- Conversation history
- Online/offline status indicators

### 🔍 Advanced Search
- Filter by category, price, distance
- Sort by rating, price, proximity
- Available today filter
- Verified providers only option

## File Structure

```
├── index.html              # Main HTML file
├── styles/
│   ├── globals.css         # Tailwind V4 global styles & variables
│   └── main.css           # Custom component styles
├── js/
│   ├── main.js            # App initialization & global functions
│   ├── router.js          # Client-side routing
│   ├── pages.js           # Page rendering functions
│   ├── components.js      # Reusable component functions
│   ├── data.js            # Mock data
│   └── utils.js           # Utility functions
└── README.md
```

## Getting Started

1. **Open the application:**
   - Open `index.html` in a web browser
   - Or serve with any static file server

2. **Navigation:**
   - Use the header navigation to browse services
   - Click on service cards to view details
   - Use the search page for advanced filtering
   - Access profiles and chat through the interface

## Pages & Routes

- **Home (`/`)** - Hero section, service categories, featured providers
- **Search (`/search`)** - Advanced search with filters and sorting  
- **Service Detail (`/service/:id`)** - Full service details, provider info, reviews
- **Calendar (`/calendar/:serviceId`)** - Book appointments with date/time selection
- **User Profile (`/profile/user/:id`)** - User dashboard, booking history, settings
- **Provider Profile (`/profile/provider/:id`)** - Provider details, stats, services
- **Chat (`/chat`)** - Full messaging interface with conversations

## Key Components

### Router
- Hash-based client-side routing
- Parameterized routes support
- 404 and error page handling

### Chat System
- Popup chat for quick messaging
- Full-page chat interface
- Message sending and receiving
- Conversation management

### Search & Filtering
- Real-time search functionality
- Multiple filter options
- Sort by various criteria
- Results pagination

### Calendar Booking
- Interactive date selection
- Available time slots
- Service type options
- Booking summary and confirmation

## Styling

Uses a combination of:
- **Tailwind V4** for utility classes and design system
- **Custom CSS** for component-specific styling
- **CSS Custom Properties** for theming and consistency
- **Responsive breakpoints** for mobile/desktop layouts

## Data

All data is currently mocked and includes:
- Services and categories
- Service providers with profiles
- User accounts and booking history
- Chat conversations and messages
- Reviews and ratings
- Calendar availability

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

The application is built with vanilla web technologies:
- No build process required
- No dependencies or frameworks
- Direct file editing for customization
- Instant preview in browser

## Future Enhancements

- Backend integration with APIs
- Real-time messaging with WebSockets
- Payment processing integration
- User authentication system
- Push notifications
- Geolocation services
- Progressive Web App features

---

Built with ❤️ using vanilla HTML, CSS, and JavaScript