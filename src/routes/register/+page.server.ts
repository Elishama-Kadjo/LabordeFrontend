import { fail, message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { FormSignUpSchema } from '$lib/components/app/auth/register';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies, locals }) => {

    if (locals.user) {
        throw redirect(303, "/")
    }

    const form = await superValidate(zod(FormSignUpSchema))
    return { form };

}) satisfies PageServerLoad;

export const actions = {
    register: async ({ request }) => {
        const form = await superValidate(request, zod(FormSignUpSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const signUpFormData = new FormData();
        signUpFormData.append("username", form.data.username);
        signUpFormData.append("email", form.data.email);
        signUpFormData.append("password1", form.data.password);
        signUpFormData.append("password2", form.data.password_confirm);

        try {
            const response = await fetch(`${env.URL_API}/api/v0/auth/registration/`, {
                method: 'POST',
                body: signUpFormData,
            });

            if (!response.ok) {
                const result = await response.json();
                console.log(result)
                const msg = result?.non_field_errors[0] === "The password is too similar to the username" 
                    ? "le mot de passe est similaire au username" 
                    : "le mot de passe est trop commun"

                return message(form, {
                    type: "erreur",
                    text: msg,
                    status: 401
                })
            }

            //TODO: implementer apres l'incsription la connexion automatique

            return message(form, {
                type: "success",
                text: "Inscription réussie",
                status: 200
            });

        } catch (err) {
            return message(form, {
                type: "erreur",
                text: "Erreur d'Inscription, Rééssayer !",
                status: 500
            })
        }
    },
} satisfies Actions;