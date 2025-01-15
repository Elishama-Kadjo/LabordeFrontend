// Hook: permet une vérification du token avant de laisser aller la requête au serveur
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';
import type { User } from './app';
import { reconstructToken, removeTokenCookies as RemoveToken, storeTokenInCookies } from '$lib/components/utils/func/hash';


//TODO: on doit revoir le systeme de cookie et proposer quelque chose de plus optimal
// Le web n'accepete plus ce type.

// J'ai implementer seulement pour le acces_token
// le refresh est toujours dans le _wbr_

const getUser = async (access_token: string | undefined) => {
    const response = await fetch(`${env.URL_API}/api/v0/auth/user/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    })

    if (response.ok) {
        return response.json()
    }

    throw new Error("impossible de récuperer l'utilisateur !")
}

async function removeTokenCookies(event: any) {
    RemoveToken(event.cookies);
    event.cookies.delete('_wbr_', { path: "/" })
}

async function setCookie(event: any, token: string | null, refresh: string | undefined) {

    if(token){
        storeTokenInCookies(token, event.cookies);
    }

    if (refresh) {
        event.cookies.set('_wbr_', refresh, {
            path: '/',
            httpOnly: true, // Garantir que le cookie est inaccessible au client côté JavaScript
            maxAge: 60 * 60 * 24 * 7   // Une semaine
        });
    }

}

// Helper function to clear authentication cookies
async function clearCookies(event: any): Promise<void> {
    await removeTokenCookies(event);
}

async function verifyToken(token: string) {
    const response = await fetch(`${env.URL_API}/api/v0/auth/token/verify/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
    });

    return response.ok
}

async function refreshToken(token: string | undefined) {
    const response = await fetch(`${env.URL_API}/api/v0/auth/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    return response.json();
}


export const handle: Handle = async ({ event, resolve }) => {

    let token_recupered: string | null = reconstructToken(event.cookies) ?? ""; 
    
    const refresh_token = event.cookies.get('_wbr_');

    // vérification si l'access_token est valide
    try {
        let isAccessTokenValid: boolean = await verifyToken(token_recupered);

        if (!isAccessTokenValid) {
            if (refresh_token) {
                const new_token = await refreshToken(refresh_token);

                // set Cookies
                await setCookie(event, new_token.access, refresh_token);

                // set the user in the locals interface
                const user: User = await getUser(token_recupered);
                event.locals.user = user; // set the user in the locals interface

            } else {
                throw new Error('No valid tokens available');
            }
        } else {
            const user: User = await getUser(token_recupered);
            event.locals.user = user; // set the user in the locals interface
        }

    } catch (error) {
        await clearCookies(event);
        return resolve(event);
    }

    return resolve(event);
};