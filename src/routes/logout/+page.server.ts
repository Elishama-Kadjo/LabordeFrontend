import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { removeTokenCookies  } from '$lib/components/utils/func/hash';

// vérifie que l'utilisateur est connecté ou pas
export const load = (async ({cookies}) => {
    if(!cookies.get('wb')) {
        throw redirect(303, '/login');
    }

    return {};
}) satisfies PageServerLoad;

// Création des actions
export const actions: Actions = {
    // action pour déconnecter l'utilisateur
    default: ({cookies, locals}) => {

        removeTokenCookies(cookies);

        cookies.set('_wbr_', '', {
            httpOnly: true,
            path: '/',
            maxAge: 0 // Expirer immédiatement
        });


        locals.user = null

        throw redirect(303, "/login");
    }  
}
