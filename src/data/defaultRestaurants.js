// Curated High-Resolution Real Food Photography (100% Real Plating, Zero Beef)
export const REAL_FOOD_IMAGES = {
  // Category Circular Thumbnails
  catPopular: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80",
  catChicken: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&auto=format&fit=crop&q=80",
  catMutton: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop&q=80",
  catFish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&auto=format&fit=crop&q=80",
  catVeg: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&auto=format&fit=crop&q=80",
  catBiryani: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80",
  catStarters: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=200&auto=format&fit=crop&q=80",
  catBreads: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&auto=format&fit=crop&q=80",
  catDrinks: "https://images.unsplash.com/photo-1546173159-315724a31696?w=200&auto=format&fit=crop&q=80",
  catDesserts: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=200&auto=format&fit=crop&q=80",

  // Chicken Specialties
  chickenBiryani: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
  butterChicken: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
  chickenTandooriTikka: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80",
  chickenKebab: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
  
  // Mutton Specialties
  muttonDumBiryani: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
  muttonRoganJosh: "https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80",
  
  // Fresh Fish & Seafood
  grilledSalmon: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
  crispyPrawnsTandoori: "https://images.unsplash.com/photo-1559742811-822873691df8?w=800&auto=format&fit=crop&q=80",

  // Vegetarian & Paneer
  paneerButterMasala: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
  paneerTikkaAngara: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80",
  dalMakhani: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
  royalVegBiryani: "https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=800&auto=format&fit=crop&q=80",
  margheritaPizza: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80",
  burrataHeirloomSalad: "https://images.unsplash.com/photo-1592417817098-8f3d6ef23946?w=800&auto=format&fit=crop&q=80",
  wildMushroomPasta: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=800&auto=format&fit=crop&q=80",

  // Tandoori Breads
  garlicButterNaan: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80",
  lacchaParatha: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",

  // Desserts
  shahiGulabJamun: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80",
  classicTiramisu: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80",

  // Beverages
  kesarMangoLassi: "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&auto=format&fit=crop&q=80",
  freshLimeMintSoda: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",

  // Restaurant Cover
  restaurantCover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=85",
  restaurantTableCover: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&auto=format&fit=crop&q=85",
};

