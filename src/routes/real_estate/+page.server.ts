import type { RealEstate } from '../../app';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { reconstructToken } from '$lib/components/utils/func/hash';

export const load = (async ({ cookies, locals }) => {
    let real_estates: RealEstate[] = [];

    let token_recupered: string | null = reconstructToken(cookies)

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Ajouter l'Authorization seulement si le token est présent
    if (token_recupered) {
        headers['Authorization'] = `Bearer ${token_recupered}`;
    }

    console.log('access: ', token_recupered)

    const FetchRealEstate = await fetch(`${env.URL_API}/api/getrealestate/`, {
        method: 'GET',
        headers: headers,
    });

    if (FetchRealEstate.ok) {
        real_estates = await FetchRealEstate.json();
    } else {
        throw error(404, 'Erreur au niveau des real estate !');
    }

    return { real_estates };
}) satisfies PageServerLoad;
