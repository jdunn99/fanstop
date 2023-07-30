import { db } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as argon2 from 'argon2';
import { z } from 'zod';

export const AccountInputSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

/**
 * Register a User into the database.
 * @param email - The User's requested email.
 * @param password - The User's requested password.
 * @returns - The result of the operation. User if successful. Throws error if something goes wrong.
 */
async function register(email: string, password: string) {
    return await db.user.create({
        data: {
            email,
            password: await argon2.hash(password),
        },
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST')
        try {
            const { email, password } = AccountInputSchema.parse(req.body);
            res.status(200).json(await register(email, password));
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: JSON.stringify(error) });
        }
}
