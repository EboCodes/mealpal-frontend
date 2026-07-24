import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function readStoredUser() {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    return stored?.token ? { ...stored, isLoggedIn: true } : { isLoggedIn: false };
  } catch {
    return { isLoggedIn: false };
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(readStoredUser);

  // Keep auth state in sync if localStorage changes in another tab
  useEffect(() => {
    const onStorage = () => setUserState(readStoredUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Call after login/signup to update both localStorage and in-app state
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUserState({ ...userData, isLoggedIn: true });
  };

  // Call on logout to clear both localStorage and in-app state
  const logout = () => {
    localStorage.removeItem("user");
    setUserState({ isLoggedIn: false });
  };

  return (
    <AuthContext.Provider value={{ user, setUser: setUserState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
