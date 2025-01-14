<script lang="ts">
    import type { PageData } from './$types';    
	import { Search, Heart, ArrowRight } from 'lucide-svelte';
	import Card from '$lib/components/utils/Card.svelte';
	import type { RealEstate } from '../../app';
    
    let { data }: { data: PageData } = $props();

    let real_estates: RealEstate[] = data.real_estates ?? [];

</script>

<header class="relative min-h-[400px] w-full">
	<!-- Background Image with Overlay -->
	<div class="absolute inset-0 bg-black/40">
		<img
			src="/home-bg.jpg"
			alt="Background"
			class="h-full w-full object-cover"
		/>
	</div>

	<!-- Hero Content -->
	<div class="relative z-10 mx-auto max-w-6xl px-4 pt-20">
        <!-- Hero Text -->
		<div class="text-center text-white">
            <br />
			<h1 class="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
				Notre Rubrique : <br />
				dénicher votre futur lieu de vie.
			</h1>
			<p class="mb-8 text-lg opacity-90">
				Veuillez prendre part de nos propriétés disponibles dans cette rubrique
			</p>
			<button class="rounded-full bg-[#1A4C62] px-8 py-3 font-medium text-white hover:bg-[#1A4C62]">
				Visitez
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