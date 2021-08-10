<script>
	import { onMount } from 'svelte';

	onMount(() => {
		(function toggle() {
			document.getElementById('nav-toggle').onclick = function () {
				document.getElementById('nav-content').classList.toggle('hidden');
			};
		})();
	});
</script>

<nav
	class="fixed z-50 flex flex-wrap items-center justify-between w-full p-4 bg-none sm green  pin-t"
>
	<div class="flex items-center mr-6 text-white flex-no-shrink" />
	<a
		class="inline-block px-4 py-2 no-underline text-2xl  hover:text-white hover:text-underline font-extrabold"
		href="/"
	>
		Elleven<span class="tomato-text ">15</span>
	</a>
	<div class="block text-white lg:hidden">
		<button
			id="nav-toggle"
			class="flex items-center px-3 py-2 border rounded text-grey border-grey-dark hover:text-white hover:border-white"
		>
			<svg class="w-3 h-3 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<title>Menu</title>
				<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
			</svg>
		</button>
	</div>

	<div
		class="flex-grow hidden w-full pt-6 text-lg font-bold lg:flex lg:items-center lg:w-auto lg:pt-0"
		id="nav-content"
	>
		<ul class="items-center justify-center flex-1 text-2xl list-reset lg:flex">
			<li class="mr-3">
				<a
					href="#menus"
					class="inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline"
				>
					Menus
				</a>
			</li>
			<li class="mr-3">
				<a
					href="#gallery"
					class="inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline"
				>
					Gallery
				</a>
			</li>
			<li class="mr-3">
				<a
					href="/"
					class="inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline"
				>
					About
				</a>
			</li>
		</ul>
		<a
			class="text-2xl tomato-bg inline-block px-4 py-2 no-underline hover:text-white hover:text-grey-lighter hover:text-underline"
			href="/">Contact Us</a
		>
	</div>
</nav>

<style>
	nav {
		color: #ffff;
	}

	a:hover {
		background-position: bottom;
		background-repeat: repeat-x;
		background-size: 30%;
		border-bottom: 10;
		background-color: tomato;
		border-radius: 5px;
		padding-bottom: 0.3em;
		text-decoration: none;
	}
	.tomato-bg {
		background-color: tomato;
		border-radius: 1px;
	}
	.tomato-text {
		color: tomato;
	}
</style>
