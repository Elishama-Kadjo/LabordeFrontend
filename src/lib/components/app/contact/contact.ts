import { z } from 'zod';

export const FormContactSchema = z.object({
    name: z.string().min(3, 'Le nom doit contenir minimum 3 caractères'),
    email: z.string().email('Email invalide'),
    message: z.string()
});

export type FormContactType = z.infer<typeof FormContactSchema>;