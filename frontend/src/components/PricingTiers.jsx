import React from 'react';

const PricingTiers = ({ plans, user, setShowSignup, setCurrentPage, handleJoinPlan, handleUpdatePlan, publicTrainers = [] }) => {
    const activeTrainers = publicTrainers.filter(t => t.status === 'active');

    return (
        <div className="premium-container fade-in" style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Membership Pricing</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1rem' }}>
                Choose the plan that fits your goals. All plans include full gym access.
            </p>

            {/* ── Pricing Cards ───────────────────────────────────── */}
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {plans.length > 0 ? plans.map((p, idx) => (
                    <div key={p.id} className="premium-card" style={{
                        width: '300px',
                        textAlign: 'center',
                        background: idx === 1 ? 'rgba(94,106,210,0.18)' : 'rgba(21, 24, 40, 0.85)',
                        backdropFilter: 'blur(10px)',
                        border: idx === 1 ? '1px solid rgba(94,106,210,0.5)' : undefined,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {idx === 1 && (
                            <div style={{
                                position: 'absolute', top: '16px', right: '-28px',
                                background: 'var(--accent)', color: '#fff',
                                fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 2.5rem',
                                transform: 'rotate(45deg)', letterSpacing: '1px'
                            }}>POPULAR</div>
                        )}
                        <h2 style={{ marginBottom: '0.25rem' }}>{p.name}</h2>
                        <h1 style={{ margin: '1rem 0' }}>
                            ₹{Math.floor(p.price)}
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {p.duration_months} mo</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6', fontSize: '0.9rem' }}>{p.description}</p>
                        {user && user.role === 'admin' ? (
                            <button className="premium-button" style={{ width: '100%' }} onClick={() => {
                                const newPrice = prompt('Enter new price', p.price);
                                if (newPrice && !isNaN(newPrice)) handleUpdatePlan(p.id, newPrice);
                            }}>Edit Price</button>
                        ) : user && user.role === 'trainer' ? null : (
                            <button className="premium-button" style={{ width: '100%' }} onClick={() => {
                                if (!user) { setShowSignup(true); setCurrentPage('login'); }
                                else { handleJoinPlan(p.id, p.name); }
                            }}>Join Now</button>
                        )}
                    </div>
                )) : <p style={{ color: 'var(--text-muted)' }}>Connecting to database server…</p>}
            </div>

            {/* ── Trainer Showcase ─────────────────────────────────── */}
            {activeTrainers.length > 0 && (
                <div style={{ marginTop: '5rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Meet Our Trainers</h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                        Our certified professionals are here to guide your fitness journey.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                        {activeTrainers.map(t => {
                            const initials = t.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                            const hue = (t.user_id * 47) % 360;
                            return (
                                <div key={t.user_id} className="premium-card" style={{
                                    background: 'rgba(21, 24, 40, 0.85)',
                                    backdropFilter: 'blur(10px)',
                                    textAlign: 'center',
                                    padding: '1.5rem'
                                }}>
                                    {/* Avatar */}
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '50%',
                                        background: `hsl(${hue}, 60%, 40%)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1rem',
                                        fontSize: '1.2rem', fontWeight: 800, color: '#fff'
                                    }}>
                                        {initials}
                                    </div>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>{t.name}</h3>
                                    <span style={{
                                        display: 'inline-block',
                                        background: `rgba(${hue},106,210,0.15)`,
                                        color: `hsl(${hue}, 70%, 65%)`,
                                        fontSize: '0.72rem',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '20px',
                                        fontWeight: 600,
                                        marginTop: '0.25rem',
                                        border: `1px solid hsl(${hue},60%,30%)`
                                    }}>
                                        {t.specialization || 'General Fitness'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingTiers;
