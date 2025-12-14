import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { email, password });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="auth-card" style={{ transform: 'rotate(1deg)' }}>
                <h1 style={{ color: 'var(--secondary)', margin: 0 }}>Join Us</h1>
                <p>Become a member of the club!</p>

                {error && <div style={{ background: '#fab1a0', padding: '10px', border: '2px solid black', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Choose a Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="secondary" style={{ width: '100%', marginTop: '10px' }}>
                        Sign Me Up
                    </button>
                </form>
                <div style={{ marginTop: '20px' }}>
                    <Link to="/login" style={{ color: 'var(--ink)', fontWeight: 'bold' }}>I already have a key (Login)</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
