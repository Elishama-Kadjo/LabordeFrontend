<script lang="ts">
	import { X } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import type { RealEstate, RealEstateDetail } from '../../../app';
	import { isOpenDescription } from '../../../store';

	export let real_estate: RealEstateDetail | undefined;

	function onClose() {
		$isOpenDescription = false;
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-5"
	on:click={onClose}
	transition:fade={{ duration: 200 }}
>
	<div
		class="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
		on:click|stopPropagation
		transition:fly={{ y: 50, duration: 300 }}
	>
		<button class="absolute right-4 top-4 text-gray-400 hover:text-gray-600" on:click={onClose}>
			<X size={24} />
		</button>
		<h2 class="mt-4 mb-4 text-2xl font-bold">{real_estate?.title}</h2>
		<div class="max-h-[60vh] overflow-y-auto">
			<p class="text-sm leading-7">{@html real_estate?.description}</p>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
