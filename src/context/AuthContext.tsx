import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// 1. Definiujemy, co siedzi w naszym Tokenie (to zależy od Backendu)
interface UserToken {
  sub: string; // zazwyczaj email lub ID
  email: string;
  role: string;
  exp: number; // data wygaśnięcia
}

// 2. Definiujemy, co nasz "Mózg" udostępnia reszcie aplikacji
interface AuthContextType {
  user: UserToken | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserToken | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  // Funkcja, która uruchamia się raz przy starcie aplikacji
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<UserToken>(token);
        // Sprawdzamy czy token nie wygasł
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
          // Ustawiamy token w axiosie, żeby każde zapytanie go miało
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        logout();
      }
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    // Axios i User zaktualizują się w useEffect
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Własny hook, żeby łatwiej używać tego w komponentach
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
