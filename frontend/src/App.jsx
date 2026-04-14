import { useState, useEffect } from 'react';
import './index.css';
import bgImage from './assets/bg.png';

import * as api from './services/api';
import Authentication from './components/Authentication';
import AdminDashboard from './components/AdminDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import MemberDashboard from './components/MemberDashboard';
import PricingTiers from './components/PricingTiers';
import AccountSettings from './components/AccountSettings';

const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatTime = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt') || null);
  const [errorMsg, setErrorMsg] = useState('');

  const [showSignup, setShowSignup] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Member State
  const [activePlan, setActivePlan] = useState(null);
  const [nextWorkout, setNextWorkout] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [metricsHistory, setMetricsHistory] = useState([]);

  // Trainer State
  const [trainerAssignments, setTrainerAssignments] = useState([]);

  // Admin State
  const [adminStats, setAdminStats] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);

  // General / Public State
  const [plans, setPlans] = useState([]);
  const [publicTrainers, setPublicTrainers] = useState([]);

  // Restore auto-routing for active tokens on refresh
  useEffect(() => {
    if (token && currentPage === 'login' && user) {
        setCurrentPage('dashboard');
    }
  }, [token, currentPage, user]);

  useEffect(() => {
    if (currentPage === 'dashboard' && token && user) fetchDashboardData();
    if (currentPage === 'plans') fetchPlans();
    if (['dashboard', 'staff'].includes(currentPage) && token && user?.role === 'admin') fetchStaffData();
  }, [currentPage, token, user]);

  useEffect(() => {
    if (token && !user) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            setUser(JSON.parse(jsonPayload).user);
        } catch (e) {
            console.error('Invalid token');
            handleLogout();
        }
    }
  }, [token, user]);

  const fetchDashboardData = async () => {
     try {
       if (user.role === 'member') {
           const subData = await api.getSubscriptions(token);
           setActivePlan(subData.data[0] || null);

           const workData = await api.getMemberWorkouts(token);
           setNextWorkout(workData.data[0] || null);

           const attData = await api.getAttendance(token);
           setAttendanceList(attData.data);

           // Fetch health metrics history for progress charts
           const metData = await api.getMetrics(token);
           setMetricsHistory(metData.data);
       } else if (user.role === 'trainer') {
           const data = await api.getTrainerDashboard(token);
           setTrainerAssignments(data.data);
       } else if (user.role === 'admin') {
           const data = await api.getAdminDashboard(token);
           setAdminStats(data.data);
       }
     } catch (err) { console.error('Failed to load dashboard sync', err); }
  };

  const fetchStaffData = async () => {
        try {
            const tData = await api.getTrainers(token);
            setTrainers(tData.data);

            const mData = await api.getMembers(token);
            setMembers(mData.data);

            const wData = await api.getWorkouts(token);
            setAllWorkouts(wData.data);
        } catch (err) { console.error('Failed to fetch staff data', err); }
  };

  const fetchPlans = async () => {
      try {
          const res = await api.getPlans();
          setPlans(res.data);
      } catch (err) { console.error('Failed to load plans', err); }

      // Fetch trainer list for PricingTiers showcase (requires auth)
      if (token) {
          try {
              const tRes = await api.getTrainers(token);
              setPublicTrainers(tRes.data);
          } catch (err) { /* silently skip if not admin */ }
      }
  };

  const handleUpdatePlan = async (id, newPrice) => {
    try {
        await api.updatePlan(token, id, newPrice);
        fetchPlans();
    } catch (err) { console.error(err); }
  };

  const handleHireTrainer = async (e) => {
      e.preventDefault();
      const form = e.target;
      const data = {
          name: form.name.value, email: form.email.value, password: form.password.value,
          phone: form.phone.value, age: form.age.value, specialization: form.specialization.value
      };
      try {
          await api.hireTrainer(token, data);
          form.reset();
          fetchStaffData();
      } catch (err) { console.error(err); }
  };

  const handleFireTrainer = async (userId) => {
      if(!window.confirm('Are you sure you want to mark this trainer as removed?')) return;
      try {
          await api.fireTrainer(token, userId);
          fetchStaffData();
          if (currentPage === 'dashboard') fetchDashboardData();
      } catch (err) { console.error(err); }
  };

  const handleReplaceTrainer = async (t) => {
      const email = prompt(`Enter new email for ${t.name}'s replacement:`, `${t.email.split('@')[0]}_new@gym.com`);
      if(!email) return;
      const pwd = prompt('Enter temporary password for the new hire:', 'password123');
      if(!pwd) return;
      if(!window.confirm(`Are you sure you want to completely replace ${t.name} and assign all their old members to this new hire?`)) return;

      try {
          await api.replaceTrainer(token, t.user_id, { email: email, password: pwd, age: 25, specialization: t.specialization, name: t.name });
          fetchStaffData();
          alert('Trainer successfully replaced and legacy members reassigned!');
      } catch (err) { console.error(err); }
  };

  const handleAssignMember = async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
          await api.assignMember(token, { member_id: form.member_id.value, trainer_id: form.trainer_id.value, workout_id: form.workout_id.value });
          form.reset();
          alert('Member correctly assigned.');
          fetchDashboardData();
          fetchStaffData();
      } catch (err) { console.error(err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
        const data = await api.login(email, password);
        localStorage.setItem('jwt', data.token);
        setToken(data.token);
        setUser(data.data);
        setCurrentPage('dashboard');
    } catch (err) {
        if (err.notFound) {
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
      const data = {
          email: e.target.email.value, password: e.target.password.value,
          name: e.target.name.value, phone: e.target.phone.value,
          age: e.target.age.value, role: 'member'
      };
      try {
          await api.register(data);
          alert("Successfully registered! Please hit 'Sign In' below.");
          setShowSignup(false);
      } catch (err) { setErrorMsg(err.message || 'Registration failed'); }
  };

  const handleCheckIn = async () => {
     try {
        const res = await api.markAttendance(token);
        setAttendanceList(prev => [res.data, ...prev]);
     } catch (err) {
        if (err.status === 400) alert(err.message);
        else console.error('Check in error', err);
     }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setToken(null); setUser(null); setCurrentPage('login');
  };

  const handleJoinPlan = async (planId, planName) => {
      if(!window.confirm(`Are you sure you want to subscribe to the ${planName} plan? This will replace your current active plan.`)) return;
      try {
          await api.createSubscription(token, { plan_id: planId });
          alert(`Successfully subscribed to ${planName}!`);
          await fetchDashboardData();
          setCurrentPage('dashboard');
      } catch (err) {
          alert(err.message || 'Server failed to process your subscription');
      }
  };

  // Callback from AccountSettings after a profile update
  const handleProfileUpdate = (updatedUser) => {
      setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Authentication
                 showSignup={showSignup} setShowSignup={setShowSignup} loginEmail={loginEmail}
                 loginPassword={loginPassword} handleLogin={handleLogin} handleSignup={handleSignup} errorMsg={errorMsg} />;
      case 'dashboard':
        return (
            <div style={{width: '100%'}}>
                {user?.role === 'admin' && <AdminDashboard
                                               adminStats={adminStats} trainers={trainers} members={members} allWorkouts={allWorkouts}
                                               handleHireTrainer={handleHireTrainer} handleFireTrainer={handleFireTrainer}
                                               handleReplaceTrainer={handleReplaceTrainer} handleAssignMember={handleAssignMember}
                                               token={token} />}
                {user?.role === 'trainer' && <TrainerDashboard trainerAssignments={trainerAssignments} />}
                {user?.role === 'member' && <MemberDashboard
                                               activePlan={activePlan} nextWorkout={nextWorkout} attendanceList={attendanceList}
                                               handleCheckIn={handleCheckIn} formatDate={formatDate} formatTime={formatTime}
                                               metricsHistory={metricsHistory} />}
                <AccountSettings token={token} user={user} onProfileUpdate={handleProfileUpdate} />
            </div>
        );
      case 'plans':
        return <PricingTiers plans={plans} user={user} setShowSignup={setShowSignup} setCurrentPage={setCurrentPage} handleJoinPlan={handleJoinPlan} handleUpdatePlan={handleUpdatePlan} publicTrainers={publicTrainers} />;
      case 'staff':
        return <AdminDashboard
                 adminStats={null} trainers={trainers} members={members} allWorkouts={allWorkouts}
                 handleHireTrainer={handleHireTrainer} handleFireTrainer={handleFireTrainer}
                 handleReplaceTrainer={handleReplaceTrainer} handleAssignMember={handleAssignMember}
                 token={token} />;
      default:
        return <h2>Page Not Found</h2>;
    }
  };

  if (currentPage !== 'login' && currentPage !== 'plans' && !token) {
    setCurrentPage('login');
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      color: '#fff'
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1 }}></div>

      <nav style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(15, 17, 26, 0.95)', borderBottom: '1px solid var(--card-border)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <h1 style={{ cursor: 'pointer', margin: 0, letterSpacing: '2px', fontWeight: '900', color: 'var(--text-main)' }} onClick={() => setCurrentPage(token ? 'dashboard' : 'login')}>GYM<span style={{color: 'var(--accent)' }}>.OS</span> <span style={{fontSize: '0.8rem', color: '#64748b', marginLeft: '1rem', fontWeight: '500'}}>Role: {user?.role ? user.role.toUpperCase() : 'GUEST'}</span></h1>

        <div style={{ display: 'flex', gap: '1.5rem', fontWeight: '600' }}>
          {token && <span onClick={() => setCurrentPage('dashboard')} className={currentPage === 'dashboard' ? 'active-nav' : 'inactive-nav'}>Dashboard</span>}
          {user && user.role === 'admin' && <span onClick={() => setCurrentPage('staff')} className={currentPage === 'staff' ? 'active-nav' : 'inactive-nav'}>Staff Management</span>}
          <span onClick={() => setCurrentPage('plans')} className={currentPage === 'plans' ? 'active-nav' : 'inactive-nav'}>Pricing</span>
          {token ? (
              <span onClick={handleLogout} style={{ color: '#ef4444', cursor: 'pointer' }}>Logout</span>
          ) : (
              <>
                  <span onClick={() => { setCurrentPage('login'); setShowSignup(false); }} style={{cursor: 'pointer'}}>Sign In</span>
                  <span onClick={() => { setCurrentPage('login'); setShowSignup(true); }} style={{ color: 'var(--accent)', cursor: 'pointer' }}>Sign Up</span>
              </>
          )}
        </div>
      </nav>

      <main style={{ padding: '2rem', flex: 1, display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
