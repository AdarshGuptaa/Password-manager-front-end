import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';
import LogoImage from "../components/images/efc3f026c0c0e159460aabe38ba02777.jpg";

export const MyNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const onLogin = () => setIsLoggedIn(true);
    const onLogout = () => setIsLoggedIn(false);

    window.addEventListener('login', onLogin);
    window.addEventListener('logout', onLogout);

    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('login', onLogin);
      window.removeEventListener('logout', onLogout);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // Notify others about logout
    window.dispatchEvent(new Event('logout'));
    window.location.href = '/';
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/yourpasswords">
          <img
            alt=""
            src={LogoImage}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Password Mine
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/yourpasswords">Your Passwords</Nav.Link>
          <Nav.Link href="/addpassword">Add Password</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
        {isLoggedIn && (
          <Button
            variant='outline-danger'
            onClick={handleLogout}
            className="justify-content-end"
          >
            Logout
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
