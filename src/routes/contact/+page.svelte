<script lang="ts">
	import { encryptText, decryptText } from '$lib/components/utils/func/hash';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// let textToEncrypt = '';
	// let encryptedText = '';
	// let decryptedText = '';
	// let secretKey = '%Yexln1nsXhr@ime@l%'; // Utilisez une clé secrète plus robuste en production

	// function handleEncrypt() {
	// 	encryptedText = encryptText(textToEncrypt, secretKey);
    //     console.log("ICII11111: ", encryptedText)
	// }

	// function handleDecrypt() {
	// 	decryptedText = decryptText(encryptedText, secretKey);
    //     console.log("ICII22222: ", decryptedText)
	// }
</script>

<!-- <main class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-lg">
		<h1 class="text-center text-2xl font-bold text-blue-600">Chiffrement / Déchiffrement</h1>

		<div>
			<label for="textToEncrypt" class="block text-gray-700">Texte à chiffrer</label>
			<input
				id="textToEncrypt"
				type="text"
				bind:value={textToEncrypt}
				class="mt-2 w-full rounded-md border border-gray-300 p-2"
				placeholder="Entrez un texte"
			/>
		</div>

		<div class="flex space-x-4">
			<button
				on:click={handleEncrypt}
				class="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
			>
				Chiffrer
			</button>
			<button
				on:click={handleDecrypt}
				class="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700"
			>
				Déchiffrer
			</button>
		</div>

		<div>
			<label for="encryptedText" class="block text-gray-700">Texte chiffré</label>
			<textarea
				id="encryptedText"
				class="mt-2 w-full rounded-md border border-gray-300 p-2"
				readonly
				rows="4"
				placeholder="Texte chiffré s'affichera ici"
			>
				{encryptedText}
			</textarea>
		</div>

		<div>
			<label for="decryptedText" class="block text-gray-700">Texte déchiffré</label>
			<textarea
				id="decryptedText"
				class="mt-2 w-full rounded-md border border-gray-300 p-2"
				readonly
				rows="4"
				placeholder="Texte déchiffré s'affichera ici"
			>
				{decryptedText}
			</textarea>
		</div>
	</div>
</main> -->
