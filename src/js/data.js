// Mock data for the Door2Door application

const SERVICES_DATA = [
  {
    id: 1,
    name: "Plumbing",
    description: "Professional plumbing services",
    image: "https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwZml4aW5nJTIwc2lua3xlbnwxfHx8fDE3NTc4NTQxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    providers: 15
  },
  {
    id: 2,
    name: "Carpentry",
    description: "Custom woodwork and repairs",
    image: "https://images.unsplash.com/photo-1638718260002-18bdc8082608?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZW50ZXIlMjB3b29kd29ya2luZ3xlbnwxfHx8fDE3NTc4NjE3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    providers: 12
  },
  {
    id: 3,
    name: "Painting",
    description: "Interior and exterior painting",
    image: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMHBhaW50ZXIlMjBwYWludGluZ3xlbnwxfHx8fDE3NTc5NDg5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7,
    providers: 20
  },
  {
    id: 4,
    name: "Electrical",
    description: "Licensed electrical services",
    image: "https://images.unsplash.com/photo-1665242043190-0ef29390d289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHdvcmtpbmd8ZW58MXx8fHwxNzU3OTIwNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6,
    providers: 8
  },
  {
    id: 5,
    name: "Cleaning",
    description: "Professional home cleaning",
    image: "https://images.unsplash.com/photo-1686178827149-6d55c72d81df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc1NzkyMzUwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    providers: 25
  }
];

const FEATURED_PROVIDERS = [
  {
    id: 1,
    name: "Mike Johnson",
    service: "Plumbing",
    rating: 4.9,
    reviews: 127,
    price: "$75/hr",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    available: true
  },
  {
    id: 2,
    name: "Sarah Williams",
    service: "House Cleaning",
    rating: 4.8,
    reviews: 203,
    price: "$45/hr",
    image: "https://images.unsplash.com/photo-1494790108755-2616b5e38f04?w=150&h=150&fit=crop&crop=face",
    available: true
  },
  {
    id: 3,
    name: "David Chen",
    service: "Carpentry",
    rating: 4.9,
    reviews: 89,
    price: "$85/hr",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    available: false
  }
];

const SERVICE_DETAILS = {
  1: {
    name: "Premium Plumbing Services",
    category: "Plumbing",
    image: "https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwZml4aW5nJTIwc2lua3xlbnwxfHx8fDE3NTc4NTQxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    provider: {
      id: 1,
      name: "Mike Johnson",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 127,
      yearsExperience: 8,
      completedJobs: 342,
      responseTime: "Within 30 minutes",
      availability: "Available Now"
    },
    pricing: {
      hourlyRate: 75,
      serviceCall: 45,
      emergencyRate: 125
    },
    description: "Professional plumbing services including leak repairs, pipe installation, drain cleaning, and emergency services. Licensed and insured with 8+ years of experience.",
    services: [
      "Leak Detection & Repair",
      "Pipe Installation",
      "Drain Cleaning",
      "Water Heater Service",
      "Emergency Plumbing",
      "Fixture Installation"
    ],
    location: "Downtown Area",
    distance: "2.3 miles away"
  }
};

const REVIEWS = [
  {
    id: 1,
    user: "Jennifer Smith",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b5e38f04?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "2 days ago",
    comment: "Mike was fantastic! Fixed our kitchen sink leak quickly and explained everything clearly. Very professional and reasonably priced."
  },
  {
    id: 2,
    user: "Robert Brown",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "1 week ago",
    comment: "Excellent service! Arrived on time, diagnosed the problem quickly. The water heater is working perfectly now. Highly recommend!"
  },
  {
    id: 3,
    user: "Maria Garcia",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    date: "2 weeks ago",
    comment: "Great work on our bathroom renovation plumbing. Professional and clean work. Would definitely use again."
  }
];

const USER_DATA = {
  id: 1,
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  memberSince: "March 2023",
  totalBookings: 12,
  totalSpent: 1245
};

