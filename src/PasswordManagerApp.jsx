import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

const API = 'http://localhost:8080'; // Change to match your backend URL

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

  useEffect(() => {
    if (token) fetchWebsites();
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignup = async () => {
    try {
      await axios.post(`${API}/signup`, { email, password });
      handleLogin();
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken('');
  };

  if (!token) {
    return (
      <Card className="max-w-md mx-auto mt-10 p-4">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Login / Signup</h2>
          <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} className="mt-2" />
          <div className="flex gap-2 mt-4">
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleSignup}>Sign Up</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <Button onClick={logout} className="mb-4">Logout</Button>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Add Website</h2>
          <Input placeholder="Website Name" onChange={(e) => setWebsiteName(e.target.value)} />
          <Input placeholder="Website URL" onChange={(e) => setWebsiteUrl(e.target.value)} className="mt-2" />
          <Button onClick={addWebsite} className="mt-2">Add</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Save Credentials</h2>
          <select
            value={selectedWebsite}
            onChange={(e) => setSelectedWebsite(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Website</option>
            {websites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
          <Input placeholder="Site Username" onChange={(e) => setSiteUsername(e.target.value)} className="mt-2" />
          <Input placeholder="Site Password" type="password" onChange={(e) => setSitePassword(e.target.value)} className="mt-2" />
          <Button onClick={savePasswordDetails} className="mt-2">Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}
