import React from 'react';
import Button from '../components/common/Button';

const Contact = () => {
  return (
    <div className="page" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'center' }}>Contact Us</h1>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>We'd love to hear from you. Please fill out this form.</p>
      
      <div className="glass-card" style={{ padding: '2rem' }}>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Full Name</label>
            <input 
              type="text" 
              placeholder="Jane Doe" 
              style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="jane@example.com" 
              style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Message</label>
            <textarea 
              rows="5"
              placeholder="How can we help you?" 
              style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}
            ></textarea>
          </div>
          <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '0.5rem' }}>
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
