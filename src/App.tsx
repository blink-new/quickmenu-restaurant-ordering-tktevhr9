import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blink } from './lib/blink'
import LandingPage from './pages/LandingPage'
import RestaurantDashboard from './pages/RestaurantDashboard'
import RestaurantSetup from './pages/RestaurantSetup'
import PublicOrderingPage from './pages/PublicOrderingPage'
import { Toaster } from './components/ui/sonner'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const unsubscribe = blink.auth.onAuthStateChanged((state) => {
        if (state && typeof state === 'object') {
          setUser(state.user || null)
          setLoading(state.isLoading || false)
          setAuthError(null)
        } else {
          setUser(null)
          setLoading(false)
        }
      })
      return unsubscribe
    } catch (error) {
      console.error('Auth initialization error:', error)
      setAuthError('Failed to initialize authentication')
      setLoading(false)
    }
  }, [])

  if (authError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{authError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading QuickMenu...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<LandingPage user={user} />} />
            <Route path="/setup" element={<RestaurantSetup user={user} />} />
            <Route path="/dashboard" element={<RestaurantDashboard user={user} />} />
            <Route path="/r/:restaurantSlug" element={<PublicOrderingPage />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App