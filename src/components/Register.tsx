import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: (user: any, token: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
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
      const response = await axios.post('http://localhost:4000/api/auth/register', formData);
      if (response.data.user) {
        const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        if (loginResponse.data.user && loginResponse.data.token) {
          onRegisterSuccess(loginResponse.data.user, loginResponse.data.token);
        }
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
          <h2>Create Account</h2>
          <p>Sign up to get started</p>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                id="fname"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                required
                placeholder="John"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                id="lname"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                required
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
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
              placeholder="Minimum 6 characters"
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="link-button">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

