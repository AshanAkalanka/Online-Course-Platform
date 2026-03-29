import { useState } from 'react';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { homepageImages } from '../utils/media';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const res = await api.post('/auth/register', form);
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
                    <p className="eyebrow">Get started</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h2>Create your EduFlow account.</h2>
                        <p className="auth-copy">
                            Join the platform, enroll in courses, and start learning with guided lessons.
                        </p>

                        <Alert type="error" message={errorMessage} />

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
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
                                {loading ? 'Creating account...' : 'Register'}
                            </button>
                            <Link to="/login" className="btn-ghost">Already have an account?</Link>
                        </div>
                    </form>
                </div>

                <div className="auth-panel auth-side fade-up delay-1">
                    <p className="eyebrow">Start today</p>
                    <h3>Create your account and begin your learning journey.</h3>
                    <p>
                        Discover courses, build new skills, and track your progress as you complete each lesson.
                    </p>
                    <img src={homepageImages.auth} alt="Online learning collaboration" />
                </div>
            </div>
        </div>
    );
};

export default Register;
