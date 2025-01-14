// Hook: permet une vérification du token avant de laisser aller la requête au serveur
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';
import type { User } from './app';
import { characters, reconstructToken, symbols } from '$lib/components/utils/func/hash';
import { SECRET_KEY } from '$env/static/private';
import { get } from 'svelte/store';

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

async function ClearCookie(event: any) {
    event.cookies.delete('access_token', { path: "/" })
    event.cookies.delete('refresh_token', { path: "/" })
}

async function setCookie(event: any, token: string | null, refresh: string | undefined) {

    if (token) {
        event.cookies.set('wb', token, {
            path: '/',
            httpOnly: true, // Garantir que le cookie est inaccessible au client côté JavaScript
            maxAge: 60 * 60   // Durée de vie en secondes
        });
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
    await event.cookies.set('wb', '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0)
    });

    await event.cookies.set('_wbr_', '', {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        expires: new Date(0)
    });

    for (let i = 0; i < 7; i++) {
        const cookieName = `${characters[i]}_${symbols[i]}${String.fromCharCode(97 + i)}_`;
        event.cookies.set(cookieName, '', {
            httpOnly: true,
            path: '/',
            maxAge: 0 // Expirer immédiatement
        });
    }      

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

    let token_recupered: string | null = null;

    if(event.cookies.get("wb")) {
        token_recupered = reconstructToken(event.cookies, SECRET_KEY)
    }

    const refresh_token = event.cookies.get('_wbr_');

    // s'il n'y a pas d'access_token
    if (!token_recupered) {
        console.log("Il y'a pas d'access token !!")
        return resolve(event);
    }

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