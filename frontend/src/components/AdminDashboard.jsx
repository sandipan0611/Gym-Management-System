import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    AreaChart, Area, Legend
} from 'recharts';
import * as api from '../services/api';

/* ── Shared styles ──────────────────────────────────────────────────── */
const CHART_COLORS = {
    accent: '#5e6ad2',
    green: '#10b981',
    amber: '#f59e0b',
    pink: '#ec4899',
    muted: '#9ca3af'
};

const tooltipStyle = {
    backgroundColor: 'rgba(21,24,40,0.97)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#f3f4f6',
    fontSize: '0.85rem'
};

const SectionBadge = ({ label, color = 'var(--accent)' }) => (
    <span style={{
        background: `rgba(${color === 'var(--accent)' ? '94,106,210' : '16,185,129'},0.15)`,
        color,
        fontSize: '0.75rem',
        padding: '0.25rem 0.6rem',
        borderRadius: '20px',
        fontWeight: 600
    }}>{label}</span>
);

const ChartCard = ({ title, badge, children }) => (
    <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>{title}</h3>
            {badge}
        </div>
        {children}
    </div>
);

/* ── Revenue by Plan Bar Chart ──────────────────────────────────────── */
const RevenueByPlanChart = ({ data }) => {
    if (!data?.length) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>No revenue data yet.</p>;
    const colors = [CHART_COLORS.accent, CHART_COLORS.green, CHART_COLORS.amber, CHART_COLORS.pink];
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${v}`, 'Revenue']} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Revenue">
                    {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

/* ── Attendance Trend Area Chart ────────────────────────────────────── */
const AttendanceTrendChart = ({ data }) => {
    if (!data?.length) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>No attendance data for the last 30 days.</p>;
    return (
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="visits" stroke={CHART_COLORS.accent} fill="url(#attendGrad)" strokeWidth={2} name="Check-ins" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

/* ── Trainer Load Horizontal Bar Chart ──────────────────────────────── */
const TrainerLoadChart = ({ data }) => {
    if (!data?.length) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>No trainer data.</p>;
    return (
        <ResponsiveContainer width="100%" height={Math.max(160, data.length * 44)}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="trainer_name" tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Members']} />
                <Bar dataKey="count" fill={CHART_COLORS.green} radius={[0, 4, 4, 0]} name="Members" />
            </BarChart>
        </ResponsiveContainer>
    );
};

/* ── Peak Hours Area Chart ──────────────────────────────────────────── */
const PeakHoursChart = ({ data }) => {
    if (!data?.length) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>No hourly data yet.</p>;

    const formatted = data.map(d => ({
        ...d,
        label: d.hour < 12
            ? `${d.hour === 0 ? 12 : d.hour}am`
            : `${d.hour === 12 ? 12 : d.hour - 12}pm`
    }));

    return (
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.amber} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={CHART_COLORS.amber} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Check-ins']} />
                <Area type="monotone" dataKey="count" stroke={CHART_COLORS.amber} fill="url(#peakGrad)" strokeWidth={2} name="Check-ins" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

/* ── Main Component ─────────────────────────────────────────────────── */
const AdminDashboard = ({
    adminStats, trainers, members, allWorkouts,
    handleHireTrainer, handleFireTrainer, handleReplaceTrainer, handleAssignMember,
    token
}) => {
    const [suggestedTrainer, setSuggestedTrainer] = useState(null);
    const [membersOpen, setMembersOpen] = useState(false);
    const [trainersOpen, setTrainersOpen] = useState(true);

    useEffect(() => {
        if (!token) return;
        api.getSuggestedTrainer(token)
            .then(res => setSuggestedTrainer(res.data))
            .catch(() => {});
    }, [token, trainers]);

    const CollapsibleHeader = ({ title, isOpen, toggle, count }) => (
        <div 
            onClick={toggle}
            style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1.25rem', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                cursor: 'pointer',
                marginTop: '1.5rem',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                userSelect: 'none'
            }}
            className="collapsible-header"
        >
            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {title} 
                <span style={{ fontSize: '0.75rem', background: 'var(--accent)', color: '#fff', padding: '0.15rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>{count}</span>
            </h3>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s ease' }}>▲</span>
        </div>
    );

    return (
        <div className="premium-container fade-in" style={{ paddingBottom: '5rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 800 }}>
                {adminStats ? 'Admin Dashboard' : 'Management'}
            </h1>

            {adminStats ? (
                <>
                    {/* ── KPI Stats Row ────────────────────────────── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {[
                            { label: 'Total Revenue', value: `₹${Number(adminStats.revenue).toLocaleString('en-IN')}`, color: 'var(--accent)' },
                            { label: 'MRR (This Month)', value: `₹${Number(adminStats.mrr || 0).toLocaleString('en-IN')}`, color: '#10b981' },
                            { label: 'Total Members', value: adminStats.population.members, color: 'var(--text-main)' },
                            { label: 'Active Trainers', value: adminStats.population.trainers, color: 'var(--text-main)' }
                        ].map(stat => (
                            <div key={stat.label} className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)', padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{stat.label}</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Expiring Soon Alert ──────────────────────── */}
                    {adminStats.expiringSoon?.length > 0 && (
                        <div style={{
                            background: 'rgba(245,158,11,0.1)',
                            border: '1px solid rgba(245,158,11,0.4)',
                            borderRadius: '12px',
                            padding: '1.25rem 1.5rem',
                            marginBottom: '2.5rem'
                        }}>
                            <h4 style={{ color: '#f59e0b', marginBottom: '0.75rem' }}>⚠️ Subscriptions Expiring Soon ({adminStats.expiringSoon.length})</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {adminStats.expiringSoon.map((m, i) => (
                                    <span key={i} style={{
                                        background: 'rgba(245,158,11,0.15)',
                                        color: '#f59e0b',
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {m.member_name} · {m.days_left}d left
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Intelligence Charts ──────────────────────── */}
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>📊 Intelligence Layer</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                        <ChartCard title="Revenue by Plan" badge={<SectionBadge label="Active Subs" />}>
                            <RevenueByPlanChart data={adminStats.revenueByPlan} />
                        </ChartCard>

                        <ChartCard title="Attendance Trend (30d)" badge={<SectionBadge label="Daily" />}>
                            <AttendanceTrendChart data={adminStats.attendanceTrend} />
                        </ChartCard>

                        <ChartCard title="Trainer Load" badge={<SectionBadge label="Members" color="#10b981" />}>
                            <TrainerLoadChart data={adminStats.trainerLoad} />
                        </ChartCard>

                        <ChartCard title="Peak Gym Hours" badge={<SectionBadge label="Check-ins" color="#10b981" />}>
                            <PeakHoursChart data={adminStats.peakHours} />
                        </ChartCard>
                    </div>

                    {/* ── Member Assignments Table ─────────────────── */}
                    <h3>Active Member Assignments</h3>
                    <div className="premium-card" style={{ marginTop: '1rem', overflowX: 'auto', background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                                    <th style={{ padding: '1rem' }}>Member</th>
                                    <th style={{ padding: '1rem' }}>Assigned Trainer</th>
                                    <th style={{ padding: '1rem' }}>Workout Routine</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...adminStats.assignments].sort((a, b) => {
                                    const tA = a.trainer_name || 'ZZZ';
                                    const tB = b.trainer_name || 'ZZZ';
                                    const tSort = tA.localeCompare(tB, undefined, { numeric: true });
                                    if (tSort !== 0) return tSort;
                                    return (a.member_name || '').localeCompare(b.member_name || '', undefined, { numeric: true });
                                }).map(a => (
                                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{a.member_name}</td>
                                        <td style={{ padding: '1rem', color: a.trainer_name ? 'var(--accent)' : 'var(--text-muted)' }}>{a.trainer_name || 'Not Assigned'}</td>
                                        <td style={{ padding: '1rem' }}>{a.workout_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : <p style={{ color: 'var(--text-muted)' }}>Loading management data...</p>}
            
            <div style={{ marginTop: '2rem' }}>
                {/* ── MEMBER DETAILS (Collapsible) ─────────────────────────────────── */}
                <CollapsibleHeader 
                    title="Member Details" 
                    isOpen={membersOpen} 
                    toggle={() => setMembersOpen(!membersOpen)} 
                    count={members.length} 
                />
                
                {membersOpen && (
                    <div className="premium-card fade-in" style={{ padding: 0, overflow: 'hidden', marginTop: '1rem', background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Name</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Email</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Phone</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Age</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...members].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })).map(m => (
                                        <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem', fontWeight: 600 }}>{m.name}</td>
                                            <td style={{ padding: '1rem', color: 'var(--accent)' }}>{m.email}</td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{m.phone || 'N/A'}</td>
                                            <td style={{ padding: '1rem' }}>{m.age || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── TRAINER DETAILS (Collapsible) ───────────────────────────────── */}
                <CollapsibleHeader 
                    title="Trainer Details" 
                    isOpen={trainersOpen} 
                    toggle={() => setTrainersOpen(!trainersOpen)} 
                    count={trainers.length} 
                />

                {trainersOpen && (
                    <div className="fade-in" style={{ marginTop: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {trainers.filter(t => t.status === 'active').sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })).map(t => (
                                <div key={t.user_id} className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h2 style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{t.name}</h2>
                                        <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '20px', fontWeight: 600 }}>ACTIVE</span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{t.email}</p>
                                    <p style={{ fontSize: '0.9rem', marginTop: '0.75rem', fontWeight: 600 }}>
                                        {t.specialization}
                                        <span style={{ marginLeft: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>
                                            · {t.member_count ?? 0} member{t.member_count !== 1 ? 's' : ''}
                                        </span>
                                    </p>
                                    <button className="premium-button" style={{ marginTop: '1rem', background: '#e11d48', width: '100%' }} onClick={() => handleFireTrainer(t.user_id)}>Mark Removed</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {trainersOpen && trainers.some(t => t.status === 'removed') && (
                <>
                    <h3 style={{ marginTop: '3rem', marginBottom: '1rem', color: '#ef4444', fontSize: '1rem' }}>Removed Trainers (Pending Replacements)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {trainers.filter(t => t.status === 'removed').sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })).map(t => (
                            <div key={t.user_id} className="premium-card" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #e11d48', backdropFilter: 'blur(10px)' }}>
                                <h2 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{t.name} <span style={{ fontSize: '0.8rem', color: '#e11d48' }}>(REMOVED)</span></h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.email}</p>
                                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Specialization: {t.specialization}</p>
                                <button className="premium-button" style={{ marginTop: '1rem', background: '#b45309', width: '100%' }} onClick={() => handleReplaceTrainer(t)}>Hire Replacement</button>
                            </div>
                        ))}
                    </div>
                </>
            )}


            {/* ── Forms ─────────────────────────────────────────────── */}
            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Assign Member Routine */}
                <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Assign Member Routine</h3>
                    {suggestedTrainer && (
                        <div style={{
                            background: 'rgba(16,185,129,0.08)',
                            border: '1px solid rgba(16,185,129,0.25)',
                            borderRadius: '8px',
                            padding: '0.6rem 1rem',
                            marginBottom: '1rem',
                            fontSize: '0.82rem',
                            color: '#10b981'
                        }}>
                            💡 Suggested: <strong>{suggestedTrainer.name}</strong> — lightest load ({suggestedTrainer.member_count} members)
                        </div>
                    )}
                    <form onSubmit={handleAssignMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <select name="member_id" className="premium-input" style={{ backgroundColor: 'var(--bg-main)' }} required>
                            <option value="" style={{ color: '#000' }}>Select Member</option>
                            {[...members].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })).map(m => (
                                <option key={m.id} value={m.id} style={{ color: '#000' }}>{m.name}</option>
                            ))}
                        </select>
                        <select name="trainer_id" className="premium-input" style={{ backgroundColor: 'var(--bg-main)' }} required>
                            <option value="" style={{ color: '#000' }}>Select Trainer</option>
                            {trainers.filter(t => t.status === 'active').sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })).map(t => (
                                <option key={t.trainer_id} value={t.trainer_id} style={{ color: '#000' }}>
                                    {t.name} ({t.member_count ?? 0} members)
                                </option>
                            ))}
                        </select>
                        <select name="workout_id" className="premium-input" style={{ backgroundColor: 'var(--bg-main)' }} required>
                            <option value="" style={{ color: '#000' }}>Select Workout</option>
                            {allWorkouts.map(w => <option key={w.id} value={w.id} style={{ color: '#000' }}>{w.name}</option>)}
                        </select>
                        <button type="submit" className="premium-button">Save Assignment</button>
                    </form>
                </div>

                {/* Hire New Trainer */}
                <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Hire New Trainer</h3>
                    <form onSubmit={handleHireTrainer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input name="name" placeholder="Full Name" className="premium-input" style={{ marginBottom: 0 }} required />
                            <input name="age" type="number" placeholder="Age" className="premium-input" style={{ marginBottom: 0 }} required />
                        </div>
                        <input name="email" type="email" placeholder="Email Address" className="premium-input" style={{ marginBottom: 0 }} required />
                        <input name="password" type="password" placeholder="Temporary Password" className="premium-input" style={{ marginBottom: 0 }} required />
                        <input name="phone" placeholder="Phone Number" className="premium-input" style={{ marginBottom: 0 }} required />
                        <select name="specialization" className="premium-input" style={{ marginBottom: 0, backgroundColor: 'var(--bg-main)' }} required>
                            <option value="" style={{ color: '#000' }}>Select Specialization</option>
                            {['Strength & Conditioning', 'HIIT', 'Yoga & Flexibility', 'Cardio & Endurance',
                              'Bodybuilding', 'CrossFit', 'Nutrition & Weight Loss', 'Rehabilitation', 'General Fitness'].map(s => (
                                <option key={s} value={s} style={{ color: '#000' }}>{s}</option>
                            ))}
                        </select>
                        <button type="submit" className="premium-button" style={{ marginTop: '0.5rem' }}>Add Trainer to Roster</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
