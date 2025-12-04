import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
import { setUser, setRole } from './redux/Slices/HomeDataSlice';
import Dashboard from './pages/Dashboard';
import CustomerHome from './pages/CustomerHome';
import UserManagement from './pages/UserManagement';
import CategoryManagement from './pages/CategoryManagement';
import VehicleManagement from './pages/VehicleManagement';
import DeliveryServiceManagement from './pages/DeliveryServiceManagement';
import RiderManagement from './pages/RiderManagement';
import CustomerManagement from './pages/CustomerManagement';
import OrderPlacement from './pages/OrderPlacement';
import FeedbackSystem from './pages/FeedbackSystem';
import ReportAnalytics from './pages/ReportAnalytics';
import PaymentManagement from './pages/PaymentManagement';
import BankAccountManagement from './pages/BankAccountManagement';
import CustomerSupport from './pages/CustomerSupport';
import CityManagement from './pages/CityManagement';
import PriceManagement from './pages/PriceManagement';
import AboutUs from './pages/AboutUs';
import AdminChatManagement from './pages/AdminChatManagement';
import AdminChatDetail from './pages/AdminChatDetail';
import { PriceProvider } from './context/PriceContext';
import { NotificationProvider } from './context/NotificationContext';

// Wrapper component for AdminSignUp to use hooks
const AdminSignUpWrapper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdminSignUp = async (form, setError, setLoading) => {
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
      // Store user data in Redux
      if (result.data) {
        dispatch(setUser(result.data));
        dispatch(setRole('admin'));
      }
      // Redirect to dashboard after successful signup
      navigate('/dashboard');
    }
  };

  return <AdminSignUp onSignUp={handleAdminSignUp} />;
};

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
        <NotificationProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-signup" element={<AdminSignUpWrapper />} />
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
          <Route path="/payment-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <PaymentManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/bank-account-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <BankAccountManagement />
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
          <Route path="/about-us" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <AboutUs />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin-chat-management" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <AdminChatManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin-chat/:conversationId" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                  <AdminChatDetail />
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
        </Router>
        </NotificationProvider>
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