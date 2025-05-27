import { useEffect, useState } from 'react';
import { Container, Form, InputGroup, FormControl } from 'react-bootstrap';
import PasswordCard from './PasswordCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const PasswordCardList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPasswords = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/passwords/getallpasswords', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      
        const validatedData = Array.isArray(response.data)
          ? response.data.filter(p =>
              p.websiteUrl &&
              p.websiteUsername &&
              p.websitePassword
            )
          : [];
      
        setCards(validatedData);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          navigate('/');
        } else {
          setError('Failed to fetch passwords.');
        }
      } finally {
        setLoading(false);
      }
      
    };

    fetchPasswords();
  }, [navigate]);

  const filteredCards = cards.filter(card =>
    card.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.websiteUsername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="mb-4">
        <Form className="d-flex justify-content-center">
          <InputGroup style={{ width: "100%" }}>
            <InputGroup.Text className="bg-dark text-white border-secondary" style={{ borderRadius: '1rem' }}>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <FormControl
              type="search"
              placeholder="Search by website or username"
              className="bg-dark text-white border-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: '1rem' }}
            />
          </InputGroup>
        </Form>
      </Container>

      <div className="d-flex flex-column align-items-center">
        {loading && <p className="text-muted text-center mt-4">Loading...</p>}
        {error && <p className="text-danger text-center mt-4">{error}</p>}
        {!loading && !error && filteredCards.length === 0 && (
          <p className="text-muted text-center mt-4">No matches found.</p>
        )}
        {!loading && !error && filteredCards.map((card, index) => (
          <PasswordCard
          key={card.passwordId}
          passwordId={card.passwordId}
          websiteName={card.websiteUrl}
          initialUsername={card.websiteUsername}
          initialPassword={card.websitePassword}
          onDelete={() => {
            setCards(prev => prev.filter(c => c.passwordId !== card.passwordId));
          }}
        />
        ))}
      </div>
    </div>
  );
};

export default PasswordCardList;
