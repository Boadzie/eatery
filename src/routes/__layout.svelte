<script>
	import '../app.postcss';
	import Nav from '$lib/Nav.svelte';
</script>

<Nav />
<main>
	<slot />
</main>

<style>
	:global(body) {
		font-family: 'Nixie One', cursive;
	}
</style>
