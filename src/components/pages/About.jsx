import React from 'react';
import { Container, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container fluid
    className="d-flex justify-content-center align-items-center min-vh-10"
    style={{ padding: '2rem'}}>
      <Card bg= "dark" text="white" style={{ borderRadius: '1rem'}}>
        <Card.Body>
          <Card.Title>About This Password Manager</Card.Title>
          <Card.Text>
            Welcome to my secure and user-friendly <strong>Password Manager App</strong>, built to help you safely store and manage your login credentials — all in one place.
          </Card.Text>

          <Card.Text>
            This project was developed using <strong>Spring Boot (Java)</strong> for the backend and <strong>React</strong> with <strong>React-Bootstrap</strong> for the frontend. It features <strong>JWT-based authentication</strong>, a clean UI, and essential password management functionalities.
          </Card.Text>

          <Card.Text>
            <strong>Key Features:</strong>
            <ul>
              <li>User Authentication (JWT)</li>
              <li>Passcode Login (Android App)</li>
              <li>Add & View Credentials</li>
              <li>Secure Storage</li>
              <li>Mobile and Web Frontend</li>
            </ul>
          </Card.Text>

          <Card.Text>
            <strong>Tech Stack:</strong>
            <ul>
              <li>Frontend (Web): React, React Router, React-Bootstrap</li>
              <li>Backend: Java, Spring Boot (Security, Web, JPA)</li>
              <li>Database: MySQL</li>
              <li>Authentication: JWT (JSON Web Token)</li>
            </ul>
          </Card.Text>
          <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

          <Card.Text className="text-center" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            © {new Date().getFullYear()} <strong>Adarsh Gupta</strong>. Student @ABVIIITM.<br />
            Developed as a personal project showcasing secure full-stack application development.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default About;
