import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layouts/MainLayout";         // Main Layout for authenticated users
import AuthLayout from "../layouts/AuthLayout";     // Auth Layout for login/register/forgot-password
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

// Lazy‑loaded pages
const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const CreatePost = lazy(() => import("../pages/posts/CreatePost"));
const PostDetail = lazy(() => import("../pages/posts/PostDetail"));
const EditPost = lazy(() => import("../pages/posts/EditPost"));
const SearchResults = lazy(() => import("../pages/posts/SearchResults"));
const Events = lazy(() => import("../pages/categories/Events"));
const LostAndFound = lazy(() => import("../pages/categories/LostAndFound"));
const GarageSales = lazy(() => import("../pages/categories/GarageSales"));
const Profile = lazy(() => import("../pages/user/Profile"));
const EditProfile = lazy(() => import("../pages/user/EditProfile"));
const MyPosts = lazy(() => import("../pages/user/MyPosts"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminManagePosts = lazy(() => import("../pages/admin/ManagePosts"));
const AdminReports = lazy(() => import("../pages/admin/Reports"));
const AdminUserManagement = lazy(() => import("../pages/admin/UserManagement"));
const Terms = lazy(() => import("../pages/misc/Terms"));
const NotFound = lazy(() => import("../pages/misc/NotFound"));

function AppRoutes() {
    const { currentUser, loading } = useAuth();

    const ProtectedRoute = ({ children, adminOnly = false }) => {
        if (loading) return <Loader />;

        if (!currentUser) {
            return <Navigate to="/login" replace />;
        }

        if (adminOnly && currentUser.role !== "admin") {
            return <Navigate to="/" replace />;
        }

        return children;
    };

    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Auth Routes (No Navbar/Footer) */}
                <Route element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                </Route>

                {/* Main Layout Routes (With Navbar and Footer) */}
                <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="events" element={<Events />} />
                    <Route path="lost-and-found" element={<LostAndFound />} />
                    <Route path="garage-sales" element={<GarageSales />} />
                    <Route path="posts/:id" element={<PostDetail />} />
                    <Route path="search" element={<SearchResults />} />
                    <Route path="terms" element={<Terms />} />

                    {/* Protected user routes */}
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

                    {/* Admin routes */}
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

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}

export default AppRoutes;
