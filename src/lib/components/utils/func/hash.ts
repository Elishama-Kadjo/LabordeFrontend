import CryptoJS from 'crypto-js';
import { env } from '$env/dynamic/private';
// TODO: je me suis permis de changer tout le code ici

// Les noms de cookies mentionnés contiennent des caractères interdits ou problématiques selon le RFC 2616.
// https://datatracker.ietf.org/doc/html/rfc2616#section-2.2

// Noms des parties du token
const TOKEN_PARTS = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta'];

// Fonction pour découper le token en 7 parties
export function splitToken(token: string): string[] {
  const numParts = TOKEN_PARTS.length;
  const partLength = Math.floor(token.length / numParts);
  const remainder = token.length % numParts;
  const parts: string[] = [];

  let start = 0;
  for (let i = 0; i < numParts; i++) {
    const end = start + partLength + (i < remainder ? 1 : 0);
    parts.push(token.slice(start, end));
    start = end;
  }

  return parts;
}

// Fonction pour stocker le token chiffré dans les cookies
export function storeTokenInCookies(token: string, cookies: any): void {
  const parts = splitToken(token);
  
  parts.forEach((part, index) => {
    const encryptedPart = encryptText(part);
    cookies.set(`token_${TOKEN_PARTS[index]}`, encryptedPart, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/' 
    });
  });
}

// Fonction pour reconstituer le token à partir des cookies
export function reconstructToken(cookies: any): string | null{
  let reconstructedToken = '';
  
  for (const partName of TOKEN_PARTS) {
    const cookieName = `token_${partName}`;
    const encryptedPart = cookies.get(cookieName);
    
    if (encryptedPart) {
      const decryptedPart = decryptText(encryptedPart);
      reconstructedToken += decryptedPart;
    } else {
      return null;
    }
  }

  return reconstructedToken;
}

// Fonction pour chiffrer le texte
function encryptText(text: string): string {
  if (!env.SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in environment variables');
  }
  return CryptoJS.AES.encrypt(text, env.SECRET_KEY).toString();
}

// Fonction pour déchiffrer le texte
function decryptText(ciphertext: string): string {
  if (!env.SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in environment variables');
  }
  const bytes = CryptoJS.AES.decrypt(ciphertext,env.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Fonction pour vérifier si tous les cookies du token sont présents
export function areAllTokenCookiesPresent(cookies: any): boolean {
  return TOKEN_PARTS.every(partName => cookies.get(`token_${partName}`));
}

// Fonction pour supprimer tous les cookies du token
export function removeTokenCookies(cookies: any): void {
  TOKEN_PARTS.forEach(partName => {
    cookies.set(`token_${partName}`, '', {
			httpOnly: true,
			sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
			path: '/',
			expires: new Date(0)
		});
  });
}