import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login/login.css';

export default function Registration() {
  const [formData, setFormData] = useState({
    UserProfileImage: null,
    UserName: '',
    UserEmail: '',
    UserPassword: '',
    UserContact: '',
    UserAddress: '',
    UserCity: '',
    UserState: '',
    UserCountry: '',
    UserPincode: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, UserProfileImage: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(formData).filter(v => v !== null).every((field) => field)) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost:3000/user/register', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        navigate('/');
      } else {
        setError(result.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err+' Error while communicating with the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-3">
            <label htmlFor="UserProfileImage" className="position-relative">
              <input type="file" id="UserProfileImage" className="d-none" accept="image/*" onChange={handleImageChange} />
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-light card shadow-lg "
                style={{ width: '150px', height: '150px', cursor: 'pointer', overflow: 'hidden', border: '5px solid rgb(74, 168, 71)' }}
              >
                {formData.UserProfileImage ? (
                  <img src={formData.UserProfileImage ? URL.createObjectURL(formData.UserProfileImage) : ""} alt="Profile" className="w-100 h-100 card shadow-lg" style={{ objectFit: 'cover' }} />
                ) : (
                  <span className="text-muted">+</span>
                )}
              </div>
            </label>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <input type="text" className="form-control form-control-lg" name="UserName" placeholder="Username" value={formData.UserName} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input type="email" className="form-control form-control-lg" name="UserEmail" placeholder="Email" value={formData.UserEmail} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input type="password" className="form-control form-control-lg" name="UserPassword" placeholder="Password" value={formData.UserPassword} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control form-control-lg" name="UserContact" placeholder="Contact Number" value={formData.UserContact} onChange={handleChange} required />
            </div>
            <div className="col-md-12">
              <input type="text" className="form-control form-control-lg" name="UserAddress" placeholder="Address" value={formData.UserAddress} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control form-control-lg" name="UserCity" placeholder="City" value={formData.UserCity} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control form-control-lg" name="UserState" placeholder="State" value={formData.UserState} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control form-control-lg" name="UserCountry" placeholder="Country" value={formData.UserCountry} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control form-control-lg" name="UserPincode" placeholder="Pincode" value={formData.UserPincode} onChange={handleChange} required />
            </div>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading} >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
