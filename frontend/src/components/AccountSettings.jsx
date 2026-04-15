import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const AccountSettings = ({ user, token, onProfileUpdate }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        age: user?.age || '',
        specialization: user?.specialization || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Metrics logging state
    const [metricsData, setMetricsData] = useState({
        weight_kg: '',
        bmi: '',
        body_fat_pct: ''
    });
    const [metricsLoading, setMetricsLoading] = useState(false);
    const [metricsMessage, setMetricsMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.getProfile(token);
                const data = res.data;
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    age: data.age || '',
                    specialization: data.specialization || ''
                });
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        if (token) fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.updateProfile(token, formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            if (onProfileUpdate) onProfileUpdate(res.data);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async () => {
        if (!window.confirm('Are you SURE you want to deactivate your account? You will be logged out immediately and will need to sign up again to rejoin.')) return;

        setLoading(true);
        try {
            await api.leaveGym(token);
            alert('Your account has been deactivated. We are sorry to see you go!');
            if (onProfileUpdate) onProfileUpdate(null);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to process request' });
            setLoading(false);
        }
    };

    const handleMetricsChange = (e) => {
        setMetricsData({ ...metricsData, [e.target.name]: e.target.value });
    };

    const handleLogMetrics = async (e) => {
        e.preventDefault();
        setMetricsLoading(true);
        setMetricsMessage({ type: '', text: '' });
        try {
            await api.addMetric(token, metricsData);
            setMetricsMessage({ type: 'success', text: 'Health metrics logged successfully!' });
            setMetricsData({ weight_kg: '', bmi: '', body_fat_pct: '' });
        } catch (err) {
            setMetricsMessage({ type: 'error', text: err.message || 'Failed to log metrics' });
        } finally {
            setMetricsLoading(false);
        }
    };

    return (
        <div className="premium-container fade-in" style={{ paddingBottom: '5rem' }}>
            <div className="premium-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '2rem', color: 'var(--accent)', fontSize: '1.8rem' }}>Account Settings</h2>

                {message.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: message.type === 'success' ? '#10b981' : '#ef4444',
                        border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="premium-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="premium-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                className="premium-input"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Age</label>
                            <input
                                type="number"
                                name="age"
                                className="premium-input"
                                value={formData.age}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {user?.role === 'trainer' && (
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                className="premium-input"
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder="e.g. Yoga, Crossfit, Bodybuilding"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="premium-button"
                        disabled={loading}
                        style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                    >
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </form>

                {/* ── HEALTH METRICS LOGGING ────────────────────────────── */}
                {user?.role === 'member' && (
                    <div style={{ marginTop: '3rem', padding: '2rem', border: '1px solid rgba(94, 106, 210, 0.3)', borderRadius: '12px', background: 'rgba(94, 106, 210, 0.05)' }}>
                        <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Log Health Metrics</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Track your progress by logging your weight, BMI, and body fat percentage. This data will appear in your dashboard charts.
                        </p>

                        {metricsMessage.text && (
                            <div style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                backgroundColor: metricsMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: metricsMessage.type === 'success' ? '#10b981' : '#ef4444',
                                border: `1px solid ${metricsMessage.type === 'success' ? '#10b981' : '#ef4444'}`
                            }}>
                                {metricsMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleLogMetrics}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Weight (kg)</label>
                                    <input
                                        type="number"
                                        name="weight_kg"
                                        step="0.1"
                                        className="premium-input"
                                        value={metricsData.weight_kg}
                                        onChange={handleMetricsChange}
                                        placeholder="e.g. 70.5"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>BMI</label>
                                    <input
                                        type="number"
                                        name="bmi"
                                        step="0.1"
                                        className="premium-input"
                                        value={metricsData.bmi}
                                        onChange={handleMetricsChange}
                                        placeholder="e.g. 22.1"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Body Fat (%)</label>
                                    <input
                                        type="number"
                                        name="body_fat_pct"
                                        step="0.1"
                                        className="premium-input"
                                        value={metricsData.body_fat_pct}
                                        onChange={handleMetricsChange}
                                        placeholder="e.g. 15.2"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="premium-button"
                                disabled={metricsLoading}
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                            >
                                {metricsLoading ? 'Logging Metrics...' : 'Log Metrics'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── DANGER ZONE ────────────────────────────────────────── */}
                {user?.role === 'member' && (
                    <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)' }}>
                        <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Danger Zone</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Once you deactivate your account, you will no longer have access to your dashboard or workout plans. You can rejoin at any time by signing up again.
                        </p>
                        <button
                            onClick={handleDeactivate}
                            className="premium-button"
                            style={{ background: '#ef4444', width: '100%' }}
                            disabled={loading}
                        >
                            Deactivate Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountSettings;
