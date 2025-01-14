<script lang="ts">
	import {
		Share,
		Heart,
		Diamond,
		ChevronLeft,
		ChevronRight,
		WavesLadder,
		Fence
	} from 'lucide-svelte';

	export let badge: string;
</script>

<div class="inline-flex flex-col items-center rounded-xl border bg-white p-4 shadow-sm">
	{#if badge === 'Piscine'}
		<WavesLadder class="h-6 w-6 text-gray-600" />
	{:else}
		<Fence class="h-6 w-6 text-gray-600" />
	{/if}
	<h3 class="mt-2 text-base font-medium text-gray-900">{badge}</h3>
	<p class="text-sm text-gray-600">{badge} inclus</p>
</div>
