import { useState, useEffect } from 'react';
import './index.css';
import bgImage from './assets/bg.png';

import Authentication from './components/Authentication';
import AdminDashboard from './components/AdminDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import MemberDashboard from './components/MemberDashboard';
import PricingTiers from './components/PricingTiers';
import AccountSettings from './components/AccountSettings';

import * as api from './services/api';

export const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
};

export const formatTime = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwt') || null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [showSignup, setShowSignup] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Member State
    const [activePlan, setActivePlan] = useState(null);
    const [nextWorkout, setNextWorkout] = useState(null);
    const [attendanceList, setAttendanceList] = useState([]);

    // Trainer State
    const [trainerAssignments, setTrainerAssignments] = useState([]);

    // Admin State
    const [adminStats, setAdminStats] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [members, setMembers] = useState([]);
    const [allWorkouts, setAllWorkouts] = useState([]);

    // General State
    const [plans, setPlans] = useState([]);

    // Restore session from localStorage token on refresh
    useEffect(() => {
        if (token && !user) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
                );
                setUser(JSON.parse(jsonPayload).user);
            } catch (e) {
                console.error('Invalid token — logging out');
                handleLogout();
            }
        }
    }, [token]);

    // Auto-route to dashboard once user state is restored
    useEffect(() => {
        if (token && user && currentPage === 'login') {
            setCurrentPage('dashboard');
        }
    }, [token, user]);

    // Fetch data when page changes
    useEffect(() => {
        if (currentPage === 'dashboard' && token && user) fetchDashboardData();
        if (currentPage === 'plans') fetchPlansData();
        if (currentPage === 'staff' && token && user?.role === 'admin') fetchStaffData();
    }, [currentPage, token, user]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            if (user.role === 'member') {
                const [subData, workData, attData] = await Promise.all([
                    api.fetchSubscriptions(token),
                    api.fetchMemberWorkout(token),
                    api.fetchAttendance(token),
                ]);
                setActivePlan(subData.data[0] || null);
                setNextWorkout(workData.data[0] || null);
                setAttendanceList(attData.data);
            } else if (user.role === 'trainer') {
                const data = await api.fetchTrainerDashboard(token);
                setTrainerAssignments(data.data);
            } else if (user.role === 'admin') {
                const [statsData, staffTrainers, staffMembers, workouts] = await Promise.all([
                    api.fetchAdminDashboard(token),
                    api.fetchAdminTrainers(token),
                    api.fetchAdminMembers(token),
                    api.fetchAllWorkouts(token),
                ]);
                setAdminStats(statsData.data);
                setTrainers(staffTrainers.data);
                setMembers(staffMembers.data);
                setAllWorkouts(workouts.data);
            }
        } catch (err) {
            console.error('Failed to load dashboard:', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStaffData = async () => {
        try {
            const [tData, mData, wData] = await Promise.all([
                api.fetchAdminTrainers(token),
                api.fetchAdminMembers(token),
                api.fetchAllWorkouts(token),
            ]);
            setTrainers(tData.data);
            setMembers(mData.data);
            setAllWorkouts(wData.data);
        } catch (err) {
            console.error('Failed to fetch staff data:', err.message);
        }
    };

    const fetchPlansData = async () => {
        try {
            const data = await api.fetchPlans();
            setPlans(data.data);
        } catch (err) {
            console.error('Failed to load plans:', err.message);
        }
    };

    const handleUpdatePlan = async (id, newPrice) => {
        try {
            await api.updatePlanPrice(token, id, newPrice);
            fetchPlansData();
        } catch (err) { alert(err.message || 'Failed to update plan'); }
    };

    const handleHireTrainer = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            name: form.name.value, email: form.email.value, password: form.password.value,
            phone: form.phone.value, age: parseInt(form.age.value), specialization: form.specialization.value,
        };
        try {
            await api.hireTrainer(token, data);
            form.reset();
            fetchStaffData();
        } catch (err) { alert(err.message || 'Failed to hire trainer'); }
    };

    const handleFireTrainer = async (userId) => {
        if (!window.confirm('Are you sure you want to mark this trainer as removed?')) return;
        try {
            await api.fireTrainer(token, userId);
            fetchStaffData();
            if (currentPage === 'dashboard') fetchDashboardData();
        } catch (err) { alert(err.message || 'Failed to remove trainer'); }
    };

    const handleReplaceTrainer = async (t) => {
        const email = prompt(`Enter new email for ${t.name}'s replacement:`, `${t.email.split('@')[0]}_new@gym.com`);
        if (!email) return;
        const pwd = prompt('Enter temporary password for the new hire:', 'password123');
        if (!pwd) return;
        if (!window.confirm(`Replace ${t.name} and reassign all members to the new hire?`)) return;
        try {
            await api.replaceTrainer(token, t.user_id, { email, password: pwd, age: 25, specialization: t.specialization, name: t.name });
            fetchStaffData();
            alert('Trainer replaced and members reassigned successfully!');
        } catch (err) { alert(err.message || 'Failed to replace trainer'); }
    };

    const handleAssignMember = async (e) => {
        e.preventDefault();
        const form = e.target;
        try {
            await api.assignMember(token, {
                member_id: parseInt(form.member_id.value),
                trainer_id: parseInt(form.trainer_id.value),
                workout_id: parseInt(form.workout_id.value),
            });
            form.reset();
            alert('Member successfully assigned.');
        } catch (err) { alert(err.message || 'Failed to assign member'); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const data = await api.loginUser(email, password);
            localStorage.setItem('jwt', data.token);
            setToken(data.token);
            setUser(data.user);
            setCurrentPage('dashboard');
        } catch (err) {
            if (err.data?.notFound) {
                setLoginEmail(email);
                setLoginPassword(password);
                setShowSignup(true);
            } else {
                setErrorMsg(err.message || 'Invalid credentials');
            }
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            await api.registerUser({
                email: e.target.email.value,
                password: e.target.password.value,
                name: e.target.name.value,
                phone: e.target.phone.value,
                age: parseInt(e.target.age.value),
                role: 'member',
            });
            alert("Successfully registered! Please sign in below.");
            setShowSignup(false);
        } catch (err) {
            setErrorMsg(err.message || 'Registration failed');
        }
    };

    const handleCheckIn = async () => {
        try {
            const data = await api.checkIn(token);
            setAttendanceList(prev => [data.data, ...prev]);
        } catch (err) {
            alert(err.message || 'Check-in failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        setToken(null);
        setUser(null);
        setCurrentPage('login');
    };

    const handleJoinPlan = async (planId, planName) => {
        if (!window.confirm(`Subscribe to ${planName}? This will replace your current active plan.`)) return;
        try {
            await api.joinPlan(token, planId);
            alert(`Successfully subscribed to ${planName}!`);
            setCurrentPage('dashboard');
        } catch (err) {
            alert(err.message || 'Failed to subscribe to plan');
        }
    };

    const renderPage = () => {
        if (isLoading && currentPage === 'dashboard') {
            return (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '1.2rem' }}>Loading dashboard...</p>
                </div>
            );
        }
        switch (currentPage) {
            case 'login':
                return (
                    <Authentication
                        showSignup={showSignup} setShowSignup={setShowSignup}
                        loginEmail={loginEmail} loginPassword={loginPassword}
                        handleLogin={handleLogin} handleSignup={handleSignup}
                        errorMsg={errorMsg}
                    />
                );
            case 'dashboard':
                return (
                    <div style={{ width: '100%' }}>
                        {user?.role === 'admin' && (
                            <AdminDashboard
                                adminStats={adminStats} trainers={trainers} members={members} allWorkouts={allWorkouts}
                                handleHireTrainer={handleHireTrainer} handleFireTrainer={handleFireTrainer}
                                handleReplaceTrainer={handleReplaceTrainer} handleAssignMember={handleAssignMember}
                            />
                        )}
                        {user?.role === 'trainer' && <TrainerDashboard trainerAssignments={trainerAssignments} />}
                        {user?.role === 'member' && (
                            <MemberDashboard
                                activePlan={activePlan} nextWorkout={nextWorkout} attendanceList={attendanceList}
                                handleCheckIn={handleCheckIn} formatDate={formatDate} formatTime={formatTime}
                            />
                        )}
                        <AccountSettings token={token} />
                    </div>
                );
            case 'plans':
                return (
                    <PricingTiers
                        plans={plans} user={user} setShowSignup={setShowSignup}
                        setCurrentPage={setCurrentPage} handleJoinPlan={handleJoinPlan}
                        handleUpdatePlan={handleUpdatePlan}
                    />
                );
            case 'staff':
                return (
                    <AdminDashboard
                        adminStats={null} trainers={trainers} members={members} allWorkouts={allWorkouts}
                        handleHireTrainer={handleHireTrainer} handleFireTrainer={handleFireTrainer}
                        handleReplaceTrainer={handleReplaceTrainer} handleAssignMember={handleAssignMember}
                    />
                );
            default:
                return <h2>Page Not Found</h2>;
        }
    };

    if (currentPage !== 'login' && !token) {
        setCurrentPage('login');
        return null;
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            backgroundImage: `url(${bgImage})`, backgroundSize: 'cover',
            backgroundPosition: 'center', backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat', color: '#fff',
        }}>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1 }} />

            <nav style={{
                padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: 'rgba(15,17,26,0.95)', borderBottom: '1px solid var(--card-border)',
                position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)',
            }}>
                <h1
                    style={{ cursor: 'pointer', margin: 0, letterSpacing: '2px', fontWeight: '900', color: 'var(--text-main)' }}
                    onClick={() => setCurrentPage(token ? 'dashboard' : 'login')}
                >
                    GYM<span style={{ color: 'var(--accent)' }}>.OS</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '1rem', fontWeight: '500' }}>
                        Role: {user?.role ? user.role.toUpperCase() : 'GUEST'}
                    </span>
                </h1>
                <div style={{ display: 'flex', gap: '1.5rem', fontWeight: '600' }}>
                    {token && (
                        <span onClick={() => setCurrentPage('dashboard')} className={currentPage === 'dashboard' ? 'active-nav' : 'inactive-nav'}>
                            Dashboard
                        </span>
                    )}
                    {user?.role === 'admin' && (
                        <span onClick={() => setCurrentPage('staff')} className={currentPage === 'staff' ? 'active-nav' : 'inactive-nav'}>
                            Staff Management
                        </span>
                    )}
                    <span onClick={() => setCurrentPage('plans')} className={currentPage === 'plans' ? 'active-nav' : 'inactive-nav'}>
                        Pricing
                    </span>
                    {token ? (
                        <span onClick={handleLogout} style={{ color: '#ef4444', cursor: 'pointer' }}>Logout</span>
                    ) : (
                        <>
                            <span onClick={() => { setCurrentPage('login'); setShowSignup(false); }} style={{ cursor: 'pointer' }}>Sign In</span>
                            <span onClick={() => { setCurrentPage('login'); setShowSignup(true); }} style={{ color: 'var(--accent)', cursor: 'pointer' }}>Sign Up</span>
                        </>
                    )}
                </div>
            </nav>

            <main style={{
                padding: '2rem', flex: 1, display: 'flex', justifyContent: 'center',
                width: '100%', maxWidth: '1200px', margin: '0 auto',
                position: 'relative', zIndex: 10,
            }}>
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
