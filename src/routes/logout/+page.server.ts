import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { characters, symbols } from '$lib/components/utils/func/hash';

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
        cookies.set('wb', '', {
            httpOnly: true,
            path: '/',
            maxAge: 0 // Expirer immédiatement
        });

        cookies.set('_wbr_', '', {
            httpOnly: true,
            path: '/',
            maxAge: 0 // Expirer immédiatement
        });

        for (let i = 0; i < 7; i++) {
            const cookieName = `${characters[i]}_${symbols[i]}${String.fromCharCode(97 + i)}_`;
            cookies.set(cookieName, '', {
                httpOnly: true,
                path: '/',
                maxAge: 0 // Expirer immédiatement
            });
        }      

        locals.user = null

        throw redirect(303, "/login");
    }  
}
