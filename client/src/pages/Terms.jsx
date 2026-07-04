import React from 'react';

const Terms = () => {
  return (
    <div className="page" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Terms of Service</h1>
      <div className="glass-card" style={{ padding: '2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '1.5rem' }}><strong>Effective Date: {new Date().toLocaleDateString()}</strong></p>
        <p style={{ marginBottom: '1.5rem' }}>
          Please read these Terms of Service carefully before accessing or using our Website. By accessing or using any part of the site, you agree to be bound by these Terms of Service.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          <strong>1. Use of the Platform:</strong> You must use InterviewAI responsibly and ethically. You agree not to attempt to reverse engineer, bypass rate limits, or exploit the AI services provided.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          <strong>2. User Accounts:</strong> If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account.
        </p>
        <p>
          <strong>3. Disclaimer of Warranties:</strong> The Website is provided "as is". InterviewAI and its suppliers and licensors hereby disclaim all warranties of any kind, express or implied, including, without limitation, the warranties of merchantability, fitness for a particular purpose and non-infringement.
        </p>
      </div>
    </div>
  );
};

export default Terms;
