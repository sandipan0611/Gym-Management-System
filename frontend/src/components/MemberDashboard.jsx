import React from 'react';

const MemberDashboard = ({ 
    activePlan, nextWorkout, attendanceList, 
    handleCheckIn, formatDate, formatTime 
}) => {
    const todayStr = new Date().toDateString();
    const checkedInToday = attendanceList.some(a => new Date(a.check_in_time).toDateString() === todayStr);
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyVisits = attendanceList.filter(a => new Date(a.check_in_time).getTime() > sevenDaysAgo).length;

    return (
        <div className="premium-container fade-in" style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ marginBottom: '2rem' }}>My Status</h1>
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
                                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Trainer: <span style={{color: 'var(--accent)'}}>{nextWorkout.trainer_name || 'Not Assigned'}</span></p>
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
                                        {checkedInToday ? "Checked In Today! ✅" : "Check In via App"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No workout assigned yet.</p>
                        )}
                    </div>
                </div>

                {/* Attendance Details Grid */}
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
        </div>
    );
};

export default MemberDashboard;
