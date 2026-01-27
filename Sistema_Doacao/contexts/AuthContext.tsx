import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, removeToken } from '@/service/authStorage';


type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  userType: string | null;
  login: string | null
  loadToken: ()=>void
};


const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userType,setUserType] = useState<string | null>(null)
  const [login,setLogin] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);
  async function loadToken() {
      const storedToken = await getToken();

      setToken(storedToken.token)
      setUserType(storedToken.userType);
      setLogin(storedToken.login)
      setLoading(false);
    }
    

  useEffect(() => {
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
        userType,
        login,
        loadToken
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );

}


export function useAuth() {
  return useContext(AuthContext);
}