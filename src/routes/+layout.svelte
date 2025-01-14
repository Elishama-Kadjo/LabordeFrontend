<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/navbar/NavBar.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';

</script>

<section>
	<NavBar />
	<main class="">
		<slot />
	</main>
	<Footer />
</section>