export const DEFAULT_RESTAURANTS = [
  {
    id: "royal-dining",
    slug: "royal-dining",
    name: "Devi - The Real Fast Food Centre",
    tagline: "The Real Fast Food Centre • Pure Taste & Quality",
    description: "Welcome to Devi - The Real Fast Food Centre. Discover our mouthwatering, freshly prepared authentic delicacies crafted with passion and top quality ingredients.",
    logo: "/devi-logo.png",
    logoText: "DEVI",
    logoSubtitle: "THE REAL FAST FOOD CENTRE",
    coverImage: REAL_FOOD_IMAGES.restaurantCover,
    currency: "₹",
    theme: {
      mode: "dark",
      primaryColor: "#C4161C", // Rich Red
      accentColor: "#D4A64A", // Premium Gold
      bgColor: "#0E0B0A", // Near-black warm charcoal
      bgGradient: "linear-gradient(180deg, #0E0B0A 0%, #181312 100%)",
      cardBg: "#1A1514", // Surface cards
      cardBorder: "rgba(212, 166, 74, 0.15)",
      textPrimary: "#F6EFE3", // Warm Cream
      textSecondary: "#B8AEA2", // Muted Warm Grey
      fontHeading: "'Fraunces', Georgia, serif",
      fontBody: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    contact: {
      phone: "+91 98765 43210",
      whatsapp: "+919876543210",
      address: "Devi Fast Food Centre, Main Market Road",
      openingHours: "11:00 AM – 11:30 PM (Daily)",
      wifiSsid: "Devi_FastFood_5G",
      wifiPassword: "DeviFastFood2026",
      googleMapsUrl: "https://maps.google.com/?q=Devi+Fast+Food",
      instagram: "@devifastfoodcentre",
    },
    settings: {
      taxRate: 5,
      serviceChargeRate: 5,
      orderingEnabled: true,
      callWaiterEnabled: true,
      specialOffersEnabled: true,
      defaultTable: "04",
      tablesCount: 24,
    },
    specialOffers: [
      {
        id: "sp-1",
        title: "Chef's Royal Handi Feast",
        subtitle: "Serves 3-4 Guests",
        description: "1 Shahi Chicken Dum Biryani + 1 Murgh Malai Tikka + 1 Dal Makhani + 2 Garlic Butter Naans + 2 Kesar Mango Lassis.",
        originalPrice: 1249,
        discountedPrice: 989,
        badge: "Chef's Special • Save ₹260",
        image: REAL_FOOD_IMAGES.chickenBiryani,
        available: true,
        minPrepTime: 20,
        maxPrepTime: 25,
      }
    ],
    categories: [
      { id: "favorites", name: "Popular", icon: "⭐", image: REAL_FOOD_IMAGES.catPopular, order: 1, active: true },
      { id: "chicken", name: "Chicken", icon: "🍗", image: REAL_FOOD_IMAGES.catChicken, order: 2, active: true },
      { id: "mutton", name: "Mutton", icon: "🍖", image: REAL_FOOD_IMAGES.catMutton, order: 3, active: true },
      { id: "fish", name: "Fish & Catch", icon: "🐟", image: REAL_FOOD_IMAGES.catFish, order: 4, active: true },
      { id: "veg", name: "Vegetarian", icon: "🥗", image: REAL_FOOD_IMAGES.catVeg, order: 5, active: true },
      { id: "biryani", name: "Rice & Biryani", icon: "🍚", image: REAL_FOOD_IMAGES.catBiryani, order: 6, active: true },
      { id: "starters", name: "Starters & Tikka", icon: "🍢", image: REAL_FOOD_IMAGES.catStarters, order: 7, active: true },
      { id: "breads", name: "Tandoori Breads", icon: "🫓", image: REAL_FOOD_IMAGES.catBreads, order: 8, active: true },
      { id: "drinks", name: "Beverages", icon: "🥤", image: REAL_FOOD_IMAGES.catDrinks, order: 9, active: true },
      { id: "desserts", name: "Desserts", icon: "🍨", image: REAL_FOOD_IMAGES.catDesserts, order: 10, active: true }
    ],
    items: [
      {
        id: "aura-1",
        name: "Chicken Biryani",
        categoryId: "biryani",
        price: 249,
        rating: 4.9,
        reviewCount: 428,
        isVeg: false,
        isBestseller: true,
        isChefSpecial: true,
        isSpicy: 2,
        isAvailable: true,
        minPrepTime: 20,
        maxPrepTime: 25,
        serving: "Serves 1–2 (650g)",
        calories: "680 kcal",
        description: "Aromatic basmati rice cooked with tender chicken, fried onions, saffron and traditional spices.",
        preparationStyle: "Chicken is marinated with yogurt and spices, then cooked with basmati rice using the traditional dum method.",
        ingredients: ["Basmati rice", "chicken", "onion", "yogurt", "saffron", "ginger", "garlic", "aromatic spices"],
        allergens: ["Dairy (Desi Ghee)"],
        image: REAL_FOOD_IMAGES.chickenBiryani,
        customizations: [
          { id: "cust-1", name: "Extra Succulent Chicken Piece (120g)", price: 80 },
          { id: "cust-2", name: "Boiled Egg (2 pcs)", price: 20 },
          { id: "cust-3", name: "Special Mirchi Ka Salan & Raita Bowl", price: 30 },
        ]
      },
      {
        id: "aura-2",
        name: "Nizami Mutton Dum Biryani",
        categoryId: "biryani",
        price: 349,
        rating: 5.0,
        reviewCount: 560,
        isVeg: false,
        isBestseller: true,
        isChefSpecial: true,
        isSpicy: 2,
        isAvailable: true,
        minPrepTime: 22,
        maxPrepTime: 28,
        serving: "Serves 1–2 (700g)",
        calories: "740 kcal",
        description: "Prime tender mutton pieces slow-cooked in rich potli spices, layered with fragrant saffron rice and garnished with fried shallots.",
        preparationStyle: "Slow-steamed in a clay handi to allow bone marrow and potli spices to infuse deeply into the grains.",
        ingredients: ["Prime Mutton Cuts", "Long-Grain Basmati Rice", "Pure Saffron Milk", "Nizami Potli Spices", "Golden Cashews", "Desi Butter"],
        allergens: ["Tree Nuts (Cashews)", "Dairy"],
        image: REAL_FOOD_IMAGES.muttonDumBiryani,
        customizations: [
          { id: "cust-201", name: "Extra Tender Mutton Chunk", price: 120 },
          { id: "cust-202", name: "Burani Garlic Raita", price: 30 }
        ]
      },
      {
        id: "aura-3",
        name: "Butter Chicken (Murgh Makhani)",
        categoryId: "chicken",
        price: 299,
        rating: 4.9,
        reviewCount: 390,
        isVeg: false,
        isBestseller: true,
        isChefSpecial: true,
        isSpicy: 1,
        isAvailable: true,
        minPrepTime: 15,
        maxPrepTime: 20,
        serving: "Serves 2 (500ml)",
        calories: "620 kcal",
        description: "Boneless chicken slow-cooked in a rich onion, tomato, cashew cream and aromatic spice gravy.",
        preparationStyle: "Tender boneless chicken is charred in tandoor then simmered in a velvety satin tomato reduction.",
        ingredients: ["Boneless Chicken Tikka", "Ripe Plum Tomatoes", "Cashew Puree", "Dried Fenugreek Leaves", "Fresh Butter", "Organic Honey"],
        allergens: ["Dairy", "Tree Nuts (Cashews)"],
        image: REAL_FOOD_IMAGES.butterChicken,
        customizations: [
          { id: "cust-301", name: "Extra Cashew Cream Drizzle", price: 25 },
          { id: "cust-302", name: "Add Bone-in Leg Piece", price: 60 }
        ]
      },
      {
        id: "aura-4",
        name: "Paneer Butter Masala",
        categoryId: "veg",
        price: 229,
        rating: 4.8,
        reviewCount: 275,
        isVeg: true,
        isBestseller: true,
        isChefSpecial: false,
        isSpicy: 1,
        isAvailable: true,
        minPrepTime: 15,
        maxPrepTime: 20,
        serving: "Serves 2 (450g)",
        calories: "510 kcal",
        description: "Paneer cubes cooked in a creamy tomato and cashew gravy with churned butter and fragrant spices.",
        preparationStyle: "Fresh cottage cheese cubes gently folded into a simmering tomato-cashew satin sauce.",
        ingredients: ["Fresh Cottage Cheese (Paneer)", "Tomato Puree", "Cashew Paste", "Desi Butter", "Kasuri Methi", "Cardamom"],
        allergens: ["Dairy", "Tree Nuts (Cashews)"],
        image: REAL_FOOD_IMAGES.paneerButterMasala,
        customizations: [
          { id: "cust-401", name: "Extra Paneer Cubes (100g)", price: 50 },
          { id: "cust-402", name: "Mild / Zero Chili Version", price: 0 }
        ]
      },
      {
        id: "aura-5",
        name: "Chicken Tikka (Murgh Malai)",
        categoryId: "starters",
        price: 279,
        rating: 4.9,
        reviewCount: 310,
        isVeg: false,
        isBestseller: true,
        isChefSpecial: false,
        isSpicy: 1,
        isAvailable: true,
        minPrepTime: 18,
        maxPrepTime: 22,
        serving: "6 Jumbo Boneless Pieces",
        calories: "460 kcal",
        description: "Tender chicken pieces marinated in yogurt, ginger, garlic and aromatic spices, then grilled until lightly charred.",
        preparationStyle: "Marinated overnight in cream and spices, then skewered and cooked over live charcoal embers.",
        ingredients: ["Chicken breast chunks", "heavy cream", "hung curd", "green cardamom", "garlic", "lemon juice", "mild spices"],
        allergens: ["Dairy"],
        image: REAL_FOOD_IMAGES.chickenTandooriTikka,
        customizations: [
          { id: "cust-501", name: "Extra Mint Chutney & Onions", price: 15 },
          { id: "cust-502", name: "Melted Cheese Glaze", price: 40 }
        ]
      },
      {
        id: "aura-6",
        name: "Tandoori Paneer Tikka Angara",
        categoryId: "starters",
        price: 239,
        rating: 4.7,
        reviewCount: 195,
        isVeg: true,
        isBestseller: false,
        isChefSpecial: false,
        isSpicy: 2,
        isAvailable: true,
        minPrepTime: 14,
        maxPrepTime: 18,
        serving: "6 Large Skewered Cubes",
        calories: "410 kcal",
        description: "Smoky cottage cheese cubes skewered with bell peppers and red onions, marinated in cold-pressed mustard oil and Kashmiri chilies.",
        preparationStyle: "Skewered with fresh crisp peppers and charred inside clay tandoor.",
        ingredients: ["Fresh Paneer", "Cold-Pressed Mustard Oil", "Kashmiri Degi Mirch", "Tricolor Bell Peppers", "Carom Seeds (Ajwain)"],
        allergens: ["Dairy", "Mustard"],
        image: REAL_FOOD_IMAGES.paneerTikkaAngara,
        customizations: [
          { id: "cust-601", name: "Lemon Butter Brush", price: 20 }
        ]
      },
      {
        id: "aura-7",
        name: "Coastal Pan-Fried Fish",
        categoryId: "fish",
        price: 349,
        rating: 4.9,
        reviewCount: 220,
        isVeg: false,
        isBestseller: true,
        isChefSpecial: true,
        isSpicy: 2,
        isAvailable: true,
        minPrepTime: 16,
        maxPrepTime: 20,
        serving: "2 Large Fresh Fillets (350g)",
        calories: "430 kcal",
        description: "Fresh fish marinated with turmeric, kokum and spices, then lightly fried until crisp on the outside and tender inside.",
        preparationStyle: "Fresh day's catch pan-fried with curry leaves and shallots in coconut oil.",
        ingredients: ["Fresh Catch Fish Fillet", "Kokum Extract", "Turmeric & Peppercorns", "Curry Leaves", "Coconut Oil"],
        allergens: ["Fish"],
        image: REAL_FOOD_IMAGES.grilledSalmon,
        customizations: [
          { id: "cust-701", name: "Steamed Jasmine Rice Bowl", price: 40 }
        ]
      },
      {
        id: "aura-8",
        name: "Dal Makhani (24-Hour Simmered)",
        categoryId: "veg",
        price: 199,
        rating: 4.9,
        reviewCount: 380,
        isVeg: true,
        isBestseller: true,
        isChefSpecial: true,
        isSpicy: 1,
        isAvailable: true,
        minPrepTime: 10,
        maxPrepTime: 15,
        serving: "Serves 2 (450ml)",
        calories: "420 kcal",
        description: "Whole black lentils and kidney beans slow-simmered for 24 hours on charcoal embers with butter and vine tomato reduction.",
        preparationStyle: "Slow overnight pot simmer with continuous stirring on low heat.",
        ingredients: ["Whole Black Urad Lentils", "Rajma Beans", "Vine Tomatoes", "White Butter", "Fresh Cream", "Ginger Garlic"],
        allergens: ["Dairy"],
        image: REAL_FOOD_IMAGES.dalMakhani,
        customizations: [
          { id: "cust-801", name: "Extra White Butter Topping", price: 20 }
        ]
      },
      {
        id: "aura-9",
        name: "Garlic Butter Naan",
        categoryId: "breads",
        price: 69,
        rating: 4.8,
        reviewCount: 520,
        isVeg: true,
        isBestseller: true,
        isChefSpecial: false,
        isSpicy: 0,
        isAvailable: true,
        minPrepTime: 8,
        maxPrepTime: 12,
        serving: "2 Large Slices",
        calories: "260 kcal",
        description: "Soft naan baked in a traditional tandoor and brushed with garlic butter and fresh coriander.",
        preparationStyle: "Baked at 400°C inside a clay oven until blistered and tender.",
        ingredients: ["Fine Wheat Flour", "Fresh Chopped Garlic", "Salted Butter", "Nigella Seeds", "Fresh Coriander"],
        allergens: ["Gluten", "Dairy"],
        image: REAL_FOOD_IMAGES.garlicButterNaan,
        customizations: [
          { id: "cust-901", name: "Cheddar Cheese Stuffing", price: 35 }
        ]
      },
      {
        id: "aura-10",
        name: "Shahi Kesar Mango Lassi",
        categoryId: "drinks",
        price: 119,
        rating: 4.9,
        reviewCount: 310,
        isVeg: true,
        isBestseller: true,
        isChefSpecial: false,
        isSpicy: 0,
        isAvailable: true,
        minPrepTime: 4,
        maxPrepTime: 7,
        serving: "350ml Chilled Glass",
        calories: "280 kcal",
        description: "Thick creamy churned yogurt blended with Alphonso mango pulp, saffron strands, cardamom and toasted pistachios.",
        preparationStyle: "Hand-churned with chilled whole milk curd and pure mango reduction.",
        ingredients: ["Whole Milk Yogurt", "Alphonso Mango Puree", "Kashmiri Kesar", "Cardamom", "Pistachio Slivers"],
        allergens: ["Dairy", "Tree Nuts (Pistachios)"],
        image: REAL_FOOD_IMAGES.kesarMangoLassi,
        customizations: []
      },
      {
        id: "aura-11",
        name: "Gulab Jamun with Saffron Rabdi",
        categoryId: "desserts",
        price: 139,
        rating: 4.9,
        reviewCount: 290,
        isVeg: true,
        isBestseller: true,
        isChefSpecial: true,
        isSpicy: 0,
        isAvailable: true,
        minPrepTime: 3,
        maxPrepTime: 5,
        serving: "2 Warm Jamuns + Chilled Rabdi",
        calories: "380 kcal",
        description: "Warm golden khoya dumplings soaked in rose-cardamom sugar syrup, served with chilled saffron rabdi.",
        preparationStyle: "Slow-fried in pure ghee and steeped in cardamom-scented syrup.",
        ingredients: ["Fresh Khoya (Mawa)", "Rose & Cardamom Syrup", "Saffron Rabdi", "Pistachios"],
        allergens: ["Dairy", "Tree Nuts"],
        image: REAL_FOOD_IMAGES.shahiGulabJamun,
        customizations: []
      }
    ]
  },
  {
    id: "la-spada-bistro",
    slug: "la-spada-bistro",
    name: "La Spada Artisanal Pizzeria & Bistro",
    tagline: "Authentic Napoli Woodfired Crusts. Fresh Pastas.",
    description: "48-hour fermented sourdough pizzas baked in our stone woodfired oven, handmade egg fettuccine, fresh burrata, and classic Italian dolci.",
    logoText: "LA SPADA",
    logoSubtitle: "BISTRO NAPOLI",
    coverImage: REAL_FOOD_IMAGES.restaurantTableCover,
    currency: "€",
    theme: {
      mode: "light",
      primaryColor: "#8b1d2c", // Deep Burgundy
      accentColor: "#c98a2c", // Warm Gold
      bgColor: "#fbf8f2",
      bgGradient: "linear-gradient(180deg, #fbf8f2 0%, #f4eee3 100%)",
      cardBg: "#ffffff",
      textPrimary: "#1b1e22",
      textSecondary: "#525760",
      fontHeading: "'Playfair Display', Georgia, serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
    },
    contact: {
      phone: "+39 06 6987 5432",
      whatsapp: "+390669875432",
      address: "Via della Conciliazione 18, Rome, Italy",
      openingHours: "11:30 AM – 11:00 PM (Tuesday – Sunday)",
      wifiSsid: "LaSpada_Guest_WiFi",
      wifiPassword: "BuonAppetito2026",
      googleMapsUrl: "https://maps.google.com/?q=Rome+Italy",
      instagram: "@laspadapizzeria",
    },
    settings: {
      taxRate: 10,
      serviceChargeRate: 0,
      orderingEnabled: true,
      callWaiterEnabled: true,
      specialOffersEnabled: true,
      defaultTable: "12",
      tablesCount: 18,
    },
    specialOffers: [],
    categories: [
      { id: "favorites", name: "Popular", icon: "⭐", image: REAL_FOOD_IMAGES.catPopular, order: 1, active: true },
      { id: "pizza", name: "Pizza", icon: "🍕", image: REAL_FOOD_IMAGES.margheritaPizza, order: 2, active: true },
      { id: "pasta", name: "Pasta", icon: "🍝", image: REAL_FOOD_IMAGES.wildMushroomPasta, order: 3, active: true },
      { id: "antipasti", name: "Antipasti", icon: "🥗", image: REAL_FOOD_IMAGES.burrataHeirloomSalad, order: 4, active: true },
      { id: "desserts", name: "Desserts", icon: "🍰", image: REAL_FOOD_IMAGES.classicTiramisu, order: 5, active: true }
    ],
    items: [
      {
        id: "ls-1",
        name: "Margherita di Bufala DOP",
        categoryId: "pizza",
        price: 14.5,
        rating: 4.9,
        reviewCount: 310,
        isVeg: true,
        isBestseller: true,
        isChefSpecial: true,
        isSpicy: 0,
        isAvailable: true,
        minPrepTime: 12,
        maxPrepTime: 16,
        serving: "12-inch Sourdough Crust (8 slices)",
        calories: "720 kcal",
        description: "48-hour fermented sourdough dough topped with San Marzano tomato reduction, certified Buffalo Mozzarella Campana DOP, fresh sweet basil and extra virgin olive oil.",
        preparationStyle: "Baked in stone woodfired oven at 450°C for 90 seconds.",
        ingredients: ["Italian 00 Sourdough Flour", "San Marzano DOP Tomatoes", "Buffalo Mozzarella", "Fresh Sweet Basil", "Tuscan Extra Virgin Olive Oil"],
        allergens: ["Gluten", "Dairy"],
        image: REAL_FOOD_IMAGES.margheritaPizza,
        customizations: [
          { id: "cust-ls-1", name: "Extra Burrata Center (100g)", price: 3.5 },
          { id: "cust-ls-2", name: "Calabrian Chili Oil", price: 1.0 }
        ]
      }
    ]
  }
];
