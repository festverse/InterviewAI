import React from 'react';

const Privacy = () => {
  return (
    <div className="page" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Privacy Policy</h1>
      <div className="glass-card" style={{ padding: '2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '1.5rem' }}><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
        <p style={{ marginBottom: '1.5rem' }}>
          Your privacy is critically important to us. At InterviewAI, we have a few fundamental principles:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>We are thoughtful about the personal information we ask you to provide and the personal information that we collect about you through the operation of our services.</li>
          <li>We store personal information for only as long as we have a reason to keep it.</li>
          <li>We aim for full transparency on how we gather, use, and share your personal information.</li>
        </ul>
        <p style={{ marginBottom: '1.5rem' }}>
          <strong>Information We Collect:</strong> We only collect information about you if we have a reason to do so—for example, to provide our Services, to communicate with you, or to make our Services better.
        </p>
        <p>
          <strong>Security:</strong> While no online service is 100% secure, we work very hard to protect information about you against unauthorized access, use, alteration, or destruction, and take reasonable measures to do so.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
