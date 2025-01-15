import { fail, message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { FormResetPasswordSchema } from '$lib/components/app/auth/reset_password';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { reconstructToken } from '$lib/components/utils/func/hash';

export const load = (async ({ fetch, cookies, locals }) => {

    if (locals.user) {
        throw redirect(303, "/")
    }

    // fetch sur l'endpoint resetPassword pour savoir si il y a pas un déja crée
    const form = superValidate(zod(FormResetPasswordSchema))
    return { form };

}) satisfies PageServerLoad;

export const actions: Actions = {
    reset_password: async ({ request, cookies, locals }) => {
        const form = await superValidate(request, zod(FormResetPasswordSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const ResetPasswordFormData = new FormData();
        ResetPasswordFormData.append("email", form.data.email);

        // faire appel à l'api de connexion
        const response = await fetch(`${env.URL_API}/api/v0/auth/reset_password/`, {
            method: "POST",
            body: ResetPasswordFormData
        })

        if (response.ok) {
            return message(form, {
                type: "success",
                text: "email envoyé avec succès",
                status: 204
            })
        } else {
            if (response.status === 404) {
                return message(form, {
                    type: "erreur",
                    text: "email a déjà été envoyé",
                    status: 404
                })
            } else if(response.status === 400) {
                //TODO: je te conseille pas de donner des informations comme ça à l'utilisateur.
                return message(form, {
                    type: "erreur",
                    text: "l'email n'existe pas",
                    status: 400
                })
            } else {
                return message(form, {
                    type: "erreur",
                    text: "Internal serveur error, Rééssayer",
                    status: 400
                })
            }

        }
    }
}