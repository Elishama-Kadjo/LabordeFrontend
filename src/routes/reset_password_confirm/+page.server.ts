import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { FormConfirmPasswordSchema } from '$lib/components/app/auth/reset_password';
import { zod } from 'sveltekit-superforms/adapters';
import { env } from '$env/dynamic/private';

export const load = (async ({ cookies, locals, params, url }) => {


    if (locals.user) {
        throw redirect(303, "/")
    }

    // fetch sur l'endpoint resetPassword pour savoir si il y a pas un déja crée
    const form = superValidate(zod(FormConfirmPasswordSchema))
    const token: string | null = url.searchParams.get("token") || null;


    return { form, token };
}) satisfies PageServerLoad;

export const actions: Actions = {
    confirm_reset_password: async ({ request, params, cookies }) => {
        const formData = await request.formData();
        const token = formData.get('token') ?? "";

        const form = await superValidate(formData, zod(FormConfirmPasswordSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        const ResetPasswordConfirmFormData = new FormData();
        ResetPasswordConfirmFormData.append("token", token);
        ResetPasswordConfirmFormData.append("new_password", form.data.password);


        // Ici, vous devriez appeler votre API pour réinitialiser le mot de passe
        // Par exemple :
        const response = await fetch(`${env.URL_API}/api/v0/auth/confirm_reset_password/`, {
            method: 'POST',
            body: ResetPasswordConfirmFormData
        }); 

        console.log('status: ', response.status)
        if (response.ok) {
            return message(form, {
                type: "success",
                text: "Mot de passe réinitialisé avec succès.",
                status: 204
            })
        } else {
            if (response.status === 404) {
                return message(form, {
                    type: "erreur",
                    text: "Token invalide ou expiré",
                    status: 404
                })
            } else {
                return message(form, {
                    type: "erreur",
                    text: "Token n'existe pas ou a expiré, Veuillez demander à nouveau",
                    status: 400
                })
            }

        }
    }
}

// const ResetPasswordConfirmFormData = new FormData();
// ResetPasswordConfirmFormData.append("new_password", form.data.password);

// console.log(ResetPasswordConfirmFormData)