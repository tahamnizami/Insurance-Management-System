import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  loginAdmin,
  type AdminLoginResponse,
  type AdminUser,
} from "../api/authApi";

const ACCESS_TOKEN_KEY = "admin_access_token";
const ADMIN_USER_KEY = "admin_user";

type StorageType = "local" | "session";

interface AuthContextValue {
  admin: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    keepLoggedIn: boolean,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredAuth() {
  for (const storageType of ["local", "session"] as const) {
    const storage = storageType === "local" ? localStorage : sessionStorage;
    const accessToken = storage.getItem(ACCESS_TOKEN_KEY);
    const storedAdmin = storage.getItem(ADMIN_USER_KEY);

    if (accessToken && storedAdmin) {
      try {
        return {
          accessToken,
          admin: JSON.parse(storedAdmin) as AdminUser,
        };
      } catch {
        storage.removeItem(ACCESS_TOKEN_KEY);
        storage.removeItem(ADMIN_USER_KEY);
      }
    }
  }

  return { accessToken: null, admin: null };
}

function clearStoredAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
}

function storeAuth(
  response: AdminLoginResponse,
  storageType: StorageType,
) {
  clearStoredAuth();
  const storage = storageType === "local" ? localStorage : sessionStorage;
  storage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
  storage.setItem(ADMIN_USER_KEY, JSON.stringify(response.admin));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ accessToken, admin }, setAuth] = useState(readStoredAuth);

  const login = async (
    email: string,
    password: string,
    keepLoggedIn: boolean,
  ) => {
    const response = await loginAdmin({ email, password });
    storeAuth(response, keepLoggedIn ? "local" : "session");
    setAuth(response);
  };

  const logout = () => {
    clearStoredAuth();
    setAuth({ accessToken: null, admin: null });
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        accessToken,
        isAuthenticated: Boolean(accessToken && admin),
        isLoading: false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
