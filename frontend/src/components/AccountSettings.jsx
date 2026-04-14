import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const AccountSettings = ({ user, token, onProfileUpdate }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        age: user?.age || '',
        specialization: user?.specialization || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.getProfile(token);
                const data = res.data;
                setFormData({
                    name: data.name || '',
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

    return (
        <div className="premium-container fade-in" style={{ maxWidth: '600px' }}>
            <div className="premium-card">
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
                            className="premium-input"
                            value={user?.email || ''}
                            disabled
                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                        <small style={{ color: '#64748b' }}>Email cannot be changed contact admin.</small>
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
            </div>
        </div>
    );
};

export default AccountSettings;
