import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('erp_user');
      const token  = localStorage.getItem('erp_token');
      if (stored && token) {
        const parsed = JSON.parse(stored);
        // Always uppercase the role so routing is consistent
        if (parsed.role) parsed.role = parsed.role.toUpperCase();
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem('erp_user');
      localStorage.removeItem('erp_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    // Normalize role before storing
    if (userData.role) userData.role = userData.role.toUpperCase();
    localStorage.setItem('erp_user',  JSON.stringify(userData));
    localStorage.setItem('erp_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_token');
    setUser(null);
  };

  // Update stored user after profile edits
  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    if (merged.role) merged.role = merged.role.toUpperCase();
    localStorage.setItem('erp_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
