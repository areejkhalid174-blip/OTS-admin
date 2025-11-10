import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CategoryProvider } from './context/CategoryContext';
import { VehicleProvider } from './context/VehicleContext';
import { DeliveryServiceProvider } from './context/DeliveryServiceContext';
import { RiderProvider } from './context/RiderContext';
import { CustomerProvider } from './context/CustomerContext';
import { OrderProvider } from './context/OrderContext';
import { CityProvider } from './context/CityContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminSignUp from './pages/AdminSignUp';
import { handleSignUp } from './Helper/firebaseHelper';
import Dashboard from './pages/Dashboard';
import CustomerHome from './pages/CustomerHome';
import UserManagement from './pages/UserManagement';
import CategoryManagement from './pages/CategoryManagement';
import VehicleManagement from './pages/VehicleManagement';
import DeliveryServiceManagement from './pages/DeliveryServiceManagement';
import RiderManagement from './pages/RiderManagement';
import CustomerManagement from './pages/CustomerManagement';
import OrderPlacement from './pages/OrderPlacement';
import OrderManagement from './pages/OrderManagement';
import FeedbackSystem from './pages/FeedbackSystem';
import ReportAnalytics from './pages/ReportAnalytics';
import PaymentManagement from './pages/PaymentManagement';
import CustomerSupport from './pages/CustomerSupport';
import CityManagement from './pages/CityManagement';
import PriceManagement from './pages/PriceManagement';
import { PriceProvider } from './context/PriceContext';

const App = () => {
  return (
    <AuthProvider>
      <CategoryProvider>
        <VehicleProvider>
        <DeliveryServiceProvider>
        <RiderProvider>
        <CustomerProvider>
        <OrderProvider>
        <CityProvider>
        <PriceProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-signup" element={<AdminSignUp onSignUp={async (form, setError, setLoading) => {
            const { firstName, lastName, email, password } = form;
            const result = await handleSignUp(email, password, {
              firstName,
              lastName,
              role: 'admin',
              createdAt: new Date().toISOString(),
            });
            setLoading(false);
            if (!result.success) {
              setError(result.error);
            } else {
              setError('');
              // Optionally redirect or show success message
            }
          }} />} />
          <Route path="/customer-home" element={<ProtectedRoute><CustomerHome /></ProtectedRoute>} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/user-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <UserManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/category-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <CategoryManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/city-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <CityManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/vehicle-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <VehicleManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/delivery-service-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <DeliveryServiceManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/rider-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <RiderManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/customer-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <CustomerManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/order-placement" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <OrderPlacement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/OrderManagement" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <OrderManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/RiderManagement" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <RiderManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/PaymentManagement" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <PaymentManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/CustomerSupport" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <CustomerSupport />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/FeedbackSystem" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <FeedbackSystem />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/ReportAnalytics" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <ReportAnalytics />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/price-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <PriceManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
        </Router>
        </PriceProvider>
        </CityProvider>
        </OrderProvider>
        </CustomerProvider>
        </RiderProvider>
        </DeliveryServiceProvider>
        </VehicleProvider>
      </CategoryProvider>
    </AuthProvider>
  );
};

export default App;