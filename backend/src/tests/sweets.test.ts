import request from 'supertest';
import app from '../app';
import prisma from '../prisma';
import jwt from 'jsonwebtoken';

describe('Sweets Endpoints', () => {
    let adminToken: string;
    let userToken: string;

    beforeAll(async () => {
        // Create Admin
        const admin = await prisma.user.create({
            data: {
                email: 'admin@test.com',
                password: 'hashed_password', // Mocking since authentication bypasses actual hash check in tests if we generate token directly? No, login needs it.
                // But correct approach is to generate token directly for testing authorization.
                role: 'ADMIN',
            }
        });
        adminToken = jwt.sign({ userId: admin.id, email: admin.email, role: 'ADMIN' }, process.env.JWT_SECRET || 'secret');

        // Create User
        const user = await prisma.user.create({
            data: {
                email: 'user@test.com',
                password: 'hashed_password',
                role: 'USER',
            }
        });
        userToken = jwt.sign({ userId: user.id, email: user.email, role: 'USER' }, process.env.JWT_SECRET || 'secret');
    });

    afterAll(async () => {
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    describe('POST /api/sweets', () => {
        it('should create a sweet if admin', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Chocolate Bar',
                    category: 'Chocolate',
                    price: 2.50,
                    quantity: 100
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.name).toEqual('Chocolate Bar');
        });

        it('should return 403 if not admin', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Candy',
                    category: 'Candy',
                    price: 1.00,
                    quantity: 50
                });
            expect(res.statusCode).toEqual(403);
        });
    });

    describe('GET /api/sweets', () => {
        it('should return all sweets', async () => {
            const res = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /api/sweets/search', () => {
        it('should search sweets by name', async () => {
            // Seed
            await prisma.sweet.create({
                data: { name: 'Searchable Sweet', category: 'Test', price: 1, quantity: 1 }
            });
            const res = await request(app)
                .get('/api/sweets/search?q=Searchable')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body[0].name).toContain('Searchable');
        });
    });

    describe('PUT /api/sweets/:id', () => {
        it('should update a sweet if admin', async () => {
            const sweet = await prisma.sweet.create({
                data: { name: 'Old Name', category: 'Old', price: 1, quantity: 1 }
            });
            const res = await request(app)
                .put(`/api/sweets/${sweet.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'New Name',
                    category: 'New',
                    price: 2,
                    quantity: 2
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual('New Name');
        });
    });

    describe('DELETE /api/sweets/:id', () => {
        it('should delete a sweet if admin', async () => {
            const sweet = await prisma.sweet.create({
                data: { name: 'To Delete', category: 'Del', price: 1, quantity: 1 }
            });
            const res = await request(app)
                .delete(`/api/sweets/${sweet.id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.statusCode).toEqual(204);

            const check = await prisma.sweet.findUnique({ where: { id: sweet.id } });
            expect(check).toBeNull();
        });
    });
});
