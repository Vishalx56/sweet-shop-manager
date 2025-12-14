import React from 'react';
import { useAuth } from '../context/AuthContext';

interface Sweet {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

interface SweetCardProps {
    sweet: Sweet;
    onPurchase: (id: number) => void;
    onDelete: (id: number) => void;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet, onPurchase, onDelete }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    // Pastel colors for headers
    const colors = ['#ff9f43', '#f368e0', '#00d2d3', '#5f27cd', '#54a0ff'];
    const headerColor = colors[sweet.id % colors.length];

    return (
        <div className="sweet-card" style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}>
            <div className="sweet-header" style={{ background: headerColor, color: 'white' }}>
                {/* Simple emoji mapping based on char code for chaos */}
                {['🍬', '🍭', '🍫', '🍩', '🍪'][sweet.id % 5]}
            </div>

            <div className="sweet-body">
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{sweet.name}</h3>
                    <small style={{ color: '#888', fontStyle: 'italic' }}>{sweet.category}</small>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${sweet.price.toFixed(2)}</span>
                    <span style={{ color: sweet.quantity > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                        {sweet.quantity > 0 ? `${sweet.quantity} left` : 'GONE!'}
                    </span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => onPurchase(sweet.id)}
                        disabled={sweet.quantity === 0}
                        style={{ flex: 1 }}
                    >
                        {sweet.quantity > 0 ? 'Grab It!' : 'Sold Out'}
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => onDelete(sweet.id)}
                            style={{ background: '#ff7675', padding: '10px 15px' }}
                        >
                            X
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SweetCard;
