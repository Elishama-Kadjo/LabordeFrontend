<script lang="ts">
	import { Search, Heart, ArrowRight } from 'lucide-svelte';
	import Card from '$lib/components/utils/Card.svelte';
	import type { PageData } from './$types';
	import type { RealEstate } from '../app';

	let { data }: { data: PageData } = $props();

	let real_estates: RealEstate[] = data.real_estates ?? [];

</script>

<header class="relative min-h-[600px] w-full">
	<!-- Background Image with Overlay -->
	<div class="absolute inset-0 bg-black/40">
		<img
			src="/home-bg.jpg"
			alt="Background"
			class="h-full w-full object-cover"
		/>
	</div>

	<!-- Hero Content -->
	<div class="z-10 mx-auto max-w-6xl px-4 pt-20 md:relative">
		<!-- Search Bar -->
		<div class="mb-16 mt-5 rounded-full bg-white p-2 shadow-lg max-md:hidden">
			<form class="flex flex-col items-center gap-2 md:flex-row">
				<input
					type="text"
					placeholder="Lieu"
					class="flex-1 rounded-full px-6 py-3 text-sm outline-none md:text-base"
				/>
				<input
					type="text"
					placeholder="Type de bien"
					class="flex-1 rounded-full px-6 py-3 text-sm outline-none md:text-base"
				/>
				<input
					type="text"
					placeholder="Budget"
					class="flex-1 rounded-full px-6 py-3 text-sm outline-none md:text-base"
				/>
				<button type="submit" class="rounded-full bg-[#1A4C62] p-3 text-white hover:bg-[#1A4C62]">
					<Search class="h-6 w-6" />
				</button>
			</form>
		</div>

		<!-- Hero Text -->
		<div
			class="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] text-center text-white sm:static sm:left-auto sm:top-auto sm:translate-x-0 sm:translate-y-0"
		>
			<h1 class="mb-4 text-4xl font-bold leading-tight sm:text-4xl md:text-5xl">
				Notre vocation : <br />
				dénicher votre futur lieu de vie.
			</h1>
			<p class="mb-8 text-base opacity-90 sm:text-lg">
				Notre vocation est de dénicher des lieux de vie incroyables.
			</p>
			<button
				class="rounded-full bg-[#1A4C62] px-6 py-3 text-sm font-medium text-white hover:bg-[#1A4C62] sm:px-8 sm:py-3 sm:text-base"
			>
				Rencontrons-nous
			</button>
		</div>
	</div>
</header>

<section class="mx-auto max-w-7xl px-4 py-12">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="text-2xl font-medium text-gray-900">Nos derniers coups de</span>
			<Heart class="h-6 w-6 fill-current text-red-500" />
		</div>

		<a
			href="/carte"
			class="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
		>
			<span>Voir sur la carte</span>
			<ArrowRight class="h-5 w-5" />
		</a>
	</div>

	<div class="grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
		{#each real_estates as real_estate (real_estate.id)}
			<Card {real_estate} />
		{/each}
	</div>
</section>

<style lang="postcss"></style>
