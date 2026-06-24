import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  readAuthFromStorage,
  writeAuthToStorage,
  clearAuthStorage,
  setUnauthorizedHandler,
  AUTH_SESSION_EXPIRED_MESSAGE,
} from "./authSession";

export interface LogoutOptions {
  /** Gdzie przekierować po wylogowaniu. null = bez przekierowania */
  redirectTo?: string | null;
  /** Komunikat pokazany na stronie logowania (np. wygasła sesja) */
  message?: string;
}

interface AuthContextType {
  token: string | null;
  handleLogin: (
    token: string | null,
    email: string | null,
    isPartner: boolean | null,
  ) => void;
  isAuthenticated: boolean;
  email: string | null;
  isPartner: boolean;
  handleLogout: (options?: LogoutOptions) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const initial = readAuthFromStorage();

  const [token, setToken] = useState<string | null>(initial.token);
  const [email, setEmail] = useState<string | null>(initial.email);
  const [isPartner, setIsPartner] = useState<boolean>(initial.isPartner);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const syncAuthState = useCallback(
    (
      newToken: string | null,
      newEmail: string | null,
      newIsPartner: boolean | null,
    ) => {
      writeAuthToStorage(newToken, newEmail, newIsPartner);
      setToken(newToken);
      setEmail(newEmail);
      setIsPartner(newIsPartner ?? false);
    },
    [],
  );

  const handleLogin = useCallback(
    (
      newToken: string | null,
      newEmail: string | null,
      newIsPartner: boolean | null,
    ) => {
      syncAuthState(newToken, newEmail, newIsPartner);
    },
    [syncAuthState],
  );

  const handleLogout = useCallback(
    (options?: LogoutOptions) => {
      clearAuthStorage();
      setToken(null);
      setEmail(null);
      setIsPartner(false);

      const redirectTo =
        options?.redirectTo === undefined ? "/login" : options.redirectTo;

      if (redirectTo) {
        navigate(redirectTo, {
          replace: true,
          state: options?.message ? { authMessage: options.message } : undefined,
        });
      }
    },
    [navigate],
  );

  useEffect(() => {
    setUnauthorizedHandler((message) => {
      handleLogout({
        redirectTo: "/login",
        message: message || AUTH_SESSION_EXPIRED_MESSAGE,
      });
    });

    return () => setUnauthorizedHandler(null);
  }, [handleLogout]);

  return (
    <AuthContext.Provider
      value={{
        token,
        handleLogin,
        isAuthenticated: !!token,
        email,
        isPartner,
        handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
