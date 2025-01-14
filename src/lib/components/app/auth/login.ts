import { z } from 'zod';

export const FormLoginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type FormLoginType = z.infer<typeof FormLoginSchema>;