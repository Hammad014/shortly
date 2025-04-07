// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

const [user, setUser] = useState(null); // Add user state

useEffect(() => {
  const checkAuth = async () => {
    try {
      const authResponse = await fetch('/api/auth/verify', {
        credentials: 'include'
      });
      
      const authData = await authResponse.json();
      
      if (authData.valid) {
        setUser(authData.user); // Set user state from API response
        const storedSessionId = localStorage.getItem("sessionId");
        setSessionId(storedSessionId);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, [router]);

return { user, sessionId, loading }; // Return user state
};

