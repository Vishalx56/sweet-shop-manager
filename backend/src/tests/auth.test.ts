import request from 'supertest';
import app from '../app';

import prisma from '../prisma';

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
        await prisma.$disconnect();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
            expect(res.body.user).not.toHaveProperty('password');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user and return a token', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                });

            expect(res.statusCode).toEqual(401);
        });
    });
});
