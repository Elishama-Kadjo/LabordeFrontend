import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { RealEstate, RealEstateDetail } from '../../../app';
import { type Actions } from '@sveltejs/kit';

import { error, redirect } from '@sveltejs/kit';
import { reconstructToken } from '$lib/components/utils/func/hash';
import { SECRET_KEY } from '$env/static/private';
import { fail, superValidate } from 'sveltekit-superforms';
import { FormContactSchema } from '$lib/components/app/contact/contact';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async ({ params, cookies }) => {
    let idRealEstate: string | null = null;
    let real_estate = {} as RealEstateDetail;
    let isLiked: boolean = false;

    const form = superValidate(zod(FormContactSchema))

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const token = cookies.get('wb')
    let token_recupered: string | null = null;
    // Ajouter l'Authorization seulement si le token est présent
    if (token) {
        token_recupered = reconstructToken(cookies, SECRET_KEY)
        headers['Authorization'] = `Bearer ${token_recupered}`;
    }

    // Récupération de l'ID du Real Estate
    const fetchGetRealEstateId = await fetch(`${env.URL_API}/api/single/realestate/${params.id}/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (fetchGetRealEstateId.ok) {
        const data = await fetchGetRealEstateId.json();
        if (data.exists) {
            idRealEstate = data.id;
        } else {
            throw error(404, "Le real estate n'existe pas !");
        }
    } else {
        throw error(500, "Le serveur ne répond pas !");
    }


    // Récupération des détails du Real Estate
    if (idRealEstate) {
        const response = await fetch(`${env.URL_API}/api/getrealestate/${idRealEstate}/`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            real_estate = await response.json();
        } else {
            throw error(500, "Impossible de récupérer les détails du bien immobilier !");
        }
    }

    if (token) {
        // Vérification si l'utilisateur a liké ce bien immobilier
        const fetchGetRealEstateLikedId = await fetch(`${env.URL_API}/api/single/realestate/${params.id}/favorite/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token_recupered}`
            }
        });


        if (fetchGetRealEstateLikedId.ok) {
            const dataLiked = await fetchGetRealEstateLikedId.json();
            isLiked = dataLiked.exists;
        }
    }

    return {
        real_estate,
        isLiked,
        form
    };
}) satisfies PageServerLoad;


export const actions = {
    like: async ({ request, locals, params, cookies }) => {
        const token = cookies.get('wb');

        if (token) {
            const token_recupered = reconstructToken(cookies, SECRET_KEY)


            const formData = await request.formData()

            const idRealEstate = formData.get("idRealEstate")
            const response = await fetch(`${env.URL_API}/api/getrealestate/${idRealEstate}/add_liked/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token_recupered}`, // Si authentification nécessaire
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Impossible de liker le bien immobilier !");
            }
        } else {
            throw new Error("Connectez-vous d'abord");

        }
    },

    unlike: async ({ request, locals, params, cookies }) => {
        const token = cookies.get('wb');

        if (token) {

            const token_recupered = reconstructToken(cookies, SECRET_KEY)

            const formData = await request.formData()

            const idRealEstate = formData.get("idRealEstate")

            const response = await fetch(`${env.URL_API}/api/getrealestate/${idRealEstate}/remove_liked/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token_recupered}`,
                    'Content-Type': 'application/json'
                }
            });

            // console.log(await response.json())

            if (!response.ok) {
                throw new Error("Impossible de unliker le bien immobilier !");
            }
        } else {
            throw new Error("Connectez-vous d'abord");

        }
    },

    contact_laborde: async ({ request }) => {
        const form = await superValidate(request, zod(FormContactSchema))

        if (!form.valid) {
            return fail(400, form)
        }

        console.log(form, "form Contact")

        return {form}
    }

} satisfies Actions;