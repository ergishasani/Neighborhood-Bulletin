// src/routes/AppRoutes.jsx

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useOnboarding } from "../context/OnboardingContext";
import Onboarding from "../pages/Onboarding";

// Lazy-loaded pages
const Home                = lazy(() => import("../pages/home/Home"));
const Login               = lazy(() => import("../pages/auth/Login"));
const Register            = lazy(() => import("../pages/auth/Register"));
const ForgotPassword      = lazy(() => import("../pages/auth/ForgotPassword"));
const CreatePost          = lazy(() => import("../pages/posts/CreatePost"));
const PostDetail          = lazy(() => import("../pages/posts/PostDetail"));
const EditPost            = lazy(() => import("../pages/posts/EditPost"));
const SearchResults       = lazy(() => import("../pages/posts/SearchResults"));
const Events              = lazy(() => import("../pages/categories/Events"));
const LostAndFound        = lazy(() => import("../pages/categories/LostAndFound"));
const GarageSales         = lazy(() => import("../pages/categories/GarageSales"));
const Profile             = lazy(() => import("../pages/user/Profile"));
const EditProfile         = lazy(() => import("../pages/user/EditProfile"));
const MyPosts             = lazy(() => import("../pages/user/MyPosts"));
const AdminDashboard      = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminManagePosts    = lazy(() => import("../pages/admin/ManagePosts"));
const AdminReports        = lazy(() => import("../pages/admin/Reports"));
const AdminUserManagement = lazy(() => import("../pages/admin/UserManagement"));
const Terms               = lazy(() => import("../pages/misc/Terms"));
const NotFound            = lazy(() => import("../pages/misc/NotFound"));

function AppRoutes() {
    const { currentUser, loading } = useAuth();
    const { hasOnboarded }         = useOnboarding();

    // ⚠️ QUICK HACK: let this one UID through adminOnly guards
    const HARDCODED_ADMIN_UID = "P96SuPRCKad8h8eSkvsF2LD2aew2";

    const ProtectedRoute = ({ children, adminOnly = false }) => {
        if (loading) return <Loader />;
        if (!currentUser) return <Navigate to="/login" replace />;

        // Hard-coded override for your known admin UID:
        if (adminOnly && currentUser.uid !== HARDCODED_ADMIN_UID) {
            return <Navigate to="/" replace />;
        }

        return children;
    };

    const OnboardingGuard = ({ children }) => {
        if (!hasOnboarded) {
            return <Navigate to="/onboarding" replace />;
        }
        return children;
    };

    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Onboarding */}
                <Route
                    path="/onboarding"
                    element={
                        hasOnboarded
                            ? <Navigate to="/" replace />
                            : <Onboarding />
                    }
                />

                {/* Auth pages (no navbar/footer) */}
                <Route element={<AuthLayout />}>
                    <Route path="login"           element={<Login />} />
                    <Route path="register"        element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                </Route>

                {/* Main app (requires onboarding) */}
                <Route element={<OnboardingGuard><Layout /></OnboardingGuard>}>
                    <Route index               element={<Home />} />
                    <Route path="events"       element={<Events />} />
                    <Route path="lost-and-found" element={<LostAndFound />} />
                    <Route path="garage-sales" element={<GarageSales />} />
                    <Route path="posts/:id"    element={<PostDetail />} />
                    <Route path="search"       element={<SearchResults />} />
                    <Route path="terms"        element={<Terms />} />

                    {/* User-protected */}
                    <Route
                        path="create-post"
                        element={
                            <ProtectedRoute>
                                <CreatePost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="edit-post/:id"
                        element={
                            <ProtectedRoute>
                                <EditPost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="profile/:id"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="edit-profile"
                        element={
                            <ProtectedRoute>
                                <EditProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="my-posts"
                        element={
                            <ProtectedRoute>
                                <MyPosts />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin-only */}
                    <Route
                        path="admin"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin/posts"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminManagePosts />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin/reports"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminReports />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin/users"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminUserManagement />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* 404 catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}

export default AppRoutes;
