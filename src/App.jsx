import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/page";
import History from "./pages/history/page";
import Task from "./pages/tasks/page";
import Login from "./pages/auth/Login";
import { useAuth } from "./context/authContext";
import Navbar from "./components/Navbar/page";
// import { RiLoader4Fill } from "react-icons/ri";
import { TbLoader2 } from "react-icons/tb";

const App = () => {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();
  // const isAuthenticated = true;
  // const isLoading = true

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
      </div>
    </div>
  );
};

export default App;
