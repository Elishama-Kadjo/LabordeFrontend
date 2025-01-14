<script lang="ts">
	import { page } from "$app/stores";

	$: isLoginPage = $page.url.pathname === '/login';
	$: isRegisterPage = $page.url.pathname === '/register';

</script>

<footer class="w-full px-4 py-4 fixed bottom-0">
	<div class="mx-auto flex max-w-7xl items-center justify-between text-sm text-black">
		<div>© LABORDE. 2024. All rights reserved.</div>
		<div class="flex items-center gap-1">
			Powered by
			<a
				href="https://shift.inc"
				class="flex items-center gap-1 text-[#1A4C62] {isLoginPage || isRegisterPage ? 'md:text-white' : 'md:text-[#1A4C62]'} transition-colors"
			>
				elishxmx
				<span role="img" aria-label="rocket">🚀</span>
			</a>
		</div>
	</div>
</footer>

<style lang="postcss"></style>
