import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { loginUser, registerUser, logoutUser } from "../services/authService";

interface AuthContextType {
    user: any;
    loginUser: (email: string, password: string) => void;
    registerUser: (email: string, password: string) => void;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ user, setUser ] = useState<any>(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return unsubscribe
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
    
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};