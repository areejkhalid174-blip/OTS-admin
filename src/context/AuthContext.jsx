import React, { createContext, useContext, useState, useEffect } from 'react';
import { handleLogin as firebaseLogin, getDataById } from '../Helper/firebaseHelper';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Try Firebase login first
      const result = await firebaseLogin(email, password);
      
      if (result.success && result.data) {
        const userData = result.data;
        
        // Check if user is a rider with pending status
        if (userData.role === 'Rider' && userData.status === 'pending') {
          return { 
            success: false, 
            error: 'Your account is pending admin approval. Please wait for approval before logging in.' 
          };
        }
        
        // If rider status is rejected, also block login
        if (userData.role === 'Rider' && userData.status === 'rejected') {
          return { 
            success: false, 
            error: 'Your account has been rejected. Please contact admin for assistance.' 
          };
        }
        
        // Check if user is a customer with pending status
        if (userData.role === 'Customer' && userData.status === 'pending') {
          return { 
            success: false, 
            error: 'Your account is pending admin approval. Please wait for approval before logging in.' 
          };
        }
        
        // Store user data
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, error: result.error || 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (userData) => {
    try {
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'User already exists with this email' };
      }

      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'user'
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      // Import logout from firebaseHelper
      const { logout: firebaseLogout } = await import('../Helper/firebaseHelper');
      await firebaseLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const addUser = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'user'
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return { success: true, user: newUser };
  };

  const updateUser = (id, userData) => {
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return { success: true };
  };

  const deleteUser = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return { success: true };
  };

  const value = {
    user,
    users,
    loading,
    login,
    signup,
    logout,
    addUser,
    updateUser,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

