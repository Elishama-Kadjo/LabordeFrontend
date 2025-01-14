import { z } from 'zod';

export const FormResetPasswordSchema = z.object({
    email: z.string().email('Email invalide'),
});

export type FormResetPasswordType = z.infer<typeof FormResetPasswordSchema>;


export const FormConfirmPasswordSchema = z.object({
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    password_confirm: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
})
    .refine((data) => data.password === data.password_confirm, {
        message: 'Les mots de passe doivent être identiques',
        path: ['password_confirm'] // Error message will appear on `password_confirm`
    });

export type FormConfirmPasswordType = z.infer<typeof FormConfirmPasswordSchema>;
