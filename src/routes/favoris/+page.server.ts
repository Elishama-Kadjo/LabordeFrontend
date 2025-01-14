import type { RealEstate } from '../../app';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import { reconstructToken } from '$lib/components/utils/func/hash';
import { SECRET_KEY } from '$env/static/private';

export const load = (async ({ cookies, locals }) => {

    if (!locals.user) {
        throw redirect(303, "/login")
    }

    const token = cookies.get('wb');
    const token_recupered = reconstructToken(cookies, SECRET_KEY)

    let favorites: RealEstate[] = [];

    const FetchRealEstateFavorites = await fetch(`${env.URL_API}/api/getrealestatefavorites/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token_recupered}`
        },
    });

    if (FetchRealEstateFavorites.ok) {
        favorites = await FetchRealEstateFavorites.json();
    } else {
        throw error(404, 'Erreur au niveau des real estate !');
    }

    return { favorites };
}) satisfies PageServerLoad;
