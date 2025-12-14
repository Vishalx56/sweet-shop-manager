import request from 'supertest';
import app from '../app';
import prisma from '../prisma';
import jwt from 'jsonwebtoken';

describe('Inventory Endpoints', () => {
    let adminToken: string;
    let userToken: string;
    let sweetId: number;

    beforeAll(async () => {
        // Create Tokens
        const admin = await prisma.user.create({ data: { email: 'inv_admin@test.com', password: 'pw', role: 'ADMIN' } });
        adminToken = jwt.sign({ userId: admin.id, email: admin.email, role: 'ADMIN' }, process.env.JWT_SECRET || 'secret');

        const user = await prisma.user.create({ data: { email: 'inv_user@test.com', password: 'pw', role: 'USER' } });
        userToken = jwt.sign({ userId: user.id, email: user.email, role: 'USER' }, process.env.JWT_SECRET || 'secret');
    });

    beforeEach(async () => {
        // Create a sweet for testing
        const sweet = await prisma.sweet.create({
            data: { name: 'Stock Sweet', category: 'Inv', price: 10, quantity: 5 }
        });
        sweetId = sweet.id;
    });

    afterAll(async () => {
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    describe('POST /api/sweets/:id/purchase', () => {
        it('should purchase a sweet and decrease quantity', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(200);

            const updated = await prisma.sweet.findUnique({ where: { id: sweetId } });
            expect(updated?.quantity).toEqual(4);
        });

        it('should fail if out of stock', async () => {
            await prisma.sweet.update({ where: { id: sweetId }, data: { quantity: 0 } });
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/sweets/:id/restock', () => {
        it('should restock a sweet if admin', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ quantity: 10 });
            expect(res.statusCode).toEqual(200);

            const updated = await prisma.sweet.findUnique({ where: { id: sweetId } });
            expect(updated?.quantity).toEqual(15);
        });

        it('should forbid non-admin', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 10 });
            expect(res.statusCode).toEqual(403);
        });
    });
});
