// src/components/Login.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Added for better alerts
import './login/login.css';

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!data.username || !data.password) {
      setError('Username and Password are required!');
      document.getElementById(!data.username ? 'username' : 'password').focus();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserName: data.username, UserPassword: data.password }),
      });

      const result = await response.json();

      if (response.ok) {
        remember ? localStorage.setItem('token', result.token) : sessionStorage.setItem('token', result.token);
        Swal.fire({
          title: "Login Successful",
          text: "Welcome back to Organic!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/');
      } else {
        setError(result.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Error connecting to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4">Welcome to Organic</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={data.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              name="rememberMe"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="mt-3 text-center">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
