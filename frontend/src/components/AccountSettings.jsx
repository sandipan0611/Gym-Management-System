import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const AccountSettings = ({ token, user, onProfileUpdate }) => {
    const [profileStatus, setProfileStatus] = useState('');
    const [profileForm, setProfileForm] = useState({ name: '', phone: '', age: '' });
    const [metricsStatus, setMetricsStatus] = useState('');
    const [metricsForm, setMetricsForm] = useState({ weight_kg: '', bmi: '', body_fat_pct: '' });

    // Load current profile on mount
    useEffect(() => {
        if (!token) return;
        api.getProfile(token)
            .then(res => setProfileForm({
                name: res.data.name || '',
                phone: res.data.phone || '',
                age: res.data.age || ''
            }))
            .catch(err => console.error('Could not load profile', err));
    }, [token]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileStatus('saving');
        try {
            const res = await api.updateProfile(token, profileForm);
            setProfileStatus('success');
            if (onProfileUpdate) onProfileUpdate(res.data);
            setTimeout(() => setProfileStatus(''), 3000);
        } catch (err) {
            setProfileStatus('error:' + (err.message || 'Update failed'));
        }
    };

    const handleAddMetric = async (e) => {
        e.preventDefault();
        setMetricsStatus('saving');
        try {
            await api.addMetric(token, metricsForm);
            setMetricsStatus('success');
            setMetricsForm({ weight_kg: '', bmi: '', body_fat_pct: '' });
            setTimeout(() => setMetricsStatus(''), 3000);
        } catch (err) {
            setMetricsStatus('error:' + (err.message || 'Failed to log metrics'));
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const currentPassword = e.target.currentPassword.value;
        const newPassword = e.target.newPassword.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            return alert('New passwords do not match!');
        }
        try {
            const res = await api.changePassword(token, currentPassword, newPassword);
            alert(res.message);
            e.target.reset();
        } catch (err) {
            alert(err.message || 'Error changing password');
        }
    };

    const cardStyle = {
        background: 'rgba(21, 24, 40, 0.85)',
        backdropFilter: 'blur(10px)'
    };

    const statusMessage = (status, successMsg = 'Saved successfully!') => {
        if (!status) return null;
        if (status === 'saving') return (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Saving…</p>
        );
        if (status === 'success') return (
            <p style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '0.5rem' }}>✓ {successMsg}</p>
        );
        return (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{status.replace('error:', '')}</p>
        );
    };

    return (
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--text-main)' }}>Account Settings</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* ── Edit Profile ─────────────────────────────────── */}
                <div className="premium-card" style={cardStyle}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Edit Profile</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        Update your display name, phone number, and age.
                    </p>
                    <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Full Name</label>
                            <input
                                className="premium-input"
                                style={{ marginBottom: 0 }}
                                value={profileForm.name}
                                onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Phone</label>
                                <input
                                    className="premium-input"
                                    style={{ marginBottom: 0 }}
                                    value={profileForm.phone}
                                    onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Age</label>
                                <input
                                    type="number"
                                    className="premium-input"
                                    style={{ marginBottom: 0 }}
                                    value={profileForm.age}
                                    onChange={e => setProfileForm(p => ({ ...p, age: e.target.value }))}
                                    placeholder="25"
                                    min="10" max="120"
                                />
                            </div>
                        </div>
                        <button type="submit" className="premium-button" style={{ marginTop: '0.25rem' }}
                            disabled={profileStatus === 'saving'}>
                            Save Profile
                        </button>
                        {statusMessage(profileStatus, 'Profile updated!')}
                    </form>
                </div>

                {/* ── Change Password ───────────────────────────────── */}
                <div className="premium-card" style={cardStyle}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Change Password</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        For security, your current password is required.
                    </p>
                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input name="currentPassword" type="password" placeholder="Current Password" className="premium-input" style={{ marginBottom: 0 }} required />
                        <input name="newPassword" type="password" placeholder="New Password" className="premium-input" style={{ marginBottom: 0 }} required />
                        <input name="confirmPassword" type="password" placeholder="Confirm New Password" className="premium-input" style={{ marginBottom: 0 }} required />
                        <button type="submit" className="premium-button" style={{ marginTop: '0.25rem' }}>Update Password</button>
                    </form>
                </div>

                {/* ── Log Health Metrics (member only) ─────────────── */}
                {user?.role === 'member' && (
                    <div className="premium-card" style={cardStyle}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Log Health Metrics</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Track your weight, BMI, and body fat over time. Leave blank to skip a field.
                        </p>
                        <form onSubmit={handleAddMetric} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="premium-input"
                                    style={{ marginBottom: 0 }}
                                    value={metricsForm.weight_kg}
                                    onChange={e => setMetricsForm(p => ({ ...p, weight_kg: e.target.value }))}
                                    placeholder="e.g. 72.5"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>BMI</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="premium-input"
                                        style={{ marginBottom: 0 }}
                                        value={metricsForm.bmi}
                                        onChange={e => setMetricsForm(p => ({ ...p, bmi: e.target.value }))}
                                        placeholder="e.g. 23.4"
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Body Fat %</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="premium-input"
                                        style={{ marginBottom: 0 }}
                                        value={metricsForm.body_fat_pct}
                                        onChange={e => setMetricsForm(p => ({ ...p, body_fat_pct: e.target.value }))}
                                        placeholder="e.g. 18.2"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="premium-button"
                                style={{ marginTop: '0.25rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                                disabled={metricsStatus === 'saving'}>
                                Log Entry
                            </button>
                            {statusMessage(metricsStatus, 'Metrics logged! Check your dashboard.')}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountSettings;
