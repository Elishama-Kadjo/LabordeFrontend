<script lang="ts">
	import type { RealEstate } from '../../../app';
	import { Heart } from 'lucide-svelte';
	import { isNavBarChange } from '../../../store';
	import { page } from '$app/stores';

	export let real_estate: RealEstate;
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<a
	href="/real_estate/{real_estate.slug}"
	on:click={() => {
		$isNavBarChange = true;
		console.log('isNavBarChange: true');
	}}
	class="group relative"
>
	<!-- Image Container with Navigation Dots -->
	<div class="relative aspect-square overflow-hidden rounded-xl">
		<img
			src={real_estate.image_first}
			alt={real_estate.title}
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>
		<!-- Favorite Button -->
		<button class="absolute left-3 top-3 z-10 rounded-3xl bg-[#1A4C62] px-4 py-2 text-white">
			{real_estate?.real_estate_type == 'rent' ? 'Location' : 'Vente'}
		</button>

		<!-- Favorite Button -->
		<button
			class="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-colors hover:bg-white/10"
		>
			{#if $page.data.user}
				{#if real_estate?.likes <= 0}
					<Heart class="h-6 w-6 text-white" />
				{:else}
					<Heart class="h-6 w-6 fill-red-500 text-red-500" />
				{/if}
			{/if}
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
			<h3 class="font-medium">{real_estate.title}</h3>
			<div class="flex items-center gap-1">
				<span class="flex items-center text-sm">
					<Heart class="h-4 w-4 fill-red-500 text-red-500 mr-1" />{real_estate.likes}</span
				>
			</div>
		</div>
		<p class="text-sm">
			<span class="font-medium text-gray-600">{real_estate.price} FCFA</span>
		</p>
	</div>
</a>

<style lang="postcss">
</style>
