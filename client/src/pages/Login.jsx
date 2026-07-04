import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiCommand } from 'react-icons/fi';
import useAuthStore from '../stores/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import styles from './Auth.module.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) clearError();
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="page">
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <FiCommand size={28} />
            </div>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to continue your interview prep</p>
          </div>

          {error && (
            <div className={styles.alert}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={FiMail}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              icon={FiLock}
              error={errors.password}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.switchLink}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
