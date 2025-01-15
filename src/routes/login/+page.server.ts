import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { FormLoginSchema } from '$lib/components/app/auth/login';
import { env } from '$env/dynamic/private';
import { storeTokenInCookies } from '$lib/components/utils/func/hash';

export const load = (async ({ cookies, locals }) => {

    if (locals.user) {
        throw redirect(303, "/")
    }

    const form = await superValidate(zod(FormLoginSchema))
    return { form };

}) satisfies PageServerLoad;

export const actions = {
    // actions login (connexion)
    login: async ({ request, cookies }) => {
        const form = await superValidate(request, zod(FormLoginSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const LoginFormData = new FormData();
        LoginFormData.append("email", form.data.email);
        LoginFormData.append("password", form.data.password);

        console.log(LoginFormData)

        // faire appel à l'api de connexion
        const response = await fetch(`${env.URL_API}/api/v0/auth/login/`, {
            method: "POST",
            body: LoginFormData
        })


        // Vérification de la response
        if (response.ok) {
            const { access, refresh } = await response.json()

            storeTokenInCookies(access,cookies);

            console.log("ici ici cioci")

            // Crypter chaque morceau et les enregistrer dans les cookies avec des noms abstraits

            await cookies.set("_wbr_", refresh, {
                path: "/",
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7 // valable une semaine
            })

            return message(form, {
                type: "success",
                text: "connexion réussie",
                status: 200
            })

        } else {
            return message(form, {
                type: "erreur",
                text: "erreur de connexion",
                status: 400
            })
        }
    }
} satisfies Actions;