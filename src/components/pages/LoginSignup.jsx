import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async () => {
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
  
      if (!response.ok) {
        const errorText = isJson ? (await response.json()).message : await response.text();
        alert(errorText || 'Something went wrong');
        return;
      }
  
      const data = isJson ? await response.json() : {};
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('login'));
        navigate('/yourpasswords');
      } else {
        alert(data.message || 'Authentication succeeded, but no token received.');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };
  

  return (
    <Card bg="dark" text="white" className="mx-auto mt-20" style={{ maxWidth: '35%', borderRadius: '0.8rem' }}>
      <Card.Body>
        <Card.Title className="mb-4">{isLogin ? 'Login' : 'Sign Up'}</Card.Title>
        <Form>
          <Form.Group className="mb-4">
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ borderRadius: '1rem' }}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: '1rem' }}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAuth}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
          <div className="mt-3">
            <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>{' '}
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginSignup;
