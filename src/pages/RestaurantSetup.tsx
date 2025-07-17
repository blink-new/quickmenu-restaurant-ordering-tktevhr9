import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { 
  QrCode, 
  Upload, 
  Palette, 
  CreditCard, 
  Banknote, 
  Wallet,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react'
import { blink } from '../lib/blink'
import { toast } from 'sonner'

interface RestaurantSetupProps {
  user: any
}

export default function RestaurantSetup({ user }: RestaurantSetupProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
    banner: '',
    themeColor: '#FF6B35',
    paymentMethods: ['stripe', 'counter']
  })

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Restaurant details' },
    { id: 2, title: 'Branding', description: 'Logo & theme' },
    { id: 3, title: 'Payments', description: 'Payment options' },
    { id: 4, title: 'Complete', description: 'Review & finish' }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentMethodToggle = (method: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error('Restaurant name is required')
        return
      }

      if (formData.paymentMethods.length === 0) {
        toast.error('Please select at least one payment method')
        return
      }

      // Generate a unique slug
      const slug = formData.name.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now()

      const restaurantData = {
        id: `rest_${Date.now()}`,
        userId: user.id,
        name: formData.name,
        slug,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        logoUrl: formData.logo,
        bannerUrl: formData.banner,
        themeColor: formData.themeColor,
        paymentMethods: formData.paymentMethods,
        isActive: true,
        createdAt: new Date().toISOString()
      }

      // Save to localStorage (primary storage for now)
      localStorage.setItem('restaurantData', JSON.stringify(restaurantData))
      localStorage.setItem(`restaurant_${user.id}`, JSON.stringify(restaurantData))

      toast.success('Restaurant setup completed successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error completing setup:', error)
      toast.error('Failed to complete setup. Please try again.')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to set up your restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => blink.auth.login('/setup')}
            >
              Sign In
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <QrCode className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">QuickMenu Setup</h1>
                <p className="text-sm text-muted-foreground">Set up your restaurant</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => blink.auth.logout()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Restaurant Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter restaurant name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of your restaurant"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Restaurant address"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@restaurant.com"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Logo Upload</CardTitle>
                      <CardDescription>Upload your restaurant logo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop or click to upload
                        </p>
                        <Button variant="outline" size="sm">Choose File</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Banner Image</CardTitle>
                      <CardDescription>Upload a banner for your ordering page</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop or click to upload
                        </p>
                        <Button variant="outline" size="sm">Choose File</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Theme Color</CardTitle>
                    <CardDescription>Choose your brand color</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Palette className="h-5 w-5 text-muted-foreground" />
                        <Label>Brand Color</Label>
                      </div>
                      <input
                        type="color"
                        value={formData.themeColor}
                        onChange={(e) => handleInputChange('themeColor', e.target.value)}
                        className="w-12 h-8 rounded border"
                      />
                      <Input
                        value={formData.themeColor}
                        onChange={(e) => handleInputChange('themeColor', e.target.value)}
                        className="w-24"
                        placeholder="#FF6B35"
                      />
                    </div>
                    <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: formData.themeColor + '20' }}>
                      <p className="text-sm">Preview: This is how your brand color will look</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Select Payment Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card 
                      className={`cursor-pointer transition-all ${
                        formData.paymentMethods.includes('stripe') 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handlePaymentMethodToggle('stripe')}
                    >
                      <CardContent className="p-6 text-center">
                        <CreditCard className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h4 className="font-medium mb-2">Online Payment</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Accept credit cards via Stripe
                        </p>
                        <Badge variant={formData.paymentMethods.includes('stripe') ? 'default' : 'secondary'}>
                          3% fee
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-all ${
                        formData.paymentMethods.includes('counter') 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handlePaymentMethodToggle('counter')}
                    >
                      <CardContent className="p-6 text-center">
                        <Wallet className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h4 className="font-medium mb-2">Pay at Counter</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Customer pays when picking up
                        </p>
                        <Badge variant={formData.paymentMethods.includes('counter') ? 'default' : 'secondary'}>
                          3% fee
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-all ${
                        formData.paymentMethods.includes('cash') 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handlePaymentMethodToggle('cash')}
                    >
                      <CardContent className="p-6 text-center">
                        <Banknote className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h4 className="font-medium mb-2">Cash Payment</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Cash on delivery/pickup
                        </p>
                        <Badge variant={formData.paymentMethods.includes('cash') ? 'default' : 'secondary'}>
                          3% fee
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p>• QuickMenu charges a 3% processing fee on all orders</p>
                      <p>• For online payments: Funds are transferred to your account every 2 days</p>
                      <p>• For offline payments: You'll receive a monthly invoice</p>
                      <p>• You can change payment methods anytime in settings</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Almost Ready!</h3>
                  <p className="text-muted-foreground">
                    Review your restaurant setup and complete the process
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Restaurant Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-sm text-muted-foreground">{formData.name || 'Not set'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <p className="text-sm text-muted-foreground">{formData.phone || 'Not set'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Theme Color</Label>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: formData.themeColor }}
                          />
                          <span className="text-sm text-muted-foreground">{formData.themeColor}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Payment Methods</Label>
                        <div className="flex space-x-1 mt-1">
                          {formData.paymentMethods.map(method => (
                            <Badge key={method} variant="secondary" className="text-xs">
                              {method === 'stripe' ? 'Online' : method === 'counter' ? 'Counter' : 'Cash'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {formData.description && (
                      <div>
                        <Label className="text-sm font-medium">Description</Label>
                        <p className="text-sm text-muted-foreground">{formData.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What's Next?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p>✅ Your restaurant profile will be created</p>
                      <p>✅ You'll get a unique QR code for customers</p>
                      <p>✅ Access to your dashboard to manage orders</p>
                      <p>✅ Start adding your menu items</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {currentStep < 4 ? (
            <Button 
              onClick={handleNext}
              disabled={currentStep === 1 && !formData.name}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={!formData.name || formData.paymentMethods.length === 0}
            >
              Complete Setup
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}