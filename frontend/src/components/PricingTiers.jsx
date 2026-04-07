import React from 'react';

const PricingTiers = ({ plans, user, setShowSignup, setCurrentPage, handleJoinPlan, handleUpdatePlan }) => {
    return (
          <div className="premium-container fade-in" style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Membership Pricing</h1>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
               {plans.length > 0 ? plans.map(p => (
                   <div key={p.id} className="premium-card" style={{ width: '300px', textAlign: 'center', background: 'rgba(21, 24, 40, 0.85)', backdropFilter: 'blur(10px)' }}>
                      <h2>{p.name}</h2>
                      <h1 style={{ margin: '1rem 0' }}>₹{Math.floor(p.price)}<span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>/ {p.duration_months} mo</span></h1>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>{p.description}</p>
                      {user && user.role === 'admin' ? (
                          <button className="premium-button" style={{width: '100%'}} onClick={() => {
                              const newPrice = prompt("Enter new price", p.price);
                              if (newPrice && !isNaN(newPrice)) handleUpdatePlan(p.id, newPrice);
                          }}>Edit Price</button>
                      ) : user && user.role === 'trainer' ? null : (
                          <button className="premium-button" style={{width: '100%'}} onClick={() => {
                              if (!user) {
                                  setShowSignup(false);
                                  setCurrentPage('login');
                              } else {
                                  handleJoinPlan(p.id, p.name);
                              }
                          }}>Join Now</button>
                      )}
                   </div>
               )) : <p style={{color: 'var(--text-muted)'}}>Connecting to database server...</p>}
            </div>
          </div>
    );
};

export default PricingTiers;
