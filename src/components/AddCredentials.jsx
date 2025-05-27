    import React, { useState } from 'react';
    import { Form, Button, Card } from 'react-bootstrap';
    import { useNavigate } from 'react-router-dom';

    const AddCredentials = ({ onAdd }) => {
        const navigate = useNavigate();
        const [websiteURL, setWebsiteURL] = useState('');
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');

        const handleAdd = async () => {
            if (!websiteURL || !username || !password) {
                alert('Please fill in all fields.');
                return;
            }

            const payload = {
                "websiteUrl": websiteURL,
                "websiteUsername": username,
                "websitePassword": password
            };
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not authenticated. Please login first.');
                navigate("/");
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/passwords/addpassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const result = await response.text();
                    alert(result || 'Password added successfully!');
                    setWebsiteURL('');
                    setUsername('');
                    setPassword('');
                    if (onAdd) {
                        onAdd(payload);
                    }
                } else if (response.status === 401 || response.status === 403) {
                    alert('Unauthorized! Please login again.');
                    navigate('/');
                } else {
                    const error = await response.text();
                    alert(`Failed to add password: ${error}`);
                }
            } catch (err) {
                console.error('Error adding password:', err);
                alert('An error occurred while adding the password.');
            }
        };

        return (
            <Card bg="dark" text="white" className="mx-auto mt-4" style={{ maxWidth: '500px', borderRadius: '1rem' }}>
                <Card.Body>
                    <Card.Title className='mb-4'>Add New Credential</Card.Title>
                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="text"
                                placeholder="https://example.com"
                                value={websiteURL}
                                onChange={(e) => setWebsiteURL(e.target.value)}
                                className="border-secondary"
                                style={{ borderRadius: '1rem' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="text"
                                placeholder="your_username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border-secondary"
                                style={{ borderRadius: '1rem' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="password"
                                placeholder="your_password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-secondary"
                                style={{ borderRadius: '1rem' }}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="success" onClick={handleAdd}>
                                Add
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        );
    };

    export default AddCredentials;
