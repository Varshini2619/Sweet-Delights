import { Product } from './types';

export const CATEGORIES = [
  {
    name: 'Cakes',
    description: 'Bespoke artisanal cakes crafted with exquisite belgian chocolate, fresh fruits, and elegant designs.',
    bannerImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sweets',
    description: 'Royal confectioneries prepared with direct milk reduction, pristine saffron, luxury silver leaf, and heavy ghee.',
    bannerImage: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Savouries',
    description: 'Golden-baked gourmet pastries, freshly rolled breads, and savory light bites with rich aromatic herbs.',
    bannerImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1600&auto=format&fit=crop&q=80',
  },
];

export const PRODUCTS: Product[] = [
  // ==================== CAKES (15 ITEMS) ====================
  {
    id: 'cake-black-forest',
    name: 'Black Forest Cake',
    category: 'Cakes',
    description: 'A classic Bavarian masterpiece layered with rich chocolate sponge, sour cherries, and Kirsch-infused fresh cream, crowned with organic chocolate curls and sweet glazes.',
    price: 65,
    rating: 4.8,
    image: '/assets/images/Black Forest Cake.jpg',
    gallery: [
      '/assets/images/Black Forest Cake.jpg',
      'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80'
    ],
    ingredients: ['Dark Belgian Chocolate (70%)', 'Bavarian Sour Cherries', 'Organic Cake Flour', 'Fresh Cream', 'Kirsch Liqueur'],
    shelfLife: '3 Days (Keep Refrigerated)',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: [
      { id: 'r1', userName: 'Eleanor Vance', rating: 5, comment: 'The cherry liqueur notes were perfectly balanced. Truly marvelous!', date: '2026-06-10' },
      { id: 'r2', userName: 'Julian Reed', rating: 4.5, comment: 'Incredibly moist sponge. Will order again.', date: '2026-06-12' }
    ]
  },
  {
    id: 'cake-white-forest',
    name: 'White Forest Cake',
    category: 'Cakes',
    description: 'An elegant winter-styled cake with cloud-soft vanilla sponge, white chocolate mousse cream, and glazed maraschino cherries topped generously with white chocolate shavings.',
    price: 68,
    rating: 4.7,
    image: '/assets/images/White Forest Cake.jpg',
    gallery: [
      '/assets/images/White Forest Cake.jpg',
      'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80'
    ],
    ingredients: ['Swiss White Chocolate', 'Maraschino Cherries', 'Vanilla Bean Pods', 'Pastry Cream Flour'],
    shelfLife: '3 Days (Keep Refrigerated)',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: [
      { id: 'r3', userName: 'Sophie Martin', rating: 5, comment: 'Light, delicate sweetness. Perfect for afternoon tea.', date: '2026-06-08' }
    ]
  },
  {
    id: 'cake-red-velvet',
    name: 'Red Velvet Cake',
    category: 'Cakes',
    description: 'A striking crimson cake with velvety chocolate-tinted sponge, filled and frosted with ultra-smooth Madagascar vanilla cream cheese icing.',
    price: 75,
    rating: 4.9,
    image: '/assets/images/Red Velvet Cake.jpg',
    gallery: [
      '/assets/images/Red Velvet Cake.jpg',
      'https://images.unsplash.com/photo-1586985289688-ca9cf499150a?w=600&auto=format&fit=crop&q=80'
    ],
    ingredients: ['Belgian Cocoa Powder', 'Premium Cream Cheese', 'Buttermilk', 'Natural Carmine Extract'],
    shelfLife: '4 Days (Keep Refrigerated)',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: [
      { id: 'r4', userName: 'Clara Oswald', rating: 5, comment: 'Absolute perfection. The cream cheese is heavenly.', date: '2026-06-15' }
    ]
  },
  {
    id: 'cake-chocolate-truffle',
    name: 'Chocolate Truffle Cake',
    category: 'Cakes',
    description: 'For pure chocolate connoisseurs: dense, luxurious single-origin Ecuadorian dark chocolate sponge laced with heated ganache and finished with rich glaze.',
    price: 80,
    rating: 4.95,
    image: '/assets/images/Chocolate Truffle Cake.jpg',
    gallery: [
      '/assets/images/Chocolate Truffle Cake.jpg',
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=80'
    ],
    ingredients: ['72% Ecuadorian Dark Chocolate', 'Pure Dairy Butter', 'Heavy Chocolate Ganache', 'Farm Eggs'],
    shelfLife: '5 Days (Refrigeration recommended)',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: [
      { id: 'r5', userName: 'Arthur Dent', rating: 5, comment: 'Rich, deep chocolate flavor that stays with you. Outstanding.', date: '2026-06-16' }
    ]
  },
  {
    id: 'cake-dutch-chocolate',
    name: 'Dutch Chocolate Cake',
    category: 'Cakes',
    description: 'An exceptionally smooth chocolate cake styled with Dutch-processed cocoa powder, chocolate fudge buttercream, and hand-rolled dark chocolate pearls.',
    price: 72,
    rating: 4.8,
    image: '/assets/images/Dutch Chocolate Cake.jpg',
    gallery: [
      '/assets/images/Dutch Chocolate Cake.jpg'
    ],
    ingredients: ['Dutch-Processed Cocoa', 'Fudge Buttercreme', 'Pâtisserie Sponge base', 'Vanilla Glaze'],
    shelfLife: '4 Days',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: []
  },
  {
    id: 'cake-butterscotch',
    name: 'Butterscotch Cake',
    category: 'Cakes',
    description: 'Nostalgic sweetness: light caramel biscuit sponge layered with liquid butterscotch, luxury English toffee crumble, and vanilla whipped mousse.',
    price: 64,
    rating: 4.75,
    image: '/assets/images/Butterscotch Cake.jpg',
    gallery: [
      '/assets/images/Butterscotch Cake.jpg'
    ],
    ingredients: ['House-Made Toffee Bits', 'Brown Sugar Caramel Syrup', 'Biscuit Flour', 'Rich Frosting'],
    shelfLife: '3 Days',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: []
  },
  {
    id: 'cake-fruit',
    name: 'Gourmet Fruit Cake',
    category: 'Cakes',
    description: 'A refreshing vanilla custard cake loaded with freshly sliced kiwi, tropical mangoes, sweet strawberries, red grapes, and glazed wild blueberries.',
    price: 78,
    rating: 4.82,
    image: '/assets/images/Gourmet Fruit Cake.jpg',
    gallery: [
      '/assets/images/Gourmet Fruit Cake.jpg'
    ],
    ingredients: ['Fresh Seasonal Kiwi', 'Sun-Ripened Strawberry', 'Tahitian Vanilla Pastry Custard', 'Moist Vanilla Sponge'],
    shelfLife: '2 Days (Must Keep Cool)',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: []
  },
  {
    id: 'cake-pineapple',
    name: 'Pineapple Cake',
    category: 'Cakes',
    description: 'Retro sweet treat with tangy stewed Hawaiian pineapple slices, fresh cream layers, moist sponge, and maraschino cherries.',
    price: 60,
    rating: 4.7,
    image: '/assets/images/Pineapple Cake.jpg',
    gallery: [
      '/assets/images/Pineapple Cake.jpg'
    ],
    ingredients: ['Hawaiian Tangy Pineapple', 'Whipped Dairy Cream', 'Vanilla Sponge', 'Cherry Garnish'],
    shelfLife: '3 Days',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: []
  },
  {
    id: 'cake-kitkat',
    name: 'KitKat Chocolate Cake',
    category: 'Cakes',
    description: 'An indulgent, fun-filled fantasy cake wrapped in original crispy chocolate KitKat bars, filled with chocolate paste and topped with dark M&M candies.',
    price: 85,
    rating: 4.88,
    image: '/assets/images/KitKat Chocolate Cake.jpg',
    gallery: [
      '/assets/images/KitKat Chocolate Cake.jpg'
    ],
    ingredients: ['Genuis KitKat Bars', 'Belgian Chocolate Cream', 'Spongy cocoa Base', 'Sweet Sprinkles'],
    shelfLife: '4 Days',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: []
  },
  {
    id: 'cake-ferrero',
    name: 'Ferrero Rocher Cake',
    category: 'Cakes',
    description: 'Pure opulence: rich chocolate hazelnut paste, crunchy wafer layers, crushed organic hazelnuts, and whole glazed Ferrero Rocher truffles.',
    price: 95,
    rating: 4.96,
    image: '/assets/images/Ferrero Rocher Cake.jpg',
    gallery: [
      '/assets/images/Ferrero Rocher Cake.jpg'
    ],
    ingredients: ['Ferrero Rocher Truffles', 'Italian Hazelnut Praline', 'Ecuadorian Dark Cocoa', 'Wafer Crunch'],
    shelfLife: '5 Days',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: []
  },
  {
    id: 'cake-rasmalai',
    name: 'Rasmalai Fusion Cake',
    category: 'Cakes',
    description: 'An sensational East-meets-West fusion: soft vanilla sponge soaked in slow-simmered saffron rabri, flecked with hand-made rasmalai bites, crushed pistachios, and organic rose petals.',
    price: 90,
    rating: 4.93,
    image: '/assets/images/Rasmalai Fusion Cake.jpg',
    gallery: [
      '/assets/images/Rasmalai Fusion Cake.jpg'
    ],
    ingredients: ['Kashmiri Saffron (Kesar)', 'Handmade Rasmalai cottage cheese', 'Crushed Iranian Pistachio', 'Organic Rose Petals'],
    shelfLife: '2 Days (Must refrigerate immediately)',
    weightOptions: ['500g', '1Kg', '2Kg'],
    priceMultipliers: { '500g': 1, '1Kg': 1.8, '2Kg': 3.2 },
    reviews: []
  },
  {
    id: 'cake-ice-cream',
    name: 'Imperial Ice Cream Cake',
    category: 'Cakes',
    description: 'Chilled gourmet layers of slow-churned bourbon vanilla bean ice cream and decadent chocolate fudge brownie chunks on a crispy chocolate cookie crust.',
    price: 88,
    rating: 4.85,
    image: '/assets/images/Imperial Ice Cream Cake.jpg',
    gallery: [
      '/assets/images/Imperial Ice Cream Cake.jpg'
    ],
    ingredients: ['Bourbon Vanilla Bean', 'Fudge Brownie Bits', 'Dark Cookie Crumbs', 'Whipped Icecream frosting'],
    shelfLife: '10 Days (Keep Deep Frozen)',
    weightOptions: ['1Kg', '2Kg'],
    priceMultipliers: { '1Kg': 1, '2Kg': 1.8 },
    reviews: []
  },
  {
    id: 'cake-designer',
    name: 'Bespoke Designer Cake',
    category: 'Cakes',
    description: 'A sculpted masterwork featuring fondant details, edible gold leaf, and elegant, custom design elements customized to your luxurious aesthetic preferences.',
    price: 150,
    rating: 5.0,
    image: '/assets/images/Bespoke Designer Cake.jpg',
    gallery: [
      '/assets/images/Bespoke Designer Cake.jpg'
    ],
    ingredients: ['Edible Gold Leaf (24K)', 'Satin Ice Fondant', 'Premium Buttercream Sponge', 'Artistic Lacing'],
    shelfLife: '4 Days',
    weightOptions: ['2Kg', '4Kg'],
    priceMultipliers: { '2Kg': 1, '4Kg': 1.9 },
    reviews: []
  },
  {
    id: 'cake-wedding',
    name: 'Royal Wedding Celebration Cake',
    category: 'Cakes',
    description: 'A spectacular multi-tiered showstopper draped in smooth, luxurious ivory Royal icing, delicate hand-piped sugar flowers, and sparkling sugar crystals.',
    price: 350,
    rating: 5.0,
    image: '/assets/images/Royal Wedding Celebration Cake.jpg',
    gallery: [
      '/assets/images/Royal Wedding Celebration Cake.jpg'
    ],
    ingredients: ['Almond Flour Marzipan', 'Premium Madagascar Vanilla bean', 'Royal Ivory Icing', 'Handmade Sugar Roses'],
    shelfLife: '5 Days',
    weightOptions: ['4Kg', '7Kg', '10Kg'],
    priceMultipliers: { '4Kg': 1, '7Kg': 1.7, '10Kg': 2.4 },
    reviews: []
  },
  {
    id: 'cake-birthday',
    name: 'Enchanted Birthday Cake',
    category: 'Cakes',
    description: 'Bright sprinkles, colorful fluffy sweet vanilla cream, and a personalized luxury white-chocolate script card atop a perfectly moist layered sponge.',
    price: 70,
    rating: 4.87,
    image: '/assets/images/Enchanted Birthday Cake.jpg',
    gallery: [
      '/assets/images/Enchanted Birthday Cake.jpg'
    ],
    ingredients: ['Natural Vanilla Extract', 'Sweet Confetti Sprinkles', 'Finest Wheat Flour', 'White Chocolate Plaque'],
    shelfLife: '3 Days',
    weightOptions: ['1Kg', '2Kg'],
    priceMultipliers: { '1Kg': 1, '2Kg': 1.8 },
    reviews: []
  },

  // ==================== SWEETS (12 ITEMS) ====================
  {
    id: 'sweet-gulab-jamun',
    name: 'Gourmet Gulab Jamun',
    category: 'Sweets',
    description: 'Soft dumpling spheres of milk reduced solids (khoya), fried golden in heavy Desi Ghee, then steeped in organic rosewater and green cardamom sugars.',
    price: 18,
    rating: 4.9,
    image: '/assets/images/Gourmet Gulab Jamun.jpg',
    gallery: [
      '/assets/images/Gourmet Gulab Jamun.jpg'
    ],
    ingredients: ['House-cooked Khoya', 'Pure Cow Ghee', 'Cardamom infusion', 'Iranian Saffron Syrup'],
    shelfLife: '10 Days',
    weightOptions: ['Pack of 6 (300g)', 'Pack of 12 (600g)'],
    priceMultipliers: { 'Pack of 6 (300g)': 1, 'Pack of 12 (600g)': 1.8 },
    reviews: []
  },
  {
    id: 'sweet-rasgulla',
    name: 'Heritage Rasgulla',
    category: 'Sweets',
    description: 'Delicate, incredibly spongy cottage cheese balls cooked in thin refining cane sugars, offering an immediate splash of botanical sweet juice with every bite.',
    price: 15,
    rating: 4.75,
    image: '/assets/images/Heritage Rasgulla.jpg',
    gallery: [
      '/assets/images/Heritage Rasgulla.jpg'
    ],
    ingredients: ['Fresh Cow Milk Chhena', 'Organic Refining Sugar', 'Aromatic Cardamom water'],
    shelfLife: '7 Days',
    weightOptions: ['Pack of 6 (300g)', 'Pack of 12 (600g)'],
    priceMultipliers: { 'Pack of 6 (300g)': 1, 'Pack of 12 (600g)': 1.8 },
    reviews: []
  },
  {
    id: 'sweet-rasmalai',
    name: 'Traditional Royal Rasmalai',
    category: 'Sweets',
    description: 'Supremely soft visual discs of flattened fresh cottage cheese soaked in heavy thickened milk infused with saffron threads and slivered almonds.',
    price: 24,
    rating: 4.95,
    image: '/assets/images/Traditional Royal Rasmalai.jpg',
    gallery: [
      '/assets/images/Traditional Royal Rasmalai.jpg'
    ],
    ingredients: ['Pressed Chhena Crumbles', 'Slow-evaporated creamy Rabri', 'Pure Kashmir Saffron', 'Pistachio shavings'],
    shelfLife: '3 Days (Must Refrigerate)',
    weightOptions: ['Pack of 6 (400g)', 'Pack of 12 (800g)'],
    priceMultipliers: { 'Pack of 6 (400g)': 1, 'Pack of 12 (800g)': 1.8 },
    reviews: []
  },
  {
    id: 'sweet-kaju-katli',
    name: 'Prestige Kaju Katli',
    category: 'Sweets',
    description: 'Sensational diamonds of buttery ground premium cashews and organic sugar paste, burnished with pure premium edible silver leaves (Vark).',
    price: 26,
    rating: 4.92,
    image: '/assets/images/Prestige Kaju Katli.jpg',
    gallery: [
      '/assets/images/Prestige Kaju Katli.jpg'
    ],
    ingredients: ['Grade-A Whole Cashews', 'Pure Cane Sugar', 'Cow Ghee glaze', 'Genuine Silver Vark'],
    shelfLife: '20 Days',
    weightOptions: ['250g Box', '500g Box', '1Kg Box'],
    priceMultipliers: { '250g Box': 1, '500g Box': 1.9, '1Kg Box': 3.6 },
    reviews: []
  },
  {
    id: 'sweet-laddu',
    name: 'Desi Ghee Motichoor Laddu',
    category: 'Sweets',
    description: 'Golden pearl-sized gram flour drops (boondi) meticulously cooked in authentic cow ghee, packed with melon seeds and reshaped into soft sweet spheres.',
    price: 16,
    rating: 4.85,
    image: '/assets/images/Desi Ghee Motichoor Laddu.jpg',
    gallery: [
      '/assets/images/Desi Ghee Motichoor Laddu.jpg'
    ],
    ingredients: ['Besan (Gram Flour)', 'Rich Ghee from cow milk', 'Organic Melon Seeds', 'Saffron spices'],
    shelfLife: '12 Days',
    weightOptions: ['250g Box', '500g Box', '1Kg Box'],
    priceMultipliers: { '250g Box': 1, '500g Box': 1.8, '1Kg Box': 3.4 },
    reviews: []
  },
  {
    id: 'sweet-mysore-pak',
    name: 'Royal Heritage Mysore Pak',
    category: 'Sweets',
    description: 'The golden classic: caramelized roasted gram flour blended with bubbling warm ghee and sugars to produce a porous, melts-in-the-mouth luxury dessert.',
    price: 22,
    rating: 4.88,
    image: '/assets/images/Royal Heritage Mysore Pak.jpg',
    gallery: [
      '/assets/images/Royal Heritage Mysore Pak.jpg'
    ],
    ingredients: ['Roasted Gram Flour', 'Heated Pure Desi Ghee', 'Crystal Sugar strands'],
    shelfLife: '15 Days',
    weightOptions: ['250g Box', '500g Box', '1Kg Box'],
    priceMultipliers: { '250g Box': 1, '500g Box': 1.8, '1Kg Box': 3.4 },
    reviews: []
  },
  {
    id: 'sweet-soan-papdi',
    name: 'Crispy Flaky Soan Papdi',
    category: 'Sweets',
    description: 'Incredibly fibrous, crisp-flaked sweet cubes made of blended gram flour and ghee threads, flecked with cardamoms, almonds and pistachios.',
    price: 14,
    rating: 4.65,
    image: '/assets/images/Crispy Flaky Soan Papdi.jpg',
    gallery: [
      '/assets/images/Crispy Flaky Soan Papdi.jpg'
    ],
    ingredients: ['Gram Flour & All Purpose Semolina', 'Vegetable Ghee', 'Sugar Strings', 'Almond crumbs'],
    shelfLife: '30 Days',
    weightOptions: ['250g Box', '500g Box'],
    priceMultipliers: { '250g Box': 1, '500g Box': 1.85 },
    reviews: []
  },
  {
    id: 'sweet-kalakand',
    name: 'Saffron Kalakand Paneer',
    category: 'Sweets',
    description: 'A moist, granular sweet cake made from reduced curdled milk solids flavored with fresh cardamom pods, decorated with rich pistachios, and saffron.',
    price: 20,
    rating: 4.8,
    image: '/assets/images/Saffron Kalakand Paneer.jpg',
    gallery: [
      '/assets/images/Saffron Kalakand Paneer.jpg'
    ],
    ingredients: ['Condensed Cow Milk', 'Fresh Cottage Cheese crumbles', 'Saffron threads', 'Almond slivers'],
    shelfLife: '5 Days (Keep cool)',
    weightOptions: ['250g Box', '500g Box', '1Kg Box'],
    priceMultipliers: { '250g Box': 1, '500g Box': 1.8, '1Kg Box': 3.4 },
    reviews: []
  },
  {
    id: 'sweet-milk-cake',
    name: 'Artisanal Alwar Milk Cake',
    category: 'Sweets',
    description: 'Slow-caramelized milk curd cubes with a rich dark-brown, cake-like core and incredibly granular sweet texture.',
    price: 21,
    rating: 4.83,
    image: '/assets/images/Artisanal Alwar Milk Cake.jpg',
    gallery: [
      '/assets/images/Artisanal Alwar Milk Cake.jpg'
    ],
    ingredients: ['Slow-boiled Whole Milk', 'Sour Chhena water', 'Pure Cow Ghee', 'Sugar glaze'],
    shelfLife: '10 Days',
    weightOptions: ['250g Box', '500g Box', '1Kg Box'],
    priceMultipliers: { '250g Box': 1, '500g Box': 1.8, '1Kg Box': 3.4 },
    reviews: []
  },
  {
    id: 'sweet-peda',
    name: 'Vrindavan Saffron Peda',
    category: 'Sweets',
    description: 'Delicately small, dense, rounded patties of slow-cooked khoya, dusted with fresh ground cardamoms, saffron paste and whole pistachios.',
    price: 17,
    rating: 4.76,
    image: '/assets/images/Vrindavan Saffron Peda.jpg',
    gallery: [
      '/assets/images/Vrindavan Saffron Peda.jpg'
    ],
    ingredients: ['Matured Milk Solids', 'Brown Cane sugar', 'Fresh Saffron infusion', 'Crushed pistachios'],
    shelfLife: '15 Days',
    weightOptions: ['250g Box', '500g Box', '1Kg Box'],
    priceMultipliers: { '250g Box': 1, '500g Box': 1.8, '1Kg Box': 3.4 },
    reviews: []
  },
  {
    id: 'sweet-jalebi',
    name: 'Saffron Shahi Jalebi',
    category: 'Sweets',
    description: 'Golden, spiral-piped crisp curls of fermented flour batter fried in clean cow ghee, soaked to absolute saturation in luxury saffron sugar syrups.',
    price: 15,
    rating: 4.89,
    image: '/assets/images/Saffron Shahi Jalebi.jpg',
    gallery: [
      '/assets/images/Saffron Shahi Jalebi.jpg'
    ],
    ingredients: ['Fermented All-Purpose Flour', 'Ghee from dairy cow milk', 'Botanical Rose Syrup', 'Himalayan wild Honey'],
    shelfLife: '2 Days (Best eaten fresh)',
    weightOptions: ['250g Pack', '500g Pack'],
    priceMultipliers: { '250g Pack': 1, '500g Pack': 1.8 },
    reviews: []
  },
  {
    id: 'sweet-badam-halwa',
    name: 'Imperial Almond Badam Halwa',
    category: 'Sweets',
    description: 'Opulent dessert paste made of hand-blanched whole luxury sweet almonds, cooked thoroughly with saffron-scented cow ghee, wild honey, and milk.',
    price: 32,
    rating: 4.97,
    image: '/assets/images/Imperial Almond Badam Halwa.jpg',
    gallery: [
      '/assets/images/Imperial Almond Badam Halwa.jpg'
    ],
    ingredients: ['Peeled Sweet Californian Almonds', 'Organic Pure Ghee', 'Saffron filaments', 'Cardamom zest'],
    shelfLife: '8 Days',
    weightOptions: ['150g Jar', '300g Jar', '500g Jar'],
    priceMultipliers: { '150g Jar': 1, '300g Jar': 1.8, '500g Jar': 2.8 },
    reviews: []
  },

  // ==================== SAVOURIES (10 ITEMS) ====================
  {
    id: 'savoury-samosa',
    name: 'Gourmet Potato & Pea Samosa',
    category: 'Savouries',
    description: 'A crisp, flaky golden pyramid pastry filled with lightly roasted green peas, potatoes, fresh coriander, ginger, and aromatic Himalayan wild spices.',
    price: 8,
    rating: 4.75,
    image: '/assets/images/Gourmet Potato & Pea Samosa.jpg',
    gallery: [
      '/assets/images/Gourmet Potato & Pea Samosa.jpg'
    ],
    ingredients: ['Crispy Pastry Dough (Maida)', 'Finely spiced organic potatoes', 'Fresh sweet green peas', 'Ground Garam Masala'],
    shelfLife: '2 Days',
    weightOptions: ['Pack of 2', 'Pack of 5', 'Pack of 10'],
    priceMultipliers: { 'Pack of 2': 1, 'Pack of 5': 2.3, 'Pack of 10': 4.2 },
    reviews: []
  },
  {
    id: 'savoury-veg-puff',
    name: 'Puff Pastry Veg Slice',
    category: 'Savouries',
    description: 'Layers of golden, incredibly crispy baked French puff pastry surrounding a rich filling of spiced carrots, sweetcorn, beans and sweet peas.',
    price: 10,
    rating: 4.6,
    image: '/assets/images/Puff Pastry Veg Slice.jpg',
    gallery: [
      '/assets/images/Puff Pastry Veg Slice.jpg'
    ],
    ingredients: ['Multi-folded Butter Puff Pastry', 'Spiced French Beans', 'Diced Sweet Carrot', 'Organic Seasoning'],
    shelfLife: '2 Days',
    weightOptions: ['Pack of 2', 'Pack of 4', 'Pack of 8'],
    priceMultipliers: { 'Pack of 2': 1, 'Pack of 4': 1.8, 'Pack of 8': 3.2 },
    reviews: []
  },
  {
    id: 'savoury-paneer-puff',
    name: 'Gourmet Paneer Spiced Puff',
    category: 'Savouries',
    description: 'Crisped baked flaky layers stuffed with diced fresh cottage cheese tossed in a smoky tandoori aromatic masala core.',
    price: 12,
    rating: 4.8,
    image: '/assets/images/Gourmet Paneer Spiced Puff.jpg',
    gallery: [
      '/assets/images/Gourmet Paneer Spiced Puff.jpg'
    ],
    ingredients: ['Butter Puff Layers', 'Diced Fresh Paneer', 'Tandoori Smoked spices', 'Fresh Coriander leaves'],
    shelfLife: '2 Days',
    weightOptions: ['Pack of 2', 'Pack of 4', 'Pack of 8'],
    priceMultipliers: { 'Pack of 2': 1, 'Pack of 4': 1.8, 'Pack of 8': 3.2 },
    reviews: []
  },
  {
    id: 'savoury-pizza-puff',
    name: 'Italian Herbs Pizza Puff',
    category: 'Savouries',
    description: 'A baked pocket of golden crust stuffed with marinara tomato sauce, shredded mozzarella cheese, baby corn, sweet bell peppers, and fresh Italian herbs.',
    price: 14,
    rating: 4.7,
    image: '/assets/images/Italian Herbs Pizza Puff.jpg',
    gallery: [
      '/assets/images/Italian Herbs Pizza Puff.jpg'
    ],
    ingredients: ['Puff Pastry flour', 'San Marzano Tomato Marinara', 'Mozzarella Cheese', 'Oregano & Basil zest'],
    shelfLife: '2 Days',
    weightOptions: ['Pack of 2', 'Pack of 4'],
    priceMultipliers: { 'Pack of 2': 1, 'Pack of 4': 1.8 },
    reviews: []
  },
  {
    id: 'savoury-khara-bun',
    name: 'Khara Spiced Potato Bun',
    category: 'Savouries',
    description: 'An iconic local bakery favorite: cloud-soft yeast bun stuffed with heavily spiced potatoes, green chillies, curry leaves, and aromatic mustard seeds.',
    price: 9,
    rating: 4.77,
    image: '/assets/images/Khara Spiced Potato Bun.jpg',
    gallery: [
      '/assets/images/Khara Spiced Potato Bun.jpg'
    ],
    ingredients: ['Yeast Bun flour', 'Mustard seeds & Curry leaves', 'Roasted potato shreds', 'Finely chopped Green Chillies'],
    shelfLife: '3 Days',
    weightOptions: ['Pack of 2', 'Pack of 4'],
    priceMultipliers: { 'Pack of 2': 1, 'Pack of 4': 1.85 },
    reviews: []
  },
  {
    id: 'savoury-cutlet',
    name: 'Spiced Beetroot & Veg Cutlet',
    category: 'Savouries',
    description: 'Crunchy, hand-shaped heart patties made of mashed sweet beetroot, potato, and peas, coated in toasted panko crumbs and grilled crisp.',
    price: 11,
    rating: 4.68,
    image: '/assets/images/Spiced Beetroot & Veg Cutlet.jpg',
    gallery: [
      '/assets/images/Spiced Beetroot & Veg Cutlet.jpg'
    ],
    ingredients: ['Fresh Organic Beetroot', 'Finely crumbs breading', 'Mashed sweet potato', 'In-house Mint Chutney'],
    shelfLife: '2 Days',
    weightOptions: ['Pack of 2', 'Pack of 4', 'Pack of 8'],
    priceMultipliers: { 'Pack of 2': 1, 'Pack of 4': 1.8, 'Pack of 8': 3.25 },
    reviews: []
  },
  {
    id: 'savoury-sandwich',
    name: 'Artisan Grilled Club Sandwich',
    category: 'Savouries',
    description: 'Triple layered freshly baked sourdough slices loaded with garden cucumber, farm tomatoes, cheddar cheese slices, green lettuce, and in-house basil pesto spread.',
    price: 18,
    rating: 4.72,
    image: '/assets/images/Artisan Grilled Club Sandwich.jpg',
    gallery: [
      '/assets/images/Artisan Grilled Club Sandwich.jpg'
    ],
    ingredients: ['Fresh Sourdough Bread', 'Basil Pesto mayonnaise', 'Cheddar Cheese slices', 'Horticulture Lettuce'],
    shelfLife: '1 Day (Must eat fresh)',
    weightOptions: ['Single Portion', 'Double Portion'],
    priceMultipliers: { 'Single Portion': 1, 'Double Portion': 1.8 },
    reviews: []
  },
  {
    id: 'savoury-garlic-bread',
    name: 'Sourdough Butter Garlic Bread',
    category: 'Savouries',
    description: 'Freshly baked premium French baguette sliced and smothered in homemade salted butter, freshly crushed garlic paste, parsley leaves, and organic mozzarella cheese.',
    price: 15,
    rating: 4.85,
    image: '/assets/images/Sourdough Butter Garlic Bread.jpg',
    gallery: [
      '/assets/images/Sourdough Butter Garlic Bread.jpg'
    ],
    ingredients: ['Fresh Sourdough Baguette', 'Pure Garlic Butter', 'Chopped Italian Flat-leaf Parsley', 'Creamy Mozzarella'],
    shelfLife: '2 Days',
    weightOptions: ['4 Slices', '8 Slices'],
    priceMultipliers: { '4 Slices': 1, '8 Slices': 1.8 },
    reviews: []
  },
  {
    id: 'savoury-cheese-roll',
    name: 'Golden Baked Cheese Roll',
    category: 'Savouries',
    description: 'Rich bread roll filled to capacity with matured cream cheese, garlic flakes and sweet bell peppers, baked to a beautiful deep-golden glaze.',
    price: 13,
    rating: 4.69,
    image: '/assets/images/Golden Baked Cheese Roll.jpg',
    gallery: [
      '/assets/images/Golden Baked Cheese Roll.jpg'
    ],
    ingredients: ['Rich Yeast Dough Roll', 'Matured English Cheddar', 'Chopped Sweet Bell Peppers', 'Glazed finish'],
    shelfLife: '3 Days',
    weightOptions: ['Pack of 2', 'Pack of 4'],
    priceMultipliers: { 'Pack of 2': 1, 'Pack of 4': 1.8 },
    reviews: []
  },
  {
    id: 'savoury-veg-roll',
    name: 'Spiced Spring Veg Roll',
    category: 'Savouries',
    description: 'Gently crisped wheat rolls packed tight with stir-fried organic cabbage shreds, carrots, spring onions, ginger, and soy dipping flavors.',
    price: 12,
    rating: 4.71,
    image: '/assets/images/Spiced Spring Veg Roll.jpg',
    gallery: [
      '/assets/images/Spiced Spring Veg Roll.jpg'
    ],
    ingredients: ['Crisp Spring Roll skin', 'Stir-fried Sweet cabbage', 'Shredded clean Carrots', 'Spiced Sesame Oil'],
    shelfLife: '2 Days',
    weightOptions: ['Pack of 2', 'Pack of 4'],
    priceMultipliers: { 'Pack of 2': 1, 'Pack of 4': 1.8 },
    reviews: []
  }
];
