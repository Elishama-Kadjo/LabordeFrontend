<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let showPassword: boolean = false;
	let showConfirmPassword: boolean = false;
	let agreeToTerms: boolean = false;

	const { form, errors, delayed, enhance, message } = superForm(data?.form, {
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message && form.message.status !== 401) {
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
</script>

<div class="flex min-h-screen">
	<Toaster />
	<!-- Left Side - Register Form -->
	<div class="flex w-full items-center justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8">
		<div class="w-full max-w-md space-y-8">
			<!-- Header -->
			<div>
				<h2 class="text-2xl font-bold text-gray-900">Inscription</h2>
				<p class="mt-2 text-sm text-gray-600">Ravi de vous compter parmi nous 👋</p>
			</div>

			<!-- Register Form -->
			<form
				use:enhance
				method="POST"
				class="space-y-6"
				action="?/register"
				enctype="multipart/form-data"
			>
				{#if $message && $message.status === 401}
					<p class="rounded-lg border border-red-500 p-5 text-center text-red-500">
						{$message.text}
					</p>
				{/if}
				<div>
					<label for="email" class="sr-only">username</label>
					<input
						id="email"
						type="text"
						name="username"
						bind:value={$form.username}
						required
						class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
						placeholder="Username"
					/>
				</div>
				{#if $errors.username}
					<p class="text-sm text-red-500">{$errors.username[0]}</p>
				{/if}
				<div>
					<label for="email" class="sr-only">Email</label>
					<input
						id="email"
						type="email"
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
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={$form.password}
							required
							class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
							placeholder="Password"
						/>
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
				<div>
					<label for="password" class="sr-only">Confirmation Mot de passe</label>
					<div class="relative">
						<input
							id="password"
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={$form.password_confirm}
							required
							class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
							placeholder="Confirmation Mot de passe"
						/>
						<!-- svelte-ignore event_directive_deprecated -->
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
							on:click={() => (showConfirmPassword = !showConfirmPassword)}
						>
							{#if showConfirmPassword}
								<EyeOff class="h-5 w-5" />
							{:else}
								<Eye class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>
				{#if $errors.password_confirm}
					<p class="text-sm text-red-500">{$errors.password_confirm[0]}</p>
				{/if}
				<div class="flex items-center">
					<input
						id="terms"
						name="terms"
						type="checkbox"
						bind:checked={agreeToTerms}
						required
						class="h-4 w-4 rounded border-gray-300 text-[#1A4C62] focus:ring-[#1A4C62]"
					/>
					<label for="terms" class="ml-2 block text-sm text-gray-900">
						I agree to the
						<a href="/terms" class="font-medium text-[#1A4C62] hover:text-[#1A4C62]">Terms</a>
						and
						<a href="/privacy" class="font-medium text-[#1A4C62] hover:text-[#1A4C62]"
							>Privacy Policy</a
						>
					</label>
				</div>
				{#if $delayed}
					<button
						type="submit"
						class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-[#1A4C62] focus:outline-none focus:ring-2 focus:ring-[#1A4C62] focus:ring-offset-2"
					>
						Create Account
					</button>
				{:else}
					<button
						type="submit"
						class="flex w-full justify-center rounded-lg bg-[#1A4C62] px-4 py-3 text-sm font-medium text-white hover:bg-[#1A4C62] focus:outline-none focus:ring-2 focus:ring-[#1A4C62] focus:ring-offset-2"
					>
						Create Account
					</button>
				{/if}
			</form>

			<p class="text-center text-sm text-gray-600">
				Avez-vous déjà un compte ?
				<a href="/login" class="font-medium text-[#1A4C62] hover:text-[#1A4C62]">
					Connectez-vous
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
