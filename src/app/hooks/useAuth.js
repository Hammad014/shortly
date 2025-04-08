// hooks/useAuth.js
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        const authData = await authResponse.json();
        
        if (authData.valid) {
          setUser(authData.user);
          const storedSessionId = localStorage.getItem("sessionId");
          setSessionId(storedSessionId);
        } else {
          setUser(null); // Clear user state
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null); // Clear user state on error
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Remove router dependency

  return { user, sessionId, loading };
};