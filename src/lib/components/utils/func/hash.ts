import CryptoJS from 'crypto-js';

export let characters = ["y", "e", "x", "l", "i", "n", "%"]
export let symbols = ["_", "-", "i", "+", "p", "#", "h"]

// Fonction pour découper le token en 7 parties égales
export function splitTokenIntoParts(token: string, numParts: number): string[] {
  const partLength = Math.floor(token.length / numParts); // Longueur de base de chaque partie
  const remainder = token.length % numParts; // Reste des caractères à répartir
  const parts: string[] = [];

  let start = 0;
  
  for (let i = 0; i < numParts; i++) {
    // Si la partie courante doit recevoir un caractère supplémentaire
    const end = start + partLength + (i < remainder ? 1 : 0);
    parts.push(token.slice(start, end));
    start = end; // Met à jour la position de départ pour la prochaine partie
  }

  return parts;
}


// Fonction pour reconstituer le token
export function reconstructToken(cookies: any, secretKey: string): string {
  let reconstructedToken = '';
  
  // Récupérer et décrypter chaque partie
  for (let i = 0; i < 7; i++) {
      const cookieName = `${characters[i]}_${symbols[i]}${String.fromCharCode(97 + i)}_`;
      const encryptedPart = cookies.get(cookieName);
      
      if (encryptedPart) {
          const decryptedPart = decryptText(encryptedPart, secretKey);
          reconstructedToken += decryptedPart;
      } else {
          throw new Error(`Cookie ${cookieName} not found`);
      }
  }

  return reconstructedToken;
}

// Fonction pour chiffrer le texte (access_token)
export function encryptText(text:string, secretKey:string) {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
  return ciphertext;
}

// Fonction pour déchiffrer le texte (access_token)
export function decryptText(ciphertext:string, secretKey:string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
}
  