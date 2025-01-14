<script lang="ts">
	import ModalDescription from '$lib/components/utils/ModalDescription.svelte';
	import { onMount } from 'svelte';
	import { isNavBarChange, isOpenContact, isOpenDescription } from '../../../store';
	import type { PageData } from './$types';
	import {
		Share,
		Heart,
		Diamond,
	} from 'lucide-svelte';
	import Badge from '$lib/components/utils/Badge.svelte';
	import ModalContact from '$lib/components/utils/ModalContact.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	let liked: boolean = $state(data?.isLiked);

	function truncate(text: string, maxLength: number) {
		return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
	}

	function toggleExpand() {
		$isOpenDescription = !$isOpenDescription;
	}

	let currentIndex: number = 0;
	let containerWidth: number;
	let container: HTMLElement;
	let images =
		[
			data?.real_estate?.image_first,
			...(data?.real_estate?.images?.map((img) => img.image) || [])
		].filter(Boolean) || [];

	// function nextImage() {
	// 	currentIndex = (currentIndex + 1) % images.length;
	// 	console.log(currentIndex);
	// 	console.log(images);
	// }

	// function prevImage() {
	// 	currentIndex = (currentIndex - 1 + images.length) % images.length;
	// 	console.log(currentIndex);
	// }

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				containerWidth = entry.contentRect.width;
			}
		});

		console.log("onMount isChangeNavBar: ", $isNavBarChange)

		resizeObserver.observe(container);

		return () => {
			resizeObserver.disconnect();
		};
	});
</script>

<div class="mx-auto my-20 max-w-7xl px-4 py-6">
	<!-- Header -->
	<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
		<div class="flex flex-row items-center gap-4">
			<h1 class="text-xl font-semibold">{data?.real_estate?.title}</h1>
			<button class="self-start rounded-3xl bg-[#1A4C62] px-4 py-2 text-white sm:self-auto">
				{data?.real_estate?.real_estate_type == 'rent' ? 'Location' : 'Vente'}
			</button>
		</div>
		<div class="flex gap-4">
			<button class="flex items-center gap-2 hover:underline">
				<Share class="h-5 w-5" />
			</button>
			{#if liked}
				<form
					method="POST"
					action="?/unlike"
					use:enhance={async ({ formData: FormData }) => {
						FormData.append('idRealEstate', data?.real_estate?.id);

						return async ({ result }) => {
							console.log('type unlike: ', result.type)
							if (result.type === 'success') {
								liked = false;
							}
						};
					}}
				>
					<button type="submit" class="flex items-center gap-2 hover:underline">
						<Heart class="h-6 w-6 fill-red-500 text-red-500" />
					</button>
				</form>
			{:else}
				<form
					method="POST"
					action="?/like"
					use:enhance={async ({ formData: FormData }) => {
						FormData.append('idRealEstate', data?.real_estate?.id);

						return async ({ result }) => {
							console.log('type like: ', result.type)
							if (result.type === 'success') {
								liked = true;
							}
						};
					}}
				>
					<button type="submit" class="flex items-center gap-2 hover:underline">
						<Heart class="h-6 w-6 fill-white text-black" />
					</button>
				</form>
			{/if}
		</div>
	</div>

	<!-- Image Grid -->
	<div class="relative mb-8 max-sm:hidden">
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
			<div class="col-span-1 sm:col-span-2 sm:row-span-2">
				<img
					src={data?.real_estate?.image_first}
					alt="Main room view"
					class="h-full w-full rounded-xl object-cover sm:rounded-xl"
				/>
			</div>
			{#each data?.real_estate?.images ?? [] as image, i}
				<img
					src={image?.image}
					alt={`Room view ${i + 1}`}
					class="h-full w-full object-cover sm:rounded-xl"
				/>
			{/each}
		</div>
	</div>

	<div class="relative mb-8" bind:this={container}>
		<!-- Mobile Slider -->
		<div class="relative sm:hidden">
			<div
				class="flex overflow-x-auto transition-transform duration-300 ease-in-out"
				style="transform: translateX(-{currentIndex * 100}%)"
			>
				{#each [data?.real_estate?.image_first, ...(data?.real_estate?.images?.map((img) => img.image) || [])].filter(Boolean) as image, i}
					<img src={image} alt={`Room view ${i}`} class="h-96 w-full flex-shrink-0 object-cover" />
				{/each}
			</div>
			<!-- <button
				class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md"
				onclick={prevImage}
			>
				<ChevronLeft size={24} />
			</button>
			<button
				class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md"
				onclick={nextImage}
			>
				<ChevronRight size={24} />
			</button> -->
		</div>

		<!-- Content -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Left Column -->
			<div class="space-y-6 md:col-span-2">
				<div class="flex flex-col border-b pb-6">
					<h2 class="mb-4 mt-4 text-xl font-semibold">{data?.real_estate?.title}</h2>
					<p class="text-sm leading-7 text-black">
						{@html truncate(data?.real_estate?.description ?? '', 500)}
					</p>
					{#if data?.real_estate?.description?.length || 0 > 300}
						<button
							class="mt-2 text-sm font-medium text-[#1A4C62] hover:underline"
							onclick={toggleExpand}
						>
							Voir plus
						</button>
					{/if}
				</div>

				<div
					class="flex gap-4 pb-6 {data?.real_estate?.has_pool || data?.real_estate?.has_garden
						? 'border-b'
						: ''}"
				>
					{#if data?.real_estate?.has_pool}
						<Badge badge={'Piscine'} />
					{/if}
					{#if data?.real_estate?.has_garden}
						<Badge badge={'Jardin'} />
					{/if}
				</div>

				<!-- Ratings -->
				<div class="flex items-center gap-4 py-4">
					<div class="flex items-center gap-2">
						<span>★</span>
						<span>4,94</span>
					</div>
					<div class="text-gray-600">·</div>
					<div>140 Commentaires</div>
				</div>

				<!-- Special Badge -->
				<div class="flex items-center gap-2 rounded-lg border p-4">
					<Diamond class="h-6 w-6 flex-shrink-0 text-pink-500" />
					<div>
						<p class="font-medium">C'est une perle rare</p>
						<p class="text-sm text-gray-600">
							Le logement proposé par Margaret affiche généralement complet.
						</p>
					</div>
				</div>
			</div>

			<!-- Right Column -->
			<div class="rounded-lg border p-6">
				<h3 class="text-lg font-semibold">Réservez votre visite</h3>
				<p class="mt-2 text-sm text-gray-600">Contactez-nous pour plus d'informations.</p>
				{#if $page.data.user}
					<button
						onclick={() => ($isOpenContact = true)}
						class="mt-4 w-full rounded-lg bg-[#1A4C62] px-4 py-2 text-white hover:bg-[#1A4C62]"
					>
						Contacter l'agent
					</button>
				{:else}
					<button
						onclick={() => goto('/login')}
						class="mt-4 w-full rounded-lg bg-[#1A4C62]/90 px-4 py-2 text-white hover:bg-[#1A4C62]"
					>
						Se connecter d'abord
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

{#if $isOpenDescription === true}
	<ModalDescription real_estate={data?.real_estate} />
{/if}

{#if $isOpenContact}
	<ModalContact data={data} propertyTitle={data?.real_estate?.title ?? ''} />
{/if}

<style lang="postcss">
</style>
