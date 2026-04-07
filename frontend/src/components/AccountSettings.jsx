import React from 'react';

const API_BASE = 'http://localhost:5000/api';

const AccountSettings = ({ token }) => {
  const handleChangePassword = async (e) => {
      e.preventDefault();
      const currentPassword = e.target.currentPassword.value;
      const newPassword = e.target.newPassword.value;
      const confirmPassword = e.target.confirmPassword.value;
      
      if (newPassword !== confirmPassword) {
          return alert("New passwords do not match!");
      }
      
      try {
          const res = await fetch(`${API_BASE}/users/password`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ currentPassword, newPassword })
          });
          const data = await res.json();
          if (res.ok) {
              alert(data.message);
              e.target.reset();
          } else {
              alert(data.message);
          }
      } catch (err) {
          console.error(err);
          alert("Error changing password");
      }
  };

  return (
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
         <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Account Settings</h2>
         <div className="premium-card" style={{ maxWidth: '500px', background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
             <h3>Change Password</h3>
             <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                 <input name="currentPassword" type="password" placeholder="Current Password" className="premium-input" style={{marginBottom: 0}} required />
                 <input name="newPassword" type="password" placeholder="New Password" className="premium-input" style={{marginBottom: 0}} required />
                 <input name="confirmPassword" type="password" placeholder="Confirm New Password" className="premium-input" style={{marginBottom: 0}} required />
                 <button type="submit" className="premium-button" style={{marginTop: '0.5rem'}}>Update Password</button>
             </form>
         </div>
      </div>
  );
};

export default AccountSettings;
