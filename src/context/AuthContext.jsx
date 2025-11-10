import React, { createContext, useContext, useState, useEffect } from 'react';

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
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Load users from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with some sample users
      const sampleUsers = [
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', password: 'admin123' },
        { id: 2, name: 'John Doe', email: 'john@example.com', role: 'user', password: 'user123' }
      ];
      setUsers(sampleUsers);
      localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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

