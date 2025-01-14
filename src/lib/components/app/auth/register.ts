import { z } from 'zod';

export const FormSignUpSchema = z.object({
  username: z.string().min(3, 'Le nom est obligatoire'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  password_confirm: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
})
  .refine((data) => data.password === data.password_confirm, {
    message: 'Les mots de passe doivent être identiques',
    path: ['password_confirm'] // Error message will appear on `password_confirm`
  });

export type FormSignUpType = z.infer<typeof FormSignUpSchema>;