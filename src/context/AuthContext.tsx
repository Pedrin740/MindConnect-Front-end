import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de AuthProvider."
    );
  }

  return context;
}