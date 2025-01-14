<script lang="ts">
	import { X } from 'lucide-svelte';
	import { isOpenContact } from '../../../store';
	import type { ActionData, PageData } from '../../../routes/real_estate/[id]/$types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { FormContactType } from '../app/contact/contact';
	import { fade } from 'svelte/transition';

	export let propertyTitle: string;

	export let data: PageData;

	const { form, errors, enhance } = superForm(data?.form, {
		dataType: 'json',
		onUpdated({ form }) {}
	});

	function onClose() {
		$isOpenContact = false;
	}
</script>

{#if $isOpenContact}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4"
		on:click|self={onClose}
	>
		<div
			class="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
			on:click|stopPropagation
		>
			<button on:click={onClose} class="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
				<X size={24} />
			</button>
			<h2 class="mb-4 text-2xl font-bold">Contacter l'administrateur</h2>
			<p class="mb-4 text-sm text-gray-600">
				Concernant la propriété : {propertyTitle}
			</p>
			<form
				use:enhance
				method="POST"
				action="?/contact_laborde"
				enctype="multipart/form-data"
				class="space-y-6"
			>
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700"> Nom </label>
					<input
						type="text"
						id="name"
						bind:value={$form.name}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4C62] focus:ring-[#1A4C62]"
					/>
					{#if $errors?.name}
						<p class="mt-2 text-sm text-red-600" transition:fade>{$errors.name}</p>
					{/if}
				</div>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700"> Email </label>
					<input
						type="email"
						id="email"
						bind:value={$form.email}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4C62] focus:ring-[#1A4C62]"
					/>
					{#if $errors?.email}
						<p class="mt-2 text-sm text-red-600" transition:fade>{$errors.email}</p>
					{/if}
				</div>
				<div>
					<label for="message" class="block text-sm font-medium text-gray-700"> Message </label>
					<textarea
						id="message"
						bind:value={$form.message}
						required
						rows={4}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4C62] focus:ring-[#1A4C62]"
					></textarea>
					{#if $errors?.message}
						<p class="mt-2 text-sm text-red-600" transition:fade>{$errors.message}</p>
					{/if}
				</div>
				<button
					type="submit"
					class="w-full rounded-md bg-[#1A4C62] px-4 py-2 text-white hover:bg-[#1A4C62] focus:outline-none focus:ring-2 focus:ring-[#1A4C62] focus:ring-offset-2"
				>
					Envoyer
				</button>
			</form>
		</div>
	</div>
{/if}
