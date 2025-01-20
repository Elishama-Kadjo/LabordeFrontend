import { fail, message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import type { RealEstate } from '../app';
import { env } from '$env/dynamic/private';

export const load = (async ({cookies}) => {
    //TODO: si access token -> ??? 
    let real_estates: RealEstate[] = [];

    const FetchFavoritesRealEstate = await fetch(`${env.URL_API}/api/realestate/getfavorites/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (FetchFavoritesRealEstate.ok) {
        real_estates = await FetchFavoritesRealEstate.json()
    } else {
        return new Error("Erreur au niveau des favoris !")
    }

    return {real_estates};

}) satisfies PageServerLoad;

export const actions = {


} satisfies Actions;