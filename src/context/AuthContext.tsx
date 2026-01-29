import { createContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  handleLogin: (token: string | null, email: string | null, isPartner: boolean | null) => void;
  isAuthenticated: boolean;
  email: string | null;
  isPartner: boolean;
  handleLogout: () => void;
  isLoading: boolean; // Dodajemy informację o ładowaniu
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));
  const [isPartner, setIsPartner] = useState<boolean>(localStorage.getItem("isPartner") === "true");
  const [isLoading, setIsLoading] = useState(true); 

useEffect(() => {
  const initAuth = async () => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setIsLoading(false);
  };

  initAuth();
}, [token]);

  const handleLogin = (newToken: string | null, newEmail: string | null, newIsPartner: boolean | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setToken(null);
    }
    
    if (newEmail) {
      localStorage.setItem("email", newEmail);
      setEmail(newEmail);
    } else {
      localStorage.removeItem("email");
      setEmail(null);
    }
    
    if (newIsPartner !== null) {
      localStorage.setItem("isPartner", newIsPartner ? "true" : "false");
      setIsPartner(newIsPartner);
    } else {
      localStorage.removeItem("isPartner");
      setIsPartner(false);
    }
  };

  const handleLogout = () => {
    handleLogin(null, null, null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        handleLogin,
        isAuthenticated: !!token,
        email,
        isPartner,
        handleLogout,
        isLoading, // Udostępniamy stan ładowania
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };