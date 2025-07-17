import { useState, useEffect, useCallback } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { 
  QrCode, 
  Plus, 
  Settings, 
  BarChart3, 
  Clock, 
  DollarSign,
  Users,
  ShoppingBag,
  Upload,
  Palette
} from 'lucide-react'
import { blink } from '../lib/blink'
import { toast } from 'sonner'
import QRCodeGenerator from '../components/QRCodeGenerator'
import MenuManager from '../components/MenuManager'

interface RestaurantDashboardProps {
  user: any
}

export default function RestaurantDashboard({ user }: RestaurantDashboardProps) {
  const [restaurant, setRestaurant] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadRestaurantData = useCallback(async () => {
    try {
      // Try to load from localStorage first (primary storage for now)
      const userRestaurantData = localStorage.getItem(`restaurant_${user.id}`)
      const generalRestaurantData = localStorage.getItem('restaurantData')
      
      const restaurantData = userRestaurantData || generalRestaurantData
      
      if (restaurantData) {
        const parsedData = JSON.parse(restaurantData)
        
        // Ensure the restaurant belongs to the current user
        if (parsedData.userId === user.id) {
          setRestaurant(parsedData)
          
          // Load orders from localStorage
          const ordersKey = `orders_${parsedData.id}`
          const ordersData = localStorage.getItem(ordersKey)
          if (ordersData) {
            try {
              const loadedOrders = JSON.parse(ordersData)
              setOrders(loadedOrders)
            } catch (e) {
              console.error('Error parsing orders data:', e)
              setOrders([])
            }
          } else {
            // Load mock orders for demo if no real orders exist
            const mockOrders = [
              { 
                id: '1', 
                restaurantId: parsedData.id, 
                customerName: 'John Doe',
                items: [{ name: 'Burger', quantity: 1 }, { name: 'Fries', quantity: 1 }],
                total: 15.99,
                status: 'preparing', 
                createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago
              },
              { 
                id: '2', 
                restaurantId: parsedData.id, 
                customerName: 'Jane Smith',
                items: [{ name: 'Pizza', quantity: 1 }, { name: 'Coke', quantity: 1 }],
                total: 22.50,
                status: 'ready', 
                createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
              }
            ]
            setOrders(mockOrders)
            localStorage.setItem(ordersKey, JSON.stringify(mockOrders))
          }
        }
      }
    } catch (error) {
      console.error('Error loading restaurant data:', error)
      toast.error('Failed to load restaurant data')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadRestaurantData()
    }
  }, [user, loadRestaurantData])

  const handleCreateRestaurant = () => {
    // Redirect to setup page instead
    window.location.href = '/setup'
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => blink.auth.login('/dashboard')}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
            <QrCode className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle>Welcome to QuickMenu</CardTitle>
            <CardDescription>
              Let's set up your restaurant and start taking orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleCreateRestaurant}>
              Create Your Restaurant
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <QrCode className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">{restaurant.name}</h1>
                <p className="text-sm text-muted-foreground">Restaurant Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <QRCodeGenerator 
                restaurantSlug={restaurant.slug} 
                restaurantName={restaurant.name} 
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => blink.auth.logout()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,350</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18m</div>
              <p className="text-xs text-muted-foreground">
                -2m from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recent Orders</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Queue</CardTitle>
                <CardDescription>Manage incoming orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <p className="text-sm text-muted-foreground">
                      Share your QR code to start receiving orders
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order?.id || Math.random()} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">Order #{order?.id || 'Unknown'}</p>
                            <p className="text-sm font-medium">${order?.total || 0}</p>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Customer: {order?.customerName || 'Walk-in Customer'}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            Items: {Array.isArray(order?.items) ? 
                              order.items.map(item => 
                                typeof item === 'string' ? item : `${item?.name || 'Item'} (${item?.quantity || 1})`
                              ).join(', ') : 
                              'No items'
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'Unknown time'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={order?.status === 'ready' ? 'default' : 'secondary'}>
                            {order?.status === 'preparing' ? 'Preparing' : 'Ready'}
                          </Badge>
                          {order?.status === 'preparing' && (
                            <Button size="sm">Mark Ready</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Menu Management</h2>
            </div>

            <MenuManager restaurantId={restaurant.id} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Restaurant Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>
                    Customize your restaurant's appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Banner
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Palette className="h-4 w-4 mr-2" />
                    Choose Theme Color
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>
                    Configure payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Stripe (Online Payment)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Pay at Counter</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  Detailed analytics and insights will be available soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}