import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/axios';
import Alert from '../components/Alert';
import { useAuth } from '../context/useAuth';
import { getAssetUrl } from '../utils/media';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [profileForm, setProfileForm] = useState({ name: '', email: '', profile_image: null });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/auth/me');
                setProfileForm({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    profile_image: null
                });
                setImagePreview(res.data.profile_image ? getAssetUrl(res.data.profile_image) : '');
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, []);

    useEffect(() => {
        if (!profileForm.profile_image) {
            return undefined;
        }

        const objectUrl = URL.createObjectURL(profileForm.profile_image);
        setImagePreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [profileForm.profile_image]);

    const handleProfileChange = (e) => {
        const { name, value, files } = e.target;
        setProfileForm((current) => ({
            ...current,
            [name]: name === 'profile_image' ? files[0] : value
        }));
    };

    const handlePasswordChange = (e) => {
        setPasswordForm((current) => ({ ...current, [e.target.name]: e.target.value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        setMessage('');
        setErrorMessage('');

        try {
            const payload = new FormData();
            payload.append('name', profileForm.name);
            payload.append('email', profileForm.email);
            if (profileForm.profile_image) {
                payload.append('profile_image', profileForm.profile_image);
            }

            const res = await api.put('/auth/me', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser(res.data.user);
            setProfileForm((current) => ({ ...current, profile_image: null }));
            setImagePreview(res.data.user.profile_image ? getAssetUrl(res.data.user.profile_image) : '');
            setMessage('Profile updated successfully');
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSavingPassword(true);
        setMessage('');
        setErrorMessage('');

        try {
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setErrorMessage('New passwords do not match');
                return;
            }

            await api.put('/auth/me/password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setMessage('Password updated successfully');
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Profile</p>
                <h2>Manage your account details.</h2>
                <p className="page-subtitle">
                    Update your name, email, and password from one place.
                </p>
            </div>

            <Alert type="success" message={message} />
            <Alert type="error" message={errorMessage} />

            <div className="profile-layout">
                <div className="profile-summary">
                    {imagePreview ? (
                        <img src={imagePreview} alt={user?.name || 'Profile'} className="profile-image" />
                    ) : (
                        <span className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                    <h3>{user?.name || 'User'}</h3>
                    <p>{user?.email}</p>
                    <span className="meta-pill">{user?.role || 'student'}</span>
                </div>

                <div className="profile-forms">
                    <form className="admin-form" onSubmit={handleProfileSubmit}>
                        <h3>Profile Details</h3>
                        {loading ? (
                            <div className="loading-panel"></div>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={profileForm.name}
                                    onChange={handleProfileChange}
                                    required
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={profileForm.email}
                                    onChange={handleProfileChange}
                                    required
                                />

                                <input
                                    type="file"
                                    name="profile_image"
                                    accept="image/*"
                                    onChange={handleProfileChange}
                                />

                                <div className="admin-form-actions">
                                    <button type="submit" className="btn-primary" disabled={savingProfile}>
                                        {savingProfile ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    <form className="admin-form" onSubmit={handlePasswordSubmit}>
                        <h3>Change Password</h3>
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Current Password"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            required
                        />

                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />

                        <div className="admin-form-actions">
                            <button type="submit" className="btn-primary" disabled={savingPassword}>
                                {savingPassword ? 'Saving...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
