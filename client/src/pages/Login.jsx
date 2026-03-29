import { useState } from 'react';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { homepageImages } from '../utils/media';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const res = await api.post('/auth/login', form);
            login(res.data);
            navigate('/');
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-layout">
                <div className="auth-panel fade-up">
                    <p className="eyebrow">Sign in</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h2>Welcome back to your learning workspace.</h2>
                        <p className="auth-copy">
                            Access your enrolled courses, resume lessons, and keep your progress moving.
                        </p>

                        <Alert type="error" message={errorMessage} />

                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <div className="auth-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Signing in...' : 'Login'}
                            </button>
                            <Link to="/register" className="btn-ghost">Create account</Link>
                        </div>
                    </form>
                </div>

                <div className="auth-panel auth-side fade-up delay-1">
                    <p className="eyebrow">Welcome back</p>
                    <h3>Continue learning from where you left off.</h3>
                    <p>
                        Sign in to access your courses, watch lessons, and keep your progress moving forward.
                    </p>
                    <img src={homepageImages.auth} alt="Students studying together" />
                </div>
            </div>
        </div>
    );
};

export default Login;
