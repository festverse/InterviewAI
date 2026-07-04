import React from 'react';

const About = () => {
  return (
    <div className="page" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>About <span className="gradient-text">InterviewAI</span></h1>
      <div className="glass-card" style={{ padding: '2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          At InterviewAI, our mission is to democratize access to high-quality interview preparation. We believe that everyone deserves the chance to put their best foot forward when it matters most, regardless of their background or resources.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          By leveraging cutting-edge Artificial Intelligence, we've built a platform that simulates the rigor and unpredictability of real technical interviews. Our AI doesn't just ask questions—it analyzes your delivery, technical depth, structure, and clarity, providing actionable feedback instantly.
        </p>
        <p>
          Whether you're a junior developer trying to land your first role, or a senior engineer aiming for a staff position, InterviewAI adapts to your level and helps you continuously improve.
        </p>
      </div>
    </div>
  );
};

export default About;
