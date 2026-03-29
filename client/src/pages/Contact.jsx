import { useState } from 'react';
import api, { getErrorMessage } from '../api/axios';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/contact', form);
            setSubmitted(true);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header fade-up">
                <p className="eyebrow">Get in touch</p>
                <h1>Contact Us</h1>
                <p className="page-subtitle">
                    Have a question, suggestion, or need help? We'd love to hear from you.
                </p>
            </div>

            <div className="contact-layout fade-up delay-1">
                {/* Info Panel */}
                <div className="contact-info">
                    <div className="contact-info-block">
                        <div className="contact-icon">✉</div>
                        <h3>Email</h3>
                        <p>support@eduflow.com</p>
                    </div>
                    <div className="contact-info-block">
                        <div className="contact-icon">📍</div>
                        <h3>Location</h3>
                        <p>Ratnapura, Sri Lanka</p>
                    </div>
                    <div className="contact-info-block">
                        <div className="contact-icon">🕐</div>
                        <h3>Office Hours</h3>
                        <p>Monday – Friday<br />9:00 AM – 6:00 PM</p>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="contact-form-panel glass-card">
                    {submitted ? (
                        <div className="contact-success">
                            <div className="contact-success-icon">✓</div>
                            <h2>Message Sent!</h2>
                            <p>Thank you for reaching out. We'll get back to you within 1–2 business days.</p>
                            <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <h2>Send a Message</h2>
                            <div className="contact-form-row">
                                <div className="contact-field">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="User"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="contact-field">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="user@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="contact-field">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder="How can we help?"
                                    value={form.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="contact-field">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    placeholder="Write your message here..."
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary contact-submit">
                                Send Message →
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
