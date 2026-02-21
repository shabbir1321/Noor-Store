export const categories = [
  { id: 'all', name: 'All Collections', icon: '', bannerImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200' },
  { id: 'custom-apparel', name: 'Premium Apparel', icon: '', bannerImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200' },
  { id: 'personalized-gifts', name: 'Exclusive Gifts', icon: '', bannerImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200' },
  { id: 'stationery', name: 'Professional Stationery', icon: '', bannerImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=1200' },
  { id: 'corporate', name: 'Corporate Identity', icon: '', bannerImage: 'https://images.unsplash.com/photo-1557804483-ef3ae78963f0?w=1200' },
  { id: 'decor', name: 'Interior Decor', icon: '', bannerImage: 'https://images.unsplash.com/photo-1621434071511-2eb7ca971038?w=1200' },
  { id: 'awards', name: 'Recognition & Awards', icon: '', bannerImage: 'https://images.unsplash.com/photo-1514330664402-3c48007a33a3?w=1200' },
];

export const carouselSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&q=80',
    title: 'Bespoke Apparel',
    subtitle: 'High-quality prints on premium cotton',
    buttonText: 'Explore Collection',
    link: '/category/custom-apparel'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80',
    title: 'Corporate Solutions',
    subtitle: 'Branded identity and executive gifts',
    buttonText: 'View Details',
    link: '/category/corporate'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&q=80',
    title: 'Interior Curation',
    subtitle: 'Personalized accents for modern spaces',
    buttonText: 'Shop Now',
    link: '/category/decor'
  }
];

export const products = [
  // Custom Apparel
  {
    id: 101,
    name: 'Custom Premium T-Shirt',
    category: 'custom-apparel',
    price: 999,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    description: '100% Cotton premium t-shirt. Customizable with your own design.',
    fullDescription: 'Our premium custom t-shirt is made from high-quality 100% combed cotton, providing unmatched comfort and durability. Use our real-time customizer to upload your design and see a preview on the shirt before you buy.',
    specifications: [
      { key: 'Material', value: '100% Combed Cotton' },
      { key: 'Fit', value: 'Unisex Relaxed' },
      { key: 'Print', value: 'High-Resolution DTG' }
    ],
    badge: 'Customizable',
    isCustomizable: true
  },
  // Personalized Gifts
  {
    id: 201,
    name: 'Personalized Ceramic Mug',
    category: 'personalized-gifts',
    price: 349,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80',
    description: 'High-quality 11oz ceramic mug with personalized print.',
    badge: 'Popular'
  },
  {
    id: 202,
    name: 'Custom Steel Water Bottle',
    category: 'personalized-gifts',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    badge: 'Eco-Friendly'
  },
  {
    id: 203,
    name: 'Personalized Photo Pillow',
    category: 'personalized-gifts',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&q=80'
  },
  {
    id: 204,
    name: 'LED Glow Pillow',
    category: 'personalized-gifts',
    price: 799,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80',
    badge: 'New'
  },
  {
    id: 205,
    name: 'Personalized Key Chain',
    category: 'personalized-gifts',
    price: 199,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1619134769835-cd298f265b50?w=400&q=80'
  },
  // Stationery
  {
    id: 301,
    name: 'Premium Pen with Name',
    category: 'stationery',
    price: 499,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80',
    badge: 'Luxury'
  },
  {
    id: 302,
    name: 'Custom Name Diary',
    category: 'stationery',
    price: 699,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80'
  },
  {
    id: 303,
    name: 'Elegant Pen Holder',
    category: 'stationery',
    price: 399,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1585822769458-132da970034c?w=400&q=80'
  },
  // Corporate
  {
    id: 401,
    name: 'Custom ID Card',
    category: 'corporate',
    price: 149,
    originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1614036417651-efe413054359?w=400&q=80'
  },
  {
    id: 402,
    name: 'Branded Display Batches',
    category: 'corporate',
    price: 99,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80'
  },
  {
    id: 403,
    name: 'Premium Card Holder',
    category: 'corporate',
    price: 299,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80'
  },
  {
    id: 404,
    name: 'Wooden Mobile Stand',
    category: 'corporate',
    price: 349,
    originalPrice: 549,
    image: 'https://images.unsplash.com/photo-1616423641454-996924b22ee0?w=400&q=80'
  },
  // Decor
  {
    id: 501,
    name: 'Acrylic Photo Frame',
    category: 'decor',
    price: 1299,
    originalPrice: 1899,
    image: 'https://images.unsplash.com/photo-1621434071511-2eb7ca971038?w=400&q=80',
    badge: 'Premium'
  },
  {
    id: 502,
    name: 'Magnet Photo Frame',
    category: 'decor',
    price: 399,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1621434071511-2eb7ca971038?w=400&q=80'
  },
  {
    id: 503,
    name: 'Designer Night Lamp',
    category: 'decor',
    price: 1499,
    originalPrice: 2199,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed03ac196b?w=400&q=80'
  },
  // Awards
  {
    id: 601,
    name: 'Modern Excellence Trophy',
    category: 'awards',
    price: 1999,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1579493122512-1d154421b933?w=400&q=80',
    badge: 'Gold'
  },
];
