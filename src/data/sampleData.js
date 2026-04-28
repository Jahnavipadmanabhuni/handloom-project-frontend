// src/data/sampleData.js
export const initializeSampleData = () => {
  // Sample users
  const sampleUsers = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@handloom.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
      address: 'Admin Address'
    },
    {
      id: 2,
      name: 'Sandeep Shavukari',
      email: 'artisan@handloom.com',
      password: 'artisan123',
      role: 'artisan',
      phone: '+1234567891',
      address: 'Artisan Village, India'
    },
    {
      id: 3,
      name: 'Global Buyer',
      email: 'buyer@handloom.com',
      password: 'buyer123',
      role: 'buyer',
      phone: '+1234567892',
      address: 'New York, USA'
    },
    {
      id: 4,
      name: 'Jahnavi',
      email: 'marketing@handloom.com',
      password: 'marketing123',
      role: 'marketing',
      phone: '+1234567893',
      address: 'Marketing Office'
    }
  ];

  // Sample products
  const sampleProducts = [
    {
      id: 1,
      name: 'Handwoven Silk Saree',
      description: 'Beautiful handwoven silk saree with traditional patterns and intricate zari work. Each piece takes 2 weeks to create by skilled artisans.',
      price: 150,
      stock: 10,
      category: 'clothing',
      image: 'https://t4.ftcdn.net/jpg/00/17/49/37/360_F_17493746_NxmDWBzvxFZjwi2lmDXVddPTI4nlb44p.jpg',
      materials: 'Pure Silk, Zari Thread',
      dimensions: '6 yards',
      artisan: 'Rajesh Weaver'
    },
    {
      id: 2,
      name: 'Handcrafted Cotton Scarf',
      description: 'Eco-friendly cotton scarf with natural dyes. Soft, breathable, and perfect for all seasons.',
      price: 25,
      stock: 50,
      category: 'accessories',
      image: 'https://itokri.com/cdn/shop/files/0Q8A5547_1ab5622e-f7c6-4ed4-9b70-4f09061a12ca.jpg?crop=center&height=2000&v=1759060630&width=2000',
      materials: 'Organic Cotton, Natural Dyes',
      dimensions: '30x30 inches',
      artisan: 'Rajesh Weaver'
    },
    {
      id: 3,
      name: 'Traditional Wool Shawl',
      description: 'Warm and comfortable wool shawl with traditional embroidery. Handcrafted using ancient techniques.',
      price: 75,
      stock: 15,
      category: 'clothing',
      image: 'https://via.placeholder.com/400x500/45B7D1/FFFFFF?text=Wool+Shawl',
      materials: 'Pure Wool, Cotton Thread',
      dimensions: '70x40 inches',
      artisan: 'Rajesh Weaver'
    }
  ];

  // Sample campaigns
  const sampleCampaigns = [
    {
      id: 1,
      name: 'Global Handloom Festival',
      platform: 'social-media',
      budget: 5000,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      audience: 'Global buyers interested in sustainable fashion',
      description: 'Promoting handloom products to international markets',
      status: 'active',
      reach: 12500,
      engagement: 15.2,
      conversions: 234
    }
  ];

  // Initialize localStorage with sample data if not exists
  if (!localStorage.getItem('handloom_users')) {
    localStorage.setItem('handloom_users', JSON.stringify(sampleUsers));
  }
  
  if (!localStorage.getItem('handloom_products')) {
    localStorage.setItem('handloom_products', JSON.stringify(sampleProducts));
  }
  
  if (!localStorage.getItem('handloom_campaigns')) {
    localStorage.setItem('handloom_campaigns', JSON.stringify(sampleCampaigns));
  }
  
  // Initialize other storage items
  if (!localStorage.getItem('handloom_cart')) {
    localStorage.setItem('handloom_cart', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('handloom_orders')) {
    localStorage.setItem('handloom_orders', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('handloom_wishlist')) {
    localStorage.setItem('handloom_wishlist', JSON.stringify([]));
  }
};