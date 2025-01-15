import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { RealEstate, RealEstateDetail } from '../../../app';
import { type Actions } from '@sveltejs/kit';

import { error, redirect } from '@sveltejs/kit';
import { reconstructToken } from '$lib/components/utils/func/hash';
import { fail, superValidate } from 'sveltekit-superforms';
import { FormContactSchema } from '$lib/components/app/contact/contact';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async ({ params, cookies }) => {
    let real_estate = {} as RealEstateDetail;
    let isLiked: boolean = false;

    const form = superValidate(zod(FormContactSchema))

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    let token_recupered: string | null = reconstructToken(cookies)
    // Ajouter l'Authorization seulement si le token est présent
    if (token_recupered) {
        token_recupered = reconstructToken(cookies)
        headers['Authorization'] = `Bearer ${token_recupered}`;
    }

    // Récupération des détails du Real Estate

    //TODO: J'ai expliquer dans le backend que j'ai plus de raison d'utiliser le getId 
    const response = await fetch(`${env.URL_API}/api/getrealestate/${params.id}/`, {
        method: 'GET',
        headers: headers
    });

    if (response.ok) {
        real_estate = await response.json();
    } else if(response.status === 404){
        throw error(404, "Le real estate n'existe pas !");

    } else{
        throw error(500, "Impossible de récupérer les détails du bien immobilier !");
    }

    if (token_recupered) {
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
        const token_recupered = reconstructToken(cookies)

        if (token_recupered) {
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
        const token_recupered = reconstructToken(cookies)

        if (token_recupered) {

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