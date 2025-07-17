// Test script to create a restaurant in localStorage for testing
const testRestaurant = {
  id: 'rest_1752703500000',
  userId: 'test-user-123',
  name: 'Test Pizza Palace',
  slug: 'test-pizza-palace-1752703500000',
  description: 'Delicious pizza and Italian cuisine',
  address: '123 Main Street, Test City, TC 12345',
  phone: '(555) 123-4567',
  email: 'contact@testpizzapalace.com',
  logoUrl: '',
  bannerUrl: '',
  themeColor: '#FF6B35',
  paymentMethods: ['stripe', 'counter'],
  isActive: true,
  createdAt: new Date().toISOString()
};

// Store in localStorage
localStorage.setItem('restaurantData', JSON.stringify(testRestaurant));
localStorage.setItem(`restaurant_test-user-123`, JSON.stringify(testRestaurant));

console.log('Test restaurant created:', testRestaurant);
console.log('Restaurant URL: /r/' + testRestaurant.slug);