import React from 'react';

const AdminDashboard = ({ 
    adminStats, trainers, members, allWorkouts, 
    handleHireTrainer, handleFireTrainer, handleReplaceTrainer, handleAssignMember 
}) => {
    return (
        <div className="premium-container fade-in" style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Operations</h1>
            {adminStats ? (
                <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                        <h3>Total Revenue (Active)</h3>
                        <h1 style={{ marginTop: '1rem', fontSize: '2.5rem', color: 'var(--accent)' }}>₹{adminStats.revenue}</h1>
                    </div>
                    <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                        <h3>Total Members</h3>
                        <h1 style={{ marginTop: '1rem', fontSize: '2.5rem', color: 'var(--text-main)' }}>{adminStats.population.members}</h1>
                    </div>
                    <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                        <h3>Total Trainers</h3>
                        <h1 style={{ marginTop: '1rem', fontSize: '2.5rem', color: 'var(--text-main)' }}>{adminStats.population.trainers}</h1>
                    </div>
                </div>
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
            ) : <p>Loading stats...</p>}
            
            <h3 style={{marginTop: '3rem', marginBottom: '1rem'}}>Active Trainers Table</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {trainers.filter(t => t.status === 'active').sort((a,b)=>a.name.localeCompare(b.name, undefined, {numeric: true})).map(t => (
                    <div key={t.user_id} className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                        <h2 style={{color: 'var(--text-main)'}}>{t.name} <span style={{fontSize: '0.8rem', color: '#10b981'}}>(ACTIVE)</span></h2>
                        <p style={{color: 'var(--text-muted)'}}>{t.email}</p>
                        <p style={{fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 'bold'}}>Specialization: {t.specialization}</p>
                        <button className="premium-button" style={{marginTop: '1rem', background: '#e11d48'}} onClick={() => handleFireTrainer(t.user_id)}>Mark Removed</button>
                    </div>
                ))}
            </div>

            {trainers.some(t => t.status === 'removed') && (
                <>
                <h3 style={{marginTop: '3rem', marginBottom: '1rem'}}>Removed Trainers (Pending Replacements)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {trainers.filter(t => t.status === 'removed').sort((a,b)=>a.name.localeCompare(b.name, undefined, {numeric: true})).map(t => (
                        <div key={t.user_id} className="premium-card" style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid #e11d48', backdropFilter: 'blur(10px)' }}>
                            <h2 style={{color: 'var(--text-muted)'}}>{t.name} <span style={{fontSize: '0.8rem', color: '#e11d48'}}>(REMOVED)</span></h2>
                            <p style={{color: 'var(--text-muted)'}}>{t.email}</p>
                            <p style={{fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--text-muted)'}}>Specialization: {t.specialization}</p>
                            <button className="premium-button" style={{marginTop: '1rem', background: '#b45309'}} onClick={() => handleReplaceTrainer(t)}>Hire Replacement</button>
                        </div>
                    ))}
                </div>
                </>
            )}

            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Assign Member Routine</h3>
                    <form onSubmit={handleAssignMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <select name="member_id" className="premium-input" style={{ backgroundColor: 'var(--bg-main)' }} required>
                            <option value="" style={{color: '#000'}}>Select Member</option>
                            {members.map(m => <option key={m.id} value={m.id} style={{color: '#000'}}>{m.name}</option>)}
                        </select>
                        <select name="trainer_id" className="premium-input" style={{ backgroundColor: 'var(--bg-main)' }} required>
                            <option value="" style={{color: '#000'}}>Select Trainer</option>
                            {trainers.filter(t => t.status === 'active').sort((a,b)=>a.name.localeCompare(b.name, undefined, {numeric: true})).map(t => <option key={t.id} value={t.id} style={{color: '#000'}}>{t.name}</option>)}
                        </select>
                        <select name="workout_id" className="premium-input" style={{ backgroundColor: 'var(--bg-main)' }} required>
                            <option value="" style={{color: '#000'}}>Select Workout</option>
                            {allWorkouts.map(w => <option key={w.id} value={w.id} style={{color: '#000'}}>{w.name}</option>)}
                        </select>
                        <button type="submit" className="premium-button">Save Assignment</button>
                    </form>
                </div>
                
                <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Hire New Trainer</h3>
                    <form onSubmit={handleHireTrainer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input name="name" placeholder="Full Name" className="premium-input" style={{marginBottom: 0}} required />
                            <input name="age" type="number" placeholder="Age" className="premium-input" style={{marginBottom: 0}} required />
                        </div>
                        <input name="email" type="email" placeholder="Email Address" className="premium-input" style={{marginBottom: 0}} required />
                        <input name="password" type="password" placeholder="Temporary Password" className="premium-input" style={{marginBottom: 0}} required />
                        <input name="phone" placeholder="Phone Number" className="premium-input" style={{marginBottom: 0}} required />
                        <input name="specialization" placeholder="Specialization (e.g. HIIT)" className="premium-input" style={{marginBottom: 0}} required />
                        <button type="submit" className="premium-button" style={{marginTop: '0.5rem'}}>Add Trainer to Roster</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