const BOOKING_HISTORY = [
  {
    id: 1,
    service: "Plumbing",
    provider: "Mike Johnson",
    date: "2024-01-15",
    status: "Completed",
    amount: 150,
    rating: 5,
    image: "https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwZml4aW5nJTIwc2lua3xlbnwxfHx8fDE3NTc4NTQxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    service: "House Cleaning",
    provider: "Sarah Williams",
    date: "2024-01-10",
    status: "Completed",
    amount: 120,
    rating: 4,
    image: "https://images.unsplash.com/photo-1686178827149-6d55c72d81df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc1NzkyMzUwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    service: "Electrical Work",
    provider: "Tom Anderson",
    date: "2024-01-20",
    status: "Scheduled",
    amount: 200,
    rating: null,
    image: "https://images.unsplash.com/photo-1665242043190-0ef29390d289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHdvcmtpbmd8ZW58MXx8fHwxNzU3OTIwNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

const PROVIDER_DATA = {
  1: {
    id: 1,
    name: "Mike Johnson",
    title: "Professional Plumber",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwZml4aW5nJTIwc2lua3xlbnwxfHx8fDE3NTc4NTQxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    reviewCount: 127,
    completedJobs: 342,
    yearsExperience: 8,
    responseTime: "30 minutes",
    location: "San Francisco, CA",
    joinDate: "January 2020",
    availability: "Available Now",
    hourlyRate: 75,
    bio: "Licensed master plumber with 8+ years of experience. Specializing in residential and commercial plumbing services. Available for emergency calls 24/7. Fully insured and bonded.",
    services: [
      "Leak Detection & Repair",
      "Pipe Installation", 
      "Drain Cleaning",
      "Water Heater Service",
      "Emergency Plumbing",
      "Fixture Installation",
      "Sewer Line Repair",
      "Bathroom Remodeling"
    ],
    certifications: [
      "Licensed Master Plumber",
      "EPA Certified",
      "OSHA 10 Certified",
      "Backflow Prevention Certified"
    ],
    insurance: "Liability: $2M | Bonded: $50K"
  }
};

const CHAT_CONVERSATIONS = [
  {
    id: 1,
    name: "Mike Johnson",
    service: "Plumber",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    lastMessage: "I'll be there within the hour. See you soon!",
    timestamp: "2:35 PM",
    unread: 0,
    online: true
  },
  {
    id: 2,
    name: "Sarah Williams",
    service: "House Cleaner",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b5e38f04?w=150&h=150&fit=crop&crop=face",
    lastMessage: "What time works best for you tomorrow?",
    timestamp: "Yesterday",
    unread: 2,
    online: false
  },
  {
    id: 3,
    name: "David Chen",
    service: "Carpenter",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    lastMessage: "The custom cabinet job is completed. Thanks!",
    timestamp: "Monday",
    unread: 0,
    online: false
  }
];

const CHAT_MESSAGES = [
  {
    id: 1,
    sender: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    message: "Hi! I'm available for plumbing services. How can I help you today?",
    timestamp: "2:30 PM",
    isProvider: true
  },
  {
    id: 2,
    sender: "You",
    message: "Hi Mike! I have a leaky faucet in my kitchen. Can you take a look?",
    timestamp: "2:32 PM",
    isProvider: false
  },
  {
    id: 3,
    sender: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    message: "Absolutely! I can come by today if needed. What's your address?",
    timestamp: "2:33 PM",
    isProvider: true
  },
  {
    id: 4,
    sender: "You",
    message: "123 Main Street, Apartment 4B. When would be a good time?",
    timestamp: "2:34 PM",
    isProvider: false
  },
  {
    id: 5,
    sender: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    message: "I can be there around 4 PM today if that works for you. The service call is $45 plus $75/hour for the repair work.",
    timestamp: "2:35 PM",
    isProvider: true
  }
];

const SEARCH_SERVICES = [
  {
    id: 1,
    name: "Emergency Plumbing Repair",
    provider: {
      id: 1,
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviews: 127,
      verified: true
    },
    category: "Plumbing",
    price: 75,
    location: "Downtown",
    distance: 2.3,
    image: "https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwZml4aW5nJTIwc2lua3xlbnwxfHx8fDE3NTc4NTQxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableToday: true,
    responseTime: "30 min"
  },
  {
    id: 2,
    name: "Professional House Cleaning",
    provider: {
      id: 2,
      name: "Sarah Williams",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b5e38f04?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviews: 203,
      verified: true
    },
    category: "Cleaning",
    price: 45,
    location: "Midtown",
    distance: 1.8,
    image: "https://images.unsplash.com/photo-1686178827149-6d55c72d81df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc1NzkyMzUwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableToday: true,
    responseTime: "1 hour"
  },
  {
    id: 3,
    name: "Custom Carpentry Work",
    provider: {
      id: 3,
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviews: 89,
      verified: true
    },
    category: "Carpentry",
    price: 85,
    location: "Uptown",
    distance: 3.2,
    image: "https://images.unsplash.com/photo-1638718260002-18bdc8082608?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZW50ZXIlMjB3b29kd29ya2luZ3xlbnwxfHx8fDE3NTc4NjE3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableToday: false,
    responseTime: "2 hours"
  },
  {
    id: 4,
    name: "Interior & Exterior Painting",
    provider: {
      id: 4,
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      reviews: 156,
      verified: true
    },
    category: "Painting",
    price: 65,
    location: "Westside",
    distance: 4.1,
    image: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMHBhaW50ZXIlMjBwYWludGluZ3xlbnwxfHx8fDE3NTc5NDg5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableToday: true,
    responseTime: "1.5 hours"
  },
  {
    id: 5,
    name: "Licensed Electrical Services",
    provider: {
      id: 5,
      name: "Tom Anderson",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
      rating: 4.6,
      reviews: 94,
      verified: true
    },
    category: "Electrical",
    price: 95,
    location: "Eastside",
    distance: 2.9,
    image: "https://images.unsplash.com/photo-1665242043190-0ef29390d289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHdvcmtpbmd8ZW58MXx8fHwxNzU3OTIwNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableToday: true,
    responseTime: "45 min"
  }
];

const CATEGORIES = ["All", "Plumbing", "Cleaning", "Carpentry", "Painting", "Electrical", "HVAC", "Landscaping"];

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", 
  "4:00 PM", "5:00 PM", "6:00 PM"
];

const SERVICE_OPTIONS = [
  { id: "basic", name: "Basic Service", duration: "1-2 hours", price: 75 },
  { id: "standard", name: "Standard Service", duration: "2-4 hours", price: 150 },
  { id: "comprehensive", name: "Comprehensive Service", duration: "4-6 hours", price: 300 },
  { id: "emergency", name: "Emergency Service", duration: "ASAP", price: 125 }
];