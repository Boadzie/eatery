<script>
	import '../app.postcss';
	import Nav from '$lib/Nav.svelte';
import Footer from '$lib/Footer.svelte';
</script>

<Nav />
<main>
	<slot />
</main>
<Footer/>
<style>
	:global(body) {
		font-family: 'Nixie One', cursive;
	}
</style>
