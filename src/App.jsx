import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import Navbar from "./components/Navbar/page";
import { TbLoader2 } from "react-icons/tb";

// Lazy-loaded components
const Home = lazy(() => import("./pages/home/page"));
const History = lazy(() => import("./pages/history/page"));
const Task = lazy(() => import("./pages/tasks/page"));
const Login = lazy(() => import("./pages/auth/Login"));

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-[100vw] h-screen flex items-center justify-center">
        <TbLoader2 className="text-[8vw] animate-spin bg-black/10 opacity-60" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      {isAuthenticated === true && <Navbar />}{" "}
      {/* Show Navbar only if authenticated */}
      <div className="w-full mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/history"
              element={isAuthenticated ? <History /> : <Navigate to="/login" />}
            />
            <Route
              path="/task"
              element={isAuthenticated ? <Task /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default App;
