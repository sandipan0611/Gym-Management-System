import React from 'react';

const TrainerDashboard = ({ trainerAssignments }) => {
    return (
        <div className="premium-container fade-in" style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ marginBottom: '2rem' }}>Trainer Dashboard</h1>
            <h3>Your Assigned Trainees</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
                {trainerAssignments.length > 0 ? trainerAssignments.map(a => (
                    <div key={a.assignment_id} className="premium-card" style={{ 
                        background: 'rgba(21, 24, 40, 0.85)', 
                        backdropFilter: 'blur(10px)',
                        opacity: a.member_status === 'removed' ? 0.6 : 1
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h2 style={{color: 'var(--text-main)', fontSize: '1.2rem'}}>{a.member_name}</h2>
                            {a.member_status === 'removed' && (
                                <span style={{ 
                                    background: 'rgba(239, 68, 68, 0.1)', 
                                    color: '#ef4444', 
                                    fontSize: '0.7rem', 
                                    padding: '0.2rem 0.5rem', 
                                    borderRadius: '12px',
                                    fontWeight: 600
                                }}>DEACTIVATED</span>
                            )}
                        </div>
                        <p style={{color: 'var(--text-muted)', marginTop:'0.5rem', fontSize: '0.9rem'}}>{a.member_email} | {a.phone}</p>
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                            <h4 style={{ color: 'var(--accent)' }}>Focus: {a.workout_name}</h4>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>{a.workout_desc}</p>
                        </div>
                    </div>
                )) : <p>No members assigned to you currently.</p>}
            </div>
        </div>
    );
};

export default TrainerDashboard;
