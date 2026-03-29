import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import MyLearning from './pages/MyLearning';
import WatchLesson from './pages/WatchLesson';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import AdminLessons from './pages/AdminLessons';
import AdminUsers from './pages/AdminUsers';
import AdminMessages from './pages/AdminMessages';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import { useAuth } from './context/useAuth';

const HomeRedirect = () => {
    const { user } = useAuth();
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Home />;
};

function App() {
    return (
        <BrowserRouter>
            <div className="app-shell">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomeRedirect />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetails />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/my-learning"
                        element={
                            <ProtectedRoute>
                                <MyLearning />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/watch/:id"
                        element={
                            <ProtectedRoute>
                                <WatchLesson />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/courses"
                        element={
                            <AdminRoute>
                                <AdminCourses />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/lessons"
                        element={
                            <AdminRoute>
                                <AdminLessons />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <AdminRoute>
                                <AdminUsers />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/messages"
                        element={
                            <AdminRoute>
                                <AdminMessages />
                            </AdminRoute>
                        }
                    />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
