<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data : PageData;


	let showPassword: boolean = false;

	const { form, errors, delayed, enhance, timeout, message } = superForm(data?.form, {
		dataType: 'json',
		onUpdated({ form }) {
			if (form?.message) {
				console.log('Message reçu dans onUpdated :', form.message);
				toast(form.message.text, {
					icon: form.message.type == 'success' ? '✅' : '❌',
					
				});

				// Attendez la fin du toast, puis redirigez
				setTimeout(() => {
					if (form?.message?.type === 'success') {
						goto('/');
					}
				}, 3000);
			}
		}
	});
</script>

<div class="flex min-h-screen">
	<Toaster />
	<!-- Left Side - Register Form -->
	<div class="flex w-full items-center justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8">
		<div class="w-full max-w-md space-y-8">
			<!-- Header -->
			<div>
				<h2 class="text-2xl font-bold text-gray-900">Connexion</h2>
				<p class="mt-2 text-sm text-gray-600">Ravi de vous revoir 👋</p>
			</div>

			<!-- Register Form -->
			<form
				use:enhance
				method="POST"
				class="space-y-6"
				action="?/login"
				enctype="multipart/form-data"
			>
				<div>
					<label for="email" class="sr-only">username</label>
					<input
						id="email"
						type="email"
						name="email"
						bind:value={$form.email}
						required
						class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
						placeholder="Email"
					/>
				</div>
				{#if $errors.email}
					<p class="text-sm text-red-500">{$errors.email[0]}</p>
				{/if}
				<div>
					<label for="password" class="sr-only">Mot de passe</label>
					<div class="relative">
						
						{#if !showPassword}
							<input
							id="password"
							type='password'
							bind:value={$form.password}
							required
							class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
							placeholder="Password"
							/>
						{:else}
							<input
							id="password"
							type='text'
							bind:value={$form.password}
							required
							class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
							placeholder="Password"
							/>
						{/if}
						<!-- svelte-ignore event_directive_deprecated -->
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
							on:click={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff class="h-5 w-5" />
							{:else}
								<Eye class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>
				{#if $errors.password}
					<p class="text-sm text-red-500">{$errors.password[0]}</p>
				{/if}
				<p class="text-right text-sm text-gray-600">
					<a href="/reset_password/" class="font-medium text-[#1A4C62] hover:text-[#1A4C62]">
						Mot de passe oublié ?
					</a>
				</p>
				<button
					type="submit"
					class="flex w-full justify-center rounded-lg bg-[#1A4C62] px-4 py-3 text-sm font-medium text-white hover:bg-[#1A4C62] focus:outline-none focus:ring-2 focus:ring-[#1A4C62] focus:ring-offset-2"
				>
					Se connecter
				</button>
			</form>

			<p class="text-center text-sm text-gray-600">
				Vous n'avez pas de compte ?
				<a href="/register" class="font-medium text-[#1A4C62] hover:text-[#1A4C62]">
					Inscrivez-vous
				</a>
			</p>
		</div>
	</div>

	<!-- Right Side - Image -->
	<div class="hidden lg:block lg:w-1/2">
		<div
			class="flex h-full flex-col items-center justify-center bg-[#1A4C62] px-8 text-center text-white"
		>
			<div class="max-w-md">
				<img
					src="/logo-rent.PNG"
					alt="Dashboard Preview"
					class="mx-auto mb-8 w-full max-w-sm bg-white"
				/>
				<!-- <h2 class="text-2xl font-bold">Une inscription, plusieurs possibilités</h2>
				<p class="mt-2 text-blue-200">Toutes sortes de biens immobiliers à votre disposition</p> -->
			</div>
		</div>
	</div>
</div>
