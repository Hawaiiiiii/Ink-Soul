import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { CartProvider } from './contexts/CartContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import { useRemoveMiniMaxWatermark } from './hooks/useRemoveMiniMaxWatermark'
import { Navigation } from './components/layout/Navigation'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { AppointmentsPage } from './pages/AppointmentsPage'
import { ShopPage } from './pages/ShopPage'
import { ContactPage } from './pages/ContactPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage'
import { FlashEventsPage } from './pages/FlashEventsPage'
import { FlashEventDetailPage } from './pages/FlashEventDetailPage'
import { FlashPastEventsPage } from './pages/FlashPastEventsPage'
import { AdminLogin } from './components/admin/AdminLogin'
import { ProtectedRoute } from './components/admin/ProtectedRoute'
import { DashboardPage } from './pages/admin/DashboardPage'
import { NotificationsPage } from './pages/admin/NotificationsPage'
import ScrollToTop from './components/ScrollToTop'
import { ScrollTopButton } from './components/ScrollTopButton'

function App() {
  // Hook to remove MiniMax watermark permanently
  useRemoveMiniMaxWatermark()
  return (
    <LanguageProvider>
      <CartProvider>
        <AdminAuthProvider>
          <Router>
            <ScrollToTop />
            <ScrollTopButton />
            <Routes>
              {/* Rutas públicas con layout principal */}
              <Route path="/" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <HomePage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/about" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <AboutPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/portfolio" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <PortfolioPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/appointments" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <AppointmentsPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/shop" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <ShopPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/contact" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <ContactPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/checkout" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <CheckoutPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/checkout/success" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <CheckoutSuccessPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/flash" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <FlashEventsPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/flash/:slug" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <FlashEventDetailPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/flash/pasados" element={
                <div className="min-h-screen flex flex-col bg-background-primary">
                  <Navigation />
                  <main className="flex-grow pt-20 md:pt-24">
                    <FlashPastEventsPage />
                  </main>
                  <Footer />
                </div>
              } />

              {/* Rutas administrativas */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AdminAuthProvider>
      </CartProvider>
    </LanguageProvider>
  )
}

export default App
