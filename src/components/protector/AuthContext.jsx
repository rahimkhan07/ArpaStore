import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig.jsx";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // wait for Firebase to resolve

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
