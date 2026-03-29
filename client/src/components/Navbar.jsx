import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const getNavClassName = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;

    return (
        <header className="site-header">
            <nav className="navbar">
                <div className="navbar-inner fade-up">
                    <NavLink to="/" className="nav-brand">
                        <img src="/logo.png" alt="EduFlow Logo" className="nav-logo-img" />
                        <span className="nav-logo">EduFlow</span>
                    </NavLink>

                    <button
                        className="nav-hamburger"
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(o => !o)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
                        {user?.role !== 'admin' && (
                            <NavLink to="/" className={getNavClassName} onClick={() => setMenuOpen(false)}>Home</NavLink>
                        )}
                        <NavLink to="/courses" className={getNavClassName} onClick={() => setMenuOpen(false)}>Courses</NavLink>

                        {user && <NavLink to="/profile" className={getNavClassName} onClick={() => setMenuOpen(false)}>Profile</NavLink>}

                        {user && user.role !== 'admin' && (
                            <NavLink to="/my-learning" className={getNavClassName} onClick={() => setMenuOpen(false)}>My Learning</NavLink>
                        )}

                        {user?.role === 'admin' && (
                            <>
                                <NavLink to="/admin" end className={getNavClassName} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                                <NavLink to="/admin/courses" className={getNavClassName} onClick={() => setMenuOpen(false)}>Courses</NavLink>
                                <NavLink to="/admin/lessons" className={getNavClassName} onClick={() => setMenuOpen(false)}>Lessons</NavLink>
                                <NavLink to="/admin/users" className={getNavClassName} onClick={() => setMenuOpen(false)}>Users</NavLink>
                            </>
                        )}

                        {!user ? (
                            <>
                                <NavLink to="/login" className={getNavClassName} onClick={() => setMenuOpen(false)}>Login</NavLink>
                                <NavLink to="/register" className={getNavClassName} onClick={() => setMenuOpen(false)}>Register</NavLink>
                            </>
                        ) : (
                            <button onClick={() => { logout(); setMenuOpen(false); }} className="nav-logout">Logout</button>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
