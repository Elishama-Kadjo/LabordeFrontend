<script lang="ts">
	import { browser } from '$app/environment';
	import { Menu, X } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { isOpenLogin } from '../../../store';

	let isDropdownOpen = false;
	let isMobileMenuOpen = false;
	let isScrolled = false;
	$: isLoginPage = $page.url.pathname === '/login';
	$: isRegisterPage = $page.url.pathname === '/register';

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function closeDropdown() {
		isDropdownOpen = false;
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	function handleScroll() {
		isScrolled = window.scrollY > 0;
	}

	if (browser) {
		window.addEventListener('scroll', handleScroll);
	}
</script>

<header
	class="fixed top-0 z-50 w-full transition-colors duration-300"
	class:bg-white={isScrolled || isMobileMenuOpen}
	class:text-black={isScrolled || isMobileMenuOpen}
	class:bg-transparent={!isScrolled && !isMobileMenuOpen}
	class:text-white={!isScrolled && !isMobileMenuOpen}
>
	<div class="px-4 sm:px-6 md:px-10 lg:px-20">
		<div class="flex h-20 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="z-10 flex-none">
				<img src="/logo-rent.PNG" class="h-32 w-48 rounded-lg" height="28" alt="Logo" />
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden items-center space-x-4 md:flex">
				<ul
					class="flex items-center space-x-6 {isLoginPage || isRegisterPage
						? 'text-white'
						: 'text-[#1A4C62]'} font-medium"
				>
					<li class="cursor-pointer text-sm font-medium">
						<a href="/real_estate">Acheter</a>
					</li>
					<li class="cursor-pointer text-sm">
						<a href="/real_estate">Louer</a>
					</li>
					<li class="cursor-pointer text-sm">
						<a href="/contact">Contactez-nous</a>
					</li>
				</ul>

				<!-- User Menu -->
				<div class="relative">
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						on:click={toggleDropdown}
						class="flex items-center space-x-2 rounded-full border border-[#1A4C62] {isLoginPage || isRegisterPage
							? 'border-white text-white'
							: 'border-[#1A4C62] text-[#1A4C62]'} p-2 transition-shadow"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-8 w-8"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-chevron-down"
							viewBox="0 0 16 16"
						>
							<path
								fill-rule="evenodd"
								d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
							/>
						</svg>
					</button>

					{#if isDropdownOpen}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div
							class="absolute right-0 z-10 mt-2 w-56 rounded-lg bg-white shadow-lg"
						>
							<ul class="py-2 text-gray-700">
								{#if $page.data.user}
									<li>
										<a href="/favoris" on:click={closeDropdown} class="block cursor-pointer px-4 py-2 hover:bg-gray-100">
											Favoris
										</a>
									</li>
									<li>
										<a href="/profile" on:click={closeDropdown} class="block cursor-pointer px-4 py-2 hover:bg-gray-100">
											Profile
										</a>
									</li>
									<li>
										<form method="POST" action="/logout">
											<button
												type="submit"
												class="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
											>
												Se déconnecter
											</button>
										</form>
									</li>
								{:else}
									<li>
										<a href="/register" class="block cursor-pointer px-4 py-2 hover:bg-gray-100">
											Inscription
										</a>
									</li>
									<li>
										<a href="/login" class="block cursor-pointer px-4 py-2 hover:bg-gray-100">
											Connexion
										</a>
									</li>
								{/if}
							</ul>
						</div>
					{/if}
				</div>
			</div>

			<!-- Mobile Menu Button -->
			<button class="z-10 md:hidden" on:click={toggleMobileMenu}>
				{#if isMobileMenuOpen}
					<X class="h-6 w-6 text-[#1A4C62]" />
				{:else}
					<Menu class="h-6 w-6 text-[#1A4C62]" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Full-screen Mobile Menu -->
	{#if isMobileMenuOpen}
		<div class="fixed inset-0 z-40 overflow-y-auto bg-white md:hidden">
			<X
				onclick={() => {
					isMobileMenuOpen = false;
					document.body.style.overflow = '';
				}}
				class="absolute right-6 top-6 h-6 w-6 cursor-pointer"
			/>
			<div class="flex h-full flex-col px-4 pt-20">
				<ul class="space-y-4 text-center text-black">
					<li>
						<a href="/real_estate" class="block py-2 text-lg" on:click={toggleMobileMenu}>Acheter</a
						>
					</li>
					<li>
						<a href="/real_estate" class="block py-2 text-lg" on:click={toggleMobileMenu}>Louer</a>
					</li>
					<li>
						<a href="/contact" class="block py-2 text-lg" on:click={toggleMobileMenu}
							>Contactez-nous</a
						>
					</li>
					{#if $page.data.user}
						<li>
							<a href="/favoris" class="block py-2 text-lg" on:click={toggleMobileMenu}>Favoris</a>
						</li>
						<li>
							<a href="/profile" class="block py-2 text-lg" on:click={toggleMobileMenu}>Profile</a>
						</li>
						<li>
							<form method="POST" action="/logout">
								<button
									type="submit"
									class="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#1A4C62] py-2 text-lg text-white"
								>
									Se déconnecter
								</button>
							</form>
						</li>
					{:else}
						<li>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<a
								href="/register"
								on:click={() => {
									toggleMobileMenu();
								}}
								class="block cursor-pointer py-2 text-lg"
							>
								Inscription
							</a>
						</li>
						<li>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<a
								href="/login"
								on:click={() => {
									toggleMobileMenu();
								}}
								class="block cursor-pointer py-2 text-lg"
							>
								Connexion
							</a>
						</li>
					{/if}
				</ul>
			</div>
		</div>
	{/if}
</header>
