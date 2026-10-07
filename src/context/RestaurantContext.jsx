import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_RESTAURANTS } from '../data/defaultRestaurants';

const RestaurantContext = createContext();

const STORAGE_KEY = 'real_photography_qr_menu_devi_v1';
const ACTIVE_RESTAURANT_KEY = 'real_photography_qr_slug_devi_v1';

export function RestaurantProvider({ children }) {
  const [restaurants, setRestaurants] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load restaurants from localStorage', e);
    }
    return DEFAULT_RESTAURANTS;
  });

  // Determine active restaurant from URL hash / path or localStorage
  const getInitialSlug = () => {
    const path = window.location.pathname;
    const match = path.match(/\/menu\/([^/?#]+)/);
    if (match && match[1]) return match[1];

    const params = new URLSearchParams(window.location.search);
    if (params.get('restaurant')) return params.get('restaurant');

    const hashMatch = window.location.hash.match(/menu\/([^/?#]+)/);
    if (hashMatch && hashMatch[1]) return hashMatch[1];

    const saved = localStorage.getItem(ACTIVE_RESTAURANT_KEY);
    if (saved && DEFAULT_RESTAURANTS.some(r => r.slug === saved)) return saved;

    return 'royal-dining';
  };

  const [activeSlug, setActiveSlug] = useState(getInitialSlug);

  // Active restaurant object
  const activeRestaurant = restaurants.find(r => r.slug === activeSlug) || restaurants[0] || DEFAULT_RESTAURANTS[0];

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
    } catch (e) {
      console.error('Failed to save restaurants to localStorage', e);
    }
  }, [restaurants]);

  useEffect(() => {
    if (activeSlug) {
      localStorage.setItem(ACTIVE_RESTAURANT_KEY, activeSlug);
    }
  }, [activeSlug]);

  // Inject Theme CSS Variables dynamically into root
  useEffect(() => {
    if (!activeRestaurant) return;
    const { theme } = activeRestaurant;
    const root = document.documentElement;

    root.style.setProperty('--color-primary', theme.primaryColor || '#c99738');
    root.style.setProperty('--color-accent', theme.accentColor || '#8b1e2f');
    root.style.setProperty('--color-bg', theme.bgColor || '#0d0e12');
    root.style.setProperty('--bg-gradient', theme.bgGradient || 'linear-gradient(180deg, #0d0e12 0%, #16181f 100%)');
    root.style.setProperty('--color-card-bg', theme.cardBg || 'rgba(26, 29, 38, 0.75)');
    root.style.setProperty('--color-text-primary', theme.textPrimary || '#f5f5f7');
    root.style.setProperty('--color-text-secondary', theme.textSecondary || '#a1a1aa');
    root.style.setProperty('--font-heading', theme.fontHeading || "'Playfair Display', serif");
    root.style.setProperty('--font-body', theme.fontBody || "'Plus Jakarta Sans', sans-serif");
  }, [activeRestaurant]);

  // Restaurant Switcher
  const switchRestaurant = (slug) => {
    if (restaurants.some(r => r.slug === slug)) {
      setActiveSlug(slug);
      // Update URL without page reload
      window.history.pushState({}, '', `/menu/${slug}${window.location.search}`);
    }
  };

  // Update active restaurant details
  const updateRestaurantSettings = (updates) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === activeRestaurant.id ? { ...r, ...updates } : r))
    );
  };

  // Update theme
  const updateTheme = (themeUpdates) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === activeRestaurant.id ? { ...r, theme: { ...r.theme, ...themeUpdates } } : r))
    );
  };

  // Menu item CRUD
  const addMenuItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `item-${Date.now()}`,
      rating: newItem.rating || 5.0,
      reviewCount: newItem.reviewCount || 1,
    };
    setRestaurants(prev =>
      prev.map(r => {
        if (r.id === activeRestaurant.id) {
          return { ...r, items: [itemWithId, ...r.items] };
        }
        return r;
      })
    );
    return itemWithId;
  };

  const updateMenuItem = (itemId, updates) => {
    setRestaurants(prev =>
      prev.map(r => {
        if (r.id === activeRestaurant.id) {
          return {
            ...r,
            items: r.items.map(item => (item.id === itemId ? { ...item, ...updates } : item)),
          };
        }
        return r;
      })
    );
  };

  const deleteMenuItem = (itemId) => {
    setRestaurants(prev =>
      prev.map(r => {
        if (r.id === activeRestaurant.id) {
          return {
            ...r,
            items: r.items.filter(item => item.id !== itemId),
          };
        }
        return r;
      })
    );
  };

  const toggleItemAvailability = (itemId) => {
    const item = activeRestaurant.items.find(i => i.id === itemId);
    if (item) {
      updateMenuItem(itemId, { isAvailable: !item.isAvailable });
    }
  };

  // Category CRUD
  const addCategory = (categoryName, icon = '🍽️') => {
    const newCategory = {
      id: categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: categoryName,
      icon,
      order: activeRestaurant.categories.length + 1,
      active: true,
    };
    setRestaurants(prev =>
      prev.map(r => {
        if (r.id === activeRestaurant.id) {
          return { ...r, categories: [...r.categories, newCategory] };
        }
        return r;
      })
    );
    return newCategory;
  };

  const updateCategory = (categoryId, updates) => {
    setRestaurants(prev =>
      prev.map(r => {
        if (r.id === activeRestaurant.id) {
          return {
            ...r,
            categories: r.categories.map(c => (c.id === categoryId ? { ...c, ...updates } : c)),
          };
        }
        return r;
      })
    );
  };

  const deleteCategory = (categoryId) => {
    setRestaurants(prev =>
      prev.map(r => {
        if (r.id === activeRestaurant.id) {
          return {
            ...r,
            categories: r.categories.filter(c => c.id !== categoryId),
            // Re-assign items under deleted category to first category or keep
          };
        }
        return r;
      })
    );
  };

  const reorderCategories = (newCategories) => {
    setRestaurants(prev =>
      prev.map(r => {
        if (r.id === activeRestaurant.id) {
          return { ...r, categories: newCategories };
        }
        return r;
      })
    );
  };

  // Reset to sample data
  const resetToSampleData = () => {
    setRestaurants(DEFAULT_RESTAURANTS);
    setActiveSlug('royal-dining');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_RESTAURANT_KEY);
  };

  // Create brand new restaurant
  const createNewRestaurant = (name, slug) => {
    const newRest = {
      id: slug,
      slug,
      name,
      tagline: 'Modern Culinary Delights',
      description: 'Crafted with passion using hand-picked freshest ingredients.',
      logoText: name.split(' ')[0].toUpperCase(),
      logoSubtitle: 'GOURMET',
      coverImage: DEFAULT_RESTAURANTS[0].coverImage,
      currency: '₹',
      theme: { ...DEFAULT_RESTAURANTS[0].theme },
      contact: { ...DEFAULT_RESTAURANTS[0].contact },
      settings: { ...DEFAULT_RESTAURANTS[0].settings },
      specialOffers: [],
      categories: [
        { id: 'favorites', name: 'Customer Favorites', icon: '🔥', order: 1, active: true },
        { id: 'mains', name: 'Main Course', icon: '🍛', order: 2, active: true },
        { id: 'drinks', name: 'Beverages', icon: '🥤', order: 3, active: true }
      ],
      items: [
        {
          id: `item-${Date.now()}`,
          name: 'Signature Chef Special',
          categoryId: 'mains',
          price: 299,
          rating: 4.9,
          reviewCount: 45,
          isVeg: true,
          isBestseller: true,
          isChefSpecial: true,
          isSpicy: 1,
          isAvailable: true,
          prepTime: '15 mins',
          serving: '1-2 Persons',
          calories: '550 kcal',
          description: 'A delicious dish prepared specially by our head chef.',
          ingredients: ['Fresh Ingredients', 'Olive Oil', 'Special Seasoning'],
          allergens: [],
          image: DEFAULT_RESTAURANTS[0].items[0].image,
          customizations: []
        }
      ]
    };

    setRestaurants(prev => [...prev, newRest]);
    switchRestaurant(slug);
    return newRest;
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        activeRestaurant,
        activeSlug,
        switchRestaurant,
        updateRestaurantSettings,
        updateTheme,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        resetToSampleData,
        createNewRestaurant,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
