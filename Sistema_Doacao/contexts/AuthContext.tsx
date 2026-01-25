import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, removeToken } from '@/service/authStorage';


type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};


const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      const storedToken = await getToken();
      setToken(storedToken);
      setLoading(false);
    }
    loadToken();
  }, []);

  async function logout() {
    await removeToken();
    setToken(null);
  }
  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );

}


export function useAuth() {
  return useContext(AuthContext);
}