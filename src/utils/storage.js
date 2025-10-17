// Local storage utility functions for content management

const STORAGE_KEY = 'vastuvriksha_content';

// Default content structure
const DEFAULT_CONTENT = {
  siteInfo: {
    companyName: "Vastuvriksha",
    tagline: "Creating Spaces, Crafting Dreams",
    description: "Professional Architecture and Interior Design Solutions",
    email: "",
    phone: "",
    address: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: ""
    }
  },
  hero: {
    title: "Transforming Spaces into Living Art",
    subtitle: "Expert Architecture & Interior Design Solutions",
    description: "We bring your vision to life with innovative designs that blend functionality with aesthetics",
    ctaText: "Explore Our Work",
    ctaLink: "/projects"
  },
  about: {
    title: "About Vastuvriksha",
    description: "",
    mission: "",
    vision: "",
    yearsOfExperience: "",
    stats: [
      { id: 1, number: "", label: "Projects Completed" },
      { id: 2, number: "", label: "Happy Clients" },
      { id: 3, number: "", label: "Years Experience" },
      { id: 4, number: "", label: "Awards Won" }
    ]
  },
  services: [
    {
      id: 1,
      title: "Interior Design",
      description: "Complete interior design solutions for residential and commercial spaces",
      icon: "🏠"
    },
    {
      id: 2,
      title: "Architecture",
      description: "Innovative architectural design and planning services",
      icon: "🏛️"
    },
    {
      id: 3,
      title: "Space Planning",
      description: "Optimal space utilization with functional layouts",
      icon: "📐"
    },
    {
      id: 4,
      title: "3D Visualization",
      description: "Realistic 3D renders to visualize your dream space",
      icon: "🎨"
    },
    {
      id: 5,
      title: "Consultation",
      description: "Expert consultation for your design and architecture needs",
      icon: "💡"
    },
    {
      id: 6,
      title: "Project Management",
      description: "End-to-end project management and execution",
      icon: "📋"
    }
  ],
  projects: [
    {
      id: 1,
      title: "",
      category: "residential",
      description: "",
      image: "",
      location: "",
      year: "",
      status: "completed"
    }
  ]
};

export const getContent = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return DEFAULT_CONTENT;
};

export const saveContent = (content) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const resetContent = () => {
  localStorage.removeItem(STORAGE_KEY);
  return Promise.resolve(DEFAULT_CONTENT);
};

// Initialize content from default if localStorage is empty
export const initializeContent = async () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
      return DEFAULT_CONTENT;
    } catch (error) {
      console.error('Error initializing content:', error);
      return DEFAULT_CONTENT;
    }
  }
  return JSON.parse(stored);
};


