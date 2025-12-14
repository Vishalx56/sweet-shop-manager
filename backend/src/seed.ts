import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.create({
        data: {
            email: 'admin@sweetshop.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Created admin:', admin.email);

    await prisma.sweet.createMany({
        data: [
            { name: 'Chocolate Fudge', category: 'Fudge', price: 3.50, quantity: 50 },
            { name: 'Gummy Bears', category: 'Gummies', price: 1.50, quantity: 100 },
            { name: 'Lollipop', category: 'Hard Candy', price: 0.50, quantity: 200 },
        ],
    });

    console.log('Seeded sweets');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
