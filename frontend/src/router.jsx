import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkoutSchedule from "./pages/WorkoutSchedule";
import NutritionPage from "./pages/Nutrition";
import ProgressTracking from "./pages/ProgressTracking";
import LandingPage from "./pages/LandingPage";

const RouteWrapper = ({ children }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={
                        <RouteWrapper>
                            <Login />
                        </RouteWrapper>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <RouteWrapper>
                            <Register />
                        </RouteWrapper>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <RouteWrapper>
                            <Dashboard />
                        </RouteWrapper>
                    }
                />
                <Route
                    path="/schedule"
                    element={
                        <RouteWrapper>
                            <WorkoutSchedule />
                        </RouteWrapper>
                    }
                />
                <Route
                    path="/nutrition"
                    element={
                        <RouteWrapper>
                            <NutritionPage />
                        </RouteWrapper>
                    }
                />
                <Route
                    path="/progress"
                    element={
                        <RouteWrapper>
                            <ProgressTracking />
                        </RouteWrapper>
                    }
                />
                <Route
                    path="/"
                    element={
                        <RouteWrapper>
                            <LandingPage />
                        </RouteWrapper>
                    }
                />
                <Route
                    path="*"
                    element={
                        <RouteWrapper>
                            <h1 className="text-center text-2xl">404 - Page Not Found</h1>
                        </RouteWrapper>
                    }
                ></Route>
            </Routes>
        </BrowserRouter>
    );
}
