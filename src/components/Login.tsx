import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

interface LoginProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: (user: any, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', formData);
      if (response.data.user && response.data.token) {
        onLoginSuccess(response.data.user, response.data.token);
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map((err: any) => err.msg));
      } else if (error.response?.data?.error) {
        setErrors([error.response.data.error]);
      } else {
        setErrors(['An error occurred. Please try again.']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.length > 0 && (
            <div className="error-message">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="link-button">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

