<script lang="ts">
	import { Heart, Archive, Home } from 'lucide-svelte';
	import type { PageData } from './$types';
	import type { RealEstate, RealEstateFavorite } from '../../app';
	import Card from '$lib/components/utils/Card.svelte';

	export let data : PageData;

	let favorites: RealEstateFavorite[] = data?.favorites;

	console.log('fav +page: ', favorites);
</script>

<section class="mx-auto mt-16 max-w-7xl px-4 py-12">
	{#if favorites.length > 0}
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<span class="text-2xl font-medium text-gray-900">Vos Biens Favoris</span>
				<Heart class="h-6 w-6 fill-current text-red-500" />
			</div>
			<p class="text-sm font-medium underline">
				<span class="text-red-500">{favorites.length}</span>
				Biens en favoris
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
			{#each favorites as favorite (favorite.id)}
				<!-- svelte-ignore a11y_missing_attribute -->
				<a href="/real_estate/{favorite?.real_estate.slug}" class="group relative">
					<!-- Image Container with Navigation Dots -->
					<div class="relative aspect-square overflow-hidden rounded-xl">
						<img
							src="http://localhost:8000{favorite?.real_estate.image_first}"
							alt={favorite?.real_estate.title}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
						<!-- Favorite Button -->
						<button
							class="absolute left-3 top-3 z-10 rounded-3xl bg-[#1A4C62] px-4 py-2 text-white"
						>
							{favorite?.real_estate?.real_estate_type == 'rent' ? 'Location' : 'Vente'}
						</button>

						<!-- Favorite Button -->
						<button
							class="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-colors hover:bg-white/10"
						>
							<Heart class="h-6 w-6 fill-red-500 text-red-500" />
						</button>
						<!-- Navigation Dots -->
						<div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
							<!-- svelte-ignore a11y_consider_explicit_label -->
							<button class="h-1.5 w-1.5 rounded-full bg-white/60 transition-colors hover:bg-white">
							</button>
						</div>
					</div>

					<!-- real_estate Details -->
					<div class="mt-3 space-y-1">
						<div class="flex items-center justify-between">
							<h3 class="font-medium">{favorite?.real_estate.title}</h3>
							<div class="flex items-center gap-1">
								<span class="text-sm">★</span>
								<span class="text-sm">{4.8}</span>
							</div>
						</div>
						<p class="text-sm text-gray-600">Hôte: Elishama</p>
						<p class="text-sm">
							<span class="font-medium">{favorite?.real_estate.price} FCFA</span>
						</p>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div
			class="mx-auto flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-[#f5f5f5] to-[#e0e0e0] p-10 text-center"
		>
			<Home class="mb-6 h-24 w-24 text-[#1A4C62]" />
			<h2 class="mb-4 text-3xl font-bold text-[#1A4C62]">Vos Favoris sont Vides</h2>
			<p class="mb-8 max-w-md text-xl text-gray-600">
				Découvrez des biens immobiliers exceptionnels et ajoutez-les à vos favoris pour les
				retrouver facilement !
			</p>
			<a
				href="/real_estate"
				class="rounded-full bg-[#1A4C62] px-6 py-3 text-lg font-semibold text-white transition-colors duration-300 hover:bg-[#15374A]"
			>
				Explorer les Biens
			</a>
		</div>
	{/if}
</section>
