import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import SweetCard from '../components/SweetCard';
import { useAuth } from '../context/AuthContext';

interface Sweet {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

const Dashboard: React.FC = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [search, setSearch] = useState('');
    const { logout, user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    // Form state for Admin
    const [newSweet, setNewSweet] = useState({ name: '', category: '', price: '', quantity: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchSweets = async (query = '') => {
        try {
            const url = query ? `/sweets/search?q=${query}` : '/sweets';
            const res = await api.get(url);
            setSweets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSweets(search);
    };

    const handlePurchase = async (id: number) => {
        try {
            await api.post(`/sweets/${id}/purchase`);
            fetchSweets(search);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Purchase failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Scrap this sweet?')) return;
        try {
            await api.delete(`/sweets/${id}`);
            fetchSweets(search);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSweet = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/sweets', {
                name: newSweet.name,
                category: newSweet.category,
                price: parseFloat(newSweet.price),
                quantity: parseInt(newSweet.quantity)
            });
            setShowAddForm(false);
            setNewSweet({ name: '', category: '', price: '', quantity: '' });
            fetchSweets(search);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to add sweet');
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button onClick={logout} style={{ background: 'white', color: 'black', border: '2px solid black', boxShadow: 'none' }}>
                    Logout ({user?.email.split('@')[0]})
                </button>
            </div>

            <div className="hero-section">
                <h1>The Sweetest Spot 🍭</h1>
                <p>Welcome, human! Pick your treats below.</p>

                <form onSubmit={handleSearch} className="hero-search">
                    <input
                        type="text"
                        placeholder="What are you craving?"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ margin: 0 }}
                    />
                    <button type="submit" style={{ margin: 0 }}>Find</button>
                </form>
            </div>

            {isAdmin && (
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="secondary"
                    >
                        {showAddForm ? 'Close Manager' : 'Restock Inventory'}
                    </button>
                </div>
            )}

            {showAddForm && (
                <div className="auth-card" style={{ maxWidth: '600px', transform: 'rotate(1deg)' }}>
                    <h2>New Batch</h2>
                    <form onSubmit={handleAddSweet} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input placeholder="Name" value={newSweet.name} onChange={e => setNewSweet({ ...newSweet, name: e.target.value })} required style={{ gridColumn: 'span 2' }} />
                        <input placeholder="Type (e.g. Choco)" value={newSweet.category} onChange={e => setNewSweet({ ...newSweet, category: e.target.value })} required />
                        <input type="number" placeholder="Price" value={newSweet.price} onChange={e => setNewSweet({ ...newSweet, price: e.target.value })} required step="0.01" />
                        <input type="number" placeholder="Qty" value={newSweet.quantity} onChange={e => setNewSweet({ ...newSweet, quantity: e.target.value })} required style={{ gridColumn: 'span 2' }} />
                        <button type="submit" style={{ gridColumn: 'span 2' }}>Add to Shelf</button>
                    </form>
                </div>
            )}

            <div className="sweet-grid">
                {sweets.map(sweet => (
                    <SweetCard
                        key={sweet.id}
                        sweet={sweet}
                        onPurchase={handlePurchase}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {sweets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'Permanent Marker', color: '#aaa' }}>
                    <h2 style={{ transform: 'none' }}>Empty Shelf!</h2>
                    <p>Maybe try searching for something else?</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
