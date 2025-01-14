<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import toast, { Toaster } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

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

			// Attendez la fin du toast, puis redirigez
			setTimeout(() => {
				if (form?.message?.type === 'success') {
					goto('/login');
				}
			}, 3000);
		}
	});

	let token: string | null = data?.token;
</script>

<div class="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
	<Toaster />
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Réinitialisation du mot de passe
			</h2>
		</div>
		<form
			use:enhance
			class="mt-8 space-y-6"
			method="POST"
			action="?/confirm_reset_password"
			enctype="multipart/form-data"
		>
			<input type="hidden" name="token" value={token} />

			<div class="-space-y-px rounded-md shadow-sm">
				<div>
					<label for="password" class="sr-only">Nouveau mot de passe</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						placeholder="Nouveau mot de passe"
						bind:value={$form.password}
					/>
					{#if $errors.password}
						<p class="mt-2 text-sm text-red-600" transition:fade>{$errors.password}</p>
					{/if}
				</div>
				<div>
					<label for="confirm-password" class="sr-only">Confirmer le mot de passe</label>
					<input
						id="confirm-password"
						name="confirm-password"
						type="password"
						required
						class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						placeholder="Confirmer le mot de passe"
						bind:value={$form.password_confirm}
					/>
					{#if $errors.password_confirm}
						<p class="mt-2 text-sm text-red-600" transition:fade>{$errors.password_confirm}</p>
					{/if}
				</div>
			</div>
			<p class="text-right text-sm text-gray-600">
				<a href="/reset_password/" class="font-medium text-[#1A4C62] hover:text-[#1A4C62]">
                    Faire une autre demande
                </a>
			</p>

			<div>
				<button
					type="submit"
					class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Réinitialiser le mot de passe
				</button>
			</div>
		</form>
	</div>
</div>
