import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MovieDetails from "./pages/MovieDetails";
import Search from "./pages/Search";
import MyList from "./pages/MyList";
import Profile from "./pages/Profile";
import Genres from "./pages/Genres";
import GenrePage from "./pages/GenrePage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import { useAuth } from "./context/AuthContext";
import { Spinner } from "./components/Spinner";

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center"><Spinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Protected><Home /></Protected>} />
          <Route path="/browse/:type" element={<Protected><Browse /></Protected>} />
          <Route path="/movie/:id" element={<Protected><MovieDetails /></Protected>} />
          <Route path="/search" element={<Protected><Search /></Protected>} />
          <Route path="/my-list" element={<Protected><MyList /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/genres" element={<Protected><Genres /></Protected>} />
          <Route path="/genres/:id" element={<Protected><GenrePage /></Protected>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
