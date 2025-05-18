import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './ToastContext';
import axios from 'axios';
import './PasswordManagerApp.css';

const API = 'http://localhost:8080';

export default function PasswordManagerApp() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websites, setWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [siteUsername, setSiteUsername] = useState('');
  const [sitePassword, setSitePassword] = useState('');
  const { addToast } = useToast();
  const [passwordList, setPasswordList] = useState([]);
  const [darkMode, setDarkMode] = useState(false);



  useEffect(() => {
    if (token) {
      fetchWebsites();
      fetchPasswords();
    }
  }, [token]);


  const fetchWebsites = async () => {
    try {
      const res = await axios.get(`${API}/websites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWebsites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem('jwt', res.data.token);
      setToken(res.data.token);
      addToast('Login successful', 'success');
    } catch (err) {
      console.error(err);
      addToast('Login failed. Please check your credentials.', 'error');
    }
  };

  const handleSignup = async () => {
    try {
      await axios.post(`${API}/signup`, { email, password });
      handleLogin();
      addToast('Signed up!');
    } catch (err) {
      console.error(err);
      addToast('Sign up failed', 'error');
    }
  };

  const addWebsite = async () => {
    try {
      await axios.post(
        `${API}/websites`,
        { name: websiteName, url: websiteUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWebsites();
      addToast('Website added');
    } catch (err) {
      console.error(err);
      addToast('website addition failed.', 'error');
    }
  };

  const savePasswordDetails = async () => {
    try {
      await axios.post(
        `${API}/passwords`,
        {
          websiteId: selectedWebsite,
          username: siteUsername,
          password: sitePassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast('Password saved!', 'success');
      fetchPasswords();
    } catch (err) {
      console.error(err);
      addToast('Failed to save password.', 'error');
    }
  };


  const logout = () => {
    localStorage.removeItem('jwt');
    setToken('');
    addToast('Logged out');
  };

  <button
    className="dark-mode-toggle"
    onClick={() => setDarkMode((prev) => !prev)}
  >
    {darkMode ? 'Light Mode' : 'Dark Mode'}
  </button>


  const fetchPasswords = async () => {
    try {
      const res = await axios.get(`${API}/passwords`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordList(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  if (!token) {
    return (
      <div className="card">
        <h2>Login / Signup</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <div className="btn-group">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignup}>Sign Up</button>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <div className="container">
        <button className="logout-btn" onClick={logout}>Logout</button>

        <div className="card">
          <h2>Add Website</h2>
          <input placeholder="Website Name" onChange={(e) => setWebsiteName(e.target.value)} />
          <input placeholder="Website URL" onChange={(e) => setWebsiteUrl(e.target.value)} />
          <button onClick={addWebsite}>Add</button>
        </div>

        <div className="card">
          <h2>Save Credentials</h2>
          <select value={selectedWebsite} onChange={(e) => setSelectedWebsite(e.target.value)}>
            <option value="">Select Website</option>
            {websites.map((site) => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
          <input placeholder="Site Username" onChange={(e) => setSiteUsername(e.target.value)} />
          <input type="password" placeholder="Site Password" onChange={(e) => setSitePassword(e.target.value)} />
          <button onClick={savePasswordDetails}>Save</button>
        </div>

        <div className="password-list">
          <h3>Saved Passwords</h3>
          {passwordList.length === 0 ? (
            <p>No passwords saved yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Website</th>
                  <th>Username</th>
                  <th>Created</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {passwordList.map((p) => (
                  <tr key={p.id}>
                    <td>{p.websiteName}</td>
                    <td>{p.username}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ToastProvider>
      <PasswordManagerApp />
    </ToastProvider>
  );
}
