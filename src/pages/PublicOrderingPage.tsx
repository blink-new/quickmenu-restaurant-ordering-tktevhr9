import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Clock,
  MapPin,
  Star
} from 'lucide-react'
import { blink } from '../lib/blink'
import { toast } from 'sonner'

export default function PublicOrderingPage() {
  const { restaurantSlug } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderType, setOrderType] = useState('dine-in')

  const loadRestaurantData = useCallback(async () => {
    try {
      // Load restaurant from localStorage for now
      const restaurantData = localStorage.getItem('restaurantData')
      const userRestaurantData = localStorage.getItem(`restaurant_${restaurantSlug}`)
      
      let foundRestaurant = null
      
      // Try to find restaurant by slug
      if (restaurantData) {
        const parsed = JSON.parse(restaurantData)
        if (parsed.slug === restaurantSlug) {
          foundRestaurant = parsed
        }
      }
      
      // Also check all user restaurant data
      if (!foundRestaurant) {
        // Check all localStorage keys for restaurant data
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('restaurant_')) {
            try {
              const data = JSON.parse(localStorage.getItem(key) || '{}')
              if (data.slug === restaurantSlug) {
                foundRestaurant = data
                break
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      if (foundRestaurant) {
        setRestaurant(foundRestaurant)
        
        // Load menu items from localStorage
        const menuKey = `menu_${foundRestaurant.id}`
        const menuData = localStorage.getItem(menuKey)
        if (menuData) {
          try {
            const items = JSON.parse(menuData)
            setMenuItems(items)
          } catch (e) {
            console.error('Error parsing menu data:', e)
            setMenuItems([])
          }
        } else {
          // Create some sample menu items for demo
          const sampleItems = [
            {
              id: 'item_1',
              restaurantId: foundRestaurant.id,
              name: 'Classic Burger',
              description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
              price: 12.99,
              category: 'Main Course',
              image: '',
              isAvailable: true
            },
            {
              id: 'item_2',
              restaurantId: foundRestaurant.id,
              name: 'Margherita Pizza',
              description: 'Fresh mozzarella, tomato sauce, and basil',
              price: 14.99,
              category: 'Main Course',
              image: '',
              isAvailable: true
            },
            {
              id: 'item_3',
              restaurantId: foundRestaurant.id,
              name: 'Caesar Salad',
              description: 'Crisp romaine lettuce with parmesan and croutons',
              price: 8.99,
              category: 'Appetizers',
              image: '',
              isAvailable: true
            },
            {
              id: 'item_4',
              restaurantId: foundRestaurant.id,
              name: 'Chocolate Cake',
              description: 'Rich chocolate cake with vanilla ice cream',
              price: 6.99,
              category: 'Desserts',
              image: '',
              isAvailable: true
            }
          ]
          setMenuItems(sampleItems)
          localStorage.setItem(menuKey, JSON.stringify(sampleItems))
        }
      }
    } catch (error) {
      console.error('Error loading restaurant data:', error)
      toast.error('Failed to load restaurant data')
    } finally {
      setLoading(false)
    }
  }, [restaurantSlug])

  useEffect(() => {
    if (restaurantSlug) {
      loadRestaurantData()
    }
  }, [restaurantSlug, loadRestaurantData])

  const addToCart = (item) => {
    if (!item || !item.id) {
      toast.error('Invalid item')
      return
    }
    
    const existingItem = cart.find(cartItem => cartItem?.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem?.id === item.id 
          ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
    toast.success(`${item?.name || 'Item'} added to cart`)
  }

  const removeFromCart = (itemId) => {
    if (!itemId) return
    
    const existingItem = cart.find(cartItem => cartItem?.id === itemId)
    if (existingItem && (existingItem.quantity || 0) > 1) {
      setCart(cart.map(cartItem => 
        cartItem?.id === itemId 
          ? { ...cartItem, quantity: (cartItem.quantity || 1) - 1 }
          : cartItem
      ))
    } else {
      setCart(cart.filter(cartItem => cartItem?.id !== itemId))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return total
      }
      return total + (item.price * item.quantity)
    }, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => {
      if (!item || typeof item.quantity !== 'number') {
        return total
      }
      return total + item.quantity
    }, 0)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      const orderId = `order_${Date.now()}`
      const order = {
        id: orderId,
        restaurantId: restaurant.id,
        items: cart,
        total: getCartTotal(),
        orderType,
        status: 'pending',
        queueNumber: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date().toISOString()
      }

      // Save order to localStorage
      const ordersKey = `orders_${restaurant.id}`
      const existingOrders = localStorage.getItem(ordersKey)
      const orders = existingOrders ? JSON.parse(existingOrders) : []
      orders.push(order)
      localStorage.setItem(ordersKey, JSON.stringify(orders))

      toast.success(`Order placed successfully! Queue number: ${order.queueNumber}`)
      setCart([])
      
      // In a real app, redirect to order tracking page
      console.log('Order created:', order)
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle>Restaurant Not Found</CardTitle>
            <CardDescription>
              The restaurant you're looking for doesn't exist or is not active.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Group menu items by category
  const groupedItems = menuItems.reduce((groups, item) => {
    if (!item || typeof item !== 'object') return groups
    
    const category = item.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {})

  return (
    <div className="min-h-screen bg-background">
      {/* Restaurant Header */}
      <div className="relative">
        {restaurant.banner && (
          <div 
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${restaurant.banner})` }}
          />
        )}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-start space-x-4">
              {restaurant.logo && (
                <img 
                  src={restaurant.logo} 
                  alt={restaurant.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">{restaurant.name}</h1>
                <p className="text-muted-foreground mb-2">{restaurant.description}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.5</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>20-30 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>0.5 km away</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Order Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {['dine-in', 'takeaway', 'delivery'].map((type) => (
                <Button
                  key={type}
                  variant={orderType === type ? 'default' : 'outline'}
                  onClick={() => setOrderType(type)}
                  className="capitalize"
                >
                  {type.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.keys(groupedItems).length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No menu items available</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item?.id || Math.random()} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{item?.name || 'Unknown Item'}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item?.description || ''}</p>
                          <p className="font-semibold">${item?.price || 0}</p>
                        </div>
                        {item?.image && (
                          <img 
                            src={item.image} 
                            alt={item.name || 'Menu item'}
                            className="w-16 h-16 rounded-lg object-cover ml-4"
                          />
                        )}
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item?.id)}
                            disabled={!cart.find(cartItem => cartItem?.id === item?.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {cart.find(cartItem => cartItem?.id === item?.id)?.quantity || 0}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Your Order ({getCartItemCount()})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Your cart is empty
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item?.id || Math.random()} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{item?.name || 'Unknown Item'}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item?.price || 0} x {item?.quantity || 0}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item?.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item?.quantity || 0}</span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleCheckout}
                      disabled={cart.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}