import { Request, Response } from 'express';
import prisma from '../prisma';
import { z } from 'zod';

const sweetSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().nonnegative(),
});

export const createSweet = async (req: Request, res: Response) => {
    try {
        const data = sweetSchema.parse(req.body);
        const sweet = await prisma.sweet.create({ data });
        res.status(201).json(sweet);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: (error as any).errors });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSweets = async (req: Request, res: Response) => {
    try {
        const sweets = await prisma.sweet.findMany();
        res.status(200).json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const searchSweets = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: "Search query required" });
        }
        const sweets = await prisma.sweet.findMany({
            where: {
                OR: [
                    { name: { contains: q } },
                    { category: { contains: q } }
                ]
            }
        });
        res.status(200).json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = sweetSchema.parse(req.body);
        const sweet = await prisma.sweet.update({
            where: { id: parseInt(id) },
            data,
        });
        res.status(200).json(sweet);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: (error as any).errors });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.sweet.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const purchaseSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.$transaction(async (tx: any) => {
            const sweet = await tx.sweet.findUnique({ where: { id: parseInt(id) } });
            if (!sweet) {
                throw new Error('Sweet not found');
            }
            if (sweet.quantity < 1) {
                throw new Error('Out of stock');
            }
            await tx.sweet.update({
                where: { id: parseInt(id) },
                data: { quantity: sweet.quantity - 1 }
            });
        });
        res.status(200).json({ message: 'Purchase successful' });
    } catch (error: any) {
        if (error.message === 'Sweet not found') return res.status(404).json({ message: error.message });
        if (error.message === 'Out of stock') return res.status(400).json({ message: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const restockSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        await prisma.sweet.update({
            where: { id: parseInt(id) },
            data: { quantity: { increment: quantity } }
        });
        res.status(200).json({ message: 'Restock successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
