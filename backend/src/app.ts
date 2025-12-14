import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

import authRoutes from './routes/auth.routes';
import sweetsRoutes from './routes/sweets.routes';

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

export default app;
