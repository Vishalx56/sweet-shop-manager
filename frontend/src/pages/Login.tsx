import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="auth-card" style={{ transform: 'rotate(-1deg)' }}>
                <h1 style={{ color: 'var(--primary)', margin: 0 }}>Login</h1>
                <p>Who goes there?</p>

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
                        placeholder="Secret Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" style={{ width: '100%', marginTop: '10px' }}>
                        Open the Door
                    </button>
                </form>
                <div style={{ marginTop: '20px' }}>
                    <Link to="/register" style={{ color: 'var(--ink)', fontWeight: 'bold' }}>I need a ticket (Register)</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
