import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const firebaseConfig = useMemo(
    () => ({
      apiKey: "AIzaSyBowObAEhkBASpGkLbCRINJVpX_6jnCets",
      authDomain: "indohype-657ae.firebaseapp.com",
      projectId: "indohype-657ae",
      storageBucket: "indohype-657ae.appspot.com",
      messagingSenderId: "591593411648",
      appId: "1:591593411648:web:6d29d24ca260b4cda83ba5",
      measurementId: "G-H0VCJ8MBC7",
    }),
    [] // Empty dependency array since it doesn't depend on any other props or state
  );

  useEffect(() => {
    const app = initializeApp(firebaseConfig); // Initialize Firebase app

    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [firebaseConfig]);

  const value = {
    user,
    isAuthenticated: user !== null,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
