import { useState, useEffect } from 'react';
import './index.css';
import bgImage from './assets/bg.png';

import Authentication from './components/Authentication';
import AdminDashboard from './components/AdminDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import MemberDashboard from './components/MemberDashboard';
import PricingTiers from './components/PricingTiers';
import AccountSettings from './components/AccountSettings';

const API_BASE = 'http://localhost:5000/api';

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

  // Trainer State
  const [trainerAssignments, setTrainerAssignments] = useState([]);

  // Admin State
  const [adminStats, setAdminStats] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);

  // General State
  const [plans, setPlans] = useState([]);

  // Restore dynamic auto-routing for active tokens on refresh
  useEffect(() => {
    if (token && currentPage === 'login' && user) {
        setCurrentPage('dashboard');
    }
  }, [token, currentPage, user]);

  useEffect(() => {
    if (currentPage === 'dashboard' && token && user) fetchDashboardData();
    if (currentPage === 'plans') fetchPlans();
    if (currentPage === 'staff' && token && user?.role === 'admin') fetchStaffData();
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
            console.error("Invalid token");
            handleLogout();
        }
    }
  }, [token, user]);

  const fetchDashboardData = async () => {
     try {
       if (user.role === 'member') {
           const subRes = await fetch(`${API_BASE}/subscriptions`, { headers: { 'Authorization': `Bearer ${token}` } });
           if(subRes.ok) { const subData = await subRes.json(); setActivePlan(subData[0] || null); }
           
           const workRes = await fetch(`${API_BASE}/workouts/member`, { headers: { 'Authorization': `Bearer ${token}` } });
           if(workRes.ok) { const workData = await workRes.json(); setNextWorkout(workData[0] || null); }
           
           const attRes = await fetch(`${API_BASE}/attendance`, { headers: { 'Authorization': `Bearer ${token}` } });
           if(attRes.ok) { const attData = await attRes.json(); setAttendanceList(attData); }
       } else if (user.role === 'trainer') {
           const res = await fetch(`${API_BASE}/dashboard/trainer`, { headers: { 'Authorization': `Bearer ${token}` } });
           if(res.ok) { const data = await res.json(); setTrainerAssignments(data); }
       } else if (user.role === 'admin') {
           const res = await fetch(`${API_BASE}/dashboard/admin`, { headers: { 'Authorization': `Bearer ${token}` } });
           if(res.ok) { const data = await res.json(); setAdminStats(data); }
       }
     } catch (err) { console.error("Failed to load dashboard sync"); }
  };

  const fetchStaffData = async () => {
       try {
           const tRes = await fetch(`${API_BASE}/admin/trainers`, { headers: { 'Authorization': `Bearer ${token}` } });
           if(tRes.ok) setTrainers(await tRes.json());
    
           const mRes = await fetch(`${API_BASE}/admin/members`, { headers: { 'Authorization': `Bearer ${token}` } });
           if(mRes.ok) setMembers(await mRes.json());
           
           const wRes = await fetch(`${API_BASE}/workouts`, { headers: { 'Authorization': `Bearer ${token}` } });
           if(wRes.ok) setAllWorkouts(await wRes.json());
       } catch (err) { console.error("Failed to fetch staff data", err); }
  };

  const fetchPlans = async () => {
      try {
          const res = await fetch(`${API_BASE}/plans`);
          if(res.ok) setPlans(await res.json());
      } catch (err) { console.error("Failed to load plans"); }
  };

  const handleUpdatePlan = async (id, newPrice) => {
    try {
        const res = await fetch(`${API_BASE}/plans/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ price: newPrice })
        });
        if(res.ok) fetchPlans();
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
          const res = await fetch(`${API_BASE}/admin/trainers`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(data)
          });
          if(res.ok) { form.reset(); fetchStaffData(); }
      } catch (err) { console.error(err); }
  };

  const handleFireTrainer = async (userId) => {
      if(!window.confirm("Are you sure you want to mark this trainer as removed?")) return;
      try {
          const res = await fetch(`${API_BASE}/admin/trainers/${userId}/fire`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
          if(res.ok) { fetchStaffData(); if (currentPage === 'dashboard') fetchDashboardData(); }
      } catch (err) { console.error(err); }
  };

  const handleReplaceTrainer = async (t) => {
      const email = prompt(`Enter new email for ${t.name}'s replacement:`, `${t.email.split('@')[0]}_new@gym.com`);
      if(!email) return;
      const pwd = prompt("Enter temporary password for the new hire:", "password123");
      if(!pwd) return;
      if(!window.confirm(`Are you sure you want to completely replace ${t.name} and assign all their old members to this new hire?`)) return;

      try {
          const res = await fetch(`${API_BASE}/admin/trainers/${t.user_id}/replace`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ email: email, password: pwd, age: 25, specialization: t.specialization, name: t.name })
          });
          if(res.ok) { fetchStaffData(); alert("Trainer successfully replaced and legacy members reassigned!"); }
      } catch (err) { console.error(err); }
  };

  const handleAssignMember = async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
          const res = await fetch(`${API_BASE}/admin/assignments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ member_id: form.member_id.value, trainer_id: form.trainer_id.value, workout_id: form.workout_id.value })
          });
          if(res.ok) { form.reset(); alert("Member correctly assigned."); }
      } catch (err) { console.error(err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('jwt', data.token);
            setToken(data.token); setUser(data.user); setCurrentPage('dashboard');
        } else {
            if (data.notFound) { setLoginEmail(email); setLoginPassword(password); setShowSignup(true); } 
            else { setErrorMsg(data.message || "Invalid credentials"); }
        }
    } catch (err) { setErrorMsg("Unable to connect to server. Is it running?"); }
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
          const res = await fetch(`${API_BASE}/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
          });
          const resData = await res.json();
          if (res.ok) { alert("Successfully registered! Please hit 'Sign In' below."); setShowSignup(false); } 
          else { setErrorMsg(resData.message || "Registration failed"); }
      } catch (err) { setErrorMsg("Connection error"); }
  };

  const handleCheckIn = async () => {
     try {
        const res = await fetch(`${API_BASE}/attendance`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
        if(res.ok) {
             const data = await res.json();
             setAttendanceList(prev => [data.data, ...prev]);
        } else if (res.status === 400) alert((await res.json()).message);
     } catch (err) { console.error("Check in error", err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setToken(null); setUser(null); setCurrentPage('login');
  };

  const handleJoinPlan = async (planId, planName) => {
      if(!window.confirm(`Are you sure you want to subscribe to the ${planName} plan? This will replace your current active plan.`)) return;
      try {
          const res = await fetch(`${API_BASE}/subscriptions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ plan_id: planId })
          });
          if(res.ok) { alert(`Successfully subscribed to ${planName}!`); setCurrentPage('dashboard'); } 
          else { alert("Server failed to process your subscription"); }
      } catch (err) { console.error(err); }
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
                                              handleReplaceTrainer={handleReplaceTrainer} handleAssignMember={handleAssignMember} />}
                {user?.role === 'trainer' && <TrainerDashboard trainerAssignments={trainerAssignments} />}
                {user?.role === 'member' && <MemberDashboard 
                                              activePlan={activePlan} nextWorkout={nextWorkout} attendanceList={attendanceList} 
                                              handleCheckIn={handleCheckIn} formatDate={formatDate} formatTime={formatTime} />}
                <AccountSettings token={token} />
            </div>
        );
      case 'plans':
        return <PricingTiers plans={plans} user={user} setShowSignup={setShowSignup} setCurrentPage={setCurrentPage} handleJoinPlan={handleJoinPlan} handleUpdatePlan={handleUpdatePlan} />;
      case 'staff':
        return <AdminDashboard 
                 adminStats={null} trainers={trainers} members={members} allWorkouts={allWorkouts} 
                 handleHireTrainer={handleHireTrainer} handleFireTrainer={handleFireTrainer} 
                 handleReplaceTrainer={handleReplaceTrainer} handleAssignMember={handleAssignMember} />;
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
        <h1 style={{ cursor: 'pointer', margin: 0, letterSpacing: '2px', fontWeight: '900', color: 'var(--text-main)' }} onClick={() => setCurrentPage(token ? 'dashboard' : 'login')}>GYM<span style={{color: 'var(--accent)'}}>.OS</span> <span style={{fontSize: '0.8rem', color: '#64748b', marginLeft: '1rem', fontWeight: '500'}}>Role: {user?.role ? user.role.toUpperCase() : 'GUEST'}</span></h1>
        
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
