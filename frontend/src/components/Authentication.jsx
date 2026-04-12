import React from 'react';

const Authentication = ({ 
    showSignup, setShowSignup, loginEmail, loginPassword, 
    handleLogin, handleSignup, errorMsg 
}) => {
    return (
          <div className="premium-container fade-in" style={{ maxWidth: '400px', marginTop: '10vh', position: 'relative', zIndex: 10 }}>
            <div className="premium-card" style={{ background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-main)' }}>
                  {showSignup ? "Create Member Account" : "Welcome Back"}
              </h2>
              {showSignup ? (
                  <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="email" type="email" defaultValue={loginEmail} placeholder="Email" className="premium-input" style={{marginBottom: 0}} required />
                    <input name="password" type="password" defaultValue={loginPassword} placeholder="Password" className="premium-input" style={{marginBottom: 0}} required />
                    <input name="name" placeholder="Full Name" className="premium-input" style={{marginBottom: 0}} required />
                    <input name="phone" placeholder="Phone Number" className="premium-input" style={{marginBottom: 0}} required />
                    <input name="age" type="number" placeholder="Age" className="premium-input" style={{marginBottom: 0}} required />
                    
                    {errorMsg && <p style={{color: '#ef4444', fontSize: '0.9rem', margin: 0}}>{errorMsg}</p>}
                    <button type="submit" className="premium-button" style={{ width: '100%', marginTop: '0.5rem' }}>
                      Sign Up
                    </button>
                    <button type="button" className="premium-button" style={{ background: 'transparent', border: '1px solid var(--text-muted)' }} onClick={() => setShowSignup(false)}>
                      Cancel
                    </button>
                    <button type="button" className="premium-button" style={{ background: 'transparent', border: 'none', color: 'var(--accent)', marginTop: '-0.5rem', fontSize: '0.85rem' }} onClick={() => setShowSignup(false)}>
                      Sign In Instead
                    </button>
                  </form>
              ) : (
                  <form onSubmit={handleLogin}>
                    <input name="email" type="email" placeholder="Email (e.g. nipendra@gym.com)" className="premium-input" required />
                    <input name="password" type="password" placeholder="Password (password123)" className="premium-input" required />
                    {errorMsg && <p style={{color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem'}}>{errorMsg}</p>}
                    <button type="submit" className="premium-button" style={{ width: '100%', marginTop: '1rem' }}>
                      Sign In
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => setShowSignup(true)}>Sign Up</span>
                    </p>
                  </form>
              )}
            </div>
          </div>
    );
};

export default Authentication;
