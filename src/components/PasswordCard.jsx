import React, { useState } from 'react';
import { Card, Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PasswordCard = ({ passwordId, websiteName, initialUsername, initialPassword, onDelete }) => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState(initialPassword);
    const [username, setUsername] = useState(initialUsername);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const jwtToken = localStorage.getItem('token');

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        alert('Password copied to clipboard!');
    };

    const toggleVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleEdit = async () => {
        if (isEditing) {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/passwords/updatepassword', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    body: JSON.stringify({
                        "passwordId": passwordId,
                        "websiteUsername": username,
                        "websitePassword": password,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update password');
                }
            } catch (error) {
                alert('Error updating password: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete credentials for ${websiteName}?`)) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/passwords/deletepassword', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({ "passwordId": passwordId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete password');
            }
            if (typeof onDelete === 'function') {
                onDelete();
              }

        } catch (error) {
            alert('Error deleting password: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            bg="dark"
            text="white"
            className="p-3 shadow mb-4"
            style={{ width: '100%', borderRadius: '1rem' }}
        >
            <Card.Body>
                <Card.Title className="mb-3 fs-4">{websiteName}</Card.Title>

                <InputGroup className="mb-3">
                    <InputGroup.Text className="bg-secondary text-white">Username</InputGroup.Text>
                    <FormControl
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={!isEditing || loading}
                        className="bg-dark text-white border-secondary"
                    />
                </InputGroup>

                <InputGroup className="mb-4">
                    <InputGroup.Text className="bg-secondary text-white">Password</InputGroup.Text>
                    <FormControl
                        type={passwordVisible ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!isEditing || loading}
                        className="bg-dark text-white border-secondary"
                    />
                </InputGroup>

                <Row className="g-2">
                    <Col>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={toggleVisibility}
                            className="w-100"
                            disabled={loading}
                        >
                            {passwordVisible ? 'Hide' : 'Reveal'}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCopy}
                            className="w-100"
                            disabled={loading}
                        >
                            Copy
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant={isEditing ? 'warning' : 'secondary'}
                            size="sm"
                            onClick={toggleEdit}
                            className="w-100"
                            disabled={loading}
                        >
                            {isEditing ? 'Save' : 'Edit'}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleDelete}
                            className="w-100"
                            disabled={loading}
                        >
                            Delete
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PasswordCard;
