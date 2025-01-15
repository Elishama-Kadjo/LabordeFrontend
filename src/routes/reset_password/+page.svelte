<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import toast, { Toaster } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	export let data : PageData;


	const { form, errors, delayed, enhance } = superForm(data?.form, {
		dataType: 'json',
		onUpdated({ form }) {
			console.log('Message reçu dans onUpdated :', form.message);

			// Affichage du toast avec le message reçu du backend
			if (form?.message) {
				console.log('Message reçu dans onUpdated :', form.message);
				toast(form.message.text, {
					icon: form.message.type == 'success' ? '✅' : '❌'
				});
			}
		}
	});
</script>

<div class="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
	<Toaster />
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-3xl font-extrabold text-[#1A4C62]">
			Réinitialisation du mot de passe
		</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
			<form
				use:enhance
				method="POST"
				action="?/reset_password"
				enctype="multipart/form-data"
				class="space-y-6"
			>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">
						Adresse e-mail
					</label>
					<div class="mt-1">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							bind:value={$form.email}
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							placeholder="vous@exemple.com"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md border border-transparent bg-[#1A4C62] px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Envoyer le lien de réinitialisation
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
