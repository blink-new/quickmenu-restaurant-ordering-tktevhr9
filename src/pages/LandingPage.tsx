import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { QrCode, Smartphone, CreditCard, BarChart3, Clock, Zap } from 'lucide-react'
import { blink } from '../lib/blink'
import { toast } from 'sonner'

interface LandingPageProps {
  user: any
}

export default function LandingPage({ user }: LandingPageProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = async () => {
    if (!user) {
      setIsLoading(true)
      try {
        blink.auth.login('/setup')
      } catch (error) {
        console.error('Login error:', error)
        toast.error('Failed to start login process. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      try {
        // Check if user already has a restaurant
        const userRestaurantData = user.id ? localStorage.getItem(`restaurant_${user.id}`) : null
        const generalRestaurantData = localStorage.getItem('restaurantData')
        
        if (userRestaurantData || generalRestaurantData) {
          window.location.href = '/dashboard'
        } else {
          window.location.href = '/setup'
        }
      } catch (error) {
        console.error('Navigation error:', error)
        toast.error('Navigation failed. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <QrCode className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">QuickMenu</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={handleGetStarted}>
                  Dashboard
                </Button>
              ) : (
                <Button onClick={handleGetStarted} disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Get Started'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 Launch your restaurant online in minutes
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
              QR-Based Restaurant
              <span className="text-primary block">Ordering System</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your restaurant with AI-powered menu parsing, seamless payments, 
              and real-time order management. Get your QR code and start taking orders today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Start Free Trial'}
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>
          </div>

          {/* Demo QR Code */}
          <div className="mt-16 flex justify-center">
            <Card className="w-80">
              <CardHeader className="text-center">
                <CardTitle>Demo Restaurant</CardTitle>
                <CardDescription>Scan to see how it works</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything you need to run your restaurant
            </h2>
            <p className="text-xl text-muted-foreground">
              From AI menu parsing to real-time order management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI Menu Parsing</CardTitle>
                <CardDescription>
                  Upload your menu PDF or image and let AI extract all items automatically
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <QrCode className="h-8 w-8 text-primary mb-2" />
                <CardTitle>QR Code Generation</CardTitle>
                <CardDescription>
                  Get a unique QR code for your restaurant that customers can scan to order
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Mobile-First Design</CardTitle>
                <CardDescription>
                  Beautiful, responsive ordering interface optimized for mobile devices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CreditCard className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Multiple Payment Options</CardTitle>
                <CardDescription>
                  Stripe integration, pay at counter, or cash on delivery options
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Real-time Orders</CardTitle>
                <CardDescription>
                  Live order management with queue numbers and status tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track orders, revenue, and customer insights in real-time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How it works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up & Customize</h3>
              <p className="text-muted-foreground">
                Create your account, upload your logo, and choose your brand colors
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Your Menu</h3>
              <p className="text-muted-foreground">
                Upload a PDF/image for AI parsing or add items manually
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Taking Orders</h3>
              <p className="text-muted-foreground">
                Get your QR code and start receiving orders instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to transform your restaurant?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of restaurants already using QuickMenu
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get Started Free'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <QrCode className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">QuickMenu</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 QuickMenu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}