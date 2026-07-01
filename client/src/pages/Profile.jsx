import { useState } from 'react';
import { FiUser, FiBriefcase, FiAward, FiSave } from 'react-icons/fi';
import useAuthStore from '../stores/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    targetRole: user?.targetRole || '',
    experienceLevel: user?.experienceLevel || 'junior',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const result = await updateProfile(formData);
    if (result.success) {
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(result.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      targetRole: user?.targetRole || '',
      experienceLevel: user?.experienceLevel || 'junior',
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="page">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Profile</h1>
          <p className={styles.subtitle}>Manage your account and interview preferences</p>
        </div>

        <div className={styles.grid}>
          {/* Profile Card */}
          <div className={`${styles.card}`}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className={styles.userName}>{user?.name}</h2>
                <p className={styles.userEmail}>{user?.email}</p>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{user?.stats?.sessionsCompleted || 0}</span>
                <span className={styles.statLabel}>Sessions</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  {user?.stats?.averageScore ? user.stats.averageScore.toFixed(1) : '—'}
                </span>
                <span className={styles.statLabel}>Avg Score</span>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className={`${styles.card}`}>
            <div className={styles.formHeader}>
              <h3 className={styles.formTitle}>Preferences</h3>
              {!isEditing && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>

            {successMessage && <div className={styles.successAlert}>{successMessage}</div>}
            {error && <div className={styles.errorAlert}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                icon={FiUser}
              />

              <Input
                label="Target Role"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                placeholder="e.g. Frontend Engineer, Product Manager"
                disabled={!isEditing}
                icon={FiBriefcase}
              />

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Experience Level
                </label>
                <div className={styles.selectWrapper}>
                  <FiAward className={styles.selectIcon} size={18} />
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={styles.select}
                  >
                    <option value="junior">Junior (0-2 years)</option>
                    <option value="mid">Mid-Level (2-5 years)</option>
                    <option value="senior">Senior (5+ years)</option>
                    <option value="lead">Lead / Staff</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className={styles.actions}>
                  <Button variant="ghost" onClick={handleCancel} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isLoading}>
                    <FiSave /> Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
