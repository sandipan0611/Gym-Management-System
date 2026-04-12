import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Area, AreaChart
} from 'recharts';

/* ── Shared chart theme ─────────────────────────────────────────────── */
const CHART_COLORS = { accent: '#5e6ad2', green: '#10b981', muted: '#9ca3af' };
const chartTooltipStyle = {
    backgroundColor: 'rgba(21,24,40,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#f3f4f6',
    fontSize: '0.85rem'
};

/* ── Subscription Expiry Banner ─────────────────────────────────────── */
const ExpiryBanner = ({ activePlan, formatDate }) => {
    if (!activePlan?.end_date) return null;
    const daysLeft = Math.ceil((new Date(activePlan.end_date) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft > 7) return null;

    const isExpired = daysLeft < 0;
    const color = isExpired ? '#ef4444' : '#f59e0b';
    return (
        <div style={{
            background: `rgba(${isExpired ? '239,68,68' : '245,158,11'},0.12)`,
            border: `1px solid ${color}`,
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        }}>
            <span style={{ fontSize: '1.5rem' }}>{isExpired ? '🚨' : '⚠️'}</span>
            <div>
                <strong style={{ color }}>
                    {isExpired
                        ? 'Your subscription has expired!'
                        : `Your plan expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`}
                </strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {activePlan.plan_name} plan · expires {formatDate(activePlan.end_date)}
                    {!isExpired && ' — head to Pricing to renew now.'}
                </p>
            </div>
        </div>
    );
};

/* ── Attendance Trend Bar Chart ─────────────────────────────────────── */
const AttendanceTrendChart = ({ attendanceList }) => {
    const data = useMemo(() => {
        const buckets = {};
        const now = Date.now();
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

        attendanceList
            .filter(a => new Date(a.check_in_time).getTime() >= thirtyDaysAgo)
            .forEach(a => {
                const d = new Date(a.check_in_time);
                const key = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                buckets[key] = (buckets[key] || 0) + 1;
            });

        return Object.entries(buckets)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, visits]) => ({ date, visits }));
    }, [attendanceList]);

    if (data.length === 0) {
        return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No check-in data for the last 30 days.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(94,106,210,0.1)' }} />
                <Bar dataKey="visits" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} name="Check-ins" />
            </BarChart>
        </ResponsiveContainer>
    );
};

/* ── Weight Progress Line Chart ─────────────────────────────────────── */
const WeightProgressChart = ({ metricsHistory }) => {
    const data = useMemo(() =>
        metricsHistory
            .filter(m => m.weight_kg != null)
            .map(m => ({
                date: new Date(m.recorded_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                weight: parseFloat(m.weight_kg)
            })),
        [metricsHistory]
    );

    if (data.length < 2) {
        return (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
                Log at least 2 weight entries in Account Settings to see your progress trend.
            </p>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 11 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`${v} kg`, 'Weight']} />
                <Line type="monotone" dataKey="weight" stroke={CHART_COLORS.green} strokeWidth={2} dot={{ fill: CHART_COLORS.green, r: 4 }} activeDot={{ r: 6 }} name="Weight (kg)" />
            </LineChart>
        </ResponsiveContainer>
    );
};

/* ── Main Component ─────────────────────────────────────────────────── */
const MemberDashboard = ({
    activePlan, nextWorkout, attendanceList,
    handleCheckIn, formatDate, formatTime,
    metricsHistory = []
}) => {
    const todayStr = new Date().toDateString();
    const checkedInToday = attendanceList.some(a => new Date(a.check_in_time).toDateString() === todayStr);
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyVisits = attendanceList.filter(a => new Date(a.check_in_time).getTime() > sevenDaysAgo).length;

    return (
        <div className="premium-container fade-in" style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ marginBottom: '1.5rem' }}>My Status</h1>

            {/* Subscription expiry banner */}
            <ExpiryBanner activePlan={activePlan} formatDate={formatDate} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Active Plan / Routine Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                        <h3>Active Plan</h3>
                        {activePlan ? (
                            <>
                                <h2 style={{ marginTop: '1rem', color: 'var(--accent)' }}>{activePlan.plan_name}</h2>
                                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Valid until {formatDate(activePlan.end_date)}</p>
                            </>
                        ) : (
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No active plan found.</p>
                        )}
                    </div>
                    <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                        <h3>Assigned Routine</h3>
                        {nextWorkout ? (
                            <>
                                <h2 style={{ marginTop: '1rem', color: 'var(--text-main)' }}>{nextWorkout.workout_name}</h2>
                                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Trainer: <span style={{ color: 'var(--accent)' }}>{nextWorkout.trainer_name || 'Not Assigned'}</span>
                                </p>
                                <div style={{ marginTop: '1.5rem' }}>
                                    <button
                                        className="premium-button"
                                        style={{
                                            width: '100%',
                                            background: checkedInToday ? '#10b981' : undefined,
                                            transform: checkedInToday ? 'none' : undefined,
                                            cursor: checkedInToday ? 'default' : 'pointer'
                                        }}
                                        onClick={checkedInToday ? undefined : handleCheckIn}
                                        disabled={checkedInToday}
                                    >
                                        {checkedInToday ? 'Checked In Today! ✅' : 'Check In via App'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No workout assigned yet.</p>
                        )}
                    </div>
                </div>

                {/* Attendance Analytics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                    <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                        <h3>Attendance Analytics</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div>
                                <h1 style={{ fontSize: '3rem', color: 'var(--accent)' }}>{weeklyVisits}</h1>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Visits this week</p>
                            </div>
                            <div>
                                <h1 style={{ fontSize: '3rem', color: 'var(--text-main)' }}>{attendanceList.length}</h1>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total check-ins</p>
                            </div>
                        </div>

                        <h4 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Recent Activity</h4>
                        {attendanceList.slice(0, 3).map((a, i) => (
                            <div key={i} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-main)' }}>{formatDate(a.check_in_time)}</span>
                                <span style={{ float: 'right', color: 'var(--accent)', fontSize: '0.8rem' }}>{formatTime(a.check_in_time)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Progress Trends Section ───────────────────────────── */}
            <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Progress Trends</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>

                {/* Attendance Trend Chart */}
                <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Attendance (Last 30 Days)</h3>
                        <span style={{
                            background: 'rgba(94,106,210,0.15)',
                            color: 'var(--accent)',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '20px',
                            fontWeight: 600
                        }}>Daily</span>
                    </div>
                    <AttendanceTrendChart attendanceList={attendanceList} />
                </div>

                {/* Weight Progress Chart */}
                <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Weight Progress</h3>
                        <span style={{
                            background: 'rgba(16,185,129,0.15)',
                            color: '#10b981',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '20px',
                            fontWeight: 600
                        }}>kg</span>
                    </div>
                    <WeightProgressChart metricsHistory={metricsHistory} />
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
